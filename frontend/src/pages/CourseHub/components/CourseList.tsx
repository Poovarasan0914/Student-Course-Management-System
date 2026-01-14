import type { Course } from '../../../types'
import { getId, getImageUrl, PLACEHOLDER_IMAGE } from '../../../utils/helpers'

interface CourseListProps {
    courses: Course[]
    selectedCourse: Course | null
    onCourseSelect: (course: Course) => void
}

export default function CourseList({ courses, selectedCourse, onCourseSelect }: CourseListProps) {
    if (courses.length === 0) {
        return (
            <div className="course-sidebar">
                <h3>My Courses</h3>
                <div className="no-courses">
                    <i className="bi bi-inbox"></i>
                    <p>No enrolled courses yet</p>
                </div>
            </div>
        )
    }

    return (
        <div className="course-sidebar">
            <h3>My Courses ({courses.length})</h3>
            <div className="course-list">
                {courses.map((course) => {
                    const isSelected = selectedCourse && getId(course) === getId(selectedCourse)
                    return (
                        <div
                            key={getId(course)}
                            className={`course-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => onCourseSelect(course)}
                        >
                            <img
                                src={getImageUrl(course.image)}
                                alt={course.title}
                                className="course-thumb"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = PLACEHOLDER_IMAGE
                                }}
                            />
                            <div className="course-item-info">
                                <h4>{course.title}</h4>
                                <p className="instructor">
                                    <i className="bi bi-person-circle me-1"></i>
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
