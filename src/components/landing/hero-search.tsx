'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, MapPin } from 'lucide-react';

export function HeroSearch() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.set('q', searchQuery);
        if (location) params.set('city', location);
        router.push(`/search?${params.toString()}`);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="mt-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-2 w-full max-w-3xl mx-auto">
                <div className="flex flex-col md:flex-row items-stretch gap-2">
                    {/* Service Input */}
                    <div className="flex items-center flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 gap-2">
                        <Sparkles className="h-5 w-5 text-pink-400 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="چه خدمتی میخوای؟ (کاشت ناخن، رنگ...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="bg-transparent placeholder:text-white/40 text-white w-full outline-none text-sm font-medium"
                        />
                    </div>

                    {/* Location Input */}
                    <div className="flex items-center flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 gap-2">
                        <MapPin className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="کدوم محله؟ (سعادت آباد...)"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="bg-transparent placeholder:text-white/40 text-white w-full outline-none text-sm font-medium"
                        />
                    </div>

                    {/* Search Button */}
                    <button 
                        onClick={handleSearch}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold text-base transition-all hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center justify-center gap-2"
                    >
                        <Search className="h-5 w-5" />
                        <span>جستجو</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
