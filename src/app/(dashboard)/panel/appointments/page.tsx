'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, User, CreditCard, Star, RefreshCw, X, Eye, CalendarPlus } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

// ==================== TYPES ====================

type AppointmentStatus = 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
type TabType = 'upcoming' | 'history';

interface Appointment {
    id: string;
    date: string; // ISO format
    time: string;
    salonName: string;
    salonSlug: string;
    serviceName: string;
    staffName: string;
    staffAvatar?: string;
    price: number;
    status: AppointmentStatus;
    address: string;
}

// ==================== MOCK DATA ====================

const MOCK_APPOINTMENTS: Appointment[] = [
    {
        id: '1',
        date: '2026-02-15',
        time: '14:00',
        salonName: 'سالن رز طلایی',
        salonSlug: 'salon-roz-talaei',
        serviceName: 'کراتینه مو + کوتاهی',
        staffName: 'کیمیا خسروانی',
        price: 2500000,
        status: 'CONFIRMED',
        address: 'سعادت آباد، خیابان سرو غربی'
    },
    {
        id: '2',
        date: '2026-02-08',
        time: '10:30',
        salonName: 'آرایشگاه نگین',
        salonSlug: 'salon-negin',
        serviceName: 'مانیکور ژله‌ای',
        staffName: 'سارا احمدی',
        price: 450000,
        status: 'PENDING',
        address: 'ولنجک، خیابان فرمانیه'
    },
    {
        id: '3',
        date: '2026-02-20',
        time: '16:00',
        salonName: 'استودیو پارمیس',
        salonSlug: 'studio-parmis',
        serviceName: 'میکاپ مهمانی',
        staffName: 'پارمیس رضایی',
        price: 3500000,
        status: 'CONFIRMED',
        address: 'فرمانیه، نبش کوچه نهم'
    },
    {
        id: '4',
        date: '2026-01-28',
        time: '11:00',
        salonName: 'کلینیک زیبایی آریا',
        salonSlug: 'clinic-arya',
        serviceName: 'لیزر موهای زائد',
        staffName: 'دکتر مینا کریمی',
        price: 1200000,
        status: 'COMPLETED',
        address: 'نیاوران، میدان قدس'
    },
    {
        id: '5',
        date: '2026-01-20',
        time: '15:30',
        salonName: 'سالن پارسا',
        salonSlug: 'salon-parsa',
        serviceName: 'رنگ و مش مو',
        staffName: 'نیلوفر محمدی',
        price: 1800000,
        status: 'COMPLETED',
        address: 'کرج، گوهردشت'
    },
    {
        id: '6',
        date: '2026-01-15',
        time: '09:00',
        salonName: 'استودیو مارال',
        salonSlug: 'studio-maral',
        serviceName: 'اکستنشن مژه',
        staffName: 'مارال صادقی',
        price: 950000,
        status: 'CANCELLED',
        address: 'تهران، آجودانیه'
    },
    {
        id: '7',
        date: '2026-01-10',
        time: '13:00',
        salonName: 'سالن الماس',
        salonSlug: 'salon-almas',
        serviceName: 'فیشیال پوست',
        staffName: 'الهه رحمانی',
        price: 800000,
        status: 'COMPLETED',
        address: 'تهران، زعفرانیه'
    }
];

// ==================== HELPER FUNCTIONS ====================

function getStatusBadge(status: AppointmentStatus): { label: string; className: string } {
    const badges = {
        CONFIRMED: {
            label: 'تأیید شده',
            className: 'bg-green-100 text-green-700 border border-green-200'
        },
        PENDING: {
            label: 'در انتظار پرداخت',
            className: 'bg-amber-100 text-amber-700 border border-amber-200'
        },
        COMPLETED: {
            label: 'انجام شده',
            className: 'bg-gray-100 text-gray-600 border border-gray-200'
        },
        CANCELLED: {
            label: 'لغو شده',
            className: 'bg-red-50 text-red-600 border border-red-100'
        }
    };
    return badges[status];
}

