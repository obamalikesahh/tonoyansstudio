import { Booking } from "./bookingStore";

// Default admin phone number for receiving booking WhatsApp alerts
export const DEFAULT_ADMIN_WHATSAPP = "+491701234567";

/**
 * Clean phone number for wa.me URL format (only digits, no leading +)
 */
export function formatPhoneForWhatsApp(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

/**
 * Generate a WhatsApp deep-link URL to send an instant alert notification to the Admin
 */
export function createAdminWhatsAppNotificationUrl(booking: Booking, adminPhone: string = DEFAULT_ADMIN_WHATSAPP): string {
  const cleanPhone = formatPhoneForWhatsApp(adminPhone);
  const text = 
    `🚨 *NEUE TERMINBUCHUNG!*\n` +
    `----------------------------------------\n` +
    `👤 *Kunde:* ${booking.name}\n` +
    `📧 *E-Mail:* ${booking.email}\n` +
    `📞 *Telefon:* ${booking.phone || "Nicht angegeben"}\n` +
    `✂️ *Service:* ${booking.service}\n` +
    `📅 *Datum:* ${booking.date}\n` +
    `⏰ *Uhrzeit:* ${booking.time} Uhr\n` +
    `📝 *Notiz:* ${booking.notes || "Keine"}\n` +
    `🆔 *ID:* ${booking.id}\n` +
    `----------------------------------------\n` +
    ` Im CMS eingetragen & Bestätigt.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Generate a WhatsApp direct message URL for Admin to contact or confirm booking to the Client
 */
export function createClientWhatsAppMessageUrl(
  clientPhone: string,
  clientName: string,
  date: string,
  time: string,
  service: string,
  type: "confirm" | "reminder" | "custom" = "confirm",
  customMessage?: string
): string {
  const cleanPhone = formatPhoneForWhatsApp(clientPhone);
  
  let text = "";
  if (type === "confirm") {
    text = `Hallo ${clientName}! 👋\n\nIhr Termin für *${service}* am *${date}* um *${time} Uhr* wurde im Tonoyans Studio Admin-CMS *erfolgreich bestätigt*. ✂️✨\n\nWir freuen uns auf Ihren Besuch!`;
  } else if (type === "reminder") {
    text = `Hallo ${clientName}! 🔔\n\nDies ist eine kurze Erinnerung an Ihren Termin morgen (${date} um ${time} Uhr) für *${service}*.\n\nFalls Sie den Termin verschieben möchten, antworten Sie bitte kurz auf diese Nachricht.`;
  } else if (customMessage) {
    text = customMessage;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
