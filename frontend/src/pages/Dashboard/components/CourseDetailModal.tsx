import { useState, useRef, useEffect } from 'react'
import type { Course } from '../../../types'
import { getImageUrl, PLACEHOLDER_IMAGE } from '../../../utils/helpers'

interface CourseDetailModalProps {
    course: Course
    isEnrolled: boolean
    isEnrolling: boolean
    isUnenrolling?: boolean
    onClose: () => void
    onEnroll: (course: Course) => void
    onUnenroll?: (course: Course) => void
}

export default function CourseDetailModal({
    course,
    isEnrolled,
    isEnrolling,
    isUnenrolling = false,
    onClose,
    onEnroll,
    onUnenroll
}: CourseDetailModalProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'reviews'>('overview')
    const [isPlaying, setIsPlaying] = useState(false)
    const [showUnenrollConfirm, setShowUnenrollConfirm] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const videoContainerRef = useRef<HTMLDivElement>(null)

    // Listen for fullscreen changes (e.g., when user presses ESC)
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }

        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange)
        }
    }, [])

    // Sample course content/lessons
    const courseLessons = [
        { id: 1, title: 'Introduction to the Course', duration: '5:30', isPreview: true },
        { id: 2, title: 'Getting Started with Basics', duration: '12:45', isPreview: true },
        { id: 3, title: 'Core Concepts Explained', duration: '18:20', isPreview: false },
        { id: 4, title: 'Hands-on Practice Session', duration: '25:00', isPreview: false },
        { id: 5, title: 'Advanced Techniques', duration: '22:15', isPreview: false },
        { id: 6, title: 'Real-world Projects', duration: '30:00', isPreview: false },
        { id: 7, title: 'Best Practices & Tips', duration: '15:30', isPreview: false },
        { id: 8, title: 'Final Assessment & Wrap-up', duration: '10:00', isPreview: false },
    ]

    const handlePlayVideo = () => {
        if (isEnrolled || courseLessons[0]?.isPreview) {
            setIsPlaying(true)
        }
    }

    const handleUnenrollClick = () => {
        setShowUnenrollConfirm(true)
    }

    const confirmUnenroll = () => {
        if (onUnenroll) {
            onUnenroll(course)
        }
        setShowUnenrollConfirm(false)
    }

    const toggleFullscreen = async () => {
        if (!videoContainerRef.current) return

        try {
            if (!document.fullscreenElement) {
                await videoContainerRef.current.requestFullscreen()
                setIsFullscreen(true)
            } else {
                await document.exitFullscreen()
                setIsFullscreen(false)
            }
        } catch (err) {
            console.error('Fullscreen error:', err)
        }
    }

    // Helper function to get embeddable video URL
    const getVideoEmbedUrl = (url: string | undefined): string | null => {
        if (!url || url.trim() === '') return null

        const trimmedUrl = url.trim()

        // YouTube URL patterns - handle various formats
        // Standard: https://www.youtube.com/watch?v=VIDEO_ID
        // Short: https://youtu.be/VIDEO_ID
        // Embed: https://www.youtube.com/embed/VIDEO_ID
        const youtubePatterns = [
            /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
            /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
            /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
            /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
            /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/
        ]

        for (const pattern of youtubePatterns) {
            const match = trimmedUrl.match(pattern)
            if (match && match[1]) {
                return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`
            }
        }

        // Vimeo URL patterns
        const vimeoMatch = trimmedUrl.match(/(?:vimeo\.com\/)(\d+)/)
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
        }

        // Direct video URL (mp4, webm, etc.)
        if (trimmedUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
            return trimmedUrl
        }

        // If it's already an embed URL, return as is
        if (trimmedUrl.includes('youtube.com/embed') || trimmedUrl.includes('player.vimeo.com')) {
            return trimmedUrl.includes('?') ? trimmedUrl + '&autoplay=1' : trimmedUrl + '?autoplay=1'
        }

        return null
    }

    const videoUrl = getVideoEmbedUrl(course.videoUrl)
    const isEmbedVideo = videoUrl && (videoUrl.includes('youtube.com/embed') || videoUrl.includes('player.vimeo.com'))
    const isDirectVideo = videoUrl && !isEmbedVideo

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Header */}
            <div className="bg-gray-900 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                    >
                        <i className="bi bi-arrow-left text-white text-lg"></i>
                    </button>
                    <div>
                        <h1 className="text-white font-semibold text-lg">{course.title}</h1>
                        <p className="text-gray-400 text-sm">by {course.instructor}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                    >
                        <i className="bi bi-x-lg text-white"></i>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Video Section - Left Side */}
                <div ref={videoContainerRef} className={`flex-1 bg-black flex flex-col ${isFullscreen ? 'fixed inset-0 z-100' : ''}`}>
                    <div className="flex-1 relative">
                        {isPlaying ? (
                            <div className="absolute inset-0 group">
                                {isEmbedVideo ? (
                                    <iframe
                                        src={videoUrl}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                        allowFullScreen
                                        title={course.title}
                                    />
                                ) : isDirectVideo ? (
                                    <video
                                        className="w-full h-full"
                                        controls
                                        autoPlay
                                        poster={getImageUrl(course.image)}
                                    >
                                        <source src={videoUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                                        <div className="text-center text-white p-6">
                                            <i className="bi bi-play-circle text-6xl mb-4 opacity-50"></i>
                                            <p className="text-gray-400">Video content will be available soon</p>
                                            <p className="text-sm text-gray-500 mt-2">Course video not configured or invalid URL</p>
                                            {course.videoUrl && (
                                                <div className="mt-4 p-3 bg-gray-800 rounded-lg text-left max-w-md mx-auto">
                                                    <p className="text-xs text-gray-400 mb-1">Provided Video URL:</p>
                                                    <p className="text-xs text-gray-500 break-all">{course.videoUrl}</p>
                                                    <p className="text-xs text-red-400 mt-2">
                                                        Unable to parse this URL. Please use a valid YouTube, Vimeo, or direct video URL (mp4/webm).
                                                    </p>
                                                </div>
                                            )}
                                            {!course.videoUrl && (
                                                <p className="text-xs text-gray-600 mt-4">
                                                    No video URL was provided for this course.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Floating Fullscreen Button during playback */}
                                {(isEmbedVideo || isDirectVideo) && (
                                    <button
                                        onClick={toggleFullscreen}
                                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10"
                                        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                                    >
                                        <i className={`bi ${isFullscreen ? 'bi-fullscreen-exit' : 'bi-fullscreen'} text-white`}></i>
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="absolute inset-0">
                                <img
                                    src={getImageUrl(course.image)}
                                    alt={course.title}
                                    className="w-full h-full object-cover opacity-60"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.src = PLACEHOLDER_IMAGE
                                    }}
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20" />

                                {/* Play Button */}
                                <button
                                    onClick={handlePlayVideo}
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/90 rounded-full flex items-center justify-center shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300 group"
                                >
                                    <i className="bi bi-play-fill text-5xl text-blue-600 ml-2 group-hover:text-blue-700"></i>
                                </button>

                                {/* Preview/Enrolled Badge */}
                                <div className="absolute top-6 left-6">
                                    {isEnrolled ? (
                                        <span className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-full">
                                            <i className="bi bi-check-circle me-2"></i>Enrolled
                                        </span>
                                    ) : (
                                        <span className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full">
                                            <i className="bi bi-eye me-2"></i>Preview Available
                                        </span>
                                    )}
                                </div>

                                {/* Fullscreen Button (top-right) */}
                                <button
                                    onClick={toggleFullscreen}
                                    className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                                    title="Enter Fullscreen"
                                >
                                    <i className="bi bi-fullscreen text-white text-lg"></i>
                                </button>

                                {/* Course Info Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <div className="flex items-center gap-6 text-white/80 text-sm mb-4">
                                        <span className="flex items-center gap-2">
                                            <i className="bi bi-clock"></i>
                                            {course.duration}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <i className="bi bi-people"></i>
                                            {course.students} students
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <i className="bi bi-star-fill text-amber-400"></i>
                                            {course.rating}
                                        </span>
                                    </div>
                                    <p className="text-white/70 text-sm max-w-2xl line-clamp-2">{course.description}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Video Controls Bar */}
                    {isPlaying && (
                        <div className="bg-gray-900 px-6 py-3 flex items-center justify-between">
                            <button
                                onClick={() => setIsPlaying(false)}
                                className="text-gray-400 hover:text-white text-sm flex items-center gap-2"
                            >
                                <i className="bi bi-arrow-left"></i>
                                Back to overview
                            </button>
                            <span className="text-gray-400 text-sm">
                                Now playing: {course.title}
                            </span>
                            <button
                                onClick={toggleFullscreen}
                                className="text-gray-400 hover:text-white text-sm flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                            >
                                <i className={`bi ${isFullscreen ? 'bi-fullscreen-exit' : 'bi-fullscreen'}`}></i>
                                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar - Right Side */}
                <div className="w-100 bg-white flex flex-col shrink-0">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-gray-200 shrink-0">
                        {(['overview', 'content', 'reviews'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 px-4 py-4 font-medium text-sm capitalize transition-colors border-b-2 -mb-px ${activeTab === tab
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Price & Action */}
                                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                                    <div className="text-3xl font-bold text-blue-600">{course.price}</div>

                                    {!isEnrolled ? (
                                        <button
                                            onClick={() => onEnroll(course)}
                                            disabled={isEnrolling}
                                            className={`w-full py-3 rounded-lg font-semibold transition-all bg-blue-600 text-white hover:bg-blue-700 ${isEnrolling ? 'opacity-50' : ''}`}
                                        >
                                            {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                                        </button>
                                    ) : (
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => setIsPlaying(true)}
                                                className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
                                            >
                                                <i className="bi bi-play-circle me-2"></i>Continue Learning
                                            </button>
                                            <button
                                                onClick={handleUnenrollClick}
                                                disabled={isUnenrolling}
                                                className={`w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-red-100 hover:text-red-600 transition-all ${isUnenrolling ? 'opacity-50' : ''}`}
                                            >
                                                {isUnenrolling ? 'Unenrolling...' : 'Unenroll from Course'}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* About */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">About This Course</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">{course.description}</p>
                                </div>

                                {/* What You'll Learn */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">What You'll Learn</h3>
                                    <ul className="space-y-2">
                                        {[
                                            'Master the fundamentals and core concepts',
                                            'Build real-world projects from scratch',
                                            'Learn industry best practices',
                                            'Gain hands-on practical experience',
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-start gap-2 text-gray-600 text-sm">
                                                <i className="bi bi-check-circle-fill text-green-500 mt-0.5"></i>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Course Includes */}
                                <div className="bg-gray-50 rounded-xl p-5">
                                    <h4 className="font-semibold text-gray-800 mb-3">This course includes:</h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-center gap-2">
                                            <i className="bi bi-play-circle text-blue-600"></i>
                                            {course.duration} of video content
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <i className="bi bi-file-earmark-text text-blue-600"></i>
                                            {courseLessons.length} lessons
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <i className="bi bi-infinity text-blue-600"></i>
                                            Full lifetime access
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <i className="bi bi-award text-blue-600"></i>
                                            Certificate of completion
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Content Tab */}
                        {activeTab === 'content' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-800">Course Content</h3>
                                    <span className="text-xs text-gray-500">
                                        {courseLessons.length} lessons
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {courseLessons.map((lesson, index) => (
                                        <div
                                            key={lesson.id}
                                            onClick={() => (isEnrolled || lesson.isPreview) && setIsPlaying(true)}
                                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isEnrolled || lesson.isPreview
                                                ? 'hover:bg-blue-50 cursor-pointer'
                                                : 'opacity-60'
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${isEnrolled || lesson.isPreview
                                                ? 'bg-blue-100 text-blue-600'
                                                : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                {isEnrolled || lesson.isPreview ? (
                                                    <i className="bi bi-play-fill"></i>
                                                ) : (
                                                    <i className="bi bi-lock-fill text-xs"></i>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-800 text-sm truncate">
                                                    {index + 1}. {lesson.title}
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-gray-500">{lesson.duration}</span>
                                                    {lesson.isPreview && !isEnrolled && (
                                                        <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                                                            Preview
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {!isEnrolled && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                                        <p className="text-blue-800 font-medium mb-2">Unlock all lessons</p>
                                        <button
                                            onClick={() => onEnroll(course)}
                                            disabled={isEnrolling}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all text-sm"
                                        >
                                            Enroll Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-gray-800">{course.rating}</div>
                                        <div className="flex items-center justify-center gap-0.5 my-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <i
                                                    key={star}
                                                    className={`bi bi-star-fill text-sm ${star <= Math.floor(course.rating)
                                                        ? 'text-amber-400'
                                                        : 'text-gray-300'
                                                        }`}
                                                ></i>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-500">Course Rating</p>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        {[5, 4, 3, 2, 1].map((rating) => (
                                            <div key={rating} className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500 w-3">{rating}</span>
                                                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-amber-400 rounded-full"
                                                        style={{
                                                            width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 7 : 3}%`
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { name: 'John D.', rating: 5, date: '2 weeks ago', comment: 'Excellent course! The instructor explains everything clearly.' },
                                        { name: 'Sarah M.', rating: 4, date: '1 month ago', comment: 'Great content and well-structured. Highly recommend!' },
                                        { name: 'Michael R.', rating: 5, date: '1 month ago', comment: 'This course exceeded my expectations.' }
                                    ].map((review, index) => (
                                        <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="font-semibold text-blue-600 text-sm">{review.name[0]}</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800 text-sm">{review.name}</p>
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(review.rating)].map((_, i) => (
                                                            <i key={i} className="bi bi-star-fill text-amber-400 text-xs"></i>
                                                        ))}
                                                        <span className="text-xs text-gray-400 ml-1">{review.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Unenroll Confirmation Modal */}
            {showUnenrollConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
                    <div className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="bi bi-exclamation-triangle text-red-600 text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Unenroll from Course?</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to unenroll from "{course.title}"?
                                You will lose access to all course content.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowUnenrollConfirm(false)}
                                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmUnenroll}
                                    disabled={isUnenrolling}
                                    className="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
                                >
                                    {isUnenrolling ? 'Unenrolling...' : 'Yes, Unenroll'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
