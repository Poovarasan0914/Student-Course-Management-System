import CourseCard from '../../../components/CourseCard'
import { SkeletonGrid } from '../../../components/ui/LoadingSpinner'
import { ConnectionError, EmptyState } from '../../../components/ui/ErrorDisplay'
import type { Course } from '../../../types'
import { getId } from '../utils/helpers.ts'

interface CoursesGridProps {
    courses: Course[]
    isLoading: boolean
    error: Error | null
    enrollingCourseId: string | number | null
    checkIsEnrolled: (courseId: string | number | undefined) => boolean
    onEnroll: (course: Course) => void
}

export default function CoursesGrid({
    courses,
    isLoading,
    error,
    enrollingCourseId,
    checkIsEnrolled,
    onEnroll
}: CoursesGridProps) {
    if (isLoading) {
        return <SkeletonGrid count={8} />
    }

    if (error) {
        return <ConnectionError />
    }

    if (courses.length === 0) {
        return (
            <EmptyState
                title="No Courses Available"
                message="There are no courses available at the moment. Please check back later or contact support."
            />
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course: Course) => {
                const courseId = getId(course)
                return (
                    <CourseCard
                        key={courseId}
                        course={course}
                        isEnrolled={checkIsEnrolled(courseId)}
                        isEnrolling={enrollingCourseId === courseId}
                        onEnroll={onEnroll}
                    />
                )
            })}
        </div>
    )
}
