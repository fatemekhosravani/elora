'use client';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    SortingState,
    ColumnFiltersState,
    useReactTable,
    OnChangeFn,
} from '@tanstack/react-table';
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    columnFilters: ColumnFiltersState;
    onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    columnFilters,
    onColumnFiltersChange,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-md shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full" dir="rtl">
                    <thead className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-md border-b border-white/10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-white/5 transition-colors duration-150"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-6 py-4 text-sm text-white/90"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="h-64 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="relative">
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
                                                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-xl" />
                                        </div>
                                        <div>
                                            <p className="text-white/60 font-bold mb-1">
                                                هیچ تراکنشی یافت نشد
                                            </p>
                                            <p className="text-white/40 text-sm">
                                                فیلترها را تغییر دهید یا منتظر رزروهای جدید باشید
                                            </p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Results Count */}
            {table.getRowModel().rows?.length > 0 && (
                <div className="border-t border-white/10 px-6 py-3 bg-slate-900/30">
                    <p className="text-xs text-white/50">
                        <span className="font-mono text-cyan-400 font-bold">
                            {table.getFilteredRowModel().rows.length}
                        </span>
                        {' '}
                        نتیجه یافت شد
                    </p>
                </div>
            )}
        </div>
    );
}
