import { Router } from 'express';
import {
    signup,
    login,
    adminLogin,
    staffSignup,
    staffLogin,
    forgotPassword,
    resetPassword,
    verifyResetCode
} from '../controllers/authController';
import { validateSignup, validateLogin } from '../middleware/validators';

const router = Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/admin/login', validateLogin, adminLogin);
router.post('/staff/signup', validateSignup, staffSignup);
router.post('/staff/login', validateLogin, staffLogin);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-reset-code', verifyResetCode);

export default router;
