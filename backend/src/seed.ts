import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/login_db';

// Admin Schema (inline for seeding)
const adminSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' }
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@admin.com' });

        if (existingAdmin) {
            console.log('Admin already exists, skipping...');
        } else {
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            // Create default admin
            await Admin.create({
                firstName: 'Super',
                lastName: 'Admin',
                email: 'admin@admin.com',
                password: hashedPassword,
                role: 'superadmin'
            });
            console.log('Default admin created:');
            console.log('  Email: admin@admin.com');
            console.log('  Password: admin123');
        }

        console.log('\nSeeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seed();
