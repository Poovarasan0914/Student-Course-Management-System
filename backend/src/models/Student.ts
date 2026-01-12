import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IStudent } from '../types';

export interface IStudentDocument extends IStudent, Document {
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const studentSchema = new Schema<IStudentDocument>({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    acceptTerms: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

studentSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Student: Model<IStudentDocument> = mongoose.model<IStudentDocument>('Student', studentSchema);

export default Student;
