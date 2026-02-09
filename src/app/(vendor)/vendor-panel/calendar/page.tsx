'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { TimeGrid } from '@/components/vendor/time-grid';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import type { ViewMode, Appointment, Staff } from '@/types/vendor-calendar';
import { STATUS_CONFIG } from '@/types/vendor-calendar';

// ==================== MOCK DATA ====================

const MOCK_STAFF: Staff[] = [
    { id: '1', name: 'کیمیا خسروانی', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: '2', name: 'سارا محمدی', avatar: 'https://i.pravatar.cc/150?img=10' },
    { id: '3', name: 'مریم احمدی', avatar: 'https://i.pravatar.cc/150?img=20' },
];

const MOCK_APPOINTMENTS: Appointment[] = [
    {
        id: '1',
        title: 'کراتینه مو',
        start: '2026-02-04T10:00:00',
        end: '2026-02-04T12:00:00',
        status: 'DEPOSIT',
        staffId: '1',
        clientName: 'نازنین رضایی',
        clientPhone: '09121234567',
    },
    {
        id: '2',
        title: 'رنگ مو',
        start: '2026-02-04T14:00:00',
        end: '2026-02-04T16:30:00',
        status: 'COMPLETED',
        staffId: '1',
        clientName: 'سارا احمدی',
        clientPhone: '09129876543',
    },
    {
        id: '3',
        title: 'استراحت',
        start: '2026-02-04T12:00:00',
        end: '2026-02-04T13:00:00',
        status: 'BREAK',
        staffId: '1',
        clientName: '',
        clientPhone: '',
    },
    {
        id: '4',
        title: 'مانیکور',
        start: '2026-02-04T09:00:00',
        end: '2026-02-04T10:30:00',
        status: 'DEPOSIT',
        staffId: '2',
        clientName: 'مریم نوری',
        clientPhone: '09351234567',
    },
    {
        id: '5',
        title: 'کاشت ناخن',
        start: '2026-02-04T15:00:00',
        end: '2026-02-04T17:00:00',
        status: 'COMPLETED',
        staffId: '2',
        clientName: 'پریسا محمدی',
        clientPhone: '09191234567',
    },
];

// ==================== MAIN PAGE COMPONENT ====================

export default function CalendarPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('daily');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (!over) return;

        console.log('Dragged:', active.id, 'Over:', over.id);
        // TODO: Implement actual rescheduling logic
    };

    const goToPrevious = () => {
        if (viewMode === 'daily') {
            setCurrentDate(prev => addDays(prev, -1));
        } else {
            setCurrentDate(prev => addDays(prev, -7));
        }
    };

    const goToNext = () => {
        if (viewMode === 'daily') {
            setCurrentDate(prev => addDays(prev, 1));
        } else {
            setCurrentDate(prev => addDays(prev, 7));
        }
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden" dir="rtl">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]" />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                    }}
                    transition={{ duration: 25, repeat: Infinity }}
                    className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[150px]"
                />
            </div>

            <div className="relative z-10 container mx-auto px-6 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-2">
                                زنجیره زمان
                            </h1>
                            <p className="text-white/60">دفترچه زمانی عملیات</p>
                        </div>

                        {/* View Mode Switcher */}
                        <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl p-1.5">
                            {(['daily', 'weekly', 'staff'] as ViewMode[]).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`relative px-4 py-2 rounded-lg font-medium transition-all ${
                                        viewMode === mode
                                            ? 'text-white'
                                            : 'text-white/60 hover:text-white'
                                    }`}
                                >
                                    {viewMode === mode && (
                                        <motion.div
                                            layoutId="activeView"
                                            className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        {mode === 'daily' && <Clock className="w-4 h-4" />}
                                        {mode === 'weekly' && <Calendar className="w-4 h-4" />}
                                        {mode === 'staff' && <Users className="w-4 h-4" />}
                                        {mode === 'daily' ? 'روزانه' : mode === 'weekly' ? 'هفتگی' : 'پرسنل'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date Navigation */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={goToPrevious}
                                className="w-10 h-10 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-lg flex items-center justify-center hover:border-cyan-500/50 transition-all"
                            >
                                <ChevronRight className="w-5 h-5 text-white" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={goToToday}
                                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
                            >
                                امروز
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={goToNext}
                                className="w-10 h-10 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-lg flex items-center justify-center hover:border-cyan-500/50 transition-all"
                            >
                                <ChevronLeft className="w-5 h-5 text-white" />
                            </motion.button>
                        </div>

                        <div className="text-left">
                            <p className="text-2xl font-bold text-white font-mono">
                                {format(currentDate, 'yyyy/MM/dd')}
                            </p>
                            <p className="text-white/60 text-sm">
                                {format(currentDate, 'EEEE', { locale: faIR })}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-4 gap-4 mb-6"
                >
                    <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl p-4">
                        <p className="text-white/60 text-xs mb-1">کل نوبت‌ها</p>
                        <p className="text-2xl font-bold font-mono text-white">{appointments.length}</p>
                    </div>
                    <div className="bg-slate-900/50 backdrop-blur-md border border-yellow-500/30 rounded-xl p-4">
                        <p className="text-yellow-300/80 text-xs mb-1">بیعانه</p>
                        <p className="text-2xl font-bold font-mono text-yellow-400">
                            {appointments.filter(a => a.status === 'DEPOSIT').length}
                        </p>
                    </div>
                    <div className="bg-slate-900/50 backdrop-blur-md border border-emerald-500/30 rounded-xl p-4">
                        <p className="text-emerald-300/80 text-xs mb-1">تکمیل شده</p>
                        <p className="text-2xl font-bold font-mono text-emerald-400">
                            {appointments.filter(a => a.status === 'COMPLETED').length}
                        </p>
                    </div>
                    <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl p-4">
                        <p className="text-white/60 text-xs mb-1">درآمد امروز</p>
                        <p className="text-2xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                            2.4M
                        </p>
                    </div>
                </motion.div>

                {/* Calendar Grid */}
                <DndContext onDragEnd={handleDragEnd}>
                    <TimeGrid
                        viewMode={viewMode}
                        currentDate={currentDate}
                        appointments={appointments}
                        staff={MOCK_STAFF}
                    />
                </DndContext>
            </div>
        </div>
    );
}
