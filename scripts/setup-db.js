const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  await client.connect();
  console.log("Connected to Neon DB.");

  await client.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(255),
      date VARCHAR(50) NOT NULL,
      time VARCHAR(50) NOT NULL,
      service VARCHAR(255),
      price VARCHAR(50),
      status VARCHAR(50) DEFAULT 'confirmed',
      notes TEXT,
      created_at VARCHAR(100)
    );
  `);

  await client.query(`
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS price VARCHAR(50);
  `);

  await client.query(`
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS duration INT DEFAULT 30;
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS registered_users (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(255),
      registered_at VARCHAR(100)
    );
  `);

  console.log("Database schema successfully set up.");
  await client.end();
}

main().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});
