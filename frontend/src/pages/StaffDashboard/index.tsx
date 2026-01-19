import { useState } from 'react'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Toast from '../../components/ui/Toast'
import Sidebar, { type SidebarItem } from '../../components/ui/Sidebar'
import { useStaffDashboard } from './hooks/useStaffDashboard'
import {
    StaffHeader,
    CoursesTab,
    StudentsTab,
    CourseModal
} from './components'
import type { Course, Staff } from '../../types'
import { getId } from '../../utils/helpers'

// Import Course Hub components
import ChatPanel from '../CourseHub/components/ChatPanel'
import MaterialsPanel from '../CourseHub/components/MaterialsPanel'
import '../CourseHub/styles.css'

type StaffTabType = 'courses' | 'students' | 'course-hub'

export default function StaffDashboard() {
    const {
        // State
        staff,
        activeTab,
        setActiveTab,
        showCourseModal,
        editingCourse,
        courseForm,
        actionMessage,
        deleteConfirm,
        setDeleteConfirm,
        isLoading,
        isSaving,

        // Data
        courses,
        enrollments,
        coursesError,

        // Handlers
        handleLogout,
        openAddCourseModal,
        openEditCourseModal,
        closeCourseModal,
        handleCourseFormChange,
        handleSaveCourse,
        handleDeleteCourse,
        clearActionMessage
    } = useStaffDashboard()

    // Course Hub state
    const [selectedHubCourse, setSelectedHubCourse] = useState<Course | null>(null)
    const [hubActiveView, setHubActiveView] = useState<'chat' | 'materials'>('chat')

    // Sidebar navigation items
    const sidebarItems: SidebarItem[] = [
        { id: 'courses', label: 'My Courses', icon: 'bi-book', badge: courses.length },
        { id: 'students', label: 'Enrolled Students', icon: 'bi-mortarboard', badge: enrollments.length },
        { id: 'course-hub', label: 'Course Hub', icon: 'bi-chat-dots' }
    ]

    const handleTabChange = (id: string) => {
        setActiveTab(id as StaffTabType)
        // Reset Course Hub selection when switching tabs
        if (id !== 'course-hub') {
            setSelectedHubCourse(null)
        }
    }

    const handleHubCourseSelect = (course: Course) => {
        setSelectedHubCourse(course)
        setHubActiveView('chat')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <LoadingSpinner size="large" text="Loading staff dashboard..." />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-bg flex">
            {/* Sidebar Navigation */}
            <Sidebar
                items={sidebarItems}
                activeItem={activeTab}
                onItemClick={handleTabChange}
                header={{
                    title: 'Staff Panel',
                    subtitle: `${staff?.firstName || 'Instructor'}`,
                    icon: 'bi-person-badge'
                }}
            />

            {/* Main Content Area */}
            <div className="flex-1 min-h-screen lg:ml-0">
                <StaffHeader staff={staff} onLogout={handleLogout} />

                {actionMessage && (
                    <Toast
                        message={actionMessage}
                        onClose={clearActionMessage}
                    />
                )}

                <main className="px-6 py-8 max-w-7xl mx-auto">
                    {/* Courses Tab */}
                    {activeTab === 'courses' && (
                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
                                    <p className="text-gray-500 mt-1">Manage your course offerings</p>
                                </div>
                                <button
                                    onClick={openAddCourseModal}
                                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all shadow-sm flex items-center gap-2"
                                >
                                    <i className="bi bi-plus-lg"></i>
                                    Add Course
                                </button>
                            </div>
                            <CoursesTab
                                courses={courses}
                                isLoading={false}
                                error={coursesError}
                                deleteConfirm={deleteConfirm}
                                setDeleteConfirm={setDeleteConfirm}
                                onEditCourse={openEditCourseModal}
                                onDeleteCourse={handleDeleteCourse}
                            />
                        </section>
                    )}

                    {/* Students Tab */}
                    {activeTab === 'students' && (
                        <section>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Enrolled Students</h2>
                                <p className="text-gray-500 mt-1">View students enrolled in your courses</p>
                            </div>
                            <StudentsTab
                                courses={courses}
                                enrollments={enrollments}
                                isLoading={false}
                            />
                        </section>
                    )}

                    {/* Course Hub Tab - Integrated */}
                    {activeTab === 'course-hub' && (
                        <section className="course-hub-integrated">
                            <div className="mb-4 shrink-0">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Course Hub
                                </h2>
                                <p className="text-gray-400 mt-1 text-sm">Chat with students and share learning materials</p>
                            </div>

                            {courses.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                                    <i className="bi bi-inbox text-5xl text-gray-200 mb-4 block"></i>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Courses Yet</h3>
                                    <p className="text-gray-400 mb-6 text-sm">Create courses to start communicating with students</p>
                                    <button
                                        onClick={() => setActiveTab('courses')}
                                        className="px-5 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-all text-sm"
                                    >
                                        Go to Courses
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-0">
                                    {/* Course List Sidebar - Scrollable */}
                                    <div className="lg:col-span-1 bg-white rounded-xl border border-gray-100 flex flex-col max-h-[calc(100vh-200px)]">
                                        <div className="p-3 border-b border-gray-100 shrink-0">
                                            <h3 className="font-medium text-gray-600 text-sm">
                                                My Courses ({courses.length})
                                            </h3>
                                        </div>
                                        <div className="p-2 space-y-1 overflow-y-auto flex-1">
                                            {courses.map((course: Course) => {
                                                const isSelected = selectedHubCourse && getId(course) === getId(selectedHubCourse)
                                                const courseEnrollments = enrollments.filter(
                                                    (e: { courseId: string | number }) => String(e.courseId) === String(getId(course))
                                                )
                                                return (
                                                    <button
                                                        key={getId(course)}
                                                        onClick={() => handleHubCourseSelect(course)}
                                                        className={`w-full text-left p-3 rounded-lg transition-all ${isSelected
                                                            ? 'bg-gray-800 text-white'
                                                            : 'hover:bg-gray-50 text-gray-700'
                                                            }`}
                                                    >
                                                        <p className="font-medium text-sm truncate">{course.title}</p>
                                                        <p className={`text-xs mt-1 ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                                                            {courseEnrollments.length} students
                                                        </p>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Chat/Materials Area - Fixed Height */}
                                    <div className="lg:col-span-3 flex flex-col max-h-[calc(100vh-200px)]">
                                        {selectedHubCourse ? (
                                            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col h-full">
                                                {/* View Toggle */}
                                                <div className="flex border-b border-gray-100 shrink-0">
                                                    <button
                                                        onClick={() => setHubActiveView('chat')}
                                                        className={`flex-1 py-2.5 px-4 font-medium text-sm transition-all ${hubActiveView === 'chat'
                                                            ? 'bg-gray-800 text-white'
                                                            : 'text-gray-500 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <i className="bi bi-chat-dots me-2"></i>Chat
                                                    </button>
                                                    <button
                                                        onClick={() => setHubActiveView('materials')}
                                                        className={`flex-1 py-2.5 px-4 font-medium text-sm transition-all ${hubActiveView === 'materials'
                                                            ? 'bg-gray-800 text-white'
                                                            : 'text-gray-500 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <i className="bi bi-folder me-2"></i>Materials
                                                    </button>
                                                </div>

                                                {/* Content */}
                                                <div className="course-hub-content flex-1 min-h-0">
                                                    {hubActiveView === 'chat' ? (
                                                        <ChatPanel
                                                            course={selectedHubCourse}
                                                            currentUser={staff as Staff}
                                                            userRole="staff"
                                                        />
                                                    ) : (
                                                        <MaterialsPanel
                                                            course={selectedHubCourse}
                                                            userRole="staff"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center flex-1 flex flex-col items-center justify-center">
                                                <i className="bi bi-chat-square-text text-4xl text-gray-200 mb-4 block"></i>
                                                <h3 className="text-base font-semibold text-gray-700 mb-1">Select a Course</h3>
                                                <p className="text-gray-400 text-sm">Choose a course to start chatting</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}
                </main>
            </div>

            <CourseModal
                isOpen={showCourseModal}
                editingCourse={editingCourse}
                courseForm={courseForm}
                isSaving={isSaving}
                onClose={closeCourseModal}
                onFormChange={handleCourseFormChange}
                onSubmit={handleSaveCourse}
            />
        </div>
    )
}

