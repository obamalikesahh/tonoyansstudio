"use client";

import React, { useState } from "react";
import { Menu, X, Calendar, Lock, User } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  onOpenInquiry: () => void;
}

export default function Navbar({ onOpenInquiry }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto backdrop-blur-md bg-black/70 border border-white/15 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8c6d46] to-[#b58c56] text-white flex items-center justify-center font-serif text-sm font-semibold tracking-wider">
            T
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-base tracking-[0.2em] text-white font-semibold uppercase leading-none">
              Tonoyans
            </span>
            <span className="text-[8px] tracking-[0.25em] text-amber-300 uppercase font-sans font-medium">
              Studio & Grooming
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-sans tracking-[0.2em] text-white/80 font-medium">
          <a href="#services" className="hover:text-white transition-colors uppercase">
            HAARSCHNITTE & MENÜ
          </a>
          <a href="#about" className="hover:text-white transition-colors uppercase">
            PHILOSOPHIE
          </a>
          <a href="#contact" className="hover:text-white transition-colors uppercase">
            KONTAKT & ANFAHRT
          </a>
          <Link href="/my-bookings" className="hover:text-amber-300 transition-colors uppercase flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-amber-300" />
            MEINE TERMINE
          </Link>
          <Link href="/admin" className="hover:text-amber-300 transition-colors uppercase flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-neutral-400" />
            ADMIN
          </Link>
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={onOpenInquiry}
            className="flex items-center gap-2 px-5 py-2 text-xs tracking-[0.15em] uppercase rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-medium border border-white/15 transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            Book a Meeting
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white hover:text-amber-300 transition-colors p-1"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 backdrop-blur-xl bg-black/90 border border-white/15 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl">
          <a
            href="#services"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xs font-sans tracking-widest text-white py-2 border-b border-white/10"
          >
            HAARSCHNITTE & MENÜ
          </a>
          <a
            href="#about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xs font-sans tracking-widest text-white py-2 border-b border-white/10"
          >
            STUDIO PHILOSOPHIE
          </a>
          <a
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xs font-sans tracking-widest text-white py-2 border-b border-white/10"
          >
            KONTAKT & ANFAHRT
          </a>
          <Link
            href="/my-bookings"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xs font-sans tracking-widest text-amber-300 py-2 border-b border-white/10 flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5" />
            MEINE GEBUCHTEN TERMINE
          </Link>
          <Link
            href="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xs font-sans tracking-widest text-neutral-300 py-2 border-b border-white/10 flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            ADMIN DASHBOARD
          </Link>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenInquiry();
            }}
            className="w-full mt-2 flex items-center justify-center gap-2 px-5 py-3 text-xs tracking-widest uppercase rounded-full bg-white/15 text-white font-medium"
          >
            <Calendar className="w-4 h-4 text-amber-300" />
            Book a Meeting
          </button>
        </div>
      )}
    </header>
  );
}
