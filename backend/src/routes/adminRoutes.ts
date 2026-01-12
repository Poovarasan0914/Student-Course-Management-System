import { Router } from 'express';
import {
    getAdmins,
    createAdmin,
    deleteAdmin
} from '../controllers/adminController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();
router.use(protect as any);
router.use(adminOnly as any);
router.route('/')
    .get(getAdmins as any)
    .post(createAdmin as any);

router.delete('/:id', deleteAdmin as any);

export default router;
