import { useStudentDashboard } from './hooks/useStudentDashboard'
import Toast from '../../components/ui/Toast'
import {
    StudentHeader,
    CoursesGrid
} from './components'

export default function Dashboard() {
    const {
        // State
        user,
        enrollingCourseId,
        enrollmentMessage,
        isLoading,
        fetchError,

        // Data
        courses,
        enrollments,

        // Handlers
        handleLogout,
        handleEnroll,
        checkIsEnrolled,
        clearEnrollmentMessage
    } = useStudentDashboard()

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50">
            <StudentHeader user={user} onLogout={handleLogout} />

            {enrollmentMessage && (
                <Toast
                    message={enrollmentMessage}
                    onClose={clearEnrollmentMessage}
                />
            )}

            <main className="px-6 py-8 max-w-7xl mx-auto">
                <section>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Available Courses</h2>
                        {enrollments.length > 0 && (
                            <span className="text-gray-500 text-lg">
                                {enrollments.length} course{enrollments.length !== 1 ? 's' : ''} enrolled
                            </span>
                        )}
                    </div>
                    <CoursesGrid
                        courses={courses}
                        isLoading={isLoading}
                        error={fetchError}
                        enrollingCourseId={enrollingCourseId}
                        checkIsEnrolled={checkIsEnrolled}
                        onEnroll={handleEnroll}
                    />
                </section>
            </main>
        </div>
    )
}
