import { Router } from 'express';
import {
    getEnrollments,
    createEnrollment,
    deleteEnrollment,
    getStudentEnrollments,
    getEnrollmentsByCourse
} from '../controllers/enrollmentController';
import { protect, adminOnly, studentOnly, staffOrAdmin } from '../middleware/authMiddleware';

const router = Router();

router.use(protect as any);

router.post('/', studentOnly as any, createEnrollment as any);
router.get('/my-enrollments', studentOnly as any, getStudentEnrollments as any);
router.delete('/:id', studentOnly as any, deleteEnrollment as any);

router.get('/course/:courseId', staffOrAdmin as any, getEnrollmentsByCourse as any);

router.get('/', adminOnly as any, getEnrollments as any);

export default router;
