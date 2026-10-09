import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, date, time, service } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Missing required fields' });
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
    const emailHeader = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 2px; color: #111; text-transform: uppercase;">TONOYANS STUDIO</h1>
        <p style="margin: 5px 0 0; font-size: 12px; letter-spacing: 1px; color: #888; text-transform: uppercase;">Premium Hair Salon • Schleswig</p>
      </div>
    `;

    const emailFooter = `
      <div style="text-align: center; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
        <p style="font-size: 12px; color: #aaa; margin: 0;">© ${new Date().getFullYear()} TONOYANS STUDIO. Alle Rechte vorbehalten.</p>
      </div>
    `;

    const commonTable = `
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;">
        <tr><td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600; width: 40%; color: #555;">Name</td><td style="padding: 12px; border-bottom: 1px solid #eee; color: #111;">${name}</td></tr>
        <tr><td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600; color: #555;">E-Mail</td><td style="padding: 12px; border-bottom: 1px solid #eee; color: #111;">${email}</td></tr>
        <tr><td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600; color: #555;">Behandlung</td><td style="padding: 12px; border-bottom: 1px solid #eee; color: #111;">${service}</td></tr>
        <tr><td style="padding: 12px; font-weight: 600; color: #555;">Datum & Uhrzeit</td><td style="padding: 12px; color: #111;"><strong>${date}</strong> um <strong>${time} Uhr</strong></td></tr>
      </table>
    `;

    // Email to Admin
    await transporter.sendMail({
      from: `"TONOYANS STUDIO Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, 
      subject: `Stornierung: Termin von ${name}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fcfcfc; border: 1px solid #eaeaea; border-radius: 12px; color: #333;">
          ${emailHeader}
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
            <h2 style="color: #d9534f; margin-top: 0;">Termin storniert!</h2>
            <p style="color: #666; line-height: 1.5;">Ein Kunde hat seinen Termin über das Kundenportal storniert.</p>
            ${commonTable}
          </div>
          ${emailFooter}
        </div>
      `,
    });

    // Email to Customer
    await transporter.sendMail({
      from: `"TONOYANS STUDIO" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Stornierungsbestätigung - TONOYANS STUDIO`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fcfcfc; border: 1px solid #eaeaea; border-radius: 12px; color: #333;">
          ${emailHeader}
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
            <h2 style="color: #2c2c2c; margin-top: 0;">Hallo ${name},</h2>
            <p style="color: #666; line-height: 1.5;">wir bestätigen hiermit die Stornierung deines folgenden Termins:</p>
            ${commonTable}
            <div style="margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 6px; text-align: center;">
              <p style="margin: 0; font-size: 14px; color: #555;">Schade, dass es diesmal nicht klappt! Du kannst jederzeit einen neuen Termin über unsere Website buchen.</p>
            </div>
          </div>
          ${emailFooter}
        </div>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
}
