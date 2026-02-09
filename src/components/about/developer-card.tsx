'use client';

import { motion } from 'framer-motion';
import { Code, GraduationCap, Sparkles } from 'lucide-react';
import Image from 'next/image';

export function DeveloperCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
            className="relative mx-auto max-w-2xl"
        >
            {/* Glassmorphism Card */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl md:p-12">
                {/* Gradient Orbs */}
                <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
                <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-pink-500/20 blur-3xl" />

                {/* Content */}
                <div className="relative z-10">
                    {/* Avatar */}
                    <div className="mb-6 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-purple-500 to-pink-500 blur-xl" />
                            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-xl">
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                                    <Code className="h-16 w-16 text-white" strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Name & Title */}
                    <div className="mb-6 text-center">
                        <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl">
                            فاطمه خسروانی
                        </h2>
                        <p className="mb-1 text-lg font-medium text-purple-400">
                            بنیان‌گذار و توسعه‌دهنده
                        </p>
                        <p className="text-sm text-gray-400">
                            Founder & Developer
                        </p>
                    </div>

                    {/* University Badge */}
                    <div className="mb-6 flex items-center justify-center gap-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
                        <GraduationCap className="h-6 w-6 text-indigo-400" />
                        <div className="text-right">
                            <p className="text-sm font-semibold text-white">
                                دانشجوی مهندسی کامپیوتر
                            </p>
                            <p className="text-xs text-gray-400">
                                موسسه آموزش عالی آپادانا
                            </p>
                        </div>
                    </div>

                    {/* Project Tag */}
                    <div className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-white shadow-lg">
                        <Sparkles className="h-5 w-5" />
                        <span className="text-sm font-medium">
                            پروژه کارشناسی / استارت‌آپ MVP
                        </span>
                    </div>

                    {/* Quote */}
                    <div className="mt-8 border-r-4 border-purple-500 pr-4 text-right">
                        <p className="italic text-gray-300">
                            "تکنولوژی وقتی معنادار می‌شود که زندگی را ساده‌تر کند."
                        </p>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full border-4 border-purple-500/20" />
            <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full border-4 border-pink-500/20" />
        </motion.div>
    );
}
