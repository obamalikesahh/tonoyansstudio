"use client";

import React, { useState } from "react";
import { Calendar, MessageCircle, Sparkles, CheckCircle2, Clock, ShieldCheck, Send } from "lucide-react";
import Logo3D from "./Logo3D";
import { createAdminWhatsAppNotificationUrl } from "@/lib/whatsapp";

interface HeroProps {
  onOpenInquiry?: () => void;
}

export default function Hero({ onOpenInquiry }: HeroProps) {
  const [introFinished, setIntroFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Executive Fade & Textured Crop (€65)",
    date: new Date().toISOString().split("T")[0],
    time: "14:00",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedBooking(data.booking);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black flex flex-col items-center justify-center pt-20 pb-16 selection:bg-amber-500 selection:text-black">
      {/* Background Color Ambient Lighting */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/20 via-black to-purple-950/20 pointer-events-none z-10" />

      {/* Dark Studio Background Overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 via-black to-black pointer-events-none z-10" />

      {/* Main Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left / Center 3D Logo Showcase */}
        <div className={`transition-all duration-1000 flex flex-col items-center justify-center ${introFinished ? "lg:col-span-5" : "lg:col-span-12 max-w-xl mx-auto"}`}>
          <Logo3D onIntroComplete={() => setIntroFinished(true)} />
          
          {!introFinished && (
            <p className="text-xs font-mono uppercase tracking-widest text-amber-400/80 mt-4 animate-pulse">
              Willkommen bei Regels 3D Design...
            </p>
          )}
        </div>

        {/* Right Column: Revealed Appointment Booking Form */}
        {introFinished && (
          <div className="lg:col-span-7 space-y-6 animate-in fade-in slide-in-from-right-8 duration-1000">
            
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              Direkte Terminvergabe & Admin WhatsApp Live
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-tight leading-tight">
                Termin Vereinbaren
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300 font-sans mt-2">
                Wählen Sie Ihren Wunschtermin. Jede Buchung landet sofort im Admin-CMS und generiert einen 1-Klick WhatsApp Alert!
              </p>
            </div>

            {/* Direct Booking Form Card */}
            <div className="rounded-3xl border border-amber-500/20 bg-white/5 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              {submittedBooking ? (
                <div className="py-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif text-white">Termin Bestätigt & Im CMS</h3>
                  <p className="text-xs text-neutral-300 max-w-md mx-auto">
                    Vielen Dank, <span className="text-white font-semibold">{submittedBooking.name}</span>! Ihr Termin für <span className="text-amber-300 font-semibold">{submittedBooking.service}</span> ist für den <span className="text-white font-semibold">{submittedBooking.date} um {submittedBooking.time} Uhr</span> eingetragen.
                  </p>

                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center gap-3 my-2">
                    <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">
                      Sofort WhatsApp-Benachrichtigung an den Admin senden
                    </span>
                    <a
                      href={createAdminWhatsAppNotificationUrl(submittedBooking)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Admin jetzt auf WhatsApp benachrichtigen
                    </a>
                  </div>

                  <button
                    onClick={() => setSubmittedBooking(null)}
                    className="text-xs text-amber-300 hover:underline cursor-pointer pt-2"
                  >
                    Weitere Buchung vornehmen
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Max Mustermann"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none text-xs transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        WhatsApp / Telefonnummer *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+49 170 1234567"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none text-xs transition font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        E-Mail *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@domain.de"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none text-xs transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Gewählte Leistung *
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/15 text-white focus:border-amber-400 focus:outline-none text-xs transition"
                      >
                        <option value="Executive Fade & Textured Crop (€65)">Executive Fade & Textured Crop (€65)</option>
                        <option value="Gentleman's Taper & Beard Sculpting (€85)">Gentleman's Taper & Beard Sculpting (€85)</option>
                        <option value="Royal Straight Razor Shave & Facial (€55)">Royal Straight Razor Shave & Facial (€55)</option>
                        <option value="Modern Scissors Cut & Styling (€60)">Modern Scissors Cut & Styling (€60)</option>
                        <option value="Express Beard Contour & Trim (€35)">Express Beard Contour & Trim (€35)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Wunschdatum *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white focus:border-amber-400 focus:outline-none text-xs transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Uhrzeit *
                      </label>
                      <select
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/15 text-white focus:border-amber-400 focus:outline-none text-xs transition"
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold text-xs tracking-widest uppercase transition-all shadow-[0_10px_30px_rgba(245,158,11,0.3)] hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-black" />
                    {loading ? "Eintragen im CMS..." : "Jetzt Termin Buchen & CMS WhatsApp Notify"}
                  </button>
                </form>
              )}
            </div>

            {/* Quick Admin CMS Link */}
            <div className="flex items-center justify-between text-xs text-neutral-400 pt-2">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                Live Neon DB Synchronisiert
              </span>
              <a href="/admin" className="text-amber-400 hover:underline flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" />
                Zum Admin CMS Dashboard
              </a>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
