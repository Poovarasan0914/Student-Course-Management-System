import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import sendEmail from './sendEmail';

const verifyMock = vi.fn();
const sendMailMock = vi.fn();

vi.mock('../../config/email', () => ({
    createTransporter: () => ({
        verify: verifyMock,
        sendMail: sendMailMock
    }),
    platformConfig: {
        name: 'Test Platform',
        url: 'http://test.example.com',
        supportEmail: 'support@test.example.com',
        logoUrl: ''
    }
}));

describe('sendEmail', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.resetAllMocks();
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    const baseOptions = {
        to: 'user@example.com',
        subject: 'Test Subject',
        html: '<p>Hello <strong>World</strong></p>'
    };

    it('returns error when email credentials are not configured', async () => {
        delete process.env.EMAIL_USER;
        delete process.env.EMAIL_PASSWORD;

        const result = await sendEmail(baseOptions);

        expect(result).toEqual({
            success: false,
            error: 'Email credentials not configured'
        });
        expect(verifyMock).not.toHaveBeenCalled();
        expect(sendMailMock).not.toHaveBeenCalled();
    });

    it('sends email successfully when credentials are configured', async () => {
        process.env.EMAIL_USER = 'test@test.example.com';
        process.env.EMAIL_PASSWORD = 'secret';

        verifyMock.mockResolvedValueOnce(undefined);
        sendMailMock.mockResolvedValueOnce({ messageId: 'abc123' });

        const result = await sendEmail(baseOptions);

        expect(verifyMock).toHaveBeenCalledTimes(1);
        expect(sendMailMock).toHaveBeenCalledTimes(1);
        expect(sendMailMock).toHaveBeenCalledWith(
            expect.objectContaining({
                from: `"Test Platform" <test@test.example.com>`,
                to: 'user@example.com',
                subject: 'Test Subject',
                html: baseOptions.html,
                text: expect.any(String)
            })
        );
        expect(result).toEqual({
            success: true,
            messageId: 'abc123'
        });
    });

    it('returns error result when transporter throws', async () => {
        process.env.EMAIL_USER = 'test@test.example.com';
        process.env.EMAIL_PASSWORD = 'secret';

        const error = new Error('SMTP failure');
        verifyMock.mockRejectedValueOnce(error);

        const result = await sendEmail(baseOptions);

        expect(verifyMock).toHaveBeenCalledTimes(1);
        expect(sendMailMock).not.toHaveBeenCalled();
        expect(result).toEqual({
            success: false,
            error: 'SMTP failure'
        });
    });
});

