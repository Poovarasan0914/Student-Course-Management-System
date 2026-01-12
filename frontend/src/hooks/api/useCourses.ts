import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { API_URL, fetchWithErrorHandling } from './config'
import type { Course } from '../../types'

// Hook to fetch all courses (approved only for public)
export const useCourses = () => {
    return useQuery({
        queryKey: ['courses'],
        queryFn: () => fetchWithErrorHandling(`${API_URL}/courses`),
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
        staleTime: 60000,
        refetchOnWindowFocus: true,
    })
}

// Hook to fetch all courses (including pending/rejected) for admin
export const useAllCourses = () => {
    return useQuery({
        queryKey: ['courses', 'all'],
        queryFn: () => fetchWithErrorHandling(`${API_URL}/courses/admin/all`),
        retry: 2,
        staleTime: 60000,
    })
}

// Hook to fetch a single course
export const useCourse = (id: number | undefined) => {
    return useQuery({
        queryKey: ['course', id],
        queryFn: () => fetchWithErrorHandling(`${API_URL}/courses/${id}`),
        enabled: !!id,
        retry: 2,
        staleTime: 60000,
    })
}

// Hook to fetch courses by instructor (for staff dashboard)
export const useCoursesByInstructor = (instructorId: string | undefined) => {
    return useQuery({
        queryKey: ['courses', 'instructor', instructorId],
        queryFn: () => fetchWithErrorHandling(`${API_URL}/courses/instructor/my-courses`),
        enabled: !!instructorId,
        retry: 2,
        staleTime: 30000,
    })
}

// Hook to update course (increment student count)
export const useUpdateCourse = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, students }: { id: string | number | undefined; students: number }) => {
            return fetchWithErrorHandling(`${API_URL}/courses/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ students })
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] })
        },
        retry: 1,
    })
}

// Hook to create a new course
export const useCreateCourse = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: Omit<Course, 'id' | '_id'>) => {
            return fetchWithErrorHandling(`${API_URL}/courses`, {
                method: 'POST',
                body: JSON.stringify(data)
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] })
        },
        retry: 1,
    })
}

// Hook to update a full course
export const useUpdateFullCourse = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: Course) => {
            const id = data._id || data.id
            return fetchWithErrorHandling(`${API_URL}/courses/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] })
        },
        retry: 1,
    })
}

// Hook to delete a course
export const useDeleteCourse = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (courseId: string | number) => {
            return fetchWithErrorHandling(`${API_URL}/courses/${courseId}`, {
                method: 'DELETE'
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] })
        },
        retry: 1,
    })
}
