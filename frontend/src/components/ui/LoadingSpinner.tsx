type LoadingSpinnerProps = {
    size?: 'small' | 'medium' | 'large'
    text?: string
    fullScreen?: boolean
}

export default function LoadingSpinner({
    size = 'medium',
    text = 'Loading...',
    fullScreen = false
}: LoadingSpinnerProps) {
    const sizeClass = {
        small: 'w-8 h-8',
        medium: 'w-12 h-12',
        large: 'w-16 h-16'
    }[size]

    const spinner = (
        <div className={`flex flex-col items-center justify-center gap-4 ${fullScreen ? 'min-h-screen' : 'py-8'}`}>
            <div className={`relative ${sizeClass}`}>
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-500 animate-spin"
                        style={{
                            animationDelay: `${i * 0.15}s`,
                            top: `${i * 2}px`,
                            left: `${i * 2}px`,
                            right: `${i * 2}px`,
                            bottom: `${i * 2}px`,
                        }}
                    />
                ))}
            </div>
            {text && <p className="text-gray-500 text-sm">{text}</p>}
        </div>
    )

    return spinner
}

// Skeleton loading for cards
export function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
            <div className="h-44 bg-gray-200"></div>
            <div className="p-5 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="flex gap-3 py-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
            </div>
        </div>
    )
}

// Multiple skeleton cards for grid loading
export function SkeletonGrid({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    )
}

