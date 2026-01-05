import mongoose, { Schema, Document, Model } from 'mongoose';
import { ICourse } from '../types';

export interface ICourseDocument extends ICourse, Document { }

const courseSchema = new Schema<ICourseDocument>({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Course description is required'],
        trim: true
    },
    instructor: {
        type: String,
        required: [true, 'Instructor name is required'],
        trim: true
    },
    instructorId: {
        type: Schema.Types.ObjectId,
        ref: 'Staff'
    },
    duration: {
        type: String,
        required: [true, 'Course duration is required']
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: [true, 'Course level is required']
    },
    price: {
        type: String,
        required: [true, 'Course price is required']
    },
    image: {
        type: String,
        default: ''
    },
    students: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    }
}, {
    timestamps: true
});

const Course: Model<ICourseDocument> = mongoose.model<ICourseDocument>('Course', courseSchema);

export default Course;
