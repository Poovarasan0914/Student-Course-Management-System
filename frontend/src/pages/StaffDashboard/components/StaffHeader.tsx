import { Button } from '../../../components/ui/button'
import type { Staff } from '../../../types'

interface StaffHeaderProps {
    staff: Staff | null
    onLogout: () => void
}

export default function StaffHeader({ staff, onLogout }: StaffHeaderProps) {
    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Staff Dashboard</h1>
                    {staff && (
                        <span className="text-gray-500 text-sm">
                            <i className="bi bi-person-circle me-1"></i>
                            {staff.firstName} {staff.lastName} | {staff.specialization}
                        </span>
                    )}
                </div>
                <Button onClick={onLogout} variant="destructive">
                    Logout
                </Button>
            </div>
        </header>
    )
}
