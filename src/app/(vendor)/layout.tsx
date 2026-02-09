'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard,
    Calendar,
    BookOpen,
    Scissors,
    Users,
    Wallet,
    Clock,
    LogOut,
    Sparkles
} from 'lucide-react';
import { logout } from '@/actions/auth';

const VENDOR_NAV_ITEMS = [
    {
        label: 'داشبورد',
        href: '/vendor-panel/dashboard',
        icon: LayoutDashboard,
    },
    {
        label: 'تقویم نوبت‌ها',
        href: '/vendor-panel/calendar',
        icon: Calendar,
    },
    {
        label: 'دفتر رزرو',
        href: '/vendor-panel/bookings',
        icon: BookOpen,
    },
    {
        label: 'خدمات',
        href: '/vendor-panel/services',
        icon: Scissors,
    },
    {
        label: 'پرسنل',
        href: '/vendor-panel/staff',
        icon: Users,
    },
    {
        label: 'مالی',
        href: '/vendor-panel/finance',
        icon: Wallet,
    },
    {
        label: 'ساعات کاری',
        href: '/vendor-panel/schedule',
        icon: Clock,
    },
];

export default function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="min-h-screen bg-slate-950" dir="rtl">
            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 min-h-screen bg-slate-900/50 backdrop-blur-xl border-l border-white/10 fixed right-0 top-0">
                    {/* Logo */}
                    <div className="h-16 flex items-center px-6 border-b border-white/10">
                        <Sparkles className="w-6 h-6 text-purple-400 ml-3" />
                        <div>
                            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                پنل سالن
                            </h1>
                            <p className="text-xs text-white/60">Elora Vendor</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="p-4 space-y-1">
                        {VENDOR_NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                        isActive
                                            ? 'text-white bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                                            : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeVendorTab"
                                            className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <Icon className="w-5 h-5 relative z-10" />
                                    <span className="relative z-10 font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Section */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/30 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">خروج</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="mr-64 flex-1">
                    {/* Top Bar */}
                    <header className="h-16 bg-slate-900/50 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8">
                        <div>
                            <p className="text-sm text-white/60">
                                {new Date().toLocaleDateString('fa-IR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-white">سالن زیبایی شما</p>
                                <p className="text-xs text-white/60">مدیر سالن</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                S
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
