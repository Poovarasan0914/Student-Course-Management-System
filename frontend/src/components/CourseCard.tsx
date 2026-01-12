import type { Course } from '../types'
import { getImageUrl, PLACEHOLDER_IMAGE } from '../utils/helpers.ts'

type CourseCardProps = {
    course: Course
    isEnrolled?: boolean
    isEnrolling?: boolean
    onEnroll?: (course: Course) => void | Promise<void>
    onClick?: (course: Course) => void
}

export default function CourseCard({
    course,
    isEnrolled = false,
    isEnrolling = false,
    onEnroll,
    onClick
}: CourseCardProps) {
    const getBadgeColor = (level: string) => {
        switch (level) {
            case 'Beginner':
                return 'bg-gradient-to-r from-emerald-500 to-emerald-600'
            case 'Intermediate':
                return 'bg-gradient-to-r from-amber-500 to-amber-600'
            case 'Advanced':
                return 'bg-gradient-to-r from-red-500 to-red-600'
            default:
                return 'bg-gradient-to-r from-emerald-500 to-emerald-600'
        }
    }

    const handleEnrollClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onEnroll && !isEnrolled && !isEnrolling) {
            onEnroll(course)
        }
    }

    const handleCardClick = () => {
        if (onClick) {
            onClick(course)
        }
    }

    return (
        <div
            className={`bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-200 ${isEnrolled ? 'border-green-300 ring-2 ring-green-100' : ''} ${onClick ? 'cursor-pointer' : ''}`}
            onClick={handleCardClick}
        >
            <div className="relative h-44 overflow-hidden">
                <img
                    src={getImageUrl(course.image)}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = PLACEHOLDER_IMAGE
                    }}
                />
                <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${getBadgeColor(course.level)}`}>
                    {course.level}
                </span>
                {onClick && (
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                        <span className="bg-white/90 px-4 py-2 rounded-full text-sm font-medium text-gray-800 shadow-lg">
                            <i className="bi bi-eye me-2"></i>View Details
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5">
                <h3 className="text-gray-800 text-lg font-semibold mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{course.description}</p>

                <div className="flex flex-wrap gap-4 mb-3 text-xs text-gray-600">
                    <span><i className="bi bi-person-circle me-1"></i>{course.instructor}</span>
                    <span><i className="bi bi-clock me-1"></i>{course.duration}</span>
                </div>

                <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-500">
                    <span><i className="bi bi-people me-1"></i>{course.students} students</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-lg font-bold text-blue-600">{course.price}</span>
                    <button
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm shadow-sm ${isEnrolled
                            ? 'bg-green-600 text-white cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95'
                            } ${isEnrolling ? 'opacity-50' : ''}`}
                        onClick={handleEnrollClick}
                        disabled={isEnrolled || isEnrolling}
                    >
                        {isEnrolled ? (
                            <>
                                <i className="bi bi-check-circle me-1"></i> Enrolled
                            </>
                        ) : isEnrolling ? (
                            'Enrolling...'
                        ) : (
                            'Enroll Now'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

