import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    await transporter.sendMail({
      from: `"Table of Kings Website" <${process.env.GMAIL_USER}>`,
      to: process.env.BUSINESS_EMAIL || 'tableofkings.tok@gmail.com',
      replyTo: email,
      subject: `New Message from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #f4eadb;border-radius:12px;overflow:hidden;">
          <div style="background:#4a3018;padding:24px;text-align:center;">
            <h1 style="color:#c68c53;margin:0;font-size:28px;">Table of Kings</h1>
            <p style="color:#fdfbf7;margin:8px 0 0;font-size:13px;text-transform:uppercase;letter-spacing:2px;">New Contact Message</p>
          </div>
          <div style="padding:32px;background:#fdfbf7;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#7a5230;font-size:14px;width:140px;">Name</td><td style="padding:8px 0;color:#4a3018;font-weight:600;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#7a5230;font-size:14px;">Email</td><td style="padding:8px 0;color:#4a3018;"><a href="mailto:${email}" style="color:#c68c53;">${email}</a></td></tr>
            </table>
            <hr style="border:none;border-top:1px solid #f4eadb;margin:20px 0;" />
            <h3 style="color:#4a3018;margin:0 0 12px;">Message</h3>
            <p style="color:#4a3018;white-space:pre-wrap;background:#f4eadb;padding:16px;border-radius:8px;font-size:15px;">${message}</p>
          </div>
          <div style="background:#f4eadb;padding:16px;text-align:center;font-size:12px;color:#7a5230;">
            Reply directly to this email to reach the sender.
          </div>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Contact email error:', err);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
}
