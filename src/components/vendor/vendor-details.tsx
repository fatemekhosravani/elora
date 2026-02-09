'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Star, 
    MapPin, 
    Share2, 
    Heart, 
    Clock,
    Sparkles,
    Calendar,
    Award,
    Users,
    TrendingUp,
    CheckCircle,
    Phone,
    ChevronRight
} from 'lucide-react';

interface Service {
    id: string;
    name: string;
    price: number;
    duration: number;
    compatibleStaffIds: number[];
}

interface ServiceCategory {
    category: string;
    services: Service[];
}

interface Staff {
    id: string;
    name: string;
    avatar: string;
    role: string;
}

interface Vendor {
    slug: string;
    name: string;
    address: string;
    rating: number;
    reviewCount: number;
    logo: string;
    bannerImage: string;
    description: string;
    serviceCategories: ServiceCategory[];
    staff: Staff[];
}

const STATS = [
    { icon: Users, label: 'مشتریان فعال', value: '2.5k+', color: 'from-pink-500 to-rose-500' },
    { icon: Award, label: 'امتیاز رضایت', value: '98%', color: 'from-purple-500 to-indigo-500' },
    { icon: TrendingUp, label: 'نوبت‌های موفق', value: '15k+', color: 'from-cyan-500 to-blue-500' },
];

