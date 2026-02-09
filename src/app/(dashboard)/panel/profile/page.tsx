'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Lock, User, Calendar, CheckCircle, Loader2 } from 'lucide-react';

// ==================== ZOD SCHEMA ====================

const profileSchema = z.object({
    firstName: z.string().min(2, 'نام باید حداقل ۲ حرف باشد'),
    lastName: z.string().min(2, 'نام خانوادگی باید حداقل ۲ حرف باشد'),
    phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل معتبر نیست'),
    birthDay: z.string().min(1, 'روز را انتخاب کنید'),
    birthMonth: z.string().min(1, 'ماه را انتخاب کنید'),
    birthYear: z.string().min(1, 'سال را انتخاب کنید'),
});

type ProfileForm = z.infer<typeof profileSchema>;

// ==================== MOCK DATA ====================

const INITIAL_DATA = {
    firstName: 'سارا',
    lastName: 'محمدی',
    phone: '09121234567',
    birthDate: '1375/06/31', // Year/Month/Day
};

// ==================== HELPER DATA ====================

const PERSIAN_MONTHS = [
    { value: '01', label: 'فروردین' },
    { value: '02', label: 'اردیبهشت' },
    { value: '03', label: 'خرداد' },
    { value: '04', label: 'تیر' },
    { value: '05', label: 'مرداد' },
    { value: '06', label: 'شهریور' },
    { value: '07', label: 'مهر' },
    { value: '08', label: 'آبان' },
    { value: '09', label: 'آذر' },
    { value: '10', label: 'دی' },
    { value: '11', label: 'بهمن' },
    { value: '12', label: 'اسفند' },
];

const generateDays = () => Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1)
}));

const generateYears = () => {
    const currentYear = 1404; // Current Persian year
    return Array.from({ length: 80 }, (_, i) => ({
        value: String(currentYear - i),
        label: String(currentYear - i)
    }));
};

// ==================== TOAST COMPONENT ====================

function SuccessToast({ message, onClose }: { message: string; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 bg-green-500 text-white rounded-xl shadow-2xl backdrop-blur-xl"
        >
            <CheckCircle className="w-6 h-6" />
            <span className="font-medium">{message}</span>
        </motion.div>
    );
}

// ==================== MAIN COMPONENT ====================

export default function ProfilePage() {
    // Parse initial birth date
    const [year, month, day] = INITIAL_DATA.birthDate.split('/');

    // State
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: INITIAL_DATA.firstName,
            lastName: INITIAL_DATA.lastName,
            phone: INITIAL_DATA.phone,
            birthDay: day,
            birthMonth: month,
            birthYear: year,
        },
    });

    // Get initials for avatar
    const getInitials = () => {
        return `${INITIAL_DATA.firstName.charAt(0)}.${INITIAL_DATA.lastName.charAt(0)}`;
    };

    // Handle avatar upload
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Form submission
    const onSubmit = async (data: ProfileForm) => {
        setIsLoading(true);
        
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log('Profile Updated:', {
            ...data,
            birthDate: `${data.birthYear}/${data.birthMonth}/${data.birthDay}`,
            avatar: avatarUrl
        });

        setIsLoading(false);
        setShowToast(true);
        
        // Hide toast after 3 seconds
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="relative" dir="rtl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">ویرایش پروفایل</h1>
                <p className="text-white/60">اطلاعات شخصی خود را مدیریت کنید</p>
            </div>

            {/* Avatar Section */}
            <div className="mb-10 flex flex-col items-center max-w-2xl mx-auto">
                <div className="relative group mb-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
                        {avatarUrl ? (
                            <img 
                                src={avatarUrl} 
                                alt="Avatar" 
                                className="w-full h-full object-cover"
                            />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                                    <span className="text-white text-3xl font-bold">
                                        {getInitials()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Hover Overlay */}
                        <button
                            type="button"
                            onClick={handleAvatarClick}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                            <Camera className="w-8 h-8 text-white" />
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                    <p className="text-sm text-white/50 text-center">
                        برای تغییر عکس پروفایل کلیک کنید
                    </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
                {/* Personal Info Section */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-pink-400" />
                        اطلاعات شخصی
                    </h2>

                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                نام
                            </label>
                            <input
                                {...register('firstName')}
                                type="text"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
                                placeholder="نام خود را وارد کنید"
                            />
                            {errors.firstName && (
                                <p className="mt-2 text-sm text-red-400">{errors.firstName.message}</p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                نام خانوادگی
                            </label>
                            <input
                                {...register('lastName')}
                                type="text"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
                                placeholder="نام خانوادگی خود را وارد کنید"
                            />
                            {errors.lastName && (
                                <p className="mt-2 text-sm text-red-400">{errors.lastName.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Account Info Section */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                            <Lock className="w-5 h-5 text-pink-400" />
                            اطلاعات حساب
                        </h2>

                        {/* Phone Number (Read-only) */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                شماره موبایل
                            </label>
                            <div className="relative">
                                <input
                                    {...register('phone')}
                                    type="text"
                                    disabled
                                    className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white/50 cursor-not-allowed"
                                />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            </div>
                            <p className="mt-2 text-xs text-white/40">
                                برای تغییر شماره موبایل با پشتیبانی تماس بگیرید
                            </p>
                        </div>
                    </div>

                    {/* Birth Date Section */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                            <Calendar className="w-5 h-5 text-pink-400" />
                            تاریخ تولد
                        </h2>

                        <div className="grid grid-cols-3 gap-4">
                            {/* Day */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    روز
                                </label>
                                <select
                                    {...register('birthDay')}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-slate-900">انتخاب کنید</option>
                                    {generateDays().map(day => (
                                        <option key={day.value} value={day.value} className="bg-slate-900">
                                            {day.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.birthDay && (
                                    <p className="mt-1 text-xs text-red-400">{errors.birthDay.message}</p>
                                )}
                            </div>

                            {/* Month */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    ماه
                                </label>
                                <select
                                    {...register('birthMonth')}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-slate-900">انتخاب کنید</option>
                                    {PERSIAN_MONTHS.map(month => (
                                        <option key={month.value} value={month.value} className="bg-slate-900">
                                            {month.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.birthMonth && (
                                    <p className="mt-1 text-xs text-red-400">{errors.birthMonth.message}</p>
                                )}
                            </div>

                            {/* Year */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    سال
                                </label>
                                <select
                                    {...register('birthYear')}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-slate-900">انتخاب کنید</option>
                                    {generateYears().map(year => (
                                        <option key={year.value} value={year.value} className="bg-slate-900">
                                            {year.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.birthYear && (
                                    <p className="mt-1 text-xs text-red-400">{errors.birthYear.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="sticky bottom-0 pt-6 pb-4 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    در حال ذخیره...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    ذخیره تغییرات
                                </>
                            )}
                        </button>
                    </div>
                </form>

            {/* Success Toast */}
            <AnimatePresence>
                {showToast && (
                    <SuccessToast
                        message="اطلاعات با موفقیت بروز شد"
                        onClose={() => setShowToast(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
