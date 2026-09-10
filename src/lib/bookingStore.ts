import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  service: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

function getSql() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return null;
  try {
    return neon(dbUrl);
  } catch (e) {
    console.warn("Neon init warning:", e);
    return null;
  }
}

// Helper for local JSON backup storage
const STORAGE_PATH = path.join(process.cwd(), "scratch", "bookings.json");

function ensureDirectoryExists() {
  const dir = path.dirname(STORAGE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Auto-initialize Neon PostgreSQL Table
let tableInitialized = false;
async function initNeonTable() {
  if (tableInitialized) return;
  const sql = getSql();
  if (!sql) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        date VARCHAR(50) NOT NULL,
        time VARCHAR(50) NOT NULL,
        service VARCHAR(255) NOT NULL,
        notes TEXT,
        status VARCHAR(50) NOT NULL,
        created_at VARCHAR(100) NOT NULL
      );
    `;
    tableInitialized = true;
  } catch (err) {
    console.warn("Neon DB Table init warning:", err);
  }
}

export async function getBookingsDB(): Promise<Booking[]> {
  try {
    const sql = getSql();
    if (sql) {
      await initNeonTable();
      const rows = await sql`
        SELECT id, name, email, phone, date, time, service, notes, status, created_at as "createdAt"
        FROM bookings
        ORDER BY created_at DESC
      `;
      if (rows && rows.length > 0) {
        return rows as Booking[];
      }
    }
  } catch (err) {
    console.warn("Neon DB read error, using local storage fallback:", err);
  }

  // Fallback to local storage
  ensureDirectoryExists();
  if (fs.existsSync(STORAGE_PATH)) {
    try {
      const data = fs.readFileSync(STORAGE_PATH, "utf-8");
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }
  return [];
}

export async function saveBookingDB(
  bookingData: Omit<Booking, "id" | "status" | "createdAt">
): Promise<Booking> {
  const newBooking: Booking = {
    ...bookingData,
    id: `bk-${Date.now().toString().slice(-4)}`,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  // Save to Neon Database
  try {
    const sql = getSql();
    if (sql) {
      await initNeonTable();
      await sql`
        INSERT INTO bookings (id, name, email, phone, date, time, service, notes, status, created_at)
        VALUES (
          ${newBooking.id},
          ${newBooking.name},
          ${newBooking.email},
          ${newBooking.phone || ""},
          ${newBooking.date},
          ${newBooking.time},
          ${newBooking.service},
          ${newBooking.notes || ""},
          ${newBooking.status},
          ${newBooking.createdAt}
        )
      `;
    }
  } catch (err) {
    console.warn("Neon DB insert error, using local fallback:", err);
  }

  // Backup to local file storage
  try {
    ensureDirectoryExists();
    let current: Booking[] = [];
    if (fs.existsSync(STORAGE_PATH)) {
      current = JSON.parse(fs.readFileSync(STORAGE_PATH, "utf-8"));
    }
    current.unshift(newBooking);
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(current, null, 2));
  } catch (e) {
    console.warn("Local storage write error:", e);
  }

  return newBooking;
}

export async function updateBookingStatusDB(id: string, status: Booking["status"]): Promise<Booking | null> {
  try {
    const sql = getSql();
    if (sql) {
      await initNeonTable();
      await sql`
        UPDATE bookings
        SET status = ${status}
        WHERE id = ${id}
      `;
    }
  } catch (err) {
    console.warn("Neon DB update error:", err);
  }

  // Local backup update
  try {
    ensureDirectoryExists();
    if (fs.existsSync(STORAGE_PATH)) {
      const current: Booking[] = JSON.parse(fs.readFileSync(STORAGE_PATH, "utf-8"));
      const item = current.find((b) => b.id === id);
      if (item) {
        item.status = status;
        fs.writeFileSync(STORAGE_PATH, JSON.stringify(current, null, 2));
        return item;
      }
    }
  } catch (e) {
    console.warn("Local storage update error:", e);
  }

  return null;
}
