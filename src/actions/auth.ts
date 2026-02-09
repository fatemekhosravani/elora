'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { createSession } from '@/lib/session';
import { Role } from '@prisma/client';
import { redirect } from 'next/navigation';

const phoneSchema = z.string().regex(/^09\d{9}$/, 'Invalid phone number format');

export async function sendOtp(phoneNumber: string) {
    const validation = phoneSchema.safeParse(phoneNumber);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten().fieldErrors };
    }

    // Generate 5-digit code
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    try {
        // Save or update verification code
        await prisma.verificationCode.upsert({
            where: { phoneNumber },
            update: { code, expiresAt },
            create: { phoneNumber, code, expiresAt },
        });

        // In production, send SMS here.
        // For Dev, we log it.
        console.log('🚀 OTP SENT for', phoneNumber, ':', code);

        return { success: true, otp: code };
    } catch (error) {
        console.error('Failed to send OTP:', error);
        return { success: false, error: 'Database error' };
    }
}

const verifySchema = z.object({
    phoneNumber: phoneSchema,
    code: z.string().length(5, 'Code must be 5 digits'),
});

export async function verifyOtp(phoneNumber: string, code: string) {
    const validation = verifySchema.safeParse({ phoneNumber, code });

    if (!validation.success) {
        return { success: false, error: 'Invalid input' };
    }

    try {
        const record = await prisma.verificationCode.findUnique({
            where: { phoneNumber },
        });

        if (!record) {
            return { success: false, error: 'No OTP found for this number' };
        }

        if (record.code !== code) {
            return { success: false, error: 'Invalid OTP code' };
        }

        if (new Date() > record.expiresAt) {
            return { success: false, error: 'OTP expired' };
        }

        // OTP Valid - Find or Create User
        let user = await prisma.user.findUnique({
            where: { phoneNumber },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    phoneNumber,
                    role: Role.CUSTOMER,
                },
            });
        }

        // Create Session
        await createSession(user.id, user.role);

        // Delete used OTP
        await prisma.verificationCode.delete({
            where: { phoneNumber },
        });

        return { success: true, role: user.role };
    } catch (error) {
        console.error('Verify OTP Error:', error);
        return { success: false, error: 'Authentication failed' };
    }
}

export async function logout() {
    // We can't delete cookie from server action directly cleanly without logic in lib/session
    // But our deleteSession utility handles it.
    const { deleteSession } = await import('@/lib/session');
    await deleteSession();
    redirect('/');
}
