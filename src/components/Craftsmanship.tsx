"use client";

import React from "react";
import { Scissors, ShieldCheck, Sparkles, Award } from "lucide-react";

export default function Craftsmanship() {
  return (
    <section id="about" className="py-24 px-6 bg-[#0a0a0c] text-white relative z-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs tracking-[0.25em] text-amber-300 uppercase font-sans font-medium mb-3 block">
            Studio Standards & Philosophy
          </span>
          <h2 className="font-sans text-4xl sm:text-5xl font-normal text-white mb-4 tracking-tight">
            The Art of Modern <span className="italic text-amber-200">Grooming</span>
          </h2>
          <p className="text-sm sm:text-base text-white/80 font-sans font-light leading-relaxed">
            At <strong className="text-white font-medium">Tonoyans Studio</strong>, a haircut is not a routine task—it is an individual consultation and architectural sculpting tailored to your facial structure and lifestyle.
          </p>
        </div>

        {/* 4 Pillars Grid with Dark Glassmorphism Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 shadow-lg group">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 text-amber-300 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Scissors className="w-5 h-5" />
            </div>
            <h3 className="font-sans text-lg font-semibold text-white mb-2">Master Barbering</h3>
            <p className="text-xs text-white/70 font-sans font-light leading-relaxed">
              Every stylist at Tonoyans Studio possesses over 8+ years of high-end barbering experience and precision fade techniques.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 shadow-lg group">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 text-amber-300 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-sans text-lg font-semibold text-white mb-2">Premium Organic Products</h3>
            <p className="text-xs text-white/70 font-sans font-light leading-relaxed">
              We exclusively use sulphate-free scalp care, botanical beard oils, and luxury styling clays imported from Italy & Japan.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 shadow-lg group">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 text-amber-300 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-sans text-lg font-semibold text-white mb-2">Hygienic Excellence</h3>
            <p className="text-xs text-white/70 font-sans font-light leading-relaxed">
              Single-use razor blades, UV sterilization for all scissors, and fresh warm towels prepared individually for every client.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 shadow-lg group">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 text-amber-300 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-sans text-lg font-semibold text-white mb-2">Relaxing Studio Lounge</h3>
            <p className="text-xs text-white/70 font-sans font-light leading-relaxed">
              Enjoy private leather seating, artisanal coffee, single malt whiskey, and a calm, upscale lounge ambiance.
            </p>
          </div>
        </div>

        {/* Studio Stats Banner with Glassmorphism */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-10 text-center shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="font-sans text-3xl sm:text-4xl text-white font-bold mb-1">15k+</div>
              <div className="text-[11px] uppercase tracking-widest text-amber-300/90 font-sans">Precision Haarschnitte</div>
            </div>
            <div>
              <div className="font-sans text-3xl sm:text-4xl text-white font-bold mb-1">4.9 / 5</div>
              <div className="text-[11px] uppercase tracking-widest text-amber-300/90 font-sans">Client Rating</div>
            </div>
            <div>
              <div className="font-sans text-3xl sm:text-4xl text-white font-bold mb-1">100%</div>
              <div className="text-[11px] uppercase tracking-widest text-amber-300/90 font-sans">Custom Styling</div>
            </div>
            <div>
              <div className="font-sans text-3xl sm:text-4xl text-white font-bold mb-1">VIP</div>
              <div className="text-[11px] uppercase tracking-widest text-amber-300/90 font-sans">Lounge Access</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
