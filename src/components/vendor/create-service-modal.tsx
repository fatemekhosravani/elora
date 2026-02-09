'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Clock, Users, Image as ImageIcon, DollarSign } from 'lucide-react';
import { STAFF_LIST } from '@/app/(vendor)/vendor-panel/mock-data';

interface Service {
    title: string;
    price: number;
    duration: number;
    image: string;
    staffTags: string[];
    category: string;
}

interface CreateServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (service: Service) => void;
}

export function CreateServiceModal({ isOpen, onClose, onSubmit }: CreateServiceModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        duration: 60,
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80',
        staffTags: [] as string[],
        category: 'مو',
    });

    const [showAiSuggestion, setShowAiSuggestion] = useState(true);
    const aiSuggestedPrice = 400000;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.price) return;

        onSubmit({
            title: formData.title,
            price: parseInt(formData.price),
            duration: formData.duration,
            image: formData.image,
            staffTags: formData.staffTags,
            category: formData.category,
        });

        // Reset form
        setFormData({
            title: '',
            price: '',
            duration: 60,
            image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80',
            staffTags: [],
            category: 'مو',
        });
    };

    const toggleStaff = (staffName: string) => {
        setFormData(prev => ({
            ...prev,
            staffTags: prev.staffTags.includes(staffName)
                ? prev.staffTags.filter(s => s !== staffName)
                : [...prev.staffTags, staffName],
        }));
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
        if (hours > 0) return `${hours}h`;
        return `${mins}m`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className="w-full max-w-2xl bg-slate-900 border-2 border-purple-500/50 rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden pointer-events-auto"
                            dir="rtl"
                        >
                            {/* Header */}
                            <div className="relative bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10 p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                                            <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                                ساخت دارایی جدید
                                            </h2>
                                            <p className="text-white/60 text-sm">سرویس خود را Mint کنید</p>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={onClose}
                                        className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                    >
                                        <X className="w-5 h-5 text-white" />
                                    </motion.button>
                                </div>

                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-transparent opacity-50 pointer-events-none" />
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                {/* Service Name */}
                                <div>
                                    <label className="block text-white font-semibold mb-2">نام سرویس</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="مثال: کراتینه مو حرفه‌ای"
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-white font-semibold mb-2">دسته‌بندی</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                    >
                                        <option value="مو">مو</option>
                                        <option value="ناخن">ناخن</option>
                                        <option value="آرایش">آرایش</option>
                                        <option value="پوست">پوست</option>
                                    </select>
                                </div>

                                {/* Smart Pricing */}
                                <div>
                                    <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-green-400" />
                                        قیمت (تومان)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="0"
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-xl placeholder:text-white/40 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                                    />
                                    
                                    {/* AI Suggestion */}
                                    <AnimatePresence>
                                        {showAiSuggestion && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-3 overflow-hidden"
                                            >
                                                <div className="relative bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-3 flex items-start gap-3">
                                                    <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="text-yellow-200 text-sm leading-relaxed">
                                                            💡 پیشنهاد هوش مصنوعی برای منطقه شما:{' '}
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, price: aiSuggestedPrice.toString() })}
                                                                className="font-bold font-mono underline hover:text-yellow-100 transition-colors"
                                                            >
                                                                {new Intl.NumberFormat('fa-IR').format(aiSuggestedPrice)} تومان
                                                            </button>
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowAiSuggestion(false)}
                                                        className="text-white/60 hover:text-white transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Duration Slider */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-white font-semibold flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-cyan-400" />
                                            مدت زمان
                                        </label>
                                        <div className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl">
                                            <span className="text-3xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                                                {formatDuration(formData.duration)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <input
                                        type="range"
                                        min="15"
                                        max="300"
                                        step="15"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                        className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer slider-thumb"
                                        style={{
                                            background: `linear-gradient(to left, rgba(34, 211, 238, 0.3) 0%, rgba(34, 211, 238, 0.3) ${(formData.duration - 15) / (300 - 15) * 100}%, rgba(255, 255, 255, 0.1) ${(formData.duration - 15) / (300 - 15) * 100}%, rgba(255, 255, 255, 0.1) 100%)`
                                        }}
                                    />
                                    <div className="flex justify-between mt-2 text-white/40 text-xs font-mono">
                                        <span>15m</span>
                                        <span>300m</span>
                                    </div>
                                </div>

                                {/* Staff Tagging */}
                                <div>
                                    <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-purple-400" />
                                        انتخاب پرسنل
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {STAFF_LIST.map((staff) => {
                                            const isSelected = formData.staffTags.includes(staff.name);
                                            return (
                                                <motion.button
                                                    key={staff.id}
                                                    type="button"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => toggleStaff(staff.name)}
                                                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                                        isSelected
                                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-2 border-purple-400 shadow-lg shadow-purple-500/50'
                                                            : 'bg-white/5 text-white/70 border border-white/10 hover:border-white/30'
                                                    }`}
                                                >
                                                    {staff.name}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                    {formData.staffTags.length === 0 && (
                                        <p className="text-white/40 text-sm mt-2">حداقل یک نفر را انتخاب کنید</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-3 pt-4 border-t border-white/10">
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={onClose}
                                        className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition-all"
                                    >
                                        انصراف
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={!formData.title || !formData.price || formData.staffTags.length === 0}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl text-white font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Sparkles className="w-5 h-5" />
                                        ساخت دارایی
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
