'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';

const phoneSchema = z.string().regex(/^09\d{9}$/, 'Invalid phone number format');

export async function sendVendorOtp(phoneNumber: string) {
    const validation = phoneSchema.safeParse(phoneNumber);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten().fieldErrors };
    }

    // Generate 5-digit code
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    try {
        await prisma.verificationCode.upsert({
            where: { phoneNumber },
            update: { code, expiresAt },
            create: { phoneNumber, code, expiresAt },
        });

        console.log('🚀 Vendor OTP SENT for', phoneNumber, ':', code);

        return { success: true, otp: code };
    } catch (error) {
        console.error('Failed to send vendor OTP:', error);
        return { success: false, error: 'Database error' };
    }
}

const verifyVendorSchema = z.object({
    phoneNumber: phoneSchema,
    code: z.string().length(5, 'Code must be 5 digits'),
});

export async function verifyVendorOtp(phoneNumber: string, code: string) {
    const validation = verifyVendorSchema.safeParse({ phoneNumber, code });

    if (!validation.success) {
        return { success: false, error: validation.error.flatten().fieldErrors };
    }

    try {
        const verificationCode = await prisma.verificationCode.findUnique({
            where: { phoneNumber },
        });

        if (!verificationCode || verificationCode.code !== code) {
            return { success: false, error: 'کد نامعتبر است' };
        }

        if (verificationCode.expiresAt < new Date()) {
            return { success: false, error: 'کد منقضی شده است' };
        }

        // Delete the used code
        await prisma.verificationCode.delete({
            where: { phoneNumber },
        });

        return { success: true };
    } catch (error) {
        console.error('Failed to verify vendor OTP:', error);
        return { success: false, error: 'Database error' };
    }
}

const registerVendorSchema = z.object({
    phoneNumber: phoneSchema,
    businessName: z.string().min(2, 'Business name too short'),
    slug: z.string().min(2, 'Slug too short'),
    category: z.string().min(2, 'Category required'),
    address: z.string().min(5, 'Address too short'),
    description: z.string().optional(),
});

export async function registerVendor(data: {
    phone: string;
    businessName: string;
    slug: string;
    category: string;
    address: string;
    description?: string;
}) {
    const validation = registerVendorSchema.safeParse({
        phoneNumber: data.phone,
        businessName: data.businessName,
        slug: data.slug,
        category: data.category,
        address: data.address,
        description: data.description,
    });

    if (!validation.success) {
        return { success: false, error: validation.error.flatten().fieldErrors };
    }

    try {
        // Check if vendor slug already exists
        const existingVendor = await prisma.vendor.findUnique({
            where: { slug: data.slug },
        });

        if (existingVendor) {
            return { success: false, error: 'این نام کاربری قبلاً استفاده شده است' };
        }

        // Create or get user
        let user = await prisma.user.findUnique({
            where: { phoneNumber: data.phone },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    phoneNumber: data.phone,
                    role: 'VENDOR_OWNER',
                },
            });
        } else {
            // Update role if needed
            if (user.role === 'CUSTOMER') {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { role: 'VENDOR_OWNER' },
                });
            }
        }

        // Create vendor
        const vendor = await prisma.vendor.create({
            data: {
                name: data.businessName,
                slug: data.slug,
                address: data.address,
                bio: data.description,
                phoneNumber: data.phone,
                ownerId: user.id,
                isActive: true,
            },
        });

        console.log('✅ Vendor registered:', vendor.id);

        return { success: true, vendorId: vendor.id };
    } catch (error) {
        console.error('Failed to register vendor:', error);
        return { success: false, error: 'خطا در ثبت نام' };
    }
}
