import type { Admin } from '../../../types'

interface AdminHeaderProps {
    currentAdmin: Admin | null
    onLogout: () => void
}

export default function AdminHeader({ currentAdmin, onLogout }: AdminHeaderProps) {
    return (
        <header className="sticky top-0 z-30 bg-surface border-b border-border">
            <div className="flex justify-between items-center px-6 py-4">
                <div className="lg:pl-0 pl-12">
                    <h1 className="text-xl font-semibold text-text">
                        Admin Dashboard
                    </h1>
                    <p className="text-sm text-text-secondary">
                        Welcome back, {currentAdmin?.firstName} {currentAdmin?.lastName}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="hidden md:block">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-64 pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm text-text placeholder-text-muted bg-bg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                            />
                            <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"></i>
                        </div>
                    </div>

                    {/* Notifications */}
                    <button className="relative p-2.5 text-text-secondary hover:text-text hover:bg-surface-hover rounded-xl transition-colors">
                        <i className="bi bi-bell text-xl"></i>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
                    </button>

                    {/* User */}
                    <div className="hidden sm:flex items-center gap-3 px-3 py-2 bg-bg rounded-xl">
                        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                                {currentAdmin?.firstName?.charAt(0)}
                            </span>
                        </div>
                        <div className="hidden lg:block">
                            <p className="text-sm font-medium text-text">
                                {currentAdmin?.firstName}
                            </p>
                            <p className="text-xs text-text-muted">Admin</p>
                        </div>
                    </div>

                    <button
                        className="px-4 py-2.5 bg-surface text-text-secondary font-medium rounded-xl border border-border hover:bg-surface-hover hover:text-text transition-all flex items-center gap-2"
                        onClick={onLogout}
                    >
                        <i className="bi bi-box-arrow-right"></i>
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    )
}
