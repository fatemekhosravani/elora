'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard, 
    Store, 
    Users, 
    Settings, 
    Shield,
    LogOut 
} from 'lucide-react';
import { logout } from '@/actions/auth';

const ADMIN_NAV_ITEMS = [
    {
        label: 'داشبورد',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        label: 'تایید سالن‌ها',
        href: '/admin/vendors',
        icon: Store,
    },
    {
        label: 'مدیریت کاربران',
        href: '/admin/users',
        icon: Users,
    },
    {
        label: 'تنظیمات',
        href: '/admin/settings',
        icon: Settings,
    },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
    };

    // TODO: Add middleware protection for /admin routes
    // Ensure only users with role ADMIN can access

    return (
        <div className="min-h-screen bg-white" dir="rtl">
            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 min-h-screen bg-slate-50 border-l border-gray-200 fixed right-0 top-0">
                    {/* Logo */}
                    <div className="h-16 flex items-center px-6 border-b border-gray-200">
                        <Shield className="w-6 h-6 text-slate-900 ml-3" />
                        <div>
                            <h1 className="text-lg font-bold text-slate-900">پنل مدیریت</h1>
                            <p className="text-xs text-gray-500">Elora Admin</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="p-4 space-y-1">
                        {ADMIN_NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        isActive
                                            ? 'text-slate-900 bg-white shadow-sm'
                                            : 'text-gray-600 hover:bg-white/50'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-white rounded-lg shadow-sm"
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
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">خروج</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="mr-64 flex-1">
                    {/* Top Bar */}
                    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
                        <div>
                            <p className="text-sm text-gray-500">
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
                                <p className="text-sm font-medium text-slate-900">ادمین سیستم</p>
                                <p className="text-xs text-gray-500">09385005077</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold">
                                A
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
