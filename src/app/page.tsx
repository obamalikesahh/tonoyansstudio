"use client";

import React, { useState } from "react";
import Logo3D from "@/components/Logo3D";
import { CheckCircle2, MessageCircle, Send } from "lucide-react";
import { createAdminWhatsAppNotificationUrl } from "@/lib/whatsapp";

export default function Home() {
  const [introFinished, setIntroFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<any | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIntroFinished(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const [formData, setFormData] = useState({
    anrede: "Herr",
    vorname: "",
    nachname: "",
    email: "",
    telefon: "",
    dienstleistung: "HAARSCHNITT – Individuelle Schnitte, perfekt auf dich abgestimmt",
    datum: new Date().toISOString().split("T")[0],
    uhrzeit: "09:45",
    wochentag: "Donnerstag",
    bemerkungen: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fullName = `${formData.anrede} ${formData.vorname} ${formData.nachname}`.trim();
      const fullNotes = `Dienstleistung: ${formData.dienstleistung} | Wochentag: ${formData.wochentag} | Bemerkungen: ${formData.bemerkungen}`;
      
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email: formData.email,
          phone: formData.telefon,
          service: formData.dienstleistung,
          date: formData.datum,
          time: formData.uhrzeit,
          notes: fullNotes,
        }),
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
    <div className="min-h-screen bg-[#070606] text-[#f0f0f0] font-sans selection:bg-[#E8D8C4] selection:text-black flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      
      {/* Subtle Cream Marble Background Accent Lights */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 h-[650px] w-[850px] rounded-full blur-[150px] opacity-15"
          style={{ background: "radial-gradient(circle, rgba(232,216,196,0.35), rgba(213,194,165,0.1), transparent 70%)" }}
        />
        <div
          className="absolute right-0 bottom-0 h-[450px] w-[450px] rounded-full blur-[130px] opacity-10"
          style={{ background: "radial-gradient(circle, rgba(232,216,196,0.25), transparent 70%)" }}
        />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-center py-4 border-b border-white/10">
        <div className="font-serif text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#F5EBE0] via-[#E8D8C4] to-[#D5C2A5]">
          Tonoyans Studio
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-4xl mx-auto my-6 space-y-6">
        
        {/* 3D Model Spin Intro */}
        <div className="flex flex-col items-center justify-center">
          <Logo3D onIntroComplete={() => setIntroFinished(true)} />
        </div>

        {/* Clean Terminanfrage Form (Revealed ONLY after 1.8s 3D Intro) */}
        {introFinished && (
          <div className="bg-black/60 border border-[#E8D8C4]/20 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            
            {/* Form Title & Description */}
            <div className="border-b border-white/10 pb-6">
              <h1 className="text-3xl sm:text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5EBE0] to-[#E8D8C4] tracking-tight">
                Terminanfrage
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300 font-sans mt-3 leading-relaxed">
                Füllen Sie einfach die unten stehenden Formularfelder aus. Wir prüfen so schnell wie möglich Ihren Terminwunsch in unserem Friseursalon und werden Ihnen diesen umgehend bestätigen.
              </p>
            </div>

            {submittedBooking ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E8D8C4]/15 border border-[#E8D8C4]/30 text-[#E8D8C4] flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif text-white">Vielen Dank für Ihre Terminanfrage!</h3>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto">
                  Ihre Anfrage von <span className="text-white font-semibold">{submittedBooking.name}</span> für <span className="text-[#E8D8C4] font-semibold">{submittedBooking.service}</span> am <span className="text-[#E8D8C4] font-semibold">{submittedBooking.date} um {submittedBooking.time} Uhr</span> wurde erfolgreich im Admin Dashboard eingetragen.
                </p>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center gap-3 max-w-lg mx-auto my-4">
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
                  className="text-xs text-[#E8D8C4] hover:underline cursor-pointer pt-2"
                >
                  Neue Terminanfrage ausfüllen
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* SECTION 1: Zur Person */}
                <div className="space-y-4">
                  <h2 className="text-lg font-serif text-[#E8D8C4] border-b border-[#E8D8C4]/20 pb-2">
                    Zur Person
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Anrede</label>
                      <select
                        value={formData.anrede}
                        onChange={(e) => setFormData({ ...formData, anrede: e.target.value })}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:border-[#E8D8C4] focus:outline-none"
                      >
                        <option value="Herr">Herr</option>
                        <option value="Frau">Frau</option>
                        <option value="Divers">Divers</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Vorname</label>
                      <input
                        type="text"
                        value={formData.vorname}
                        onChange={(e) => setFormData({ ...formData, vorname: e.target.value })}
                        placeholder="Matthias"
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-[#E8D8C4] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Nachname <span className="text-[#E8D8C4]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nachname}
                        onChange={(e) => setFormData({ ...formData, nachname: e.target.value })}
                        placeholder="Lenard"
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-[#E8D8C4] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        E-Mail <span className="text-[#E8D8C4]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="m.lenard@yahoo.de"
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-[#E8D8C4] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Telefon / WhatsApp</label>
                      <input
                        type="tel"
                        value={formData.telefon}
                        onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                        placeholder="+49 818789 52156456"
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-[#E8D8C4] focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: Gewünschte Dienstleistung Dropdown */}
                <div className="space-y-4">
                  <h2 className="text-lg font-serif text-[#E8D8C4] border-b border-[#E8D8C4]/20 pb-2">
                    Dienstleistung Auswählen
                  </h2>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Gewünschte Leistung <span className="text-[#E8D8C4]">*</span>
                    </label>
                    <select
                      value={formData.dienstleistung}
                      onChange={(e) => setFormData({ ...formData, dienstleistung: e.target.value })}
                      className="w-full bg-black/80 border border-[#E8D8C4]/30 rounded-xl px-4 py-3.5 text-xs text-[#F5EBE0] focus:border-[#E8D8C4] focus:outline-none font-medium"
                    >
                      <option value="HAARSCHNITT – Individuelle Schnitte, perfekt auf dich abgestimmt">
                        ✂️ HAARSCHNITT – Individuelle Schnitte, perfekt auf dich abgestimmt
                      </option>
                      <option value="COLORATION – Balayage, Strähnen, Glossing & mehr">
                        🎨 COLORATION – Balayage, Strähnen, Glossing & mehr
                      </option>
                      <option value="GLOWY BEAUTY – Für glänzendes, gesundes Haar mit natürlichem Glow">
                        ✨ GLOWY BEAUTY – Für glänzendes, gesundes Haar mit natürlichem Glow
                      </option>
                      <option value="HAARPFLEGE – Intensive Pflegebehandlungen für starkes & schönes Haar">
                        💈 HAARPFLEGE – Intensive Pflegebehandlungen für starkes & schönes Haar
                      </option>
                      <option value="STYLING – Föhnfrisuren, Wellen, Hochsteckfrisuren & mehr">
                        💇 STYLING – Föhnfrisuren, Wellen, Hochsteckfrisuren & mehr
                      </option>
                    </select>
                  </div>
                </div>

                {/* SECTION 3: Terminwahl */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-serif text-[#E8D8C4] border-b border-[#E8D8C4]/20 pb-2">
                      Terminwahl
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">nächstmöglicher Termin</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">ab folgendem Datum</label>
                      <input
                        type="date"
                        required
                        value={formData.datum}
                        onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:border-[#E8D8C4] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">zu/ab bestimmter Uhrzeit</label>
                      <input
                        type="text"
                        value={formData.uhrzeit}
                        onChange={(e) => setFormData({ ...formData, uhrzeit: e.target.value })}
                        placeholder="09:45"
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:border-[#E8D8C4] focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">zu bestimmtem Wochentag</label>
                      <select
                        value={formData.wochentag}
                        onChange={(e) => setFormData({ ...formData, wochentag: e.target.value })}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:border-[#E8D8C4] focus:outline-none"
                      >
                        <option value="Montag">Montag</option>
                        <option value="Dienstag">Dienstag</option>
                        <option value="Mittwoch">Mittwoch</option>
                        <option value="Donnerstag">Donnerstag</option>
                        <option value="Freitag">Freitag</option>
                        <option value="Samstag">Samstag</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: Zusätzliche Angaben */}
                <div className="space-y-4">
                  <h2 className="text-lg font-serif text-[#E8D8C4] border-b border-[#E8D8C4]/20 pb-2">
                    Zusätzliche Angaben
                  </h2>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Bemerkungen</label>
                    <textarea
                      rows={3}
                      value={formData.bemerkungen}
                      onChange={(e) => setFormData({ ...formData, bemerkungen: e.target.value })}
                      placeholder="nur Schneiden und Waschen"
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-[#E8D8C4] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#F5EBE0] via-[#E8D8C4] to-[#D5C2A5] hover:opacity-95 text-[#18130e] font-bold text-xs tracking-widest uppercase transition-all shadow-[0_10px_30px_rgba(232,216,196,0.15)] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#18130e]" />
                  {loading ? "Sende Terminanfrage..." : "Terminanfrage Absenden"}
                </button>

              </form>
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto text-center py-4 text-xs text-neutral-500 font-mono border-t border-white/10">
        © Tonoyans Studio • Friseursalon Terminanfrage
      </footer>

    </div>
  );
}
