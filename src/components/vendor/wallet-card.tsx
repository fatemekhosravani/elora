'use client';

import { motion } from 'framer-motion';
import { CreditCard, TrendingUp, DollarSign } from 'lucide-react';

interface WalletCardProps {
    available: number;
    pending: number;
    onWithdraw: () => void;
}

export function WalletCard({ available, pending, onWithdraw }: WalletCardProps) {
    return (
        <div className="space-y-4">
            {/* Main Wallet Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10 shadow-2xl"
                style={{ aspectRatio: '1.586' }}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
                            backgroundSize: '40px 40px',
                        }}
                    />
                </div>

                {/* Gold Gradient Overlay */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-yellow-500/10 to-transparent rounded-full blur-3xl" />

                <div className="relative h-full p-8 flex flex-col justify-between">
                    {/* Top Section */}
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-white/50 mb-1 uppercase tracking-wider">
                                موجودی قابل برداشت
                            </p>
                            <p className="text-4xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500">
                                {available.toLocaleString('fa-IR')}
                            </p>
                            <p className="text-sm text-white/60 mt-1">تومان</p>
                        </div>

                        {/* Chip */}
                        <div className="w-12 h-10 bg-gradient-to-br from-amber-400/30 to-yellow-600/30 rounded-lg border border-amber-500/30 relative overflow-hidden">
                            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0.5 p-1">
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-amber-400/20 rounded-sm"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Middle Section - Card Number Placeholder */}
                    <div className="flex gap-4 font-mono text-lg text-white/40">
                        <span>••••</span>
                        <span>••••</span>
                        <span>••••</span>
                        <span className="text-amber-400/60">4726</span>
                    </div>

                    {/* Bottom Section */}
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-xs text-white/40 mb-1 uppercase tracking-wider">
                                دارنده کارت
                            </p>
                            <p className="text-white/90 font-medium">سالن زیبایی الورا</p>
                        </div>

                        {/* Brand Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-amber-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Glassmorphism Layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-[1px] pointer-events-none" />
            </motion.div>

            {/* Pending Funds Block */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 backdrop-blur-md"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-yellow-400/80 mb-1">در حال پردازش</p>
                        <p className="text-2xl font-bold font-mono text-yellow-400">
                            {pending.toLocaleString('fa-IR')}
                        </p>
                        <p className="text-xs text-yellow-500/60 mt-1">
                            از نوبت‌های پیش رو
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-yellow-400" />
                    </div>
                </div>
            </motion.div>

            {/* Withdraw Button */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onWithdraw}
                disabled={available === 0}
                className="w-full relative overflow-hidden rounded-xl py-4 font-bold text-lg shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group"
            >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Shine Effect */}
                <motion.div
                    animate={{
                        x: ['-200%', '200%'],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 1,
                    }}
                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                />

                <span className="relative z-10 flex items-center justify-center gap-2 text-slate-900">
                    <DollarSign className="w-5 h-5" />
                    تسویه حساب
                </span>
            </motion.button>
        </div>
    );
}
