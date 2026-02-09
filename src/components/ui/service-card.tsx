import Image from 'next/image';
import { Clock, Star, MapPin } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
    imageSrc: string;
    title: string;
    price: number;
    duration: number; // minutes
    salonName: string;
    rating: number;
    address?: string;
    onBook?: () => void;
    className?: string;
}

export function ServiceCard({
    imageSrc,
    title,
    price,
    duration,
    salonName,
    rating,
    address,
    onBook,
    className,
}: ServiceCardProps) {
    // Format price in Toman
    const formattedPrice = new Intl.NumberFormat('fa-IR').format(price);

    return (
        <div className={cn('group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-xl shadow-lg border border-white/10 hover:border-white/20 hover:shadow-[0_0_30px_rgba(236,72,153,0.2)] transition-all duration-300', className)}>
            {/* Image Container */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-900/50">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                />
                {/* Rating Badge */}
                <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-slate-950/80 backdrop-blur-md px-2 py-1 text-xs font-semibold text-white shadow-lg border border-white/10">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{rating}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Salon Name */}
                <div className="mb-1 text-sm font-medium text-pink-400">{salonName}</div>

                {/* Title */}
                <h3 className="mb-2 text-lg font-bold text-white line-clamp-1">{title}</h3>

                {/* Meta Info */}
                <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-white/60">
                    <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-cyan-400" />
                        <span>{duration} دقیقه</span>
                    </div>
                    {address && (
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                            <span className="line-clamp-1">{address}</span>
                        </div>
                    )}
                </div>

                {/* Footer: Price & Action */}
                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-white/40">قیمت</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-white">{formattedPrice}</span>
                            <span className="text-xs text-white/50">تومان</span>
                        </div>
                    </div>
                    <Button size="sm" onClick={onBook} className="h-9 px-4 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                        رزرو نوبت
                    </Button>
                </div>
            </div>
        </div>
    );
}
