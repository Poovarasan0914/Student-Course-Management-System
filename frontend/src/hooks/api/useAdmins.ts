import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { API_URL, fetchWithErrorHandling } from './config'
import type { Admin } from '../../types'

// Hook to fetch all admins
export const useAdmins = () => {
    return useQuery({
        queryKey: ['admins'],
        queryFn: () => fetchWithErrorHandling(`${API_URL}/admins`),
        retry: 2,
        staleTime: 30000,
    })
}

// Hook to create a new admin
export const useCreateAdmin = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: Omit<Admin, 'id' | '_id'>) => {
            return fetchWithErrorHandling(`${API_URL}/admins`, {
                method: 'POST',
                body: JSON.stringify(data)
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admins'] })
        },
        retry: 1,
    })
}

// Hook to delete admin
export const useDeleteAdmin = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (adminId: string | number) => {
            return fetchWithErrorHandling(`${API_URL}/admins/${adminId}`, {
                method: 'DELETE'
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admins'] })
        },
        retry: 1,
    })
}
