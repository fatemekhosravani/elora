import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
    icon: LucideIcon;
}

export function StatCard({ label, value, trend, trendUp, icon: Icon }: StatCardProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-slate-700" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                        trendUp ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                        {trendUp ? (
                            <TrendingUp className="w-4 h-4" />
                        ) : (
                            <TrendingDown className="w-4 h-4" />
                        )}
                        <span>{trend}</span>
                    </div>
                )}
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-900 mb-1">
                    {typeof value === 'number' 
                        ? new Intl.NumberFormat('fa-IR').format(value)
                        : value
                    }
                </p>
                <p className="text-sm text-slate-500">{label}</p>
            </div>
        </div>
    );
}
