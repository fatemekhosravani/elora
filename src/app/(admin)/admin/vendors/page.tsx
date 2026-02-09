'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { Clock, X, CheckCircle, XCircle, FileImage } from 'lucide-react';

// ==================== TYPES ====================

type VendorStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface VendorRequest {
    id: string;
    salonName: string;
    ownerName: string;
    ownerPhone: string;
    address: string;
    registeredAt: string;
    status: VendorStatus;
    documents: string[]; // URLs to uploaded documents
}

// ==================== MOCK DATA ====================

const PENDING_REQUESTS: VendorRequest[] = [
    {
        id: '1',
        salonName: 'سالن زیبایی رز',
        ownerName: 'نازنین رضایی',
        ownerPhone: '09121234567',
        address: 'تهران، سعادت آباد',
        registeredAt: '2026/02/04 10:30',
        status: 'PENDING',
        documents: ['https://placeholder.com/doc1.jpg', 'https://placeholder.com/doc2.jpg'],
    },
    {
        id: '2',
        salonName: 'آرایشگاه لیلیوم',
        ownerName: 'سارا احمدی',
        ownerPhone: '09129876543',
        address: 'تهران، ولنجک',
        registeredAt: '2026/02/03 14:20',
        status: 'PENDING',
        documents: ['https://placeholder.com/doc3.jpg'],
    },
    {
        id: '3',
        salonName: 'کلینیک زیبایی پارسا',
        ownerName: 'مریم نوری',
        ownerPhone: '09351234567',
        address: 'تهران، نیاوران',
        registeredAt: '2026/02/02 09:15',
        status: 'APPROVED',
        documents: ['https://placeholder.com/doc4.jpg', 'https://placeholder.com/doc5.jpg'],
    },
    {
        id: '4',
        salonName: 'سالن هنر مو',
        ownerName: 'پریسا محمدی',
        ownerPhone: '09191234567',
        address: 'تهران، اقدسیه',
        registeredAt: '2026/02/01 16:45',
        status: 'REJECTED',
        documents: ['https://placeholder.com/doc6.jpg'],
    },
];

// ==================== STATUS BADGE ====================

function StatusBadge({ status }: { status: VendorStatus }) {
    const config = {
        PENDING: {
            label: 'در انتظار بررسی',
            className: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        },
        APPROVED: {
            label: 'تایید شده',
            className: 'bg-green-100 text-green-700 border-green-300',
        },
        REJECTED: {
            label: 'رد شده',
            className: 'bg-red-100 text-red-700 border-red-300',
        },
    };

    const { label, className } = config[status];

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${className}`}>
            {label}
        </span>
    );
}

// ==================== VERIFICATION MODAL ====================

interface VerificationModalProps {
    vendor: VendorRequest;
    onClose: () => void;
    onApprove: (id: string) => void;
    onReject: (id: string, reason: string) => void;
}

function VerificationModal({ vendor, onClose, onApprove, onReject }: VerificationModalProps) {
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectInput, setShowRejectInput] = useState(false);

    const handleReject = () => {
        if (!rejectReason.trim()) {
            alert('لطفا دلیل رد را وارد کنید');
            return;
        }
        onReject(vendor.id, rejectReason);
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                dir="rtl"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-slate-900">بررسی درخواست</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Vendor Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">نام سالن</p>
                            <p className="font-medium text-slate-900">{vendor.salonName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">مالک</p>
                            <p className="font-medium text-slate-900">{vendor.ownerName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">شماره تماس</p>
                            <p className="font-medium text-slate-900 font-mono" dir="ltr">{vendor.ownerPhone}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">تاریخ ثبت</p>
                            <p className="font-medium text-slate-900">{vendor.registeredAt}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs text-gray-500 mb-1">آدرس</p>
                            <p className="font-medium text-slate-900">{vendor.address}</p>
                        </div>
                    </div>

                    {/* Documents */}
                    <div>
                        <p className="text-sm font-semibold text-slate-900 mb-3">مدارک ارسال شده</p>
                        <div className="grid grid-cols-2 gap-4">
                            {vendor.documents.map((doc, index) => (
                                <div
                                    key={index}
                                    className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                                >
                                    <FileImage className="w-12 h-12 text-gray-400" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reject Reason Input */}
                    {showRejectInput && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-2"
                        >
                            <label className="text-sm font-medium text-slate-900">دلیل رد درخواست</label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="لطفا دلیل رد را توضیح دهید..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                                rows={3}
                            />
                        </motion.div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-6 border-t border-gray-200">
                    {!showRejectInput ? (
                        <>
                            <button
                                onClick={() => {
                                    onApprove(vendor.id);
                                    onClose();
                                }}
                                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-5 h-5" />
                                تایید سالن
                            </button>
                            <button
                                onClick={() => setShowRejectInput(true)}
                                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                <XCircle className="w-5 h-5" />
                                رد درخواست
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleReject}
                                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                            >
                                تایید رد درخواست
                            </button>
                            <button
                                onClick={() => {
                                    setShowRejectInput(false);
                                    setRejectReason('');
                                }}
                                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-slate-900 rounded-lg font-semibold transition-colors"
                            >
                                انصراف
                            </button>
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

// ==================== MAIN PAGE ====================

export default function VendorsPage() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [selectedVendor, setSelectedVendor] = useState<VendorRequest | null>(null);
    const [vendors, setVendors] = useState(PENDING_REQUESTS);

    const handleApprove = (id: string) => {
        console.log('Approve vendor:', id);
        setVendors((prev) =>
            prev.map((v) => (v.id === id ? { ...v, status: 'APPROVED' as VendorStatus } : v))
        );
    };

    const handleReject = (id: string, reason: string) => {
        console.log('Reject vendor:', id, 'Reason:', reason);
        setVendors((prev) =>
            prev.map((v) => (v.id === id ? { ...v, status: 'REJECTED' as VendorStatus } : v))
        );
    };

    const columns: ColumnDef<VendorRequest>[] = [
        {
            accessorKey: 'salonName',
            header: 'نام سالن',
            cell: ({ row }) => (
                <div>
                    <p className="font-semibold text-slate-900">{row.getValue('salonName')}</p>
                    <p className="text-xs text-gray-500">{row.original.address}</p>
                </div>
            ),
        },
        {
            accessorKey: 'ownerName',
            header: 'مالک',
            cell: ({ row }) => (
                <div>
                    <p className="font-medium text-slate-900">{row.getValue('ownerName')}</p>
                    <p className="text-xs text-gray-500 font-mono" dir="ltr">{row.original.ownerPhone}</p>
                </div>
            ),
        },
        {
            accessorKey: 'registeredAt',
            header: 'تاریخ ثبت',
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{row.getValue('registeredAt')}</span>
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
            cell: ({ row }) => (
                <button
                    onClick={() => setSelectedVendor(row.original)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    بررسی
                </button>
            ),
        },
    ];

    const table = useReactTable({
        data: vendors,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const pendingCount = vendors.filter((v) => v.status === 'PENDING').length;

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">تایید سالن‌ها</h1>
                <p className="text-gray-600">
                    {pendingCount} درخواست در انتظار بررسی
                </p>
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
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-slate-50 transition-colors h-16">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-6 py-4 text-sm">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                                        <p className="text-gray-600 font-medium">همه درخواست‌ها بررسی شده‌اند</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Verification Modal */}
            <AnimatePresence>
                {selectedVendor && (
                    <VerificationModal
                        vendor={selectedVendor}
                        onClose={() => setSelectedVendor(null)}
                        onApprove={handleApprove}
                        onReject={handleReject}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
