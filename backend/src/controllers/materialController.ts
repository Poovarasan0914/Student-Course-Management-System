import { Response } from 'express';
import path from 'path';
import fs from 'fs';
import Material from '../models/Material';
import { AuthRequest } from '../types';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads/materials');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Get materials for a course
export const getMaterialsByCourse = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { courseId } = req.params;
        const materials = await Material.find({ courseId }).sort({ createdAt: -1 });
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Upload a new material
export const uploadMaterial = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { courseId } = req.params;
        const { title, description, category } = req.body;

        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        if (!title) {
            res.status(400).json({ message: 'Title is required' });
            return;
        }

        const material = await Material.create({
            courseId,
            uploadedBy: req.user?._id,
            uploadedByName: `${req.user?.firstName} ${req.user?.lastName}`,
            title,
            description: description || '',
            category: category || 'Study Material',
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            filePath: req.file.path,
            fileUrl: `/api/materials/download/${req.file.filename}`
        });

        res.status(201).json(material);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Delete a material
export const deleteMaterial = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { materialId } = req.params;
        const material = await Material.findById(materialId);

        if (!material) {
            res.status(404).json({ message: 'Material not found' });
            return;
        }

        // Only allow the uploader or admin to delete materials
        if (material.uploadedBy.toString() !== req.user?._id?.toString() &&
            req.userRole !== 'admin' && req.userRole !== 'superadmin') {
            res.status(403).json({ message: 'Not authorized to delete this material' });
            return;
        }

        // Delete the file from disk
        if (fs.existsSync(material.filePath)) {
            fs.unlinkSync(material.filePath);
        }

        await material.deleteOne();
        res.json({ message: 'Material deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Download a material
export const downloadMaterial = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { materialId } = req.params;
        const material = await Material.findById(materialId);

        if (!material) {
            res.status(404).json({ message: 'Material not found' });
            return;
        }

        if (!fs.existsSync(material.filePath)) {
            res.status(404).json({ message: 'File not found on server' });
            return;
        }

        res.download(material.filePath, material.fileName);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
