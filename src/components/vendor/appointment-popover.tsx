'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Calendar, Clock, User, MapPin, DollarSign } from 'lucide-react';
import type { Appointment } from '@/types/vendor-calendar';
import { STATUS_CONFIG } from '@/types/vendor-calendar';
import * as Popover from '@radix-ui/react-popover';

interface AppointmentPopoverProps {
    appointment: Appointment;
    open: boolean;
    onClose: () => void;
}

export function AppointmentPopover({
    appointment,
    open,
    onClose,
}: AppointmentPopoverProps) {
    const statusConfig = STATUS_CONFIG[appointment.status];
    
    return (
        <Popover.Root open={open} onOpenChange={onClose}>
            <Popover.Portal>
                <AnimatePresence>
                    {open && (
                        <Popover.Content
                            sideOffset={5}
                            className="z-50 outline-none"
                            asChild
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="w-[400px] bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
                                dir="rtl"
                            >
                                {/* Header with Gradient */}
                                <div
                                    className={`relative p-6 ${statusConfig.bg} border-b border-white/10`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10" />
                                    
                                    <div className="relative flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-white mb-2">
                                                {appointment.title}
                                            </h3>
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusConfig.text} ${statusConfig.bg} border ${statusConfig.border}`}
                                            >
                                                {statusConfig.label}
                                            </span>
                                        </div>
                                        
                                        <button
                                            onClick={onClose}
                                            className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                        >
                                            <X className="w-5 h-5 text-white" />
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Body */}
                                <div className="p-6 space-y-4">
                                    {/* Time */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-cyan-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/50">زمان</p>
                                            <p className="text-white font-mono text-sm">
                                                {new Date(appointment.start).toLocaleTimeString('fa-IR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                                {' - '}
                                                {new Date(appointment.end).toLocaleTimeString('fa-IR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Date */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/50">تاریخ</p>
                                            <p className="text-white text-sm">
                                                {new Date(appointment.start).toLocaleDateString('fa-IR')}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Client Info (if not a break) */}
                                    {appointment.status !== 'BREAK' && (
                                        <>
                                            <div className="h-px bg-white/10" />
                                            
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                                                    <User className="w-5 h-5 text-pink-400" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-white/50">مشتری</p>
                                                    <p className="text-white text-sm">{appointment.clientName}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                    <Phone className="w-5 h-5 text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-white/50">تماس</p>
                                                    <p className="text-white text-sm font-mono" dir="ltr">
                                                        {appointment.clientPhone}
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    
                                    {/* Mock Additional Details */}
                                    {appointment.status !== 'BREAK' && (
                                        <>
                                            <div className="h-px bg-white/10" />
                                            
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                                    <DollarSign className="w-5 h-5 text-emerald-400" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-white/50">هزینه</p>
                                                    <p className="text-white text-sm font-mono">
                                                        {Math.floor(Math.random() * 500 + 300)}،000 تومان
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                
                                {/* Actions */}
                                {appointment.status !== 'BREAK' && (
                                    <div className="p-6 pt-0 flex gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Phone className="w-4 h-4" />
                                            تماس
                                        </motion.button>
                                        
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-white/20"
                                        >
                                            <Calendar className="w-4 h-4" />
                                            جزئیات
                                        </motion.button>
                                    </div>
                                )}
                                
                                {/* Arrow */}
                                <Popover.Arrow className="fill-slate-900" />
                            </motion.div>
                        </Popover.Content>
                    )}
                </AnimatePresence>
            </Popover.Portal>
        </Popover.Root>
    );
}
