/**
 * ════════════════════════════════════
 * CUSTOMER DATA ACCESS LAYER
 * ════════════════════════════════════
 * 
 * Purpose: Data fetching for customer dashboard
 * Stack: Prisma ORM
 */

import { prisma } from '@/lib/prisma';

/**
 * Get user profile information by user ID
 */
export async function getUserProfile(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                fullName: true,
                phoneNumber: true,
                email: true,
                role: true,
            },
        });

        return user;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

/**
 * Get customer's bookings
 */
export async function getCustomerBookings(userId: string) {
    try {
        const bookings = await prisma.booking.findMany({
            where: {
                customerId: userId,
            },
            include: {
                service: {
                    select: {
                        name: true,
                        price: true,
                    },
                },
                vendor: {
                    select: {
                        name: true,
                        address: true,
                        phoneNumber: true,
                    },
                },
                staff: {
                    select: {
                        name: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: {
                startTime: 'desc',
            },
            take: 10,
        });

        return bookings;
    } catch (error) {
        console.error('Error fetching customer bookings:', error);
        return [];
    }
}

/**
 * Get customer's next upcoming appointment
 */
export async function getNextAppointment(userId: string) {
    try {
        const now = new Date();
        
        const booking = await prisma.booking.findFirst({
            where: {
                customerId: userId,
                startTime: {
                    gte: now,
                },
                status: 'CONFIRMED',
            },
            include: {
                service: {
                    select: {
                        name: true,
                        price: true,
                    },
                },
                vendor: {
                    select: {
                        name: true,
                        address: true,
                        phoneNumber: true,
                    },
                },
                staff: {
                    select: {
                        name: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: {
                startTime: 'asc',
            },
        });

        return booking;
    } catch (error) {
        console.error('Error fetching next appointment:', error);
        return null;
    }
}
