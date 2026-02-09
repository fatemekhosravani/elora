'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { Search, Ban, CheckCircle, Clock, ShieldAlert } from 'lucide-react';

// ==================== TYPES ====================

type UserStatus = 'ACTIVE' | 'BANNED';

interface User {
    id: string;
    fullName: string;
    phoneNumber: string;
    role: string;
    registeredAt: string;
    status: UserStatus;
    lastLogin?: string;
}

// ==================== MOCK DATA ====================

const USERS: User[] = [
    {
        id: '1',
        fullName: 'نازنین رضایی',
        phoneNumber: '09121234567',
        role: 'CUSTOMER',
        registeredAt: '2026/01/15',
        status: 'ACTIVE',
        lastLogin: '2026/02/04 10:30',
    },
    {
        id: '2',
        fullName: 'سارا احمدی',
        phoneNumber: '09129876543',
        role: 'VENDOR_OWNER',
        registeredAt: '2026/01/20',
        status: 'ACTIVE',
        lastLogin: '2026/02/03 14:20',
    },
    {
        id: '3',
        fullName: 'مریم نوری',
        phoneNumber: '09351234567',
        role: 'CUSTOMER',
        registeredAt: '2026/01/18',
        status: 'BANNED',
        lastLogin: '2026/01/25 09:15',
    },
    {
        id: '4',
        fullName: 'پریسا محمدی',
        phoneNumber: '09191234567',
        role: 'CUSTOMER',
        registeredAt: '2026/01/22',
        status: 'ACTIVE',
        lastLogin: '2026/02/04 16:45',
    },
    {
        id: '5',
        fullName: 'فاطمه حسینی',
        phoneNumber: '09381234567',
        role: 'VENDOR_OWNER',
        registeredAt: '2026/01/25',
        status: 'ACTIVE',
        lastLogin: '2026/02/02 11:20',
    },
    {
        id: '6',
        fullName: 'زهرا موسوی',
        phoneNumber: '09121234568',
        role: 'CUSTOMER',
        registeredAt: '2026/01/28',
        status: 'ACTIVE',
        lastLogin: '2026/02/04 08:15',
    },
    {
        id: '7',
        fullName: 'لیلا کریمی',
        phoneNumber: '09129876544',
        role: 'CUSTOMER',
        registeredAt: '2026/01/30',
        status: 'BANNED',
        lastLogin: '2026/01/31 12:30',
    },
    {
        id: '8',
        fullName: 'مینا رستمی',
        phoneNumber: '09351234568',
        role: 'CUSTOMER',
        registeredAt: '2026/02/01',
        status: 'ACTIVE',
        lastLogin: '2026/02/04 15:00',
    },
];

const SUPER_ADMIN_PHONE = '09385005077';

// ==================== ROLE BADGE ====================

function RoleBadge({ role }: { role: string }) {
    const config = {
        CUSTOMER: { label: 'مشتری', className: 'bg-blue-100 text-blue-700' },
        VENDOR_OWNER: { label: 'صاحب سالن', className: 'bg-purple-100 text-purple-700' },
        STAFF: { label: 'پرسنل', className: 'bg-teal-100 text-teal-700' },
        ADMIN: { label: 'ادمین', className: 'bg-red-100 text-red-700' },
    };

    const { label, className } = config[role as keyof typeof config] || config.CUSTOMER;

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${className}`}>
            {label}
        </span>
    );
}

// ==================== STATUS BADGE ====================

function StatusBadge({ status }: { status: UserStatus }) {
    return status === 'ACTIVE' ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            فعال
        </span>
    ) : (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
            <Ban className="w-3 h-3" />
            مسدود
        </span>
    );
}

// ==================== MAIN PAGE ====================

export default function UsersPage() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [users, setUsers] = useState(USERS);

    const handleToggleBan = (userId: string, currentStatus: UserStatus) => {
        const user = users.find((u) => u.id === userId);
        
        // Prevent self-ban for super admin
        if (user?.phoneNumber === SUPER_ADMIN_PHONE) {
            alert('امکان مسدود کردن ادمین اصلی وجود ندارد');
            return;
        }

        const newStatus: UserStatus = currentStatus === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
        setUsers((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
        );
        console.log(`User ${userId} status changed to ${newStatus}`);
    };

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: 'fullName',
            header: 'نام کاربر',
            cell: ({ row }) => (
                <div>
                    <p className="font-semibold text-slate-900">{row.getValue('fullName')}</p>
                    <p className="text-xs text-gray-500 font-mono" dir="ltr">
                        {row.original.phoneNumber}
                    </p>
                </div>
            ),
        },
        {
            accessorKey: 'role',
            header: 'نقش',
            cell: ({ row }) => <RoleBadge role={row.getValue('role')} />,
        },
        {
            accessorKey: 'registeredAt',
            header: 'تاریخ عضویت',
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">{row.getValue('registeredAt')}</span>
            ),
        },
        {
            accessorKey: 'lastLogin',
            header: 'آخرین ورود',
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{row.original.lastLogin || 'هرگز'}</span>
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'وضعیت',
            cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
        },
        {
            id: 'actions',
            header: 'عملیات',
            cell: ({ row }) => {
                const status = row.original.status;
                const isSuperAdmin = row.original.phoneNumber === SUPER_ADMIN_PHONE;

                return (
                    <button
                        onClick={() => handleToggleBan(row.original.id, status)}
                        disabled={isSuperAdmin}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            isSuperAdmin
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : status === 'ACTIVE'
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                    >
                        {isSuperAdmin ? 'محافظت شده' : status === 'ACTIVE' ? 'مسدود کردن' : 'رفع مسدودیت'}
                    </button>
                );
            },
        },
    ];

    const table = useReactTable({
        data: users,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: (row, columnId, filterValue) => {
            const searchValue = filterValue.toLowerCase();
            const fullName = row.original.fullName.toLowerCase();
            const phone = row.original.phoneNumber;
            return fullName.includes(searchValue) || phone.includes(searchValue);
        },
    });

    const activeCount = users.filter((u) => u.status === 'ACTIVE').length;
    const bannedCount = users.filter((u) => u.status === 'BANNED').length;

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">مدیریت کاربران</h1>
                <p className="text-gray-600">
                    {users.length} کاربر ({activeCount} فعال، {bannedCount} مسدود)
                </p>
            </div>

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <div className="relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="جستجو بر اساس نام یا شماره تلفن..."
                        className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">کل کاربران</p>
                            <p className="text-2xl font-bold text-slate-900">{users.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-slate-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-700 mb-1">کاربران فعال</p>
                            <p className="text-2xl font-bold text-green-700">{activeCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-700" />
                        </div>
                    </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-red-700 mb-1">کاربران مسدود</p>
                            <p className="text-2xl font-bold text-red-700">{bannedCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
                            <ShieldAlert className="w-6 h-6 text-red-700" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full" dir="rtl">
                    <thead className="bg-slate-50 border-b border-gray-200">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => {
                                const isBanned = row.original.status === 'BANNED';
                                return (
                                    <tr
                                        key={row.id}
                                        className={`h-16 transition-colors ${
                                            isBanned ? 'bg-red-50/50' : 'hover:bg-slate-50'
                                        }`}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="px-6 py-4 text-sm">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <Search className="w-12 h-12 text-gray-400 mb-3" />
                                        <p className="text-gray-600 font-medium">کاربری یافت نشد</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
