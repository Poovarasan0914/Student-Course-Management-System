import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    useCoursesByInstructor,
    useEnrollmentsByInstructor,
    useCreateCourse,
    useUpdateFullCourse,
    useDeleteCourse
} from '../../../hooks/api'
import type { Staff, Course, CourseFormData, ActionMessage } from '../../../types'
import { getId } from '../utils/helpers.ts'

export type StaffTabType = 'courses' | 'students' | 'course-hub'

const defaultCourseForm: CourseFormData = {
    title: '',
    description: '',
    duration: '',
    price: '',
    image: '',
    videoUrl: ''
}

export function useStaffDashboard() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<StaffTabType>('courses')
    const [showCourseModal, setShowCourseModal] = useState(false)
    const [editingCourse, setEditingCourse] = useState<Course | null>(null)
    const [courseForm, setCourseForm] = useState<CourseFormData>(defaultCourseForm)
    const [actionMessage, setActionMessage] = useState<ActionMessage | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<string | number | null>(null)

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

    const instructorName = staff ? `${staff.firstName} ${staff.lastName}` : ''
    const staffId = getId(staff)

    // API hooks
    const {
        data: courses = [],
        isLoading: coursesLoading,
        error: coursesError,
        refetch: refetchCourses
    } = useCoursesByInstructor(staffId ? String(staffId) : undefined)

    const {
        data: enrollments = [],
        isLoading: enrollmentsLoading,
        refetch: refetchEnrollments
    } = useEnrollmentsByInstructor(staffId ? String(staffId) : undefined)

    // Mutation hooks
    const createCourseMutation = useCreateCourse()
    const updateCourseMutation = useUpdateFullCourse()
    const deleteCourseMutation = useDeleteCourse()

    const isLoading = coursesLoading || enrollmentsLoading
    const isSaving = createCourseMutation.isPending || updateCourseMutation.isPending

    useEffect(() => {
        if (actionMessage) {
            const timer = setTimeout(() => setActionMessage(null), 4000)
            return () => clearTimeout(timer)
        }
    }, [actionMessage])

    const handleLogout = () => {
        localStorage.removeItem('currentStaff')
        navigate('/staff/login')
    }

    const openAddCourseModal = () => {
        setEditingCourse(null)
        setCourseForm(defaultCourseForm)
        setShowCourseModal(true)
    }

    const openEditCourseModal = (course: Course) => {
        setEditingCourse(course)
        setCourseForm({
            title: course.title,
            description: course.description,
            duration: course.duration,
            price: course.price,
            image: course.image,
            videoUrl: course.videoUrl || ''
        })
        setShowCourseModal(true)
    }

    const closeCourseModal = () => {
        setShowCourseModal(false)
        setEditingCourse(null)
        setCourseForm(defaultCourseForm)
    }

    const handleCourseFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setCourseForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSaveCourse = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!staff) return

        try {
            if (editingCourse) {
                await updateCourseMutation.mutateAsync({
                    ...editingCourse,
                    ...courseForm,
                    instructor: instructorName
                })
                setActionMessage({ type: 'success', text: `Course "${courseForm.title}" updated successfully!` })
            } else {
                await createCourseMutation.mutateAsync({
                    ...courseForm,
                    instructor: instructorName,
                    students: 0,
                    rating: 0
                })
                setActionMessage({ type: 'success', text: `Course "${courseForm.title}" created successfully!` })
            }

            refetchCourses()
            closeCourseModal()
        } catch (error) {
            console.error('Course save error:', error)
            setActionMessage({ type: 'error', text: 'Failed to save course. Please try again.' })
        }
    }

    const handleDeleteCourse = async (courseId: string | number) => {
        try {
            await deleteCourseMutation.mutateAsync(courseId)
            setActionMessage({ type: 'success', text: 'Course deleted successfully!' })
            refetchCourses()
            refetchEnrollments()
            setDeleteConfirm(null)
        } catch (error) {
            console.error('Delete error:', error)
            setActionMessage({ type: 'error', text: 'Failed to delete course. Please try again.' })
        }
    }

    const clearActionMessage = () => setActionMessage(null)

    return {
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
    }
}
