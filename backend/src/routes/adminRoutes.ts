import { Router } from 'express';
import {
    getAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    getAdminProfile
} from '../controllers/adminController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

// All routes require authentication and admin role
router.use(protect as any);
router.use(adminOnly as any);

router.route('/')
    .get(getAdmins as any)
    .post(createAdmin as any);

router.get('/profile', getAdminProfile as any);

router.route('/:id')
    .get(getAdminById as any)
    .put(updateAdmin as any)
    .delete(deleteAdmin as any);

export default router;
