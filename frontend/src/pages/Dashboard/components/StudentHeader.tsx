import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface StudentHeaderProps {
    user: { firstName: string; lastName: string } | null
    onLogout: () => void
    onFilterChange?: (filter: 'all' | 'enrolled') => void
    currentFilter?: 'all' | 'enrolled'
}

export default function StudentHeader({
    user,
    onLogout,
    onFilterChange,
    currentFilter = 'all'
}: StudentHeaderProps) {
    const navigate = useNavigate()
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const menuItems = [
        {
            icon: 'bi-book',
            label: 'My Courses',
            description: 'View enrolled courses only',
            action: () => {
                onFilterChange?.('enrolled')
                setShowProfileMenu(false)
            },
            active: currentFilter === 'enrolled'
        },
        {
            icon: 'bi-collection',
            label: 'All Courses',
            description: 'Browse all available courses',
            action: () => {
                onFilterChange?.('all')
                setShowProfileMenu(false)
            },
            active: currentFilter === 'all'
        },
        {
            icon: 'bi-chat-dots',
            label: 'Course Hub',
            description: 'Chat with instructors',
            action: () => {
                navigate('/course-hub')
                setShowProfileMenu(false)
            }
        },
        { divider: true },
        {
            icon: 'bi-gear',
            label: 'Settings',
            description: 'Account preferences',
            action: () => {
                // Future: navigate to settings
                setShowProfileMenu(false)
            }
        },
        {
            icon: 'bi-question-circle',
            label: 'Help & Support',
            description: 'Get assistance',
            action: () => {
                setShowProfileMenu(false)
            }
        },
        { divider: true },
        {
            icon: 'bi-box-arrow-right',
            label: 'Logout',
            description: 'Sign out of your account',
            action: onLogout,
            danger: true
        }
    ]

    return (
        <header className="sticky top-0 z-30 bg-surface border-b border-border">
            <div className="flex justify-between items-center px-6 py-4">
                <div className="lg:pl-0 pl-12">
                    <h1 className="text-xl font-semibold text-text">
                        {currentFilter === 'enrolled' ? 'My Courses' : 'My Learning'}
                    </h1>
                    {user && (
                        <p className="text-sm text-text-secondary">
                            Welcome back, {user.firstName}!
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="hidden md:block">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="w-64 pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm text-text placeholder-text-muted bg-bg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                            />
                            <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"></i>
                        </div>
                    </div>

                    {/* Quick Filter Toggle */}
                    <div className="hidden sm:flex items-center gap-1 p-1 bg-bg rounded-xl">
                        <button
                            onClick={() => onFilterChange?.('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentFilter === 'all'
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-text-secondary hover:text-text'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => onFilterChange?.('enrolled')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentFilter === 'enrolled'
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-text-secondary hover:text-text'
                                }`}
                        >
                            My Courses
                        </button>
                    </div>

                    {/* Notifications */}
                    <button className="relative p-2.5 text-text-secondary hover:text-text hover:bg-surface-hover rounded-xl transition-colors">
                        <i className="bi bi-bell text-xl"></i>
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 px-3 py-2 bg-bg rounded-xl hover:bg-surface-hover transition-colors"
                        >
                            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">
                                    {user?.firstName?.charAt(0)}
                                </span>
                            </div>
                            <div className="hidden lg:block text-left">
                                <p className="text-sm font-medium text-text">
                                    {user?.firstName}
                                </p>
                                <p className="text-xs text-text-muted">Student</p>
                            </div>
                            <i className={`bi bi-chevron-down text-text-muted text-sm transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}></i>
                        </button>

                        {/* Dropdown Menu */}
                        {showProfileMenu && (
                            <div className="absolute right-0 top-full mt-2 w-72 bg-surface rounded-2xl shadow-lg border border-border overflow-hidden z-50">
                                {/* User Info Header */}
                                <div className="p-4 bg-bg border-b border-border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                                            <span className="text-white text-lg font-semibold">
                                                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-text">
                                                {user?.firstName} {user?.lastName}
                                            </p>
                                            <p className="text-sm text-text-muted">Student Account</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="py-2">
                                    {menuItems.map((item, index) => {
                                        if ('divider' in item) {
                                            return <div key={index} className="my-2 border-t border-border"></div>
                                        }
                                        return (
                                            <button
                                                key={index}
                                                onClick={item.action}
                                                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-surface-hover transition-colors text-left ${item.danger ? 'text-error hover:bg-error-light' : ''
                                                    } ${item.active ? 'bg-primary-light' : ''}`}
                                            >
                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.active
                                                        ? 'bg-primary text-white'
                                                        : item.danger
                                                            ? 'bg-error-light text-error'
                                                            : 'bg-bg text-text-secondary'
                                                    }`}>
                                                    <i className={`bi ${item.icon}`}></i>
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`text-sm font-medium ${item.danger ? 'text-error' : 'text-text'}`}>
                                                        {item.label}
                                                    </p>
                                                    <p className="text-xs text-text-muted">{item.description}</p>
                                                </div>
                                                {item.active && (
                                                    <i className="bi bi-check-lg text-primary"></i>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
