'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface GrowthData {
    month: string;
    users: number;
    vendors: number;
}

interface GrowthChartProps {
    data: GrowthData[];
}

export function GrowthChart({ data }: GrowthChartProps) {
    if (data.length === 0) {
        return (
            <div className="w-full h-80 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                <p className="text-slate-400">داده‌ای برای نمایش وجود ندارد</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">رشد کاربران و سالن‌ها</h3>
            <ResponsiveContainer width="100%" height={320}>
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                        dataKey="month" 
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis 
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        labelStyle={{ color: '#0f172a', fontWeight: 600, marginBottom: '4px' }}
                        formatter={(value: number | undefined) => [
                            new Intl.NumberFormat('fa-IR').format(value ?? 0),
                            ''
                        ]}
                    />
                    <Bar dataKey="users" fill="#0f172a" name="کاربران" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="vendors" fill="#4f46e5" name="سالن‌ها" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-slate-900"></div>
                    <span className="text-sm text-slate-600">کاربران</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-indigo-600"></div>
                    <span className="text-sm text-slate-600">سالن‌ها</span>
                </div>
            </div>
        </div>
    );
}
