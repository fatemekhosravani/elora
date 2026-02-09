'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { BookingActions } from '@/components/vendor/booking-actions';

// ==================== TYPES ====================

export type BookingStatus = 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type PaymentStatus = 'PAID' | 'DEPOSIT' | 'UNPAID';

export interface Booking {
    id: string;
    bookingCode: string;
    clientName: string;
    clientPhone: string;
    serviceName: string;
    staffName: string;
    date: string;
    time: string;
    price: number;
    status: BookingStatus;
    paymentStatus: PaymentStatus;
}

// ==================== STATUS CONFIG ====================

export const STATUS_CONFIG: Record<
    BookingStatus,
    {
        label: string;
        bg: string;
        text: string;
        border: string;
        shadow: string;
    }
> = {
    CONFIRMED: {
        label: 'تایید شده',
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        shadow: 'shadow-[0_0_12px_rgba(59,130,246,0.15)]',
    },
    PENDING: {
        label: 'در انتظار',
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-400',
        border: 'border-yellow-500/30',
        shadow: 'shadow-[0_0_12px_rgba(234,179,8,0.15)]',
    },
    COMPLETED: {
        label: 'تکمیل شده',
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        shadow: 'shadow-[0_0_12px_rgba(16,185,129,0.15)]',
    },
    CANCELLED: {
        label: 'لغو شده',
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        border: 'border-red-500/30',
        shadow: 'shadow-[0_0_12px_rgba(239,68,68,0.15)]',
    },
    NO_SHOW: {
        label: 'غیبت',
        bg: 'bg-orange-500/10',
        text: 'text-orange-400',
        border: 'border-orange-500/30',
        shadow: 'shadow-[0_0_12px_rgba(249,115,22,0.15)]',
    },
};

export const PAYMENT_STATUS_CONFIG: Record<
    PaymentStatus,
    {
        label: string;
        color: string;
    }
> = {
    PAID: {
        label: 'پرداخت شده',
        color: 'text-emerald-400',
    },
    DEPOSIT: {
        label: 'بیعانه',
        color: 'text-yellow-400',
    },
    UNPAID: {
        label: 'پرداخت نشده',
        color: 'text-red-400',
    },
};

// ==================== COLUMN DEFINITIONS ====================

export const columns: ColumnDef<Booking>[] = [
    {
        accessorKey: 'bookingCode',
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                >
                    کد رزرو
                    <ArrowUpDown className="w-3 h-3" />
                </button>
            );
        },
        cell: ({ row }) => {
            const isNoShow = row.original.status === 'NO_SHOW';
            return (
                <span
                    className={`font-mono font-bold ${
                        isNoShow ? 'text-gray-500' : 'text-cyan-400'
                    }`}
                >
                    {row.getValue('bookingCode')}
                </span>
            );
        },
    },
    {
        accessorKey: 'clientName',
        header: 'مشتری',
        cell: ({ row }) => {
            const isNoShow = row.original.status === 'NO_SHOW';
            return (
                <div className={isNoShow ? 'text-gray-500' : ''}>
                    <p className="font-medium truncate max-w-[150px]" title={row.getValue('clientName')}>
                        {row.getValue('clientName')}
                    </p>
                    <p className="text-xs text-white/40 font-mono" dir="ltr">
                        {row.original.clientPhone}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: 'serviceName',
        header: 'سرویس',
        cell: ({ row }) => {
            const isNoShow = row.original.status === 'NO_SHOW';
            return (
                <span
                    className={`truncate max-w-[180px] block ${
                        isNoShow ? 'text-gray-500' : 'text-white/80'
                    }`}
                    title={row.getValue('serviceName')}
                >
                    {row.getValue('serviceName')}
                </span>
            );
        },
    },
    {
        accessorKey: 'staffName',
        header: 'پرسنل',
        cell: ({ row }) => {
            const isNoShow = row.original.status === 'NO_SHOW';
            return (
                <span className={isNoShow ? 'text-gray-500' : 'text-white/70'}>
                    {row.getValue('staffName')}
                </span>
            );
        },
    },
    {
        accessorKey: 'date',
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                >
                    تاریخ
                    <ArrowUpDown className="w-3 h-3" />
                </button>
            );
        },
        cell: ({ row }) => {
            const isNoShow = row.original.status === 'NO_SHOW';
            return (
                <div className={`font-mono text-sm ${isNoShow ? 'text-gray-500' : ''}`}>
                    <p>{row.getValue('date')}</p>
                    <p className="text-xs text-white/40">{row.original.time}</p>
                </div>
            );
        },
    },
    {
        accessorKey: 'price',
        header: ({ column }) => {
            return (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                >
                    مبلغ
                    <ArrowUpDown className="w-3 h-3" />
                </button>
            );
        },
        cell: ({ row }) => {
            const price = row.getValue('price') as number;
            const isNoShow = row.original.status === 'NO_SHOW';
            const paymentStatus = row.original.paymentStatus;
            const paymentConfig = PAYMENT_STATUS_CONFIG[paymentStatus];

            return (
                <div className={isNoShow ? 'text-gray-500' : ''}>
                    <p className="font-mono font-bold">
                        {price.toLocaleString('fa-IR')}
                        <span className="text-xs mr-1">تومان</span>
                    </p>
                    <p className={`text-xs ${paymentConfig.color}`}>
                        {paymentConfig.label}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'وضعیت',
        cell: ({ row }) => {
            const status = row.getValue('status') as BookingStatus;
            const config = STATUS_CONFIG[status];

            return (
                <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${config.bg} ${config.text} ${config.border} ${config.shadow}`}
                >
                    {config.label}
                </span>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        id: 'actions',
        header: 'عملیات',
        cell: ({ row }) => <BookingActions booking={row.original} />,
    },
];
