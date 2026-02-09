'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface IncomeData {
    name: string;
    value: number;
    color: string;
}

interface IncomeDonutProps {
    data: IncomeData[];
}

export function IncomeDonut({ data }: IncomeDonutProps) {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6 h-full"
        >
            <h3 className="text-lg font-bold text-white mb-4">توزیع درآمد</h3>

            <div className="relative" style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius="60%"
                            outerRadius="85%"
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    stroke="rgba(0,0,0,0)"
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0];
                                    const percentage = ((data.value as number / total) * 100).toFixed(1);
                                    return (
                                        <div className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-2xl">
                                            <p className="text-white/80 text-sm mb-1">{data.name}</p>
                                            <p className="text-white font-bold font-mono">
                                                {(data.value as number).toLocaleString('fa-IR')} تومان
                                            </p>
                                            <p className="text-white/60 text-xs mt-1">
                                                {percentage}% از کل
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Label */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <p className="text-xs text-white/50 mb-1">کل درآمد</p>
                        <p className="text-2xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">
                            {(total / 1000000).toFixed(1)}M
                        </p>
                    </div>
                </div>
            </div>

            {/* Custom Legend */}
            <div className="mt-6 space-y-2">
                {data.map((item, index) => {
                    const percentage = ((item.value / total) * 100).toFixed(1);
                    return (
                        <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                        backgroundColor: item.color,
                                        boxShadow: `0 0 10px ${item.color}40`,
                                    }}
                                />
                                <span className="text-white/80 text-sm">{item.name}</span>
                            </div>
                            <div className="text-left">
                                <p className="text-white font-mono text-sm font-bold">
                                    {percentage}%
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
