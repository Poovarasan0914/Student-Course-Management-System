import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { useAdminDashboard } from './hooks/useAdminDashboard'
import {
    AdminHeader,
    AdminNavigation,
    DashboardOverview,
    StudentsTab,
    StaffTab,
    AdminsTab,
    CoursesTab,
    EnrollmentsTab,
    AddAdminModal,
    EditCourseModal
} from './components'

export default function AdminDashboard() {
    const {
        // State
        activeTab,
        setActiveTab,
        searchTerm,
        setSearchTerm,
        showAddAdminModal,
        setShowAddAdminModal,
        showEditCourseModal,
        setShowEditCourseModal,
        editingCourse,
        setEditingCourse,
        newAdmin,
        setNewAdmin,
        currentAdmin,
        isLoading,

        // Data
        students,
        staff,
        courses,
        enrollments,
        admins,

        // Handlers
        handleLogout,
        handleDeleteStaff,
        handleDeleteStudent,
        handleAddAdmin,
        handleDeleteAdmin,
        handleDeleteCourse,
        handleEditCourse,
        handleSaveCourse
    } = useAdminDashboard()

    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-blue-50 flex items-center justify-center">
                <LoadingSpinner size="large" text="Loading admin dashboard..." />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-blue-50">
            <AdminHeader
                currentAdmin={currentAdmin}
                onLogout={handleLogout}
            />

            <AdminNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                counts={{
                    students: students.length,
                    staff: staff.length,
                    admins: admins.length,
                    courses: courses.length,
                    enrollments: enrollments.length
                }}
            />

            <main className="max-w-7xl mx-auto px-6 py-8">
                {activeTab === 'dashboard' && (
                    <DashboardOverview
                        students={students}
                        staff={staff}
                        courses={courses}
                        enrollments={enrollments}
                        setActiveTab={setActiveTab}
                        onAddAdmin={() => setShowAddAdminModal(true)}
                    />
                )}

                {activeTab === 'students' && (
                    <StudentsTab
                        students={students}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        onDeleteStudent={handleDeleteStudent}
                    />
                )}

                {activeTab === 'staff' && (
                    <StaffTab
                        staff={staff}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        onDeleteStaff={handleDeleteStaff}
                    />
                )}

                {activeTab === 'admins' && (
                    <AdminsTab
                        admins={admins}
                        currentAdmin={currentAdmin}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        onDeleteAdmin={handleDeleteAdmin}
                        onAddAdmin={() => setShowAddAdminModal(true)}
                    />
                )}

                {activeTab === 'courses' && (
                    <CoursesTab
                        courses={courses}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        onEditCourse={handleEditCourse}
                        onDeleteCourse={handleDeleteCourse}
                    />
                )}

                {activeTab === 'enrollments' && (
                    <EnrollmentsTab
                        enrollments={enrollments}
                        students={students}
                        courses={courses}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                )}
            </main>

            <AddAdminModal
                isOpen={showAddAdminModal}
                newAdmin={newAdmin}
                setNewAdmin={setNewAdmin}
                onClose={() => setShowAddAdminModal(false)}
                onSave={handleAddAdmin}
            />

            <EditCourseModal
                isOpen={showEditCourseModal}
                course={editingCourse}
                setCourse={setEditingCourse}
                onClose={() => setShowEditCourseModal(false)}
                onSave={handleSaveCourse}
            />
        </div>
    )
}
