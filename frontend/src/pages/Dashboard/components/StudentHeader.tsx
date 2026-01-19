import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Course, Enrollment, Message, CourseMaterial } from '../../../types'
import { API_URL, getAuthHeaders } from '../../../hooks/api'

interface StudentHeaderProps {
    user: { firstName: string; lastName: string } | null
    onLogout: () => void
    onFilterChange?: (filter: 'all' | 'enrolled') => void
    currentFilter?: 'all' | 'enrolled'
    courses?: Course[]
    enrollments?: Enrollment[]
    searchQuery?: string
    onSearchChange?: (query: string) => void
}

const SEEN_COURSES_KEY = 'scms_seen_courses'
const SEEN_MESSAGES_KEY = 'scms_seen_messages'
const SEEN_MATERIALS_KEY = 'scms_seen_materials'

type NotificationType = 'course' | 'message' | 'material'

interface Notification {
    id: string
    type: NotificationType
    title: string
    subtitle: string
    courseTitle?: string
    timestamp?: string
    data?: Course | Message | CourseMaterial
}

export default function StudentHeader({
    user,
    onLogout,
    onFilterChange,
    currentFilter = 'all',
    courses = [],
    enrollments = [],
    searchQuery = '',
    onSearchChange
}: StudentHeaderProps) {
    const navigate = useNavigate()
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const notifRef = useRef<HTMLDivElement>(null)

    // Get enrolled course IDs
    const enrolledCourseIds = useMemo(() => {
        return enrollments.map(e => String(e.courseId))
    }, [enrollments])

    // Get new courses (courses not yet seen by user)
    const newCourses = useMemo(() => {
        const seenCourses: string[] = JSON.parse(localStorage.getItem(SEEN_COURSES_KEY) || '[]')
        return courses.filter(course => {
            const courseId = String(course._id || course.id)
            return !seenCourses.includes(courseId)
        })
    }, [courses])

    // Fetch messages and materials for enrolled courses
    const fetchNotifications = useCallback(async () => {
        if (enrolledCourseIds.length === 0) return

        setIsLoadingNotifications(true)
        const allNotifications: Notification[] = []

        // Add new course notifications
        newCourses.forEach(course => {
            allNotifications.push({
                id: `course-${course._id || course.id}`,
                type: 'course',
                title: 'New Course Available',
                subtitle: course.title,
                courseTitle: course.title,
                data: course
            })
        })

        // Get seen messages and materials from localStorage
        const seenMessages: string[] = JSON.parse(localStorage.getItem(SEEN_MESSAGES_KEY) || '[]')
        const seenMaterials: string[] = JSON.parse(localStorage.getItem(SEEN_MATERIALS_KEY) || '[]')

        try {
            // Fetch messages and materials for each enrolled course
            for (const courseId of enrolledCourseIds.slice(0, 5)) { // Limit to 5 courses for performance
                const course = courses.find(c => String(c._id || c.id) === courseId)
                const courseTitle = course?.title || 'Unknown Course'

                // Fetch messages
                try {
                    const messagesRes = await fetch(`${API_URL}/messages/${courseId}`, {
                        headers: getAuthHeaders()
                    })
                    if (messagesRes.ok) {
                        const messages: Message[] = await messagesRes.json()
                        // Get last 5 messages not seen
                        const newMessages = messages
                            .filter(m => !seenMessages.includes(m._id))
                            .slice(-5)

                        newMessages.forEach(msg => {
                            allNotifications.push({
                                id: `msg-${msg._id}`,
                                type: 'message',
                                title: `New message from ${msg.senderName}`,
                                subtitle: msg.content.length > 50 ? msg.content.substring(0, 50) + '...' : msg.content,
                                courseTitle,
                                timestamp: msg.createdAt,
                                data: msg
                            })
                        })
                    }
                } catch { /* ignore individual errors */ }

                // Fetch materials
                try {
                    const materialsRes = await fetch(`${API_URL}/materials/${courseId}`, {
                        headers: getAuthHeaders()
                    })
                    if (materialsRes.ok) {
                        const materials: CourseMaterial[] = await materialsRes.json()
                        // Get new materials not seen
                        const newMaterials = materials
                            .filter(m => !seenMaterials.includes(m._id))
                            .slice(-5)

                        newMaterials.forEach(mat => {
                            allNotifications.push({
                                id: `mat-${mat._id}`,
                                type: 'material',
                                title: 'New Material Added',
                                subtitle: mat.title,
                                courseTitle,
                                timestamp: mat.createdAt,
                                data: mat
                            })
                        })
                    }
                } catch { /* ignore individual errors */ }
            }
        } catch (error) {
            console.error('Error fetching notifications:', error)
        }

        // Sort by timestamp (newest first) and limit
        allNotifications.sort((a, b) => {
            if (a.timestamp && b.timestamp) {
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            }
            return 0
        })

        setNotifications(allNotifications.slice(0, 10))
        setIsLoadingNotifications(false)
    }, [enrolledCourseIds, courses, newCourses])

    // Fetch notifications on mount and periodically
    useEffect(() => {
        fetchNotifications()
        const interval = setInterval(fetchNotifications, 30000) // Refresh every 30 seconds
        return () => clearInterval(interval)
    }, [fetchNotifications])

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false)
            }
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const markNotificationAsSeen = (notif: Notification) => {
        if (notif.type === 'course' && notif.data) {
            const course = notif.data as Course
            const seen = JSON.parse(localStorage.getItem(SEEN_COURSES_KEY) || '[]')
            const courseId = String(course._id || course.id)
            if (!seen.includes(courseId)) {
                seen.push(courseId)
                localStorage.setItem(SEEN_COURSES_KEY, JSON.stringify(seen))
            }
        } else if (notif.type === 'message' && notif.data) {
            const msg = notif.data as Message
            const seen = JSON.parse(localStorage.getItem(SEEN_MESSAGES_KEY) || '[]')
            if (!seen.includes(msg._id)) {
                seen.push(msg._id)
                localStorage.setItem(SEEN_MESSAGES_KEY, JSON.stringify(seen))
            }
        } else if (notif.type === 'material' && notif.data) {
            const mat = notif.data as CourseMaterial
            const seen = JSON.parse(localStorage.getItem(SEEN_MATERIALS_KEY) || '[]')
            if (!seen.includes(mat._id)) {
                seen.push(mat._id)
                localStorage.setItem(SEEN_MATERIALS_KEY, JSON.stringify(seen))
            }
        }
        // Remove from notifications
        setNotifications(prev => prev.filter(n => n.id !== notif.id))
    }

    const handleNotificationClick = (notif: Notification) => {
        markNotificationAsSeen(notif)
        // Navigate to course hub
        navigate('/course-hub')
        setShowNotifications(false)
    }

    const handleClearAllNotifications = () => {
        // Mark all as seen
        const courseIds = courses.map(c => String(c._id || c.id))
        localStorage.setItem(SEEN_COURSES_KEY, JSON.stringify(courseIds))

        const messageIds = notifications.filter(n => n.type === 'message').map(n => {
            const msg = n.data as Message
            return msg._id
        })
        const existingMsgIds = JSON.parse(localStorage.getItem(SEEN_MESSAGES_KEY) || '[]')
        localStorage.setItem(SEEN_MESSAGES_KEY, JSON.stringify([...existingMsgIds, ...messageIds]))

        const materialIds = notifications.filter(n => n.type === 'material').map(n => {
            const mat = n.data as CourseMaterial
            return mat._id
        })
        const existingMatIds = JSON.parse(localStorage.getItem(SEEN_MATERIALS_KEY) || '[]')
        localStorage.setItem(SEEN_MATERIALS_KEY, JSON.stringify([...existingMatIds, ...materialIds]))

        setNotifications([])
        setShowNotifications(false)
    }

    const getNotificationIcon = (type: NotificationType) => {
        switch (type) {
            case 'course': return 'bi-book'
            case 'message': return 'bi-chat-dots'
            case 'material': return 'bi-file-earmark'
        }
    }

    const getNotificationColor = (type: NotificationType) => {
        switch (type) {
            case 'course': return 'bg-primary-light text-primary'
            case 'message': return 'bg-accent-light text-accent'
            case 'material': return 'bg-success-light text-success'
        }
    }

    const menuItems = [
        {
            icon: 'bi-book',
            label: 'My Courses',
            description: 'View enrolled courses only',
            action: () => {
                onFilterChange?.('enrolled')
                setShowProfileMenu(false)
            },
            active: currentFilter === 'enrolled'
        },
        {
            icon: 'bi-collection',
            label: 'All Courses',
            description: 'Browse all available courses',
            action: () => {
                onFilterChange?.('all')
                setShowProfileMenu(false)
            },
            active: currentFilter === 'all'
        },
        {
            icon: 'bi-chat-dots',
            label: 'Course Hub',
            description: 'Chat with instructors',
            action: () => {
                navigate('/course-hub')
                setShowProfileMenu(false)
            }
        },
        { divider: true },
        {
            icon: 'bi-box-arrow-right',
            label: 'Logout',
            description: 'Sign out of your account',
            action: onLogout,
            danger: true
        }
    ]

    return (
        <header className="sticky top-0 z-30 bg-surface border-b border-border">
            <div className="flex justify-between items-center px-6 py-4">
                <div className="lg:pl-0 pl-12">
                    <h1 className="text-xl font-semibold text-text">
                        {currentFilter === 'enrolled' ? 'My Courses' : 'My Learning'}
                    </h1>
                    {user && (
                        <p className="text-sm text-text-secondary">
                            Welcome back, {user.firstName}!
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="hidden md:block">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange?.(e.target.value)}
                                className="w-64 pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm text-text placeholder-text-muted bg-bg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                            />
                            <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"></i>
                            {searchQuery && (
                                <button
                                    onClick={() => onSearchChange?.('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                                >
                                    <i className="bi bi-x-lg text-sm"></i>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Quick Filter Toggle */}
                    <div className="hidden sm:flex items-center gap-1 p-1 bg-bg rounded-xl">
                        <button
                            onClick={() => onFilterChange?.('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentFilter === 'all'
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-text-secondary hover:text-text'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => onFilterChange?.('enrolled')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentFilter === 'enrolled'
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-text-secondary hover:text-text'
                                }`}
                        >
                            My Courses
                        </button>
                    </div>

                    {/* Course Hub Button */}
                    <button
                        onClick={() => navigate('/course-hub')}
                        className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors"
                    >
                        <i className="bi bi-chat-dots"></i>
                        <span className="hidden lg:inline">Course Hub</span>
                    </button>

                    {/* Notifications */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2.5 text-text-secondary hover:text-text hover:bg-surface-hover rounded-xl transition-colors"
                        >
                            <i className="bi bi-bell text-xl"></i>
                            {notifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {notifications.length > 9 ? '9+' : notifications.length}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 top-full mt-2 w-96 bg-surface rounded-2xl shadow-lg border border-border overflow-hidden z-50">
                                <div className="p-4 border-b border-border flex justify-between items-center">
                                    <h3 className="font-semibold text-text">Notifications</h3>
                                    {notifications.length > 0 && (
                                        <button
                                            onClick={handleClearAllNotifications}
                                            className="text-xs text-primary hover:underline"
                                        >
                                            Mark all as read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {isLoadingNotifications ? (
                                        <div className="p-6 text-center">
                                            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                                            <p className="text-text-secondary text-sm">Loading...</p>
                                        </div>
                                    ) : notifications.length === 0 ? (
                                        <div className="p-6 text-center">
                                            <i className="bi bi-bell-slash text-3xl text-text-muted mb-2 block"></i>
                                            <p className="text-text-secondary text-sm">No new notifications</p>
                                        </div>
                                    ) : (
                                        <div className="py-2">
                                            {notifications.map((notif) => (
                                                <button
                                                    key={notif.id}
                                                    onClick={() => handleNotificationClick(notif)}
                                                    className="w-full px-4 py-3 flex items-start gap-3 hover:bg-surface-hover transition-colors text-left"
                                                >
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getNotificationColor(notif.type)}`}>
                                                        <i className={`bi ${getNotificationIcon(notif.type)}`}></i>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-text truncate">
                                                            {notif.title}
                                                        </p>
                                                        <p className="text-xs text-text-muted truncate">
                                                            {notif.subtitle}
                                                        </p>
                                                        {notif.courseTitle && notif.type !== 'course' && (
                                                            <p className="text-xs text-primary mt-0.5 truncate">
                                                                {notif.courseTitle}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2"></span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 px-3 py-2 bg-bg rounded-xl hover:bg-surface-hover transition-colors"
                        >
                            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">
                                    {user?.firstName?.charAt(0)}
                                </span>
                            </div>
                            <div className="hidden lg:block text-left">
                                <p className="text-sm font-medium text-text">
                                    {user?.firstName}
                                </p>
                                <p className="text-xs text-text-muted">Student</p>
                            </div>
                            <i className={`bi bi-chevron-down text-text-muted text-sm transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}></i>
                        </button>

                        {/* Dropdown Menu */}
                        {showProfileMenu && (
                            <div className="absolute right-0 top-full mt-2 w-72 bg-surface rounded-2xl shadow-lg border border-border overflow-hidden z-50">
                                {/* User Info Header */}
                                <div className="p-4 bg-bg border-b border-border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                                            <span className="text-white text-lg font-semibold">
                                                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-text">
                                                {user?.firstName} {user?.lastName}
                                            </p>
                                            <p className="text-sm text-text-muted">Student Account</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="py-2">
                                    {menuItems.map((item, index) => {
                                        if ('divider' in item) {
                                            return <div key={index} className="my-2 border-t border-border"></div>
                                        }
                                        return (
                                            <button
                                                key={index}
                                                onClick={item.action}
                                                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-surface-hover transition-colors text-left ${item.danger ? 'text-error hover:bg-error-light' : ''
                                                    } ${item.active ? 'bg-primary-light' : ''}`}
                                            >
                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.active
                                                    ? 'bg-primary text-white'
                                                    : item.danger
                                                        ? 'bg-error-light text-error'
                                                        : 'bg-bg text-text-secondary'
                                                    }`}>
                                                    <i className={`bi ${item.icon}`}></i>
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`text-sm font-medium ${item.danger ? 'text-error' : 'text-text'}`}>
                                                        {item.label}
                                                    </p>
                                                    <p className="text-xs text-text-muted">{item.description}</p>
                                                </div>
                                                {item.active && (
                                                    <i className="bi bi-check-lg text-primary"></i>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
