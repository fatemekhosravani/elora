// Types for Vendor Calendar & Appointments

export type ViewMode = 'daily' | 'weekly' | 'staff';

export interface Appointment {
    id: string;
    title: string;
    start: string; // ISO string
    end: string;   // ISO string
    status: 'DEPOSIT' | 'COMPLETED' | 'BREAK';
    staffId: string;
    clientName: string;
    clientPhone: string;
}

export interface Staff {
    id: string;
    name: string;
    avatar: string;
}

export const STATUS_CONFIG = {
    DEPOSIT: {
        bg: 'bg-yellow-500/20',
        border: 'border-yellow-500',
        text: 'text-yellow-300',
        label: 'بیعانه',
    },
    COMPLETED: {
        bg: 'bg-emerald-500/20',
        border: 'border-emerald-500',
        text: 'text-emerald-300',
        label: 'تکمیل',
    },
    BREAK: {
        bg: 'bg-slate-700/50',
        border: 'border-slate-600',
        text: 'text-slate-400',
        label: 'استراحت',
    },
} as const;
