import { Router } from 'express';
import {
    getMessagesByCourse,
    createMessage,
    deleteMessage
} from '../controllers/messageController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// All message routes require authentication
router.use(protect as any);

// Get messages for a course
router.get('/:courseId', getMessagesByCourse as any);

// Send a message
router.post('/:courseId', createMessage as any);

// Delete a message
router.delete('/:messageId', deleteMessage as any);

export default router;
