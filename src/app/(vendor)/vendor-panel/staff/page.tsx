'use client';

import { motion } from 'framer-motion';
import { Users, Plus, TrendingUp, Shield } from 'lucide-react';
import { StaffCard } from '@/components/vendor/staff-card';
import { MOCK_STAFF, StaffMember } from '../mock-data';

// ==================== STATS CALCULATION ====================

const calculateStats = (staff: StaffMember[]) => {
    const totalNodes = staff.length;
    const activeNodes = staff.filter(s => s.currentLoad > 50).length;
    const avgLoad = Math.round(staff.reduce((acc, s) => acc + s.currentLoad, 0) / staff.length);
    const withAccess = staff.filter(s => s.hasFinanceAccess).length;

    return { totalNodes, activeNodes, avgLoad, withAccess };
};

// ==================== MAIN PAGE COMPONENT ====================

export default function StaffManagementPage() {
    const stats = calculateStats(MOCK_STAFF);

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
                    className="flex items-center justify-between mb-8"
                >
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-2">
                            شبکه نودها
                        </h1>
                        <p className="text-white/60">مدیریت نودهای عملیاتی شبکه</p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        افزودن نود جدید
                    </motion.button>
                </motion.div>

                {/* Network Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl p-5"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                <Users className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                                <p className="text-white/60 text-xs">کل نودها</p>
                                <p className="text-2xl font-bold font-mono text-white">{stats.totalNodes}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl p-5"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <p className="text-white/60 text-xs">نودهای فعال</p>
                                <p className="text-2xl font-bold font-mono text-green-400">{stats.activeNodes}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl p-5"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                                <span className="text-yellow-400 font-bold text-lg">%</span>
                            </div>
                            <div>
                                <p className="text-white/60 text-xs">میانگین بار</p>
                                <p className="text-2xl font-bold font-mono text-yellow-400">{stats.avgLoad}%</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl p-5"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-white/60 text-xs">دسترسی مالی</p>
                                <p className="text-2xl font-bold font-mono text-purple-400">{stats.withAccess}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Staff Grid */}
                {MOCK_STAFF.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                        {MOCK_STAFF.map((staff, index) => (
                            <motion.div
                                key={staff.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                            >
                                <StaffCard staff={staff} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                            <Users className="w-10 h-10 text-cyan-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">هیچ نودی در شبکه نیست</h3>
                        <p className="text-white/60 mb-6">اولین نود خود را به شبکه اضافه کنید</p>
                        <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all">
                            افزودن نود
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
