import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { to, subject, body } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const formattedBody = body.replace(/\n/g, '<br/>');

    const htmlEmail = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fcfcfc; border: 1px solid #eaeaea; border-radius: 12px; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 2px; color: #111; text-transform: uppercase;">TONOYANS STUDIO</h1>
          <p style="margin: 5px 0 0; font-size: 12px; letter-spacing: 1px; color: #888; text-transform: uppercase;">Premium Hair Salon • Schleswig</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); line-height: 1.6; font-size: 15px;">
          ${formattedBody}
        </div>
        
        <div style="text-align: center; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
          <p style="font-size: 12px; color: #aaa; margin: 0;">© ${new Date().getFullYear()} TONOYANS STUDIO. Alle Rechte vorbehalten.</p>
          <p style="font-size: 12px; color: #aaa; margin: 5px 0 0;">Stadtweg 47, Schleswig</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"TONOYANS STUDIO" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlEmail,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
}
