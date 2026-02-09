'use client';

import { motion } from 'framer-motion';
import { 
    Calendar, 
    MapPin, 
    Phone, 
    Clock, 
    Repeat, 
    Sparkles,
    CalendarPlus,
    Navigation,
    User,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui';

// ==================== MOCK DATA ====================

const MOCK_USER_DATA = {
    nextAppointment: {
        id: 1,
        salonName: 'سالن زیبایی مریم',
        serviceName: 'کاشت ناخن و پدیکور',
        date: '1404/11/25', // Future date
        time: '14:30',
        staffName: 'مونا',
        avatar: 'https://i.pravatar.cc/150?img=5',
        lat: 35.6892,
        lng: 51.3890,
        phone: '09121234567',
        address: 'تهران، خیابان ولیعصر، بالاتر از میدان ونک'
    },
    recentServices: [
        {
            id: 1,
            serviceName: 'رنگ مو',
            salonName: 'سالن زیبایی مریم',
            date: '1404/10/15',
            price: 1200000,
            image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80'
        },
        {
            id: 2,
            serviceName: 'میکاپ مجلسی',
            salonName: 'استودیو پارمیس',
            date: '1404/09/28',
            price: 2500000,
            image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80'
        }
    ],
    stats: {
        totalBookings: 12,
        loyaltyPoints: 150
    }
};

// ==================== HELPER FUNCTIONS ====================

function getTimeBasedGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'صبح بخیر';
    if (hour < 17) return 'ظهر بخیر';
    return 'عصر بخیر';
}

function calculateCountdown(dateStr: string, timeStr: string): string {
    // Mock countdown calculation
    // In production, use date-fns or similar
    return '۳ روز و ۴ ساعت';
}

function openInMaps(lat: number, lng: number) {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
}

// ==================== MAIN COMPONENT ====================

export default function CustomerDashboard({ firstName }: { firstName: string }) {
    const user = { ...MOCK_USER_DATA, firstName };
    const greeting = getTimeBasedGreeting();

    return (
        <div className="relative">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {greeting}، {user.firstName} عزیز
                </h1>
                <p className="text-white/60 text-base">
                    امروز چه کاری برای زیبایی‌ت انجام میدیم؟
                </p>
            </motion.div>

            {/* Main Grid Layout */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* Next Appointment Card (Hero) - Spans 2 cols on desktop */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2"
                >
                        {user.nextAppointment ? (
                            <div className="bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-cyan-500/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl hover:border-white/20 transition-all">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white/80 text-sm font-semibold">نوبت بعدی شما</span>
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                        </span>
                                    </div>
                                    <div className="bg-cyan-500/20 border border-cyan-500/30 px-3 py-1 rounded-full">
                                        <span className="text-cyan-300 text-xs font-bold">
                                            {calculateCountdown(user.nextAppointment.date, user.nextAppointment.time)} مانده
                                        </span>
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="flex gap-4 mb-6">
                                    {/* Staff Avatar */}
                                    <div className="flex-shrink-0">
                                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-pink-400/50">
                                            <Image
                                                src={user.nextAppointment.avatar}
                                                alt={user.nextAppointment.staffName}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-white mb-1">
                                            {user.nextAppointment.serviceName}
                                        </h3>
                                        <p className="text-pink-400 font-medium mb-2">
                                            {user.nextAppointment.salonName}
                                        </p>
                                        <div className="flex flex-wrap gap-4 text-sm text-white/60">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4 text-cyan-400" />
                                                <span>{user.nextAppointment.date}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4 text-cyan-400" />
                                                <span className="font-mono">{user.nextAppointment.time}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <User className="w-4 h-4 text-cyan-400" />
                                                <span>{user.nextAppointment.staffName}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="flex items-start gap-2 mb-6 text-white/60 text-sm">
                                    <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                                    <span>{user.nextAppointment.address}</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        onClick={() => openInMaps(user.nextAppointment!.lat, user.nextAppointment!.lng)}
                                        className="flex-1 min-w-[120px] bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                                    >
                                        <Navigation className="w-4 h-4" />
                                        مسیریابی
                                    </Button>
                                    <Button
                                        onClick={() => window.open(`tel:${user.nextAppointment!.phone}`)}
                                        className="flex-1 min-w-[120px] bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                                    >
                                        <Phone className="w-4 h-4" />
                                        تماس
                                    </Button>
                                    <Button
                                        className="flex-1 min-w-[120px] bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                                    >
                                        لغو / تغییر
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            // Empty State
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl text-center">
                                <div className="w-20 h-20 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                                    <CalendarPlus className="w-10 h-10 text-white/40" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    هیچ نوبتی فعال نیست
                                </h3>
                                <p className="text-white/60 mb-6">
                                    وقتش رسیده که به خودت برسی!
                                </p>
                                <Link href="/search">
                                    <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                                        <CalendarPlus className="w-4 h-4" />
                                        رزرو نوبت جدید
                                    </Button>
                                </Link>
                            </div>
                        )}
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                        {/* Total Bookings */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-white/60 text-xs">تعداد کل نوبت‌ها</p>
                                    <p className="text-2xl font-bold text-white">{user.stats.totalBookings}</p>
                                </div>
                            </div>
                        </div>

                        {/* Loyalty Points */}
                        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-400/30 rounded-2xl p-5 shadow-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-white/60 text-xs">امتیاز وفاداری</p>
                                    <p className="text-2xl font-bold text-yellow-400">{user.stats.loyaltyPoints} سکه</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Recent Services (Rebook Section) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Repeat className="w-5 h-5 text-pink-400" />
                            خدمات اخیر شما
                        </h2>
                        <Link href="/panel/history" className="text-cyan-400 text-sm hover:text-cyan-300 flex items-center gap-1">
                            مشاهده همه
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {user.recentServices.map((service) => (
                            <motion.div
                                key={service.id}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-lg hover:border-white/20 transition-all"
                            >
                                <div className="flex gap-4 p-4">
                                    {/* Service Image */}
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={service.image}
                                            alt={service.serviceName}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1">
                                        <h3 className="text-white font-bold mb-1">{service.serviceName}</h3>
                                        <p className="text-white/60 text-sm mb-1">{service.salonName}</p>
                                        <div className="flex items-center gap-2 text-xs text-white/50">
                                            <Calendar className="w-3 h-3" />
                                            <span>{service.date}</span>
                                        </div>
                                    </div>

                                    {/* Price & Action */}
                                    <div className="flex flex-col items-end justify-between">
                                        <span className="text-white font-bold text-sm">
                                            {new Intl.NumberFormat('fa-IR').format(service.price)} تومان
                                        </span>
                                        <Button
                                            size="sm"
                                            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0 shadow-[0_0_15px_rgba(236,72,153,0.3)] text-xs"
                                        >
                                            <Repeat className="w-3 h-3" />
                                            رزرو مجدد
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
        </div>
    );
}
