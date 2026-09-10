"use client";

import React, { useState } from "react";
import { X, CheckCircle, Calendar, MessageCircle, Send } from "lucide-react";
import { createAdminWhatsAppNotificationUrl } from "@/lib/whatsapp";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: string;
  onBookingSuccess?: (booking: any) => void;
}

export default function InquiryModal({ isOpen, onClose, initialItem, onBookingSuccess }: InquiryModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: new Date().toISOString().split("T")[0],
    time: "14:00",
    service: initialItem || "Executive Fade & Textured Crop (€65)",
    notes: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          date: formData.date,
          time: formData.time,
          notes: formData.notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCreatedBooking(data.booking);
        setSubmitted(true);
        if (onBookingSuccess) onBookingSuccess(data.booking);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-gray-900 border border-white/20 rounded-3xl p-8 sm:p-10 shadow-2xl text-white">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {submitted && createdBooking ? (
          <div className="py-8 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mb-1 border border-amber-400/30">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-3xl text-white">Termin Bestätigt & Im CMS Live</h3>
            <p className="text-sm text-neutral-300 max-w-md">
              Vielen Dank, <span className="text-white font-semibold">{formData.name}</span>! Ihr Termin für <span className="text-amber-300 font-semibold">{formData.service}</span> am <span className="text-white font-semibold">{formData.date} um {formData.time} Uhr</span> ist im Admin CMS eingetragen.
            </p>

            {/* Direct WhatsApp Admin Notify Button */}
            <div className="w-full p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center gap-3 my-2">
              <div className="text-xs text-emerald-300 font-semibold uppercase tracking-wider flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Sofort WhatsApp-Benachrichtigung an den Admin senden
              </div>
              <a
                href={createAdminWhatsAppNotificationUrl(createdBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                Admin jetzt auf WhatsApp benachrichtigen
              </a>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-2 px-8 py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold text-xs tracking-widest uppercase hover:bg-white/20 transition-all cursor-pointer"
            >
              Schließen
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-sans font-semibold">
                Online Terminvereinbarung
              </span>
              <h3 className="font-serif text-3xl text-white mt-1">Tonoyans Studio Booking</h3>
              <p className="text-xs text-neutral-400 mt-2">
                Wählen Sie Ihren Wunschtermin. Nach der Buchung erscheint der Termin direkt im Admin CMS & WhatsApp.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 mb-1 font-medium">
                  Vollständiger Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Max Mustermann"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:border-amber-300 focus:outline-none transition-colors text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 mb-1 font-medium">
                    E-Mail Adresse
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.de"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:border-amber-300 focus:outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 mb-1 font-medium">
                    WhatsApp / Telefonnummer
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+49 170 1234567"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:border-amber-300 focus:outline-none transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 mb-1 font-medium">
                    Wunschdatum
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:border-amber-300 focus:outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 mb-1 font-medium">
                    Uhrzeit
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-white/15 text-white focus:border-amber-300 focus:outline-none transition-colors text-sm"
                  >
                    <option value="10:00">10:00 Uhr</option>
                    <option value="11:30">11:30 Uhr</option>
                    <option value="14:00">14:00 Uhr</option>
                    <option value="15:30">15:30 Uhr</option>
                    <option value="17:00">17:00 Uhr</option>
                    <option value="18:30">18:30 Uhr</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 mb-1 font-medium">
                  Gewählte Leistung / Haarschnitt
                </label>
                <input
                  type="text"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:border-amber-300 focus:outline-none transition-colors text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-black" />
                {loading ? "Sende Buchung..." : "Termin Verbindlich Buchen"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

