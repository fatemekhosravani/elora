import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, variant = 'primary', size = 'md', isLoading, disabled, ...props }, ref) => {

        const variants = {
            primary: 'bg-brand-primary text-white hover:bg-opacity-90 active:scale-95 shadow-md border border-transparent',
            outline: 'border-2 border-brand-primary text-brand-primary bg-transparent hover:bg-brand-bg active:scale-95',
            ghost: 'text-brand-dark hover:bg-gray-100 bg-transparent',
        };

        const sizes = {
            sm: 'h-8 px-3 text-sm rounded-lg',
            md: 'h-10 px-6 text-base rounded-xl',
            lg: 'h-12 px-8 text-lg rounded-2xl',
        };

        return (
            <button
                ref={ref}
                disabled={isLoading || disabled}
                className={cn(
                    'flex items-center justify-center font-medium transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';

export { Button };
