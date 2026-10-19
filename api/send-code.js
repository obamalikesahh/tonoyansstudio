import nodemailer from 'nodemailer';

// ─── Server-side: In-Memory Rate Limit (per IP, per hour) ───────────────────
// Note: On Vercel serverless this resets per cold start, but still catches
// rapid bursts effectively within a function instance.
const ipRequestMap = new Map(); // ip -> [timestamp, ...]
const RATE_LIMIT = 100;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip) {
  const now = Date.now();
  let timestamps = (ipRequestMap.get(ip) || []).filter(ts => now - ts < RATE_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT) {
    ipRequestMap.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  ipRequestMap.set(ip, timestamps);
  return false;
}

// ─── Disposable / Throwaway Email Domains ───────────────────────────────────
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com','guerrillamail.com','guerrillamail.info','guerrillamail.biz',
  'guerrillamail.de','guerrillamail.net','guerrillamail.org','tempmail.com',
  'tempmail.net','temp-mail.org','temp-mail.io','throwam.com','throwaway.email',
  '10minutemail.com','10minutemail.net','10minutemail.org','10minutemail.de',
  'yopmail.com','yopmail.fr','fakeinbox.com','mailnull.com','spamgourmet.com',
  'spamgourmet.net','spamgourmet.org','spamex.com','spamcero.com',
  'trashmail.com','trashmail.at','trashmail.io','trashmail.me','trashmail.net',
  'trashmail.org','trashmail.xyz','trash-mail.at','dispostable.com',
  'spamhole.com','spamspot.com','spamthis.co.uk','mailnesia.com',
  'maildrop.cc','sharklasers.com','spam4.me','spaml.de','spaml.com',
  'discard.email','spamgob.com','fakemailgenerator.com','mailboxy.fun',
  'mailsac.com','getnada.com','inboxbear.com','mohmal.com',
  'byom.de','sofort-mail.de','wegwerfmail.de','wegwerfmail.net',
  'wegwerfmail.org','emkei.cz','hatespam.org','wegwerfemail.com',
  'wegwerfemail.de','wegwerfemail.net','wegwerfemail.org','wegwerfemails.de',
  'wegwerf-email.de','wegwerf-email.net','wegwerf-email.org',
  'wegwerfadresse.de','tempalias.com','tempinbox.com','tempinbox.co.uk',
  'tempomail.fr','temporaryemail.net','temporaryinbox.com','zehnminutenmail.de',
  'trashdevil.com','trashdevil.de','trashemail.de','trbvm.com',
  'turual.com','twinmail.de','zoaxe.com','zoemail.net','zoemail.org',
]);

function isDisposableDomain(email) {
  const parts = (email || '').toLowerCase().split('@');
  if (parts.length !== 2) return true; // invalid = block
  return DISPOSABLE_DOMAINS.has(parts[1].trim());
}

function isValidEmailFormat(email) {
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Get client IP
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    'unknown';

  // ── Rate limit check
  if (isRateLimited(ip)) {
    return res.status(429).json({ message: 'Zu viele Anfragen. Bitte später erneut versuchen.' });
  }

  const { email, code, name } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: 'Missing email or code' });
  }

  // ── Email format check
  if (!isValidEmailFormat(email)) {
    return res.status(400).json({ message: 'Ungültige E-Mail-Adresse.' });
  }

  // ── Disposable email check
  if (isDisposableDomain(email)) {
    return res.status(400).json({ message: 'Wegwerf-E-Mail-Adressen sind nicht erlaubt.' });
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
