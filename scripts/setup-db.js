import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

await sql`CREATE TABLE IF NOT EXISTS hayy_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uid text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('citizen', 'worker', 'company')),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  zone text NOT NULL,
  company_name text,
  company_zones text[] NOT NULL DEFAULT '{}',
  token_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
)`;

await sql`CREATE TABLE IF NOT EXISTS hayy_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES hayy_members(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES hayy_members(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (worker_id, company_id)
)`;

await sql`CREATE INDEX IF NOT EXISTS hayy_members_zones_idx ON hayy_members USING gin (company_zones)`;

console.log('Hayy tables ready');
