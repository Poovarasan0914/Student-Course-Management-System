
// User Types

export type User = {
    id?: number
    _id?: string
    firstName: string
    lastName: string
    email: string
    password?: string
    token?: string
}

export type Admin = {
    id?: number
    _id?: string
    firstName: string
    lastName: string
    email: string
    password?: string
    role?: 'admin' | 'superadmin'
    token?: string
}

export type Staff = {
    id?: number
    _id?: string
    firstName: string
    lastName: string
    email: string
    password?: string
    specialization?: string
    token?: string
}

export type Student = {
    id?: number
    _id?: string
    firstName: string
    lastName: string
    email: string
    password?: string
    acceptTerms?: boolean
    createdAt?: string
    token?: string
}
// Course Types

export type Course = {
    id?: string | number
    _id?: string
    title: string
    description: string
    instructor: string
    instructorId?: number | string
    duration: string
    price: string
    image: string
    videoUrl?: string
    students: number
    rating: number
}

export type CourseFormData = {
    title: string
    description: string
    duration: string
    price: string
    image: string
    videoUrl: string
}

// Enrollment Types

export type Enrollment = {
    id?: number
    _id?: string
    courseId: number | string
    courseTitle: string
    courseInstructor: string
    coursePrice: string
    courseDuration: string
    studentId: number | string
    studentName: string
    studentEmail: string
    enrolledAt: string
    status: 'active' | 'completed' | 'cancelled'
}

// Form Types

export type SignupFormValues = {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    acceptTerms: boolean
}

export type StaffSignupFormValues = {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    specialization: string
}

export type LoginFormValues = {
    email: string
    password: string
}

// API Types

export type SignupData = {
    firstName: string
    lastName: string
    email: string
    password: string
    acceptTerms: boolean
}

export type StaffData = {
    firstName: string
    lastName: string
    email: string
    password: string
    specialization: string
}
// UI Types

export type TabType = 'dashboard' | 'students' | 'staff' | 'admins' | 'courses' | 'enrollments'

export type ActionMessage = {
    type: 'success' | 'error'
    text: string
}
