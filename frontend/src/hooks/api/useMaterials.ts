import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { API_URL, fetchWithErrorHandling, getAuthToken } from './config'

// Get materials for a course
export const useCourseMaterials = (courseId: string | undefined) => {
    return useQuery({
        queryKey: ['materials', courseId],
        queryFn: async () => {
            if (!courseId) return []
            return fetchWithErrorHandling(`${API_URL}/materials/${courseId}`)
        },
        enabled: !!courseId,
        staleTime: 30000,
    })
}

// Upload a material
export const useUploadMaterial = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: {
            courseId: string
            formData: FormData
        }) => {
            const token = getAuthToken()
            const response = await fetch(`${API_URL}/materials/${data.courseId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data.formData
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to upload material')
            }

            return response.json()
        },
        onSuccess: (_data: unknown, variables: { courseId: string; formData: FormData }) => {
            queryClient.invalidateQueries({ queryKey: ['materials', variables.courseId] })
        },
    })
}

// Delete a material
export const useDeleteMaterial = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: { materialId: string; courseId: string }) => {
            return fetchWithErrorHandling(`${API_URL}/materials/${data.materialId}`, {
                method: 'DELETE'
            })
        },
        onSuccess: (_data: unknown, variables: { materialId: string; courseId: string }) => {
            queryClient.invalidateQueries({ queryKey: ['materials', variables.courseId] })
        },
    })
}

// Download material helper
export const downloadMaterial = async (materialId: string, fileName: string) => {
    const token = getAuthToken()
    const response = await fetch(`${API_URL}/materials/download/${materialId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error('Failed to download file')
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
}
