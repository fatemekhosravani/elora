'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, User, Calendar, Home } from 'lucide-react';

const NAV_ITEMS = [
    {
        href: '/panel',
        label: 'داشبورد',
        icon: Home,
    },
    {
        href: '/panel/appointments',
        label: 'نوبت‌های من',
        icon: Calendar,
    },
    {
        href: '/panel/favorites',
        label: 'علاقه‌مندی‌ها',
        icon: Heart,
    },
    {
        href: '/panel/profile',
        label: 'پروفایل من',
        icon: User,
    },
];

export function PanelSidebar() {
    const pathname = usePathname();

    return (
        <div className="sticky top-24 h-fit">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4"
            >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-cyan-500/5" />
                
                <div className="relative space-y-2">
                    {NAV_ITEMS.map((item, index) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link key={item.href} href={item.href}>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative group"
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeSidebarItem"
                                            className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    
                                    <div className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                        isActive 
                                            ? 'text-white' 
                                            : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`}>
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        <span className="font-medium">{item.label}</span>
                                    </div>

                                    {/* Shine Effect on Hover */}
                                    {!isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 rounded-xl" />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>

                {/* Bottom Decoration */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-50" />
            </motion.div>

            {/* Quick Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 backdrop-blur-xl border border-white/10 p-4"
            >
                <div className="relative">
                    <h3 className="text-sm font-semibold text-white/80 mb-3">آمار شما</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-white/60 text-xs">نوبت‌های فعال</span>
                            <span className="text-white font-bold">3</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/60 text-xs">علاقه‌مندی‌ها</span>
                            <span className="text-white font-bold">8</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/60 text-xs">مجموع خدمات</span>
                            <span className="text-white font-bold">24</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
