import type { ActionMessage } from '../../types'

interface ToastProps {
    message: ActionMessage
    onClose: () => void
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export default function Toast({ message, onClose, position = 'top-right' }: ToastProps) {
    const positionClasses = {
        'top-right': 'top-20 right-6',
        'top-left': 'top-20 left-6',
        'bottom-right': 'bottom-6 right-6',
        'bottom-left': 'bottom-6 left-6'
    }

    return (
        <div
            className={`fixed ${positionClasses[position]} flex items-center gap-3 p-4 rounded-lg shadow-lg z-40 ${message.type === 'success'
                    ? 'bg-green-50 border-l-4 border-green-500'
                    : 'bg-red-50 border-l-4 border-red-500'
                }`}
        >
            <span
                className={`text-lg font-bold ${message.type === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}
            >
                {message.type === 'success' ? (
                    <i className="bi bi-check-circle"></i>
                ) : (
                    <i className="bi bi-exclamation-triangle"></i>
                )}
            </span>
            <span className="text-gray-700 text-sm">{message.text}</span>
            <button
                className="ml-4 text-gray-400 hover:text-gray-600 font-bold text-xl"
                onClick={onClose}
                aria-label="Close notification"
            >
                ×
            </button>
        </div>
    )
}

// Error alert for forms (inline with title)
export function ErrorAlert({
    message,
    title,
    onDismiss
}: {
    message: string
    title?: string
    onDismiss?: () => void
}) {
    return (
        <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div className="flex-1">
                {title && <strong className="text-red-700 block">{title}</strong>}
                <span className={`text-sm ${title ? 'text-red-600' : 'text-red-700'}`}>{message}</span>
            </div>
            {onDismiss && (
                <button
                    className="text-red-500 hover:text-red-700 font-bold text-lg"
                    onClick={onDismiss}
                    aria-label="Dismiss error"
                >
                    ×
                </button>
            )}
        </div>
    )
}
