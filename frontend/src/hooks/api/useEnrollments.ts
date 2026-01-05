import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { API_URL, fetchWithErrorHandling } from './config'
import type { Course, Enrollment } from '../../types'

// Hook to fetch all enrollments
export const useEnrollments = () => {
    return useQuery({
        queryKey: ['enrollments'],
        queryFn: () => fetchWithErrorHandling(`${API_URL}/enrollments`),
        retry: 2,
        staleTime: 30000,
    })
}

// Hook to fetch enrollments for current student
export const useStudentEnrollments = (studentId: number | string | undefined) => {
    return useQuery({
        queryKey: ['enrollments', 'student', studentId],
        queryFn: () => fetchWithErrorHandling(`${API_URL}/enrollments/my-enrollments`),
        enabled: !!studentId,
        retry: 2,
        staleTime: 30000,
    })
}

// Hook to fetch enrollments by instructor
export const useEnrollmentsByInstructor = (instructorId: string | undefined) => {
    return useQuery({
        queryKey: ['enrollments', 'instructor', instructorId],
        queryFn: async () => {
            // First get instructor's courses, then get enrollments for each
            const courses = await fetchWithErrorHandling(`${API_URL}/courses/instructor/my-courses`)
            const enrollmentPromises = courses.map((course: Course) =>
                fetchWithErrorHandling(`${API_URL}/enrollments/course/${course._id || course.id}`)
            )
            const enrollmentArrays = await Promise.all(enrollmentPromises)
            return enrollmentArrays.flat()
        },
        enabled: !!instructorId,
        retry: 2,
        staleTime: 30000,
    })
}

// Hook to create a new enrollment
export const useCreateEnrollment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: {
            courseId: string | number | undefined
            courseTitle?: string
            courseInstructor?: string
            coursePrice?: string
            courseLevel?: string
            courseDuration?: string
            studentId?: string | number | undefined
            studentName?: string
            studentEmail?: string
            enrolledAt?: string
            status?: string
        }) => {
            return fetchWithErrorHandling(`${API_URL}/enrollments`, {
                method: 'POST',
                body: JSON.stringify({ ...data, courseId: String(data.courseId) })
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enrollments'] })
            queryClient.invalidateQueries({ queryKey: ['courses'] })
        },
        retry: 1,
    })
}

// Hook to check if student is already enrolled in a course
export const useCheckEnrollment = (studentId: string | undefined, courseId: string | undefined) => {
    return useQuery({
        queryKey: ['enrollment-check', studentId, courseId],
        queryFn: async () => {
            const enrollments = await fetchWithErrorHandling(`${API_URL}/enrollments/my-enrollments`)
            return enrollments.filter((e: Enrollment) => e.courseId === courseId)
        },
        enabled: !!studentId && !!courseId,
        staleTime: 30000,
    })
}
