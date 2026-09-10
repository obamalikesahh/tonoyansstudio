"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Scissors, Clock, CheckCircle2, ArrowRight } from "lucide-react";

interface ServiceItem {
  id: string;
  category: "cuts" | "beard";
  title: string;
  subtitle: string;
  description: string;
  price: string;
  duration: string;
  badge: string;
  image?: string;
  features: string[];
}

const servicesData: ServiceItem[] = [
  {
    id: "executive-fade-crop",
    category: "cuts",
    title: "Executive Fade & Textured Crop",
    subtitle: "Signature Haarschnitt",
    description: "Precision skin/mid fade combined with custom textured top styling tailored to your head shape & hair structure.",
    price: "€65",
    duration: "45 Min",
    badge: "Most Popular Haarschnitt",
    image: "/haircut-1.png",
    features: ["Personal Haircut Consultation", "Precision Skin Fade", "Styling with Clay/Paste", "Scalp Wash & Massage"],
  },
  {
    id: "gentleman-taper-beard",
    category: "cuts",
    title: "Gentleman's Taper & Beard Sculpting",
    subtitle: "Haarschnitt & Bart",
    description: "Classic tapered cut with smooth transitions, paired with hot towel beard shaping, razor line-up & beard oil.",
    price: "€85",
    duration: "60 Min",
    badge: "Full Grooming Combo",
    image: "/haircut-2.png",
    features: ["Taper Cut & Scissors Detailing", "Straight Razor Line-Up", "Hot Towel Beard Treatment", "Organic Beard Balm"],
  },
  {
    id: "royal-shave-facial",
    category: "beard",
    title: "Royal Straight Razor Shave & Facial",
    subtitle: "Traditionelle Rasur",
    description: "The ultimate traditional wet shave experience with pre-shave essential oils, hot towels, and botanical facial massage.",
    price: "€55",
    duration: "40 Min",
    badge: "Pure Relaxation",
    image: "/haircut-3.png",
    features: ["Pre-Shave Oil Application", "Multi-Pass Straight Razor Shave", "Cold Towel Pore Tightening", "Botanical Aftershave Balm"],
  },
  {
    id: "classic-scissors-cut",
    category: "cuts",
    title: "Modern Scissors Cut & Styling",
    subtitle: "Klassischer Haarschnitt",
    description: "All-scissors haircut for medium to long hair lengths, creating natural flow, volume, and refined texture.",
    price: "€60",
    duration: "45 Min",
    badge: "Precision Craft",
    features: ["Texturizing & Layering", "Blow-Dry & Volume Styling", "Neck Hair Clean-up", "Product Recommendation"],
  },
  {
    id: "beard-contour-shaping",
    category: "beard",
    title: "Express Beard Contour & Trim",
    subtitle: "Bartpflege & Kontur",
    description: "Quick clean-up for the modern gentleman on the go. Clipper trim, cheek & neck razor alignment.",
    price: "€35",
    duration: "25 Min",
    badge: "Quick Maintenance",
    features: ["Clipper Length Adjustment", "Cheek & Neck Razor Line", "Hydrating Beard Conditioning"],
  },
];

interface CollectionsProps {
  onOpenInquiry: (serviceTitle?: string) => void;
}

export default function Collections({ onOpenInquiry }: CollectionsProps) {
  const [activeTab, setActiveTab] = useState<"all" | "cuts" | "beard">("all");

  const filteredServices = activeTab === "all" 
    ? servicesData 
    : servicesData.filter((item) => item.category === activeTab);

  return (
    <section id="services" className="py-24 px-6 bg-[#0a0a0c] relative z-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] text-amber-300 uppercase font-sans font-medium">
              <Scissors className="w-4 h-4 text-amber-300" />
              Haarschnitte & Grooming Menü
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight">
              Tonoyans Studio <span className="italic text-amber-200">Haarschnitte</span>
            </h2>
          </div>

          {/* Clean Filter Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-full self-start md:self-auto backdrop-blur-md shadow-sm">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-2.5 rounded-full text-[11px] tracking-[0.2em] uppercase transition-all duration-300 whitespace-nowrap cursor-pointer ${
                activeTab === "all"
                  ? "bg-white/15 text-white font-medium shadow-sm border border-white/20"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Alle Services
            </button>
            <button
              onClick={() => setActiveTab("cuts")}
              className={`px-6 py-2.5 rounded-full text-[11px] tracking-[0.2em] uppercase transition-all duration-300 whitespace-nowrap cursor-pointer ${
                activeTab === "cuts"
                  ? "bg-white/15 text-white font-medium shadow-sm border border-white/20"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Haarschnitte
            </button>
            <button
              onClick={() => setActiveTab("beard")}
              className={`px-6 py-2.5 rounded-full text-[11px] tracking-[0.2em] uppercase transition-all duration-300 whitespace-nowrap cursor-pointer ${
                activeTab === "beard"
                  ? "bg-white/15 text-white font-medium shadow-sm border border-white/20"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Bart & Rasur
            </button>
          </div>
        </div>

        {/* Services Cards Grid with Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-white/25 transition-all duration-300 hover:bg-white/10 flex flex-col justify-between overflow-hidden shadow-lg"
            >
              <div>
                {/* Optional Image Banner */}
                {service.image && (
                  <div className="relative w-full h-52 rounded-2xl overflow-hidden mb-6 bg-black/40 border border-white/10">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-amber-200 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-white/15">
                      {service.badge}
                    </div>
                  </div>
                )}

                {!service.image && (
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="text-[10px] font-medium tracking-widest uppercase px-3 py-1 rounded-full border border-amber-300/30 bg-amber-300/10 text-amber-200">
                      {service.badge}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-white/60 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-300" />
                      {service.duration}
                    </div>
                  </div>
                )}

                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <span className="text-[11px] text-amber-300 uppercase tracking-[0.2em] font-sans font-medium">
                    {service.subtitle}
                  </span>
                  <span className="font-serif text-2xl font-normal text-white">
                    {service.price}
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-white group-hover:text-amber-200 transition-colors mb-3">
                  {service.title}
                </h3>

                <p className="text-xs text-white/70 font-sans font-light leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Service Features */}
                <ul className="space-y-2 mb-6 pt-4 border-t border-white/10">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-white/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Booking Trigger Button */}
              <button
                onClick={() => onOpenInquiry(service.title)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all duration-300 font-sans text-[11px] tracking-[0.2em] uppercase font-medium border border-white/15 hover:border-white/30 cursor-pointer"
              >
                Termin Buchen
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
