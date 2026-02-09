'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueData {
    date: string;
    total: number;
    commission: number;
}

interface RevenueChartProps {
    data: RevenueData[];
}

export function RevenueChart({ data }: RevenueChartProps) {
    if (data.length === 0) {
        return (
            <div className="w-full h-80 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                <p className="text-slate-400">داده‌ای برای نمایش وجود ندارد</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">درآمد و کمیسیون</h3>
            <ResponsiveContainer width="100%" height={320}>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis 
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
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
                            new Intl.NumberFormat('fa-IR').format(value ?? 0) + ' تومان',
                            ''
                        ]}
                    />
                    <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#0f172a"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                        name="کل درآمد"
                    />
                    <Area
                        type="monotone"
                        dataKey="commission"
                        stroke="#4f46e5"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorCommission)"
                        name="کمیسیون"
                    />
                </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-slate-900"></div>
                    <span className="text-sm text-slate-600">کل درآمد</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-indigo-600"></div>
                    <span className="text-sm text-slate-600">کمیسیون</span>
                </div>
            </div>
        </div>
    );
}
