import { Request, Response } from 'express';
import Student from '../models/Student';

export const getStudents = async (req: Request, res: Response): Promise<void> => {
    try {
        const students = await Student.find().select('-password');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};


export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
    try {
        const student = await Student.findById(req.params.id);

        if (student) {
            await student.deleteOne();
            res.json({ message: 'Student removed' });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
