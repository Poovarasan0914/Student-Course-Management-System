import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { API_URL, fetchWithErrorHandling } from './config'
import type { SignupData } from '../../types'

// Hook to fetch all signups/students
export const useSignups = () => {
    return useQuery({
        queryKey: ['signups'],
        queryFn: () => fetchWithErrorHandling(`${API_URL}/students`),
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
        staleTime: 30000,
    })
}

// Hook to create a new signup (use useStudentSignup for registration)
export const useCreateSignup = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: SignupData) => {
            return fetchWithErrorHandling(`${API_URL}/auth/signup`, {
                method: 'POST',
                body: JSON.stringify(data)
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['signups'] })
        },
        retry: 1,
    })
}

// Hook to delete student
export const useDeleteStudent = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (studentId: string | number) => {
            return fetchWithErrorHandling(`${API_URL}/students/${studentId}`, {
                method: 'DELETE'
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['signups'] })
        },
        retry: 1,
    })
}
