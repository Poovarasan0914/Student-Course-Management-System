import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
// Config is created inside the function to ensure env vars are loaded
const createTransporter = () => {
    const emailConfig = {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    };

    return nodemailer.createTransport(emailConfig);
};

// Platform configuration - using getter functions to ensure env vars are loaded
export const platformConfig = {
    get name() { return process.env.PLATFORM_NAME || 'Student Course Management System'; },
    get url() { return process.env.FRONTEND_URL || 'http://localhost:5173'; },
    get supportEmail() { return process.env.SUPPORT_EMAIL || 'support@example.com'; },
    get logoUrl() { return process.env.LOGO_URL || ''; }
};

export { createTransporter };
