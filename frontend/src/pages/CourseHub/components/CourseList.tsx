import type { Course } from '../../../types'
import { getId } from '../../../utils/helpers'

interface CourseListProps {
    courses: Course[]
    selectedCourse: Course | null
    onCourseSelect: (course: Course) => void
}

export default function CourseList({ courses, selectedCourse, onCourseSelect }: CourseListProps) {
    if (courses.length === 0) {
        return (
            <div className="course-list">
                <div className="course-list-header">
                    <h3>My Courses</h3>
                </div>
                <div className="empty-courses">
                    <i className="bi bi-inbox"></i>
                    <p>No enrolled courses yet</p>
                </div>
            </div>
        )
    }

    return (
        <div className="course-list">
            <div className="course-list-header">
                <h3>My Courses ({courses.length})</h3>
            </div>
            <div className="course-list-items">
                {courses.map((course) => {
                    const isSelected = selectedCourse && getId(course) === getId(selectedCourse)
                    return (
                        <div
                            key={getId(course)}
                            className={`course-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => onCourseSelect(course)}
                        >
                            <div className="course-item-icon">
                                <i className="bi bi-book"></i>
                            </div>
                            <div className="course-item-info">
                                <p className="course-item-title">{course.title}</p>
                                <p className="course-item-instructor">
                                    <i className="bi bi-person me-1"></i>
                                    {course.instructor}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
