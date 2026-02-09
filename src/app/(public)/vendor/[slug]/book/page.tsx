'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar as CalendarIcon,
    Clock,
    User,
    Lock,
    Sparkles,
    ChevronLeft,
    Phone,
} from 'lucide-react';

// Mock Data
const MOCK_SERVICE = {
    id: 1,
    name: 'رنگ مو حرفه‌ای',
    price: 500000,
    duration: 90,
};

const MOCK_STAFF = {
    id: 1,
    name: 'مریم احمدی',
    avatar: 'https://i.pravatar.cc/150?img=5',
    role: 'آرایشگر مو',
};

// Mock Available Dates (Next 7 days)
const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    const daysOfWeek = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push({
            id: i,
            date: date,
            dayName: daysOfWeek[date.getDay()],
            dayNumber: date.getDate(),
            monthName: date.toLocaleDateString('fa-IR', { month: 'long' }),
        });
    }
    return dates;
};

const AVAILABLE_TIMES = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00'
];

export default function BookingPage() {
    const searchParams = useSearchParams();
    const serviceId = searchParams.get('serviceId');
    const staffId = searchParams.get('staffId');

    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');

    const availableDates = generateAvailableDates();
    const depositAmount = MOCK_SERVICE.price * 0.2;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    const handleSendOTP = () => {
        if (phoneNumber.length === 11) {
            // Mock login
            setIsLoggedIn(true);
        }
    };

    const handlePayment = () => {
        alert('در حال انتقال به درگاه پرداخت...');
    };

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden" dir="rtl">
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
                    onClick={() => window.history.back()}
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="text-sm">بازگشت</span>
                </motion.button>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-[1fr,400px] gap-8">
                    {/* Left Column: Date & Time Selection */}
                    <div className="space-y-6">
                        {/* Date Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <CalendarIcon className="w-6 h-6 text-pink-400" />
                                انتخاب تاریخ
                            </h2>

                            <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
                                {availableDates.map((date, index) => (
                                    <motion.button
                                        key={date.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => setSelectedDate(date)}
                                        className={`relative p-4 rounded-2xl border backdrop-blur-xl transition-all ${
                                            selectedDate?.id === date.id
                                                ? 'bg-gradient-to-br from-pink-500/20 to-purple-600/20 border-pink-400/50 shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                    >
                                        <div className="text-center">
                                            <div className="text-xs text-white/60 mb-1">{date.dayName}</div>
                                            <div className="text-2xl font-bold text-white mb-1">{date.dayNumber}</div>
                                            <div className="text-xs text-white/60">{date.monthName}</div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Time Selection */}
                        <AnimatePresence>
                            {selectedDate && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                        <Clock className="w-6 h-6 text-cyan-400" />
                                        انتخاب ساعت
                                    </h2>

                                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                        {AVAILABLE_TIMES.map((time, index) => (
                                            <motion.button
                                                key={time}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.03 }}
                                                onClick={() => setSelectedTime(time)}
                                                className={`relative p-3 rounded-xl border backdrop-blur-xl transition-all font-mono ${
                                                    selectedTime === time
                                                        ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                }`}
                                            >
                                                <div className="text-white text-lg font-semibold">{time}</div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Column: Smart Invoice */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:sticky lg:top-4 h-fit"
                    >
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                                <div className="p-3 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-xl">
                                    <Sparkles className="w-6 h-6 text-pink-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">رزرو هوشمند</h3>
                                    <p className="text-white/60 text-xs">Smart Booking Contract</p>
                                </div>
                            </div>

                            {/* Service Info */}
                            <div className="space-y-4 mb-6">
                                <div>
                                    <div className="text-white/60 text-xs mb-1">خدمت</div>
                                    <div className="text-white font-bold text-lg">{MOCK_SERVICE.name}</div>
                                </div>

                                {/* Staff Info */}
                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-pink-400/30">
                                        <Image
                                            src={MOCK_STAFF.avatar}
                                            alt={MOCK_STAFF.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-white font-semibold">{MOCK_STAFF.name}</div>
                                        <div className="text-white/60 text-xs">{MOCK_STAFF.role}</div>
                                    </div>
                                </div>

                                {/* Selected Date & Time */}
                                <AnimatePresence>
                                    {selectedDate && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-2"
                                        >
                                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                                                <span className="text-white/60 text-sm">تاریخ</span>
                                                <span className="text-white font-semibold font-mono">
                                                    {selectedDate.dayName} {selectedDate.dayNumber} {selectedDate.monthName}
                                                </span>
                                            </div>
                                            {selectedTime && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10"
                                                >
                                                    <span className="text-white/60 text-sm">ساعت</span>
                                                    <span className="text-white font-semibold font-mono">{selectedTime}</span>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                                <div className="flex items-center justify-between text-white/80">
                                    <span className="text-sm">قیمت کل</span>
                                    <span className="font-mono font-semibold">{formatPrice(MOCK_SERVICE.price)} تومان</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-white/80">بیعانه (۲۰٪)</span>
                                    <span className="font-mono font-bold text-pink-400 text-lg">
                                        {formatPrice(depositAmount)} تومان
                                    </span>
                                </div>
                            </div>

                            {/* Auth / Payment Section */}
                            {!isLoggedIn ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-3"
                                >
                                    <div className="text-center mb-3">
                                        <div className="text-white/60 text-sm">برای ادامه وارد شوید</div>
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="شماره موبایل"
                                            maxLength={11}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pr-12 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-pink-400/50 font-mono"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSendOTP}
                                        disabled={phoneNumber.length !== 11}
                                        className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                    >
                                        ارسال کد تأیید
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onClick={handlePayment}
                                    disabled={!selectedDate || !selectedTime}
                                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] flex items-center justify-center gap-2"
                                >
                                    <Lock className="w-5 h-5" />
                                    پرداخت بیعانه و ثبت نهایی
                                </motion.button>
                            )}

                            {/* Footer Note */}
                            <div className="mt-4 text-center text-white/40 text-xs">
                                <p>مابقی هزینه در محل پرداخت می‌شود</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Add JetBrains Mono Font */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');
                
                .font-mono {
                    font-family: 'JetBrains Mono', monospace !important;
                }
            `}</style>
        </div>
    );
}
