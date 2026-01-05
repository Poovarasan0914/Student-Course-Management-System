import type { Course } from '../../../types'

interface EditCourseModalProps {
    isOpen: boolean
    course: Course | null
    setCourse: (course: Course | null) => void
    onClose: () => void
    onSave: () => void
}

export default function EditCourseModal({
    isOpen,
    course,
    setCourse,
    onClose,
    onSave
}: EditCourseModalProps) {
    if (!isOpen || !course) return null

    return (
        <div className="modal-overlay">
            <div className="modal modal-large">
                <h2>Edit Course</h2>
                <div className="modal-form">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={course.title}
                            onChange={(e) => setCourse({ ...course, title: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={course.description}
                            onChange={(e) => setCourse({ ...course, description: e.target.value })}
                            rows={3}
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Duration</label>
                            <input
                                type="text"
                                value={course.duration}
                                onChange={(e) => setCourse({ ...course, duration: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Level</label>
                            <select
                                value={course.level}
                                onChange={(e) => setCourse({ ...course, level: e.target.value })}
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input
                                type="text"
                                value={course.price}
                                onChange={(e) => setCourse({ ...course, price: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Image URL</label>
                        <input
                            type="text"
                            value={course.image}
                            onChange={(e) => setCourse({ ...course, image: e.target.value })}
                        />
                    </div>
                </div>
                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="save-btn" onClick={onSave}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
}
