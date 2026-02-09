import Header from '@/components/layout/header';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full h-full">
            <Header />
            {children}
        </div>
    );
}
