import { Request, Response } from 'express';
import Staff from '../models/Staff';

export const getStaff = async (req: Request, res: Response): Promise<void> => {
    try {
        const staff = await Staff.find().select('-password');
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

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
