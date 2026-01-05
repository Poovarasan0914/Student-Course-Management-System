import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type AuthLayoutProps = {
    children: ReactNode
    title: string
    subtitle?: string
    badge?: {
        text: string
        color: 'blue' | 'green' | 'red'
    }
    gradient?: 'blue-green' | 'green-blue' | 'red-blue'
    footerLinks?: Array<{
        text: string
        linkText: string
        to: string
        color?: 'blue' | 'green'
    }>
}

export default function AuthLayout({
    children,
    title,
    subtitle,
    badge,
    gradient = 'blue-green',
    footerLinks = []
}: AuthLayoutProps) {
    const gradientClasses = {
        'blue-green': 'from-blue-50 via-white to-green-50',
        'green-blue': 'from-green-50 via-white to-blue-50',
        'red-blue': 'from-red-50 via-white to-blue-50'
    }

    const badgeColors = {
        blue: 'bg-blue-600',
        green: 'bg-green-600',
        red: 'bg-red-600'
    }

    const linkColors = {
        blue: 'text-blue-600 hover:text-blue-700',
        green: 'text-green-600 hover:text-green-700'
    }

    return (
        <div className={`min-h-screen flex items-center justify-center bg-linear-to-br ${gradientClasses[gradient]} p-4`}>
            <div className="w-full max-w-md bg-white rounded-2xl p-10 shadow-xl border border-gray-100">
                {badge && (
                    <div className="text-center mb-4">
                        <span className={`inline-block px-4 py-1 ${badgeColors[badge.color]} text-white text-sm font-semibold rounded-full`}>
                            {badge.text}
                        </span>
                    </div>
                )}

                <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">{title}</h2>
                {subtitle && (
                    <p className="text-center text-gray-500 text-sm mb-6">{subtitle}</p>
                )}

                {children}

                {footerLinks.length > 0 && (
                    <div className="mt-6 space-y-2">
                        {footerLinks.map((link, index) => (
                            <p key={index} className="text-center text-sm text-gray-500">
                                {link.text}{' '}
                                <Link
                                    to={link.to}
                                    className={`font-semibold ${linkColors[link.color || 'blue']}`}
                                >
                                    {link.linkText}
                                </Link>
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
