import nodemailer from 'nodemailer';
import { env } from '../config/env';

let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
    if (!transporter) {
        if (env.RESEND_API_KEY) {
            // Use Resend SMTP
            transporter = nodemailer.createTransport({
                host: 'smtp.resend.com',
                port: 465,
                secure: true,
                auth: { user: 'resend', pass: env.RESEND_API_KEY },
            });
        } else {
            // Fallback: Ethereal (test email)
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: { user: 'ethereal_user', pass: 'ethereal_pass' },
            });
            console.warn('⚠️  No email service configured. Emails will be logged only.');
        }
    }
    return transporter;
};

const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
    if (!env.RESEND_API_KEY) {
        console.log(`📧 [Email Mock] To: ${to} | Subject: ${subject}`);
        return;
    }

    try {
        await getTransporter().sendMail({
            from: `"InternTracker AI" <${env.FROM_EMAIL}>`,
            to,
            subject,
            html,
        });
    } catch (err) {
        console.error('Email send error:', err);
    }
};

export const sendWelcomeEmail = async (name: string, email: string): Promise<void> => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; background: #0a0a0f; color: #fff; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(99,102,241,0.3);">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #6366f1; font-size: 28px; margin: 0;">🚀 InternTracker AI</h1>
          <p style="color: rgba(255,255,255,0.6); margin: 8px 0 0;">Your AI-Powered Internship Platform</p>
        </div>
        <h2 style="color: #fff; margin-bottom: 16px;">Welcome aboard, ${name}! 🎉</h2>
        <p style="color: rgba(255,255,255,0.8); line-height: 1.7;">
          You've successfully joined <strong>InternTracker AI</strong> — the smartest way to find and apply to internships at top companies.
        </p>
        <div style="background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.3); border-radius: 12px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #6366f1; margin-top: 0;">What you can do now:</h3>
          <ul style="color: rgba(255,255,255,0.8); line-height: 1.8; padding-left: 20px;">
            <li>🔍 Browse 1000+ real internship opportunities</li>
            <li>🤖 Get AI-powered resume analysis and scoring</li>
            <li>💬 Chat with InternBot for career advice</li>
            <li>📊 Track all your applications in one place</li>
            <li>🏢 Explore company profiles and culture</li>
          </ul>
        </div>
        <div style="text-align: center; margin-top: 32px;">
          <a href="${env.FRONTEND_URL}/internships" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            Browse Internships →
          </a>
        </div>
        <p style="color: rgba(255,255,255,0.4); font-size: 12px; text-align: center; margin-top: 32px;">
          © 2024 InternTracker AI. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;
    await sendEmail(email, '🎉 Welcome to InternTracker AI!', html);
};

export const sendApplicationConfirmation = async (
    name: string,
    email: string,
    internshipTitle: string,
    companyName: string
): Promise<void> => {
    const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background: #0a0a0f; color: #fff; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(34,197,94,0.3);">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="font-size: 48px;">✅</div>
          <h1 style="color: #22c55e; margin: 8px 0 0;">Application Submitted!</h1>
        </div>
        <p style="color: rgba(255,255,255,0.8); line-height: 1.7;">Hi ${name},</p>
        <p style="color: rgba(255,255,255,0.8); line-height: 1.7;">
          Your application for <strong style="color: #22c55e;">${internshipTitle}</strong> at <strong>${companyName}</strong> has been successfully submitted.
        </p>
        <div style="background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); border-radius: 12px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #22c55e; margin-top: 0;">What happens next?</h3>
          <ol style="color: rgba(255,255,255,0.8); line-height: 1.8; padding-left: 20px;">
            <li>Your application is under review</li>
            <li>You'll be notified if selected for an interview</li>
            <li>Track your application status in your dashboard</li>
          </ol>
        </div>
        <div style="text-align: center; margin-top: 32px;">
          <a href="${env.FRONTEND_URL}/dashboard/applications" style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            Track Application →
          </a>
        </div>
        <p style="color: rgba(255,255,255,0.4); font-size: 12px; text-align: center; margin-top: 32px;">Best of luck! 🍀 — InternTracker AI Team</p>
      </div>
    </body>
    </html>
  `;
    await sendEmail(email, `✅ Application Submitted: ${internshipTitle} at ${companyName}`, html);
};
