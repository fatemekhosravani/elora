import type { Metadata } from "next";
import { Vazirmatn, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const vazir = Vazirmatn({
    subsets: ["arabic"],
    variable: "--font-vazir",
    display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-jakarta",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Elora - سامانه رزرو خدمات زیبایی",
    description: "پلتفرم آنلاین رزرو خدمات زیبایی و آرایشگاهی",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fa" dir="rtl">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            </head>
            <body className={`${vazir.variable} ${jakarta.variable} antialiased bg-background-light dark:bg-background-dark text-charcoal`}>
                {children}
            </body>
        </html>
    );
}
