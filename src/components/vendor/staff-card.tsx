'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Activity, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { PerformanceSparkline } from './performance-sparkline';
import type { StaffMember } from '@/app/(vendor)/vendor-panel/mock-data';

interface StaffCardProps {
    staff: StaffMember;
}

export function StaffCard({ staff }: StaffCardProps) {
    const [hasAccess, setHasAccess] = useState(staff.hasFinanceAccess);
    const [isToggling, setIsToggling] = useState(false);

    // Determine load color
    const getLoadColor = (load: number) => {
        if (load >= 80) return 'from-red-500 to-orange-500';
        if (load >= 50) return 'from-yellow-500 to-orange-500';
        return 'from-green-500 to-emerald-500';
    };

    const getLoadTextColor = (load: number) => {
        if (load >= 80) return 'text-red-400';
        if (load >= 50) return 'text-yellow-400';
        return 'text-green-400';
    };

    const handleToggleAccess = async () => {
        setIsToggling(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setHasAccess(!hasAccess);
        setIsToggling(false);
    };

    // Calculate performance trend
    const performanceTrend = staff.performanceData.length >= 2 
        ? staff.performanceData[staff.performanceData.length - 1].value - staff.performanceData[staff.performanceData.length - 2].value
        : 0;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="group relative overflow-hidden rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/10 hover:border-cyan-500/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]"
        >
            <div className="p-6" dir="rtl">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-6">
                    {/* Avatar & Info */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/20">
                                <Image
                                    src={staff.avatar}
                                    alt={staff.name}
                                    width={64}
                                    height={64}
                                    className="object-cover"
                                />
                            </div>
                            {/* Online Indicator */}
                            <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-green-500 border-2 border-slate-900 rounded-full shadow-lg shadow-green-500/50" />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">{staff.name}</h3>
                            <p className="text-white/60 text-sm">{staff.role}</p>
                            
                            {/* Performance Badge */}
                            <div className="flex items-center gap-1 mt-2">
                                <Activity className="w-3 h-3 text-cyan-400" />
                                <span className="text-xs text-cyan-400 font-mono">NODE-{staff.id}</span>
                            </div>
                        </div>
                    </div>

                    {/* Access Control Toggle */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleToggleAccess}
                        disabled={isToggling}
                        className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                            hasAccess 
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50' 
                                : 'bg-white/10'
                        }`}
                    >
                        <motion.div
                            animate={{ x: hasAccess ? 0 : 28 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center"
                        >
                            {hasAccess ? (
                                <Unlock className="w-3 h-3 text-purple-500" />
                            ) : (
                                <Lock className="w-3 h-3 text-slate-400" />
                            )}
                        </motion.div>
                    </motion.button>
                </div>

                {/* Performance Sparkline */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-white/60">عملکرد ۷ روز اخیر</span>
                        <div className="flex items-center gap-1">
                            {performanceTrend > 0 ? (
                                <>
                                    <TrendingUp className="w-3 h-3 text-green-400" />
                                    <span className="text-xs font-mono text-green-400">+{performanceTrend}</span>
                                </>
                            ) : performanceTrend < 0 ? (
                                <>
                                    <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />
                                    <span className="text-xs font-mono text-red-400">{performanceTrend}</span>
                                </>
                            ) : (
                                <span className="text-xs font-mono text-white/40">~</span>
                            )}
                        </div>
                    </div>
                    
                    <div className="bg-slate-950/50 rounded-lg overflow-hidden border border-white/5">
                        <PerformanceSparkline data={staff.performanceData} />
                    </div>
                </div>

                {/* Daily Load Status Bar */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-white/60">بار عملیاتی روزانه</span>
                        <span className={`text-sm font-bold font-mono ${getLoadTextColor(staff.currentLoad)}`}>
                            {staff.currentLoad}%
                        </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="relative h-3 bg-slate-950/50 rounded-full overflow-hidden border border-white/10">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${staff.currentLoad}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={`absolute inset-y-0 right-0 bg-gradient-to-l ${getLoadColor(staff.currentLoad)} rounded-full shadow-lg`}
                            style={{
                                boxShadow: `0 0 15px ${
                                    staff.currentLoad >= 80 ? 'rgba(239, 68, 68, 0.5)' :
                                    staff.currentLoad >= 50 ? 'rgba(234, 179, 8, 0.5)' :
                                    'rgba(34, 197, 94, 0.5)'
                                }`
                            }}
                        />
                        
                        {/* Animated Pulse */}
                        {staff.currentLoad > 0 && (
                            <motion.div
                                animate={{
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut' as const,
                                }}
                                className="absolute inset-y-0 right-0 w-full bg-gradient-to-l from-white/20 to-transparent"
                                style={{ width: `${staff.currentLoad}%` }}
                            />
                        )}
                    </div>

                    {/* Load Status Text */}
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-white/40">
                            {staff.currentLoad >= 80 ? 'بار بالا' : 
                             staff.currentLoad >= 50 ? 'بار متوسط' : 
                             'بار پایین'}
                        </span>
                        <span className="text-xs text-white/40">
                            {staff.currentLoad >= 80 ? '⚠️ نیاز به بررسی' : 
                             staff.currentLoad >= 50 ? '✓ وضعیت خوب' : 
                             '✓ ظرفیت آزاد'}
                        </span>
                    </div>
                </div>

                {/* Access Status Badge */}
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {hasAccess ? (
                            <>
                                <div className="w-2 h-2 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50 animate-pulse" />
                                <span className="text-xs text-purple-400 font-medium">دسترسی مالی فعال</span>
                            </>
                        ) : (
                            <>
                                <div className="w-2 h-2 bg-white/20 rounded-full" />
                                <span className="text-xs text-white/40">دسترسی محدود</span>
                            </>
                        )}
                    </div>
                    
                    {/* Total Services */}
                    <span className="text-xs text-white/60 font-mono">
                        {staff.performanceData.reduce((acc, d) => acc + d.value, 0)} خدمت
                    </span>
                </div>
            </div>

            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </motion.div>
    );
}
