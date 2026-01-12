import { Request, Response } from 'express';
import Enrollment from '../models/Enrollment';
import Course from '../models/Course';
import { AuthRequest } from '../types';
import { sendEmail, enrollmentEmailTemplate, enrollmentEmailSubject } from '../utils/email';

export const getEnrollments = async (req: Request, res: Response): Promise<void> => {
    try {
        const enrollments = await Enrollment.find();
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createEnrollment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { courseId } = req.body;

        // Get course
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

        course.students = (course.students || 0) + 1;
        await course.save();

        // Send enrollment confirmation email (non-blocking)
        if (req.user?.email) {
            console.log(`[ENROLLMENT] Enrollment created for student: ${req.user.email}`);
            console.log('[ENROLLMENT] Triggering enrollment confirmation email...');

            sendEmail({
                to: req.user.email,
                subject: enrollmentEmailSubject(course.title),
                html: enrollmentEmailTemplate({
                    studentName: `${req.user?.firstName} ${req.user?.lastName}`,
                    studentEmail: req.user.email,
                    courseTitle: course.title,
                    courseInstructor: course.instructor,
                    courseLevel: course.level,
                    courseDuration: course.duration,
                    enrollmentDate: new Date()
                })
            }).then((result) => {
                if (result.success) {
                    console.log(`[ENROLLMENT] Confirmation email sent successfully to ${req.user?.email}`);
                } else {
                    console.error(`[ENROLLMENT] Confirmation email failed: ${result.error}`);
                }
            }).catch((err) => {
                console.error('[ENROLLMENT] Failed to send enrollment confirmation email:', err);
            });
        }

        res.status(201).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteEnrollment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);

        if (!enrollment) {
            res.status(404).json({ message: 'Enrollment not found' });
            return;
        }

        // Verify the enrollment belongs to the requesting student
        if (enrollment.studentId.toString() !== req.user?._id.toString()) {
            res.status(403).json({ message: 'Not authorized to unenroll from this course' });
            return;
        }

        // Decrease student count in course
        const course = await Course.findById(enrollment.courseId);
        if (course && course.students > 0) {
            course.students = course.students - 1;
            await course.save();
        }

        await Enrollment.findByIdAndDelete(req.params.id);

        res.json({ message: 'Successfully unenrolled from the course' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getStudentEnrollments = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const enrollments = await Enrollment.find({ studentId: req.user?._id });
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};


export const getEnrollmentsByCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const enrollments = await Enrollment.find({ courseId: req.params.courseId });
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
