import { Client } from 'pg';
import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Erhöhtes Limit für Bilder
    },
  },
};

export default async function handler(req, res) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();

    if (req.method === 'GET') {
      const result = await client.query('SELECT key, value, type, label FROM site_settings');
      const settings = {};
      result.rows.forEach(row => {
        settings[row.key] = { value: row.value, type: row.type, label: row.label };
      });
      res.status(200).json(settings);
    } 
    else if (req.method === 'POST') {
      const { action, key, value, data, filename } = req.body;

      if (action === 'update_price') {
        await client.query('UPDATE site_settings SET value = $1 WHERE key = $2', [value, key]);
        res.status(200).json({ success: true, key, value });
      } 
      else if (action === 'upload_image') {
        // base64 to buffer
        const base64Data = data.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        
        // upload to blob
        const blob = await put(filename, buffer, { 
          access: 'public', 
          token: process.env.BLOB_READ_WRITE_TOKEN 
        });

        // update database with the new URL
        await client.query('UPDATE site_settings SET value = $1 WHERE key = $2', [blob.url, key]);
        
        res.status(200).json({ success: true, key, url: blob.url });
      } else {
        res.status(400).json({ error: 'Unknown action' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    await client.end();
  }
}
