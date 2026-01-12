import type { Student, Course, Enrollment } from '../../../types'
import { getId, getStudentName, getCourseName } from '../utils/helpers.ts'

interface EnrollmentsTabProps {
    enrollments: Enrollment[]
    students: Student[]
    courses: Course[]
    searchTerm: string
    setSearchTerm: (term: string) => void
}

export default function EnrollmentsTab({
    enrollments,
    students,
    courses,
    searchTerm,
    setSearchTerm
}: EnrollmentsTabProps) {
    const filteredEnrollments = enrollments.filter((e: Enrollment) =>
        getStudentName(e.studentId, students).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCourseName(e.courseId, courses).toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="tab-content">
            <div className="tab-header">
                <h2>Enrollment Records</h2>
                <div className="search-filter">
                    <input
                        type="text"
                        placeholder="Search enrollments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Student</th>
                            <th>Course</th>
                            <th>Enrolled At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEnrollments.map((enrollment: Enrollment, index: number) => (
                            <tr key={getId(enrollment)}>
                                <td>{index + 1}</td>
                                <td>{getStudentName(enrollment.studentId, students)}</td>
                                <td>{getCourseName(enrollment.courseId, courses)}</td>
                                <td>{new Date(enrollment.enrolledAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {enrollments.length === 0 && (
                    <p className="no-data">No enrollments found</p>
                )}
            </div>
        </div>
    )
}