export function VendorDetails({ vendor }: { vendor: Vendor }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [activeCategory, setActiveCategory] = useState(vendor.serviceCategories[0]?.category);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
    };

    const formatDuration = (duration: number) => {
        return duration >= 60 
            ? `${Math.floor(duration / 60)} ساعت${duration % 60 ? ` و ${duration % 60} دقیقه` : ''}`
            : `${duration} دقیقه`;
    };

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden" dir="rtl">
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute top-0 left-0 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[150px]" 
                />
                <motion.div 
                    animate={{ 
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-pink-600/20 rounded-full blur-[150px]" 
                />
                <motion.div 
                    animate={{ 
                        x: [0, 100, 0],
                        y: [0, -100, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px]" 
                />
            </div>

            <div className="relative z-10">
                {/* Hero Section with Banner */}
                <div className="relative h-[400px] md:h-[500px] overflow-hidden">
                    <Image
                        src={vendor.bannerImage}
                        alt={vendor.name}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                    />
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 to-transparent" />

                    {/* Floating Action Buttons */}
                    <div className="absolute top-6 left-6 flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all shadow-lg"
                        >
                            <Share2 className="w-5 h-5 text-white" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsFavorite(!isFavorite)}
                            className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all shadow-lg"
                        >
                            <Heart className={`w-5 h-5 transition-all ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                        </motion.button>
                    </div>

                    {/* Profile Section */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <div className="container mx-auto">
                            <div className="flex flex-col md:flex-row md:items-end gap-6">
                                {/* Logo */}
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', duration: 0.8 }}
                                    className="relative w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-xl border-4 border-white/20 shadow-2xl"
                                >
                                    <Image
                                        src={vendor.logo}
                                        alt={vendor.name}
                                        fill
                                        sizes="160px"
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                                </motion.div>

                                {/* Info */}
                                <div className="flex-1">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <h1 className="text-3xl md:text-4xl font-bold text-white">
                                                {vendor.name}
                                            </h1>
                                            <motion.div
                                                animate={{ rotate: [0, 360] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' as const }}
                                            >
                                                <Sparkles className="w-6 h-6 text-yellow-400" />
                                            </motion.div>
                                        </div>

                                        {/* Rating & Social Proof */}
                                        <div className="flex flex-wrap items-center gap-4 mb-4">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border border-yellow-500/30 rounded-full">
                                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                                <span className="font-bold text-white text-lg">{vendor.rating}</span>
                                                <span className="text-white/70 text-sm">({vendor.reviewCount} نظر)</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full">
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                <span className="text-white text-sm">تأیید شده</span>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div className="flex items-start gap-3 mb-4">
                                            <MapPin className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-white/80 text-sm leading-relaxed">{vendor.address}</span>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white text-xs font-medium hover:from-pink-600 hover:to-purple-700 transition-all whitespace-nowrap"
                                            >
                                                مسیریابی
                                            </motion.button>
                                        </div>

                                        {/* Description */}
                                        <p className="text-white/70 text-sm leading-relaxed max-w-2xl">
                                            {vendor.description}
                                        </p>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="container mx-auto px-6 -mt-8 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {STATS.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:border-white/20 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                                        <p className="text-sm text-white/60">{stat.label}</p>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Services Section */}
                <div className="container mx-auto px-6 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">خدمات ما</h2>
                                <p className="text-white/60">بهترین سرویس‌ها را انتخاب کنید</p>
                            </div>
                            <Link
                                href={`/vendor/${vendor.slug}/book`}
                                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-pink-500/25 flex items-center gap-2"
                            >
                                <Calendar className="w-5 h-5" />
                                رزرو وقت
                            </Link>
                        </div>

                        {/* Category Pills */}
                        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                            {vendor.serviceCategories.map((cat, index) => (
                                <motion.button
                                    key={cat.category}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    onClick={() => setActiveCategory(cat.category)}
                                    className={`relative px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                                        activeCategory === cat.category
                                            ? 'text-white'
                                            : 'text-white/60 hover:text-white'
                                    }`}
                                >
                                    {activeCategory === cat.category && (
                                        <motion.div
                                            layoutId="activeCategory"
                                            className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">{cat.category}</span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Services Grid */}
                        <AnimatePresence mode="wait">
                            {vendor.serviceCategories
                                .filter(cat => cat.category === activeCategory)
                                .map(category => (
                                    <motion.div
                                        key={category.category}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    >
                                        {category.services.map((service, index) => (
                                            <motion.div
                                                key={service.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:border-white/20 hover:bg-white/10 transition-all"
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-white mb-2">{service.name}</h3>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <div className="flex items-center gap-2 text-white/60">
                                                                <Clock className="w-4 h-4 text-cyan-400" />
                                                                <span>{formatDuration(service.duration)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                                                            {formatPrice(service.price)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <Link
                                                    href={`/vendor/${vendor.slug}/book?service=${service.id}`}
                                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white/10 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 text-white rounded-xl font-medium transition-all group-hover:shadow-lg"
                                                >
                                                    <span>انتخاب و رزرو</span>
                                                    <ChevronRight className="w-4 h-4" />
                                                </Link>

                                                {/* Shine Effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ))}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Staff Section */}
                <div className="container mx-auto px-6 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">تیم متخصص ما</h2>
                        <p className="text-white/60 mb-8">با بهترین‌ها آشنا شوید</p>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {vendor.staff.map((member, index) => (
                                <motion.div
                                    key={member.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative"
                                >
                                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-white/10 mb-3">
                                        <Image
                                            src={member.avatar}
                                            alt={member.name}
                                            fill
                                            sizes="(max-width: 768px) 50vw, 20vw"
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <h3 className="text-white font-semibold text-sm mb-1">{member.name}</h3>
                                    <p className="text-white/60 text-xs">{member.role}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Contact CTA */}
                <div className="container mx-auto px-6 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 p-8 md:p-12"
                    >
                        <div className="relative z-10 text-center">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                آماده برای تجربه‌ای بی‌نظیر؟
                            </h2>
                            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                                همین حالا وقت خود را رزرو کنید و از خدمات حرفه‌ای ما بهره‌مند شوید
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Link
                                    href={`/vendor/${vendor.slug}/book`}
                                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-2xl hover:shadow-pink-500/50 flex items-center gap-2"
                                >
                                    <Calendar className="w-6 h-6" />
                                    رزرو آنلاین
                                </Link>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center gap-2"
                                >
                                    <Phone className="w-6 h-6" />
                                    تماس مستقیم
                                </motion.button>
                            </div>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute inset-0 overflow-hidden opacity-20">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500 rounded-full blur-3xl" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
