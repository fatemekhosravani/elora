'use client';

import { useState } from 'react';
import { MoreHorizontal, XCircle, AlertTriangle, CheckCircle2, Phone } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { Booking } from '@/app/(vendor)/vendor-panel/bookings/columns';

interface BookingActionsProps {
    booking: Booking;
}

export function BookingActions({ booking }: BookingActionsProps) {
    const [open, setOpen] = useState(false);

    const handleCancelBooking = () => {
        console.log('Cancel booking:', booking.id);
        // TODO: Implement actual cancel logic
        setOpen(false);
    };

    const handleMarkNoShow = () => {
        console.log('Mark no-show:', booking.id);
        // TODO: Implement actual no-show logic
        setOpen(false);
    };

    const handleManualSettle = () => {
        console.log('Manual settle:', booking.id);
        // TODO: Implement actual settle logic
        setOpen(false);
    };

    const handleCall = () => {
        console.log('Call client:', booking.clientPhone);
        setOpen(false);
    };

    return (
        <DropdownMenu.Root open={open} onOpenChange={setOpen}>
            <DropdownMenu.Trigger asChild>
                <button
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/50 transition-all group"
                    onClick={(e) => e.stopPropagation()}
                >
                    <MoreHorizontal className="w-4 h-4 text-white/60 group-hover:text-cyan-400 transition-colors" />
                </button>
            </DropdownMenu.Trigger>

            <AnimatePresence>
                {open && (
                    <DropdownMenu.Portal forceMount>
                        <DropdownMenu.Content
                            align="end"
                            sideOffset={5}
                            asChild
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.15 }}
                                className="min-w-[200px] bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl shadow-black/50 p-1.5 z-50"
                                dir="rtl"
                            >
                                {/* Call Client */}
                                {booking.status !== 'CANCELLED' && booking.status !== 'NO_SHOW' && (
                                    <DropdownMenu.Item
                                        onClick={handleCall}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cyan-500/10 hover:text-cyan-400 text-white/80 cursor-pointer transition-colors outline-none group"
                                    >
                                        <Phone className="w-4 h-4 text-cyan-400" />
                                        <span className="text-sm font-medium">تماس با مشتری</span>
                                    </DropdownMenu.Item>
                                )}

                                {/* Manual Settle */}
                                {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                                    <DropdownMenu.Item
                                        onClick={handleManualSettle}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 text-white/80 cursor-pointer transition-colors outline-none group"
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        <span className="text-sm font-medium">تسویه دستی</span>
                                    </DropdownMenu.Item>
                                )}

                                {/* Mark No-Show */}
                                {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                                    <>
                                        <div className="h-px bg-white/10 my-1.5" />
                                        <DropdownMenu.Item
                                            onClick={handleMarkNoShow}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-orange-500/10 hover:text-orange-400 text-white/80 cursor-pointer transition-colors outline-none group"
                                        >
                                            <AlertTriangle className="w-4 h-4 text-orange-400" />
                                            <span className="text-sm font-medium">ثبت غیبت</span>
                                        </DropdownMenu.Item>
                                    </>
                                )}

                                {/* Cancel Booking */}
                                {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && (
                                    <>
                                        <div className="h-px bg-white/10 my-1.5" />
                                        <DropdownMenu.Item
                                            onClick={handleCancelBooking}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-white/80 cursor-pointer transition-colors outline-none group"
                                        >
                                            <XCircle className="w-4 h-4 text-red-400" />
                                            <span className="text-sm font-medium">لغو رزرو</span>
                                        </DropdownMenu.Item>
                                    </>
                                )}

                                {/* No Actions Available */}
                                {booking.status === 'COMPLETED' && (
                                    <div className="px-3 py-2.5 text-center">
                                        <p className="text-xs text-white/40">رزرو تکمیل شده است</p>
                                    </div>
                                )}
                                {booking.status === 'CANCELLED' && (
                                    <div className="px-3 py-2.5 text-center">
                                        <p className="text-xs text-white/40">رزرو لغو شده است</p>
                                    </div>
                                )}
                            </motion.div>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                )}
            </AnimatePresence>
        </DropdownMenu.Root>
    );
}
