import { NextResponse } from "next/server";
import { getBookingsDB, saveBookingDB, updateBookingStatusDB } from "@/lib/bookingStore";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "grizzlygoegym@gmail.com";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  try {
    return new Resend(key);
  } catch (e) {
    console.warn("Resend client init error:", e);
    return null;
  }
}

export async function GET() {
  const bookings = await getBookingsDB();
  return NextResponse.json({ success: true, bookings });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, date, time, service, notes } = body;

    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { success: false, error: "Name, Email, Datum und Uhrzeit sind erforderlich." },
        { status: 400 }
      );
    }

    // Save to Neon PostgreSQL Database + Local Backup
    const newBooking = await saveBookingDB({
      name,
      email,
      phone: phone || "",
      date,
      time,
      service: service || "Executive Fade & Haircut",
      notes: notes || "",
    });

    // Send emails via Resend
    let resendStatus = "sent";
    const resend = getResend();
    if (resend) {
      try {
        // 1. Send confirmation email to client
        await resend.emails.send({
          from: "Tonoyans Studio <onboarding@resend.dev>",
          to: [email],
          subject: `Bestätigung Ihres Termins bei Tonoyans Studio (${date} um ${time} Uhr)`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #0a0a0c; color: #ffffff; padding: 30px; border-radius: 12px;">
              <h2 style="color: #d4af37; margin-bottom: 5px;">TONOYANS STUDIO</h2>
              <p style="color: #a0a0a0; font-size: 14px; margin-top: 0;">Haute Horlogerie & Grooming Atelier</p>
              <hr style="border-color: #333; margin: 20px 0;" />
              <h3 style="color: #ffffff;">Terminbestätigung</h3>
              <p style="color: #dddddd;">Sehr geehrte(r) <strong>${name}</strong>,</p>
              <p style="color: #cccccc;">Vielen Dank für Ihre Buchung bei Tonoyans Studio. Ihr Termin wurde erfolgreich reserviert:</p>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #16161a; padding: 15px; border-radius: 8px;">
                <tr><td style="padding: 10px; color: #aaa;">Service:</td><td style="padding: 10px; font-weight: bold; color: #fff;">${service}</td></tr>
                <tr><td style="padding: 10px; color: #aaa;">Datum:</td><td style="padding: 10px; font-weight: bold; color: #fff;">${date}</td></tr>
                <tr><td style="padding: 10px; color: #aaa;">Uhrzeit:</td><td style="padding: 10px; font-weight: bold; color: #fff;">${time} Uhr</td></tr>
                <tr><td style="padding: 10px; color: #aaa;">Ort:</td><td style="padding: 10px; font-weight: bold; color: #d4af37;">Königsallee 42, Düsseldorf</td></tr>
              </table>
              <p style="font-size: 13px; color: #888;">Falls Sie Ihren Termin verschieben oder absagen möchten, können Sie dies unter /my-bookings auf der Website erledigen.</p>
            </div>
          `,
        });

        // 2. Send notification email to Admin (grizzlygoegym@gmail.com)
        await resend.emails.send({
          from: "Tonoyans Studio Admin <onboarding@resend.dev>",
          to: [ADMIN_EMAIL],
          subject: `NEUE BUCHUNG: ${name} - ${date} (${time} Uhr)`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0a0a0c; color: #ffffff; border-radius: 10px;">
              <h2 style="color: #d4af37;">NEUE TERMIN-BUCHUNG!</h2>
              <p><strong>Kunde:</strong> ${name} (<a href="mailto:${email}" style="color: #60a5fa;">${email}</a>)</p>
              <p><strong>Telefon:</strong> ${phone || "Nicht angegeben"}</p>
              <p><strong>Service:</strong> ${service}</p>
              <p><strong>Datum & Uhrzeit:</strong> ${date} um ${time} Uhr</p>
              <p><strong>Notizen:</strong> ${notes || "Keine"}</p>
              <hr style="border-color: #333;" />
              <p style="font-size: 12px; color: #888;">Gespeichert in Neon PostgreSQL Database & Benachrichtigung gesendet an ${ADMIN_EMAIL}.</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Resend error:", emailErr);
        resendStatus = "failed";
      }
    } else {
      resendStatus = "skipped_no_api_key";
    }

    return NextResponse.json({
      success: true,
      booking: newBooking,
      emailStatus: resendStatus,
      message: `Termin gebucht, in Neon DB gespeichert & E-Mail verarbeitet!`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Interner Serverfehler bei der Buchung." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ success: false, error: "ID and status required" }, { status: 400 });
    }
    const updated = await updateBookingStatusDB(id, status);

    // If cancelled, send notification emails
    if (status === "cancelled" && updated) {
      const resend = getResend();
      if (resend) {
        try {
          await resend.emails.send({
            from: "Tonoyans Studio Admin <onboarding@resend.dev>",
            to: [ADMIN_EMAIL],
            subject: `STORNIERUNG: ${updated.name} hat Termin am ${updated.date} storniert`,
            html: `<p>Termin ID <strong>${updated.id}</strong> für ${updated.name} am ${updated.date} um ${updated.time} Uhr wurde storniert.</p>`,
          });
        } catch (e) {
          console.warn("Cancellation mail error:", e);
        }
      }
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to update booking" }, { status: 500 });
  }
}
