import { VendorDetails } from '@/components/vendor/vendor-details';
import { notFound } from 'next/navigation';
import { getVendorBySlug } from '@/lib/data/public-api';
import { Vendor, Service as PrismaService, Staff } from '@prisma/client';

// Transform Prisma types to match VendorDetails component props
interface Service {
    id: string;
    name: string;
    price: number;
    duration: number;
    compatibleStaffIds: number[];
}

interface ServiceCategory {
    category: string;
    services: Service[];
}

interface TransformedVendor {
    slug: string;
    name: string;
    address: string;
    rating: number;
    reviewCount: number;
    logo: string;
    bannerImage: string;
    description: string;
    serviceCategories: ServiceCategory[];
    staff: Array<Staff & { avatar: string; role: string }>;
}

function transformVendorData(
    vendor: NonNullable<Awaited<ReturnType<typeof getVendorBySlug>>>
): TransformedVendor {
    // Group services by category (for now, we'll create a single category)
    // In the future, you can add a category field to the Service model
    const serviceCategories: ServiceCategory[] = [
        {
            category: 'همه خدمات',
            services: vendor.services.map(service => ({
                id: service.id,
                name: service.name,
                price: service.price,
                duration: service.durationMinutes,
                compatibleStaffIds: [], // TODO: Implement staff-service relationships
            })),
        },
    ];

    // Transform staff data
    const staff = vendor.staff.map((staffMember, index) => ({
        ...staffMember,
        avatar: `https://i.pravatar.cc/150?img=${index + 5}`,
        role: staffMember.bio || 'متخصص',
    }));

    return {
        slug: vendor.slug,
        name: vendor.name,
        address: vendor.address,
        rating: 4.8, // TODO: Calculate from reviews
        reviewCount: 0, // TODO: Get from reviews count
        logo: vendor.logoUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80',
        bannerImage: vendor.logoUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80',
        description: vendor.bio || 'سالن زیبایی با خدمات حرفه‌ای',
        serviceCategories,
        staff,
    };
}

export default async function VendorPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const vendor = await getVendorBySlug(slug);

    if (!vendor) {
        notFound();
    }

    const transformedVendor = transformVendorData(vendor);

    return <VendorDetails vendor={transformedVendor} />;
}
