import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn('[Warning]: RESEND_API_KEY is not defined in your environment variables.');
}

const resend = new Resend(process.env.RESEND_API_KEY || 'fake_key_to_prevent_crash');

export async function sendWelcomeEmail(to: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050505; color: #ffffff; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #ffffff; text-decoration: none; display: block; margin-bottom: 40px; }
        .logo span { color: #1dbf73; }
        .card { background-color: #111111; border: 1px solid #222222; border-radius: 12px; padding: 40px; }
        h1 { font-size: 28px; font-weight: 800; margin-bottom: 16px; letter-spacing: -0.5px; }
        p { font-size: 16px; line-height: 1.6; color: #aaaaaa; margin-bottom: 24px; }
        .button { display: inline-block; background-color: #1dbf73; color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; margin-top: 8px; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #444444; }
      </style>
    </head>
    <body>
      <div class="container">
        <a href="https://clientgravity.ai" class="logo">ClientGravity<span>AI</span></a>
        <div class="card">
          <h1>Welcome to the Gravity Well, ${name}!</h1>
          <p>We're thrilled to have you here. ClientGravity AI is designed to help you stop hunting for clients and start attracting them with high-fidelity, AI-powered proposals.</p>
          <p>Your profile is ready. Let's find your first high-ticket lead today.</p>
          <a href="https://clientgravity.ai/app/leads" class="button">Find Leads Now</a>
        </div>
        <div class="footer">
          &copy; 2026 ClientGravity AI. All rights reserved.<br>
          If you didn't sign up for this account, please ignore this email.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'ClientGravity AI <chinmay@payfordeal.com>', 
      to: [to],
      subject: 'Welcome to ClientGravity AI!',
      html: html,
    });

    if (error) {
      console.error('[Resend Error]:', error);
      return { success: false, error };
    }

    console.log('[Resend Success]: Email sent to', to, 'ID:', data?.id);
    return { success: true, data };
  } catch (err) {
    console.error('[Resend Exception]:', err);
    return { success: false, error: err };
  }
}

export async function sendLeadNotificationEmail(to: string, leadTitle: string, leadUrl: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050505; color: #ffffff; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #ffffff; text-decoration: none; display: block; margin-bottom: 40px; }
        .logo span { color: #1dbf73; }
        .card { background-color: #111111; border: 1px solid #222222; border-radius: 12px; padding: 40px; }
        .tag { display: inline-block; background-color: rgba(29, 191, 115, 0.1); color: #1dbf73; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
        h1 { font-size: 24px; font-weight: 700; margin-bottom: 12px; }
        p { font-size: 15px; line-height: 1.5; color: #aaaaaa; margin-bottom: 24px; }
        .button { display: inline-block; background-color: #ffffff; color: #000000; padding: 12px 24px; border-radius: 6px; font-weight: 700; text-decoration: none; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #444444; }
      </style>
    </head>
    <body>
      <div class="container">
        <a href="https://clientgravity.ai" class="logo">ClientGravity<span>AI</span></a>
        <div class="card">
          <div class="tag">New High-Match Lead</div>
          <h1>${leadTitle}</h1>
          <p>A new lead matching your skills was just posted. Our AI suggests you act fast to secure this opportunity.</p>
          <a href="${leadUrl}" class="button">View Lead & Generate Proposal</a>
        </div>
        <div class="footer">
          You received this because you have "Immediate Alerts" enabled in your settings.
        </div>
      </div>
    </body>
    </html>
  `;

  return await resend.emails.send({
    from: 'ClientGravity AI <chinmay@payfordeal.com>',
    to: [to],
    subject: `New Lead: ${leadTitle}`,
    html: html,
  });
}
