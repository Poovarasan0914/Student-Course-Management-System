import { useState } from 'react'
import { useStudentDashboard } from './hooks/useStudentDashboard'
import Toast from '../../components/ui/Toast'
import {
    StudentHeader,
    CoursesGrid,
    CourseDetailModal
} from './components'
import type { Course } from '../../types'

export default function Dashboard() {
    const {
        // State
        user,
        enrollingCourseId,
        unenrollingCourseId,
        enrollmentMessage,
        isLoading,
        fetchError,

        // Data
        courses,
        enrollments,

        // Handlers
        handleLogout,
        handleEnroll,
        handleUnenroll,
        checkIsEnrolled,
        clearEnrollmentMessage
    } = useStudentDashboard()

    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

    const handleCourseClick = (course: Course) => {
        setSelectedCourse(course)
    }

    const handleCloseModal = () => {
        setSelectedCourse(null)
    }

    const handleEnrollFromModal = (course: Course) => {
        handleEnroll(course)
    }

    const handleUnenrollFromModal = (course: Course) => {
        handleUnenroll(course)
    }

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
                        onCourseClick={handleCourseClick}
                    />
                </section>
            </main>

            {/* Course Detail Modal */}
            {selectedCourse && (
                <CourseDetailModal
                    course={selectedCourse}
                    isEnrolled={checkIsEnrolled(selectedCourse.id || selectedCourse._id)}
                    isEnrolling={enrollingCourseId === (selectedCourse.id || selectedCourse._id)}
                    isUnenrolling={unenrollingCourseId === (selectedCourse.id || selectedCourse._id)}
                    onClose={handleCloseModal}
                    onEnroll={handleEnrollFromModal}
                    onUnenroll={handleUnenrollFromModal}
                />
            )}
        </div>
    )
}
