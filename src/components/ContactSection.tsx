"use client";

import React, { useState } from "react";
import { Mail, Calendar, Send, CheckCircle2, Globe, Share2, MessageSquare, Phone } from "lucide-react";

interface ContactSectionProps {
  onBookingSuccess?: (booking: any) => void;
}

export default function ContactSection({ onBookingSuccess }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Executive Fade & Textured Crop (€65)",
    date: "",
    time: "14:00",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<any | null>(null);

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
          date: formData.date || new Date().toISOString().split("T")[0],
          time: formData.time,
          notes: formData.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedBooking(data.booking);
        if (onBookingSuccess) onBookingSuccess(data.booking);
      }
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="md:pt-36 bg-[#0a0a0c] pt-32 pb-32 relative text-white overflow-hidden border-t border-white/10"
      id="contact"
    >
      {/* Sleek Dark Studio Ambient Lighting Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full blur-[140px] opacity-20"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.25), rgba(140,109,70,0.1), transparent 70%)" }}
        />
        <div className="absolute -right-40 bottom-10 h-[500px] w-[500px] rounded-full blur-[120px] opacity-15 bg-blue-900/30" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-amber-300 backdrop-blur-md uppercase tracking-widest font-sans font-medium">
            <Mail className="h-3.5 w-3.5 text-amber-300" />
            Let's Work Together
          </span>
          
          <h2 className="mt-4 text-4xl sm:text-6xl tracking-tight font-normal font-serif text-white leading-tight">
            Ready to <span className="italic font-serif font-light text-amber-200">book a meeting?</span>
          </h2>
          
          <p className="mt-4 text-neutral-300 text-base sm:text-lg max-w-2xl mx-auto font-sans font-light leading-relaxed">
            Whether you need a signature haircut, skin fade, or traditional straight razor shave, we are here to bring your vision to life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Contact / Booking Form */}
          <div className="relative rounded-3xl border border-white/15 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-white mb-6 font-sans">Send a Message / Book Meeting</h3>

            {submittedBooking ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-2xl font-serif text-white">Termin Bestätigt!</h4>
                <p className="text-xs text-neutral-300">
                  Ihr Termin wurde im Admin-CMS registriert und eine Bestätigungs-E-Mail gesendet.
                </p>
                
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-left text-xs space-y-1.5 font-mono text-neutral-300">
                  <div><strong>Datum:</strong> {submittedBooking.date} um {submittedBooking.time} Uhr</div>
                  <div><strong>Service:</strong> {submittedBooking.service}</div>
                  <div><strong>Status:</strong> In Neon DB gespeichert & E-Mail ausgelöst</div>
                </div>

                <a
                  href={`https://wa.me/491701234567?text=${encodeURIComponent(`🚨 *NEUE TERMINBUCHUNG VIA WEBSITE*\nName: ${submittedBooking.name}\nService: ${submittedBooking.service}\nDatum: ${submittedBooking.date} um ${submittedBooking.time} Uhr`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageSquare className="w-4 h-4" />
                  Admin auf WhatsApp benachrichtigen
                </a>

                <button
                  onClick={() => setSubmittedBooking(null)}
                  className="mt-2 text-xs text-amber-300 hover:underline cursor-pointer"
                >
                  Neuen Termin buchen
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:border-amber-300 focus:outline-none transition-colors text-sm"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:border-amber-300 focus:outline-none transition-colors text-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-2">Service / Haarschnitt</label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-neutral-100 focus:border-amber-300 focus:outline-none transition-colors text-sm"
                  >
                    <option value="Executive Fade & Textured Crop (€65)">Executive Fade & Textured Crop (€65)</option>
                    <option value="Gentleman's Taper & Beard Sculpting (€85)">Gentleman's Taper & Beard Sculpting (€85)</option>
                    <option value="Royal Straight Razor Shave & Facial (€55)">Royal Straight Razor Shave & Facial (€55)</option>
                    <option value="Modern Scissors Cut & Styling (€60)">Modern Scissors Cut & Styling (€60)</option>
                    <option value="Express Beard Contour & Trim (€35)">Express Beard Contour & Trim (€35)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-2">Datum</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-neutral-100 focus:border-amber-300 focus:outline-none transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-2">Uhrzeit</label>
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-neutral-100 focus:border-amber-300 focus:outline-none transition-colors text-sm"
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
                  <label className="block text-xs font-medium text-neutral-300 mb-2">Message / Special Preferences</label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:border-amber-300 focus:outline-none transition-colors text-sm"
                    placeholder="Tell us about your haircut preferences..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3.5 text-neutral-100 transition cursor-pointer text-sm font-medium shadow-md"
                >
                  <span>{loading ? "Sending..." : "Send Message & Book Meeting"}</span>
                  <Send className="h-4 w-4 text-amber-300" />
                </button>
              </form>
            )}
          </div>

          {/* Contact Info Cards */}
          <div className="space-y-6">
            <div className="relative rounded-3xl border border-white/15 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/15 p-3 shadow-lg flex items-center justify-center text-white shrink-0">
                  <Mail className="h-6 w-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white font-sans">Email</h3>
                  <p className="text-neutral-400 text-sm">hello@tonoyans-studio.com</p>
                </div>
              </div>
            </div>

            <div className="relative rounded-3xl border border-white/15 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/15 p-3 shadow-lg flex items-center justify-center text-white shrink-0">
                  <Calendar className="h-6 w-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white font-sans">Schedule a Call</h3>
                  <p className="text-neutral-400 text-sm">Book a free consultation</p>
                </div>
              </div>
            </div>

            <div className="relative rounded-3xl border border-white/15 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-white mb-4 font-sans">Follow Studio</h3>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-neutral-400 hover:text-white hover:bg-white/20 transition border border-white/10"
                  title="Website"
                >
                  <Globe className="w-5 h-5 text-amber-300" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-neutral-400 hover:text-white hover:bg-white/20 transition border border-white/10"
                  title="WhatsApp"
                >
                  <Phone className="w-5 h-5 text-amber-300" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-neutral-400 hover:text-white hover:bg-white/20 transition border border-white/10"
                  title="Chat"
                >
                  <MessageSquare className="w-5 h-5 text-amber-300" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-neutral-400 hover:text-white hover:bg-white/20 transition border border-white/10"
                  title="Share"
                >
                  <Share2 className="w-5 h-5 text-amber-300" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
