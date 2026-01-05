import { Button } from '../../../components/ui/button'
import type { Course, CourseFormData } from '../../../types'

interface CourseModalProps {
    isOpen: boolean
    editingCourse: Course | null
    courseForm: CourseFormData
    isSaving: boolean
    onClose: () => void
    onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
    onSubmit: (e: React.FormEvent) => void
}

export default function CourseModal({
    isOpen,
    editingCourse,
    courseForm,
    isSaving,
    onClose,
    onFormChange,
    onSubmit
}: CourseModalProps) {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-gray-100 bg-opacity-30 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">
                        {editingCourse ? 'Edit Course' : 'Add New Course'}
                    </h2>
                    <button
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>
                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="form-label">Course Title</label>
                        <input
                            type="text"
                            name="title"
                            value={courseForm.title}
                            onChange={onFormChange}
                            placeholder="e.g., React Fundamentals"
                            className="form-input"
                            required
                        />
                    </div>

                    <div>
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            value={courseForm.description}
                            onChange={onFormChange}
                            placeholder="Describe what students will learn..."
                            rows={4}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="form-label">Duration</label>
                            <input
                                type="text"
                                name="duration"
                                value={courseForm.duration}
                                onChange={onFormChange}
                                placeholder="e.g., 4 weeks"
                                className="form-input"
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label">Level</label>
                            <select
                                name="level"
                                value={courseForm.level}
                                onChange={onFormChange}
                                className="form-input"
                                required
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="form-label">Price</label>
                            <input
                                type="text"
                                name="price"
                                value={courseForm.price}
                                onChange={onFormChange}
                                placeholder="e.g., $49.99"
                                className="form-input"
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label">Image URL</label>
                            <input
                                type="text"
                                name="image"
                                value={courseForm.image}
                                onChange={onFormChange}
                                placeholder="./src/assets/course.webp"
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="default" disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Course'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
