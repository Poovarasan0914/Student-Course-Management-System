import { Request, Response } from 'express';
import Admin from '../models/Admin';

// @desc    Get all admins
// @route   GET /api/admins
// @access  Private/Admin
export const getAdmins = async (req: Request, res: Response): Promise<void> => {
    try {
        const admins = await Admin.find().select('-password');
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Create admin
// @route   POST /api/admins
// @access  Private/SuperAdmin
export const createAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            res.status(400).json({ message: 'Admin already exists with this email' });
            return;
        }

        const admin = await Admin.create({
            firstName,
            lastName,
            email,
            password,
            role: role || 'admin'
        });

        res.status(201).json({
            _id: admin._id,
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            role: admin.role
        });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Delete admin
// @route   DELETE /api/admins/:id
// @access  Private/SuperAdmin
export const deleteAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const admin = await Admin.findById(req.params.id);

        if (admin) {
            await admin.deleteOne();
            res.json({ message: 'Admin removed' });
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
