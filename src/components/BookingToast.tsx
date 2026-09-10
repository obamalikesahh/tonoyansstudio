"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

interface ToastMessage {
  id: string;
  name: string;
  service: string;
  date: string;
  time: string;
}

export default function BookingToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    const handleCustomBookingEvent = (e: any) => {
      if (e.detail) {
        setToast(e.detail);
        setTimeout(() => setToast(null), 7000);
      }
    };
    window.addEventListener("tonoyans_new_booking", handleCustomBookingEvent);
    return () => window.removeEventListener("tonoyans_new_booking", handleCustomBookingEvent);
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-gray-900 border border-white/20 text-white rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-xs uppercase font-semibold text-amber-300 tracking-wider">
            Neue Terminbuchung!
          </h4>
          <p className="text-xs text-white font-medium mt-1">
            {toast.name} hat eben gebucht:
          </p>
          <p className="text-[11px] text-white/70 mt-0.5 font-mono">
            {toast.service} • {toast.date} um {toast.time} Uhr
          </p>
        </div>
        <button
          onClick={() => setToast(null)}
          className="text-white/60 hover:text-white transition p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
