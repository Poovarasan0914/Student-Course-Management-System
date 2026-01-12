import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import Staff from '../models/Staff';
import Student from '../models/Student';
import { AuthRequest, JwtPayload } from '../types';

// Protect routes - verify token
export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get
            token = req.headers.authorization.split(' ')[1];

            // Verify 
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

            // Get user from token based on role
            if (decoded.role === 'admin' || decoded.role === 'superadmin') {
                const admin = await Admin.findById(decoded.id).select('-password');
                req.user = admin || undefined;
            } else if (decoded.role === 'staff') {
                const staff = await Staff.findById(decoded.id).select('-password');
                req.user = staff || undefined;
            } else {
                const student = await Student.findById(decoded.id).select('-password');
                req.user = student || undefined;
            }

            req.userRole = decoded.role;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};


export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.userRole === 'admin' || req.userRole === 'superadmin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin only.' });
    }
};

export const staffOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.userRole === 'staff') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Staff only.' });
    }
};

export const studentOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.userRole === 'student') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Student only.' });
    }
};

export const staffOrAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.userRole === 'admin' || req.userRole === 'superadmin' || req.userRole === 'staff') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Staff or Admin only.' });
    }
};
