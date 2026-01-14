
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

// Message Types

export type Message = {
    _id: string
    courseId: string
    senderId: string
    senderName: string
    senderRole: 'staff' | 'student'
    content: string
    messageType: 'text' | 'link'
    createdAt: string
    updatedAt: string
}

// Course Material Types

export type CourseMaterial = {
    _id: string
    courseId: string
    uploadedBy: string
    uploadedByName: string
    title: string
    description?: string
    category: 'Lecture Notes' | 'Assignment' | 'Study Material' | 'Exam Preparation'
    fileName: string
    fileType: string
    fileSize: number
    filePath: string
    fileUrl: string
    createdAt: string
    updatedAt: string
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
