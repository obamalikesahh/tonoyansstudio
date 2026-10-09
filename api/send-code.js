import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, code, name } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: 'Missing email or code' });
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
    await transporter.sendMail({
      from: `"TONOYANS STUDIO" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Dein Verifizierungscode - TONOYANS STUDIO',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #2c2c2c;">Hallo ${name || ''},</h2>
          <p>Hier ist dein Verifizierungscode für deine Terminanfrage bei <strong>TONOYANS STUDIO</strong>.</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <strong style="font-size: 24px; letter-spacing: 5px; color: #000;">${code}</strong>
          </div>
          <p>Bitte gib diesen Code auf der Website ein, um deine Anfrage abzuschließen.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #888;">Dies ist eine automatisch generierte E-Mail. Bitte antworte nicht darauf.</p>
        </div>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
}
