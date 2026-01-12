import { Router } from 'express';
import {
    getStaff,
    deleteStaff
} from '../controllers/staffController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();


router.use(protect as any);

router.get('/', adminOnly as any, getStaff as any);
router.delete('/:id', adminOnly as any, deleteStaff as any);

export default router;
