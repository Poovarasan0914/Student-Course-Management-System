type ErrorDisplayProps = {
    title?: string
    message: string
    onRetry?: () => void
    variant?: 'error' | 'warning' | 'info'
    fullWidth?: boolean
}

export default function ErrorDisplay({
    title = 'Something went wrong',
    message,
    onRetry,
    variant = 'error',
    fullWidth = true
}: ErrorDisplayProps) {
    const variantStyles = {
        error: 'bg-red-50 border-red-200',
        warning: 'bg-amber-50 border-amber-200',
        info: 'bg-blue-50 border-blue-200'
    }

    const iconColors = {
        error: 'text-red-500',
        warning: 'text-amber-500',
        info: 'text-blue-500'
    }

    const getIcon = () => {
        switch (variant) {
            case 'error':
                return (
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                )
            case 'warning':
                return (
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                )
            case 'info':
                return (
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                )
        }
    }

    return (
        <div className={`flex flex-col items-center p-8 rounded-lg border ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''}`}>
            <div className="flex flex-col items-center gap-4">
                <div className={iconColors[variant]}>
                    {getIcon()}
                </div>
                <div className="text-center">
                    <h4 className="text-gray-800 text-lg font-semibold mb-2">{title}</h4>
                    <p className="text-gray-600 text-sm">{message}</p>
                </div>
            </div>
            {onRetry && (
                <button onClick={onRetry} className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 4 23 10 17 10" />
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                    Try Again
                </button>
            )}
        </div>
    )
}

// Inline error message for forms
export function InlineError({ message }: { message: string }) {
    return (
        <div className="flex items-center gap-2 mt-2 text-red-600 text-xs">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{message}</span>
        </div>
    )
}

// Success message component
export function SuccessDisplay({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
    return (
        <div className="mb-6 flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="text-green-700 text-sm">{message}</span>
            </div>
            {onDismiss && (
                <button onClick={onDismiss} className="text-green-600 hover:text-green-700 font-bold text-lg" aria-label="Dismiss">
                    ×
                </button>
            )}
        </div>
    )
}

// Empty state component
export function EmptyState({
    icon,
    title,
    message,
    action
}: {
    icon?: React.ReactNode
    title: string
    message: string
    action?: { label: string; onClick: () => void }
}) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            {icon || (
                <svg className="w-16 h-16 text-gray-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            )}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">{message}</p>
            {action && (
                <button onClick={action.onClick} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    {action.label}
                </button>
            )}
        </div>
    )
}

// Connection error (offline/server down)
export function ConnectionError({ onRetry }: { onRetry?: () => void }) {
    return (
        <div className="flex items-center justify-center py-16">
            <div className="max-w-md text-center">
                <svg className="w-16 h-16 text-red-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
                    <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
                    <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
                    <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                    <line x1="12" y1="20" x2="12.01" y2="20" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Connection Error</h3>
                <p className="text-gray-500 text-sm mb-4">Unable to connect to the server. Please check if:</p>
                <ul className="text-gray-600 text-sm text-left mb-4 space-y-2">
                    <li>• The backend server is running on <code className="bg-gray-100 px-2 py-1 rounded text-xs">localhost:5000</code></li>
                    <li>• MongoDB is running</li>
                    <li>• Your internet connection is stable</li>
                </ul>
                <div className="p-4 bg-gray-100 rounded mb-4">
                    <p className="text-gray-600 text-xs mb-2">Run this command in the backend folder:</p>
                    <code className="text-xs text-blue-600 block">cd backend && npm run dev</code>
                </div>
                {onRetry && (
                    <button onClick={onRetry} className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="23 4 23 10 17 10" />
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                        </svg>
                        Retry Connection
                    </button>
                )}
            </div>
        </div>
    )
}

