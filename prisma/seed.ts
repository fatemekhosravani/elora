/**
 * ════════════════════════════════════
 * ELORA DATABASE SEEDING SCRIPT
 * ════════════════════════════════════
 * 
 * Purpose: Populate the database with realistic mock data
 * Stack: Prisma ORM + @faker-js/faker
 * 
 * Run with:
 *   npx prisma db seed
 * 
 * Or manually:
 *   npx ts-node prisma/seed.ts
 */

import { PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// ==================== CONFIGURATION ====================

const CONFIG = {
    VENDORS_COUNT: 10,
    CUSTOMERS_COUNT: 20,
    STAFF_PER_VENDOR: [3, 5] as [number, number], // Min-Max
    SERVICES_PER_VENDOR: [5, 8] as [number, number], // Min-Max
};

// ==================== PERSIAN DATA ====================

const PERSIAN_NAMES = {
    FEMALE: [
        'نازنین', 'سارا', 'مریم', 'فاطمه', 'زهرا', 'لیلا', 'مینا', 'پریسا',
        'شیرین', 'نرگس', 'ریحانه', 'مهسا', 'آیدا', 'الهام', 'سمیرا', 'هانیه',
    ],
    LAST: [
        'رضایی', 'احمدی', 'محمدی', 'حسینی', 'موسوی', 'کریمی', 'رستمی', 'نوری',
        'قاسمی', 'یزدانی', 'صادقی', 'جعفری', 'طاهری', 'امینی', 'کاظمی', 'باقری',
    ],
};

const SALON_NAMES = [
    'سالن زیبایی رز', 'آرایشگاه لیلیوم', 'کلینیک زیبایی پارسا', 'سالن هنر مو',
    'آرایشگاه ونوس', 'سالن زیبایی نیلوفر', 'کلینیک آرایشی ماهور', 'سالن گلاره',
    'آرایشگاه شهرزاد', 'سالن زیبایی یاسمن', 'کلینیک رویال', 'سالن دیانا',
];

const TEHRAN_DISTRICTS = [
    'سعادت آباد', 'ولنجک', 'نیاوران', 'اقدسیه', 'فرمانیه', 'جردن',
    'الهیه', 'زعفرانیه', 'پاسداران', 'شمیران', 'ونک', 'تجریش',
];

const SERVICE_CATALOG = [
    { name: 'کوتاهی مو', price: [150000, 250000] as [number, number], duration: [45, 60] as [number, number] },
    { name: 'رنگ مو کامل', price: [600000, 900000] as [number, number], duration: [120, 180] as [number, number] },
    { name: 'هایلایت مو', price: [700000, 1000000] as [number, number], duration: [150, 210] as [number, number] },
    { name: 'فر مو', price: [500000, 800000] as [number, number], duration: [90, 150] as [number, number] },
    { name: 'کراتینه مو', price: [800000, 1200000] as [number, number], duration: [120, 180] as [number, number] },
    { name: 'بوتاکس مو', price: [700000, 1100000] as [number, number], duration: [90, 120] as [number, number] },
    { name: 'اکستنشن مو', price: [1500000, 2500000] as [number, number], duration: [180, 240] as [number, number] },
    { name: 'مانیکور ژلیش', price: [250000, 350000] as [number, number], duration: [60, 90] as [number, number] },
    { name: 'پدیکور ژلیش', price: [280000, 380000] as [number, number], duration: [75, 105] as [number, number] },
    { name: 'کاشت ناخن', price: [400000, 600000] as [number, number], duration: [90, 120] as [number, number] },
    { name: 'میکاپ روزانه', price: [400000, 700000] as [number, number], duration: [60, 90] as [number, number] },
    { name: 'میکاپ مجلسی', price: [1000000, 1500000] as [number, number], duration: [90, 120] as [number, number] },
    { name: 'اصلاح صورت', price: [150000, 250000] as [number, number], duration: [30, 45] as [number, number] },
    { name: 'پاکسازی پوست', price: [250000, 400000] as [number, number], duration: [60, 90] as [number, number] },
    { name: 'ماساژ صورت', price: [300000, 500000] as [number, number], duration: [45, 60] as [number, number] },
    { name: 'لیزر موهای زائد', price: [800000, 1200000] as [number, number], duration: [60, 90] as [number, number] },
    { name: 'کاشت مژه', price: [600000, 900000] as [number, number], duration: [90, 120] as [number, number] },
    { name: 'لیفت مژه', price: [350000, 450000] as [number, number], duration: [45, 60] as [number, number] },
    { name: 'رنگ ابرو', price: [200000, 300000] as [number, number], duration: [30, 45] as [number, number] },
    { name: 'میکرو بلیدینگ', price: [1200000, 1800000] as [number, number], duration: [120, 150] as [number, number] },
];

// ==================== HELPER FUNCTIONS ====================

function generateSlug(name: string): string {
    const translations: { [key: string]: string } = {
        'ا': 'a', 'آ': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's', 'ج': 'j',
        'چ': 'ch', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z',
        'ژ': 'zh', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z',
        'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'gh', 'ک': 'k', 'گ': 'g', 'ل': 'l',
        'م': 'm', 'ن': 'n', 'و': 'v', 'ه': 'h', 'ی': 'y', ' ': '-',
    };

    let slug = name.toLowerCase();
    for (const [persian, english] of Object.entries(translations)) {
        slug = slug.replace(new RegExp(persian, 'g'), english);
    }
    
    slug = slug.replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
    return slug + '-' + faker.string.alphanumeric(4).toLowerCase();
}

function randomPersianName(): string {
    const firstName = faker.helpers.arrayElement(PERSIAN_NAMES.FEMALE);
    const lastName = faker.helpers.arrayElement(PERSIAN_NAMES.LAST);
    return `${firstName} ${lastName}`;
}

function randomPhoneNumber(prefix: string = '0912'): string {
    return prefix + faker.string.numeric(7);
}

function randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ==================== MAIN SEEDING FUNCTION ====================

async function main() {
    console.log('🌱 Starting comprehensive seed...\n');

    // 1. Clean up existing data
    console.log('🧹 Cleaning database...');
    await prisma.transaction.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.staffSchedule.deleteMany();
    await prisma.staffService.deleteMany();
    await prisma.staff.deleteMany();
    await prisma.service.deleteMany();
    await prisma.vendor.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Database cleaned\n');

    // 2. Create Super Admin (Upsert - Safe for re-runs)
    console.log('🔐 Creating Super Admin...');
    const superAdmin = await prisma.user.upsert({
        where: { phoneNumber: '09385005077' },
        update: {
            role: Role.ADMIN,
            fullName: 'Elora Admin',
        },
        create: {
            phoneNumber: '09385005077',
            fullName: 'Elora Admin',
            role: Role.ADMIN,
        },
    });
    console.log(`✅ Super Admin: ${superAdmin.fullName} (${superAdmin.phoneNumber})\n`);

    // 3. Create Regular Customers
    console.log(`👤 Creating ${CONFIG.CUSTOMERS_COUNT} customers...`);
    const customers = [];
    for (let i = 0; i < CONFIG.CUSTOMERS_COUNT; i++) {
        const customer = await prisma.user.create({
            data: {
                phoneNumber: randomPhoneNumber('0912'),
                fullName: randomPersianName(),
                role: Role.CUSTOMER,
            },
        });
        customers.push(customer);
    }
    console.log(`✅ Created ${customers.length} customers\n`);

    // 4. Create Vendors with Services, Staff, and Schedules
    console.log(`🏪 Creating ${CONFIG.VENDORS_COUNT} vendors...\n`);
    
    for (let v = 0; v < CONFIG.VENDORS_COUNT; v++) {
        const salonName = SALON_NAMES[v] || `${faker.helpers.arrayElement(SALON_NAMES)} ${v + 1}`;
        const district = faker.helpers.arrayElement(TEHRAN_DISTRICTS);
        const city = faker.helpers.arrayElement(['تهران', 'کرج']);
        
        // Create Vendor Owner
        const vendorOwner = await prisma.user.create({
            data: {
                phoneNumber: randomPhoneNumber('0911'),
                fullName: randomPersianName(),
                role: Role.VENDOR_OWNER,
            },
        });

        // Create Vendor
        const vendor = await prisma.vendor.create({
            data: {
                name: salonName,
                slug: generateSlug(salonName),
                address: `${city}، ${district}`,
                bio: `یکی از بهترین سالن‌های زیبایی ${city} با خدمات حرفه‌ای`,
                ownerId: vendorOwner.id,
            },
        });

        console.log(`  📍 [${v + 1}/${CONFIG.VENDORS_COUNT}] ${vendor.name} (${vendor.address})`);

        // Create Services for this Vendor
        const servicesCount = randomBetween(...CONFIG.SERVICES_PER_VENDOR);
        const selectedServices = faker.helpers.arrayElements(SERVICE_CATALOG, servicesCount);
        const services = [];

        for (const serviceDef of selectedServices) {
            const price = randomBetween(...serviceDef.price);
            const service = await prisma.service.create({
                data: {
                    name: serviceDef.name,
                    price,
                    depositAmount: Math.floor(price * 0.25), // 25% deposit
                    durationMinutes: randomBetween(...serviceDef.duration),
                    vendorId: vendor.id,
                },
            });
            services.push(service);
        }
        console.log(`    💅 Created ${services.length} services`);

        // Create Staff for this Vendor
        const staffCount = randomBetween(...CONFIG.STAFF_PER_VENDOR);
        const staffMembers = [];

        for (let s = 0; s < staffCount; s++) {
            const staff = await prisma.staff.create({
                data: {
                    name: randomPersianName(),
                    bio: faker.helpers.arrayElement([
                        'متخصص رنگ و مش مو',
                        'کارشناس پوست و زیبایی',
                        'استاد ناخن و طراحی',
                        'آرایشگر حرفه‌ای',
                        'متخصص میکاپ',
                    ]),
                    vendorId: vendor.id,
                },
            });
            staffMembers.push(staff);

            // Assign 2-4 random services to this staff
            const assignedServices = faker.helpers.arrayElements(
                services,
                randomBetween(2, Math.min(4, services.length))
            );

            for (const service of assignedServices) {
                await prisma.staffService.create({
                    data: {
                        staffId: staff.id,
                        serviceId: service.id,
                    },
                });
            }

            // Create Weekly Schedule (Sat-Thu: 10:00-18:00)
            for (let day = 6; day >= 2; day--) { // 6=Sat to 2=Thu (ISO-8601)
                await prisma.staffSchedule.create({
                    data: {
                        staffId: staff.id,
                        dayOfWeek: day,
                        startTime: '10:00',
                        endTime: '18:00',
                    },
                });
            }
        }
        console.log(`    👩‍💼 Created ${staffMembers.length} staff with schedules`);
        console.log('');
    }

    console.log('✅ Seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   • Super Admin: 1`);
    console.log(`   • Customers: ${CONFIG.CUSTOMERS_COUNT}`);
    console.log(`   • Vendors: ${CONFIG.VENDORS_COUNT}`);
    console.log(`   • Services: ~${CONFIG.VENDORS_COUNT * 6} (avg)`);
    console.log(`   • Staff: ~${CONFIG.VENDORS_COUNT * 4} (avg)`);
    console.log('\n🚀 Database is ready for development!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
