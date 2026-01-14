import { Spinner } from './spinner';
import { cn } from '../../lib/utils';

interface LoaderProps {
    text?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
}

export function Loader({
    text = "Cargando...",
    className,
    size = 'md',
    fullScreen = false
}: LoaderProps) {

    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12"
    };

    return (
        <div className={cn(
            "flex flex-col items-center justify-center gap-4",
            fullScreen && "min-h-[60vh] w-full", // Use 60vh to center nicely on screen without forcing full viewport if inside a container
            className
        )}>
            <Spinner className={cn("text-blue-600", sizeClasses[size])} />
            {text && (
                <p className="font-roboto text-slate-600 text-sm font-medium animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
}
