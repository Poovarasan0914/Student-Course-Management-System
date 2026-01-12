import { platformConfig } from '../../../config/email';

interface EnrollmentEmailData {
    studentName: string;
    studentEmail: string;
    courseTitle: string;
    courseInstructor: string;
    courseLevel: string;
    courseDuration: string;
    enrollmentDate: Date;
}

export const enrollmentEmailTemplate = (data: EnrollmentEmailData): string => {
    const {
        studentName,
        courseTitle,
        courseInstructor,
        courseLevel,
        courseDuration,
        enrollmentDate
    } = data;

    const dashboardUrl = `${platformConfig.url}/dashboard`;
    const formattedDate = enrollmentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enrollment Confirmation - ${platformConfig.name}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border-radius: 12px 12px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                                🎓 ${platformConfig.name}
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Success Badge -->
                    <tr>
                        <td style="padding: 30px 40px 0; text-align: center;">
                            <div style="display: inline-block; padding: 12px 24px; background-color: #d4edda; border-radius: 25px;">
                                <span style="color: #155724; font-size: 16px; font-weight: 600;">
                                    ✅ Enrollment Confirmed!
                                </span>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 30px 40px;">
                            <h2 style="margin: 0 0 20px; color: #333333; font-size: 22px; font-weight: 600;">
                                Congratulations, ${studentName}! 🎉
                            </h2>
                            
                            <p style="margin: 0 0 25px; color: #555555; font-size: 16px; line-height: 1.6;">
                                You've successfully enrolled in a new course! Here are your enrollment details:
                            </p>
                            
                            <!-- Course Details Card -->
                            <div style="padding: 25px; background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%); border-radius: 12px; border: 1px solid #e0e0e0;">
                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                                            <span style="color: #888888; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Course Title</span>
                                            <p style="margin: 5px 0 0; color: #333333; font-size: 18px; font-weight: 600;">${courseTitle}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 15px 0; border-bottom: 1px solid #e0e0e0;">
                                            <span style="color: #888888; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Instructor</span>
                                            <p style="margin: 5px 0 0; color: #333333; font-size: 16px; font-weight: 500;">👨‍🏫 ${courseInstructor}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 15px 0; border-bottom: 1px solid #e0e0e0;">
                                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                <tr>
                                                    <td style="width: 50%;">
                                                        <span style="color: #888888; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Level</span>
                                                        <p style="margin: 5px 0 0; color: #333333; font-size: 15px;">📊 ${courseLevel}</p>
                                                    </td>
                                                    <td style="width: 50%;">
                                                        <span style="color: #888888; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Duration</span>
                                                        <p style="margin: 5px 0 0; color: #333333; font-size: 15px;">⏱️ ${courseDuration}</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 15px 0 5px;">
                                            <span style="color: #888888; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Enrollment Date</span>
                                            <p style="margin: 5px 0 0; color: #333333; font-size: 15px;">📅 ${formattedDate}</p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 30px;">
                                <tr>
                                    <td align="center">
                                        <a href="${dashboardUrl}" 
                                           style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; box-shadow: 0 4px 15px rgba(17, 153, 142, 0.4);">
                                            Go to Dashboard
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Tips Section -->
                            <div style="margin-top: 35px; padding: 20px; background-color: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
                                <h3 style="margin: 0 0 12px; color: #856404; font-size: 16px; font-weight: 600;">
                                    💡 Quick Tips to Get Started
                                </h3>
                                <ul style="margin: 0; padding: 0 0 0 20px; color: #856404; font-size: 14px; line-height: 1.8;">
                                    <li>Visit your dashboard to access course materials</li>
                                    <li>Check out the course curriculum and plan your schedule</li>
                                    <li>Reach out to your instructor if you have questions</li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f8f9fc; border-radius: 0 0 12px 12px; text-align: center;">
                            <p style="margin: 0 0 10px; color: #888888; font-size: 14px;">
                                Questions about your enrollment? Contact us at 
                                <a href="mailto:${platformConfig.supportEmail}" style="color: #11998e; text-decoration: none;">
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

export const enrollmentEmailSubject = (courseTitle: string): string => {
    return `🎓 Enrollment Confirmed: ${courseTitle} - ${platformConfig.name}`;
};
