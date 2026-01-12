import { Router } from 'express';
import {
    getStudents,
    deleteStudent
} from '../controllers/studentController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.use(protect as any);

router.get('/', adminOnly as any, getStudents as any);
router.delete('/:id', adminOnly as any, deleteStudent as any);

export default router;
