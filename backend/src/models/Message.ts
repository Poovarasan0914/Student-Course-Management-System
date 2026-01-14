import mongoose, { Schema, Document, Model } from 'mongoose';
import { IMessage } from '../types';

export interface IMessageDocument extends IMessage, Document { }

const messageSchema = new Schema<IMessageDocument>({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course ID is required']
    },
    senderId: {
        type: Schema.Types.ObjectId,
        required: [true, 'Sender ID is required']
    },
    senderName: {
        type: String,
        required: [true, 'Sender name is required'],
        trim: true
    },
    senderRole: {
        type: String,
        enum: ['staff', 'student'],
        required: [true, 'Sender role is required']
    },
    content: {
        type: String,
        required: [true, 'Message content is required'],
        trim: true
    },
    messageType: {
        type: String,
        enum: ['text', 'link'],
        default: 'text'
    }
}, {
    timestamps: true
});

// Index for efficient querying by course
messageSchema.index({ courseId: 1, createdAt: -1 });

const Message: Model<IMessageDocument> = mongoose.model<IMessageDocument>('Message', messageSchema);

export default Message;
