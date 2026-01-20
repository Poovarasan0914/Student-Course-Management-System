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

        // Create material first to get the _id
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
            fileUrl: '' // Placeholder, will be updated below
        });

        // Update with correct fileUrl using the material's _id
        material.fileUrl = `/api/materials/download/${material._id}`;
        await material.save();

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

// View a material (inline - for preview in browser)
export const viewMaterial = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { materialId } = req.params;

        let material = null;

        // Check if materialId is a valid MongoDB ObjectId
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(materialId);

        if (isValidObjectId) {
            // New format: materialId is a MongoDB ObjectId
            material = await Material.findById(materialId);
        } else {
            // Old format: materialId is a filename (e.g., "1768843328625-495775674.pdf")
            // Search by filePath containing the filename
            material = await Material.findOne({
                filePath: { $regex: materialId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }
            });
        }

        if (!material) {
            res.status(404).json({ message: 'Material not found' });
            return;
        }

        if (!fs.existsSync(material.filePath)) {
            res.status(404).json({ message: 'File not found on server' });
            return;
        }

        // Set content type and disposition for inline viewing
        res.setHeader('Content-Type', material.fileType);
        res.setHeader('Content-Disposition', `inline; filename="${material.fileName}"`);

        // Stream the file
        const fileStream = fs.createReadStream(material.filePath);
        fileStream.pipe(res);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
