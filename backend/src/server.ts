import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import errorHandler from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import staffRoutes from './routes/staffRoutes';
import studentRoutes from './routes/studentRoutes';
import courseRoutes from './routes/courseRoutes';
import enrollmentRoutes from './routes/enrollmentRoutes';

dotenv.config();

connectDB();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
