"use client";

import React from "react";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="sm:py-24 pt-16 pb-16 bg-[#0a0a0c] text-white border-t border-white/10 relative overflow-hidden">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="text-xs uppercase text-neutral-400 tracking-widest mb-2 font-sans">
          Featured Reviews
        </p>
        <h2 className="text-3xl sm:text-5xl font-serif tracking-tight font-normal text-white">
          Client Highlights
        </h2>
      </div>

      {/* Fan Cards Container matching user HTML */}
      <div className="relative flex items-center justify-center py-12 sm:py-20 min-h-[450px]">
        <div className="container max-w-full relative flex justify-center items-center h-full">
          
          {/* Card 1: Rotated -10 deg */}
          <div
            className="relative w-[320px] sm:w-[360px] h-[340px] rounded-2xl p-1 backdrop-blur-md transition-transform duration-500 hover:scale-105 hover:z-30 cursor-pointer shadow-2xl"
            style={{
              background: "linear-gradient(rgba(255, 255, 255, 0.12), transparent)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "rgba(0, 0, 0, 0.4) 0px 25px 35px",
              margin: "0px -40px",
              transform: "rotate(-10deg)",
            }}
          >
            <div className="w-full h-full rounded-xl bg-white text-neutral-900 shadow-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-neutral-100 ring-1 ring-neutral-200 mb-4 text-neutral-700">
                  <Quote className="h-4 w-4" />
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-900 font-sans font-light">
                  "Working with Tonoyans Studio was transformative. The skin fade and beard sculpting elevated my appearance to new heights. Their attention to detail is unmatched."
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src="https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/3e3e1091-f8e8-4022-a02a-fa37a35c59a5_320w.jpg"
                    alt="Alex Rivera"
                    className="h-7 w-7 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-semibold text-neutral-900 font-sans">
                      Alex Rivera
                    </div>
                    <div className="text-[10px] text-neutral-500 font-sans">
                      CEO, GrowthLabs
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold font-sans">5.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Rotated -6 deg */}
          <div
            className="relative w-[320px] sm:w-[360px] h-[340px] rounded-2xl p-1 backdrop-blur-md transition-transform duration-500 hover:scale-105 hover:z-30 cursor-pointer shadow-2xl"
            style={{
              background: "linear-gradient(rgba(255, 255, 255, 0.1), transparent)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "rgba(0, 0, 0, 0.4) 0px 25px 35px",
              margin: "0px -40px",
              transform: "rotate(-6deg)",
            }}
          >
            <div className="w-full h-full rounded-xl bg-white/95 text-neutral-900 shadow-xl backdrop-blur p-6 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-neutral-100 ring-1 ring-neutral-200 mb-4 text-neutral-700">
                  <Quote className="h-4 w-4" />
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-900 font-sans font-light">
                  "The hot towel straight razor shave and botanical facial treatment made the experience seamless. They delivered beyond expectations."
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src="https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/e7074207-4b47-49d2-b86b-6ca1abd5d849_320w.jpg"
                    alt="Nina Patel"
                    className="h-7 w-7 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-semibold text-neutral-900 font-sans">
                      Nina Patel
                    </div>
                    <div className="text-[10px] text-neutral-500 font-sans">
                      Director, PixelCraft
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold font-sans">5.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Rotated 0 deg */}
          <div
            className="relative w-[320px] sm:w-[360px] h-[340px] rounded-2xl p-1 backdrop-blur-md transition-transform duration-500 hover:scale-105 hover:z-30 cursor-pointer shadow-2xl"
            style={{
              background: "linear-gradient(rgba(255, 255, 255, 0.08), transparent)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "rgba(0, 0, 0, 0.4) 0px 25px 35px",
              margin: "0px -40px",
              transform: "rotate(0deg)",
            }}
          >
            <div className="w-full h-full rounded-xl bg-white/90 text-neutral-900 shadow-lg backdrop-blur p-6 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-neutral-100 ring-1 ring-neutral-200 mb-4 text-neutral-700">
                  <Quote className="h-4 w-4" />
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-900 font-sans font-light">
                  "Exceptional master barbering with a strategic mindset. Tonoyans Studio helped me rethink my entire personal grooming routine."
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src="https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/986db8ed-1c5d-42fb-8c1d-4b3716d2e317_320w.jpg"
                    alt="Marcus Webb"
                    className="h-7 w-7 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-semibold text-neutral-900 font-sans">
                      Marcus Webb
                    </div>
                    <div className="text-[10px] text-neutral-500 font-sans">
                      VP Product, Velocity
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold font-sans">5.0</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
