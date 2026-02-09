/**
 * ════════════════════════════════════
 * PUBLIC DATA ACCESS LAYER
 * ════════════════════════════════════
 * 
 * Purpose: Centralized data fetching for public-facing pages
 * Stack: Prisma ORM
 * 
 * This layer abstracts database queries from page components
 * and provides type-safe data access methods.
 */

import { prisma } from '@/lib/prisma';
import { Vendor, Service, Staff } from '@prisma/client';

// ==================== TYPE DEFINITIONS ====================

export type VendorWithStats = Vendor & {
    _count: {
        services: number;
    };
};

export type VendorWithDetails = Vendor & {
    services: Service[];
    staff: Staff[];
    owner: {
        fullName: string | null;
        phoneNumber: string;
    };
};

// ==================== PUBLIC API FUNCTIONS ====================

/**
 * Get Featured Vendors for Homepage
 * Returns top 10 active vendors with service count
 */
export async function getFeaturedVendors(): Promise<VendorWithStats[]> {
    try {
        const vendors = await prisma.vendor.findMany({
            where: {
                isActive: true,
            },
            include: {
                _count: {
                    select: {
                        services: true,
                    },
                },
            },
            take: 10,
            orderBy: {
                createdAt: 'desc',
            },
        });

        return vendors;
    } catch (error) {
        console.error('Error fetching featured vendors:', error);
        return [];
    }
}

/**
 * Get Vendor by Slug with full details
 * Includes services, staff, and owner information
 */
export async function getVendorBySlug(slug: string): Promise<VendorWithDetails | null> {
    try {
        const vendor = await prisma.vendor.findUnique({
            where: {
                slug,
                isActive: true,
            },
            include: {
                services: {
                    where: {
                        isActive: true,
                    },
                    orderBy: {
                        price: 'asc',
                    },
                },
                staff: {
                    orderBy: {
                        name: 'asc',
                    },
                },
                owner: {
                    select: {
                        fullName: true,
                        phoneNumber: true,
                    },
                },
            },
        });

        return vendor;
    } catch (error) {
        console.error(`Error fetching vendor with slug "${slug}":`, error);
        return null;
    }
}

/**
 * Search Vendors by name or location
 * Supports filtering by city
 */
export async function searchVendors(
    query: string = '',
    city?: string
): Promise<VendorWithStats[]> {
    try {
        const vendors = await prisma.vendor.findMany({
            where: {
                isActive: true,
                AND: [
                    // Search in name or address
                    query
                        ? {
                              OR: [
                                  {
                                      name: {
                                          contains: query,
                                      },
                                  },
                                  {
                                      address: {
                                          contains: query,
                                      },
                                  },
                              ],
                          }
                        : {},
                    // Filter by city if provided
                    city
                        ? {
                              address: {
                                  contains: city,
                              },
                          }
                        : {},
                ],
            },
            include: {
                _count: {
                    select: {
                        services: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 50,
        });

        return vendors;
    } catch (error) {
        console.error('Error searching vendors:', error);
        return [];
    }
}

/**
 * Get All Vendors (for search page)
 * Returns all active vendors with service count
 */
export async function getAllVendors(): Promise<VendorWithStats[]> {
    try {
        const vendors = await prisma.vendor.findMany({
            where: {
                isActive: true,
            },
            include: {
                _count: {
                    select: {
                        services: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return vendors;
    } catch (error) {
        console.error('Error fetching all vendors:', error);
        return [];
    }
}

/**
 * Get Vendor Services by Vendor ID
 * Returns all active services for a specific vendor
 */
export async function getVendorServices(vendorId: string): Promise<Service[]> {
    try {
        const services = await prisma.service.findMany({
            where: {
                vendorId,
                isActive: true,
            },
            orderBy: {
                price: 'asc',
            },
        });

        return services;
    } catch (error) {
        console.error(`Error fetching services for vendor ${vendorId}:`, error);
        return [];
    }
}

/**
 * Get Vendor Staff by Vendor ID
 * Returns all staff members for a specific vendor
 */
export async function getVendorStaff(vendorId: string): Promise<Staff[]> {
    try {
        const staff = await prisma.staff.findMany({
            where: {
                vendorId,
            },
            orderBy: {
                name: 'asc',
            },
        });

        return staff;
    } catch (error) {
        console.error(`Error fetching staff for vendor ${vendorId}:`, error);
        return [];
    }
}
