import { Response } from 'express';
import Message from '../models/Message';
import { AuthRequest } from '../types';

// Get messages for a course
export const getMessagesByCourse = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { courseId } = req.params;
        const messages = await Message.find({ courseId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Create a new message
export const createMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { courseId } = req.params;
        const { content, messageType } = req.body;

        if (!content) {
            res.status(400).json({ message: 'Message content is required' });
            return;
        }

        const message = await Message.create({
            courseId,
            senderId: req.user?._id,
            senderName: `${req.user?.firstName} ${req.user?.lastName}`,
            senderRole: req.userRole === 'staff' ? 'staff' : 'student',
            content,
            messageType: messageType || 'text'
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Delete a message
export const deleteMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { messageId } = req.params;
        const message = await Message.findById(messageId);

        if (!message) {
            res.status(404).json({ message: 'Message not found' });
            return;
        }

        // Only allow the sender or staff to delete messages
        if (message.senderId.toString() !== req.user?._id?.toString() && req.userRole !== 'staff') {
            res.status(403).json({ message: 'Not authorized to delete this message' });
            return;
        }

        await message.deleteOne();
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
