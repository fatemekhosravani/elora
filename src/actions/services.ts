'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { BookingStatus } from '@prisma/client';

// 1. Zod Validation Schema
const ServiceFormSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    price: z.coerce.number().positive('Price must be positive'),
    depositAmount: z.coerce.number().nonnegative().optional().default(0), // Added to satisfy DB requirements
    duration: z.coerce.number().int().positive('Duration must be positive'), // durationMinutes in DB
    description: z.string().optional(),
    staffIds: z.array(z.string().cuid()).min(1, 'Select at least one staff member'),
});

export type ServiceFormData = z.infer<typeof ServiceFormSchema>;

// Helper to get authenticated Vendor ID
async function getAuthenticatedVendor() {
    const session = await getSession();

    if (!session || !session.userId) {
        throw new Error('Unauthorized');
    }

    // Find vendor owned by user
    const vendor = await prisma.vendor.findUnique({
        where: { ownerId: session.userId },
    });

    if (!vendor) {
        throw new Error('Vendor profile not found');
    }

    return vendor;
}

// A. Get Vendor Services
export async function getVendorServices() {
    try {
        const vendor = await getAuthenticatedVendor();

        const services = await prisma.service.findMany({
            where: { vendorId: vendor.id },
            include: {
                staffServices: {
                    include: {
                        staff: true, // Include staff details (name, avatar, etc.)
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return { success: true, data: services };
    } catch (error) {
        console.error('Failed to fetch services:', error);
        return { success: false, error: 'Failed to fetch services' };
    }
}

// B. Create Service
export async function createService(data: ServiceFormData) {
    const validation = ServiceFormSchema.safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten().fieldErrors };
    }

    try {
        const vendor = await getAuthenticatedVendor();
        const { name, price, depositAmount, duration, staffIds, description } = validation.data;

        await prisma.service.create({
            data: {
                name,
                description,
                price,
                depositAmount,
                durationMinutes: duration,
                vendorId: vendor.id,
                // Create relationships via pivot table
                staffServices: {
                    create: staffIds.map((staffId) => ({
                        staffId,
                    })),
                },
            },
        });

        revalidatePath('/vendor-panel/services');
        return { success: true };
    } catch (error) {
        console.error('Create Service Error:', error);
        return { success: false, error: 'Failed to create service' };
    }
}

// C. Update Service
export async function updateService(serviceId: string, data: ServiceFormData) {
    const validation = ServiceFormSchema.safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten().fieldErrors };
    }

    try {
        const vendor = await getAuthenticatedVendor();
        const { name, price, depositAmount, duration, staffIds, description } = validation.data;

        // Verify ownership
        const existingService = await prisma.service.findFirst({
            where: { id: serviceId, vendorId: vendor.id },
        });

        if (!existingService) {
            return { success: false, error: 'Service not found or unauthorized' };
        }

        await prisma.service.update({
            where: { id: serviceId },
            data: {
                name,
                description,
                price,
                depositAmount,
                durationMinutes: duration,
                // Update relationships: Delete all existing and create new ones
                staffServices: {
                    deleteMany: {}, // Removes all associations for this service
                    create: staffIds.map((staffId) => ({
                        staffId,
                    })),
                },
            },
        });

        revalidatePath('/vendor-panel/services');
        return { success: true };
    } catch (error) {
        console.error('Update Service Error:', error);
        return { success: false, error: 'Failed to update service' };
    }
}

// D. Delete Service
export async function deleteService(serviceId: string) {
    try {
        const vendor = await getAuthenticatedVendor();

        // Verify ownership
        const service = await prisma.service.findFirst({
            where: { id: serviceId, vendorId: vendor.id },
        });

        if (!service) {
            return { success: false, error: 'Service not found or unauthorized' };
        }

        // Safety Check: Active Bookings
        const activeBookingsCount = await prisma.booking.count({
            where: {
                serviceId: serviceId,
                status: {
                    in: [BookingStatus.PENDING_PAYMENT, BookingStatus.CONFIRMED],
                },
            },
        });

        if (activeBookingsCount > 0) {
            return {
                success: false,
                error: `Cannot delete service. There are ${activeBookingsCount} active bookings.`
            };
        }

        // Delete Service
        // Note: Implicitly deletes associated StaffServices due to Cascade in schema
        await prisma.service.delete({
            where: { id: serviceId },
        });

        revalidatePath('/vendor-panel/services');
        return { success: true };
    } catch (error) {
        console.error('Delete Service Error:', error);
        return { success: false, error: 'Failed to delete service' };
    }
}
