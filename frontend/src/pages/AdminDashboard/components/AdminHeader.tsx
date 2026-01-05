import type { Admin } from '../../../types'

interface AdminHeaderProps {
    currentAdmin: Admin | null
    onLogout: () => void
}

export default function AdminHeader({ currentAdmin, onLogout }: AdminHeaderProps) {
    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        <i className="bi bi-shield-lock me-2"></i>Admin Dashboard
                    </h1>
                    <span className="text-gray-500 text-sm">
                        Welcome, {currentAdmin?.firstName} {currentAdmin?.lastName}
                    </span>
                </div>
                <button
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all shadow-sm"
                    onClick={onLogout}
                >
                    Logout
                </button>
            </div>
        </header>
    )
}
