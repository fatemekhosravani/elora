'use client';

import { motion } from 'framer-motion';
import { ArrowDownCircle, ArrowUpCircle, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export type TransactionType = 'DEPOSIT' | 'WITHDRAW';
export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED';

export interface Transaction {
    id: string;
    txId: string;
    type: TransactionType;
    amount: number;
    date: string;
    status: TransactionStatus;
    description: string;
}

interface TransactionListProps {
    transactions: Transaction[];
}

function TxIdCell({ txId }: { txId: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(txId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Truncate: show first 6 and last 4 characters
    const truncated = txId.length > 12 ? `${txId.slice(0, 6)}...${txId.slice(-4)}` : txId;

    return (
        <button
            onClick={handleCopy}
            className="group flex items-center gap-2 font-mono text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            title={txId}
        >
            <span>{truncated}</span>
            {copied ? (
                <Check className="w-3 h-3 text-emerald-400" />
            ) : (
                <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
        </button>
    );
}

export function TransactionList({ transactions }: TransactionListProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden"
        >
            {/* Header */}
            <div className="border-b border-white/10 p-6">
                <h3 className="text-lg font-bold text-white">تاریخچه تراکنش‌ها</h3>
                <p className="text-white/50 text-sm mt-1">سوابق واریز و برداشت</p>
            </div>

            {/* Table */}
            {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full" dir="rtl">
                        <thead className="bg-slate-900/80 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    نوع
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    شناسه تراکنش
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    شرح
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    تاریخ
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    مبلغ
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    وضعیت
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactions.map((tx, index) => (
                                <motion.tr
                                    key={tx.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * index }}
                                    className="hover:bg-white/5 transition-colors"
                                >
                                    {/* Type */}
                                    <td className="px-6 py-4">
                                        {tx.type === 'DEPOSIT' ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                    <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
                                                </div>
                                                <span className="text-emerald-400 text-sm font-medium">
                                                    واریز
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                                                    <ArrowUpCircle className="w-4 h-4 text-orange-400" />
                                                </div>
                                                <span className="text-orange-400 text-sm font-medium">
                                                    برداشت
                                                </span>
                                            </div>
                                        )}
                                    </td>

                                    {/* TxID */}
                                    <td className="px-6 py-4">
                                        <TxIdCell txId={tx.txId} />
                                    </td>

                                    {/* Description */}
                                    <td className="px-6 py-4">
                                        <span className="text-white/70 text-sm">
                                            {tx.description}
                                        </span>
                                    </td>

                                    {/* Date */}
                                    <td className="px-6 py-4">
                                        <span className="text-white/50 text-sm font-mono">
                                            {tx.date}
                                        </span>
                                    </td>

                                    {/* Amount */}
                                    <td className="px-6 py-4">
                                        <div className="text-left">
                                            <p
                                                className={`font-mono font-bold text-sm ${
                                                    tx.type === 'DEPOSIT'
                                                        ? 'text-emerald-400'
                                                        : 'text-orange-400'
                                                }`}
                                            >
                                                {tx.type === 'DEPOSIT' ? '+' : '-'}
                                                {tx.amount.toLocaleString('fa-IR')}
                                            </p>
                                            <p className="text-xs text-white/40">تومان</p>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        {tx.status === 'COMPLETED' && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                                تکمیل شده
                                            </span>
                                        )}
                                        {tx.status === 'PENDING' && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                                                در حال پردازش
                                            </span>
                                        )}
                                        {tx.status === 'FAILED' && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                                                ناموفق
                                            </span>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="py-16 flex flex-col items-center justify-center">
                    <div className="relative mb-4">
                        <div className="w-20 h-20 rounded-full bg-slate-800/50 border-2 border-dashed border-white/10 flex items-center justify-center">
                            <svg
                                className="w-10 h-10 text-white/20"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-full blur-xl" />
                    </div>
                    <p className="text-white/60 font-bold mb-1">هنوز تراکنشی ثبت نشده</p>
                    <p className="text-white/40 text-sm">تراکنش‌های مالی شما اینجا نمایش داده می‌شود</p>
                </div>
            )}
        </motion.div>
    );
}
