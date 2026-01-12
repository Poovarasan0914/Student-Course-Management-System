import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { API_URL, fetchWithErrorHandling } from './config'
import type { Staff } from '../../types'

// Hook to fetch all staff
export const useStaff = () => {
    return useQuery({
        queryKey: ['staff'],
        queryFn: () => fetchWithErrorHandling(`${API_URL}/staff`),
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
        staleTime: 30000,
    })
}

// Hook to create a new staff member (use useStaffSignup for registration)
export const useCreateStaff = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: Omit<Staff, 'id'>) => {
            return fetchWithErrorHandling(`${API_URL}/auth/staff/signup`, {
                method: 'POST',
                body: JSON.stringify(data)
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff'] })
        },
        retry: 1,
    })
}

// Hook to delete staff
export const useDeleteStaff = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (staffId: string | number) => {
            return fetchWithErrorHandling(`${API_URL}/staff/${staffId}`, {
                method: 'DELETE'
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff'] })
        },
        retry: 1,
    })
}
