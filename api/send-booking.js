import nodemailer from 'nodemailer';
import { Client } from 'pg';
import { getPublicHoliday } from '../lib/holidays.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, phone, date, time, service, price } = req.body;

  if (!name || !email || !date || !time) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Validate Sunday & statutory public holidays
  const [bYear, bMonth, bDay] = date.split('-').map(Number);
  const checkDay = new Date(bYear, bMonth - 1, bDay).getDay();
  if (checkDay === 0) {
    return res.status(400).json({ 
      message: 'Sonntags hat das Studio geschlossen. Bitte wähle einen Termin von Montag bis Samstag.' 
    });
  }

  const holidayName = getPublicHoliday(date);
  if (holidayName) {
    return res.status(400).json({ 
      message: `An Feiertagen (${holidayName}) hat unser Studio geschlossen. Bitte wähle einen regulären Werktag.` 
    });
  }

  // Connect to PostgreSQL to check availability and persist booking
  const dbClient = new Client({
    connectionString: process.env.DATABASE_URL
  });

  let bookingId = 'BOOK-' + Date.now();

  try {
    await dbClient.connect();

    // Check if slot is already booked in database
    const existing = await dbClient.query(
      'SELECT id FROM bookings WHERE date = $1 AND time = $2',
      [date, time]
    );

    if (existing.rows.length > 0) {
      await dbClient.end();
      return res.status(409).json({ 
        message: `Leider ist am ${date} um ${time} Uhr bereits ein Termin vergeben. Bitte wähle eine andere Uhrzeit.` 
      });
    }

    // Save booking into PostgreSQL
    await dbClient.query(
      `INSERT INTO bookings (id, name, email, phone, date, time, service, price, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'confirmed', $9)`,
      [bookingId, name, email, phone || '', date, time, service || '', price || '', new Date().toISOString()]
    );

    // Save or update registered user
    const userId = 'USER-' + Date.now();
    await dbClient.query(
      `INSERT INTO registered_users (id, name, email, phone, registered_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone`,
      [userId, name, email, phone || '', new Date().toISOString()]
    );

    await dbClient.end();
  } catch (dbErr) {
    console.error('Database insertion error:', dbErr);
    try { await dbClient.end(); } catch(_) {}
    return res.status(500).json({ message: 'Database error', error: dbErr.message });
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
        <p style="font-size: 12px; color: #aaa; margin: 5px 0 0;">Stadtweg 47, Schleswig</p>
      </div>
    `;

    const commonTable = `
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;">
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600; width: 40%; color: #555;">Name</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; color: #111;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600; color: #555;">E-Mail</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; color: #111;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600; color: #555;">Telefon</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; color: #111;">${phone || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600; color: #555;">Behandlung</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; color: #111;">${service}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: 600; color: #555;">Datum & Uhrzeit</td>
          <td style="padding: 12px; color: #111;"><strong>${date}</strong> um <strong>${time} Uhr</strong></td>
        </tr>
      </table>
    `;

    // 1. Email to Admin
    await transporter.sendMail({
      from: `"TONOYANS STUDIO Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // send to admin
      subject: `Neue Terminanfrage: ${service}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fcfcfc; border: 1px solid #eaeaea; border-radius: 12px; color: #333;">
          ${emailHeader}
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
            <h2 style="color: #2c2c2c; margin-top: 0;">Neue Terminanfrage!</h2>
            <p style="color: #666; line-height: 1.5;">Ein Kunde hat soeben eine verifizierte Buchungsanfrage gestellt.</p>
            ${commonTable}
            <div style="margin-top: 30px; padding: 15px; background: rgba(203, 178, 106, 0.1); border-left: 4px solid #cbb26a; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #666;">Bitte setze dich mit dem Kunden in Verbindung, um den Termin final zu bestätigen.</p>
            </div>
          </div>
          ${emailFooter}
        </div>
      `,
    });

    // 2. Email to Customer
    await transporter.sendMail({
      from: `"TONOYANS STUDIO" <${process.env.EMAIL_USER}>`,
      to: email, // send to customer
      subject: `Deine Terminanfrage im TONOYANS STUDIO`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fcfcfc; border: 1px solid #eaeaea; border-radius: 12px; color: #333;">
          ${emailHeader}
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
            <h2 style="color: #2c2c2c; margin-top: 0;">Hallo ${name},</h2>
            <p style="color: #666; line-height: 1.5;">Vielen Dank für deine Terminanfrage bei uns im Salon! Deine Anfrage ist erfolgreich bei uns eingegangen.</p>
            <h3 style="margin-top: 30px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Deine Wunschdaten:</h3>
            ${commonTable}
            <div style="margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 6px; text-align: center;">
              <p style="margin: 0; font-size: 14px; color: #555;">Wir werden uns in Kürze bei dir melden, um den Termin final zu bestätigen.</p>
            </div>
          </div>
          ${emailFooter}
        </div>
      `,
    });

    res.status(200).json({ success: true, id: bookingId });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
}
