import { Suspense } from 'react';
import Image from 'next/image';
import { Star, MapPin, Clock } from 'lucide-react';
import { FilterSidebar } from '@/components/search/filter-sidebar';
import { MobileFilters } from '@/components/search/mobile-filters';

// Mock Data Types
interface Vendor {
    id: number;
    name: string;
    category: string[];
    location: string;
    priceRange: { min: number; max: number };
    rating: number;
    image: string;
    isVip: boolean;
    address: string;
    reviewCount: number;
}

// Comprehensive Mock Data
const MOCK_VENDORS: Vendor[] = [
    {
        id: 1,
        name: 'سالن رز طلایی',
        category: ['مو', 'میکاپ'],
        location: 'تهران',
        priceRange: { min: 500000, max: 3000000 },
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
        isVip: true,
        address: 'سعادت آباد، خیابان سرو غربی',
        reviewCount: 234
    },
    {
        id: 2,
        name: 'آرایشگاه نگین',
        category: ['ناخن'],
        location: 'تهران',
        priceRange: { min: 300000, max: 1500000 },
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80',
        isVip: false,
        address: 'ولنجک، خیابان فرمانیه',
        reviewCount: 187
    },
    {
        id: 3,
        name: 'استودیو پارمیس',
        category: ['میکاپ', 'پوست'],
        location: 'تهران',
        priceRange: { min: 800000, max: 5000000 },
        rating: 5.0,
        image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80',
        isVip: true,
        address: 'فرمانیه، نبش کوچه نهم',
        reviewCount: 412
    },
    {
        id: 4,
        name: 'کلینیک زیبایی آریا',
        category: ['پوست', 'مژه'],
        location: 'تهران',
        priceRange: { min: 400000, max: 2000000 },
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80',
        isVip: false,
        address: 'نیاوران، میدان قدس',
        reviewCount: 156
    },
    {
        id: 5,
        name: 'سالن پارسا',
        category: ['مو'],
        location: 'کرج',
        priceRange: { min: 200000, max: 1000000 },
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80',
        isVip: false,
        address: 'کرج، گوهردشت',
        reviewCount: 89
    },
    {
        id: 6,
        name: 'آرایشگاه الماس',
        category: ['مو', 'ناخن', 'میکاپ'],
        location: 'مشهد',
        priceRange: { min: 350000, max: 2500000 },
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
        isVip: true,
        address: 'مشهد، بلوار وکیل آباد',
        reviewCount: 298
    },
    {
        id: 7,
        name: 'سالن زیبایی شهرزاد',
        category: ['پوست', 'مو'],
        location: 'تهران',
        priceRange: { min: 600000, max: 3500000 },
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1633681926035-ec1ac984418a?w=800&q=80',
        isVip: true,
        address: 'تهران، پاسداران',
        reviewCount: 345
    },
    {
        id: 8,
        name: 'استودیو نیلوفر',
        category: ['میکاپ'],
        location: 'تهران',
        priceRange: { min: 1000000, max: 6000000 },
        rating: 5.0,
        image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
        isVip: true,
        address: 'تهران، زعفرانیه',
        reviewCount: 521
    },
    {
        id: 9,
        name: 'کلینیک پوست و مو سپهر',
        category: ['پوست', 'مو'],
        location: 'شیراز',
        priceRange: { min: 400000, max: 2500000 },
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=800&q=80',
        isVip: false,
        address: 'شیراز، صدرا',
        reviewCount: 178
    },
    {
        id: 10,
        name: 'سالن ناخن هنر',
        category: ['ناخن'],
        location: 'تهران',
        priceRange: { min: 250000, max: 1200000 },
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800&q=80',
        isVip: false,
        address: 'تهران، آجودانیه',
        reviewCount: 143
    },
];

