import { Client } from 'pg';

export default async function handler(req, res) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();

    if (req.method === 'GET') {
      const email = req.query.email;
      const type = req.query.type; // 'users' or 'bookings'

      if (type === 'users') {
        const usersResult = await client.query('SELECT * FROM registered_users ORDER BY registered_at DESC');
        return res.status(200).json(usersResult.rows);
      }

      if (email) {
        const result = await client.query(
          'SELECT * FROM bookings WHERE LOWER(email) = LOWER($1) ORDER BY created_at DESC',
          [email]
        );
        return res.status(200).json(result.rows);
      }

      const result = await client.query('SELECT * FROM bookings ORDER BY created_at DESC');
      return res.status(200).json(result.rows);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || req.query;
      if (!id) {
        return res.status(400).json({ error: 'Missing booking ID' });
      }

      await client.query('DELETE FROM bookings WHERE id = $1', [id]);
      return res.status(200).json({ success: true, id });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Bookings API error:', error);
    return res.status(500).json({ error: 'Database error', details: error.message });
  } finally {
    try {
      await client.end();
    } catch (_) {}
  }
}
