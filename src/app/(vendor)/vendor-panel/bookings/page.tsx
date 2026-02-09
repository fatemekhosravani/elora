'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, X, Calendar, Users, Tag } from 'lucide-react';
import { ColumnFiltersState } from '@tanstack/react-table';
import { columns, Booking, BookingStatus, STATUS_CONFIG } from './columns';
import { DataTable } from '@/components/vendor/data-table';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

// ==================== MOCK DATA ====================

const BOOKINGS_DATA: Booking[] = [
    {
        id: '1',
        bookingCode: '#BK-902',
        clientName: 'نازنین رضایی',
        clientPhone: '09121234567',
        serviceName: 'کراتینه مو + رنگ هایلایت',
        staffName: 'کیمیا خسروانی',
        date: '2026/02/05',
        time: '10:00',
        price: 850000,
        status: 'CONFIRMED',
        paymentStatus: 'DEPOSIT',
    },
    {
        id: '2',
        bookingCode: '#BK-903',
        clientName: 'سارا احمدی',
        clientPhone: '09129876543',
        serviceName: 'رنگ مو کامل',
        staffName: 'سارا محمدی',
        date: '2026/02/05',
        time: '14:00',
        price: 650000,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
    },
    {
        id: '3',
        bookingCode: '#BK-904',
        clientName: 'مریم نوری',
        clientPhone: '09351234567',
        serviceName: 'مانیکور ژلیش',
        staffName: 'مریم احمدی',
        date: '2026/02/04',
        time: '09:00',
        price: 280000,
        status: 'COMPLETED',
        paymentStatus: 'PAID',
    },
    {
        id: '4',
        bookingCode: '#BK-905',
        clientName: 'پریسا محمدی',
        clientPhone: '09191234567',
        serviceName: 'کاشت ناخن',
        staffName: 'مریم احمدی',
        date: '2026/02/04',
        time: '15:00',
        price: 450000,
        status: 'COMPLETED',
        paymentStatus: 'PAID',
    },
    {
        id: '5',
        bookingCode: '#BK-906',
        clientName: 'فاطمه حسینی',
        clientPhone: '09381234567',
        serviceName: 'میکاپ مجلسی',
        staffName: 'کیمیا خسروانی',
        date: '2026/02/03',
        time: '16:00',
        price: 1200000,
        status: 'NO_SHOW',
        paymentStatus: 'DEPOSIT',
    },
    {
        id: '6',
        bookingCode: '#BK-907',
        clientName: 'زهرا موسوی',
        clientPhone: '09121234568',
        serviceName: 'اصلاح صورت',
        staffName: 'سارا محمدی',
        date: '2026/02/06',
        time: '11:00',
        price: 180000,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
    },
    {
        id: '7',
        bookingCode: '#BK-908',
        clientName: 'لیلا کریمی',
        clientPhone: '09129876544',
        serviceName: 'کوتاهی مو',
        staffName: 'کیمیا خسروانی',
        date: '2026/02/06',
        time: '13:30',
        price: 150000,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
    },
    {
        id: '8',
        bookingCode: '#BK-909',
        clientName: 'مینا رستمی',
        clientPhone: '09351234568',
        serviceName: 'پدیکور ژلیش',
        staffName: 'مریم احمدی',
        date: '2026/02/05',
        time: '10:30',
        price: 320000,
        status: 'CONFIRMED',
        paymentStatus: 'DEPOSIT',
    },
    {
        id: '9',
        bookingCode: '#BK-910',
        clientName: 'نرگس اکبری',
        clientPhone: '09191234568',
        serviceName: 'رنگ ابرو',
        staffName: 'سارا محمدی',
        date: '2026/02/04',
        time: '12:00',
        price: 220000,
        status: 'COMPLETED',
        paymentStatus: 'PAID',
    },
    {
        id: '10',
        bookingCode: '#BK-911',
        clientName: 'شیرین یزدانی',
        clientPhone: '09381234568',
        serviceName: 'میکاپ روزانه',
        staffName: 'کیمیا خسروانی',
        date: '2026/02/03',
        time: '09:30',
        price: 500000,
        status: 'CANCELLED',
        paymentStatus: 'UNPAID',
    },
    {
        id: '11',
        bookingCode: '#BK-912',
        clientName: 'مهسا قاسمی',
        clientPhone: '09121234569',
        serviceName: 'فر مو',
        staffName: 'کیمیا خسروانی',
        date: '2026/02/07',
        time: '14:00',
        price: 750000,
        status: 'CONFIRMED',
        paymentStatus: 'DEPOSIT',
    },
    {
        id: '12',
        bookingCode: '#BK-913',
        clientName: 'ریحانه صادقی',
        clientPhone: '09129876545',
        serviceName: 'لیزر موهای زائد',
        staffName: 'سارا محمدی',
        date: '2026/02/07',
        time: '15:30',
        price: 950000,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
    },
    {
        id: '13',
        bookingCode: '#BK-914',
        clientName: 'آیدا محمودی',
        clientPhone: '09351234569',
        serviceName: 'کاشت مژه',
        staffName: 'مریم احمدی',
        date: '2026/02/06',
        time: '09:00',
        price: 680000,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
    },
    {
        id: '14',
        bookingCode: '#BK-915',
        clientName: 'پانته‌آ رحیمی',
        clientPhone: '09191234569',
        serviceName: 'لیفت مژه',
        staffName: 'سارا محمدی',
        date: '2026/02/05',
        time: '16:00',
        price: 380000,
        status: 'COMPLETED',
        paymentStatus: 'PAID',
    },
    {
        id: '15',
        bookingCode: '#BK-916',
        clientName: 'الهام نجفی',
        clientPhone: '09381234569',
        serviceName: 'میکرو بلیدینگ',
        staffName: 'مریم احمدی',
        date: '2026/02/08',
        time: '10:00',
        price: 1500000,
        status: 'CONFIRMED',
        paymentStatus: 'DEPOSIT',
    },
    {
        id: '16',
        bookingCode: '#BK-917',
        clientName: 'سمیرا جعفری',
        clientPhone: '09121234570',
        serviceName: 'ماساژ صورت',
        staffName: 'کیمیا خسروانی',
        date: '2026/02/08',
        time: '11:30',
        price: 420000,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
    },
    {
        id: '17',
        bookingCode: '#BK-918',
        clientName: 'هانیه طاهری',
        clientPhone: '09129876546',
        serviceName: 'اکستنشن مو',
        staffName: 'سارا محمدی',
        date: '2026/02/09',
        time: '13:00',
        price: 2100000,
        status: 'CONFIRMED',
        paymentStatus: 'DEPOSIT',
    },
    {
        id: '18',
        bookingCode: '#BK-919',
        clientName: 'دیانا امینی',
        clientPhone: '09351234570',
        serviceName: 'بوتاکس مو',
        staffName: 'کیمیا خسروانی',
        date: '2026/02/09',
        time: '15:00',
        price: 890000,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
    },
    {
        id: '19',
        bookingCode: '#BK-920',
        clientName: 'سوگند باقری',
        clientPhone: '09191234570',
        serviceName: 'ویتامینه مو',
        staffName: 'سارا محمدی',
        date: '2026/02/10',
        time: '10:00',
        price: 620000,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
    },
    {
        id: '20',
        bookingCode: '#BK-921',
        clientName: 'مهرناز کاظمی',
        clientPhone: '09381234570',
        serviceName: 'هایلایت مو',
        staffName: 'کیمیا خسروانی',
        date: '2026/02/10',
        time: '14:00',
        price: 780000,
        status: 'CONFIRMED',
        paymentStatus: 'DEPOSIT',
    },
];

