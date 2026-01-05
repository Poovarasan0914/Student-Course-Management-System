import { Request, Response } from 'express';
import Course from '../models/Course';
import { AuthRequest } from '../types';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req: Request, res: Response): Promise<void> => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get all courses for admin
// @route   GET /api/courses/all
// @access  Private/Admin
export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Staff
export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, duration, level, price, image } = req.body;

        const course = await Course.create({
            title,
            description,
            instructor: `${req.user?.firstName} ${req.user?.lastName}`,
            instructorId: req.user?._id,
            duration,
            level,
            price,
            image: image || ''
        });

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Staff or Admin
export const updateCourse = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }

        // Staff can only update their own courses
        if (req.userRole === 'staff' && course.instructorId?.toString() !== req.user?._id?.toString()) {
            res.status(403).json({ message: 'Not authorized to update this course' });
            return;
        }

        course.title = req.body.title || course.title;
        course.description = req.body.description || course.description;
        course.duration = req.body.duration || course.duration;
        course.level = req.body.level || course.level;
        course.price = req.body.price || course.price;
        course.image = req.body.image || course.image;

        const updatedCourse = await course.save();
        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Staff or Admin
export const deleteCourse = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }

        // Staff can only delete their own courses
        if (req.userRole === 'staff' && course.instructorId?.toString() !== req.user?._id?.toString()) {
            res.status(403).json({ message: 'Not authorized to delete this course' });
            return;
        }

        await course.deleteOne();
        res.json({ message: 'Course removed' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get courses by instructor
// @route   GET /api/courses/instructor
// @access  Private/Staff
export const getCoursesByInstructor = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const courses = await Course.find({ instructorId: req.user?._id });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
