import { NextResponse } from 'next/server'

// Rate limiting: simple in-memory store
const submissions = new Map<string, number[]>()
const RATE_LIMIT = 5 // max submissions per IP
const RATE_WINDOW = 60 * 60 * 1000 // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = submissions.get(ip) || []
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW)
  submissions.set(ip, recent)
  return recent.length >= RATE_LIMIT
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown'

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, email, subject, message } = body

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      )
    }

    // Try SMTP if configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const nodemailer = await import('nodemailer')

      const transporter = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST || 'smtp.office365.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          ciphers: 'SSLv3',
          rejectUnauthorized: false,
        },
      })

      // Send to Racespot
      await transporter.sendMail({
        from: `"Racespot.tv Website" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_EMAIL || 'contact@racespot.tv',
        replyTo: `"${name}" <${email}>`,
        subject: `Website Form: ${subject || 'New Inquiry'}`,
        text: `New contact form submission\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject || 'N/A'}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #0A0A0A; padding: 20px 24px; border-bottom: 3px solid #F5C000;">
              <h2 style="color: #F5C000; margin: 0; font-size: 18px;">New Contact Form Submission</h2>
            </div>
            <div style="background: #1A1A1A; padding: 24px; color: #ffffff;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #999; width: 80px;">Name:</td><td style="padding: 8px 0; color: #fff;">${escapeHtml(name)}</td></tr>
                <tr><td style="padding: 8px 0; color: #999;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #F5C000;">${escapeHtml(email)}</a></td></tr>
                <tr><td style="padding: 8px 0; color: #999;">Subject:</td><td style="padding: 8px 0; color: #fff;">${escapeHtml(subject || 'N/A')}</td></tr>
              </table>
              <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #333;">
                <p style="color: #999; margin: 0 0 8px;">Message:</p>
                <p style="color: #fff; white-space: pre-wrap; margin: 0;">${escapeHtml(message)}</p>
              </div>
            </div>
            <div style="background: #0A0A0A; padding: 12px 24px; text-align: center;">
              <p style="color: #666; font-size: 12px; margin: 0;">Sent via racespot.tv contact form</p>
            </div>
          </div>
        `,
      })

      // Send confirmation copy to the sender
      await transporter.sendMail({
        from: `"Racespot.tv" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Copy of your message to Racespot.tv: ${subject || 'New Inquiry'}`,
        text: `Hi ${name},\n\nThank you for reaching out to Racespot.tv! This is a copy of the message you sent:\n\nSubject: ${subject || 'N/A'}\n\n${message}\n\n---\nWe'll get back to you as soon as possible.\n\nBest regards,\nThe Racespot Team\ncontact@racespot.tv\nhttps://racespot.tv`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #0A0A0A; padding: 20px 24px; border-bottom: 3px solid #F5C000;">
              <h2 style="color: #F5C000; margin: 0; font-size: 18px;">Thank you for your message!</h2>
            </div>
            <div style="background: #1A1A1A; padding: 24px; color: #ffffff;">
              <p style="color: #ccc; margin: 0 0 16px;">Hi ${escapeHtml(name)},</p>
              <p style="color: #ccc; margin: 0 0 16px;">Thank you for reaching out to Racespot.tv! Here is a copy of your message:</p>
              <div style="background: #111; border-left: 3px solid #F5C000; padding: 16px; margin: 16px 0;">
                <p style="color: #999; margin: 0 0 4px; font-size: 12px;">Subject: ${escapeHtml(subject || 'N/A')}</p>
                <p style="color: #fff; white-space: pre-wrap; margin: 0;">${escapeHtml(message)}</p>
              </div>
              <p style="color: #ccc; margin: 16px 0 0;">We'll get back to you as soon as possible.</p>
              <p style="color: #999; margin: 16px 0 0;">Best regards,<br>The Racespot Team</p>
            </div>
            <div style="background: #0A0A0A; padding: 12px 24px; text-align: center;">
              <p style="color: #666; font-size: 12px; margin: 0;"><a href="https://racespot.tv" style="color: #F5C000;">racespot.tv</a> &middot; <a href="mailto:contact@racespot.tv" style="color: #F5C000;">contact@racespot.tv</a></p>
            </div>
          </div>
        `,
      })

      // Track for rate limiting
      const timestamps = submissions.get(ip) || []
      timestamps.push(Date.now())
      submissions.set(ip, timestamps)

      return NextResponse.json({ success: true, method: 'smtp' })
    }

    // No SMTP configured — return mailto fallback info
    // Track for rate limiting
    const timestamps = submissions.get(ip) || []
    timestamps.push(Date.now())
    submissions.set(ip, timestamps)

    return NextResponse.json({
      success: true,
      method: 'mailto',
      mailto: {
        to: 'contact@racespot.tv',
        subject: subject || 'Website Inquiry',
        body: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      },
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or email us directly at contact@racespot.tv' },
      { status: 500 }
    )
  }
}
