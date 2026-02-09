import prisma from '@/lib/prisma';
import { timeToMinutes, minutesToTime, isOverlapping } from './time-utils';
import { startOfDay, endOfDay } from 'date-fns';
import { BookingStatus } from '@prisma/client';

/**
 * Calculates available time slots for a staff member on a specific Jalaali date.
 * @param staffId - The ID of the staff member
 * @param serviceDuration - Duration of the service in minutes
 * @param jalaliDate - Date string in "YYYY-MM-DD" format (e.g., "1402-12-01")
 * @returns Array of available start times (e.g., ["10:00", "10:30"])
 */
export async function getAvailableSlots(
    staffId: string,
    serviceDuration: number,
    jalaliDate: string
): Promise<string[]> {
    // 1. Parse Date
    // TODO: This currently uses Gregorian calendar. Install jalaali-js or similar for proper Jalaali support
    const [y, m, d] = jalaliDate.split('-').map(Number);
    const targetDate = new Date(y, m - 1, d); // Month is 0-indexed in JS Date

    // Determine Day of Week (0=Sunday, 6=Saturday)
    // Note: date.getDay() follows this standard.
    const dayOfWeek = targetDate.getDay();

    // Define Day Range for DB Query
    const dayStart = startOfDay(targetDate);
    const dayEnd = endOfDay(targetDate);

    // 2. Fetch Data (Schedule + Bookings)
    const [schedule, bookings] = await Promise.all([
        // Fetch Working Hours
        prisma.staffSchedule.findFirst({
            where: {
                staffId,
                dayOfWeek,
            },
        }),
        // Fetch Active Bookings for this day
        prisma.booking.findMany({
            where: {
                staffId,
                startTime: {
                    gte: dayStart,
                    lt: dayEnd,
                },
                status: {
                    notIn: [BookingStatus.CANCELLED_BY_USER, BookingStatus.CANCELLED_BY_VENDOR],
                },
            },
            select: {
                startTime: true,
                endTime: true,
            },
        }),
    ]);

    // If no schedule for this day, return empty
    if (!schedule) {
        return [];
    }

    // 3. Slot Generation
    const workStartMins = timeToMinutes(schedule.startTime);
    const workEndMins = timeToMinutes(schedule.endTime);

    // Convert bookings to minutes relative to the target day start
    // Note: We used dayStart (midnight) as the reference.
    const busySlots = bookings.map((booking) => {
        // Calculate minutes from the start of the day
        // We assume backend/DB handles timezone correctly so difference in ms represents actual time diff
        const startDiffMs = booking.startTime.getTime() - dayStart.getTime();
        const endDiffMs = booking.endTime.getTime() - dayStart.getTime();

        return {
            start: Math.floor(startDiffMs / 60000),
            end: Math.floor(endDiffMs / 60000),
        };
    });

    const availableSlots: string[] = [];
    const step = 30; // 30-minute intervals for flexibility

    // Loop through the working day
    let currentPointer = workStartMins;

    // We loop until the service can no longer fit before the work day ends
    while (currentPointer + serviceDuration <= workEndMins) {
        const slotStart = currentPointer;
        const slotEnd = currentPointer + serviceDuration;

        // Check collision with ANY booking
        const hasCollision = busySlots.some((booking) =>
            isOverlapping(slotStart, slotEnd, booking.start, booking.end)
        );

        if (!hasCollision) {
            availableSlots.push(minutesToTime(slotStart));
        }

        // Move next
        currentPointer += step;
    }

    return availableSlots;
}
