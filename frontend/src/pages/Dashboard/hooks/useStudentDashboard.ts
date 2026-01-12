import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    useCourses,
    useStudentEnrollments,
    useCreateEnrollment,
    useDeleteEnrollment
} from '../../../hooks/api'
import type { Course, ActionMessage, Enrollment } from '../../../types'
import { getId, isEnrolledInCourse } from '../utils/helpers.ts'

export function useStudentDashboard() {
    const navigate = useNavigate()
    const [user, setUser] = useState<any>(null)
    const [enrollingCourseId, setEnrollingCourseId] = useState<string | number | null>(null)
    const [unenrollingCourseId, setUnenrollingCourseId] = useState<string | number | null>(null)
    const [enrollmentMessage, setEnrollmentMessage] = useState<ActionMessage | null>(null)

    const {
        data: courses = [],
        isLoading,
        error: fetchError
    } = useCourses()

    const {
        data: enrollments = [],
        refetch: refetchEnrollments
    } = useStudentEnrollments(getId(user))

    const createEnrollmentMutation = useCreateEnrollment()
    const deleteEnrollmentMutation = useDeleteEnrollment()

    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser')
        if (!currentUser) {
            navigate('/login')
            return
        }
        setUser(JSON.parse(currentUser))
    }, [navigate])

    useEffect(() => {
        if (enrollmentMessage) {
            const timer = setTimeout(() => {
                setEnrollmentMessage(null)
            }, 4000)
            return () => clearTimeout(timer)
        }
    }, [enrollmentMessage])

    const handleLogout = () => {
        localStorage.removeItem('currentUser')
        localStorage.removeItem('user')
        navigate('/login')
    }

    const checkIsEnrolled = (courseId: string | number | undefined): boolean => {
        return isEnrolledInCourse(enrollments, courseId)
    }

    const getEnrollmentForCourse = (courseId: string | number | undefined): Enrollment | undefined => {
        if (!courseId) return undefined
        return enrollments.find((e: Enrollment) => 
            String(e.courseId) === String(courseId)
        )
    }

    const handleEnroll = async (course: Course) => {
        if (!user) {
            navigate('/login')
            return
        }

        const courseId = getId(course)
        if (!courseId) return

        if (checkIsEnrolled(courseId)) {
            setEnrollmentMessage({
                type: 'error',
                text: `You are already enrolled in "${course.title}"`
            })
            return
        }

        setEnrollingCourseId(courseId)
        setEnrollmentMessage(null)

        try {
            const userId = getId(user)
            await createEnrollmentMutation.mutateAsync({
                courseId: courseId,
                courseTitle: course.title,
                courseInstructor: course.instructor,
                coursePrice: course.price,
                courseLevel: course.level,
                courseDuration: course.duration,
                studentId: userId,
                studentName: `${user.firstName} ${user.lastName}`,
                studentEmail: user.email,
                enrolledAt: new Date().toISOString(),
                status: 'active'
            })

            refetchEnrollments()

            setEnrollmentMessage({
                type: 'success',
                text: `Successfully enrolled in "${course.title}"!`
            })
        } catch (error) {
            console.error('Enrollment error:', error)
            setEnrollmentMessage({
                type: 'error',
                text: 'Failed to enroll. Please try again.'
            })
        } finally {
            setEnrollingCourseId(null)
        }
    }

    const handleUnenroll = async (course: Course) => {
        if (!user) {
            navigate('/login')
            return
        }

        const courseId = getId(course)
        if (!courseId) return

        const enrollment = getEnrollmentForCourse(courseId)
        if (!enrollment) {
            setEnrollmentMessage({
                type: 'error',
                text: `You are not enrolled in "${course.title}"`
            })
            return
        }

        const enrollmentId = enrollment._id || enrollment.id
        if (!enrollmentId) return

        setUnenrollingCourseId(courseId)
        setEnrollmentMessage(null)

        try {
            await deleteEnrollmentMutation.mutateAsync(enrollmentId)

            refetchEnrollments()

            setEnrollmentMessage({
                type: 'success',
                text: `Successfully unenrolled from "${course.title}"`
            })
        } catch (error) {
            console.error('Unenroll error:', error)
            setEnrollmentMessage({
                type: 'error',
                text: 'Failed to unenroll. Please try again.'
            })
        } finally {
            setUnenrollingCourseId(null)
        }
    }

    const clearEnrollmentMessage = () => setEnrollmentMessage(null)

    return {
        // State
        user,
        enrollingCourseId,
        unenrollingCourseId,
        enrollmentMessage,
        isLoading,
        fetchError,

        // Data
        courses,
        enrollments,

        // Handlers
        handleLogout,
        handleEnroll,
        handleUnenroll,
        checkIsEnrolled,
        getEnrollmentForCourse,
        clearEnrollmentMessage
    }
}
