import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
    getMaterialsByCourse,
    uploadMaterial,
    deleteMaterial,
    downloadMaterial,
    viewMaterial
} from '../controllers/materialController';
import { protect, staffOnly } from '../middleware/authMiddleware';

const router = Router();

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, '../../uploads/materials');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

// View material inline (public route - no auth required for iframe/img preview)
// Note: This must be BEFORE the protect middleware
router.get('/view/:materialId', viewMaterial as any);

// All other material routes require authentication
router.use(protect as any);

// Download material (before /:courseId to avoid conflicts)
router.get('/download/:materialId', downloadMaterial as any);

// Get materials for a course
router.get('/:courseId', getMaterialsByCourse as any);

// Upload a material (staff only)
router.post('/:courseId', staffOnly as any, upload.single('file') as any, uploadMaterial as any);

// Delete a material
router.delete('/:materialId', deleteMaterial as any);

export default router;

