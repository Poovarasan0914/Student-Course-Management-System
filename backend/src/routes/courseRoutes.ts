import { Router } from 'express';
import {
    getCourses,
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getCoursesByInstructor
} from '../controllers/courseController';
import { protect, adminOnly, staffOnly, staffOrAdmin } from '../middleware/authMiddleware';
import { validateCourse } from '../middleware/validators';

const router = Router();

// Public routes - specific paths first
router.get('/', getCourses as any);

// Protected routes
router.use(protect as any);

// Staff routes - must come BEFORE /:id
router.post('/', staffOnly as any, validateCourse, createCourse as any);
router.get('/instructor/my-courses', staffOnly as any, getCoursesByInstructor as any);

// Admin routes - must come BEFORE /:id
router.get('/admin/all', adminOnly as any, getAllCourses as any);

// Staff or Admin can update/delete courses (staff can only modify their own)
router.put('/:id', staffOrAdmin as any, updateCourse as any);
router.delete('/:id', staffOrAdmin as any, deleteCourse as any);

// Generic :id route LAST (to avoid matching 'admin', 'instructor', etc.)
router.get('/:id', getCourseById as any);

export default router;
