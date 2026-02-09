'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TimeSlider } from './time-slider';
import { minutesToTime } from '@/lib/time-utils';

interface DaySchedule {
    day: string;
    dayEn: string;
    isOpen: boolean;
    start: number;
    end: number;
}

interface DayRowProps {
    day: DaySchedule;
    index: number;
    onToggle: (index: number) => void;
    onTimeChange: (index: number, start: number, end: number) => void;
}

export function DayRow({ day, index, onToggle, onTimeChange }: DayRowProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`relative rounded-xl border transition-all duration-300 ${
                day.isOpen 
                    ? 'bg-slate-900/50 border-white/10 hover:border-purple-500/50' 
                    : 'bg-slate-900/20 border-white/5'
            }`}
        >
            <div className={`p-5 ${!day.isOpen ? 'opacity-50 grayscale' : ''}`}>
                <div className="flex items-center gap-6">
                    {/* Day Name */}
                    <div className="w-24 flex-shrink-0">
                        <p className="text-white font-bold text-lg">{day.day}</p>
                        <p className="text-white/40 text-xs font-mono">{day.dayEn}</p>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex-shrink-0">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onToggle(index)}
                            className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                                day.isOpen 
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/50' 
                                    : 'bg-slate-700'
                            }`}
                        >
                            <motion.div
                                animate={{ x: day.isOpen ? 0 : 32 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center"
                            >
                                <div className={`w-2 h-2 rounded-full ${day.isOpen ? 'bg-green-500' : 'bg-slate-400'}`} />
                            </motion.div>
                        </motion.button>
                    </div>

                    {/* Time Display & Slider */}
                    <div className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                            {day.isOpen ? (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    {/* Time Display */}
                                    <div className="flex items-center justify-between mb-3" dir="ltr">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-white/60">Start</span>
                                            <span className="text-lg font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                                                {minutesToTime(day.start)}
                                            </span>
                                        </div>
                                        <div className="w-px h-6 bg-white/10" />
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                                                {minutesToTime(day.end)}
                                            </span>
                                            <span className="text-xs text-white/60">End</span>
                                        </div>
                                    </div>

                                    {/* Time Slider */}
                                    <TimeSlider
                                        start={day.start}
                                        end={day.end}
                                        onChange={(start: number, end: number) => onTimeChange(index, start, end)}
                                    />

                                    {/* Duration Display */}
                                    <div className="mt-3 flex items-center justify-between text-xs" dir="ltr">
                                        <span className="text-white/40">00:00</span>
                                        <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                                            <span className="text-purple-300 font-mono">
                                                Duration: {((day.end - day.start) / 60).toFixed(1)}h
                                            </span>
                                        </div>
                                        <span className="text-white/40">24:00</span>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center py-2"
                                >
                                    <span className="text-white/40 text-sm">تعطیل</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Glow Effect on Hover (Only when open) */}
            {day.isOpen && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl" />
            )}
        </motion.div>
    );
}
