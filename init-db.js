const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function init() {
  await client.connect();
  console.log("Connected to DB.");

  await client.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id SERIAL PRIMARY KEY,
      key VARCHAR(255) UNIQUE NOT NULL,
      value TEXT,
      type VARCHAR(50) DEFAULT 'text',
      label VARCHAR(255)
    );
  `);
  console.log("Table created.");

  // Insert some default image URLs and prices based on current HTML
  const defaultSettings = [
    // Images
    { key: 'img_hero_bg', value: './Salon/hero_work.png', type: 'image', label: 'Hero Hintergrundbild' },
    { key: 'img_hero_featured', value: './Arbeit/craft.png', type: 'image', label: 'Hero Featured (Balayage & Airtouch)' },
    { key: 'img_framer_craft', value: './Arbeit/craft.png', type: 'image', label: 'CRAFT Card Bild' },
    { key: 'img_framer_studio', value: './Salon/DSC03348.JPG', type: 'image', label: 'STUDIO Card Bild' },
    { key: 'img_framer_artistry', value: './Arbeit/825310074_1396808228712906_4132944310838981144_n.jpg', type: 'image', label: 'ARTISTRY Card Bild' },
    { key: 'img_framer_results', value: './Arbeit/results.png', type: 'image', label: 'RESULTS Card Bild' },
    { key: 'img_intro_portrait', value: './Ich/Nazik.jpg', type: 'image', label: 'Intro Portrait Nazik' },
    
    // Prices - Damen
    { key: 'price_damen_kurz', value: '55 €', type: 'price', label: 'Damen Kurz (Waschen / Schneiden / Style)' },
    { key: 'price_damen_mittel', value: 'ab 57 €', type: 'price', label: 'Damen Mittel (Waschen / Schneiden / Style)' },
    { key: 'price_damen_lang', value: 'ab 60 €', type: 'price', label: 'Damen Lang (Waschen / Schneiden / Style)' },
    { key: 'price_damen_trocken', value: 'ab 40 €', type: 'price', label: 'Trockenschnitt Damen' },
    { key: 'price_damen_styling', value: 'ab 40 €', type: 'price', label: 'Styling (Waschen & Stylen)' },
    { key: 'price_farbe_ansatz', value: 'ab 50 €', type: 'price', label: 'Ansatzfärbung (bis 2 cm)' },
    { key: 'price_farbe_glossing', value: 'ab 50 €', type: 'price', label: 'Tönung / Glossing' },
    { key: 'price_farbe_komplett', value: 'ab 55 €', type: 'price', label: 'Komplettfärbung' },
    { key: 'price_farbe_straehnen', value: 'ab 150 €', type: 'price', label: 'Strähnen inkl. Glossing' },
    { key: 'price_farbe_balayage', value: 'ab 150 €', type: 'price', label: 'Balayage / AirTouch' },

    // Prices - Herren
    { key: 'price_herren_trocken', value: '28 €', type: 'price', label: 'Herren Haarschnitt trocken' },
    { key: 'price_herren_waschen_schneiden', value: '35 €', type: 'price', label: 'Herren Waschen / Schneiden / Styling' },

    // Prices - Extras
    { key: 'price_extra_pflege', value: '25 €', type: 'price', label: 'Intensive Pflege' },
    { key: 'price_extra_kopfhaut', value: '15 €', type: 'price', label: 'Kopfhautmassage' },
    { key: 'price_extra_kinder', value: '20 €', type: 'price', label: 'Kinderhaarschnitt' },
    { key: 'price_extra_augenbrauen', value: '10 €', type: 'price', label: 'Augenbrauen zupfen / färben' },
    { key: 'price_extra_wimpern', value: '15 €', type: 'price', label: 'Wimpern färben' },
  ];

  for (let s of defaultSettings) {
    await client.query(`
      INSERT INTO site_settings (key, value, type, label)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (key) DO NOTHING;
    `, [s.key, s.value, s.type, s.label]);
  }
  
  console.log("Default settings inserted.");
  await client.end();
}

init().catch(console.error);
