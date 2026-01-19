import { useEffect, useRef } from 'react'

interface DrawerProps {
    isOpen: boolean
    onClose: () => void
    position?: 'left' | 'right'
    size?: 'sm' | 'md' | 'lg' | 'full'
    title?: string
    children: React.ReactNode
}

export default function Drawer({
    isOpen,
    onClose,
    position = 'right',
    size = 'md',
    title,
    children
}: DrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    // Focus trap
    useEffect(() => {
        if (isOpen && drawerRef.current) {
            drawerRef.current.focus()
        }
    }, [isOpen])

    const sizeClasses = {
        sm: 'w-80',
        md: 'w-96',
        lg: 'w-[480px]',
        full: 'w-full'
    }

    const positionClasses = {
        left: {
            container: 'left-0',
            translate: isOpen ? 'translate-x-0' : '-translate-x-full'
        },
        right: {
            container: 'right-0',
            translate: isOpen ? 'translate-x-0' : 'translate-x-full'
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div
                ref={drawerRef}
                tabIndex={-1}
                className={`
                    absolute top-0 h-full ${sizeClasses[size]} max-w-full
                    ${positionClasses[position].container}
                    ${positionClasses[position].translate}
                    bg-white shadow-2xl
                    transition-transform duration-300 ease-out
                    flex flex-col
                    focus:outline-none
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    {title ? (
                        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    ) : (
                        <div />
                    )}
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Close drawer"
                    >
                        <i className="bi bi-x-lg text-gray-500 text-xl"></i>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}

// Confirmation Drawer variant
interface ConfirmDrawerProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'info'
    isLoading?: boolean
}

export function ConfirmDrawer({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false
}: ConfirmDrawerProps) {
    const variantStyles = {
        danger: {
            icon: 'bi-exclamation-triangle',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            button: 'bg-red-600 hover:bg-red-700'
        },
        warning: {
            icon: 'bi-exclamation-circle',
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            button: 'bg-amber-600 hover:bg-amber-700'
        },
        info: {
            icon: 'bi-info-circle',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            button: 'bg-blue-600 hover:bg-blue-700'
        }
    }

    const styles = variantStyles[variant]

    return (
        <Drawer isOpen={isOpen} onClose={onClose} size="sm" position="right">
            <div className="p-6 flex flex-col items-center text-center">
                <div className={`w-16 h-16 ${styles.iconBg} rounded-full flex items-center justify-center mb-4`}>
                    <i className={`bi ${styles.icon} text-3xl ${styles.iconColor}`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex gap-3 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-2.5 ${styles.button} text-white rounded-lg font-semibold transition-colors disabled:opacity-50`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <i className="bi bi-arrow-repeat animate-spin"></i>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </Drawer>
    )
}
