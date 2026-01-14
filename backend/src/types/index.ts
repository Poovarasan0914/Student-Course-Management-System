import { Types } from 'mongoose';

// User Types
export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    resetPasswordToken?: string;
    resetPasswordExpiry?: Date;
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
    price: string;
    image: string;
    videoUrl?: string;
    students: number;
    rating: number;
}

// Enrollment Types
export interface IEnrollment {
    courseId: Types.ObjectId;
    courseTitle: string;
    courseInstructor: string;
    coursePrice: string;
    courseDuration: string;
    studentId: Types.ObjectId;
    studentName: string;
    studentEmail: string;
    enrolledAt: Date;
    status: 'active' | 'completed' | 'cancelled';
}

// Message Types
export interface IMessage {
    courseId: Types.ObjectId;
    senderId: Types.ObjectId;
    senderName: string;
    senderRole: 'staff' | 'student';
    content: string;
    messageType: 'text' | 'link';
}

// Material Types
export interface IMaterial {
    courseId: Types.ObjectId;
    uploadedBy: Types.ObjectId;
    uploadedByName: string;
    title: string;
    description?: string;
    category: 'Lecture Notes' | 'Assignment' | 'Study Material' | 'Exam Preparation';
    fileName: string;
    fileType: string;
    fileSize: number;
    filePath: string;
    fileUrl: string;
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
