import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import {
    signup,
    login
} from './authController';
import Student from '../models/Student';
import * as emailUtils from '../utils/email';
import jwt from 'jsonwebtoken';

vi.mock('../models/Student', () => ({
    default: {
        findOne: vi.fn(),
        create: vi.fn()
    }
}));

vi.mock('../utils/email', () => ({
    sendEmail: vi.fn().mockResolvedValue({ success: true }),
    welcomeEmailTemplate: vi.fn().mockReturnValue('<p>welcome</p>'),
    welcomeEmailSubject: vi.fn().mockReturnValue('Welcome'),
    passwordResetEmailTemplate: vi.fn(),
    passwordResetEmailSubject: vi.fn()
}));

vi.mock('jsonwebtoken', () => ({
    default: {
        sign: vi.fn().mockReturnValue('test-jwt-token')
    }
}));

const createMockRes = () => {
    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
    } as unknown as Response;
    return res;
};

describe('authController - signup', () => {
    const studentModel = Student as unknown as {
        findOne: ReturnType<typeof vi.fn>;
        create: ReturnType<typeof vi.fn>;
    };

    const sendEmailMock = emailUtils.sendEmail as unknown as ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();
        process.env.JWT_SECRET = 'test-secret';
    });

    it('returns 400 if student already exists', async () => {
        const req = {
            body: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                acceptTerms: true
            }
        } as unknown as Request;
        const res = createMockRes();

        studentModel.findOne.mockResolvedValueOnce({ _id: 'existing-id' });

        await signup(req, res);

        expect(studentModel.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Student already exists with this email'
        });
    });

    it('creates student, sends welcome email and returns token when successful', async () => {
        const req = {
            body: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                acceptTerms: true
            }
        } as unknown as Request;
        const res = createMockRes();

        studentModel.findOne.mockResolvedValueOnce(null);

        const createdStudent = {
            _id: 'new-id',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com'
        };

        studentModel.create.mockResolvedValueOnce(createdStudent);

        await signup(req, res);

        expect(studentModel.create).toHaveBeenCalledWith({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'password123',
            acceptTerms: true
        });

        expect(sendEmailMock).toHaveBeenCalledTimes(1);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            _id: 'new-id',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            token: 'test-jwt-token'
        });
    });
});

describe('authController - login', () => {
    const studentModel = Student as unknown as {
        findOne: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
        vi.clearAllMocks();
        process.env.JWT_SECRET = 'test-secret';
    });

    it('returns 401 when credentials are invalid', async () => {
        const req = {
            body: {
                email: 'john@example.com',
                password: 'wrongpassword'
            }
        } as unknown as Request;
        const res = createMockRes();

        studentModel.findOne.mockResolvedValueOnce(null);

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Invalid email or password'
        });
    });

    it('returns user data and token when credentials are correct', async () => {
        const req = {
            body: {
                email: 'john@example.com',
                password: 'password123'
            }
        } as unknown as Request;
        const res = createMockRes();

        const mockStudent = {
            _id: 'student-id',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            matchPassword: vi.fn().mockResolvedValue(true)
        };

        studentModel.findOne.mockResolvedValueOnce(mockStudent);

        await login(req, res);

        expect(mockStudent.matchPassword).toHaveBeenCalledWith('password123');
        expect(res.json).toHaveBeenCalledWith({
            _id: 'student-id',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            token: 'test-jwt-token'
        });
    });
});

