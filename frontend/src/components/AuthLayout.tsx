import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type AuthLayoutProps = {
    children: ReactNode
    title: string
    subtitle?: string
    badge?: {
        text: string
        color: 'primary' | 'accent' | 'error'
    }
    footerLinks?: Array<{
        text: string
        linkText: string
        to: string
    }>
}

export default function AuthLayout({
    children,
    title,
    subtitle,
    badge,
    footerLinks = []
}: AuthLayoutProps) {
    const badgeStyles = {
        primary: 'bg-primary',
        accent: 'bg-accent',
        error: 'bg-error'
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
                        <i className="bi bi-mortarboard-fill text-3xl text-white"></i>
                    </div>
                    <h1 className="text-xl font-bold text-text">SCMS</h1>
                </div>

                {/* Card */}
                <div className="bg-surface rounded-2xl p-8 shadow-md border border-border relative">
                    {/* Close Button */}
                    <Link
                        to="/"
                        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl bg-bg hover:bg-surface-hover border border-border text-text-muted hover:text-text transition-colors"
                        title="Go to Home"
                    >
                        <i className="bi bi-x-lg"></i>
                    </Link>

                    {badge && (
                        <div className="text-center mb-6">
                            <span className={`inline-block px-4 py-1.5 ${badgeStyles[badge.color]} text-white text-sm font-medium rounded-full`}>
                                {badge.text}
                            </span>
                        </div>
                    )}

                    <h2 className="text-2xl font-semibold text-center mb-2 text-text">{title}</h2>
                    {subtitle && (
                        <p className="text-center text-text-secondary text-sm mb-8">{subtitle}</p>
                    )}

                    {children}

                    {footerLinks.length > 0 && (
                        <div className="mt-8 space-y-3">
                            {footerLinks.map((link, index) => (
                                <p key={index} className="text-center text-sm text-text-secondary">
                                    {link.text}{' '}
                                    <Link
                                        to={link.to}
                                        className="font-semibold text-primary hover:text-primary-hover"
                                    >
                                        {link.linkText}
                                    </Link>
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-text-muted mt-6">
                    © 2026 Student Course Management System
                </p>
            </div>
        </div>
    )
}
