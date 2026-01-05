// Re-export types from the centralized types folder
export type {
    SignupData,
    Course,
    Enrollment,
    Staff,
    Admin,
    Student,
    StaffData
} from '../../types'

export const API_URL = 'http://localhost:5000/api'

// Helper to get auth token from localStorage
// Prioritizes based on current page context
export const getAuthToken = (): string | null => {
    // Detect current page context from URL
    const currentPath = window.location.pathname

    // If on admin pages, prioritize admin token
    if (currentPath.includes('/admin')) {
        const adminUser = localStorage.getItem('currentAdmin')
        if (adminUser) {
            try {
                const parsed = JSON.parse(adminUser)
                if (parsed.token) return parsed.token
            } catch { /* ignore */ }
        }
    }

    // If on staff pages, prioritize staff token
    if (currentPath.includes('/staff')) {
        const staffUser = localStorage.getItem('currentStaff')
        if (staffUser) {
            try {
                const parsed = JSON.parse(staffUser)
                if (parsed.token) return parsed.token
            } catch { /* ignore */ }
        }
    }

    // For student/dashboard pages or default, check student token first
    const studentUser = localStorage.getItem('currentUser')
    if (studentUser) {
        try {
            const parsed = JSON.parse(studentUser)
            if (parsed.token) return parsed.token
        } catch { /* ignore */ }
    }

    // Fallback: check all tokens in case context doesn't match
    const staffUser = localStorage.getItem('currentStaff')
    if (staffUser) {
        try {
            const parsed = JSON.parse(staffUser)
            if (parsed.token) return parsed.token
        } catch { /* ignore */ }
    }

    const adminUser = localStorage.getItem('currentAdmin')
    if (adminUser) {
        try {
            const parsed = JSON.parse(adminUser)
            if (parsed.token) return parsed.token
        } catch { /* ignore */ }
    }

    return null
}

// Helper to get auth headers
export const getAuthHeaders = (): HeadersInit => {
    const token = getAuthToken()
    const headers: HeadersInit = {
        'Content-Type': 'application/json'
    }
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }
    return headers
}

// Custom error class for API errors
export class ApiError extends Error {
    status?: number
    isNetworkError: boolean

    constructor(message: string, status?: number, isNetworkError = false) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.isNetworkError = isNetworkError
    }
}

// Helper function for API calls with better error handling
export async function fetchWithErrorHandling(url: string, options?: RequestInit) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...getAuthHeaders(),
                ...options?.headers
            }
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new ApiError(
                errorData.message || `Request failed: ${response.statusText}`,
                response.status
            )
        }

        return response.json()
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }

        // Network error (server not running, CORS, etc.)
        throw new ApiError(
            'Unable to connect to the server. Please check if the server is running.',
            undefined,
            true
        )
    }
}
