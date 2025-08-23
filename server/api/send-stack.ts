import { Request, Response } from 'express';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.STACK_FROM_EMAIL || "noreply@advantaai.com";

interface StackPlan {
  summary: string;
  categories: Array<{
    category: string;
    picks: Array<{
      name: string;
      tier: string;
      why: string;
    }>;
  }>;
  estimatedMonthly: string;
  nextSteps: string[];
}

export async function sendStack(req: Request, res: Response) {
  // Health check for GET requests
  if (req.method === 'GET') {
    return res.json({
      ok: true,
      hasKey: !!process.env.RESEND_API_KEY,
      from: FROM_EMAIL,
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, business, email, plan, answers = {}, crm = { provider: "None" } } = req.body;

    // Validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    if (!plan || !plan.summary) {
      return res.status(400).json({ error: 'Plan data is required' });
    }

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: 'Missing RESEND_API_KEY environment variable' });
    }

    // Build email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Your Personalized AI Stack</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Built with Advanta AI's Stack Builder</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
          <p style="font-size: 16px; color: #333;">Hi ${name || "there"},</p>
          <p style="color: #666;">Here's your personalized AI infrastructure recommendation${business ? ` for <strong>${business}</strong>` : ""}.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937;">Executive Summary</h3>
            <pre style="white-space: pre-wrap; font-family: inherit; font-size: 14px; line-height: 1.5; margin: 0; color: #4b5563;">${plan.summary}</pre>
          </div>
          
          <div style="margin: 25px 0;">
            <h3 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Estimated Monthly Cost</h3>
            <p style="font-size: 20px; font-weight: bold; color: #059669; margin: 10px 0;">${plan.estimatedMonthly}</p>
            <p style="font-size: 12px; color: #6b7280;">*Actual costs may vary based on usage, data volume, and specific vendor pricing</p>
          </div>
          
          <h3 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Recommended Tools & Services</h3>
          ${plan.categories.map((category: any) => `
            <div style="margin: 20px 0;">
              <h4 style="color: #374151; font-size: 16px; margin: 15px 0 10px 0; display: flex; align-items: center;">
                <span style="background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 10px;">${category.category}</span>
              </h4>
              <div style="margin-left: 20px;">
                ${category.picks.slice(0, 3).map((pick: any) => `
                  <div style="border-left: 3px solid #e5e7eb; padding-left: 15px; margin: 10px 0;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 5px;">
                      <strong style="color: #1f2937; font-size: 14px;">${pick.name}</strong>
                      <span style="background: #f3f4f6; color: #374151; padding: 2px 6px; border-radius: 4px; font-size: 11px; white-space: nowrap; margin-left: 10px;">${pick.tier}</span>
                    </div>
                    <p style="color: #6b7280; font-size: 13px; margin: 0; line-height: 1.4;">${pick.why}</p>
                  </div>
                `).join('')}
                ${category.picks.length > 3 ? `<p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 15px;">+ ${category.picks.length - 3} additional options in your full report</p>` : ''}
              </div>
            </div>
          `).join('')}
          
          <div style="margin: 30px 0;">
            <h3 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Next Steps</h3>
            <ol style="color: #4b5563; line-height: 1.6;">
              ${plan.nextSteps.map((step: string) => `<li style="margin: 8px 0;">${step}</li>`).join('')}
            </ol>
          </div>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h4 style="color: #92400e; margin: 0 0 10px 0;">🚀 Ready to Implement?</h4>
            <p style="color: #92400e; margin: 0; font-size: 14px;">Our team can help you implement this AI stack in 7 days instead of 6+ months. <a href="https://calendly.com/advantaai/30min" style="color: #1d4ed8; text-decoration: none;">Book a free 30-minute strategy call</a> to discuss your implementation roadmap.</p>
          </div>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            This AI stack was generated by <a href="https://advantaai.com" style="color: #3b82f6; text-decoration: none;">Advanta AI</a><br>
            Questions? Reply to this email or visit our <a href="https://advantaai.com/help-support" style="color: #3b82f6; text-decoration: none;">support center</a>
          </p>
        </div>
      </div>
    `;

    // Send email via Resend
    const emailResult = await resend.emails.send({
      from: `AI Stack Builder <${FROM_EMAIL}>`,
      to: [email],
      subject: `Your Personalized AI Stack${business ? ` – ${business}` : ""}`,
      html: htmlContent,
    });

    if (emailResult.error) {
      console.error('Resend error:', emailResult.error);
      return res.status(500).json({ 
        error: 'Email delivery failed', 
        details: emailResult.error.message || 'Unknown email service error'
      });
    }

    // Optional: Add to CRM (non-blocking)
    try {
      if (crm.provider !== "None" && name && email) {
        // CRM integration would go here
        console.log(`CRM update skipped for ${crm.provider} - not implemented`);
      }
    } catch (crmError) {
      console.warn('CRM update failed:', crmError);
      // Don't fail the whole request for CRM issues
    }

    return res.json({ 
      ok: true, 
      id: emailResult.data?.id,
      message: 'AI stack sent successfully'
    });

  } catch (error: any) {
    console.error('Send stack error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message || 'Unknown error occurred'
    });
  }
}