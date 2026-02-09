'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

// 1. Zod Validation Schema
const ScheduleFormSchema = z.object({
    staffId: z.string().cuid(),
    dayOfWeek: z.number().int().min(0).max(6), // 0=Sunday, ..., 6=Saturday (ISO Standard)
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
}).refine((data) => {
    const [startHour, startMin] = data.startTime.split(':').map(Number);
    const [endHour, endMin] = data.endTime.split(':').map(Number);
    const startTotal = startHour * 60 + startMin;
    const endTotal = endHour * 60 + endMin;
    return endTotal > startTotal;
}, {
    message: 'End time must be after start time',
    path: ['endTime'],
});

export type ScheduleFormData = z.infer<typeof ScheduleFormSchema>;

// Helper: Get Authenticated Vendor
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

// Helper: Verify User Owns Staff
async function verifyStaffOwnership(staffId: string, vendorId: string) {
    const staff = await prisma.staff.findFirst({
        where: { id: staffId, vendorId },
    });
    if (!staff) {
        throw new Error('Staff member not found or unauthorized');
    }
    return staff;
}

// A. Get Staff Schedule
export async function getStaffSchedule(staffId: string) {
    try {
        const vendor = await getAuthenticatedVendor();

        // Auth Check
        await verifyStaffOwnership(staffId, vendor.id);

        const schedules = await prisma.staffSchedule.findMany({
            where: { staffId },
            orderBy: { dayOfWeek: 'asc' },
        });

        return { success: true, data: schedules };
    } catch (error) {
        console.error('Fetch Schedule Error:', error);
        return { success: false, error: 'Failed to fetch schedule' };
    }
}

// B. Upsert Schedule
export async function upsertSchedule(data: ScheduleFormData) {
    const validation = ScheduleFormSchema.safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten().fieldErrors };
    }

    try {
        const vendor = await getAuthenticatedVendor();
        const { staffId, dayOfWeek, startTime, endTime } = validation.data;

        // Auth Check
        await verifyStaffOwnership(staffId, vendor.id);

        // Check if schedule exists for this day
        const existingSchedule = await prisma.staffSchedule.findFirst({
            where: {
                staffId,
                dayOfWeek,
            },
        });

        if (existingSchedule) {
            // Update
            await prisma.staffSchedule.update({
                where: { id: existingSchedule.id },
                data: {
                    startTime,
                    endTime,
                },
            });
        } else {
            // Create
            await prisma.staffSchedule.create({
                data: {
                    staffId,
                    dayOfWeek,
                    startTime,
                    endTime,
                },
            });
        }

        revalidatePath('/vendor-panel/schedule');
        return { success: true };
    } catch (error) {
        console.error('Upsert Schedule Error:', error);
        return { success: false, error: 'Failed to save schedule' };
    }
}

// C. Delete Schedule
export async function deleteSchedule(scheduleId: string) {
    try {
        const vendor = await getAuthenticatedVendor();

        // Verify ownership via nested relation
        const schedule = await prisma.staffSchedule.findUnique({
            where: { id: scheduleId },
            include: {
                staff: true,
            },
        });

        if (!schedule || schedule.staff.vendorId !== vendor.id) {
            return { success: false, error: 'Schedule not found or unauthorized' };
        }

        await prisma.staffSchedule.delete({
            where: { id: scheduleId },
        });

        revalidatePath('/vendor-panel/schedule');
        return { success: true };
    } catch (error) {
        console.error('Delete Schedule Error:', error);
        return { success: false, error: 'Failed to delete schedule' };
    }
}
