import { describe, it, expect, vi } from 'vitest';
import {
    enrollmentEmailTemplate,
    enrollmentEmailSubject
} from './enrollmentEmailTemplate';

vi.mock('../../../config/email', () => ({
    platformConfig: {
        name: 'Test Platform',
        url: 'http://test.example.com',
        supportEmail: 'support@test.example.com',
        logoUrl: ''
    }
}));

describe('enrollmentEmailTemplate', () => {
    const baseData = {
        studentName: 'Alice Johnson',
        studentEmail: 'alice@example.com',
        courseTitle: 'Advanced Node.js',
        courseInstructor: 'Dr. Backend',
        courseDuration: '10h 30m',
        enrollmentDate: new Date('2024-01-15T00:00:00Z')
    };

    it('includes student name and course details', () => {
        // Avoid depending on locale-specific formatting by mocking toLocaleDateString
        const dateSpy = vi
            .spyOn(Date.prototype, 'toLocaleDateString')
            .mockReturnValue('Monday, January 15, 2024');

        const html = enrollmentEmailTemplate(baseData);

        expect(html).toContain('Alice Johnson');
        expect(html).toContain('Advanced Node.js');
        expect(html).toContain('Dr. Backend');
        expect(html).toContain('10h 30m');
        expect(html).toContain('Monday, January 15, 2024');

        dateSpy.mockRestore();
    });

    it('includes dashboard URL and support email', () => {
        const html = enrollmentEmailTemplate(baseData);

        expect(html).toContain('http://test.example.com/dashboard');
        expect(html).toContain('support@test.example.com');
    });
});

describe('enrollmentEmailSubject', () => {
    it('includes course title and platform name in subject', () => {
        const subject = enrollmentEmailSubject('Advanced Node.js');
        expect(subject).toContain('Advanced Node.js');
        expect(subject).toContain('Test Platform');
    });
});

