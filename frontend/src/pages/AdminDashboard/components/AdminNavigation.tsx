import type { TabType } from '../../../types'

interface AdminNavigationProps {
    activeTab: TabType
    setActiveTab: (tab: TabType) => void
    counts: {
        students: number
        staff: number
        admins: number
        courses: number
        enrollments: number
    }
}

export default function AdminNavigation({ activeTab, setActiveTab, counts }: AdminNavigationProps) {
    return (
        <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-2">
            <button
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'dashboard' ? 'bg-red-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                onClick={() => setActiveTab('dashboard')}
            >
                <i className="bi bi-speedometer2 me-1"></i>Dashboard
            </button>
            <button
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'students' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                onClick={() => setActiveTab('students')}
            >
                <i className="bi bi-mortarboard me-1"></i>Students ({counts.students})
            </button>
            <button
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'staff' ? 'bg-green-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                onClick={() => setActiveTab('staff')}
            >
                <i className="bi bi-person-circle me-1"></i>Staff ({counts.staff})
            </button>
            <button
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'admins' ? 'bg-red-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                onClick={() => setActiveTab('admins')}
            >
                <i className="bi bi-key me-1"></i>Admins ({counts.admins})
            </button>
            <button
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'courses' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                onClick={() => setActiveTab('courses')}
            >
                <i className="bi bi-book me-1"></i>Courses ({counts.courses})
            </button>
            <button
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'enrollments' ? 'bg-green-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                onClick={() => setActiveTab('enrollments')}
            >
                <i className="bi bi-journal-check me-1"></i>Enrollments ({counts.enrollments})
            </button>
        </nav>
    )
}
