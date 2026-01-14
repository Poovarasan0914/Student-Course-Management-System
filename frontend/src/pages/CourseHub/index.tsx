import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCourses, useStudentEnrollments } from '../../hooks/api'
import type { Course, Student, Enrollment } from '../../types'
import { getId } from '../../utils/helpers'
import ChatPanel from './components/ChatPanel'
import MaterialsPanel from './components/MaterialsPanel'
import CourseList from './components/CourseList'
import './styles.css'

export default function CourseHub() {
    const navigate = useNavigate()
    const [student, setStudent] = useState<Student | null>(null)
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
    const [activeView, setActiveView] = useState<'chat' | 'materials'>('chat')

    const studentId = getId(student)
    const { data: allCourses = [], isLoading: coursesLoading } = useCourses()
    const { data: enrollments = [], isLoading: enrollmentsLoading } = useStudentEnrollments(
        studentId ? String(studentId) : undefined
    )

    useEffect(() => {
        const currentStudent = localStorage.getItem('currentUser')
        if (!currentStudent) {
            navigate('/login')
            return
        }
        setStudent(JSON.parse(currentStudent))
    }, [navigate])

    const enrolledCourseIds = enrollments.map((e: Enrollment) => String(e.courseId))
    const enrolledCourses = allCourses.filter((course: Course) =>
        enrolledCourseIds.includes(String(getId(course)))
    )

    const handleCourseSelect = (course: Course) => {
        setSelectedCourse(course)
    }

    const handleBack = () => {
        navigate('/dashboard')
    }

    if (coursesLoading || enrollmentsLoading) {
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
                <h1><i className="bi bi-chat-dots me-2"></i>Course Communication Hub</h1>
                <p className="subtitle">Connect with instructors and access learning materials</p>
            </div>

            <div className="course-hub-container">
                {/* Left: Course List */}
                <CourseList
                    courses={enrolledCourses}
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
                                currentUser={student}
                                userRole="student"
                            />
                        ) : (
                            <MaterialsPanel
                                course={selectedCourse}
                                userRole="student"
                            />
                        )}
                    </div>
                ) : (
                    <div className="no-selection">
                        <i className="bi bi-chat-square-text"></i>
                        <h3>Select a Course</h3>
                        <p>Choose a course from the list to start chatting and viewing materials</p>
                    </div>
                )}
            </div>
        </div>
    )
}
