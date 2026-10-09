import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, phone, date, time, service } = req.body;

  if (!name || !email || !date || !time) {
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
    await transporter.sendMail({
      from: `"TONOYANS STUDIO Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // send to admin
      subject: `Neue Terminanfrage: ${service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #2c2c2c;">Neue verifizierte Terminanfrage</h2>
          <p>Es wurde eine neue Terminanfrage über die Website gestellt (E-Mail verifiziert).</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 40%;">Name</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">E-Mail</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Telefon</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${phone || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Behandlung</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${service}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Datum & Uhrzeit</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${date} um ${time} Uhr</td>
            </tr>
          </table>
          <p style="margin-top: 30px;">Bitte setze dich mit dem Kunden in Verbindung, um den Termin final zu bestätigen.</p>
        </div>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
}
