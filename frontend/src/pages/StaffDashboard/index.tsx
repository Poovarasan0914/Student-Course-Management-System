import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Toast from '../../components/ui/Toast'
import { useStaffDashboard } from './hooks/useStaffDashboard'
import {
    StaffHeader,
    StaffNavigation,
    CoursesTab,
    StudentsTab,
    CourseModal
} from './components'

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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
                <LoadingSpinner size="large" text="Loading staff dashboard..." />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-blue-50">
            <StaffHeader staff={staff} onLogout={handleLogout} />

            {actionMessage && (
                <Toast
                    message={actionMessage}
                    onClose={clearActionMessage}
                />
            )}

            <main className="px-6 py-8 max-w-7xl mx-auto">
                <StaffNavigation
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    coursesCount={courses.length}
                    enrollmentsCount={enrollments.length}
                    onAddCourse={openAddCourseModal}
                />

                <section>
                    {activeTab === 'courses' ? (
                        <CoursesTab
                            courses={courses}
                            isLoading={false}
                            error={coursesError}
                            deleteConfirm={deleteConfirm}
                            setDeleteConfirm={setDeleteConfirm}
                            onEditCourse={openEditCourseModal}
                            onDeleteCourse={handleDeleteCourse}
                        />
                    ) : (
                        <StudentsTab
                            courses={courses}
                            enrollments={enrollments}
                            isLoading={false}
                        />
                    )}
                </section>
            </main>

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
