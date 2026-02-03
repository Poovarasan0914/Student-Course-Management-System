import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import Admin from './Admin';
import Staff from './Staff';
import Student from './Student';

vi.mock('bcryptjs', () => ({
    default: {
        compare: vi.fn()
    }
}));

const bcryptCompareMock = (bcrypt as unknown as { compare: ReturnType<typeof vi.fn> }).compare as ReturnType<typeof vi.fn>;

describe('User models matchPassword methods', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Admin.matchPassword delegates to bcrypt.compare and returns result', async () => {
        const adminDoc: any = { password: 'hashed-admin-password' };
        const matchPassword = (Admin as any).schema.methods.matchPassword as (this: any, entered: string) => Promise<boolean>;

        bcryptCompareMock.mockResolvedValueOnce(true);

        const result = await matchPassword.call(adminDoc, 'plain-password');

        expect(bcryptCompareMock).toHaveBeenCalledWith('plain-password', 'hashed-admin-password');
        expect(result).toBe(true);
    });

    it('Staff.matchPassword delegates to bcrypt.compare and returns result', async () => {
        const staffDoc: any = { password: 'hashed-staff-password' };
        const matchPassword = (Staff as any).schema.methods.matchPassword as (this: any, entered: string) => Promise<boolean>;

        bcryptCompareMock.mockResolvedValueOnce(false);

        const result = await matchPassword.call(staffDoc, 'plain-password');

        expect(bcryptCompareMock).toHaveBeenCalledWith('plain-password', 'hashed-staff-password');
        expect(result).toBe(false);
    });

    it('Student.matchPassword delegates to bcrypt.compare and returns result', async () => {
        const studentDoc: any = { password: 'hashed-student-password' };
        const matchPassword = (Student as any).schema.methods.matchPassword as (this: any, entered: string) => Promise<boolean>;

        bcryptCompareMock.mockResolvedValueOnce(true);

        const result = await matchPassword.call(studentDoc, 'plain-password');

        expect(bcryptCompareMock).toHaveBeenCalledWith('plain-password', 'hashed-student-password');
        expect(result).toBe(true);
    });
});

