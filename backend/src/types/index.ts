import { Types } from 'mongoose';

// User Types
export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

// Admin Types
export interface IAdmin extends IUser {
    role: 'admin' | 'superadmin';
}

// Staff Types
export interface IStaff extends IUser {
    specialization: string;
}

// Student Types
export interface IStudent extends IUser {
    acceptTerms: boolean;
}

// Course Types
export interface ICourse {
    title: string;
    description: string;
    instructor: string;
    instructorId?: Types.ObjectId;
    duration: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    price: string;
    image: string;
    students: number;
    rating: number;
}

// Enrollment Types
export interface IEnrollment {
    courseId: Types.ObjectId;
    courseTitle: string;
    courseInstructor: string;
    coursePrice: string;
    courseLevel: string;
    courseDuration: string;
    studentId: Types.ObjectId;
    studentName: string;
    studentEmail: string;
    enrolledAt: Date;
    status: 'active' | 'completed' | 'cancelled';
}

// Request Types
export interface SignupRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    acceptTerms?: boolean;
    specialization?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

// JWT Payload
export interface JwtPayload {
    id: string;
    role: string;
}

// Express Request Extension
import { Request } from 'express';
import { Document } from 'mongoose';

export interface AuthRequest extends Request {
    user?: Document & (IAdmin | IStaff | IStudent);
    userRole?: string;
}
