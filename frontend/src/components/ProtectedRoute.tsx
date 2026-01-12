import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
    children: ReactNode
    requiredRole: 'student' | 'staff' | 'admin'
    redirectTo: string
}

export default function ProtectedRoute({ children, requiredRole, redirectTo }: ProtectedRouteProps) {
    const getStorageKey = (role: string): string => {
        switch (role) {
            case 'admin':
                return 'currentAdmin'
            case 'staff':
                return 'currentStaff'
            case 'student':
            default:
                return 'currentUser'
        }
    }

    const storageKey = getStorageKey(requiredRole)
    const userData = localStorage.getItem(storageKey)

    if (!userData) {
        return <Navigate to={redirectTo} replace />
    }

    try {
        // Validate that the stored data is valid JSON
        JSON.parse(userData)
        return <>{children}</>
    } catch {
        // Invalid data, clear it and redirect
        localStorage.removeItem(storageKey)
        return <Navigate to={redirectTo} replace />
    }
}
