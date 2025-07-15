import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return false;
    }

    // Domain is now verified at Resend - emails can be sent to all subscribers
    console.log(`Sending welcome email to: ${email}`);

    const { data, error } = await resend.emails.send({
      from: 'Advanta AI <hello@advanta-ai.com>',
      to: email,
      subject: 'Welcome to Advanta AI - Your AI Journey Starts Here!',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Advanta AI</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8fafc;
            }
            .container {
              background: white;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            .welcome-title {
              font-size: 28px;
              font-weight: 700;
              color: #1e293b;
              margin-bottom: 15px;
            }
            .subtitle {
              font-size: 16px;
              color: #64748b;
              margin-bottom: 30px;
            }
            .content {
              margin-bottom: 30px;
            }
            .feature-list {
              background: #f1f5f9;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .feature-list h3 {
              color: #2563eb;
              margin-bottom: 15px;
            }
            .feature-list ul {
              list-style: none;
              padding: 0;
            }
            .feature-list li {
              padding: 8px 0;
              border-bottom: 1px solid #e2e8f0;
            }
            .feature-list li:last-child {
              border-bottom: none;
            }
            .feature-list li::before {
              content: "✓";
              color: #10b981;
              font-weight: bold;
              margin-right: 10px;
            }
            .cta-button {
              display: inline-block !important;
              background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
              color: white !important;
              padding: 15px 30px !important;
              text-decoration: none !important;
              border-radius: 8px !important;
              font-weight: 600 !important;
              text-align: center !important;
              margin: 20px 0 !important;
              border: none !important;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              text-align: center;
              font-size: 14px;
              color: #64748b;
            }
            .social-links {
              margin: 20px 0;
            }
            .social-links a {
              display: inline-block;
              margin: 0 10px;
              color: #2563eb;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Advanta AI</div>
              <h1 class="welcome-title">Welcome to the Future of AI!</h1>
              <p class="subtitle">You're now part of an exclusive community of AI innovators</p>
            </div>
            
            <div class="content">
              <p>Hi there,</p>
              <p>Welcome to Advanta AI! We're thrilled to have you join our community of forward-thinking businesses and AI enthusiasts.</p>
              
              <div class="feature-list">
                <h3>What You'll Get:</h3>
                <ul>
                  <li>Daily AI insights and industry trends</li>
                  <li>Exclusive access to cutting-edge AI tools</li>
                  <li>Expert analysis on AI automation strategies</li>
                  <li>Case studies from successful AI implementations</li>
                  <li>Early access to new features and resources</li>
                </ul>
              </div>
              
              <p>To get you started, here's your first AI blog post that's generating buzz in the industry:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://advanta-ai.com/blog" 
                   style="display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; margin: 20px 0; transition: transform 0.2s;">
                  Read Latest AI Insights
                </a>
              </div>
              
              <p>You can also explore our free AI tools and resources:</p>
              <ul style="list-style: none; padding: 0;">
                <li style="margin: 10px 0;"><a href="https://advanta-ai.com/free-tools" style="color: #2563eb; text-decoration: none; font-weight: 500;">Free AI Tools Collection</a></li>
                <li style="margin: 10px 0;"><a href="https://advanta-ai.com/resources" style="color: #2563eb; text-decoration: none; font-weight: 500;">AI Resources Library</a></li>
                <li style="margin: 10px 0;"><a href="https://advanta-ai.com/case-studies" style="color: #2563eb; text-decoration: none; font-weight: 500;">Success Stories</a></li>
              </ul>
              
              <p>Have questions? Simply reply to this email - we'd love to hear from you!</p>
              
              <p>Best regards,<br>
              <strong>The Advanta AI Team</strong></p>
            </div>
            
            <div class="footer">
              <div class="social-links">
                <a href="#">LinkedIn</a>
                <a href="#">Twitter</a>
                <a href="#">GitHub</a>
              </div>
              <p>© 2025 Advanta AI. All rights reserved.</p>
              <p>You're receiving this because you subscribed to our newsletter.</p>
              <p><a href="https://advanta-ai.com/api/newsletter/unsubscribe" style="color: #64748b; text-decoration: none;">Unsubscribe</a></p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Resend email error:', error);
      return false;
    }

    console.log('Welcome email sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

export async function sendTestEmail(email: string): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return false;
    }

    const { data, error } = await resend.emails.send({
      from: 'Advanta AI <hello@advanta-ai.com>',
      to: email,
      subject: 'Test Email from Advanta AI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb;">Test Email</h1>
          <p>This is a test email from Advanta AI to verify the email service is working correctly.</p>
          <p>If you received this email, the Resend integration is working perfectly!</p>
          <p>Best regards,<br>The Advanta AI Team</p>
        </div>
      `
    });

    if (error) {
      console.error('Resend test email error:', error);
      return false;
    }

    console.log('Test email sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('Error sending test email:', error);
    return false;
  }
}