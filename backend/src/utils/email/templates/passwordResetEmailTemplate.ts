import { platformConfig } from '../../../config/email';

interface PasswordResetEmailData {
    firstName: string;
    lastName: string;
    email: string;
    resetCode: string;
    expiryMinutes: number;
    userType: 'student' | 'staff' | 'admin';
}

export const passwordResetEmailTemplate = (data: PasswordResetEmailData): string => {
    const { firstName, lastName, resetCode, expiryMinutes, userType } = data;
    const fullName = `${firstName} ${lastName}`;
    const loginUrl = userType === 'admin'
        ? `${platformConfig.url}/admin/login`
        : userType === 'staff'
            ? `${platformConfig.url}/staff/login`
            : `${platformConfig.url}/login`;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - ${platformConfig.name}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); border-radius: 12px 12px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                                🔐 ${platformConfig.name}
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px; font-weight: 600;">
                                Password Reset Request
                            </h2>
                            
                            <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                                Hi ${fullName},
                            </p>
                            
                            <p style="margin: 0 0 25px; color: #555555; font-size: 16px; line-height: 1.6;">
                                We received a request to reset your password for your ${userType} account. 
                                Use the verification code below to reset your password:
                            </p>
                            
                            <!-- OTP Code Box -->
                            <div style="text-align: center; margin: 30px 0;">
                                <div style="display: inline-block; padding: 20px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                                    <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #ffffff; font-family: 'Courier New', monospace;">
                                        ${resetCode}
                                    </span>
                                </div>
                            </div>
                            
                            <!-- Expiry Warning -->
                            <div style="text-align: center; margin: 25px 0;">
                                <p style="margin: 0; color: #e74c3c; font-size: 14px; font-weight: 600;">
                                    ⏰ This code expires in ${expiryMinutes} minutes
                                </p>
                            </div>
                            
                            <!-- Security Warning -->
                            <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
                                <h3 style="margin: 0 0 12px; color: #856404; font-size: 16px; font-weight: 600;">
                                    ⚠️ Security Notice
                                </h3>
                                <ul style="margin: 0; padding: 0 0 0 20px; color: #856404; font-size: 14px; line-height: 1.8;">
                                    <li>Never share this code with anyone</li>
                                    <li>Our team will never ask for your password or this code</li>
                                    <li>If you didn't request this reset, please ignore this email</li>
                                    <li>Your password won't change until you create a new one</li>
                                </ul>
                            </div>
                            
                            <!-- Didn't Request Section -->
                            <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fc; border-radius: 8px;">
                                <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                    <strong>Didn't request this?</strong><br>
                                    If you didn't request a password reset, you can safely ignore this email. 
                                    Your account is secure, and no changes have been made.
                                </p>
                            </div>
                            
                            <!-- Login Link -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 30px;">
                                <tr>
                                    <td align="center">
                                        <a href="${loginUrl}" 
                                           style="display: inline-block; padding: 14px 35px; background-color: #f8f9fc; color: #667eea; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 8px; border: 2px solid #667eea;">
                                            Back to Login
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f8f9fc; border-radius: 0 0 12px 12px; text-align: center;">
                            <p style="margin: 0 0 10px; color: #888888; font-size: 14px;">
                                Need help? Contact us at 
                                <a href="mailto:${platformConfig.supportEmail}" style="color: #e74c3c; text-decoration: none;">
                                    ${platformConfig.supportEmail}
                                </a>
                            </p>
                            <p style="margin: 0; color: #aaaaaa; font-size: 12px;">
                                © ${new Date().getFullYear()} ${platformConfig.name}. All rights reserved.
                            </p>
                            <p style="margin: 10px 0 0; color: #cccccc; font-size: 11px;">
                                This is an automated message. Please do not reply directly to this email.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
};

export const passwordResetEmailSubject = (): string => {
    return `🔐 Password Reset Code - ${platformConfig.name}`;
};
