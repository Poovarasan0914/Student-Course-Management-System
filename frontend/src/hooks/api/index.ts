// Configuration and utilities
export { API_URL, ApiError, fetchWithErrorHandling, getAuthToken, getAuthHeaders } from './config'

// Re-export types
export type {
    SignupData,
    Course,
    Enrollment,
    Staff,
    Admin,
    Student,
    StaffData
} from '../../types'

// Auth hooks
export {
    useStudentSignup,
    useStudentLogin,
    useAdminLogin,
    useStaffSignup,
    useStaffLogin,
    useForgotPassword,
    useResetPassword,
    useVerifyResetCode
} from './useAuth'

// Student hooks
export {
    useSignups,
    useCreateSignup,
    useDeleteStudent
} from './useStudents'

// Course hooks
export {
    useCourses,
    useAllCourses,
    useCourse,
    useCoursesByInstructor,
    useUpdateCourse,
    useCreateCourse,
    useUpdateFullCourse,
    useDeleteCourse
} from './useCourses'

// Enrollment hooks
export {
    useEnrollments,
    useStudentEnrollments,
    useEnrollmentsByInstructor,
    useCreateEnrollment,
    useDeleteEnrollment,
    useCheckEnrollment
} from './useEnrollments'

// Staff hooks
export {
    useStaff,
    useCreateStaff,
    useDeleteStaff
} from './useStaff'

// Admin hooks
export {
    useAdmins,
    useCreateAdmin,
    useDeleteAdmin
} from './useAdmins'

// Message hooks
export {
    useCourseMessages,
    useSendMessage,
    useDeleteMessage
} from './useMessages'

// Material hooks
export {
    useCourseMaterials,
    useUploadMaterial,
    useDeleteMaterial,
    downloadMaterial
} from './useMaterials'
