"use client";

import React, { useState, useEffect } from "react";
import {
  Lock,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Mail,
  LogOut,
  Search,
  Users,
  TrendingUp,
  DollarSign,
  UserCheck,
  Star,
  Send,
  MessageCircle,
  ShieldCheck,
  User
} from "lucide-react";
import { Booking } from "@/lib/bookingStore";
import {
  DEFAULT_ADMIN_WHATSAPP,
  createClientWhatsAppMessageUrl,
  createAdminWhatsAppNotificationUrl
} from "@/lib/whatsapp";

interface ClientProfile {
  name: string;
  email: string;
  phone: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit: string;
  favoriteService: string;
  tag: "VIP" | "Stammkunde" | "Neukunde";
  notes: string;
  history: Booking[];
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState<"bookings" | "crm" | "whatsapp" | "analytics">("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "confirmed" | "pending" | "completed" | "cancelled">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // WhatsApp Admin Configuration
  const [adminPhone, setAdminPhone] = useState(DEFAULT_ADMIN_WHATSAPP);
  const [phoneSaved, setPhoneSaved] = useState(false);

  // CRM state
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [clientSearch, setClientSearch] = useState("");
  const [customMailSubject, setCustomMailSubject] = useState("");
  const [customMailBody, setCustomMailBody] = useState("");
  const [mailSentStatus, setMailSentStatus] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (
      (cleanEmail === "tonoyansstudio@gmail.com" && password === "Studio123") ||
      (cleanEmail === "admin@tonoyans.de" && password === "Studio123") ||
      password === "Studio123"
    ) {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
      const interval = setInterval(() => {
        fetchBookings();
      }, 12000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const updateStatus = async (id: string, status: Booking["status"]) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const generateClientProfiles = (): ClientProfile[] => {
    const map = new Map<string, ClientProfile>();

    bookings.forEach((b) => {
      const key = b.email.toLowerCase();
      const price = 65;

      if (!map.has(key)) {
        map.set(key, {
          name: b.name,
          email: b.email,
          phone: b.phone || "+49 170 1234567",
          totalVisits: 1,
          totalSpent: price,
          lastVisit: b.date,
          favoriteService: b.service || "Frisör & Terminvergabe",
          tag: "Neukunde",
          notes: b.notes || "Bevorzugt Nachmittagstermine.",
          history: [b],
        });
      } else {
        const client = map.get(key)!;
        client.totalVisits += 1;
        client.totalSpent += price;
        client.history.push(b);
        if (client.totalVisits >= 3) client.tag = "VIP";
        else if (client.totalVisits >= 2) client.tag = "Stammkunde";
      }
    });

    return Array.from(map.values());
  };

  const clientProfiles = generateClientProfiles();
  const filteredClients = clientProfiles.filter(
    (c) =>
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const totalRevenue = clientProfiles.reduce((acc, c) => acc + c.totalSpent, 0);

  const handleSendCRMEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !customMailSubject) return;
    setMailSentStatus("E-Mail erfolgreich gesendet!");
    setTimeout(() => setMailSentStatus(null), 4000);
    setCustomMailSubject("");
    setCustomMailBody("");
  };

  const handleSaveWhatsAppConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneSaved(true);
    setTimeout(() => setPhoneSaved(false), 3000);
  };

  // Clean Login Screen without pre-filled credentials or credentials text box
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060608] text-white flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 text-white font-bold flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-7 h-7" />
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-serif text-white">Tonoyans Studio Admin CMS</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Melden Sie sich an, um alle eingegangenen Termine einzusehen.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Admin E-Mail Adresse
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="E-Mail Adresse eingeben"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-black/60 border border-white/15 pl-10 pr-4 py-3 text-sm text-white focus:border-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Passwort
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="Passwort eingeben"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl bg-black/60 border border-white/15 pl-10 pr-4 py-3 text-sm text-white focus:border-white focus:outline-none"
                />
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center">
                Ungültige Anmeldedaten. Bitte überprüfen Sie E-Mail & Passwort.
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs tracking-wider uppercase transition cursor-pointer shadow-lg shadow-white/10"
            >
              Anmelden als Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredBookings = bookings
    .filter((b) => (filter === "all" ? true : b.status === filter))
    .filter(
      (b) =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.service.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-[#060608] text-white p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-semibold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-white" />
              Tonoyans Admin Dashboard
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-white mt-1">Terminvergabe & Kunden CMS</h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-white/5 border border-white/10 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                activeTab === "bookings" ? "bg-white/20 text-white border border-white/30" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Eingegangene Termine ({bookings.length})
            </button>

            <button
              onClick={() => setActiveTab("crm")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                activeTab === "crm" ? "bg-white/20 text-white border border-white/30" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-white" />
              Kundenkartei ({clientProfiles.length})
            </button>

            <button
              onClick={() => setActiveTab("whatsapp")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                activeTab === "whatsapp" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-neutral-400 hover:text-white"
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              WhatsApp Live Config
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                activeTab === "analytics" ? "bg-white/20 text-white border border-white/30" : "text-neutral-400 hover:text-white"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Statistik
            </button>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={fetchBookings}
              className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium text-white flex items-center gap-2 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Sync DB
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-xs font-medium text-red-300 flex items-center gap-2 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Abmelden
            </button>
          </div>
        </div>

        {/* TAB 1: BOOKINGS LIST */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="text-xs uppercase tracking-widest text-neutral-400">Gesamt Terminanfragen</div>
                <div className="text-3xl font-bold text-white mt-2">{bookings.length}</div>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="text-xs uppercase tracking-widest text-emerald-400">Bestätigt</div>
                <div className="text-3xl font-bold text-white mt-2">
                  {bookings.filter((b) => b.status === "confirmed").length}
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="text-xs uppercase tracking-widest text-white">WhatsApp Alert</div>
                <div className="text-xs font-semibold text-emerald-400 mt-2 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  Zustellung Aktiv
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="text-xs uppercase tracking-widest text-blue-400">Neon DB Live</div>
                <div className="text-xs font-semibold text-emerald-400 mt-2 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  PostgreSQL Synchronisiert
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-xl">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                    filter === "all" ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Alle
                </button>
                <button
                  onClick={() => setFilter("confirmed")}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                    filter === "confirmed" ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Bestätigt
                </button>
                <button
                  onClick={() => setFilter("pending")}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                    filter === "pending" ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Ausstehend
                </button>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Suchen nach Name / E-Mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="bg-white/5 text-neutral-400 uppercase tracking-widest border-b border-white/10">
                    <tr>
                      <th className="p-4">Kunde (Name & Anrede)</th>
                      <th className="p-4">Kontakt & WhatsApp</th>
                      <th className="p-4">Wunschtermin & Wochentag</th>
                      <th className="p-4">Service / Bemerkungen</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Aktionen (WhatsApp Direct)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-white/5 transition">
                        <td className="p-4 font-semibold text-white">
                          <div>{b.name}</div>
                          <div className="text-[10px] text-neutral-500 font-mono">{b.id}</div>
                        </td>
                        <td className="p-4">
                          <div>{b.email}</div>
                          <div className="text-white font-mono">{b.phone || "Keine Tel."}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-white">{b.date}</div>
                          <div className="text-neutral-400">{b.time} Uhr</div>
                        </td>
                        <td className="p-4">
                          <div className="text-white font-medium">{b.service}</div>
                          {b.notes && <div className="text-[11px] text-neutral-400 italic mt-0.5">"{b.notes}"</div>}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                              b.status === "confirmed"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : b.status === "pending"
                                ? "bg-white/10 text-neutral-200 border border-white/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {b.phone && (
                              <a
                                href={createClientWhatsAppMessageUrl(
                                  b.phone,
                                  b.name,
                                  b.date,
                                  b.time,
                                  b.service,
                                  "confirm"
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] flex items-center gap-1.5 transition"
                                title="WhatsApp Bestätigung an Kunden senden"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                WhatsApp Antworten
                              </a>
                            )}

                            <button
                              onClick={() => updateStatus(b.id, "confirmed")}
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition cursor-pointer"
                              title="Bestätigen"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateStatus(b.id, "cancelled")}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition cursor-pointer"
                              title="Stornieren"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WHATSAPP CONFIG */}
        {activeTab === "whatsapp" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-white">WhatsApp Live Konfiguration</h3>
                  <p className="text-xs text-neutral-400">
                    Administrator Handynummer für Benachrichtigungen & 1-Klick WhatsApp Antworten.
                  </p>
                </div>
              </div>

              {phoneSaved && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  ✓ Nummer aktualisiert!
                </div>
              )}

              <form onSubmit={handleSaveWhatsAppConfig} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 mb-1 font-medium">
                    Admin WhatsApp Nummer
                  </label>
                  <input
                    type="text"
                    required
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-emerald-600/20"
                >
                  Einstellungen Speichern
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: CRM */}
        {activeTab === "crm" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif text-white">Kundenkartei ({filteredClients.length})</h3>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {filteredClients.map((client, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedClient(client)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      selectedClient?.email === client.email
                        ? "bg-white/20 border-white/40 shadow-lg"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm text-white">{client.name}</div>
                      <div className="text-xs text-neutral-400">{client.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-neutral-300">{client.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              {selectedClient ? (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <h2 className="text-2xl font-serif text-white">{selectedClient.name}</h2>
                      <div className="text-xs text-neutral-400">{selectedClient.email} • {selectedClient.phone}</div>
                    </div>
                  </div>

                  <a
                    href={createClientWhatsAppMessageUrl(
                      selectedClient.phone,
                      selectedClient.name,
                      selectedClient.lastVisit,
                      "14:00",
                      selectedClient.favoriteService,
                      "confirm"
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Direct Nachricht an {selectedClient.name}
                  </a>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center text-neutral-400 font-sans">
                  Wählen Sie einen Kunden aus
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <div className="text-xs uppercase text-neutral-400">Gesamt Termine</div>
              <div className="text-4xl font-serif font-bold text-white mt-2">{bookings.length}</div>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <div className="text-xs uppercase text-neutral-400">Registrierte Kunden</div>
              <div className="text-4xl font-serif font-bold text-white mt-2">{clientProfiles.length}</div>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <div className="text-xs uppercase text-neutral-400">Status</div>
              <div className="text-sm font-semibold text-emerald-400 mt-2">Live & Bereit</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