const STAFF_LIST = ['کیمیا خسروانی', 'سارا محمدی', 'مریم احمدی'];

// ==================== FILTER TAG COMPONENT ====================

interface FilterTagProps {
    label: string;
    value: string;
    onRemove: () => void;
}

function FilterTag({ label, value, onRemove }: FilterTagProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-sm text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
        >
            <span className="font-medium">{label}:</span>
            <span className="font-bold">{value}</span>
            <button
                onClick={onRemove}
                className="w-4 h-4 flex items-center justify-center hover:bg-cyan-500/20 rounded-full transition-colors"
            >
                <X className="w-3 h-3" />
            </button>
        </motion.div>
    );
}

// ==================== MAIN PAGE COMPONENT ====================

export default function BookingsPage() {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    // Extract active filters for tags
    const activeStaffFilter = columnFilters.find((f) => f.id === 'staffName');
    const activeStatusFilter = columnFilters.find((f) => f.id === 'status');

    const removeFilter = (columnId: string) => {
        setColumnFilters((prev) => prev.filter((f) => f.id !== columnId));
    };

    const removeStatusValue = (statusToRemove: BookingStatus) => {
        setColumnFilters((prev) =>
            prev.map((filter) => {
                if (filter.id === 'status') {
                    const newValue = (filter.value as BookingStatus[]).filter(
                        (s) => s !== statusToRemove
                    );
                    return newValue.length > 0
                        ? { ...filter, value: newValue }
                        : null;
                }
                return filter;
            }).filter(Boolean) as ColumnFiltersState
        );
    };

    const toggleStatusFilter = (status: BookingStatus) => {
        setColumnFilters((prev) => {
            const existingFilter = prev.find((f) => f.id === 'status');
            if (existingFilter) {
                const currentValues = existingFilter.value as BookingStatus[];
                const newValues = currentValues.includes(status)
                    ? currentValues.filter((s) => s !== status)
                    : [...currentValues, status];

                if (newValues.length === 0) {
                    return prev.filter((f) => f.id !== 'status');
                }

                return prev.map((f) =>
                    f.id === 'status' ? { ...f, value: newValues } : f
                );
            } else {
                return [...prev, { id: 'status', value: [status] }];
            }
        });
    };

    const setStaffFilter = (staff: string) => {
        setColumnFilters((prev) => {
            const existingFilter = prev.find((f) => f.id === 'staffName');
            if (existingFilter) {
                return prev.filter((f) => f.id !== 'staffName');
            }
            return [...prev, { id: 'staffName', value: staff }];
        });
    };

    // Calculate stats
    const totalBookings = BOOKINGS_DATA.length;
    const totalRevenue = BOOKINGS_DATA.reduce((sum, b) => sum + b.price, 0);
    const completedCount = BOOKINGS_DATA.filter((b) => b.status === 'COMPLETED').length;
    const pendingCount = BOOKINGS_DATA.filter((b) => b.status === 'PENDING').length;

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
                    className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                    }}
                    transition={{ duration: 25, repeat: Infinity }}
                    className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[150px]"
                />
            </div>

            <div className="relative z-10 container mx-auto px-6 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-2">
                        دفتر کل رزروها
                    </h1>
                    <p className="text-white/60">سوابق تراکنش‌های زمان</p>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-4 gap-4 mb-6"
                >
                    <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl p-4">
                        <p className="text-white/60 text-xs mb-1">کل رزروها</p>
                        <p className="text-2xl font-bold font-mono text-white">{totalBookings}</p>
                    </div>
                    <div className="bg-slate-900/50 backdrop-blur-md border border-emerald-500/30 rounded-xl p-4">
                        <p className="text-emerald-300/80 text-xs mb-1">تکمیل شده</p>
                        <p className="text-2xl font-bold font-mono text-emerald-400">
                            {completedCount}
                        </p>
                    </div>
                    <div className="bg-slate-900/50 backdrop-blur-md border border-yellow-500/30 rounded-xl p-4">
                        <p className="text-yellow-300/80 text-xs mb-1">در انتظار</p>
                        <p className="text-2xl font-bold font-mono text-yellow-400">
                            {pendingCount}
                        </p>
                    </div>
                    <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl p-4">
                        <p className="text-white/60 text-xs mb-1">کل درآمد</p>
                        <p className="text-2xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                            {(totalRevenue / 1000000).toFixed(1)}M
                        </p>
                    </div>
                </motion.div>

                {/* Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-4 flex items-center gap-3 flex-wrap"
                >
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-cyan-400" />
                        <span className="text-white/70 font-medium">فیلترها:</span>
                    </div>

                    {/* Staff Filter */}
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className="px-4 py-2 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-lg hover:border-cyan-500/50 transition-all flex items-center gap-2 text-white/80 hover:text-white">
                                <Users className="w-4 h-4" />
                                <span className="text-sm">پرسنل</span>
                            </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                align="start"
                                sideOffset={5}
                                className="min-w-[200px] bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl p-1.5 z-50"
                            >
                                <div dir="rtl">
                                    {STAFF_LIST.map((staff) => (
                                        <DropdownMenu.Item
                                            key={staff}
                                            onClick={() => setStaffFilter(staff)}
                                            className="px-3 py-2 rounded-lg hover:bg-cyan-500/10 hover:text-cyan-400 text-white/80 cursor-pointer transition-colors outline-none text-sm"
                                        >
                                            {staff}
                                        </DropdownMenu.Item>
                                    ))}
                                </div>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>

                    {/* Status Filter */}
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className="px-4 py-2 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-lg hover:border-cyan-500/50 transition-all flex items-center gap-2 text-white/80 hover:text-white">
                                <Tag className="w-4 h-4" />
                                <span className="text-sm">وضعیت</span>
                            </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                align="start"
                                sideOffset={5}
                                className="min-w-[200px] bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl p-1.5 z-50"
                            >
                                <div dir="rtl">
                                    {Object.entries(STATUS_CONFIG).map(([status, config]) => {
                                    const isSelected = (
                                        activeStatusFilter?.value as BookingStatus[] | undefined
                                    )?.includes(status as BookingStatus);
                                    return (
                                        <DropdownMenu.Item
                                            key={status}
                                            onClick={() => toggleStatusFilter(status as BookingStatus)}
                                            className={`px-3 py-2 rounded-lg cursor-pointer transition-colors outline-none text-sm flex items-center justify-between ${
                                                isSelected
                                                    ? `${config.bg} ${config.text}`
                                                    : 'text-white/80 hover:bg-white/5'
                                            }`}
                                        >
                                            <span>{config.label}</span>
                                            {isSelected && (
                                                <div className="w-2 h-2 rounded-full bg-current" />
                                            )}
                                        </DropdownMenu.Item>
                                    );
                                })}
                                </div>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </motion.div>

                {/* Active Filter Tags */}
                {columnFilters.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-4 flex items-center gap-2 flex-wrap"
                    >
                        {activeStaffFilter && (
                            <FilterTag
                                label="پرسنل"
                                value={activeStaffFilter.value as string}
                                onRemove={() => removeFilter('staffName')}
                            />
                        )}
                        {activeStatusFilter &&
                            (activeStatusFilter.value as BookingStatus[]).map((status) => (
                                <FilterTag
                                    key={status}
                                    label="وضعیت"
                                    value={STATUS_CONFIG[status].label}
                                    onRemove={() => removeStatusValue(status)}
                                />
                            ))}
                    </motion.div>
                )}

                {/* Data Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <DataTable
                        columns={columns}
                        data={BOOKINGS_DATA}
                        columnFilters={columnFilters}
                        onColumnFiltersChange={setColumnFilters}
                    />
                </motion.div>
            </div>
        </div>
    );
}