// Filter Logic
async function filterVendors(
    vendors: Vendor[],
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
): Promise<Vendor[]> {
    const params = await searchParams;
    let filtered = [...vendors];

    // Search by name
    if (params.search && typeof params.search === 'string') {
        const searchLower = params.search.toLowerCase();
        filtered = filtered.filter(v => v.name.toLowerCase().includes(searchLower));
    }

    // Filter by categories
    if (params.category && typeof params.category === 'string') {
        const categories = params.category.split(',');
        filtered = filtered.filter(v => 
            v.category.some(cat => categories.includes(cat))
        );
    }

    // Filter by location
    if (params.location && typeof params.location === 'string') {
        filtered = filtered.filter(v => v.location === params.location);
    }

    // Filter by price range
    if (params.minPrice && typeof params.minPrice === 'string') {
        const minPrice = parseInt(params.minPrice);
        filtered = filtered.filter(v => v.priceRange.max >= minPrice);
    }

    if (params.maxPrice && typeof params.maxPrice === 'string') {
        const maxPrice = parseInt(params.maxPrice);
        filtered = filtered.filter(v => v.priceRange.min <= maxPrice);
    }

    return filtered;
}

// Vendor Card Component
function VendorCard({ vendor }: { vendor: Vendor }) {
    return (
        <div className={`group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-2xl ${
            vendor.isVip ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border-2 border-yellow-400/50 shadow-[0_0_30px_rgba(251,191,36,0.2)]' : 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg hover:border-white/20'
        }`}>
            {/* VIP Badge */}
            {vendor.isVip && (
                <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    VIP
                </div>
            )}

            {/* Image Container */}
            <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                <Image
                    src={vendor.image}
                    alt={vendor.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Rating Badge */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs font-semibold text-gray-800 shadow-sm backdrop-blur-sm">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{vendor.rating}</span>
                    <span className="text-gray-500">({vendor.reviewCount})</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Name */}
                <h3 className="mb-2 text-lg font-bold text-white line-clamp-1">{vendor.name}</h3>

                {/* Categories */}
                <div className="mb-3 flex flex-wrap gap-1">
                    {vendor.category.map((cat, idx) => (
                        <span 
                            key={idx} 
                            className="text-xs bg-pink-500/20 text-pink-300 px-2 py-1 rounded-md font-medium border border-pink-500/30"
                        >
                            {cat}
                        </span>
                    ))}
                </div>

                {/* Meta Info */}
                <div className="mb-3 flex items-center gap-2 text-xs text-white/60">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="line-clamp-1">{vendor.address}</span>
                </div>

                {/* Footer: Price */}
                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-white/40">محدوده قیمت</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-bold text-white">
                                {new Intl.NumberFormat('fa-IR').format(vendor.priceRange.min)}
                            </span>
                            <span className="text-xs text-white/50">-</span>
                            <span className="text-sm font-bold text-white">
                                {new Intl.NumberFormat('fa-IR').format(vendor.priceRange.max)}
                            </span>
                        </div>
                    </div>
                    <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                        مشاهده
                    </button>
                </div>
            </div>
        </div>
    );
}

// Main Search Page Component
export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const filteredVendors = await filterVendors(MOCK_VENDORS, searchParams);

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden" dir="rtl">
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        جستجوی سالن‌های زیبایی
                    </h1>
                    <p className="text-white/60">
                        {filteredVendors.length} سالن یافت شد
                    </p>
                </div>

                {/* Mobile Filters Button */}
                <div className="lg:hidden mb-4">
                    <MobileFilters />
                </div>

                {/* Main Layout */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar - Desktop Only */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-4">
                            <Suspense fallback={<div>در حال بارگذاری...</div>}>
                                <FilterSidebar />
                            </Suspense>
                        </div>
                    </aside>

                    {/* Results Grid */}
                    <main className="flex-1">
                        {filteredVendors.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredVendors.map((vendor) => (
                                    <VendorCard key={vendor.id} vendor={vendor} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="mb-4">
                                    <div className="w-24 h-24 mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center">
                                        <MapPin className="w-12 h-12 text-white/40" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    نتیجه‌ای یافت نشد
                                </h3>
                                <p className="text-white/60">
                                    لطفاً فیلترهای دیگری را امتحان کنید
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
