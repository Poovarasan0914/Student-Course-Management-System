import { Router } from 'express';
import {
    signup,
    login,
    adminLogin,
    staffSignup,
    staffLogin
} from '../controllers/authController';
import { validateSignup, validateLogin } from '../middleware/validators';

const router = Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/admin/login', validateLogin, adminLogin);
router.post('/staff/signup', validateSignup, staffSignup);
router.post('/staff/login', validateLogin, staffLogin);

export default router;
