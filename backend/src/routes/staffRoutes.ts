import { Router } from 'express';
import {
    getStaff,
    getStaffById,
    updateStaff,
    deleteStaff,
    getStaffProfile
} from '../controllers/staffController';
import { protect, adminOnly, staffOnly } from '../middleware/authMiddleware';

const router = Router();

// Protected routes
router.use(protect as any);

// Staff profile route
router.get('/profile', staffOnly as any, getStaffProfile as any);

// Admin only routes
router.get('/', adminOnly as any, getStaff as any);
router.put('/:id', adminOnly as any, updateStaff as any);
router.delete('/:id', adminOnly as any, deleteStaff as any);

// Generic :id route LAST
router.get('/:id', adminOnly as any, getStaffById as any);

export default router;
