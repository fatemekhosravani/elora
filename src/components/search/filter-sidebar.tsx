'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, X } from 'lucide-react';

const CATEGORIES = ['مو', 'ناخن', 'پوست', 'مژه', 'میکاپ'];
const LOCATIONS = ['تهران', 'کرج', 'مشهد', 'شیراز', 'اصفهان'];

export function FilterSidebar() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Initialize state from URL params
    const [searchText, setSearchText] = useState(searchParams.get('search') || '');
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        searchParams.get('category')?.split(',').filter(Boolean) || []
    );
    const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

    // Update URL with new params
    const updateURL = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        // Apply updates
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // Handle category toggle
    const toggleCategory = (category: string) => {
        const newCategories = selectedCategories.includes(category)
            ? selectedCategories.filter(c => c !== category)
            : [...selectedCategories, category];

        setSelectedCategories(newCategories);
        updateURL({ category: newCategories.length > 0 ? newCategories.join(',') : null });
    };

    // Handle location change
    const handleLocationChange = (location: string) => {
        setSelectedLocation(location);
        updateURL({ location: location || null });
    };

    // Handle search
    const handleSearch = () => {
        updateURL({ search: searchText || null });
    };

    // Handle price filter
    const handlePriceFilter = () => {
        updateURL({
            minPrice: minPrice || null,
            maxPrice: maxPrice || null,
        });
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSearchText('');
        setSelectedCategories([]);
        setSelectedLocation('');
        setMinPrice('');
        setMaxPrice('');
        router.replace(pathname, { scroll: false });
    };

    const hasActiveFilters = searchText || selectedCategories.length > 0 || selectedLocation || minPrice || maxPrice;

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-xl shadow-lg border border-white/10 p-5 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h2 className="text-lg font-bold text-white">فیلترها</h2>
                {hasActiveFilters && (
                    <button
                        onClick={clearAllFilters}
                        className="text-xs text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1"
                    >
                        <X className="w-3 h-3" />
                        پاک کردن همه
                    </button>
                )}
            </div>

            {/* Search by Name */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
                    <Search className="w-4 h-4 text-pink-400" />
                    جستجوی نام سالن
                </label>
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="نام سالن را وارد کنید..."
                    className="w-full px-3 py-2 border border-white/10 bg-white/5 text-white placeholder:text-white/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <button
                    onClick={handleSearch}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                >
                    جستجو
                </button>
            </div>

            {/* Categories */}
            <div className="space-y-3">
                <label className="text-sm font-semibold text-white/80">دسته‌بندی خدمات</label>
                <div className="space-y-2">
                    {CATEGORIES.map((category) => (
                        <label
                            key={category}
                            className="flex items-center gap-2 cursor-pointer group"
                        >
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(category)}
                                onChange={() => toggleCategory(category)}
                                className="w-4 h-4 text-pink-500 border-white/20 bg-white/5 rounded focus:ring-pink-500 cursor-pointer"
                            />
                            <span className="text-sm text-white/70 group-hover:text-pink-400 transition-colors">
                                {category}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-pink-400" />
                    شهر
                </label>
                <select
                    value={selectedLocation}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    className="w-full px-3 py-2 border border-white/10 bg-white/5 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                    <option value="" className="bg-slate-950">همه شهرها</option>
                    {LOCATIONS.map((location) => (
                        <option key={location} value={location} className="bg-slate-950">
                            {location}
                        </option>
                    ))}
                </select>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
                <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-pink-400" />
                    محدوده قیمت (تومان)
                </label>
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="از"
                        className="px-3 py-2 border border-white/10 bg-white/5 text-white placeholder:text-white/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="تا"
                        className="px-3 py-2 border border-white/10 bg-white/5 text-white placeholder:text-white/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                </div>
                <button
                    onClick={handlePriceFilter}
                    className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-sm font-semibold transition-colors border border-white/20"
                >
                    اعمال فیلتر قیمت
                </button>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
                <div className="pt-4 border-t border-white/10">
                    <div className="text-xs text-white/50 mb-2">فیلترهای فعال:</div>
                    <div className="flex flex-wrap gap-2">
                        {searchText && (
                            <span className="bg-pink-500/20 text-pink-300 px-2 py-1 rounded-md text-xs border border-pink-500/30">
                                {searchText}
                            </span>
                        )}
                        {selectedCategories.map(cat => (
                            <span key={cat} className="bg-pink-500/20 text-pink-300 px-2 py-1 rounded-md text-xs border border-pink-500/30">
                                {cat}
                            </span>
                        ))}
                        {selectedLocation && (
                            <span className="bg-pink-500/20 text-pink-300 px-2 py-1 rounded-md text-xs border border-pink-500/30">
                                {selectedLocation}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
