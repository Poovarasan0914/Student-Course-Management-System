import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCoursesByInstructor } from '../../hooks/api'
import type { Course, Staff } from '../../types'
import { getId } from '../../utils/helpers'
import ChatPanel from '../CourseHub/components/ChatPanel'
import MaterialsPanel from '../CourseHub/components/MaterialsPanel'
import CourseList from '../CourseHub/components/CourseList'
import '../CourseHub/styles.css'

export default function StaffCourseHub() {
    const navigate = useNavigate()
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
    const [activeView, setActiveView] = useState<'chat' | 'materials'>('chat')

    // Get staff from localStorage using useMemo to avoid setState in useEffect
    const staff = useMemo<Staff | null>(() => {
        const currentStaff = localStorage.getItem('currentStaff')
        if (!currentStaff) return null
        try {
            return JSON.parse(currentStaff) as Staff
        } catch {
            return null
        }
    }, [])

    // Redirect to login if no staff
    useEffect(() => {
        if (!staff) {
            navigate('/staff/login')
        }
    }, [staff, navigate])

    const staffId = getId(staff)
    const { data: courses = [], isLoading: coursesLoading } = useCoursesByInstructor(
        staffId ? String(staffId) : undefined
    )

    const handleCourseSelect = (course: Course) => {
        setSelectedCourse(course)
    }

    const handleBack = () => {
        navigate('/staff/dashboard')
    }

    if (coursesLoading) {
        return (
            <div className="course-hub">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading your courses...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="course-hub">
            <div className="course-hub-header">
                <button className="back-button" onClick={handleBack}>
                    <i className="bi bi-arrow-left"></i> Back to Dashboard
                </button>
                <h1><i className="bi bi-chat-dots me-2"></i>Staff Course Hub</h1>
                <p className="subtitle">Manage course chats and share learning materials</p>
            </div>

            <div className="course-hub-container">
                {/* Left: Course List - Using shared component */}
                <CourseList
                    courses={courses}
                    selectedCourse={selectedCourse}
                    onCourseSelect={handleCourseSelect}
                />

                {/* Center & Right: Chat or Materials */}
                {selectedCourse ? (
                    <div className="course-content">
                        {/* View Toggle */}
                        <div className="view-toggle">
                            <button
                                className={`toggle-btn ${activeView === 'chat' ? 'active' : ''}`}
                                onClick={() => setActiveView('chat')}
                            >
                                <i className="bi bi-chat-dots me-2"></i>Chat
                            </button>
                            <button
                                className={`toggle-btn ${activeView === 'materials' ? 'active' : ''}`}
                                onClick={() => setActiveView('materials')}
                            >
                                <i className="bi bi-folder me-2"></i>Materials
                            </button>
                        </div>

                        {/* Chat or Materials Panel */}
                        {activeView === 'chat' ? (
                            <ChatPanel
                                course={selectedCourse}
                                currentUser={staff}
                                userRole="staff"
                            />
                        ) : (
                            <MaterialsPanel
                                course={selectedCourse}
                                userRole="staff"
                            />
                        )}
                    </div>
                ) : (
                    <div className="no-selection">
                        <i className="bi bi-chat-square-text"></i>
                        <h3>Select a Course</h3>
                        <p>Choose a course from the list to start chatting and managing materials</p>
                    </div>
                )}
            </div>
        </div>
    )
}
