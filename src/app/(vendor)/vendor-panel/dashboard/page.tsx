'use client';

import { motion } from 'framer-motion';
import { 
    TrendingUp, 
    Calendar, 
    Eye, 
    Star, 
    DollarSign,
    User,
    CreditCard,
    MessageSquare,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';

// ==================== MOCK DATA ====================

const MOCK_KPIS = {
    todayIncome: 2500000,
    todayBookings: 8,
    totalSlots: 12,
    views: {
        count: 1247,
        trend: 15, // percentage
    },
    rating: 4.8,
};

const CHART_DATA = [
    { day: 'شنبه', revenue: 1800000 },
    { day: 'یکشنبه', revenue: 2200000 },
    { day: 'دوشنبه', revenue: 1900000 },
    { day: 'سه‌شنبه', revenue: 2800000 },
    { day: 'چهارشنبه', revenue: 2400000 },
    { day: 'پنجشنبه', revenue: 3100000 },
    { day: 'جمعه', revenue: 2500000 },
];

const ACTIVITIES = [
    {
        id: 1,
        type: 'booking',
        icon: Calendar,
        color: 'from-blue-500 to-cyan-500',
        text: 'رزرو جدید: سارا برای کاشت ناخن',
        time: '2 دقیقه پیش',
    },
    {
        id: 2,
        type: 'payment',
        icon: CreditCard,
        color: 'from-green-500 to-emerald-500',
        text: 'واریز: 1,200,000 تومان به حساب',
        time: '15 دقیقه پیش',
    },
    {
        id: 3,
        type: 'review',
        icon: MessageSquare,
        color: 'from-yellow-500 to-orange-500',
        text: 'نظر جدید: "عالی بود!" - مریم احمدی',
        time: '1 ساعت پیش',
    },
    {
        id: 4,
        type: 'booking',
        icon: Calendar,
        color: 'from-blue-500 to-cyan-500',
        text: 'رزرو جدید: کیمیا برای رنگ مو',
        time: '2 ساعت پیش',
    },
    {
        id: 5,
        type: 'view',
        icon: Eye,
        color: 'from-purple-500 to-pink-500',
        text: 'پروفایل شما 45 بار بازدید شد',
        time: '3 ساعت پیش',
    },
];

// ==================== CUSTOM TOOLTIP ====================

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl"
            >
                <p className="text-white/60 text-xs mb-1">{payload[0].payload.day}</p>
                <p className="text-xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                    {new Intl.NumberFormat('fa-IR').format(payload[0].value)} تومان
                </p>
            </motion.div>
        );
    }
    return null;
};

// ==================== HELPER FUNCTIONS ====================

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount);
};

const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date().toLocaleDateString('fa-IR', options);
};

// ==================== MAIN COMPONENT ====================

export default function VendorDashboard() {
    const bookingProgress = (MOCK_KPIS.todayBookings / MOCK_KPIS.totalSlots) * 100;

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
                    className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                    }}
                    transition={{ duration: 25, repeat: Infinity }}
                    className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-green-600/10 rounded-full blur-[150px]"
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
                        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mb-2">
                            خوش آمدید، فرمانده
                        </h1>
                        <p className="text-white/60">مرکز فرمان کسب‌وکار شما</p>
                    </div>
                    <div className="text-left">
                        <p className="text-white/40 text-sm font-mono">{getCurrentDate()}</p>
                    </div>
                </motion.div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Income Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:border-white/20 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex items-center gap-1 text-green-400 text-xs">
                                <ArrowUpRight className="w-4 h-4" />
                                <span className="font-mono">+12%</span>
                            </div>
                        </div>
                        <p className="text-white/60 text-sm mb-2">درآمد امروز</p>
                        <p className="text-3xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                            {formatCurrency(MOCK_KPIS.todayIncome)} T
                        </p>
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </motion.div>

                    {/* Bookings Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:border-white/20 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <p className="text-white/60 text-sm mb-2">نوبت‌های امروز</p>
                        <div className="flex items-baseline gap-2 mb-3">
                            <p className="text-3xl font-bold font-mono text-white">
                                {MOCK_KPIS.todayBookings}
                            </p>
                            <p className="text-white/60 font-mono">/ {MOCK_KPIS.totalSlots}</p>
                        </div>
                        {/* Progress Bar */}
                        <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${bookingProgress}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                            />
                        </div>
                        <p className="text-white/40 text-xs mt-2 font-mono">{Math.round(bookingProgress)}% ظرفیت</p>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </motion.div>

                    {/* Views Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:border-white/20 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <Eye className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex items-center gap-1 text-purple-400 text-xs">
                                <ArrowUpRight className="w-4 h-4" />
                                <span className="font-mono">+{MOCK_KPIS.views.trend}%</span>
                            </div>
                        </div>
                        <p className="text-white/60 text-sm mb-2">بازدید پروفایل</p>
                        <p className="text-3xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                            {formatCurrency(MOCK_KPIS.views.count)}
                        </p>
                        <p className="text-white/40 text-xs mt-2">۷ روز گذشته</p>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </motion.div>

                    {/* Rating Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:border-white/20 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/50">
                                <Star className="w-6 h-6 text-white fill-white" />
                            </div>
                        </div>
                        <p className="text-white/60 text-sm mb-2">امتیاز کلی</p>
                        <div className="flex items-center gap-2">
                            <p className="text-3xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                                {MOCK_KPIS.rating}
                            </p>
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                            i < Math.floor(MOCK_KPIS.rating)
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-white/20'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-white/40 text-xs mt-2 font-mono">از 287 نظر</p>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </motion.div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Chart Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-1">
                                    روند درآمد
                                </h2>
                                <p className="text-white/60 text-sm">۷ روز گذشته</p>
                            </div>
                            <div className="flex items-center gap-2 text-green-400 text-sm">
                                <ArrowUpRight className="w-4 h-4" />
                                <span className="font-mono">+18.5%</span>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={CHART_DATA}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis
                                    dataKey="day"
                                    stroke="#ffffff40"
                                    style={{ fontSize: '12px', fontFamily: 'Vazirmatn' }}
                                />
                                <YAxis
                                    stroke="#ffffff40"
                                    style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
                                    tickFormatter={(value) => `${value / 1000000}M`}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#8B5CF6', strokeWidth: 2 }} />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#8B5CF6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Activity Feed */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
                    >
                        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6">
                            فعالیت‌های اخیر
                        </h2>

                        <div className="space-y-4">
                            {ACTIVITIES.map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + index * 0.1 }}
                                    className="flex gap-4 group"
                                >
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activity.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                        <activity.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm mb-1 leading-relaxed">
                                            {activity.text}
                                        </p>
                                        <p className="text-white/40 text-xs font-mono">{activity.time}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* View All Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm font-medium transition-all"
                        >
                            مشاهده همه فعالیت‌ها
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
