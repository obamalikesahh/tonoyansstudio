"use client";

import React, { useState } from "react";
import { Send, Check, MapPin, Phone, Clock } from "lucide-react";

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
    }
  };

  return (
    <footer id="contact" className="bg-[#0a0a0c] text-white/80 border-t border-white/10 pt-20 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Column 1: Brand */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <a href="#" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#8c6d46] to-[#b58c56] flex items-center justify-center text-white font-serif font-bold text-lg shadow-md">
              T
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl tracking-[0.2em] text-white font-semibold uppercase leading-none">
                Tonoyans
              </span>
              <span className="text-[9px] tracking-[0.25em] text-amber-300 uppercase font-sans font-medium">
                Studio & Grooming
              </span>
            </div>
          </a>
          <p className="text-xs text-white/70 leading-relaxed font-sans mt-2">
            Mastering the Art of Grooming. Exklusive Haarschnitte, traditionelle Nassrasur & erstklassige Bartpflege.
          </p>
          <div className="space-y-2 text-xs text-white/90 mt-2 font-sans">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              Königsallee 42, Düsseldorf
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              +49 (0) 211 9876543
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              Di - Sa: 10:00 - 19:00 Uhr
            </div>
          </div>
        </div>

        {/* Column 2: Navigation */}
        <div>
          <h4 className="font-sans text-sm text-white uppercase tracking-widest mb-4 font-semibold">Leistungen</h4>
          <ul className="space-y-2.5 text-xs font-sans text-white/70">
            <li>
              <a href="#services" className="hover:text-amber-300 transition-colors">
                Executive Haarschnitt & Fade
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-amber-300 transition-colors">
                Gentleman Taper & Bartkontur
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-amber-300 transition-colors">
                Klassische Rasiermesser Rasur
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Studio Info */}
        <div>
          <h4 className="font-sans text-sm text-white uppercase tracking-widest mb-4 font-semibold">Studio Info</h4>
          <ul className="space-y-2.5 text-xs font-sans text-white/70">
            <li>
              <a href="#services" className="hover:text-amber-300 transition-colors">
                Online Termin Buchen
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-amber-300 transition-colors">
                Über Uns & Stylisten
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-300 transition-colors">
                Datenschutz & Impressum
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h4 className="font-sans text-sm text-white uppercase tracking-widest mb-4 font-semibold">Studio Club</h4>
          <p className="text-xs text-white/70 mb-4">
            Erhalten Sie exklusive Termin-Erinnerungen & Zugang zu Sonderaktionen.
          </p>
          {subscribed ? (
            <div className="flex items-center gap-2 text-xs text-amber-300 font-medium bg-amber-300/10 border border-amber-300/30 p-3 rounded-xl">
              <Check className="w-4 h-4" />
              Erfolgreich angemeldet
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="ihre.email@domain.de"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:border-amber-300 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition-colors shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-white/50">
        <div>&copy; {new Date().getFullYear()} TONOYANS STUDIO. Alle Rechte vorbehalten.</div>
        <div className="flex gap-6 font-sans tracking-widest uppercase text-[10px]">
          <a href="#" className="hover:text-amber-300">Impressum</a>
          <a href="#" className="hover:text-amber-300">AGB</a>
          <a href="#" className="hover:text-amber-300">Datenschutz</a>
        </div>
      </div>
    </footer>
  );
}
