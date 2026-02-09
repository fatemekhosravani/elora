'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Bell, User, LogIn, Search, Home, Sparkles, Info, LogOut } from 'lucide-react';
import { Button } from '@/components/ui';
import { logout } from '@/actions/auth';

interface HeaderClientProps {
    isLoggedIn: boolean;
}

export default function HeaderClient({ isLoggedIn }: HeaderClientProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        await logout();
    };

    const NAV_LINKS = [
        { href: '/', label: 'خانه', icon: Home },
        { href: '/search', label: 'جستجوی سالن', icon: Search },
        { href: '/about', label: 'درباره ما', icon: Info },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md shadow-lg">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between" dir="rtl">
                {/* Logo & Brand - Right Side (RTL) */}
                <Link href="/" className="flex items-center gap-2 group">
                    <Sparkles className="w-6 h-6 text-pink-400 group-hover:scale-110 transition-transform" />
                    <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent group-hover:from-pink-300 group-hover:to-purple-300 transition-all">
                        Elora
                    </span>
                </Link>

                {/* Center Navigation - Desktop Only */}
                <nav className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => {
                        const IconComponent = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-2 text-white/70 hover:text-pink-400 transition-colors font-medium text-sm group"
                            >
                                <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Actions - Left Side (RTL) */}
                <div className="flex items-center gap-4">
                    {!isLoggedIn ? (
                        <>
                            {/* Vendor Registration Link - Desktop Only */}
                            <Link
                                href="/vendor-register"
                                className="hidden lg:flex items-center gap-1 text-xs text-white/50 hover:text-white/90 transition-colors"
                            >
                                <User className="w-3.5 h-3.5" />
                                صاحب سالن هستید؟
                            </Link>

                            {/* Login Button */}
                            <Link href="/login" className="hidden md:block">
                                <Button size="sm" className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                                    <LogIn className="w-4 h-4" />
                                    ورود / ثبت نام
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* Notification Icon */}
                            <button className="relative p-2 hover:bg-white/10 rounded-full transition-colors">
                                <Bell className="w-5 h-5 text-white/70" />
                                {/* Notification Badge */}
                                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.8)]"></span>
                            </button>

                            {/* Profile Avatar */}
                            <Link
                                href="/panel"
                                className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all"
                            >
                                <User className="w-5 h-5" />
                            </Link>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                disabled={isLoading}
                                className="hidden md:flex items-center gap-1 text-xs text-white/50 hover:text-red-400 transition-colors disabled:opacity-50"
                                title="خروج"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6 text-white" />
                        ) : (
                            <Menu className="w-6 h-6 text-white" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-lg">
                    <nav className="container mx-auto px-4 py-4 flex flex-col gap-2" dir="rtl">
                        {NAV_LINKS.map((link) => {
                            const IconComponent = link.icon;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-pink-400 hover:bg-white/5 rounded-lg transition-all"
                                >
                                    <IconComponent className="w-5 h-5" />
                                    <span className="font-medium">{link.label}</span>
                                </Link>
                            );
                        })}

                        {!isLoggedIn ? (
                            <>
                                <Link
                                    href="/vendor-register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white/90 hover:bg-white/5 rounded-lg transition-all"
                                >
                                    <User className="w-5 h-5" />
                                    <span className="font-medium text-sm">صاحب سالن هستید؟</span>
                                </Link>

                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="mt-2"
                                >
                                    <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                                        <LogIn className="w-4 h-4 ml-2" />
                                        ورود / ثبت نام
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/panel"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-pink-400 hover:bg-white/5 rounded-lg transition-all"
                                >
                                    <User className="w-5 h-5" />
                                    <span className="font-medium">پروفایل من</span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    disabled={isLoading}
                                    className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all disabled:opacity-50 text-right"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium">{isLoading ? 'در حال خروج...' : 'خروج'}</span>
                                </button>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
