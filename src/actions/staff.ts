'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { BookingStatus } from '@prisma/client';

// 1. Zod Validation Schema
const StaffFormSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional().or(z.literal('')),
    avatarUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export type StaffFormData = z.infer<typeof StaffFormSchema>;

// Helper: Get authenticated Vendor
async function getAuthenticatedVendor() {
    const session = await getSession();

    if (!session || !session.userId) {
        throw new Error('Unauthorized');
    }

    const vendor = await prisma.vendor.findUnique({
        where: { ownerId: session.userId },
    });

    if (!vendor) {
        throw new Error('Vendor profile not found');
    }

    return vendor;
}

// A. Get Vendor Staff
export async function getVendorStaff() {
    try {
        const vendor = await getAuthenticatedVendor();

        const staffMembers = await prisma.staff.findMany({
            where: { vendorId: vendor.id },
            include: {
                // Include services via the pivot table
                staffServices: {
                    include: {
                        service: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return { success: true, data: staffMembers };
    } catch (error) {
        console.error('Failed to fetch staff:', error);
        return { success: false, error: 'Failed to fetch staff members' };
    }
}

// B. Create Staff
export async function createStaff(data: StaffFormData) {
    const validation = StaffFormSchema.safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten().fieldErrors };
    }

    try {
        const vendor = await getAuthenticatedVendor();
        const { name, bio, avatarUrl } = validation.data;

        await prisma.staff.create({
            data: {
                name,
                bio,
                avatarUrl,
                vendorId: vendor.id,
            },
        });

        revalidatePath('/vendor-panel/staff');
        return { success: true };
    } catch (error) {
        console.error('Create Staff Error:', error);
        return { success: false, error: 'Failed to create staff member' };
    }
}

// C. Update Staff
export async function updateStaff(staffId: string, data: StaffFormData) {
    const validation = StaffFormSchema.safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten().fieldErrors };
    }

    try {
        const vendor = await getAuthenticatedVendor();
        const { name, bio, avatarUrl } = validation.data;

        // Verify ownership
        const existingStaff = await prisma.staff.findFirst({
            where: { id: staffId, vendorId: vendor.id },
        });

        if (!existingStaff) {
            return { success: false, error: 'Staff member not found or unauthorized' };
        }

        await prisma.staff.update({
            where: { id: staffId },
            data: {
                name,
                bio,
                avatarUrl,
            },
        });

        revalidatePath('/vendor-panel/staff');
        return { success: true };
    } catch (error) {
        console.error('Update Staff Error:', error);
        return { success: false, error: 'Failed to update staff member' };
    }
}

// D. Delete Staff (With Critical Safety Check)
export async function deleteStaff(staffId: string) {
    try {
        const vendor = await getAuthenticatedVendor();

        // Verify ownership
        const staff = await prisma.staff.findFirst({
            where: { id: staffId, vendorId: vendor.id },
        });

        if (!staff) {
            return { success: false, error: 'Staff member not found or unauthorized' };
        }

        // Critical Safety Check: Future active bookings
        const futureActiveBookings = await prisma.booking.count({
            where: {
                staffId: staffId,
                startTime: { gt: new Date() }, // Future
                status: {
                    in: [BookingStatus.PENDING_PAYMENT, BookingStatus.CONFIRMED],
                },
            },
        });

        if (futureActiveBookings > 0) {
            return {
                success: false,
                error: 'Cannot delete staff with active future bookings. Please cancel or reassign them first.'
            };
        }

        // Safe to delete
        // Associated StaffServices and StaffSchedules will be deleted via Cascade in schema
        await prisma.staff.delete({
            where: { id: staffId },
        });

        revalidatePath('/vendor-panel/staff');
        return { success: true };
    } catch (error) {
        console.error('Delete Staff Error:', error);
        return { success: false, error: 'Failed to delete staff member' };
    }
}
