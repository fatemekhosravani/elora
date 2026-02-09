'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
    Smartphone, 
    CheckCircle, 
    Store, 
    AlertCircle, 
    ArrowRight, 
    Loader2, 
    X,
    Check,
    Calendar,
    CreditCard,
    TrendingUp,
    Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui';
import Image from 'next/image';
import { sendVendorOtp, verifyVendorOtp, registerVendor as registerVendorAction } from '@/actions/vendor-auth';

// ==================== ZOD SCHEMAS ====================

const phoneSchema = z.object({
    phone: z.string()
        .regex(/^09\d{9}$/, 'شماره موبایل باید با 09 شروع شود و 11 رقم باشد')
});

const otpSchema = z.object({
    otp: z.string()
        .length(5, 'کد تأیید باید 5 رقم باشد')
        .regex(/^\d+$/, 'کد تأیید فقط باید شامل اعداد باشد')
});

const businessSchema = z.object({
    ownerFullName: z.string()
        .min(3, 'نام و نام خانوادگی باید حداقل 3 حرف باشد')
        .regex(/^[\u0600-\u06FF\s]+$/, 'فقط از حروف فارسی استفاده کنید'),
    salonName: z.string()
        .min(3, 'نام سالن باید حداقل 3 حرف باشد'),
    slug: z.string()
        .min(3, 'آدرس اختصاصی باید حداقل 3 کاراکتر باشد')
        .regex(/^[a-z0-9-]+$/, 'فقط حروف انگلیسی کوچک، اعداد و خط تیره مجاز است'),
    category: z.string()
        .min(1, 'دسته‌بندی را انتخاب کنید'),
    address: z.string()
        .min(10, 'آدرس باید حداقل 10 حرف باشد')
});

type PhoneForm = z.infer<typeof phoneSchema>;
type OtpForm = z.infer<typeof otpSchema>;
type BusinessForm = z.infer<typeof businessSchema>;

// ==================== TYPES ====================

type Step = 'PHONE_INPUT' | 'OTP_VERIFY' | 'BUSINESS_SETUP';

// ==================== CONSTANTS ====================

const CATEGORIES = [
    { value: 'hair', label: 'مو و آرایشگری' },
    { value: 'nail', label: 'ناخن' },
    { value: 'skin', label: 'پوست و زیبایی' },
    { value: 'makeup', label: 'میکاپ و آرایش' },
    { value: 'all', label: 'همه خدمات' }
];

const BENEFITS = [
    { icon: Calendar, text: 'مدیریت هوشمند نوبت‌ها' },
    { icon: CreditCard, text: 'دریافت بیعانه آنلاین' },
    { icon: TrendingUp, text: 'دیده شدن در محله' },
    { icon: Sparkles, text: 'افزایش درآمد تا 40%' }
];

// Helper function to generate slug from Persian name
function generateSlug(persianName: string): string {
    const transliterationMap: Record<string, string> = {
        'آ': 'a', 'ا': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's', 'ج': 'j', 'چ': 'ch',
        'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's',
        'ش': 'sh', 'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f',
        'ق': 'gh', 'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n', 'و': 'v', 'ه': 'h',
        'ی': 'i', 'ئ': 'y', ' ': '-'
    };
    
    return persianName
        .split('')
        .map(char => transliterationMap[char] || '')
        .join('')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase();
}

// ==================== MAIN COMPONENT ====================

