import { Router } from 'express';
import {
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    getStudentProfile,
    updateStudentProfile
} from '../controllers/studentController';
import { protect, adminOnly, studentOnly } from '../middleware/authMiddleware';

const router = Router();

// Protected routes
router.use(protect as any);

// Student profile routes
router.get('/profile', studentOnly as any, getStudentProfile as any);
router.put('/profile', studentOnly as any, updateStudentProfile as any);

// Admin only routes
router.get('/', adminOnly as any, getStudents as any);
router.get('/:id', adminOnly as any, getStudentById as any);
router.put('/:id', adminOnly as any, updateStudent as any);
router.delete('/:id', adminOnly as any, deleteStudent as any);

export default router;
