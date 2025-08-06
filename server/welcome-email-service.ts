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
      console.error('Error details:', JSON.stringify(error, null, 2));
      return false;
    }

    console.log('Welcome email sent successfully to:', email);
    console.log('Email data:', JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

export async function sendWaitlistWelcomeEmail(email: string): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return false;
    }

    console.log(`Sending waitlist welcome email to: ${email}`);

    const { data, error } = await resend.emails.send({
      from: 'Advanta AI <hello@advanta-ai.com>',
      to: email,
      subject: 'You\'re In! Exclusive Client Suite Portal Access',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to the Exclusive List - Advanta AI</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
            }
            .container {
              background: white;
              border-radius: 16px;
              padding: 40px;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              background: linear-gradient(135deg, #3b82f6, #8b5cf6);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 10px;
            }
            .crown-emoji {
              font-size: 48px;
              margin-bottom: 20px;
            }
            .welcome-title {
              font-size: 32px;
              font-weight: 700;
              color: #1e293b;
              margin-bottom: 15px;
            }
            .subtitle {
              font-size: 18px;
              color: #64748b;
              margin-bottom: 30px;
            }
            .exclusive-badge {
              background: linear-gradient(135deg, #f59e0b, #f97316);
              color: white;
              padding: 8px 20px;
              border-radius: 25px;
              font-weight: 600;
              font-size: 14px;
              display: inline-block;
              margin-bottom: 20px;
            }
            .content {
              margin-bottom: 30px;
            }
            .benefits-list {
              background: #f8fafc;
              border-radius: 12px;
              padding: 25px;
              margin: 20px 0;
              border-left: 4px solid #3b82f6;
            }
            .benefits-list h3 {
              color: #1e293b;
              margin-bottom: 15px;
              font-size: 20px;
            }
            .benefit-item {
              display: flex;
              align-items: center;
              margin-bottom: 12px;
              padding: 8px 0;
            }
            .benefit-icon {
              color: #3b82f6;
              margin-right: 12px;
              font-weight: bold;
            }
            .cta-section {
              background: linear-gradient(135deg, #3b82f6, #8b5cf6);
              color: white;
              padding: 30px;
              border-radius: 12px;
              text-align: center;
              margin: 30px 0;
            }
            .cta-title {
              font-size: 24px;
              font-weight: 700;
              margin-bottom: 15px;
            }
            .cta-text {
              font-size: 16px;
              margin-bottom: 20px;
              opacity: 0.9;
            }
            .stats {
              display: flex;
              justify-content: space-around;
              margin: 25px 0;
              padding: 20px;
              background: #f1f5f9;
              border-radius: 12px;
            }
            .stat {
              text-align: center;
            }
            .stat-number {
              font-size: 24px;
              font-weight: bold;
              color: #3b82f6;
            }
            .stat-label {
              font-size: 12px;
              color: #64748b;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              color: #64748b;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Advanta AI</div>
              <div class="crown-emoji">👑</div>
              <div class="exclusive-badge">EXCLUSIVE ACCESS</div>
              <h1 class="welcome-title">You're In!</h1>
              <p class="subtitle">Welcome to the Client Suite Portal exclusive waitlist</p>
            </div>

            <div class="content">
              <p>Congratulations! You've secured your spot on the exclusive waitlist for Advanta AI's premium Client Suite Portal.</p>
              
              <div class="benefits-list">
                <h3>What You've Gained Access To:</h3>
                <div class="benefit-item">
                  <span class="benefit-icon">⚡</span>
                  <span>Priority access when we launch (within 7 days)</span>
                </div>
                <div class="benefit-item">
                  <span class="benefit-icon">✨</span>
                  <span>Exclusive preview of premium features</span>
                </div>
                <div class="benefit-item">
                  <span class="benefit-icon">🎯</span>
                  <span>Special founding member pricing (up to 50% off)</span>
                </div>
                <div class="benefit-item">
                  <span class="benefit-icon">🚀</span>
                  <span>Dedicated success manager for implementation</span>
                </div>
                <div class="benefit-item">
                  <span class="benefit-icon">🔒</span>
                  <span>Enterprise-grade security and compliance</span>
                </div>
              </div>

              <div class="stats">
                <div class="stat">
                  <div class="stat-number">200+</div>
                  <div class="stat-label">Businesses Automated</div>
                </div>
                <div class="stat">
                  <div class="stat-number">89%</div>
                  <div class="stat-label">Average ROI Improvement</div>
                </div>
                <div class="stat">
                  <div class="stat-number">7 Days</div>
                  <div class="stat-label">Until Launch</div>
                </div>
              </div>

              <div class="cta-section">
                <h3 class="cta-title">What Happens Next?</h3>
                <p class="cta-text">
                  Keep an eye on your inbox over the next 7 days. You'll be among the first to know when the Client Suite Portal goes live, and you'll receive exclusive onboarding materials to help you maximize your AI automation success.
                </p>
              </div>

              <p>Questions? Simply reply to this email and our team will get back to you within 24 hours.</p>
            </div>

            <div class="footer">
              <p>This email was sent to you because you joined the exclusive waitlist for Advanta AI's Client Suite Portal.</p>
              <p>© 2025 Advanta AI. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send waitlist welcome email:', error);
      return false;
    }

    console.log(`✓ Waitlist welcome email sent successfully to ${email}`);
    return true;

  } catch (error) {
    console.error('Error sending waitlist welcome email:', error);
    return false;
  }
}

export async function sendMarketplaceWelcomeEmail(email: string): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return false;
    }

    console.log(`Sending marketplace welcome email to: ${email}`);

    const { data, error } = await resend.emails.send({
      from: 'Advanta AI <hello@advanta-ai.com>',
      to: email,
      subject: '🚀 You\'re First in Line for the AI Marketplace Revolution!',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to AI Marketplace - Advanta AI</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              border-radius: 16px;
              padding: 40px;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              background: linear-gradient(135deg, #667eea, #764ba2);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 10px;
            }
            .rocket-emoji {
              font-size: 48px;
              margin-bottom: 20px;
            }
            .exclusive-badge {
              background: linear-gradient(135deg, #ff6b6b, #ffa726);
              color: white;
              padding: 8px 20px;
              border-radius: 25px;
              font-weight: 600;
              font-size: 14px;
              display: inline-block;
              margin-bottom: 20px;
            }
            .welcome-title {
              font-size: 32px;
              font-weight: 700;
              color: #1e293b;
              margin-bottom: 15px;
            }
            .subtitle {
              font-size: 18px;
              color: #64748b;
              margin-bottom: 30px;
            }
            .content {
              margin-bottom: 30px;
            }
            .features-list {
              background: #f8fafc;
              border-radius: 12px;
              padding: 25px;
              margin: 20px 0;
              border-left: 4px solid #667eea;
            }
            .features-list h3 {
              color: #1e293b;
              margin-bottom: 15px;
              font-size: 20px;
            }
            .feature-item {
              display: flex;
              align-items: center;
              margin-bottom: 12px;
              padding: 8px 0;
            }
            .feature-icon {
              color: #667eea;
              margin-right: 12px;
              font-weight: bold;
            }
            .timeline-section {
              background: linear-gradient(135deg, #667eea, #764ba2);
              color: white;
              padding: 30px;
              border-radius: 12px;
              text-align: center;
              margin: 30px 0;
            }
            .timeline-title {
              font-size: 24px;
              font-weight: 700;
              margin-bottom: 15px;
            }
            .timeline-text {
              font-size: 16px;
              margin-bottom: 20px;
              opacity: 0.9;
            }
            .stats {
              display: flex;
              justify-content: space-around;
              margin: 25px 0;
              padding: 20px;
              background: #f1f5f9;
              border-radius: 12px;
            }
            .stat {
              text-align: center;
            }
            .stat-number {
              font-size: 24px;
              font-weight: bold;
              color: #667eea;
            }
            .stat-label {
              font-size: 12px;
              color: #64748b;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              color: #64748b;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Advanta AI</div>
              <div class="rocket-emoji">🚀</div>
              <div class="exclusive-badge">FIRST IN LINE</div>
              <h1 class="welcome-title">Welcome to History!</h1>
              <p class="subtitle">You're part of the world's first AI marketplace launch</p>
            </div>

            <div class="content">
              <p>Congratulations! You've secured early access to the world's first comprehensive AI marketplace. This isn't just another platform – it's the beginning of a new era in business automation.</p>
              
              <div class="features-list">
                <h3>What You'll Get First Access To:</h3>
                <div class="feature-item">
                  <span class="feature-icon">🤖</span>
                  <span>10,000+ pre-built AI agents ready for instant deployment</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">⚡</span>
                  <span>Drag-and-drop workflow builder with AI integrations</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">💰</span>
                  <span>Marketplace to buy, sell, and monetize AI solutions</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">🏢</span>
                  <span>Enterprise-grade security and compliance</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">📊</span>
                  <span>Advanced analytics and ROI tracking</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">🎯</span>
                  <span>Founding member pricing (up to 60% off regular rates)</span>
                </div>
              </div>

              <div class="stats">
                <div class="stat">
                  <div class="stat-number">500+</div>
                  <div class="stat-label">AI Agents Ready</div>
                </div>
                <div class="stat">
                  <div class="stat-number">50+</div>
                  <div class="stat-label">Industry Categories</div>
                </div>
                <div class="stat">
                  <div class="stat-number">Q2 2025</div>
                  <div class="stat-label">Launch Window</div>
                </div>
              </div>

              <div class="timeline-section">
                <h3 class="timeline-title">What Happens Next?</h3>
                <p class="timeline-text">
                  Over the next few weeks, you'll receive exclusive updates on our progress, sneak peeks of the platform, and early access invitations as we approach launch. You're literally witnessing the birth of the AI marketplace industry.
                </p>
              </div>

              <p>Want to learn more about what we're building? Check out our <a href="https://advanta-ai.com/marketplace" style="color: #667eea;">marketplace preview page</a> or reply to this email with any questions.</p>
            </div>

            <div class="footer">
              <p>This email was sent to you because you signed up for early access to the world's first AI marketplace.</p>
              <p>© 2025 Advanta AI. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send marketplace welcome email:', error);
      return false;
    }

    console.log(`✓ Marketplace welcome email sent successfully to ${email}`);
    return true;

  } catch (error) {
    console.error('Error sending marketplace welcome email:', error);
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