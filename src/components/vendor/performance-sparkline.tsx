'use client';

import { ResponsiveContainer, LineChart, Line } from 'recharts';

interface PerformanceSparklineProps {
    data: { day: string; value: number }[];
}

export function PerformanceSparkline({ data }: PerformanceSparklineProps) {
    // Handle empty data case
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-12 flex items-center justify-center">
                <span className="text-white/40 text-xs">No Data</span>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={48}>
            <LineChart data={data}>
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={true}
                    animationDuration={1000}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
