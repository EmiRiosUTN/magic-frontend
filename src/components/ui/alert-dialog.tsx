

interface AlertDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive';
}

export function AlertDialog({
    open,
    onOpenChange,
    title,
    description,
    onConfirm,
    confirmText = 'Continuar',
    cancelText = 'Cancelar',
    variant = 'default',
}: AlertDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => onOpenChange(false)}
            />

            {/* Dialog Content */}
            <div className="relative z-50 grid w-full max-w-lg gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg md:w-full animate-in fade-in-0 zoom-in-95">
                <div className="flex flex-col space-y-2 text-center sm:text-left">
                    <h2 className="text-lg font-semibold leading-none tracking-tight">
                        {title}
                    </h2>
                    <p className="text-sm text-slate-500">
                        {description}
                    </p>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0 mt-2">
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 ring-offset-white transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onConfirm();
                            onOpenChange(false);
                        }}
                        className={`inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variant === 'destructive'
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
