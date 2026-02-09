'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { WalletCard } from '@/components/vendor/wallet-card';
import { IncomeDonut } from '@/components/vendor/income-donut';
import { TransactionList, Transaction } from '@/components/vendor/transaction-list';

// ==================== MOCK DATA ====================

const WALLET_STATS = {
    available: 15400000,
    pending: 2300000,
    totalWithdrawn: 45000000,
};

const CHART_DATA = [
    { name: 'خدمات مو', value: 8500000, color: '#F59E0B' },
    { name: 'خدمات ناخن', value: 4200000, color: '#06B6D4' },
    { name: 'میکاپ', value: 3800000, color: '#A855F7' },
    { name: 'پوست و زیبایی', value: 2900000, color: '#EC4899' },
];

const TRANSACTIONS: Transaction[] = [
    {
        id: '1',
        txId: 'TX-8f3a2b9c4d5e6f7a8b9c0d1e2f3a4b5c',
        type: 'DEPOSIT',
        amount: 850000,
        date: '2026/02/04 14:30',
        status: 'COMPLETED',
        description: 'رزرو #BK-902 - نازنین رضایی',
    },
    {
        id: '2',
        txId: 'TX-7b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e',
        type: 'WITHDRAW',
        amount: 12000000,
        date: '2026/02/03 10:15',
        status: 'COMPLETED',
        description: 'تسویه حساب هفتگی',
    },
    {
        id: '3',
        txId: 'TX-6c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f',
        type: 'DEPOSIT',
        amount: 280000,
        date: '2026/02/04 09:15',
        status: 'COMPLETED',
        description: 'رزرو #BK-904 - مریم نوری',
    },
    {
        id: '4',
        txId: 'TX-5d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
        type: 'DEPOSIT',
        amount: 450000,
        date: '2026/02/04 15:20',
        status: 'COMPLETED',
        description: 'رزرو #BK-905 - پریسا محمدی',
    },
    {
        id: '5',
        txId: 'TX-4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
        type: 'DEPOSIT',
        amount: 650000,
        date: '2026/02/05 14:00',
        status: 'PENDING',
        description: 'رزرو #BK-903 - سارا احمدی',
    },
    {
        id: '6',
        txId: 'TX-3f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c',
        type: 'DEPOSIT',
        amount: 180000,
        date: '2026/02/06 11:00',
        status: 'PENDING',
        description: 'رزرو #BK-907 - زهرا موسوی',
    },
    {
        id: '7',
        txId: 'TX-2a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d',
        type: 'WITHDRAW',
        amount: 8500000,
        date: '2026/01/27 09:00',
        status: 'COMPLETED',
        description: 'تسویه حساب هفتگی',
    },
    {
        id: '8',
        txId: 'TX-1b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e',
        type: 'DEPOSIT',
        amount: 1200000,
        date: '2026/02/03 16:00',
        status: 'COMPLETED',
        description: 'رزرو #BK-906 - فاطمه حسینی (لغو شده)',
    },
    {
        id: '9',
        txId: 'TX-0c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f',
        type: 'DEPOSIT',
        amount: 320000,
        date: '2026/02/05 10:30',
        status: 'PENDING',
        description: 'رزرو #BK-909 - مینا رستمی',
    },
    {
        id: '10',
        txId: 'TX-9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a',
        type: 'WITHDRAW',
        amount: 15000000,
        date: '2026/01/20 11:30',
        status: 'COMPLETED',
        description: 'تسویه حساب هفتگی',
    },
];

// ==================== MAIN PAGE COMPONENT ====================

export default function FinancePage() {
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);

    const handleWithdraw = () => {
        console.log('Initiate withdrawal...');
        setShowWithdrawModal(true);
        // TODO: Implement actual withdrawal logic
    };

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden" dir="rtl">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]" />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                    }}
                    transition={{ duration: 25, repeat: Infinity }}
                    className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-yellow-600/10 rounded-full blur-[150px]"
                />
            </div>

            <div className="relative z-10 container mx-auto px-6 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 mb-2">
                        خزانه مالی
                    </h1>
                    <p className="text-white/60">مدیریت دارایی‌ها و تسویه حساب</p>
                </motion.div>

                {/* Top Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-3 gap-4 mb-6"
                >
                    <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-white/60 text-xs">موجودی قابل برداشت</p>
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <Wallet className="w-4 h-4 text-emerald-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold font-mono text-white">
                            {(WALLET_STATS.available / 1000000).toFixed(1)}M
                        </p>
                        <p className="text-xs text-white/40 mt-1">تومان</p>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-md border border-yellow-500/30 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-yellow-300/80 text-xs">در حال پردازش</p>
                            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-yellow-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold font-mono text-yellow-400">
                            {(WALLET_STATS.pending / 1000000).toFixed(1)}M
                        </p>
                        <p className="text-xs text-yellow-500/60 mt-1">تومان</p>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-white/60 text-xs">کل برداشت‌ها</p>
                            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                                <TrendingDown className="w-4 h-4 text-orange-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold font-mono text-white">
                            {(WALLET_STATS.totalWithdrawn / 1000000).toFixed(1)}M
                        </p>
                        <p className="text-xs text-white/40 mt-1">تومان</p>
                    </div>
                </motion.div>

                {/* Main Grid */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                    {/* Wallet Card (2 columns) */}
                    <div className="col-span-2">
                        <WalletCard
                            available={WALLET_STATS.available}
                            pending={WALLET_STATS.pending}
                            onWithdraw={handleWithdraw}
                        />
                    </div>

                    {/* Income Donut (1 column) */}
                    <div className="col-span-1">
                        <IncomeDonut data={CHART_DATA} />
                    </div>
                </div>

                {/* Transaction History */}
                <TransactionList transactions={TRANSACTIONS} />
            </div>

            {/* Withdraw Modal (Placeholder) */}
            {showWithdrawModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={() => setShowWithdrawModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-slate-900 border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <DollarSign className="w-8 h-8 text-amber-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">درخواست تسویه</h3>
                            <p className="text-white/60">
                                درخواست شما برای تسویه{' '}
                                <span className="text-amber-400 font-bold font-mono">
                                    {WALLET_STATS.available.toLocaleString('fa-IR')}
                                </span>{' '}
                                تومان ثبت می‌شود
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    console.log('Withdrawal confirmed');
                                    setShowWithdrawModal(false);
                                }}
                                className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-600 text-slate-900 rounded-xl font-bold hover:shadow-lg hover:shadow-amber-500/50 transition-all"
                            >
                                تایید و ارسال
                            </button>
                            <button
                                onClick={() => setShowWithdrawModal(false)}
                                className="w-full py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all"
                            >
                                انصراف
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
