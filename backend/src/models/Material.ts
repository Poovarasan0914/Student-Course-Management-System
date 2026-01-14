import mongoose, { Schema, Document, Model } from 'mongoose';
import { IMaterial } from '../types';

export interface IMaterialDocument extends IMaterial, Document { }

const materialSchema = new Schema<IMaterialDocument>({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course ID is required']
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Staff',
        required: [true, 'Uploader ID is required']
    },
    uploadedByName: {
        type: String,
        required: [true, 'Uploader name is required'],
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    category: {
        type: String,
        enum: ['Lecture Notes', 'Assignment', 'Study Material', 'Exam Preparation'],
        default: 'Study Material'
    },
    fileName: {
        type: String,
        required: [true, 'File name is required']
    },
    fileType: {
        type: String,
        required: [true, 'File type is required']
    },
    fileSize: {
        type: Number,
        required: [true, 'File size is required']
    },
    filePath: {
        type: String,
        required: [true, 'File path is required']
    },
    fileUrl: {
        type: String,
        required: [true, 'File URL is required']
    }
}, {
    timestamps: true
});

// Index for efficient querying by course
materialSchema.index({ courseId: 1, createdAt: -1 });

const Material: Model<IMaterialDocument> = mongoose.model<IMaterialDocument>('Material', materialSchema);

export default Material;
