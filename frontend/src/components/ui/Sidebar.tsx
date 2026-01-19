import { useState, useEffect } from 'react'

export interface SidebarItem {
    id: string
    label: string
    icon: string
    badge?: number
}

interface SidebarProps {
    items: SidebarItem[]
    activeItem: string
    onItemClick: (id: string) => void
    header?: {
        title: string
        subtitle?: string
        icon?: string
    }
}

export default function Sidebar({ items, activeItem, onItemClick, header }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileOpen(false)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-surface rounded-xl shadow-md border border-border hover:bg-surface-hover transition-colors"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                aria-label="Toggle sidebar"
            >
                <i className={`bi ${isMobileOpen ? 'bi-x-lg' : 'bi-list'} text-xl text-text`}></i>
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:sticky top-0 left-0 h-screen z-40
                    transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'w-20' : 'w-64'}
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    bg-surface border-r border-border
                    flex flex-col shadow-sm
                `}
            >
                {/* Header - Indigo gradient */}
                {header && (
                    <div className="p-5 bg-linear-to-br from-primary to-primary-dark text-white">
                        <div className="flex items-center gap-3">
                            {header.icon && (
                                <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <i className={`bi ${header.icon} text-xl text-white`}></i>
                                </div>
                            )}
                            {!isCollapsed && (
                                <div className="flex-1 min-w-0">
                                    <h2 className="font-bold text-base truncate text-white">{header.title}</h2>
                                    {header.subtitle && (
                                        <p className="text-sm text-white/70 truncate">{header.subtitle}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Collapse Toggle */}
                <button
                    className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 bg-surface border border-border rounded-full items-center justify-center shadow-sm hover:bg-surface-hover transition-colors"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'} text-xs text-text-muted`}></i>
                </button>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1 sidebar-scrollbar">
                    {items.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                onItemClick(item.id)
                                setIsMobileOpen(false)
                            }}
                            className={`
                                w-full flex items-center gap-3 px-4 py-3 rounded-xl
                                transition-all duration-200 font-medium text-sm
                                ${activeItem === item.id
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-text-secondary hover:bg-surface-hover hover:text-text'
                                }
                            `}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <i className={`bi ${item.icon} text-lg`}></i>
                            {!isCollapsed && (
                                <>
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {item.badge !== undefined && item.badge > 0 && (
                                        <span className={`
                                            px-2 py-0.5 text-xs font-semibold rounded-full
                                            ${activeItem === item.id
                                                ? 'bg-white/20 text-white'
                                                : 'bg-primary-light text-primary'
                                            }
                                        `}>
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Footer */}
                {!isCollapsed && (
                    <div className="p-4 border-t border-border">
                        <p className="text-xs text-text-muted text-center">
                            © 2026 SCMS
                        </p>
                    </div>
                )}
            </aside>
        </>
    )
}
