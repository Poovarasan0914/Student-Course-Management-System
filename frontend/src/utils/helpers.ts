import type { Enrollment, Student, Course } from '../types'

// Helper to get ID from object (handles both id and _id from MongoDB)
export const getId = (obj: { id?: number | string; _id?: string } | null | undefined): string | number | undefined => {
    if (!obj) return undefined
    return obj._id || obj.id
}

// Default placeholder image as base64 SVG
export const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect fill='%23f1f5f9' width='400' height='200'/%3E%3Ctext fill='%232563eb' font-family='Arial' font-size='16' x='50%25' y='50%25' text-anchor='middle'%3ECourse Image%3C/text%3E%3C/svg%3E"

// Helper function to get valid image URL
export const getImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath || imagePath.trim() === '') {
        return PLACEHOLDER_IMAGE
    }
    if (imagePath.startsWith('data:') || imagePath.startsWith('http')) {
        return imagePath
    }
    // Handle ./src/assets paths - convert to proper path
    if (imagePath.startsWith('./src/assets/')) {
        return imagePath.replace('./src/assets/', '/src/assets/')
    }
    return imagePath
}

// Check if user is already enrolled in a course
export const isEnrolledInCourse = (
    enrollments: Enrollment[],
    courseId: string | number | undefined
): boolean => {
    if (!courseId) return false
    return enrollments.some((enrollment: Enrollment) => {
        const enrollmentCourseId = enrollment.courseId || enrollment._id
        return enrollmentCourseId === courseId
    })
}

// Get enrolled students for a specific course
export const getEnrolledStudentsForCourse = (
    enrollments: Enrollment[],
    courseId: string | number | undefined
): Enrollment[] => {
    if (!courseId) return []
    return enrollments.filter((e: Enrollment) => {
        const enrollmentCourseId = e.courseId || getId(e)
        return String(enrollmentCourseId) === String(courseId)
    })
}

// Get unique student count from enrollments
export const getUniqueStudentCount = (enrollments: Enrollment[]): number => {
    return new Set(enrollments.map((e: Enrollment) => e.studentEmail)).size
}

// Format date for display
export const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString()
}

// Get student name by ID
export const getStudentName = (studentId: string | number, students: Student[]): string => {
    const student = students.find((s: Student) => getId(s) === studentId)
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'
}

// Get course name by ID
export const getCourseName = (courseId: string | number, courses: Course[]): string => {
    const course = courses.find((c: Course) => getId(c) === courseId)
    return course ? course.title : 'Unknown Course'
}
