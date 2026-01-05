import { Request, Response } from 'express';
import Staff from '../models/Staff';
import { AuthRequest } from '../types';

// @desc    Get all staff
// @route   GET /api/staff
// @access  Private/Admin
export const getStaff = async (req: Request, res: Response): Promise<void> => {
    try {
        const staff = await Staff.find().select('-password');
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get staff by ID
// @route   GET /api/staff/:id
// @access  Private/Admin
export const getStaffById = async (req: Request, res: Response): Promise<void> => {
    try {
        const staff = await Staff.findById(req.params.id).select('-password');
        if (staff) {
            res.json(staff);
        } else {
            res.status(404).json({ message: 'Staff not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Update staff
// @route   PUT /api/staff/:id
// @access  Private/Admin
export const updateStaff = async (req: Request, res: Response): Promise<void> => {
    try {
        const staff = await Staff.findById(req.params.id);

        if (staff) {
            staff.firstName = req.body.firstName || staff.firstName;
            staff.lastName = req.body.lastName || staff.lastName;
            staff.email = req.body.email || staff.email;
            staff.specialization = req.body.specialization || staff.specialization;

            if (req.body.password) {
                staff.password = req.body.password;
            }

            const updatedStaff = await staff.save();

            res.json({
                _id: updatedStaff._id,
                firstName: updatedStaff.firstName,
                lastName: updatedStaff.lastName,
                email: updatedStaff.email,
                specialization: updatedStaff.specialization
            });
        } else {
            res.status(404).json({ message: 'Staff not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Delete staff
// @route   DELETE /api/staff/:id
// @access  Private/Admin
export const deleteStaff = async (req: Request, res: Response): Promise<void> => {
    try {
        const staff = await Staff.findById(req.params.id);

        if (staff) {
            await staff.deleteOne();
            res.json({ message: 'Staff removed' });
        } else {
            res.status(404).json({ message: 'Staff not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get staff profile
// @route   GET /api/staff/profile
// @access  Private/Staff
export const getStaffProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const staff = await Staff.findById(req.user?._id).select('-password');
        if (staff) {
            res.json(staff);
        } else {
            res.status(404).json({ message: 'Staff not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
