'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { BookingStatus, TransactionStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

/**
 * Helper: Check for booking collisions
 * Returns true if the requested slot overlaps with any active booking.
 */
async function checkCollision(startDateTime: Date, endDateTime: Date, staffId: string) {
    const count = await prisma.booking.count({
        where: {
            staffId,
            status: {
                in: [BookingStatus.PENDING_PAYMENT, BookingStatus.CONFIRMED],
            },
            // Overlap Logic: (StartA < EndB) && (EndA > StartB)
            startTime: { lt: endDateTime },
            endTime: { gt: startDateTime },
        },
    });

    return count > 0;
}

/**
 * 1. Initiate Booking
 * Creates a booking record and an associated pending transaction.
 */
export async function initiateBooking(
    serviceId: string,
    staffId: string,
    jalaliDate: string, // YYYY-MM-DD
    time: string // HH:mm
) {
    const session = await getSession();

    // 1. Auth Check
    if (!session || !session.userId) {
        throw new Error('Unauthorized. Please log in.');
    }

    // 2. Fetch Service Details
    const service = await prisma.service.findUnique({
        where: { id: serviceId },
        select: { price: true, depositAmount: true, durationMinutes: true, vendorId: true },
    });

    if (!service) {
        throw new Error('Service not found.');
    }

    // 3. Time Calculation
    // Parse Jalaali Date (e.g., "1403-12-01")
    // TODO: This currently uses Gregorian calendar. Install jalaali-js or similar for proper Jalaali support
    const [y, m, d] = jalaliDate.split('-').map(Number);
    // Month is 0-indexed in Date constructor
    const dateObj = new Date(y, m - 1, d);

    // Set Time
    const [hours, minutes] = time.split(':').map(Number);
    dateObj.setHours(hours, minutes, 0, 0);

    const startTime = dateObj;
    // Calculate End Time
    const endTime = new Date(startTime.getTime() + service.durationMinutes * 60000);

    // 4. Final Safety Check (Race Condition prevention)
    const hasCollision = await checkCollision(startTime, endTime, staffId);
    if (hasCollision) {
        throw new Error('This time slot was just taken. Please choose another.');
    }

    // 5. DB Transaction: Create Booking & Transaction
    try {
        const result = await prisma.$transaction(async (tx) => {
            // Create Booking
            const booking = await tx.booking.create({
                data: {
                    customerId: session.userId,
                    serviceId,
                    staffId,
                    vendorId: service.vendorId, // Denormalized for easier querying
                    startTime,
                    endTime,
                    totalPrice: service.price,
                    depositPaid: 0, // Will be updated on payment
                    status: BookingStatus.PENDING_PAYMENT,
                },
            });

            // Create Payment Transaction
            const transaction = await tx.transaction.create({
                data: {
                    userId: session.userId,
                    bookingId: booking.id,
                    amount: service.depositAmount,
                    status: TransactionStatus.PENDING,
                },
            });

            return { bookingId: booking.id, transactionId: transaction.id };
        });

        return { success: true, ...result };
    } catch (error) {
        console.error('Booking Initiation Error:', error);
        throw new Error('Failed to create booking.');
    }
}

/**
 * 2. Mock Payment Callback
 * Simulates a successful payment verification from a gateway (e.g., ZarinPal).
 */
export async function mockPaymentCallback(bookingId: string) {
    // In a real scenario, this endpoint would receive a token/authority from the gateway,
    // verify it via API, and then confirm.

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                transactions: {
                    where: { status: TransactionStatus.PENDING },
                    take: 1, // assumption: strictly one pending transaction per booking attempt
                },
            },
        });

        if (!booking) {
            throw new Error('Booking not found.');
        }

        if (booking.status !== BookingStatus.PENDING_PAYMENT) {
            return { success: false, message: 'Booking is already processed or cancelled.' };
        }

        const pendingTx = booking.transactions[0];
        if (!pendingTx) {
            throw new Error('No pending transaction found for this booking.');
        }

        // --- REAL PAYMENT GATEWAY VERIFICATION LOGIC WOULD GO HERE ---
        // const verification = await zarinpal.verify(amount, authority);
        // if (!verification.success) throw new Error("Payment Failed");
        // const refId = verification.refId;
        const mockRefId = Math.floor(Math.random() * 1000000000).toString();

        // DB Update
        await prisma.$transaction([
            // Update Transaction
            prisma.transaction.update({
                where: { id: pendingTx.id },
                data: {
                    status: TransactionStatus.SUCCESS,
                    trackingCode: mockRefId,
                    gatewayResponse: JSON.stringify({ message: 'Mock Success', timestamp: new Date() }),
                },
            }),
            // Update Booking
            prisma.booking.update({
                where: { id: bookingId },
                data: {
                    status: BookingStatus.CONFIRMED,
                    depositPaid: pendingTx.amount, // Record the deposit as paid
                },
            }),
        ]);

        revalidatePath('/panel/appointments');
        return { success: true, message: 'Payment Successful. Appointment Confirmed!' };
    } catch (error) {
        console.error('Payment Verification Error:', error);
        return { success: false, error: 'Payment failed or invalid booking.' };
    }
}
