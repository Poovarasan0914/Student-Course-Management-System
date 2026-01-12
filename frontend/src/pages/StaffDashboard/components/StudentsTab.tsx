import { SkeletonGrid } from '../../../components/ui/LoadingSpinner'
import { EmptyState } from '../../../components/ui/ErrorDisplay'
import type { Course, Enrollment } from '../../../types'
import { getId, getEnrolledStudentsForCourse, getUniqueStudentCount, formatDate } from '../utils/helpers.ts'

interface StudentsTabProps {
    courses: Course[]
    enrollments: Enrollment[]
    isLoading: boolean
}

export default function StudentsTab({ courses, enrollments, isLoading }: StudentsTabProps) {
    if (isLoading) {
        return <SkeletonGrid count={4} />
    }

    if (enrollments.length === 0) {
        return (
            <EmptyState
                title="No Enrolled Students"
                message="No students have enrolled in your courses yet."
            />
        )
    }

    // Group enrollments by course
    const courseEnrollments: Record<string, { course: Course; students: Enrollment[] }> =
        courses.reduce((acc: Record<string, { course: Course; students: Enrollment[] }>, course: Course) => {
            const courseId = getId(course)
            if (!courseId) return acc
            const students = getEnrolledStudentsForCourse(enrollments, courseId)
            if (students.length > 0) {
                acc[String(courseId)] = { course, students }
            }
            return acc
        }, {})

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm">
                    <span className="text-3xl font-bold text-blue-600 block">
                        {enrollments.length}
                    </span>
                    <span className="text-gray-500 text-sm">Total Enrollments</span>
                </div>
                <div className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm">
                    <span className="text-3xl font-bold text-green-600 block">
                        {courses.length}
                    </span>
                    <span className="text-gray-500 text-sm">Your Courses</span>
                </div>
                <div className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm">
                    <span className="text-3xl font-bold text-amber-500 block">
                        {getUniqueStudentCount(enrollments)}
                    </span>
                    <span className="text-gray-500 text-sm">Unique Students</span>
                </div>
            </div>

            {/* Enrollments by Course */}
            {Object.entries(courseEnrollments).map(([courseId, { course, students }]) => (
                <div
                    key={courseId}
                    className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-gray-800 text-lg font-semibold">{course.title}</h3>
                        <span className="text-sm text-blue-600">{students.length} enrolled</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left border-b border-gray-200">
                                    <th className="pb-3 text-gray-500 font-medium">Student Name</th>
                                    <th className="pb-3 text-gray-500 font-medium">Email</th>
                                    <th className="pb-3 text-gray-500 font-medium">Enrolled Date</th>
                                    <th className="pb-3 text-gray-500 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((enrollment: Enrollment) => (
                                    <tr key={getId(enrollment)} className="border-b border-gray-100">
                                        <td className="py-3 text-gray-800">{enrollment.studentName}</td>
                                        <td className="py-3 text-gray-600">{enrollment.studentEmail}</td>
                                        <td className="py-3 text-gray-600">
                                            {formatDate(enrollment.enrolledAt)}
                                        </td>
                                        <td className="py-3">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${enrollment.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                    }`}
                                            >
                                                {enrollment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    )
}
