import { Request, Response } from 'express';
import Admin from '../models/Admin';
import { AuthRequest } from '../types';

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

// @desc    Get admin by ID
// @route   GET /api/admins/:id
// @access  Private/Admin
export const getAdminById = async (req: Request, res: Response): Promise<void> => {
    try {
        const admin = await Admin.findById(req.params.id).select('-password');
        if (admin) {
            res.json(admin);
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
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

// @desc    Update admin
// @route   PUT /api/admins/:id
// @access  Private/Admin
export const updateAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const admin = await Admin.findById(req.params.id);

        if (admin) {
            admin.firstName = req.body.firstName || admin.firstName;
            admin.lastName = req.body.lastName || admin.lastName;
            admin.email = req.body.email || admin.email;
            admin.role = req.body.role || admin.role;

            if (req.body.password) {
                admin.password = req.body.password;
            }

            const updatedAdmin = await admin.save();

            res.json({
                _id: updatedAdmin._id,
                firstName: updatedAdmin.firstName,
                lastName: updatedAdmin.lastName,
                email: updatedAdmin.email,
                role: updatedAdmin.role
            });
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
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

// @desc    Get current admin profile
// @route   GET /api/admins/profile
// @access  Private/Admin
export const getAdminProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const admin = await Admin.findById(req.user?._id).select('-password');
        if (admin) {
            res.json(admin);
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
