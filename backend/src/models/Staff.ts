import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IStaff } from '../types';

export interface IStaffDocument extends IStaff, Document {
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const staffSchema = new Schema<IStaffDocument>({
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
    specialization: {
        type: String,
        required: [true, 'Specialization is required'],
        trim: true
    }
}, {
    timestamps: true
});

// Hash password before saving
staffSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
staffSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Staff: Model<IStaffDocument> = mongoose.model<IStaffDocument>('Staff', staffSchema);

export default Staff;
