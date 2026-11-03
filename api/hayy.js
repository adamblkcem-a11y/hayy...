import { neon } from '@neondatabase/serverless';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

const sql = neon(process.env.DATABASE_URL);
const ZONES = ['Harbor', 'Old Quarter', 'Market', 'Hillside', 'Garden', 'Eastgate', 'University'];
const ROLES = ['citizen', 'worker', 'company'];

const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const hash = s => createHash('sha256').update(s).digest('hex');
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

async function auth(req) {
  const h = req.headers.get('authorization') || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!token) return null;
  const rows = await sql`SELECT id, uid, role, name, email, phone, zone, company_name, company_zones, created_at FROM hayy_members WHERE token_hash = ${hash(token)}`;
  return rows[0] || null;
}

function isAdmin(req) {
  const want = process.env.ADMIN_PASSWORD || '';
  const got = req.headers.get('x-admin-key') || '';
  if (!want || got.length !== want.length) return false;
  return timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

async function register(body) {
  const role = ROLES.includes(body.role) ? body.role : null;
  const uid = str(body.uid, 64), name = str(body.name, 80), email = str(body.email, 120).toLowerCase();
  const phone = str(body.phone, 20).replace(/[\s-]/g, ''), zone = str(body.zone, 40);
  if (!role || !uid) return json({ error: 'invalid' }, 400);
  if (name.length < 3) return json({ error: 'e_name' }, 400);
  if (!/^\S+@\S+\.\S+$/.test(email)) return json({ error: 'e_email' }, 400);
  if (!/^(\+213|0)[567]\d{8}$/.test(phone)) return json({ error: 'e_phone' }, 400);
  if (!ZONES.includes(zone)) return json({ error: 'invalid' }, 400);
  let companyName = null, companyZones = [];
  if (role === 'company') {
    companyName = str(body.companyName, 100);
    companyZones = [...new Set((Array.isArray(body.companyZones) ? body.companyZones : []).filter(z => ZONES.includes(z)))];
    if (companyName.length < 2) return json({ error: 'e_cname' }, 400);
    if (!companyZones.length) return json({ error: 'e_czones' }, 400);
  }
  const token = randomBytes(32).toString('hex');
  const rows = await sql`INSERT INTO hayy_members (uid, role, name, email, phone, zone, company_name, company_zones, token_hash)
    VALUES (${uid}, ${role}, ${name}, ${email}, ${phone}, ${zone}, ${companyName}, ${companyZones}, ${hash(token)})
    ON CONFLICT (uid) DO NOTHING RETURNING id`;
  if (!rows.length) return json({ error: 'exists' }, 409);
  return json({ token, id: rows[0].id });
}

async function me(member) {
  if (member.role === 'worker') {
    const apps = await sql`SELECT a.id, a.status, a.company_id, c.company_name, c.company_zones FROM hayy_applications a JOIN hayy_members c ON c.id = a.company_id WHERE a.worker_id = ${member.id} ORDER BY a.created_at DESC`;
    const companies = await sql`SELECT id, company_name, company_zones FROM hayy_members WHERE role = 'company' AND ${member.zone} = ANY(company_zones) ORDER BY created_at DESC LIMIT 50`;
    return json({ member, applications: apps, companies });
  }
  if (member.role === 'company') {
    const apps = await sql`SELECT a.id, a.status, a.created_at, w.name, w.phone, w.email, w.zone FROM hayy_applications a JOIN hayy_members w ON w.id = a.worker_id WHERE a.company_id = ${member.id} ORDER BY a.created_at DESC`;
    return json({ member, applicants: apps });
  }
  return json({ member });
}

async function apply(member, body) {
  if (member.role !== 'worker') return json({ error: 'forbidden' }, 403);
  const companyId = str(body.companyId, 40);
  const ok = await sql`SELECT id FROM hayy_members WHERE id::text = ${companyId} AND role = 'company' AND ${member.zone} = ANY(company_zones)`;
  if (!ok.length) return json({ error: 'zone' }, 400);
  await sql`INSERT INTO hayy_applications (worker_id, company_id) VALUES (${member.id}, ${companyId}) ON CONFLICT (worker_id, company_id) DO NOTHING`;
  return json({ ok: true });
}

async function decide(member, body) {
  if (member.role !== 'company') return json({ error: 'forbidden' }, 403);
  const status = ['accepted', 'rejected'].includes(body.status) ? body.status : null;
  if (!status) return json({ error: 'invalid' }, 400);
  const rows = await sql`UPDATE hayy_applications SET status = ${status} WHERE id::text = ${str(body.applicationId, 40)} AND company_id = ${member.id} RETURNING id`;
  return rows.length ? json({ ok: true }) : json({ error: 'not_found' }, 404);
}

async function admin() {
  const members = await sql`SELECT id, role, name, email, phone, zone, company_name, company_zones, created_at FROM hayy_members ORDER BY created_at DESC`;
  const applications = await sql`SELECT a.id, a.status, a.created_at, w.name AS worker_name, w.phone AS worker_phone, c.company_name FROM hayy_applications a JOIN hayy_members w ON w.id = a.worker_id JOIN hayy_members c ON c.id = a.company_id ORDER BY a.created_at DESC`;
  return json({ members, applications });
}

export async function GET(req) {
  try {
    const action = new URL(req.url).searchParams.get('action');
    if (action === 'admin') return isAdmin(req) ? admin() : json({ error: 'unauthorized' }, 401);
    if (action === 'me') { const m = await auth(req); return m ? me(m) : json({ error: 'unauthorized' }, 401); }
    return json({ error: 'not_found' }, 404);
  } catch (e) { console.error(e); return json({ error: 'server' }, 500); }
}

export async function POST(req) {
  try {
    const action = new URL(req.url).searchParams.get('action');
    const body = await req.json().catch(() => ({}));
    if (action === 'register') return register(body);
    const m = await auth(req); if (!m) return json({ error: 'unauthorized' }, 401);
    if (action === 'apply') return apply(m, body);
    if (action === 'decide') return decide(m, body);
    return json({ error: 'not_found' }, 404);
  } catch (e) { console.error(e); return json({ error: 'server' }, 500); }
}
