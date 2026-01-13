import { Request, Response } from 'express';
import Course from '../models/Course';
import { AuthRequest } from '../types';

export const getCourses = async (req: Request, res: Response): Promise<void> => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};


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


export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, duration, price, image, videoUrl } = req.body;

        const course = await Course.create({
            title,
            description,
            instructor: `${req.user?.firstName} ${req.user?.lastName}`,
            instructorId: req.user?._id,
            duration,
            price,
            image: image || '',
            videoUrl: videoUrl || ''
        });

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

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
        course.price = req.body.price || course.price;
        course.image = req.body.image || course.image;
        course.videoUrl = req.body.videoUrl !== undefined ? req.body.videoUrl : course.videoUrl;

        const updatedCourse = await course.save();
        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};


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

export const getCoursesByInstructor = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const courses = await Course.find({ instructorId: req.user?._id });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
