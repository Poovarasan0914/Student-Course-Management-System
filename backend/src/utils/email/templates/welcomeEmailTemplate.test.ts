import { describe, it, expect, vi } from 'vitest';
import { welcomeEmailTemplate, welcomeEmailSubject } from './welcomeEmailTemplate';

vi.mock('../../../config/email', () => ({
    platformConfig: {
        name: 'Test Platform',
        url: 'http://test.example.com',
        supportEmail: 'support@test.example.com',
        logoUrl: ''
    }
}));

describe('welcomeEmailTemplate', () => {
    const baseData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
    };

    it('includes full name and student login URL for student users', () => {
        const html = welcomeEmailTemplate({
            ...baseData,
            userType: 'student'
        });

        expect(html).toContain('John Doe');
        expect(html).toContain('Welcome aboard, John Doe!');
        expect(html).toContain('http://test.example.com/login');
    });

    it('includes staff login URL and staff dashboard text for staff users', () => {
        const html = welcomeEmailTemplate({
            ...baseData,
            userType: 'staff'
        });

        expect(html).toContain('http://test.example.com/staff/login');
        expect(html).toContain('manage courses and track student progress');
    });

    it('includes support email from platformConfig', () => {
        const html = welcomeEmailTemplate({
            ...baseData,
            userType: 'student'
        });

        expect(html).toContain('support@test.example.com');
    });
});

describe('welcomeEmailSubject', () => {
    it('generates subject for student users', () => {
        const subject = welcomeEmailSubject('student');
        expect(subject).toContain('Test Platform');
        expect(subject.toLowerCase()).toContain('student');
    });

    it('generates subject for staff users', () => {
        const subject = welcomeEmailSubject('staff');
        expect(subject).toContain('Test Platform');
        expect(subject.toLowerCase()).toContain('staff');
    });
});

