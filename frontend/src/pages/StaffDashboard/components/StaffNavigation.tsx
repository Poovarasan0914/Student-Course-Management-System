import { Button } from '../../../components/ui/button'
import type { StaffTabType } from '../hooks/useStaffDashboard'

interface StaffNavigationProps {
    activeTab: StaffTabType
    setActiveTab: (tab: StaffTabType) => void
    coursesCount: number
    enrollmentsCount: number
    onAddCourse: () => void
}

export default function StaffNavigation({
    activeTab,
    setActiveTab,
    coursesCount,
    enrollmentsCount,
    onAddCourse
}: StaffNavigationProps) {
    return (
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div className="flex gap-2">
                <button
                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${activeTab === 'courses'
                            ? 'bg-green-600 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    onClick={() => setActiveTab('courses')}
                >
                    <i className="bi bi-book me-1"></i>My Courses ({coursesCount})
                </button>
                <button
                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${activeTab === 'students'
                            ? 'bg-green-600 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    onClick={() => setActiveTab('students')}
                >
                    <i className="bi bi-people me-1"></i>Enrolled Students ({enrollmentsCount})
                </button>
            </div>
            {activeTab === 'courses' && (
                <Button onClick={onAddCourse} variant="success">
                    <i className="bi bi-plus-circle me-1"></i>Add New Course
                </Button>
            )}
        </div>
    )
}
