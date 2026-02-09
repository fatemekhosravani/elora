'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, MapPin, Calendar, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// ==================== TYPES ====================

interface Favorite {
    id: string;
    name: string;
    slug: string;
    category: string;
    image: string;
    rating: number;
    location: string;
    lastVisitDate?: string;
}

// ==================== MOCK DATA ====================

const MOCK_FAVORITES: Favorite[] = [
    {
        id: '1',
        name: 'سالن رز طلایی',
        slug: 'salon-roz-talaei',
        category: 'تخصصی مو و میکاپ',
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
        rating: 4.9,
        location: 'سعادت آباد',
        lastVisitDate: '۳ هفته پیش'
    },
    {
        id: '2',
        name: 'آرایشگاه نگین',
        slug: 'salon-negin',
        category: 'تخصصی ناخن',
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80',
        rating: 4.8,
        location: 'ولنجک',
        lastVisitDate: '۱ ماه پیش'
    },
    {
        id: '3',
        name: 'استودیو پارمیس',
        slug: 'studio-parmis',
        category: 'میکاپ و آرایش عروس',
        image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80',
        rating: 5.0,
        location: 'فرمانیه',
        lastVisitDate: '۲ هفته پیش'
    },
    {
        id: '4',
        name: 'کلینیک زیبایی آریا',
        slug: 'clinic-arya',
        category: 'خدمات پوست و لیزر',
        image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80',
        rating: 4.7,
        location: 'نیاوران'
    },
    {
        id: '5',
        name: 'سالن پارسا',
        slug: 'salon-parsa',
        category: 'آرایشگاه مردانه و زنانه',
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80',
        rating: 4.5,
        location: 'کرج',
        lastVisitDate: '۵ روز پیش'
    },
    {
        id: '6',
        name: 'استودیو مارال',
        slug: 'studio-maral',
        category: 'تخصصی مژه و ابرو',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
        rating: 4.9,
        location: 'آجودانیه'
    }
];

// ==================== HELPER FUNCTIONS ====================

function getRelativeTime(lastVisit?: string): string {
    return lastVisit || 'بازدیدی ثبت نشده';
}

// ==================== FAVORITE CARD COMPONENT ====================

function FavoriteCard({ 
    favorite, 
    onRemove 
}: { 
    favorite: Favorite; 
    onRemove: (id: string) => void;
}) {
    const [isRemoving, setIsRemoving] = useState(false);

    const handleRemove = () => {
        setIsRemoving(true);
        setTimeout(() => {
            onRemove(favorite.id);
        }, 300);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
                opacity: isRemoving ? 0 : 1, 
                scale: isRemoving ? 0.8 : 1 
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]"
        >
            {/* Image Container */}
            <div className="relative aspect-video w-full overflow-hidden">
                <Image
                    src={favorite.image}
                    alt={favorite.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                
                {/* Remove Button */}
                <button
                    onClick={handleRemove}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg hover:scale-110 z-10"
                    aria-label="حذف از علاقه‌مندی‌ها"
                >
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                </button>

                {/* Rating Badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-slate-900">{favorite.rating}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
                {/* Header */}
                <div>
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                        {favorite.name}
                    </h3>
                    <p className="text-sm text-white/60 line-clamp-1">
                        {favorite.category}
                    </p>
                </div>

                {/* Details */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                        <MapPin className="w-4 h-4" />
                        <span>{favorite.location}</span>
                    </div>
                    
                    {favorite.lastVisitDate && (
                        <div className="flex items-center gap-2 text-sm text-white/70">
                            <Calendar className="w-4 h-4" />
                            <span>آخرین بازدید: {getRelativeTime(favorite.lastVisitDate)}</span>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <Link
                    href={`/vendor/${favorite.slug}`}
                    className="block w-full px-4 py-3 bg-pink-500/10 text-pink-400 rounded-xl font-medium text-center hover:bg-pink-500 hover:text-white transition-all duration-300 border border-pink-500/20 hover:border-pink-500"
                >
                    رزرو وقت جدید
                </Link>
            </div>
        </motion.div>
    );
}

// ==================== EMPTY STATE COMPONENT ====================

function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-4"
        >
            {/* Illustration */}
            <div className="relative w-48 h-48 mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl" />
                <div className="relative w-full h-full bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full flex items-center justify-center border border-white/10">
                    <Heart className="w-24 h-24 text-pink-400/50" />
                </div>
            </div>

            {/* Text */}
            <h3 className="text-2xl font-bold text-white mb-3 text-center">
                لیست علاقه‌مندی‌های شما خالی است
            </h3>
            <p className="text-white/60 mb-8 text-center max-w-md">
                با افزودن سالن‌های مورد علاقه، دسترسی سریع‌تری به آنها خواهید داشت
            </p>

            {/* CTA Button */}
            <Link
                href="/search"
                className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-pink-500/25 flex items-center gap-3"
            >
                <Search className="w-5 h-5" />
                <span>مشاهده برترین سالن‌ها</span>
                <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute -left-1 top-1/2 -translate-y-1/2"
                >
                    <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
            </Link>
        </motion.div>
    );
}

// ==================== MAIN PAGE COMPONENT ====================

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<Favorite[]>(MOCK_FAVORITES);

    const handleRemoveFavorite = (id: string) => {
        setFavorites(prev => prev.filter(fav => fav.id !== id));
    };

    return (
        <div className="relative" dir="rtl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">علاقه‌مندی‌های من</h1>
                <p className="text-white/60">
                    {favorites.length > 0 
                        ? `${favorites.length} سالن در لیست علاقه‌مندی‌های شما`
                        : 'هنوز سالنی به لیست اضافه نکرده‌اید'
                    }
            </p>
        </div>

            {/* Favorites Grid */}
            <AnimatePresence mode="popLayout">
                {favorites.length > 0 ? (
                    <motion.div 
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {favorites.map(favorite => (
                            <FavoriteCard
                            key={favorite.id}
                            favorite={favorite}
                            onRemove={handleRemoveFavorite}
                        />
                    ))}
                    </motion.div>
                ) : (
                    <EmptyState />
                )}
            </AnimatePresence>
        </div>
    );
}
