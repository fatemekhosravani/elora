import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeroSearch } from '@/components/landing/hero-search';
import { 
    Search, 
    MapPin, 
    Scissors, 
    Sparkles, 
    User, 
    ArrowLeft,
    Sun,
    Eye,
    Palette,
    Hand,
    Star
} from 'lucide-react';
import { getFeaturedVendors } from '@/lib/data/public-api';

// Categories Data
const CATEGORIES = [
    { id: 1, name: 'مو', icon: Scissors },
    { id: 2, name: 'ناخن', icon: Hand },
    { id: 3, name: 'پوست', icon: Sun },
    { id: 4, name: 'مژه', icon: Eye },
    { id: 5, name: 'میکاپ', icon: Palette }
];

// Placeholder image helper
function getPlaceholderImage(type: 'salon' | 'service' = 'salon'): string {
    return type === 'salon' 
        ? 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80'
        : 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80';
}

export default async function LandingPage() {
    // Fetch featured vendors from database
    const vendors = await getFeaturedVendors();

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden" dir="rtl">
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[120px]" />
                <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px]" />
            </div>
            <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <Image
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop"
                    alt="Beauty Background"
                    fill
                    className="object-cover opacity-20"
                    priority
                    quality={90}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/80 z-[1]" />

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 py-12">
                    <div className="max-w-5xl mx-auto text-center space-y-6">
                        {/* Main Heading */}
                        <div className="space-y-3">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                                زیبایی تو، وقت تو، انتخاب تو
                            </h1>
                            
                            {/* Subtitle */}
                            <p className="text-base md:text-lg text-white/95 font-medium">
                                رزرو آنلاین برترین سالن‌های زیبایی در شهر شما
                            </p>
                        </div>

                        {/* Search Box */}
                        <HeroSearch />
                    </div>
                </div>
            </section>

            {/* Section 2: Categories */}
            <section className="relative py-16">
                <div className="container mx-auto px-4">
                    {/* Title */}
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            خدمات محبوب
                        </h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto rounded-full"></div>
                    </div>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-6 md:gap-8 max-w-4xl mx-auto">
                        {CATEGORIES.map((category) => {
                            const IconComponent = category.icon;
                            return (
                                <button
                                    key={category.id}
                                    className="group flex flex-col items-center gap-3 transition-all hover:scale-105"
                                >
                                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] group-hover:border-pink-400/50">
                                        <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-white/80 transition-colors group-hover:text-pink-400" />
                                    </div>
                                    <span className="text-sm md:text-base font-semibold text-white/80 group-hover:text-pink-400 transition-colors">
                                        {category.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Section 3: Featured Vendors */}
            <section className="relative py-16">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                                برترین سالن‌های این هفته
                            </h2>
                            <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mt-2 rounded-full"></div>
                        </div>
                        <Link 
                            href="/search"
                            className="flex items-center gap-2 text-cyan-400 font-semibold hover:gap-3 transition-all text-base"
                        >
                            <span className="hidden sm:inline">مشاهده همه</span>
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Horizontal Scroll Container */}
                    <div className="relative">
                        {vendors.length > 0 ? (
                            <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                                {vendors.map((vendor) => (
                                    <Link 
                                        key={vendor.id} 
                                        href={`/vendor/${vendor.slug}`}
                                        className="flex-shrink-0 w-[260px] md:w-[300px] snap-start"
                                    >
                                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/20 h-full">
                                            {/* Vendor Image */}
                                            <div className="relative w-full h-48">
                                                <Image
                                                    src={vendor.logoUrl || getPlaceholderImage('salon')}
                                                    alt={vendor.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-white text-xs font-bold">4.8</span>
                                                </div>
                                            </div>

                                            {/* Vendor Info */}
                                            <div className="p-4">
                                                <h3 className="text-white font-bold text-lg mb-2 truncate">
                                                    {vendor.name}
                                                </h3>
                                                <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
                                                    <MapPin className="w-4 h-4 flex-shrink-0" />
                                                    <span className="truncate">{vendor.address}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-cyan-400 text-sm font-medium">
                                                        {vendor._count.services} خدمات
                                                    </span>
                                                    <button className="text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 px-3 py-1 rounded-lg transition-colors">
                                                        رزرو نوبت
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-white/60">در حال بارگذاری سالن‌ها...</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Section 4: Vendor CTA */}
            <section className="relative py-16">
                <div className="container mx-auto px-4">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="grid md:grid-cols-2 items-center">
                            {/* Text Content */}
                            <div className="p-8 md:p-12 space-y-5">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                                        صاحب سالن زیبایی هستید؟
                                    </h2>
                                    <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                                </div>
                                <p className="text-white/80 text-base leading-relaxed font-medium">
                                    سالن خود را در الورا ثبت کنید، مشتریان جدید جذب کنید و نوبت‌دهی خود را هوشمند کنید.
                                </p>
                                <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 px-6 py-3 rounded-xl font-bold text-base transition-all hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    <span>ثبت نام سالن</span>
                                </button>
                            </div>

                            {/* Image */}
                            <div className="relative w-full h-64 md:h-96">
                                <Image
                                    src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&q=80"
                                    alt="Salon Owner"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
