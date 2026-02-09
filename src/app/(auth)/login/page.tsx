'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Smartphone, CheckCircle, User, AlertCircle, ArrowRight, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { sendOtp as sendOtpAction, verifyOtp as verifyOtpAction } from '@/actions/auth';

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

const profileSchema = z.object({
    firstName: z.string()
        .min(2, 'نام باید حداقل 2 حرف باشد')
        .regex(/^[\u0600-\u06FF\s]+$/, 'نام فقط باید شامل حروف فارسی باشد'),
    lastName: z.string()
        .min(2, 'نام خانوادگی باید حداقل 2 حرف باشد')
        .regex(/^[\u0600-\u06FF\s]+$/, 'نام خانوادگی فقط باید شامل حروف فارسی باشد'),
    birthDay: z.string().min(1, 'روز تولد را انتخاب کنید'),
    birthMonth: z.string().min(1, 'ماه تولد را انتخاب کنید'),
    birthYear: z.string().min(1, 'سال تولد را انتخاب کنید'),
});

type PhoneForm = z.infer<typeof phoneSchema>;
type OtpForm = z.infer<typeof otpSchema>;
type ProfileForm = z.infer<typeof profileSchema>;

// ==================== TYPES ====================

type Step = 'PHONE_INPUT' | 'OTP_VERIFY' | 'PROFILE_COMPLETION';

// ==================== CONSTANTS ====================

const PERSIAN_MONTHS = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 91 }, (_, i) => 1390 - i); // 1390 down to 1300

// ==================== HELPER FOR PROFILE COMPLETION ====================

async function completeProfile(data: ProfileForm & { phone: string }): Promise<{ success: boolean; error?: string }> {
    // TODO: Create a proper server action for profile completion
    // For now, just mock it
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✅ Profile completed:', data);
    return { success: true };
}

// ==================== MAIN COMPONENT ====================

export default function LoginPage() {
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
        const result = await sendOtpAction(data.phone);
        setIsLoading(false);

        if (result.success) {
            setPhoneNumber(data.phone);
            if (result.otp) {
                console.log('🔑 کد OTP:', result.otp);
                setReceivedOtp(result.otp);
            }
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
        const result = await verifyOtpAction(phoneNumber, data.otp);
        setIsLoading(false);

        if (result.success) {
            // Redirect based on user role
            const redirectPath = 
                result.role === 'ADMIN' ? '/admin/vendors' :
                result.role === 'VENDOR_OWNER' ? '/vendor-panel/dashboard' :
                '/panel'; // CUSTOMER
            
            window.location.href = redirectPath;
        } else {
            otpForm.setError('otp', { message: result.error || 'کد وارد شده صحیح نیست' });
        }
    };

    // ==================== STEP 3: PROFILE COMPLETION ====================
    
    const profileForm = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            birthDay: '',
            birthMonth: '',
            birthYear: ''
        }
    });

    const handleProfileSubmit = async (data: ProfileForm) => {
        setIsLoading(true);
        const result = await completeProfile({ ...data, phone: phoneNumber });
        setIsLoading(false);

        if (result.success) {
            router.push('/');
        } else {
            profileForm.setError('firstName', { message: result.error || 'خطا در ثبت اطلاعات' });
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
        <div className="h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center p-4" dir="rtl" suppressHydrationWarning>
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[100px]" />
            </div>

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-md">
                {/* Logo/Brand */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                        Elora
                    </h1>
                    <p className="text-white/60 text-sm">خوش آمدید</p>
                </motion.div>

                {/* Form Card */}
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
                                        <h2 className="text-xl font-bold text-white">ورود / ثبت‌نام</h2>
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
                                                ارسال کد تأیید
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
                                                    توجه: این نسخه آزمایشی (MVP) است
                                                </p>
                                                <p className="text-amber-300/90 text-xs">
                                                    کد ورود شما: <span className="font-mono font-bold text-amber-100">{receivedOtp}</span>
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
                                            کد ارسال شده به <span className="text-pink-400 font-mono">{phoneNumber}</span> را وارد کنید
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
                                                    در حال تأیید...
                                                </>
                                            ) : (
                                                <>
                                                    تأیید کد
                                                    <ArrowRight className="w-4 h-4" />
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={async () => {
                                            setIsLoading(true);
                                            const result = await sendOtpAction(phoneNumber);
                                            setIsLoading(false);
                                            if (result.success && result.otp) {
                                                console.log('🔑 کد OTP:', result.otp);
                                                setReceivedOtp(result.otp);
                                            }
                                        }}
                                        disabled={isLoading}
                                        className="w-full text-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50"
                                    >
                                        {isLoading ? 'در حال ارسال...' : 'ارسال مجدد کد'}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* ==================== STEP 3: PROFILE COMPLETION ==================== */}
                        {currentStep === 'PROFILE_COMPLETION' && (
                            <motion.div
                                key="profile"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                                        <User className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">تکمیل اطلاعات</h2>
                                        <p className="text-white/60 text-sm">اطلاعات خود را وارد کنید</p>
                                    </div>
                                </div>

                                <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2">
                                            نام
                                        </label>
                                        <input
                                            {...profileForm.register('firstName')}
                                            type="text"
                                            placeholder="کیمیا"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        />
                                        {profileForm.formState.errors.firstName && (
                                            <p className="text-red-400 text-xs mt-1">{profileForm.formState.errors.firstName.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2">
                                            نام خانوادگی
                                        </label>
                                        <input
                                            {...profileForm.register('lastName')}
                                            type="text"
                                            placeholder="خسروانی"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        />
                                        {profileForm.formState.errors.lastName && (
                                            <p className="text-red-400 text-xs mt-1">{profileForm.formState.errors.lastName.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2">
                                            تاریخ تولد
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {/* Day */}
                                            <select
                                                {...profileForm.register('birthDay')}
                                                className="px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-slate-950">روز</option>
                                                {DAYS.map(day => (
                                                    <option key={day} value={day} className="bg-slate-950">
                                                        {new Intl.NumberFormat('fa-IR').format(day)}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* Month */}
                                            <select
                                                {...profileForm.register('birthMonth')}
                                                className="px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-slate-950">ماه</option>
                                                {PERSIAN_MONTHS.map((month, idx) => (
                                                    <option key={idx} value={idx + 1} className="bg-slate-950">
                                                        {month}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* Year */}
                                            <select
                                                {...profileForm.register('birthYear')}
                                                className="px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-slate-950">سال</option>
                                                {YEARS.map(year => (
                                                    <option key={year} value={year} className="bg-slate-950">
                                                        {new Intl.NumberFormat('fa-IR').format(year)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {(profileForm.formState.errors.birthDay || 
                                          profileForm.formState.errors.birthMonth || 
                                          profileForm.formState.errors.birthYear) && (
                                            <p className="text-red-400 text-xs mt-1">
                                                {profileForm.formState.errors.birthDay?.message || 
                                                 profileForm.formState.errors.birthMonth?.message || 
                                                 profileForm.formState.errors.birthYear?.message}
                                            </p>
                                        )}
                                    </div>

                                    <Button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 border-0 shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50"
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
                    با ورود و ثبت‌نام، <span className="text-pink-400">شرایط و قوانین</span> استفاده از خدمات را می‌پذیرید
                </motion.p>
            </div>
        </div>
    );
}
