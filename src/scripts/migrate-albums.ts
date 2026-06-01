import { Client } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL!;

async function migrate() {
  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('Connected to database');

  await client.query(`
    CREATE TABLE IF NOT EXISTS photo_albums (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name_en TEXT NOT NULL,
      name_fr TEXT,
      cover_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('Created photo_albums table');

  await client.query(`
    ALTER TABLE media ADD COLUMN IF NOT EXISTS album_id UUID REFERENCES photo_albums(id) ON DELETE SET NULL;
  `);
  console.log('Added album_id column to media table');

  await client.end();
  console.log('Migration complete!');
}

migrate().catch(console.error);
