import Link from 'next/link';
import { Clock } from 'lucide-react';

interface Activity {
    id: number;
    text: string;
    type: 'vendor' | 'payout' | 'report' | 'booking';
    time: string;
    link?: string;
}

interface ActivityFeedProps {
    activities: Activity[];
}

const typeColors = {
    vendor: 'bg-blue-50 text-blue-700 border-blue-200',
    payout: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    report: 'bg-amber-50 text-amber-700 border-amber-200',
    booking: 'bg-purple-50 text-purple-700 border-purple-200',
};

const typeLabels = {
    vendor: 'سالن',
    payout: 'پرداخت',
    report: 'گزارش',
    booking: 'رزرو',
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">فعالیت‌های اخیر</h3>
            </div>
            <div className="divide-y divide-slate-100">
                {activities.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-slate-400">هیچ فعالیت اخیری وجود ندارد</p>
                    </div>
                ) : (
                    activities.map((activity) => (
                        <div key={activity.id} className="p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-start gap-3">
                                <span className={`px-2 py-1 rounded text-xs font-medium border ${typeColors[activity.type]}`}>
                                    {typeLabels[activity.type]}
                                </span>
                                <div className="flex-1 min-w-0">
                                    {activity.link ? (
                                        <Link 
                                            href={activity.link}
                                            className="text-sm text-slate-700 hover:text-slate-900 font-medium"
                                        >
                                            {activity.text}
                                        </Link>
                                    ) : (
                                        <p className="text-sm text-slate-700">{activity.text}</p>
                                    )}
                                    <div className="flex items-center gap-1 mt-1">
                                        <Clock className="w-3 h-3 text-slate-400" />
                                        <span className="text-xs text-slate-500">{activity.time}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