function formatDate(dateString: string): { day: string; month: string } {
    const date = new Date(dateString);
    const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    return {
        day: date.getDate().toString(),
        month: months[date.getMonth()]
    };
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
}

// ==================== APPOINTMENT CARD COMPONENT ====================

function AppointmentCard({ appointment }: { appointment: Appointment }) {
    const { day, month } = formatDate(appointment.date);
    const badge = getStatusBadge(appointment.status);

    const handleRate = () => {
        alert('پنل ثبت نظر در نسخه بعدی اضافه می‌شود');
    };

    const handleCancel = () => {
        if (confirm('آیا مطمئن هستید که می‌خواهید این نوبت را لغو کنید؟')) {
            alert('نوبت لغو شد');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]"
        >
            {/* Desktop Layout */}
            <div className="hidden md:flex items-center gap-6 p-6">
                {/* Date Box */}
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl flex flex-col items-center justify-center border border-white/10">
                    <span className="text-2xl font-bold text-white">{day}</span>
                    <span className="text-xs text-white/70">{month}</span>
                </div>

                {/* Details */}
                <div className="flex-grow space-y-2">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-white">{appointment.salonName}</h3>
                            <p className="text-sm text-white/60">{appointment.serviceName}</p>
                        </div>
                        <span className={clsx('px-3 py-1 rounded-full text-xs font-medium', badge.className)}>
                            {badge.label}
                        </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-white/50">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{appointment.staffName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="line-clamp-1">{appointment.address}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-white/50" />
                        <span className="text-sm font-semibold text-white">{formatPrice(appointment.price)}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex flex-col gap-2">
                    {appointment.status === 'PENDING' && (
                        <button className="relative px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-pink-500/25">
                            <span className="relative z-10">پرداخت بیعانه</span>
                            <span className="absolute inset-0 rounded-lg bg-white/20 animate-pulse"></span>
                        </button>
                    )}

                    {appointment.status === 'CONFIRMED' && (
                        <>
                            <Link
                                href={`/panel/appointments/${appointment.id}`}
                                className="px-6 py-2.5 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all text-center flex items-center justify-center gap-2"
                            >
                                <Eye className="w-4 h-4" />
                                مشاهده جزئیات
                            </Link>
                            <button
                                onClick={handleCancel}
                                className="px-6 py-2.5 border border-red-400/50 text-red-400 rounded-lg font-medium hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                لغو نوبت
                            </button>
                        </>
                    )}

                    {appointment.status === 'COMPLETED' && (
                        <>
                            <button
                                onClick={handleRate}
                                className="px-6 py-2.5 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Star className="w-4 h-4" />
                                ثبت نظر
                            </button>
                            <Link
                                href={`/vendor/${appointment.salonSlug}/book`}
                                className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all text-center flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                رزرو مجدد
                            </Link>
                        </>
                    )}

                    {appointment.status === 'CANCELLED' && (
                        <Link
                            href={`/vendor/${appointment.salonSlug}/book`}
                            className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all text-center flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            رزرو مجدد
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden p-5 space-y-4">
                {/* Header: Date & Status */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl flex flex-col items-center justify-center border border-white/10">
                            <span className="text-xl font-bold text-white">{day}</span>
                            <span className="text-xs text-white/70">{month}</span>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white">{appointment.salonName}</h3>
                            <p className="text-xs text-white/60">{appointment.serviceName}</p>
                        </div>
                    </div>
                    <span className={clsx('px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap', badge.className)}>
                        {badge.label}
                    </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-white/50">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{appointment.staffName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{appointment.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span className="font-semibold text-white">{formatPrice(appointment.price)}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                    {appointment.status === 'PENDING' && (
                        <button className="w-full relative min-h-[44px] px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg">
                            <span className="relative z-10">پرداخت بیعانه</span>
                            <span className="absolute inset-0 rounded-lg bg-white/20 animate-pulse"></span>
                        </button>
                    )}

                    {appointment.status === 'CONFIRMED' && (
                        <>
                            <Link
                                href={`/panel/appointments/${appointment.id}`}
                                className="w-full min-h-[44px] px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Eye className="w-4 h-4" />
                                مشاهده جزئیات
                            </Link>
                            <button
                                onClick={handleCancel}
                                className="w-full min-h-[44px] px-6 py-3 border border-red-400/50 text-red-400 rounded-lg font-medium hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                لغو نوبت
                            </button>
                        </>
                    )}

                    {appointment.status === 'COMPLETED' && (
                        <>
                            <button
                                onClick={handleRate}
                                className="w-full min-h-[44px] px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Star className="w-4 h-4" />
                                ثبت نظر
                            </button>
                            <Link
                                href={`/vendor/${appointment.salonSlug}/book`}
                                className="w-full min-h-[44px] px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                رزرو مجدد
                            </Link>
                        </>
                    )}

                    {appointment.status === 'CANCELLED' && (
                        <Link
                            href={`/vendor/${appointment.salonSlug}/book`}
                            className="w-full min-h-[44px] px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            رزرو مجدد
                        </Link>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// ==================== EMPTY STATE COMPONENT ====================

function EmptyState({ tab }: { tab: TabType }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center py-20 px-4"
        >
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <Calendar className="w-12 h-12 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
                {tab === 'upcoming' ? 'هیچ نوبت فعالی ندارید' : 'هنوز نوبتی رزرو نکرده‌اید'}
            </h3>
            <p className="text-white/60 mb-6 text-center max-w-md">
                {tab === 'upcoming' 
                    ? 'برای رزرو وقت جدید، سالن مورد نظر خود را جستجو کنید'
                    : 'با رزرو اولین نوبت خود، تاریخچه نوبت‌های شما اینجا نمایش داده می‌شود'
                }
            </p>
            {tab === 'upcoming' && (
                <Link
                    href="/search"
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2"
                >
                    <CalendarPlus className="w-5 h-5" />
                    رزرو وقت جدید
                </Link>
            )}
        </motion.div>
    );
}

// ==================== MAIN PAGE COMPONENT ====================

export default function AppointmentsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('upcoming');

    // Filter appointments based on tab
    const now = new Date();
    const filteredAppointments = MOCK_APPOINTMENTS.filter(apt => {
        const aptDate = new Date(apt.date);
        if (activeTab === 'upcoming') {
            return (aptDate >= now || apt.status === 'PENDING') && apt.status !== 'COMPLETED' && apt.status !== 'CANCELLED';
        } else {
            return aptDate < now || apt.status === 'COMPLETED' || apt.status === 'CANCELLED';
        }
    });

    return (
        <div className="relative" dir="rtl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">نوبت‌های من</h1>
                <p className="text-white/60">مشاهده و مدیریت نوبت‌های رزرو شده</p>
            </div>

                {/* Tabs */}
                <div className="sticky top-4 z-20 mb-8 bg-white/5 backdrop-blur-xl rounded-2xl p-1.5 border border-white/10 inline-flex gap-1">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className="relative px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                        {activeTab === 'upcoming' && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className={clsx(
                            'relative z-10 transition-colors',
                            activeTab === 'upcoming' ? 'text-white' : 'text-white/60'
                        )}>
                            نوبت‌های آتی
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('history')}
                        className="relative px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                        {activeTab === 'history' && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className={clsx(
                            'relative z-10 transition-colors',
                            activeTab === 'history' ? 'text-white' : 'text-white/60'
                        )}>
                            تاریخچه
                        </span>
                    </button>
                </div>

                {/* Appointments List */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
                        {filteredAppointments.length > 0 ? (
                            filteredAppointments.map(apt => (
                                <AppointmentCard key={apt.id} appointment={apt} />
                            ))
                        ) : (
                            <EmptyState tab={activeTab} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
    );
}
