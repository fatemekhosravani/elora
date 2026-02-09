'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X, Clock, DollarSign } from 'lucide-react';

interface Service {
    id: number;
    name: string;
    price: number;
    duration: number;
    compatibleStaffIds: number[];
}

interface Staff {
    id: number;
    name: string;
    avatar: string;
    role: string;
}

interface StaffSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: Service;
    allStaff: Staff[];
    vendorSlug: string;
}

export function StaffSelectorModal({
    isOpen,
    onClose,
    service,
    allStaff,
    vendorSlug,
}: StaffSelectorModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    // Filter staff based on compatible IDs
    const compatibleStaff = allStaff.filter(staff =>
        service.compatibleStaffIds.includes(staff.id)
    );

    const handleStaffSelect = (staffId: number) => {
        router.push(`/vendor/${vendorSlug}/book?serviceId=${service.id}&staffId=${staffId}`);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Content - Desktop (Center) / Mobile (Bottom Sheet) */}
            <div className="fixed inset-x-0 bottom-0 md:inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4" dir="rtl">
                <div
                    className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl max-h-[85vh] md:max-h-[80vh] overflow-hidden animate-slide-up"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-1">
                                انتخاب کارشناس
                            </h3>
                            <p className="text-sm text-gray-500">{service.name}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    {/* Service Info */}
                    <div className="bg-[#BD7E93]/10 px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-sm text-gray-700">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-[#BD7E93]" />
                                    <span>{service.duration} دقیقه</span>
                                </div>
                                <div className="w-px h-4 bg-gray-300" />
                                <div className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4 text-[#BD7E93]" />
                                    <span className="font-bold">{formatPrice(service.price)} تومان</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Staff Grid */}
                    <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(85vh - 200px)' }}>
                        {compatibleStaff.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {compatibleStaff.map((staff) => (
                                    <button
                                        key={staff.id}
                                        onClick={() => handleStaffSelect(staff.id)}
                                        className="group bg-white border-2 border-gray-200 hover:border-[#BD7E93] rounded-xl p-4 text-center transition-all hover:shadow-lg"
                                    >
                                        {/* Avatar */}
                                        <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-gray-100 group-hover:ring-[#BD7E93] transition-all">
                                            <Image
                                                src={staff.avatar}
                                                alt={staff.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Name */}
                                        <h4 className="font-bold text-gray-800 mb-1 group-hover:text-[#BD7E93] transition-colors">
                                            {staff.name}
                                        </h4>

                                        {/* Role */}
                                        <p className="text-xs text-gray-500 mb-3">{staff.role}</p>

                                        {/* Select Button */}
                                        <div className="bg-gray-100 group-hover:bg-[#BD7E93] text-gray-700 group-hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                                            انتخاب
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500">کارشناسی برای این خدمت موجود نیست</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Animations */}
            <style jsx global>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes slide-up {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out;
                }
            `}</style>
        </>
    );
}
