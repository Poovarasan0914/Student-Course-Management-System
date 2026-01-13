import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    useSignups,
    useStaff,
    useAllCourses,
    useEnrollments,
    useAdmins,
    useCreateAdmin,
    useDeleteAdmin,
    useDeleteStaff,
    useDeleteStudent,
    useDeleteCourse,
    useUpdateFullCourse
} from '../../../hooks/api'
import type { Admin, Course, TabType } from '../../../types'
import { getId } from '../utils/helpers.ts'

export interface NewAdminForm {
    firstName: string
    lastName: string
    email: string
    password: string
    role: 'admin'
}

export function useAdminDashboard() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<TabType>('dashboard')
    const [searchTerm, setSearchTerm] = useState('')
    const [showAddAdminModal, setShowAddAdminModal] = useState(false)
    const [showEditCourseModal, setShowEditCourseModal] = useState(false)
    const [editingCourse, setEditingCourse] = useState<Course | null>(null)
    const [newAdmin, setNewAdmin] = useState<NewAdminForm>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'admin' as const
    })
    const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null)

    useEffect(() => {
        const adminData = localStorage.getItem('currentAdmin')
        if (adminData) {
            setCurrentAdmin(JSON.parse(adminData))
        } else {
            navigate('/admin/login')
        }
    }, [navigate])

    // API hooks
    const { data: students = [], isLoading: studentsLoading, refetch: refetchStudents } = useSignups()
    const { data: staff = [], isLoading: staffLoading, refetch: refetchStaff } = useStaff()
    const { data: courses = [], isLoading: coursesLoading, refetch: refetchCourses } = useAllCourses()
    const { data: enrollments = [], isLoading: enrollmentsLoading } = useEnrollments()
    const { data: admins = [], isLoading: adminsLoading, refetch: refetchAdmins } = useAdmins()

    // Mutation hooks
    const createAdmin = useCreateAdmin()
    const deleteAdmin = useDeleteAdmin()
    const deleteStaff = useDeleteStaff()
    const deleteStudent = useDeleteStudent()
    const deleteCourse = useDeleteCourse()
    const updateCourse = useUpdateFullCourse()

    const isLoading = studentsLoading || staffLoading || coursesLoading || enrollmentsLoading || adminsLoading

    const handleLogout = () => {
        localStorage.removeItem('currentAdmin')
        navigate('/admin/login')
    }

    const handleDeleteStaff = async (staffId: string | number) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            try {
                await deleteStaff.mutateAsync(staffId)
                refetchStaff()
            } catch (error) {
                console.error('Error deleting staff:', error)
            }
        }
    }

    const handleDeleteStudent = async (studentId: string | number) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await deleteStudent.mutateAsync(studentId)
                refetchStudents()
            } catch (error) {
                console.error('Error deleting student:', error)
            }
        }
    }

    const handleAddAdmin = async () => {
        if (!newAdmin.firstName || !newAdmin.lastName || !newAdmin.email || !newAdmin.password) {
            alert('Please fill all fields')
            return
        }
        try {
            await createAdmin.mutateAsync(newAdmin)
            setShowAddAdminModal(false)
            setNewAdmin({ firstName: '', lastName: '', email: '', password: '', role: 'admin' as const })
            refetchAdmins()
        } catch (error) {
            console.error('Error adding admin:', error)
        }
    }

    const handleDeleteAdmin = async (adminId: string | number) => {
        const currentAdminId = getId(currentAdmin)
        if (currentAdminId === adminId) {
            alert('You cannot delete your own account')
            return
        }
        if (window.confirm('Are you sure you want to delete this admin?')) {
            try {
                await deleteAdmin.mutateAsync(adminId)
                refetchAdmins()
            } catch (error) {
                console.error('Error deleting admin:', error)
            }
        }
    }

    const handleDeleteCourse = async (courseId: string | number) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await deleteCourse.mutateAsync(courseId)
                refetchCourses()
            } catch (error) {
                console.error('Error deleting course:', error)
            }
        }
    }

    const handleEditCourse = (course: Course) => {
        setEditingCourse({ ...course })
        setShowEditCourseModal(true)
    }

    const handleSaveCourse = async () => {
        if (!editingCourse) return
        try {
            await updateCourse.mutateAsync({
                id: getId(editingCourse),
                title: editingCourse.title,
                description: editingCourse.description,
                instructor: editingCourse.instructor,
                duration: editingCourse.duration,
                price: editingCourse.price,
                image: editingCourse.image,
                students: editingCourse.students || 0,
                rating: editingCourse.rating || 0
            })
            setShowEditCourseModal(false)
            setEditingCourse(null)
            refetchCourses()
        } catch (error) {
            console.error('Error updating course:', error)
        }
    }

    return {
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
    }
}
