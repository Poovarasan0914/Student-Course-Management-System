import { Router } from 'express';
import {
    getEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
    getStudentEnrollments,
    getEnrollmentsByCourse,
    cancelEnrollment
} from '../controllers/enrollmentController';
import { protect, adminOnly, studentOnly, staffOrAdmin } from '../middleware/authMiddleware';

const router = Router();

// Protected routes
router.use(protect as any);

// Student routes
router.post('/', studentOnly as any, createEnrollment as any);
router.get('/my-enrollments', studentOnly as any, getStudentEnrollments as any);
router.put('/:id/cancel', studentOnly as any, cancelEnrollment as any);

// Staff or Admin routes
router.get('/course/:courseId', staffOrAdmin as any, getEnrollmentsByCourse as any);

// Admin routes
router.get('/', adminOnly as any, getEnrollments as any);
router.get('/:id', getEnrollmentById as any);
router.put('/:id', adminOnly as any, updateEnrollment as any);
router.delete('/:id', adminOnly as any, deleteEnrollment as any);

export default router;
