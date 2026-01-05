import { Button } from '../../../components/ui/button'
import { SkeletonGrid } from '../../../components/ui/LoadingSpinner'
import { ConnectionError, EmptyState } from '../../../components/ui/ErrorDisplay'
import type { Course } from '../../../types'
import { getId, getImageUrl, getLevelBadgeClass, PLACEHOLDER_IMAGE } from '../utils/helpers.ts'

interface CoursesTabProps {
    courses: Course[]
    isLoading: boolean
    error: Error | null
    deleteConfirm: string | number | null
    setDeleteConfirm: (id: string | number | null) => void
    onEditCourse: (course: Course) => void
    onDeleteCourse: (courseId: string | number) => void
}

export default function CoursesTab({
    courses,
    isLoading,
    error,
    deleteConfirm,
    setDeleteConfirm,
    onEditCourse,
    onDeleteCourse
}: CoursesTabProps) {
    if (isLoading) {
        return <SkeletonGrid count={4} />
    }

    if (error) {
        return <ConnectionError />
    }

    if (courses.length === 0) {
        return (
            <EmptyState
                title="No Courses Yet"
                message="You haven't created any courses yet. Click 'Add New Course' to get started!"
            />
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: Course) => {
                const courseId = getId(course)
                return (
                    <div
                        key={courseId}
                        className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="relative h-40 overflow-hidden">
                            <img
                                src={getImageUrl(course.image)}
                                alt={course.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = PLACEHOLDER_IMAGE
                                }}
                            />
                            <span
                                className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${getLevelBadgeClass(course.level)}`}
                            >
                                {course.level}
                            </span>
                        </div>
                        <div className="p-5">
                            <h3 className="text-gray-800 text-lg font-semibold mb-2">
                                {course.title}
                            </h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                {course.description}
                            </p>
                            <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-4">
                                <span>
                                    <i className="bi bi-clock me-1"></i>
                                    {course.duration}
                                </span>
                                <span>
                                    <i className="bi bi-currency-dollar me-1"></i>
                                    {course.price}
                                </span>
                                <span>
                                    <i className="bi bi-people me-1"></i>
                                    {course.students} students
                                </span>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => onEditCourse(course)}
                                >
                                    <i className="bi bi-pencil me-1"></i>Edit
                                </Button>
                                {deleteConfirm === courseId ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-red-400">Confirm?</span>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => onDeleteCourse(courseId!)}
                                        >
                                            Yes
                                        </Button>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => setDeleteConfirm(null)}
                                        >
                                            No
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setDeleteConfirm(courseId!)}
                                    >
                                        <i className="bi bi-trash me-1"></i>Delete
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
