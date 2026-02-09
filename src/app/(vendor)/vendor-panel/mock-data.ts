// ==================== STAFF DATA ====================

export interface StaffMember {
    id: string;
    name: string;
    role: string;
    avatar: string;
    currentLoad: number;
    performanceData: { day: string, value: number }[];
    hasFinanceAccess: boolean;
}

export const MOCK_STAFF: StaffMember[] = [
    {
        id: '1',
        name: 'کیمیا خسروانی',
        role: 'استایلیست ارشد',
        avatar: 'https://i.pravatar.cc/150?img=5',
        currentLoad: 85,
        performanceData: [
            { day: 'شنبه', value: 12 },
            { day: 'یکشنبه', value: 15 },
            { day: 'دوشنبه', value: 10 },
            { day: 'سه‌شنبه', value: 18 },
            { day: 'چهارشنبه', value: 14 },
            { day: 'پنجشنبه', value: 20 },
            { day: 'جمعه', value: 16 },
        ],
        hasFinanceAccess: true,
    },
    {
        id: '2',
        name: 'سارا محمدی',
        role: 'متخصص رنگ مو',
        avatar: 'https://i.pravatar.cc/150?img=10',
        currentLoad: 60,
        performanceData: [
            { day: 'شنبه', value: 8 },
            { day: 'یکشنبه', value: 10 },
            { day: 'دوشنبه', value: 12 },
            { day: 'سه‌شنبه', value: 14 },
            { day: 'چهارشنبه', value: 11 },
            { day: 'پنجشنبه', value: 15 },
            { day: 'جمعه', value: 13 },
        ],
        hasFinanceAccess: false,
    },
    {
        id: '3',
        name: 'مریم احمدی',
        role: 'متخصص ناخن',
        avatar: 'https://i.pravatar.cc/150?img=20',
        currentLoad: 45,
        performanceData: [
            { day: 'شنبه', value: 6 },
            { day: 'یکشنبه', value: 8 },
            { day: 'دوشنبه', value: 7 },
            { day: 'سه‌شنبه', value: 9 },
            { day: 'چهارشنبه', value: 10 },
            { day: 'پنجشنبه', value: 11 },
            { day: 'جمعه', value: 9 },
        ],
        hasFinanceAccess: false,
    },
    {
        id: '4',
        name: 'نرگس رضایی',
        role: 'میکاپ آرتیست',
        avatar: 'https://i.pravatar.cc/150?img=32',
        currentLoad: 92,
        performanceData: [
            { day: 'شنبه', value: 14 },
            { day: 'یکشنبه', value: 16 },
            { day: 'دوشنبه', value: 18 },
            { day: 'سه‌شنبه', value: 22 },
            { day: 'چهارشنبه', value: 20 },
            { day: 'پنجشنبه', value: 25 },
            { day: 'جمعه', value: 23 },
        ],
        hasFinanceAccess: true,
    },
    {
        id: '5',
        name: 'پریسا نوری',
        role: 'متخصص پوست',
        avatar: 'https://i.pravatar.cc/150?img=45',
        currentLoad: 30,
        performanceData: [
            { day: 'شنبه', value: 4 },
            { day: 'یکشنبه', value: 5 },
            { day: 'دوشنبه', value: 6 },
            { day: 'سه‌شنبه', value: 5 },
            { day: 'چهارشنبه', value: 7 },
            { day: 'پنجشنبه', value: 8 },
            { day: 'جمعه', value: 6 },
        ],
        hasFinanceAccess: false,
    },
];

// ==================== STAFF LIST (SIMPLE) ====================

export const STAFF_LIST = [
    { id: '1', name: 'کیمیا خسروانی' },
    { id: '2', name: 'سارا محمدی' },
    { id: '3', name: 'مریم احمدی' },
    { id: '4', name: 'نرگس رضایی' },
];
