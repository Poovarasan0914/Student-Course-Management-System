import { describe, it, expect, vi } from 'vitest';
import {
    passwordResetEmailTemplate,
    passwordResetEmailSubject
} from './passwordResetEmailTemplate';

vi.mock('../../../config/email', () => ({
    platformConfig: {
        name: 'Test Platform',
        url: 'http://test.example.com',
        supportEmail: 'support@test.example.com',
        logoUrl: ''
    }
}));

describe('passwordResetEmailTemplate', () => {
    const baseData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        resetCode: '123456',
        expiryMinutes: 15
    };

    it('includes full name, reset code and expiry', () => {
        const html = passwordResetEmailTemplate({
            ...baseData,
            userType: 'student'
        });

        expect(html).toContain('Jane Smith');
        expect(html).toContain('123456');
        expect(html).toContain('This code expires in 15 minutes');
    });

    it('uses correct login URL for student, staff and admin', () => {
        const studentHtml = passwordResetEmailTemplate({
            ...baseData,
            userType: 'student'
        });
        const staffHtml = passwordResetEmailTemplate({
            ...baseData,
            userType: 'staff'
        });
        const adminHtml = passwordResetEmailTemplate({
            ...baseData,
            userType: 'admin'
        });

        expect(studentHtml).toContain('http://test.example.com/login');
        expect(staffHtml).toContain('http://test.example.com/staff/login');
        expect(adminHtml).toContain('http://test.example.com/admin/login');
    });

    it('includes support email from platformConfig', () => {
        const html = passwordResetEmailTemplate({
            ...baseData,
            userType: 'student'
        });

        expect(html).toContain('support@test.example.com');
    });
});

describe('passwordResetEmailSubject', () => {
    it('includes platform name in subject', () => {
        const subject = passwordResetEmailSubject();
        expect(subject).toContain('Test Platform');
    });
});

