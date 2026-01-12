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
router.get('/', getCourses as any);

router.use(protect as any);

router.post('/', staffOnly as any, validateCourse, createCourse as any);
router.get('/instructor/my-courses', staffOnly as any, getCoursesByInstructor as any);
router.get('/admin/all', adminOnly as any, getAllCourses as any);
router.put('/:id', staffOrAdmin as any, updateCourse as any);
router.delete('/:id', staffOrAdmin as any, deleteCourse as any);
router.get('/:id', getCourseById as any);

export default router;
