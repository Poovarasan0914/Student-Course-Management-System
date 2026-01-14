import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { API_URL, fetchWithErrorHandling } from './config'


// Get messages for a course
export const useCourseMessages = (courseId: string | undefined) => {
    return useQuery({
        queryKey: ['messages', courseId],
        queryFn: async () => {
            if (!courseId) return []
            return fetchWithErrorHandling(`${API_URL}/messages/${courseId}`)
        },
        enabled: !!courseId,
        refetchInterval: 3000, // Auto-refresh every 3 seconds for real-time feel
        staleTime: 2000,
    })
}

// Send a message
export const useSendMessage = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: {
            courseId: string
            content: string
            messageType?: 'text' | 'link'
        }) => {
            return fetchWithErrorHandling(`${API_URL}/messages/${data.courseId}`, {
                method: 'POST',
                body: JSON.stringify({
                    content: data.content,
                    messageType: data.messageType || 'text'
                })
            })
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['messages', variables.courseId] })
        },
    })
}

// Delete a message
export const useDeleteMessage = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: { messageId: string; courseId: string }) => {
            return fetchWithErrorHandling(`${API_URL}/messages/${data.messageId}`, {
                method: 'DELETE'
            })
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['messages', variables.courseId] })
        },
    })
}
