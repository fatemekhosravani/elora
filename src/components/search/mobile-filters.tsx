'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { FilterSidebar } from './filter-sidebar';

export function MobileFilters() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
                <Filter className="w-5 h-5 text-[#BD7E93]" />
                فیلترها و جستجو
            </button>

            {/* Mobile Filter Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between z-10 rounded-t-3xl">
                            <h2 className="text-lg font-bold text-gray-800">فیلترها و جستجو</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        {/* Filter Content */}
                        <div className="p-4">
                            <FilterSidebar />
                        </div>

                        {/* Footer Actions */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4 flex gap-3">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex-1 bg-[#BD7E93] hover:bg-[#a36a7e] text-white py-3 rounded-xl font-bold transition-colors"
                            >
                                مشاهده نتایج
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Animation Styles */}
            <style jsx global>{`
                @keyframes slide-up {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out;
                }
            `}</style>
        </>
    );
}
