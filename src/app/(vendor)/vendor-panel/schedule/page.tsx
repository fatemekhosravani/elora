'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Copy, Check, Calendar } from 'lucide-react';
import { DayRow } from '@/components/vendor/day-row';
import { minutesToTime, timeToMinutes } from '@/lib/time-utils';

// ==================== TYPES ====================

interface DaySchedule {
    day: string;
    dayEn: string;
    isOpen: boolean;
    start: number; // minutes from midnight
    end: number;   // minutes from midnight
}

// ==================== MOCK DATA ====================

const INITIAL_SCHEDULE: DaySchedule[] = [
    { day: 'شنبه', dayEn: 'Saturday', isOpen: true, start: 540, end: 1080 },    // 09:00 - 18:00
    { day: 'یکشنبه', dayEn: 'Sunday', isOpen: true, start: 540, end: 1080 },
    { day: 'دوشنبه', dayEn: 'Monday', isOpen: true, start: 540, end: 1080 },
    { day: 'سه‌شنبه', dayEn: 'Tuesday', isOpen: true, start: 540, end: 1080 },
    { day: 'چهارشنبه', dayEn: 'Wednesday', isOpen: true, start: 540, end: 1080 },
    { day: 'پنجشنبه', dayEn: 'Thursday', isOpen: false, start: 540, end: 1080 },
    { day: 'جمعه', dayEn: 'Friday', isOpen: false, start: 540, end: 1080 },
];

// ==================== MAIN PAGE COMPONENT ====================

export default function SchedulePage() {
    const [schedule, setSchedule] = useState<DaySchedule[]>(INITIAL_SCHEDULE);
    const [showCopySuccess, setShowCopySuccess] = useState(false);

    const handleToggleDay = (index: number) => {
        setSchedule(prev => {
            const updated = [...prev];
            updated[index].isOpen = !updated[index].isOpen;
            return updated;
        });
    };

    const handleTimeChange = (index: number, start: number, end: number) => {
        setSchedule(prev => {
            const updated = [...prev];
            updated[index].start = start;
            updated[index].end = end;
            return updated;
        });
    };

    const handleCopyToAll = () => {
        const firstDay = schedule[0];
        setSchedule(prev => prev.map(day => ({
            ...day,
            isOpen: firstDay.isOpen,
            start: firstDay.start,
            end: firstDay.end,
        })));
        
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 2000);
    };

    const openDaysCount = schedule.filter(d => d.isOpen).length;

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden" dir="rtl">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                    }}
                    transition={{ duration: 25, repeat: Infinity }}
                    className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[150px]"
                />
            </div>

            <div className="relative z-10 container mx-auto px-6 py-8 max-w-5xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mb-2">
                                قرارداد هوشمند زمان
                            </h1>
                            <p className="text-white/60">تنظیم دقیق ساعات کاری شما</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-left">
                                <p className="text-white/40 text-sm">روزهای فعال</p>
                                <p className="text-2xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                                    {openDaysCount}/7
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div>
                                    <p className="text-white/60 text-xs">مجموع ساعات</p>
                                    <p className="text-lg font-bold font-mono text-white">
                                        {schedule
                                            .filter(d => d.isOpen)
                                            .reduce((acc, d) => acc + (d.end - d.start) / 60, 0)
                                            .toFixed(1)} ساعت
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-white/60 text-xs">حالت عملیاتی</p>
                                    <p className="text-lg font-bold text-green-400">فعال</p>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCopyToAll}
                            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl p-4 font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
                        >
                            {showCopySuccess ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    کپی شد!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-5 h-5" />
                                    کپی به همه روزها
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Schedule Matrix */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl"
                >
                    <div className="space-y-4">
                        {schedule.map((day, index) => (
                            <DayRow
                                key={day.dayEn}
                                day={day}
                                index={index}
                                onToggle={handleToggleDay}
                                onTimeChange={handleTimeChange}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Save Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 flex justify-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
                    >
                        ذخیره قرارداد هوشمند
                    </motion.button>
                </motion.div>
            </div>

            {/* Success Toast */}
            <AnimatePresence>
                {showCopySuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
                    >
                        <div className="bg-green-500/90 backdrop-blur-xl border border-green-400/50 rounded-xl px-6 py-4 shadow-2xl shadow-green-500/50 flex items-center gap-3">
                            <Check className="w-6 h-6 text-white" />
                            <span className="text-white font-bold">تنظیمات به همه روزها کپی شد</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
