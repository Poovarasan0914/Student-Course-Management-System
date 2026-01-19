import type { Staff } from '../../../types'

interface StaffHeaderProps {
    staff: Staff | null
    onLogout: () => void
}

export default function StaffHeader({ staff, onLogout }: StaffHeaderProps) {
    return (
        <header className="sticky top-0 z-30 bg-surface border-b border-border">
            <div className="flex justify-between items-center px-6 py-4">
                <div className="lg:pl-0 pl-12">
                    <h1 className="text-xl font-semibold text-text">
                        Instructor Dashboard
                    </h1>
                    {staff && (
                        <p className="text-sm text-text-secondary">
                            {staff.firstName} {staff.lastName} · {staff.specialization}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    {/* Course Hub Link */}
                    <a
                        href="/staff/course-hub"
                        className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-primary hover:bg-primary-light rounded-xl transition-colors no-underline font-medium"
                    >
                        <i className="bi bi-chat-dots"></i>
                        <span className="text-sm">Course Hub</span>
                    </a>

                    {/* User */}
                    <div className="hidden sm:flex items-center gap-3 px-3 py-2 bg-bg rounded-xl">
                        <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                                {staff?.firstName?.charAt(0)}
                            </span>
                        </div>
                        <div className="hidden lg:block">
                            <p className="text-sm font-medium text-text">
                                {staff?.firstName}
                            </p>
                            <p className="text-xs text-text-muted">Instructor</p>
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
