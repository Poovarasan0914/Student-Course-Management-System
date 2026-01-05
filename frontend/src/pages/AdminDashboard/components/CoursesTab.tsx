import type { Course } from '../../../types'
import { getId, getImageUrl, PLACEHOLDER_IMAGE } from '../utils/helpers.ts'

interface CoursesTabProps {
    courses: Course[]
    searchTerm: string
    setSearchTerm: (term: string) => void
    onEditCourse: (course: Course) => void
    onDeleteCourse: (courseId: string | number) => void
}

export default function CoursesTab({
    courses,
    searchTerm,
    setSearchTerm,
    onEditCourse,
    onDeleteCourse
}: CoursesTabProps) {
    const filteredCourses = courses.filter((c: Course) => {
        const matchesSearch = `${c.title} ${c.instructor}`.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
    })

    return (
        <div className="tab-content">
            <div className="tab-header">
                <h2>Course Management</h2>
                <div className="search-filter">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>
            <div className="courses-grid">
                {filteredCourses.map((course: Course) => (
                    <div key={getId(course)} className="course-admin-card">
                        <img
                            src={getImageUrl(course.image)}
                            alt={course.title}
                            className="course-image"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE
                            }}
                        />
                        <div className="course-info">
                            <h3>{course.title}</h3>
                            <p className="instructor">By: {course.instructor}</p>
                            <p className="description">{course.description}</p>
                            <div className="course-meta">
                                <span className="duration">{course.duration}</span>
                                <span className="level">{course.level}</span>
                                <span className="price">${course.price}</span>
                            </div>
                        </div>
                        <div className="course-actions">
                            <button
                                className="edit-btn"
                                onClick={() => onEditCourse(course)}
                            >
                                Edit
                            </button>
                            <button
                                className="delete-btn"
                                onClick={() => onDeleteCourse(getId(course)!)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
                {filteredCourses.length === 0 && (
                    <p className="no-data">No courses found</p>
                )}
            </div>
        </div>
    )
}
