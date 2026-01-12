import { createTransporter, platformConfig } from '../../config/email';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

interface EmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

/**
 * Send an email using the configured transporter
 * @param options - Email options including recipient, subject, and content
 * @returns Promise with success status and message ID or error
 */
export const sendEmail = async (options: EmailOptions): Promise<EmailResult> => {
    console.log(`[EMAIL] Attempting to send email to: ${options.to}`);

    try {
        // Check if email credentials are configured
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            console.warn('[EMAIL] Email credentials not configured. Skipping email send.');
            console.warn('[EMAIL] Please set EMAIL_USER and EMAIL_PASSWORD in .env file');
            return {
                success: false,
                error: 'Email credentials not configured'
            };
        }

        console.log(`[EMAIL] Using email account: ${process.env.EMAIL_USER}`);

        const transporter = createTransporter();

        // Verify transporter configuration
        console.log('[EMAIL] Verifying SMTP connection...');
        await transporter.verify();
        console.log('[EMAIL] SMTP connection verified successfully');

        const mailOptions = {
            from: `"${platformConfig.name}" <${process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text || stripHtml(options.html)
        };

        console.log(`[EMAIL] Sending email with subject: ${options.subject}`);
        const info = await transporter.sendMail(mailOptions);

        console.log(`[EMAIL] ✅ Email sent successfully to ${options.to}. Message ID: ${info.messageId}`);

        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(`[EMAIL] ❌ Failed to send email to ${options.to}:`, errorMessage);

        // Log more details for debugging
        if (error instanceof Error && error.stack) {
            console.error('[EMAIL] Stack trace:', error.stack);
        }

        return {
            success: false,
            error: errorMessage
        };
    }
};

/**
 * Strip HTML tags from content to create plain text version
 * @param html - HTML content
 * @returns Plain text content
 */
const stripHtml = (html: string): string => {
    return html
        .replace(/<style[^>]*>.*<\/style>/gi, '')
        .replace(/<script[^>]*>.*<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
};

export default sendEmail;