export default function VendorRegisterPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<Step>('PHONE_INPUT');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [receivedOtp, setReceivedOtp] = useState('');
    const [showMvpAlert, setShowMvpAlert] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // ==================== STEP 1: PHONE INPUT ====================
    
    const phoneForm = useForm<PhoneForm>({
        resolver: zodResolver(phoneSchema),
        defaultValues: { phone: '' }
    });

    const handlePhoneSubmit = async (data: PhoneForm) => {
        setIsLoading(true);
        const result = await sendVendorOtp(data.phone);
        setIsLoading(false);

        if (result.success && result.otp) {
            setPhoneNumber(data.phone);
            console.log('🔑 Vendor OTP:', result.otp);
            setReceivedOtp(result.otp);
            setCurrentStep('OTP_VERIFY');
        } else {
            phoneForm.setError('phone', { message: result.error as string || 'خطا در ارسال کد' });
        }
    };

    // ==================== STEP 2: OTP VERIFICATION ====================
    
    const otpForm = useForm<OtpForm>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: '' }
    });

    const handleOtpSubmit = async (data: OtpForm) => {
        setIsLoading(true);
        const result = await verifyVendorOtp(phoneNumber, data.otp);
        setIsLoading(false);

        if (result.success) {
            setCurrentStep('BUSINESS_SETUP');
        } else {
            otpForm.setError('otp', { message: result.error as string || 'کد وارد شده صحیح نیست' });
        }
    };

    // ==================== STEP 3: BUSINESS SETUP ====================
    
    const businessForm = useForm<BusinessForm>({
        resolver: zodResolver(businessSchema),
        defaultValues: {
            ownerFullName: '',
            salonName: '',
            slug: '',
            category: '',
            address: ''
        }
    });

    // Auto-generate slug from salon name
    const handleSalonNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const salonName = e.target.value;
        businessForm.setValue('salonName', salonName);
        
        // Auto-suggest slug
        if (salonName && !businessForm.getValues('slug')) {
            const suggestedSlug = generateSlug(salonName);
            businessForm.setValue('slug', suggestedSlug);
        }
    };

    const handleBusinessSubmit = async (data: BusinessForm) => {
        setIsLoading(true);
        const result = await registerVendorAction({ 
            phone: phoneNumber,
            businessName: data.salonName,
            slug: data.slug,
            category: data.category,
            address: data.address,
        });
        setIsLoading(false);

        if (result.success) {
            router.push('/vendor-panel/dashboard');
        } else {
            businessForm.setError('salonName', { message: result.error as string || 'خطا در ثبت اطلاعات' });
        }
    };

    // ==================== ANIMATION VARIANTS ====================
    
    const containerVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.3, ease: 'easeOut' as const }
        },
        exit: { 
            opacity: 0, 
            x: -50,
            transition: { duration: 0.2 }
        }
    };

    // ==================== RENDER ====================
    
    return (
        <div className="h-screen flex" dir="rtl" suppressHydrationWarning>
            {/* LEFT SIDE: Decorative Panel (Desktop Only) */}
            <div className="hidden lg:flex lg:w-[40%] relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80"
                        alt="Salon Background"
                        fill
                        className="object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-slate-900/90 to-pink-900/80" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-12 py-16">
                    {/* Logo/Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-300 to-yellow-400 bg-clip-text text-transparent mb-4">
                            Elora
                        </h1>
                        <div className="w-20 h-1 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full mb-8" />
                    </motion.div>

                    {/* Headline */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
                    >
                        کسب‌وکارتان را<br />
                        آنلاین کنید
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-white/80 text-lg mb-12"
                    >
                        پلتفرم هوشمند مدیریت سالن‌های زیبایی
                    </motion.p>

                    {/* Benefits List */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-5"
                    >
                        {BENEFITS.map((benefit, idx) => {
                            const IconComponent = benefit.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + idx * 0.1 }}
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-yellow-500/20 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <IconComponent className="w-6 h-6 text-yellow-400" />
                                    </div>
                                    <span className="text-white text-lg font-medium">
                                        {benefit.text}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Decorative Elements */}
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-[100px]" />
                    <div className="absolute top-1/3 right-0 w-48 h-48 bg-yellow-500/10 rounded-full blur-[80px]" />
                </div>
            </div>

            {/* RIGHT SIDE: Form Container */}
            <div className="flex-1 bg-slate-950 relative overflow-hidden flex items-center justify-center p-4 lg:p-8">
                {/* Background Gradients */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px]" />
                </div>

                {/* Form Card */}
                <div className="relative z-10 w-full max-w-lg">
                    {/* Mobile Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:hidden text-center mb-6"
                    >
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-1">
                            Elora
                        </h1>
                        <p className="text-white/60 text-sm">ثبت‌نام صاحبان سالن</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl"
                    >
                        <AnimatePresence mode="wait">
                            {/* ==================== STEP 1: PHONE INPUT ==================== */}
                            {currentStep === 'PHONE_INPUT' && (
                                <motion.div
                                    key="phone"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                                            <Smartphone className="w-5 h-5 text-pink-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">ثبت‌نام سالن</h2>
                                            <p className="text-white/60 text-sm">شماره موبایل خود را وارد کنید</p>
                                        </div>
                                    </div>

                                    <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-white/80 mb-2">
                                                شماره موبایل
                                            </label>
                                            <input
                                                {...phoneForm.register('phone')}
                                                type="tel"
                                                placeholder="09123456789"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                                dir="ltr"
                                            />
                                            {phoneForm.formState.errors.phone && (
                                                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {phoneForm.formState.errors.phone.message}
                                                </p>
                                            )}
                                        </div>

                                        <Button 
                                            type="submit" 
                                            disabled={isLoading}
                                            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0 shadow-[0_0_20px_rgba(236,72,153,0.3)] disabled:opacity-50"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    در حال ارسال...
                                                </>
                                            ) : (
                                                <>
                                                    دریافت کد تایید
                                                    <ArrowRight className="w-4 h-4" />
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </motion.div>
                            )}

                            {/* ==================== STEP 2: OTP VERIFICATION ==================== */}
                            {currentStep === 'OTP_VERIFY' && (
                                <motion.div
                                    key="otp"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    {/* MVP Alert */}
                                    {showMvpAlert && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mb-6 bg-amber-500/20 border border-amber-500/50 rounded-xl p-4 relative"
                                        >
                                            <button 
                                                onClick={() => setShowMvpAlert(false)}
                                                className="absolute top-2 left-2 text-amber-300 hover:text-amber-100"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <div className="flex gap-3">
                                                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-amber-200 font-semibold text-sm mb-1">
                                                        نسخه آزمایشی (MVP)
                                                    </p>
                                                    <p className="text-amber-300/90 text-xs">
                                                        کد تایید: <span className="font-mono font-bold text-amber-100">{receivedOtp}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                                            <CheckCircle className="w-5 h-5 text-cyan-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">تأیید شماره</h2>
                                            <p className="text-white/60 text-sm">
                                                کد ارسال شده به <span className="text-pink-400 font-mono">{phoneNumber}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-white/80 mb-2">
                                                کد تأیید 5 رقمی
                                            </label>
                                            <input
                                                {...otpForm.register('otp')}
                                                type="text"
                                                placeholder="12345"
                                                maxLength={5}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-center text-2xl font-mono tracking-widest placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                                dir="ltr"
                                            />
                                            {otpForm.formState.errors.otp && (
                                                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {otpForm.formState.errors.otp.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-3">
                                            <Button 
                                                type="button"
                                                onClick={() => setCurrentStep('PHONE_INPUT')}
                                                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                                            >
                                                بازگشت
                                            </Button>
                                            <Button 
                                                type="submit" 
                                                disabled={isLoading}
                                                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        تأیید...
                                                    </>
                                                ) : (
                                                    <>
                                                        تأیید کد
                                                        <ArrowRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {/* ==================== STEP 3: BUSINESS SETUP ==================== */}
                            {currentStep === 'BUSINESS_SETUP' && (
                                <motion.div
                                    key="business"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-2"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
                                            <Store className="w-5 h-5 text-yellow-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">اطلاعات سالن</h2>
                                            <p className="text-white/60 text-sm">مشخصات کسب‌وکار خود را وارد کنید</p>
                                        </div>
                                    </div>

                                    <form onSubmit={businessForm.handleSubmit(handleBusinessSubmit)} className="space-y-4">
                                        {/* Owner Full Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-white/80 mb-2">
                                                نام و نام خانوادگی صاحب سالن
                                            </label>
                                            <input
                                                {...businessForm.register('ownerFullName')}
                                                type="text"
                                                placeholder="مریم کریمی"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                                            />
                                            {businessForm.formState.errors.ownerFullName && (
                                                <p className="text-red-400 text-xs mt-1">{businessForm.formState.errors.ownerFullName.message}</p>
                                            )}
                                        </div>

                                        {/* Salon Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-white/80 mb-2">
                                                نام سالن
                                            </label>
                                            <input
                                                {...businessForm.register('salonName')}
                                                onChange={handleSalonNameChange}
                                                type="text"
                                                placeholder="سالن زیبایی مریم"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                                            />
                                            {businessForm.formState.errors.salonName && (
                                                <p className="text-red-400 text-xs mt-1">{businessForm.formState.errors.salonName.message}</p>
                                            )}
                                        </div>

                                        {/* Slug (URL) */}
                                        <div>
                                            <label className="block text-sm font-medium text-white/80 mb-2">
                                                آدرس اختصاصی (URL)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute right-3 top-3 text-white/40 text-sm">
                                                    elora.ir/vendor/
                                                </span>
                                                <input
                                                    {...businessForm.register('slug')}
                                                    type="text"
                                                    placeholder="salon-maryam"
                                                    className="w-full px-4 py-3 pr-[140px] bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                                                    dir="ltr"
                                                />
                                            </div>
                                            <p className="text-white/40 text-xs mt-1">
                                                فقط حروف انگلیسی کوچک، اعداد و خط تیره
                                            </p>
                                            {businessForm.formState.errors.slug && (
                                                <p className="text-red-400 text-xs mt-1">{businessForm.formState.errors.slug.message}</p>
                                            )}
                                        </div>

                                        {/* Category */}
                                        <div>
                                            <label className="block text-sm font-medium text-white/80 mb-2">
                                                دسته‌بندی خدمات
                                            </label>
                                            <select
                                                {...businessForm.register('category')}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-slate-950">انتخاب کنید</option>
                                                {CATEGORIES.map(cat => (
                                                    <option key={cat.value} value={cat.value} className="bg-slate-950">
                                                        {cat.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {businessForm.formState.errors.category && (
                                                <p className="text-red-400 text-xs mt-1">{businessForm.formState.errors.category.message}</p>
                                            )}
                                        </div>

                                        {/* Address */}
                                        <div>
                                            <label className="block text-sm font-medium text-white/80 mb-2">
                                                آدرس کامل سالن
                                            </label>
                                            <textarea
                                                {...businessForm.register('address')}
                                                rows={3}
                                                placeholder="تهران، خیابان ولیعصر، نرسیده به میدان ونک..."
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none"
                                            />
                                            {businessForm.formState.errors.address && (
                                                <p className="text-red-400 text-xs mt-1">{businessForm.formState.errors.address.message}</p>
                                            )}
                                        </div>

                                        <Button 
                                            type="submit" 
                                            disabled={isLoading}
                                            className="w-full bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 hover:from-yellow-600 hover:via-pink-600 hover:to-purple-700 border-0 shadow-[0_0_25px_rgba(234,179,8,0.4)] disabled:opacity-50"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    در حال ثبت...
                                                </>
                                            ) : (
                                                <>
                                                    تکمیل ثبت‌نام
                                                    <CheckCircle className="w-4 h-4" />
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Footer Note */}
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center text-white/40 text-xs mt-6"
                    >
                        با ثبت‌نام، <span className="text-yellow-400">شرایط و قوانین</span> استفاده از خدمات را می‌پذیرید
                    </motion.p>
                </div>
            </div>
        </div>
    );
}
