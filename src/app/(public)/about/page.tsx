'use client';

import { motion } from 'framer-motion';
import { Heart, Code, Zap, Mail, Target, Users, Sparkles, GraduationCap } from 'lucide-react';
import { DeveloperCard } from '@/components/about/developer-card';
import Link from 'next/link';

export default function AboutPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
        },
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Animated gradient background matching landing page theme */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0f_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000,transparent)]" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative"
            >
                {/* Hero Section with Developer Credit */}
                <section className="px-6 pb-16 pt-24 md:pt-32">
                    <motion.div variants={itemVariants} className="container mx-auto">
                        {/* Main Headline */}
                        <div className="mb-16 text-center">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-6 py-3 text-sm font-medium text-purple-300 backdrop-blur-sm"
                            >
                                <Sparkles className="h-4 w-4" />
                                درباره الورا
                            </motion.div>
                            
                            <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-6xl">
                                الورا؛ جایی که تکنولوژی
                                <br />
                                <span className="bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    به خدمت زیبایی در می‌آید
                                </span>
                            </h1>
                            
                            <p className="mx-auto max-w-2xl text-lg text-gray-400 md:text-xl">
                                پلتفرمی نوین برای رزرو آنلاین خدمات زیبایی
                                <br />
                                ساخته شده با دقت و علاقه
                            </p>
                        </div>

                        {/* Developer Card */}
                        <DeveloperCard />
                    </motion.div>
                </section>

                {/* Vision Section */}
                <motion.section variants={itemVariants} className="px-6 py-20">
                    <div className="container mx-auto">
                        <div className="grid items-center gap-12 md:grid-cols-2">
                            {/* Right: Text Content */}
                            <div className="order-2 text-right md:order-1">
                                <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                                    چرا الورا؟
                                </h2>
                                <div className="space-y-6 text-lg leading-relaxed text-gray-300">
                                    <p>
                                        ما در الورا باور داریم که <strong className="text-white">زمان شما ارزشمند است</strong>. دوران تماس‌های تلفنی مکرر و دفترچه‌های کاغذی به پایان رسیده است.
                                    </p>
                                    <p>
                                        الورا <span className="font-semibold text-purple-400">پلی است میان متخصصان زیبایی</span> که به هنر خود عشق می‌ورزند و <span className="font-semibold text-pink-400">مشتریانی که به دنبال بهترین تجربه‌ها هستند</span>.
                                    </p>
                                    <p>
                                        از جستجوی سالن مناسب تا رزرو آنلاین، از مدیریت نوبت‌ها تا پرداخت امن؛ همه چیز در یک پلتفرم یکپارچه.
                                    </p>
                                </div>

                                {/* Features Grid */}
                                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                                    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                        <div className="rounded-full bg-purple-500/20 p-2">
                                            <Users className="h-5 w-5 text-purple-400" />
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-white">برای مشتریان</p>
                                            <p className="text-sm text-gray-400">رزرو آسان و سریع</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                        <div className="rounded-full bg-pink-500/20 p-2">
                                            <Target className="h-5 w-5 text-pink-400" />
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-white">برای سالن‌ها</p>
                                            <p className="text-sm text-gray-400">مدیریت حرفه‌ای</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Left: Abstract Illustration */}
                            <div className="order-1 md:order-2">
                                <div className="relative">
                                    {/* Animated Gradient Blob */}
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.1, 1],
                                            rotate: [0, 5, 0],
                                        }}
                                        transition={{
                                            duration: 8,
                                            repeat: Infinity,
                                            ease: "easeInOut" as const,
                                        }}
                                        className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl"
                                    />
                                    
                                    {/* Icon Grid */}
                                    <div className="relative grid grid-cols-2 gap-6">
                                        {[
                                            { icon: Heart, color: 'from-pink-500 to-rose-500' },
                                            { icon: Zap, color: 'from-purple-500 to-indigo-500' },
                                            { icon: Target, color: 'from-indigo-500 to-blue-500' },
                                            { icon: Users, color: 'from-rose-500 to-pink-500' },
                                        ].map(({ icon: Icon, color }, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                                className="flex aspect-square items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm"
                                            >
                                                <div className={`rounded-2xl bg-gradient-to-br ${color} p-6`}>
                                                    <Icon className="h-12 w-12 text-white" strokeWidth={1.5} />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* MVP Explanation Section */}
                <motion.section variants={itemVariants} className="border-y border-white/10 px-6 py-20">
                    <div className="container mx-auto max-w-4xl text-center">
                        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-6 py-3 text-sm font-medium text-purple-300">
                            <Code className="h-4 w-4" />
                            Minimum Viable Product
                        </div>

                        <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                            نسخه MVP چیست؟
                        </h2>

                        <p className="mb-8 text-lg leading-relaxed text-gray-300">
                            این نسخه به عنوان <strong className="text-purple-400">MVP (کمینه محصول پذیرفتنی)</strong> طراحی شده است. 
                            هدف ما پیاده‌سازی زیرساخت‌های نوین رزرو آنلاین با استانداردهای جهانی است.
                        </p>

                        <div className="grid gap-6 text-right md:grid-cols-3">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                <div className="mb-4 inline-flex rounded-full bg-purple-500/20 p-3">
                                    <Zap className="h-6 w-6 text-purple-400" />
                                </div>
                                <h3 className="mb-2 font-bold text-white">پروژه استارت‌آپ</h3>
                                <p className="text-sm text-gray-400">
                                    ارائه شده با رویکرد استارت‌آپی و چشم‌انداز تجاری
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                <div className="mb-4 inline-flex rounded-full bg-pink-500/20 p-3">
                                    <Code className="h-6 w-6 text-pink-400" />
                                </div>
                                <h3 className="mb-2 font-bold text-white">تکنولوژی‌های مدرن</h3>
                                <p className="text-sm text-gray-400">
                                    Next.js 15, TypeScript, Prisma, و معماری مقیاس‌پذیر
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                <div className="mb-4 inline-flex rounded-full bg-indigo-500/20 p-3">
                                    <Sparkles className="h-6 w-6 text-indigo-400" />
                                </div>
                                <h3 className="mb-2 font-bold text-white">آماده برای رشد</h3>
                                <p className="text-sm text-gray-400">
                                    طراحی شده با دید بلندمدت و قابلیت توسعه
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Contact & Support Section */}
                <motion.section variants={itemVariants} className="px-6 py-20">
                    <div className="container mx-auto max-w-3xl">
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-sm md:p-12">
                            <div className="mb-6 text-center">
                                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                                    <Mail className="h-8 w-8 text-white" />
                                </div>
                                <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
                                    ارتباط با ما
                                </h2>
                                <p className="text-gray-400">
                                    نظرات و پیشنهادات شما برای ما ارزشمند است
                                </p>
                            </div>

                            <div className="space-y-4">
                                <a
                                    href="mailto:ftmkhosravanicollege@gmail.com"
                                    className="group flex items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 transition-all hover:border-purple-500 hover:bg-white/20"
                                >
                                    <Mail className="h-5 w-5 text-purple-400" />
                                    <span className="font-medium text-white group-hover:text-purple-300">
                                        ftmkhosravanicollege@gmail.com
                                    </span>
                                </a>

                                <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-6 text-center">
                                    <p className="text-sm text-gray-300">
                                        این پروژه با هدف ارائه راهکار نوین در حوزه زیبایی ایجاد شده است.
                                        <br />
                                        از صبر و حمایت شما سپاسگزاریم. 💜
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Back to Home CTA */}
                <motion.section variants={itemVariants} className="px-6 pb-20">
                    <div className="container mx-auto text-center">
                        <Link
                            href="/landing"
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                        >
                            بازگشت به صفحه اصلی
                            <Heart className="h-5 w-5" />
                        </Link>
                    </div>
                </motion.section>
            </motion.div>
        </div>
    );
}
