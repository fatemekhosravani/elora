'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings, Clock, DollarSign, Users } from 'lucide-react';
import Image from 'next/image';
import { CreateServiceModal } from '@/components/vendor/create-service-modal';
import { STAFF_LIST } from '../mock-data';

// ==================== MOCK DATA ====================

interface Service {
    id: string;
    title: string;
    price: number;
    duration: number;
    image: string;
    staffTags: string[];
    category: string;
}

const MOCK_SERVICES: Service[] = [
    {
        id: '1',
        title: 'کراتینه مو حرفه‌ای',
        price: 2500000,
        duration: 120,
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80',
        staffTags: ['کیمیا خسروانی', 'سارا محمدی'],
        category: 'مو',
    },
    {
        id: '2',
        title: 'مانیکور و پدیکور ژله‌ای',
        price: 800000,
        duration: 90,
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80',
        staffTags: ['مریم احمدی'],
        category: 'ناخن',
    },
    {
        id: '3',
        title: 'میکاپ عروس',
        price: 5000000,
        duration: 180,
        image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80',
        staffTags: ['کیمیا خسروانی', 'سارا محمدی', 'نرگس رضایی'],
        category: 'آرایش',
    },
    {
        id: '4',
        title: 'رنگ مو فانتزی',
        price: 1800000,
        duration: 150,
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80',
        staffTags: ['کیمیا خسروانی'],
        category: 'مو',
    },
    {
        id: '5',
        title: 'کاشت ناخن',
        price: 1200000,
        duration: 120,
        image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400&q=80',
        staffTags: ['مریم احمدی'],
        category: 'ناخن',
    },
    {
        id: '6',
        title: 'فیشیال صورت',
        price: 900000,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80',
        staffTags: ['نرگس رضایی', 'سارا محمدی'],
        category: 'پوست',
    },
];

// ==================== HELPER FUNCTIONS ====================

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
};

const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours} ساعت و ${mins} دقیقه`;
    if (hours > 0) return `${hours} ساعت`;
    return `${mins} دقیقه`;
};

// ==================== SERVICE CARD COMPONENT ====================

function ServiceCard({ service }: { service: Service }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="group relative overflow-hidden rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
        >
            <div className="flex h-full" dir="rtl">
                {/* Image Section */}
                <div className="relative w-28 h-full flex-shrink-0 overflow-hidden">
                    <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="112px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-l from-slate-900/50 to-transparent" />
                    
                    {/* Floating Badge */}
                    <div className="absolute top-2 right-2 px-2 py-1 bg-purple-500/90 backdrop-blur-sm rounded-lg text-white text-xs font-bold">
                        NFT
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="text-white font-bold text-lg leading-tight">{service.title}</h3>
                            
                            {/* Floating Edit Icon */}
                            <AnimatePresence>
                                {isHovered && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
                                        className="w-8 h-8 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-shadow"
                                    >
                                        <Settings className="w-4 h-4 text-white" />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Category Badge */}
                        <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-white/70 text-xs mb-3">
                            {service.category}
                        </span>

                        {/* Stats */}
                        <div className="space-y-2 mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center">
                                    <DollarSign className="w-3 h-3 text-green-400" />
                                </div>
                                <span className="text-xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                                    {formatPrice(service.price)} T
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                    <Clock className="w-3 h-3 text-cyan-400" />
                                </div>
                                <span className="text-sm text-white/70">
                                    {formatDuration(service.duration)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Staff Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Users className="w-3 h-3 text-purple-400" />
                        {service.staffTags.slice(0, 2).map((staff, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-xs"
                            >
                                {staff}
                            </span>
                        ))}
                        {service.staffTags.length > 2 && (
                            <span className="text-white/40 text-xs">
                                +{service.staffTags.length - 2}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </motion.div>
    );
}

// ==================== MAIN PAGE COMPONENT ====================

export default function ServicesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [services, setServices] = useState<Service[]>(MOCK_SERVICES);

    const handleCreateService = (newService: Omit<Service, 'id'>) => {
        const service: Service = {
            ...newService,
            id: Date.now().toString(),
        };
        setServices([service, ...services]);
        setIsModalOpen(false);
    };

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
                    className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-pink-600/10 rounded-full blur-[150px]"
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
                            مدیریت سرویس‌ها
                        </h1>
                        <p className="text-white/60">دارایی‌های دیجیتال شما ({services.length} سرویس)</p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        افزودن سرویس جدید
                    </motion.button>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-3 gap-4 mb-8"
                >
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                        <p className="text-white/60 text-sm mb-1">مجموع درآمد</p>
                        <p className="text-2xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                            {formatPrice(services.reduce((acc, s) => acc + s.price, 0))} T
                        </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                        <p className="text-white/60 text-sm mb-1">میانگین قیمت</p>
                        <p className="text-2xl font-bold font-mono text-white">
                            {formatPrice(Math.round(services.reduce((acc, s) => acc + s.price, 0) / services.length))} T
                        </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                        <p className="text-white/60 text-sm mb-1">تعداد پرسنل</p>
                        <p className="text-2xl font-bold font-mono text-purple-400">
                            {STAFF_LIST.length}
                        </p>
                    </div>
                </motion.div>

                {/* Services Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                        >
                            <ServiceCard service={service} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty State */}
                {services.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center">
                            <Plus className="w-10 h-10 text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">هنوز سرویسی ندارید</h3>
                        <p className="text-white/60 mb-6">اولین دارایی دیجیتال خود را بسازید</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
                        >
                            شروع کنید
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Create Service Modal */}
            <CreateServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateService}
            />
        </div>
    );
}
