import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Sidebar, { type SidebarItem } from '../../components/ui/Sidebar'
import { useAdminDashboard } from './hooks/useAdminDashboard'
import {
    AdminHeader,
    DashboardOverview,
    StudentsTab,
    StaffTab,
    AdminsTab,
    CoursesTab,
    EnrollmentsTab,
    AddAdminModal,
    EditCourseModal
} from './components'
import type { TabType } from '../../types'

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

    // Sidebar navigation items
    const sidebarItems: SidebarItem[] = [
        { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
        { id: 'students', label: 'Students', icon: 'bi-mortarboard', badge: students.length },
        { id: 'staff', label: 'Staff', icon: 'bi-person-circle', badge: staff.length },
        { id: 'admins', label: 'Admins', icon: 'bi-key', badge: admins.length },
        { id: 'courses', label: 'Courses', icon: 'bi-book', badge: courses.length },
        { id: 'enrollments', label: 'Enrollments', icon: 'bi-journal-check', badge: enrollments.length }
    ]

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <LoadingSpinner size="large" text="Loading admin dashboard..." />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-bg flex">
            {/* Sidebar Navigation */}
            <Sidebar
                items={sidebarItems}
                activeItem={activeTab}
                onItemClick={(id) => setActiveTab(id as TabType)}
                header={{
                    title: 'Admin Panel',
                    subtitle: `${currentAdmin?.firstName || 'Admin'}`,
                    icon: 'bi-shield-lock'
                }}
            />

            {/* Main Content Area */}
            <div className="flex-1 min-h-screen lg:ml-0">
                <AdminHeader
                    currentAdmin={currentAdmin}
                    onLogout={handleLogout}
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
            </div>

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
