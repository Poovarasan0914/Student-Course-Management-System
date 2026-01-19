import { useState, useMemo } from 'react'
import { useStudentDashboard } from './hooks/useStudentDashboard'
import Toast from '../../components/ui/Toast'
import {
    StudentHeader,
    CoursesGrid,
    CourseDetailModal
} from './components'
import type { Course } from '../../types'
import { getId } from '../../utils/helpers'

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
    const [courseFilter, setCourseFilter] = useState<'all' | 'enrolled'>('all')
    const [searchQuery, setSearchQuery] = useState('')

    // Filter courses based on selection and search query
    const filteredCourses = useMemo(() => {
        let result = courses

        // Apply enrollment filter
        if (courseFilter === 'enrolled') {
            const enrolledCourseIds = enrollments.map((e: { courseId: string | number }) => String(e.courseId))
            result = result.filter((course: Course) =>
                enrolledCourseIds.includes(String(getId(course)))
            )
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim()
            result = result.filter((course: Course) =>
                course.title.toLowerCase().includes(query) ||
                course.instructor.toLowerCase().includes(query) ||
                course.description?.toLowerCase().includes(query)
            )
        }

        return result
    }, [courses, enrollments, courseFilter, searchQuery])

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

    const handleFilterChange = (filter: 'all' | 'enrolled') => {
        setCourseFilter(filter)
    }

    const handleSearchChange = (query: string) => {
        setSearchQuery(query)
    }

    return (
        <div className="min-h-screen bg-bg">
            <StudentHeader
                user={user}
                onLogout={handleLogout}
                onFilterChange={handleFilterChange}
                currentFilter={courseFilter}
                courses={courses}
                enrollments={enrollments}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
            />

            {enrollmentMessage && (
                <Toast
                    message={enrollmentMessage}
                    onClose={clearEnrollmentMessage}
                />
            )}

            <main className="px-6 py-8 max-w-7xl mx-auto">
                <section>
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-semibold text-text">
                                {courseFilter === 'enrolled' ? 'My Enrolled Courses' : 'Available Courses'}
                            </h2>
                            <p className="text-text-secondary text-sm mt-1">
                                {courseFilter === 'enrolled'
                                    ? `You are enrolled in ${filteredCourses.length} course${filteredCourses.length !== 1 ? 's' : ''}`
                                    : `${courses.length} courses available • ${enrollments.length} enrolled`
                                }
                            </p>
                        </div>
                        {enrollments.length > 0 && courseFilter === 'all' && (
                            <button
                                onClick={() => setCourseFilter('enrolled')}
                                className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-primary-light text-primary rounded-xl font-medium hover:bg-primary hover:text-white transition-colors"
                            >
                                <i className="bi bi-collection"></i>
                                <span>View My Courses ({enrollments.length})</span>
                            </button>
                        )}
                    </div>

                    {/* Empty State for Enrolled Filter */}
                    {courseFilter === 'enrolled' && filteredCourses.length === 0 && !isLoading ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <i className="bi bi-book text-4xl text-primary"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-text mb-2">No Enrolled Courses Yet</h3>
                            <p className="text-text-secondary mb-6 max-w-md mx-auto">
                                You haven't enrolled in any courses. Browse available courses and start learning today!
                            </p>
                            <button
                                onClick={() => setCourseFilter('all')}
                                className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors"
                            >
                                <i className="bi bi-search me-2"></i>
                                Browse All Courses
                            </button>
                        </div>
                    ) : (
                        <CoursesGrid
                            courses={filteredCourses}
                            isLoading={isLoading}
                            error={fetchError}
                            enrollingCourseId={enrollingCourseId}
                            checkIsEnrolled={checkIsEnrolled}
                            onEnroll={handleEnroll}
                            onCourseClick={handleCourseClick}
                        />
                    )}
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
