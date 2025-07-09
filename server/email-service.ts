import nodemailer from 'nodemailer';

// Email service for sending password reset emails
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Use Gmail SMTP with app-specific password
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'D.s.demango@gmail.com',
        pass: process.env.EMAIL_PASS || 'admin1',
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string, domain: string): Promise<boolean> {
    try {
      const resetUrl = `https://${domain}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'D.s.demango@gmail.com',
        to: email,
        subject: 'Reset Your Advanta AI Password',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background-color: #f8fafc; }
              .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
              .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
              .content { padding: 40px 30px; }
              .button { display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
              .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Advanta AI</h1>
              </div>
              <div class="content">
                <h2>Reset Your Password</h2>
                <p>We received a request to reset your password for your Advanta AI account.</p>
                <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
                <a href="${resetUrl}" class="button">Reset Password</a>
                <p>If you didn't request this password reset, you can safely ignore this email.</p>
                <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
                  If the button doesn't work, copy and paste this link into your browser:<br>
                  <span style="word-break: break-all;">${resetUrl}</span>
                </p>
              </div>
              <div class="footer">
                <p>© 2025 Advanta AI. All rights reserved.</p>
                <p>If you have questions, contact us at support@advanta-ai.com</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully:', { 
        to: email, 
        messageId: result.messageId,
        accepted: result.accepted,
        rejected: result.rejected 
      });
      return true;
    } catch (error: any) {
      console.error('Failed to send password reset email:', {
        error: error.message,
        code: error.code,
        response: error.response,
        command: error.command,
        to: email
      });
      return false;
    }
  }
}

export const emailService = new EmailService();