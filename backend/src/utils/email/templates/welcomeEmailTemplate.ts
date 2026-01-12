import { platformConfig } from '../../../config/email';

interface WelcomeEmailData {
    firstName: string;
    lastName: string;
    email: string;
    userType: 'student' | 'staff';
}

export const welcomeEmailTemplate = (data: WelcomeEmailData): string => {
    const { firstName, lastName, userType } = data;
    const fullName = `${firstName} ${lastName}`;
    const loginUrl = userType === 'staff'
        ? `${platformConfig.url}/staff/login`
        : `${platformConfig.url}/login`;
    const dashboardText = userType === 'staff'
        ? 'manage courses and track student progress'
        : 'explore courses, enroll in programs, and track your learning journey';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ${platformConfig.name}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                                🎓 ${platformConfig.name}
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Welcome Message -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px; font-weight: 600;">
                                Welcome aboard, ${fullName}! 🎉
                            </h2>
                            
                            <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                                We're thrilled to have you join our learning community as a <strong>${userType}</strong>! 
                                Your account has been successfully created, and you're all set to begin your journey with us.
                            </p>
                            
                            <p style="margin: 0 0 30px; color: #555555; font-size: 16px; line-height: 1.6;">
                                With your new account, you can now ${dashboardText}.
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td align="center">
                                        <a href="${loginUrl}" 
                                           style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                                            Login to Your Account
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Getting Started Section -->
                            <div style="margin-top: 40px; padding: 25px; background-color: #f8f9fc; border-radius: 8px; border-left: 4px solid #667eea;">
                                <h3 style="margin: 0 0 15px; color: #333333; font-size: 18px; font-weight: 600;">
                                    🚀 Getting Started
                                </h3>
                                <ul style="margin: 0; padding: 0 0 0 20px; color: #555555; font-size: 14px; line-height: 2;">
                                    ${userType === 'student' ? `
                                    <li>Browse our extensive course catalog</li>
                                    <li>Enroll in courses that match your interests</li>
                                    <li>Track your learning progress</li>
                                    <li>Connect with expert instructors</li>
                                    ` : `
                                    <li>Create and manage your courses</li>
                                    <li>Track student enrollments and progress</li>
                                    <li>Engage with your students</li>
                                    <li>Build your teaching portfolio</li>
                                    `}
                                </ul>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f8f9fc; border-radius: 0 0 12px 12px; text-align: center;">
                            <p style="margin: 0 0 10px; color: #888888; font-size: 14px;">
                                Need help? Contact us at 
                                <a href="mailto:${platformConfig.supportEmail}" style="color: #667eea; text-decoration: none;">
                                    ${platformConfig.supportEmail}
                                </a>
                            </p>
                            <p style="margin: 0; color: #aaaaaa; font-size: 12px;">
                                © ${new Date().getFullYear()} ${platformConfig.name}. All rights reserved.
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

export const welcomeEmailSubject = (userType: 'student' | 'staff'): string => {
    return `Welcome to ${platformConfig.name}! Your ${userType} account is ready 🎓`;
};
