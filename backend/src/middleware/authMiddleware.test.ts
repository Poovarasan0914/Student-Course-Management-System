import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextFunction, Response } from 'express';
import { protect, adminOnly, staffOnly, studentOnly, staffOrAdmin } from './authMiddleware';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import Staff from '../models/Staff';
import Student from '../models/Student';
import type { AuthRequest } from '../types';

vi.mock('jsonwebtoken', () => ({
    default: {
        verify: vi.fn()
    }
}));

vi.mock('../models/Admin', () => ({
    default: {
        findById: vi.fn()
    }
}));

vi.mock('../models/Staff', () => ({
    default: {
        findById: vi.fn()
    }
}));

vi.mock('../models/Student', () => ({
    default: {
        findById: vi.fn()
    }
}));

const createMockRes = () => {
    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
    } as unknown as Response;
    return res;
};

const createMockNext = () => vi.fn() as unknown as NextFunction;

describe('authMiddleware - protect', () => {
    const jwtVerifyMock = (jwt as unknown as { verify: ReturnType<typeof vi.fn> }).verify as ReturnType<typeof vi.fn>;
    const adminFindByIdMock = (Admin as unknown as { findById: ReturnType<typeof vi.fn> }).findById as ReturnType<typeof vi.fn>;
    const staffFindByIdMock = (Staff as unknown as { findById: ReturnType<typeof vi.fn> }).findById as ReturnType<typeof vi.fn>;
    const studentFindByIdMock = (Student as unknown as { findById: ReturnType<typeof vi.fn> }).findById as ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('responds 401 when no token is provided', async () => {
        const req = {
            headers: {}
        } as unknown as AuthRequest;
        const res = createMockRes();
        const next = createMockNext();

        await protect(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, no token' });
        expect(next).not.toHaveBeenCalled();
    });

    it('responds 401 when token verification fails', async () => {
        const req = {
            headers: {
                authorization: 'Bearer invalidtoken'
            }
        } as unknown as AuthRequest;
        const res = createMockRes();
        const next = createMockNext();

        jwtVerifyMock.mockImplementationOnce(() => {
            throw new Error('invalid token');
        });

        await protect(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, token failed' });
        expect(next).not.toHaveBeenCalled();
    });

    it('attaches admin user and calls next for admin role', async () => {
        const req = {
            headers: {
                authorization: 'Bearer validtoken'
            }
        } as unknown as AuthRequest;
        const res = createMockRes();
        const next = createMockNext();

        jwtVerifyMock.mockReturnValueOnce({ id: 'admin-id', role: 'admin' });

        const mockAdmin = { _id: 'admin-id', firstName: 'Admin' };
        adminFindByIdMock.mockReturnValueOnce({
            select: vi.fn().mockResolvedValue(mockAdmin)
        });

        await protect(req, res, next);

        expect(adminFindByIdMock).toHaveBeenCalledWith('admin-id');
        expect((req as AuthRequest).user).toEqual(mockAdmin);
        expect((req as AuthRequest).userRole).toBe('admin');
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it('attaches staff user for staff role', async () => {
        const req = {
            headers: {
                authorization: 'Bearer validtoken'
            }
        } as unknown as AuthRequest;
        const res = createMockRes();
        const next = createMockNext();

        jwtVerifyMock.mockReturnValueOnce({ id: 'staff-id', role: 'staff' });

        const mockStaff = { _id: 'staff-id', firstName: 'Staff' };
        staffFindByIdMock.mockReturnValueOnce({
            select: vi.fn().mockResolvedValue(mockStaff)
        });

        await protect(req, res, next);

        expect(staffFindByIdMock).toHaveBeenCalledWith('staff-id');
        expect((req as AuthRequest).user).toEqual(mockStaff);
        expect((req as AuthRequest).userRole).toBe('staff');
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('attaches student user for student role', async () => {
        const req = {
            headers: {
                authorization: 'Bearer validtoken'
            }
        } as unknown as AuthRequest;
        const res = createMockRes();
        const next = createMockNext();

        jwtVerifyMock.mockReturnValueOnce({ id: 'student-id', role: 'student' });

        const mockStudent = { _id: 'student-id', firstName: 'Student' };
        studentFindByIdMock.mockReturnValueOnce({
            select: vi.fn().mockResolvedValue(mockStudent)
        });

        await protect(req, res, next);

        expect(studentFindByIdMock).toHaveBeenCalledWith('student-id');
        expect((req as AuthRequest).user).toEqual(mockStudent);
        expect((req as AuthRequest).userRole).toBe('student');
        expect(next).toHaveBeenCalledTimes(1);
    });
});

describe('authMiddleware - role guards', () => {
    const createReq = (role: string | undefined) =>
        ({ userRole: role } as unknown as AuthRequest);

    it('adminOnly allows admin and superadmin', () => {
        const res = createMockRes();
        const next = createMockNext();
        adminOnly(createReq('admin'), res, next);
        expect(next).toHaveBeenCalled();

        const res2 = createMockRes();
        const next2 = createMockNext();
        adminOnly(createReq('superadmin'), res2, next2);
        expect(next2).toHaveBeenCalled();
    });

    it('adminOnly denies non-admin roles', () => {
        const res = createMockRes();
        const next = createMockNext();
        adminOnly(createReq('student'), res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. Admin only.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('staffOnly allows staff and denies others', () => {
        const res = createMockRes();
        const next = createMockNext();
        staffOnly(createReq('staff'), res, next);
        expect(next).toHaveBeenCalled();

        const res2 = createMockRes();
        const next2 = createMockNext();
        staffOnly(createReq('admin'), res2, next2);
        expect(res2.status).toHaveBeenCalledWith(403);
        expect(res2.json).toHaveBeenCalledWith({ message: 'Access denied. Staff only.' });
        expect(next2).not.toHaveBeenCalled();
    });

    it('studentOnly allows student and denies others', () => {
        const res = createMockRes();
        const next = createMockNext();
        studentOnly(createReq('student'), res, next);
        expect(next).toHaveBeenCalled();

        const res2 = createMockRes();
        const next2 = createMockNext();
        studentOnly(createReq('staff'), res2, next2);
        expect(res2.status).toHaveBeenCalledWith(403);
        expect(res2.json).toHaveBeenCalledWith({ message: 'Access denied. Student only.' });
        expect(next2).not.toHaveBeenCalled();
    });

    it('staffOrAdmin allows staff, admin and superadmin; denies others', () => {
        const okRoles = ['staff', 'admin', 'superadmin'];
        for (const role of okRoles) {
            const res = createMockRes();
            const next = createMockNext();
            staffOrAdmin(createReq(role), res, next);
            expect(next).toHaveBeenCalled();
        }

        const res2 = createMockRes();
        const next2 = createMockNext();
        staffOrAdmin(createReq('student'), res2, next2);
        expect(res2.status).toHaveBeenCalledWith(403);
        expect(res2.json).toHaveBeenCalledWith({ message: 'Access denied. Staff or Admin only.' });
        expect(next2).not.toHaveBeenCalled();
    });
});

