import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import Staff from '../models/Staff';
import Student from '../models/Student';
import { sendEmail, welcomeEmailTemplate, welcomeEmailSubject } from '../utils/email';

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
