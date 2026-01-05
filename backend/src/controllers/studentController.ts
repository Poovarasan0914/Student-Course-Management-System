import { Request, Response } from 'express';
import Student from '../models/Student';
import { AuthRequest } from '../types';

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
export const getStudents = async (req: Request, res: Response): Promise<void> => {
    try {
        const students = await Student.find().select('-password');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private/Admin
export const getStudentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const student = await Student.findById(req.params.id).select('-password');
        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
export const updateStudent = async (req: Request, res: Response): Promise<void> => {
    try {
        const student = await Student.findById(req.params.id);

        if (student) {
            student.firstName = req.body.firstName || student.firstName;
            student.lastName = req.body.lastName || student.lastName;
            student.email = req.body.email || student.email;

            if (req.body.password) {
                student.password = req.body.password;
            }

            const updatedStudent = await student.save();

            res.json({
                _id: updatedStudent._id,
                firstName: updatedStudent.firstName,
                lastName: updatedStudent.lastName,
                email: updatedStudent.email
            });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
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

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private/Student
export const getStudentProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const student = await Student.findById(req.user?._id).select('-password');
        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Update student profile
// @route   PUT /api/students/profile
// @access  Private/Student
export const updateStudentProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const student = await Student.findById(req.user?._id);

        if (student) {
            student.firstName = req.body.firstName || student.firstName;
            student.lastName = req.body.lastName || student.lastName;
            student.email = req.body.email || student.email;

            if (req.body.password) {
                student.password = req.body.password;
            }

            const updatedStudent = await student.save();

            res.json({
                _id: updatedStudent._id,
                firstName: updatedStudent.firstName,
                lastName: updatedStudent.lastName,
                email: updatedStudent.email
            });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
