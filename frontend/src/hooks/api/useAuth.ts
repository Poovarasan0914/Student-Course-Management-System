import { useMutation } from '@tanstack/react-query'
import { API_URL, fetchWithErrorHandling } from './config'
import type { SignupData } from '../../types'

// Hook for student signup
export const useStudentSignup = () => {
    return useMutation({
        mutationFn: async (data: SignupData) => {
            return fetchWithErrorHandling(`${API_URL}/auth/signup`, {
                method: 'POST',
                body: JSON.stringify(data)
            })
        },
        retry: 1,
    })
}

// Hook for student login
export const useStudentLogin = () => {
    return useMutation({
        mutationFn: async (data: { email: string; password: string }) => {
            return fetchWithErrorHandling(`${API_URL}/auth/login`, {
                method: 'POST',
                body: JSON.stringify(data)
            })
        },
        retry: 1,
    })
}

// Hook for admin login
export const useAdminLogin = () => {
    return useMutation({
        mutationFn: async (data: { email: string; password: string }) => {
            return fetchWithErrorHandling(`${API_URL}/auth/admin/login`, {
                method: 'POST',
                body: JSON.stringify(data)
            })
        },
        retry: 1,
    })
}

// Hook for staff signup
export const useStaffSignup = () => {
    return useMutation({
        mutationFn: async (data: {
            firstName: string
            lastName: string
            email: string
            password: string
            specialization: string
        }) => {
            return fetchWithErrorHandling(`${API_URL}/auth/staff/signup`, {
                method: 'POST',
                body: JSON.stringify(data)
            })
        },
        retry: 1,
    })
}

// Hook for staff login
export const useStaffLogin = () => {
    return useMutation({
        mutationFn: async (data: { email: string; password: string }) => {
            return fetchWithErrorHandling(`${API_URL}/auth/staff/login`, {
                method: 'POST',
                body: JSON.stringify(data)
            })
        },
        retry: 1,
    })
}

// Hook for forgot password - request OTP
export const useForgotPassword = () => {
    return useMutation({
        mutationFn: async (data: { email: string; userType: 'student' | 'staff' | 'admin' }) => {
            return fetchWithErrorHandling(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                body: JSON.stringify(data)
            })
        },
        retry: 1,
    })
}

// Hook for reset password - verify OTP and set new password
export const useResetPassword = () => {
    return useMutation({
        mutationFn: async (data: {
            email: string;
            resetCode: string;
            newPassword: string;
            userType: 'student' | 'staff' | 'admin'
        }) => {
            return fetchWithErrorHandling(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                body: JSON.stringify(data)
            })
        },
        retry: 1,
    })
}

// Hook for verifying reset code
export const useVerifyResetCode = () => {
    return useMutation({
        mutationFn: async (data: {
            email: string;
            resetCode: string;
            userType: 'student' | 'staff' | 'admin'
        }) => {
            return fetchWithErrorHandling(`${API_URL}/auth/verify-reset-code`, {
                method: 'POST',
                body: JSON.stringify(data)
            })
        },
        retry: 1,
    })
}
