import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Admin from '../models/Admin';
import Staff from '../models/Staff';
import Student from '../models/Student';
import { sendEmail, welcomeEmailTemplate, welcomeEmailSubject, passwordResetEmailTemplate, passwordResetEmailSubject } from '../utils/email';

// Password reset token expiry time in minutes
const RESET_TOKEN_EXPIRY_MINUTES = 15;

// Generate JWT Token
const generateToken = (id: string, role: string): string => {
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
        expiresIn: expiresIn as jwt.SignOptions['expiresIn']
    });
};

// @desc    Register student
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, password, acceptTerms } = req.body;

        // Check if student exists
        const studentExists = await Student.findOne({ email });
        if (studentExists) {
            res.status(400).json({ message: 'Student already exists with this email' });
            return;
        }

        // Create student
        const student = await Student.create({
            firstName,
            lastName,
            email,
            password,
            acceptTerms
        });

        if (student) {
            // Send welcome email (non-blocking)
            console.log(`[AUTH] Student created successfully: ${student.email}`);
            console.log('[AUTH] Triggering welcome email...');

            sendEmail({
                to: student.email,
                subject: welcomeEmailSubject('student'),
                html: welcomeEmailTemplate({
                    firstName: student.firstName,
                    lastName: student.lastName,
                    email: student.email,
                    userType: 'student'
                })
            }).then((result) => {
                if (result.success) {
                    console.log(`[AUTH] Welcome email sent successfully to ${student.email}`);
                } else {
                    console.error(`[AUTH] Welcome email failed: ${result.error}`);
                }
            }).catch((err) => {
                console.error('[AUTH] Failed to send welcome email:', err);
            });

            res.status(201).json({
                _id: student._id,
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email,
                token: generateToken(student._id.toString(), 'student')
            });
        } else {
            res.status(400).json({ message: 'Invalid student data' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Login student
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Check for student
        const student = await Student.findOne({ email });

        if (student && (await student.matchPassword(password))) {
            res.json({
                _id: student._id,
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email,
                token: generateToken(student._id.toString(), 'student')
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Login admin
// @route   POST /api/auth/admin/login
// @access  Public
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Check for admin
        const admin = await Admin.findOne({ email });

        if (admin && (await admin.matchPassword(password))) {
            res.json({
                _id: admin._id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                role: admin.role,
                token: generateToken(admin._id.toString(), admin.role)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Register staff
// @route   POST /api/auth/staff/signup
// @access  Public
export const staffSignup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, password, specialization } = req.body;

        // Check if staff exists
        const staffExists = await Staff.findOne({ email });
        if (staffExists) {
            res.status(400).json({ message: 'Staff already exists with this email' });
            return;
        }

        // Create staff
        const staff = await Staff.create({
            firstName,
            lastName,
            email,
            password,
            specialization
        });

        if (staff) {
            // Send welcome email (non-blocking)
            console.log(`[AUTH] Staff created successfully: ${staff.email}`);
            console.log('[AUTH] Triggering welcome email for staff...');

            sendEmail({
                to: staff.email,
                subject: welcomeEmailSubject('staff'),
                html: welcomeEmailTemplate({
                    firstName: staff.firstName,
                    lastName: staff.lastName,
                    email: staff.email,
                    userType: 'staff'
                })
            }).then((result) => {
                if (result.success) {
                    console.log(`[AUTH] Welcome email sent successfully to staff ${staff.email}`);
                } else {
                    console.error(`[AUTH] Welcome email failed for staff: ${result.error}`);
                }
            }).catch((err) => {
                console.error('[AUTH] Failed to send welcome email to staff:', err);
            });

            res.status(201).json({
                _id: staff._id,
                firstName: staff.firstName,
                lastName: staff.lastName,
                email: staff.email,
                specialization: staff.specialization,
                token: generateToken(staff._id.toString(), 'staff')
            });
        } else {
            res.status(400).json({ message: 'Invalid staff data' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Login staff
// @route   POST /api/auth/staff/login
// @access  Public
export const staffLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Check for staff
        const staff = await Staff.findOne({ email });

        if (staff && (await staff.matchPassword(password))) {
            res.json({
                _id: staff._id,
                firstName: staff.firstName,
                lastName: staff.lastName,
                email: staff.email,
                specialization: staff.specialization,
                token: generateToken(staff._id.toString(), 'staff')
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Generate a 6-digit OTP
const generateOTP = (): string => {
    return crypto.randomInt(100000, 999999).toString();
};

// @desc    Forgot password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, userType = 'student' } = req.body;

        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }

        console.log(`[AUTH] Forgot password request for: ${email} (${userType})`);

        // Find user based on type
        let user;
        if (userType === 'admin') {
            user = await Admin.findOne({ email });
        } else if (userType === 'staff') {
            user = await Staff.findOne({ email });
        } else {
            user = await Student.findOne({ email });
        }

        if (!user) {
            // Don't reveal if email exists or not for security
            res.status(200).json({
                message: 'If an account with that email exists, a password reset code has been sent.'
            });
            return;
        }

        // Generate OTP and set expiry
        const resetCode = generateOTP();
        const resetExpiry = new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);

        // Hash the OTP before storing (for security)
        const hashedToken = crypto.createHash('sha256').update(resetCode).digest('hex');

        // Update user with reset token
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpiry = resetExpiry;
        await user.save({ validateBeforeSave: false });

        console.log(`[AUTH] Reset code generated for: ${email}`);
        console.log(`[AUTH] Sending password reset email...`);

        // Send reset email
        sendEmail({
            to: user.email,
            subject: passwordResetEmailSubject(),
            html: passwordResetEmailTemplate({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                resetCode: resetCode,
                expiryMinutes: RESET_TOKEN_EXPIRY_MINUTES,
                userType: userType as 'student' | 'staff' | 'admin'
            })
        }).then((result) => {
            if (result.success) {
                console.log(`[AUTH] Password reset email sent successfully to ${user.email}`);
            } else {
                console.error(`[AUTH] Password reset email failed: ${result.error}`);
            }
        }).catch((err) => {
            console.error('[AUTH] Failed to send password reset email:', err);
        });

        res.status(200).json({
            message: 'If an account with that email exists, a password reset code has been sent.',
            expiresIn: RESET_TOKEN_EXPIRY_MINUTES
        });
    } catch (error) {
        console.error('[AUTH] Forgot password error:', error);
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Reset password - Verify OTP and update password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, resetCode, newPassword, userType = 'student' } = req.body;

        if (!email || !resetCode || !newPassword) {
            res.status(400).json({ message: 'Email, reset code, and new password are required' });
            return;
        }

        if (newPassword.length < 6) {
            res.status(400).json({ message: 'Password must be at least 6 characters long' });
            return;
        }

        console.log(`[AUTH] Reset password attempt for: ${email} (${userType})`);

        // Hash the provided OTP to compare with stored hash
        const hashedToken = crypto.createHash('sha256').update(resetCode).digest('hex');

        // Find user with valid reset token
        let user;
        if (userType === 'admin') {
            user = await Admin.findOne({
                email,
                resetPasswordToken: hashedToken,
                resetPasswordExpiry: { $gt: Date.now() }
            });
        } else if (userType === 'staff') {
            user = await Staff.findOne({
                email,
                resetPasswordToken: hashedToken,
                resetPasswordExpiry: { $gt: Date.now() }
            });
        } else {
            user = await Student.findOne({
                email,
                resetPasswordToken: hashedToken,
                resetPasswordExpiry: { $gt: Date.now() }
            });
        }

        if (!user) {
            res.status(400).json({ message: 'Invalid or expired reset code' });
            return;
        }

        // Update password
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        console.log(`[AUTH] Password reset successful for: ${email}`);

        res.status(200).json({
            message: 'Password has been reset successfully. You can now login with your new password.'
        });
    } catch (error) {
        console.error('[AUTH] Reset password error:', error);
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Verify reset code (optional - for frontend validation)
// @route   POST /api/auth/verify-reset-code
// @access  Public
export const verifyResetCode = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, resetCode, userType = 'student' } = req.body;

        if (!email || !resetCode) {
            res.status(400).json({ message: 'Email and reset code are required' });
            return;
        }

        // Hash the provided OTP to compare with stored hash
        const hashedToken = crypto.createHash('sha256').update(resetCode).digest('hex');

        // Find user with valid reset token
        let user;
        if (userType === 'admin') {
            user = await Admin.findOne({
                email,
                resetPasswordToken: hashedToken,
                resetPasswordExpiry: { $gt: Date.now() }
            });
        } else if (userType === 'staff') {
            user = await Staff.findOne({
                email,
                resetPasswordToken: hashedToken,
                resetPasswordExpiry: { $gt: Date.now() }
            });
        } else {
            user = await Student.findOne({
                email,
                resetPasswordToken: hashedToken,
                resetPasswordExpiry: { $gt: Date.now() }
            });
        }

        if (!user) {
            res.status(400).json({ valid: false, message: 'Invalid or expired reset code' });
            return;
        }

        res.status(200).json({ valid: true, message: 'Reset code is valid' });
    } catch (error) {
        console.error('[AUTH] Verify reset code error:', error);
        res.status(500).json({ message: (error as Error).message });
    }
};
