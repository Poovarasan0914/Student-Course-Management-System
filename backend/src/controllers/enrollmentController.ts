import { Request, Response } from 'express';
import Enrollment from '../models/Enrollment';
import Course from '../models/Course';
import { AuthRequest } from '../types';

// @desc    Get all enrollments
// @route   GET /api/enrollments
// @access  Private/Admin
export const getEnrollments = async (req: Request, res: Response): Promise<void> => {
    try {
        const enrollments = await Enrollment.find();
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get enrollment by ID
// @route   GET /api/enrollments/:id
// @access  Private
export const getEnrollmentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);
        if (enrollment) {
            res.json(enrollment);
        } else {
            res.status(404).json({ message: 'Enrollment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Create enrollment
// @route   POST /api/enrollments
// @access  Private/Student
export const createEnrollment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { courseId } = req.body;

        // Get course details
        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            courseId,
            studentId: req.user?._id
        });

        if (existingEnrollment) {
            res.status(400).json({ message: 'Already enrolled in this course' });
            return;
        }

        const enrollment = await Enrollment.create({
            courseId,
            courseTitle: course.title,
            courseInstructor: course.instructor,
            coursePrice: course.price,
            courseLevel: course.level,
            courseDuration: course.duration,
            studentId: req.user?._id,
            studentName: `${req.user?.firstName} ${req.user?.lastName}`,
            studentEmail: req.user?.email,
            status: 'active'
        });

        // Update course student count
        course.students = (course.students || 0) + 1;
        await course.save();

        res.status(201).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Update enrollment status
// @route   PUT /api/enrollments/:id
// @access  Private/Admin
export const updateEnrollment = async (req: Request, res: Response): Promise<void> => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);

        if (enrollment) {
            enrollment.status = req.body.status || enrollment.status;
            const updatedEnrollment = await enrollment.save();
            res.json(updatedEnrollment);
        } else {
            res.status(404).json({ message: 'Enrollment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Delete enrollment
// @route   DELETE /api/enrollments/:id
// @access  Private/Admin
export const deleteEnrollment = async (req: Request, res: Response): Promise<void> => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);

        if (enrollment) {
            await enrollment.deleteOne();
            res.json({ message: 'Enrollment removed' });
        } else {
            res.status(404).json({ message: 'Enrollment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get student enrollments
// @route   GET /api/enrollments/student
// @access  Private/Student
export const getStudentEnrollments = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const enrollments = await Enrollment.find({ studentId: req.user?._id });
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get enrollments by course
// @route   GET /api/enrollments/course/:courseId
// @access  Private/Staff or Admin
export const getEnrollmentsByCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const enrollments = await Enrollment.find({ courseId: req.params.courseId });
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Cancel enrollment
// @route   PUT /api/enrollments/:id/cancel
// @access  Private/Student
export const cancelEnrollment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const enrollment = await Enrollment.findOne({
            _id: req.params.id,
            studentId: req.user?._id
        });

        if (enrollment) {
            enrollment.status = 'cancelled';
            await enrollment.save();

            // Update course student count
            const course = await Course.findById(enrollment.courseId);
            if (course && course.students > 0) {
                course.students = course.students - 1;
                await course.save();
            }

            res.json({ message: 'Enrollment cancelled', enrollment });
        } else {
            res.status(404).json({ message: 'Enrollment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
