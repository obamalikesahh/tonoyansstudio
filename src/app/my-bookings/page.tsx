"use client";

import React, { useState } from "react";
import { User, Calendar, Mail, CheckCircle2, XCircle, Search, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { Booking } from "@/lib/bookingStore";

export default function MyBookingsPage() {
  const [email, setEmail] = useState("");
  const [userBookings, setUserBookings] = useState<Booking[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cancelMessage, setCancelMessage] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    setCancelMessage("");

    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success) {
        const found = (data.bookings as Booking[]).filter(
          (b) => b.email.toLowerCase() === email.trim().toLowerCase()
        );
        setUserBookings(found);
        if (found.length === 0) {
          setError("Keine Termine unter dieser E-Mail-Adresse gefunden.");
        }
      }
    } catch (err) {
      setError("Fehler beim Abrufen der Termine.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "cancelled" }),
      });
      const data = await res.json();
      if (data.success) {
        setUserBookings((prev) =>
          prev ? prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)) : null
        );
        setCancelMessage("Ihr Termin wurde erfolgreich storniert. Eine E-Mail-Bestätigung wurde gesendet.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 sm:p-12 font-sans selection:bg-[#8c6d46] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation back home */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Website
          </Link>
          <span className="text-xs tracking-widest text-amber-300 uppercase font-semibold">
            Tonoyans Studio Client Portal
          </span>
        </div>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-amber-300 flex items-center justify-center mx-auto shadow-lg">
            <User className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-normal text-white">Meine Gebuchten Termine</h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-light">
            Geben Sie Ihre E-Mail-Adresse ein, um Ihre reservierten Termine einzusehen oder stornieren zu können.
          </p>
        </div>

        {/* Email Search Form */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-300 mb-2 font-medium">
                Ihre E-Mail-Adresse
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="ihre.email@domain.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-neutral-500 focus:border-amber-300 focus:outline-none text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs tracking-widest uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-amber-300" />
              {loading ? "Suchen..." : "Termine Suchen"}
            </button>
          </form>
        </div>

        {/* Cancel Message Notice */}
        {cancelMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center max-w-xl mx-auto">
            {cancelMessage}
          </div>
        )}

        {/* Error Notice */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-center max-w-xl mx-auto">
            {error}
          </div>
        )}

        {/* Results List */}
        {userBookings && userBookings.length > 0 && (
          <div className="space-y-4 max-w-3xl mx-auto pt-4">
            <h3 className="text-lg font-serif text-white mb-2">Gefundene Buchungen ({userBookings.length})</h3>
            
            {userBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-lg font-semibold text-white">{b.service}</span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                        b.status === "confirmed"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : b.status === "cancelled"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-300 flex items-center gap-4 pt-1 font-sans">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-300" />
                      <span>{b.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-300" />
                      <span>{b.time} Uhr</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-neutral-400">
                    Buchungs-ID: <span className="font-mono text-neutral-300">{b.id}</span> • Ort: Königsallee 42, Düsseldorf
                  </div>
                </div>

                {b.status !== "cancelled" && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 text-xs font-semibold uppercase tracking-wider transition cursor-pointer shrink-0"
                  >
                    Termin Absagen
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
