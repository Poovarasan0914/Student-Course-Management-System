import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/button'

interface StudentHeaderProps {
    user: { firstName: string; lastName: string } | null
    onLogout: () => void
}

export default function StudentHeader({ user, onLogout }: StudentHeaderProps) {
    const navigate = useNavigate()

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
                <h1 className="text-2xl font-bold text-gray-800">My Learning Dashboard</h1>
                <div className="flex items-center gap-4">
                    {user && (
                        <span className="text-gray-600">
                            Welcome, {user.firstName} {user.lastName}
                        </span>
                    )}
                    <Button
                        onClick={() => navigate('/course-hub')}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    >
                        <i className="bi bi-chat-dots me-2"></i>
                        Course Hub
                    </Button>
                    <Button onClick={onLogout} variant="destructive">
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    )
}
