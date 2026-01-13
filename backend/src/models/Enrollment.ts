import mongoose, { Schema, Document, Model } from 'mongoose';
import { IEnrollment } from '../types';

export interface IEnrollmentDocument extends IEnrollment, Document { }

const enrollmentSchema = new Schema<IEnrollmentDocument>({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    courseTitle: {
        type: String,
        required: true
    },
    courseInstructor: {
        type: String,
        required: true
    },
    coursePrice: {
        type: String,
        required: true
    },

    courseDuration: {
        type: String,
        required: true
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    studentEmail: {
        type: String,
        required: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    }
}, {
    timestamps: true
});

const Enrollment: Model<IEnrollmentDocument> = mongoose.model<IEnrollmentDocument>('Enrollment', enrollmentSchema);

export default Enrollment;
