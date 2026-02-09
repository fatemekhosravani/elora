import Link from 'next/link';
import { DollarSign, Calendar, Users, Store, AlertCircle, ArrowLeft } from 'lucide-react';
import { StatCard } from '@/components/admin/stat-card';
import { RevenueChart } from '@/components/admin/revenue-chart';
import { ActivityFeed } from '@/components/admin/activity-feed';

// ==================== MOCK DATA ====================

const STATS = [
    {
        label: 'کل درآمد',
        value: '۲۵۰,۰۰۰,۰۰۰ تومان',
        trend: '+۱۲٪ این ماه',
        trendUp: true,
        icon: DollarSign,
    },
    {
        label: 'رزرو‌های فعال',
        value: 1240,
        trend: '+۵٪',
        trendUp: true,
        icon: Calendar,
    },
    {
        label: 'کل کاربران',
        value: 5300,
        trend: '+۸٪',
        trendUp: true,
        icon: Users,
    },
    {
        label: 'سالن‌های فعال',
        value: 120,
        trend: undefined,
        trendUp: undefined,
        icon: Store,
    },
];

const REVENUE_DATA = [
    { date: '۱ بهمن', total: 12000000, commission: 2400000 },
    { date: '۳ بهمن', total: 15000000, commission: 3000000 },
    { date: '۵ بهمن', total: 13500000, commission: 2700000 },
    { date: '۷ بهمن', total: 18000000, commission: 3600000 },
    { date: '۹ بهمن', total: 16500000, commission: 3300000 },
    { date: '۱۱ بهمن', total: 21000000, commission: 4200000 },
    { date: '۱۳ بهمن', total: 19500000, commission: 3900000 },
    { date: '۱۵ بهمن', total: 24000000, commission: 4800000 },
    { date: '۱۷ بهمن', total: 22500000, commission: 4500000 },
    { date: '۱۹ بهمن', total: 27000000, commission: 5400000 },
];

const RECENT_ACTIVITIES = [
    {
        id: 1,
        text: 'ثبت‌نام سالن جدید: سالن زیبایی رز',
        type: 'vendor' as const,
        time: '۱۰ دقیقه پیش',
        link: '/admin/vendors',
    },
    {
        id: 2,
        text: 'درخواست پرداخت: ۵,۰۰۰,۰۰۰ تومان - سالن مونا',
        type: 'payout' as const,
        time: '۲۵ دقیقه پیش',
    },
    {
        id: 3,
        text: 'گزارش کاربر جدید: حساب اسپم',
        type: 'report' as const,
        time: '۱ ساعت پیش',
        link: '/admin/users',
    },
    {
        id: 4,
        text: 'رزرو جدید: کاشت ناخن - سالن پارمیس',
        type: 'booking' as const,
        time: '۲ ساعت پیش',
    },
    {
        id: 5,
        text: 'تایید سالن: استودیو آرایش شهرزاد',
        type: 'vendor' as const,
        time: '۳ ساعت پیش',
        link: '/admin/vendors',
    },
];

const PENDING_VENDORS_COUNT = 5; // Mock count

// ==================== MAIN COMPONENT ====================

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">داشبورد مدیریت</h1>
                <p className="text-slate-600">نمای کلی از وضعیت پلتفرم الورا</p>
            </div>

            {/* Attention Needed Banner */}
            {PENDING_VENDORS_COUNT > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-amber-900">
                                {new Intl.NumberFormat('fa-IR').format(PENDING_VENDORS_COUNT)} درخواست ثبت‌نام سالن جدید در انتظار تایید هستند.
                            </p>
                            <p className="text-xs text-amber-700 mt-1">
                                لطفاً در اسرع وقت درخواست‌ها را بررسی کنید.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/admin/vendors"
                        className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                    >
                        بررسی لیست
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </div>
            )}

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat, index) => (
                    <StatCard
                        key={index}
                        label={stat.label}
                        value={stat.value}
                        trend={stat.trend}
                        trendUp={stat.trendUp}
                        icon={stat.icon}
                    />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart - Spans 2 columns */}
                <div className="lg:col-span-2">
                    <RevenueChart data={REVENUE_DATA} />
                </div>

                {/* Activity Feed */}
                <div className="lg:col-span-1">
                    <ActivityFeed activities={RECENT_ACTIVITIES} />
                </div>
            </div>
        </div>
    );
}
