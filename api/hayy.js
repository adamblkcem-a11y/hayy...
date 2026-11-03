import { neon } from '@neondatabase/serverless';
import { createHash, randomBytes, randomInt, scryptSync, timingSafeEqual } from 'node:crypto';

const sql = neon(process.env.DATABASE_URL);
let schemaReady = null;
const ensureSchema = () => (schemaReady ||= (async () => {
  await sql`ALTER TABLE hayy_members ADD COLUMN IF NOT EXISTS password_hash text`;
  await sql`ALTER TABLE hayy_members ADD COLUMN IF NOT EXISTS verified boolean NOT NULL DEFAULT true`;
  await sql`ALTER TABLE hayy_members ADD COLUMN IF NOT EXISTS verify_code text`;
  await sql`ALTER TABLE hayy_members ADD COLUMN IF NOT EXISTS verify_expires timestamptz`;
  await sql`ALTER TABLE hayy_members ADD COLUMN IF NOT EXISTS verify_attempts int NOT NULL DEFAULT 0`;
  await sql`ALTER TABLE hayy_members ADD COLUMN IF NOT EXISTS verify_sent_at timestamptz`;
  await sql`ALTER TABLE hayy_members ADD COLUMN IF NOT EXISTS email_sent boolean NOT NULL DEFAULT false`;
})().catch(e => { schemaReady = null; throw e; }));

const hashPassword = pw => { const salt = randomBytes(16).toString('hex'); return salt + ':' + scryptSync(pw, salt, 64).toString('hex'); };
const checkPassword = (pw, stored) => {
  if (!stored || !stored.includes(':')) return false;
  const [salt, key] = stored.split(':'), a = Buffer.from(key, 'hex'), b = scryptSync(pw, salt, 64);
  return a.length === b.length && timingSafeEqual(a, b);
};
const newCode = () => String(randomInt(0, 1000000)).padStart(6, '0');

const codeSubject = (code) => 'رمز تفعيل حسابك في حيّ: ' + code;
const codeHtml = (name, code) => `<div dir="rtl" style="font-family:sans-serif;font-size:16px;line-height:1.6">مرحباً ${name.replace(/[<>&"]/g, '')}،<br>رمز تفعيل حسابك هو:<div style="font-size:32px;font-weight:700;letter-spacing:6px;margin:12px 0">${code}</div>الرمز صالح لمدة 15 دقيقة.</div>`;

let gmailTransport;
async function sendViaGmail(email, name, code) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '');
  if (!user || !pass) return false;
  try {
    if (!gmailTransport) {
      const { default: nodemailer } = await import('nodemailer');
      gmailTransport = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
    }
    await gmailTransport.sendMail({ from: `Hayy <${user}>`, to: email, subject: codeSubject(code), html: codeHtml(name, code) });
    return true;
  } catch (e) { console.error('gmail', e.message); return false; }
}

async function sendCode(email, name, code) {
  if (await sendViaGmail(email, name, code)) return true;
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const domain = process.env.RESEND_EMAIL_DOMAIN;
  const senders = [process.env.EMAIL_FROM, domain && `Hayy <noreply@${domain}>`, 'Hayy <onboarding@resend.dev>'].filter(Boolean);
  try {
  for (const from of senders) {
  const r = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' },
  body: JSON.stringify({
  from,
  to: [email],
        subject: codeSubject(code),
        html: codeHtml(name, code),
      }),
    });
    if (r.ok) return true;
    console.error('resend', from, r.status, await r.text());
  }
  return false;
  } catch (e) { console.error(e); return false; }
}

async function issueCode(member) {
  const code = newCode();
  const sent = await sendCode(member.email, member.name, code);
  await sql`UPDATE hayy_members SET verify_code = ${code}, verify_expires = now() + interval '15 minutes', verify_attempts = 0, verify_sent_at = now(), email_sent = ${sent} WHERE id = ${member.id}`;
  return sent;
}
const ZONES = ["Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra","Béchar","Blida","Bouira","Tamanrasset","Tébessa","Tlemcen","Tiaret","Tizi Ouzou","Algiers","Djelfa","Jijel","Sétif","Saïda","Skikda","Sidi Bel Abbès","Annaba","Guelma","Constantine","Médéa","Mostaganem","M'Sila","Mascara","Ouargla","Oran","El Bayadh","Illizi","Bordj Bou Arréridj","Boumerdès","El Tarf","Tindouf","Tissemsilt","El Oued","Khenchela","Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma","Aïn Témouchent","Ghardaïa","Relizane","Timimoun","Bordj Badji Mokhtar","Ouled Djellal","Béni Abbès","In Salah","In Guezzam","Touggourt","Djanet","El M'Ghair","El Meniaa"];
const ROLES = ['citizen', 'worker', 'company'];

const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const hash = s => createHash('sha256').update(s).digest('hex');
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

async function auth(req) {
  const h = req.headers.get('authorization') || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!token) return null;
  const rows = await sql`SELECT id, uid, role, name, email, phone, zone, company_name, company_zones, verified, created_at FROM hayy_members WHERE token_hash = ${hash(token)}`;
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
  const password = typeof body.password === 'string' ? body.password : '';
  if (password.length < 8 || password.length > 128) return json({ error: 'e_pw' }, 400);
  const taken = await sql`SELECT 1 FROM hayy_members WHERE lower(email) = ${email} AND password_hash IS NOT NULL`;
  if (taken.length) return json({ error: 'e_taken' }, 409);
  let companyName = null, companyZones = [];
  if (role === 'company') {
    companyName = str(body.companyName, 100);
    companyZones = [...new Set((Array.isArray(body.companyZones) ? body.companyZones : []).filter(z => ZONES.includes(z)))];
    if (companyName.length < 2) return json({ error: 'e_cname' }, 400);
    if (!companyZones.length) return json({ error: 'e_czones' }, 400);
  }
  const token = randomBytes(32).toString('hex');
  const rows = await sql`INSERT INTO hayy_members (uid, role, name, email, phone, zone, company_name, company_zones, token_hash, password_hash, verified)
    VALUES (${uid}, ${role}, ${name}, ${email}, ${phone}, ${zone}, ${companyName}, ${companyZones}, ${hash(token)}, ${hashPassword(password)}, false)
    ON CONFLICT (uid) DO NOTHING RETURNING id`;
  if (!rows.length) return json({ error: 'exists' }, 409);
  const emailSent = await issueCode({ id: rows[0].id, email, name });
  return json({ token, id: rows[0].id, emailSent });
}

async function login(body) {
  const email = str(body.email, 120).toLowerCase(), password = typeof body.password === 'string' ? body.password : '';
  const rows = await sql`SELECT id, uid, password_hash FROM hayy_members WHERE lower(email) = ${email} AND password_hash IS NOT NULL LIMIT 1`;
  if (!rows.length || !checkPassword(password, rows[0].password_hash)) return json({ error: 'e_login' }, 401);
  const token = randomBytes(32).toString('hex');
  await sql`UPDATE hayy_members SET token_hash = ${hash(token)} WHERE id = ${rows[0].id}`;
  return json({ token, uid: rows[0].uid });
}

async function verify(member, body) {
  if (member.verified) return json({ ok: true });
  const code = str(body.code, 6);
  const rows = await sql`SELECT verify_code, verify_expires, verify_attempts FROM hayy_members WHERE id = ${member.id}`;
  const r = rows[0];
  if (!r || !r.verify_code || new Date(r.verify_expires) < new Date()) return json({ error: 'e_expired' }, 400);
  if (r.verify_attempts >= 5) return json({ error: 'e_attempts' }, 429);
  if (code !== r.verify_code) {
    await sql`UPDATE hayy_members SET verify_attempts = verify_attempts + 1 WHERE id = ${member.id}`;
    return json({ error: 'e_code' }, 400);
  }
  await sql`UPDATE hayy_members SET verified = true, verify_code = NULL, verify_expires = NULL WHERE id = ${member.id}`;
  return json({ ok: true });
}

async function resend(member) {
  if (member.verified) return json({ ok: true });
  const rows = await sql`SELECT verify_sent_at > now() - interval '60 seconds' AS recent FROM hayy_members WHERE id = ${member.id}`;
  if (rows[0] && rows[0].recent) return json({ error: 'e_wait' }, 429);
  return json({ ok: true, emailSent: await issueCode(member) });
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
  if (!member.verified) return json({ error: 'e_unverified' }, 403);
  if (member.role !== 'worker') return json({ error: 'forbidden' }, 403);
  const companyId = str(body.companyId, 40);
  const ok = await sql`SELECT id FROM hayy_members WHERE id::text = ${companyId} AND role = 'company' AND ${member.zone} = ANY(company_zones)`;
  if (!ok.length) return json({ error: 'zone' }, 400);
  await sql`INSERT INTO hayy_applications (worker_id, company_id) VALUES (${member.id}, ${companyId}) ON CONFLICT (worker_id, company_id) DO NOTHING`;
  return json({ ok: true });
}

async function decide(member, body) {
  if (!member.verified) return json({ error: 'e_unverified' }, 403);
  if (member.role !== 'company') return json({ error: 'forbidden' }, 403);
  const status = ['accepted', 'rejected'].includes(body.status) ? body.status : null;
  if (!status) return json({ error: 'invalid' }, 400);
  const rows = await sql`UPDATE hayy_applications SET status = ${status} WHERE id::text = ${str(body.applicationId, 40)} AND company_id = ${member.id} RETURNING id`;
  return rows.length ? json({ ok: true }) : json({ error: 'not_found' }, 404);
}

async function admin() {
  const members = await sql`SELECT id, role, name, email, phone, zone, company_name, company_zones, verified, email_sent,
    CASE WHEN NOT verified AND verify_expires > now() THEN verify_code END AS pending_code, created_at FROM hayy_members ORDER BY created_at DESC`;
  const applications = await sql`SELECT a.id, a.status, a.created_at, w.name AS worker_name, w.phone AS worker_phone, c.company_name FROM hayy_applications a JOIN hayy_members w ON w.id = a.worker_id JOIN hayy_members c ON c.id = a.company_id ORDER BY a.created_at DESC`;
  return json({ members, applications });
}

export async function GET(req) {
  try {
    const action = new URL(req.url).searchParams.get('action');
    if (action === 'config') return json({ mapsKey: process.env.GOOGLE_MAPS_API_KEY || null });
    await ensureSchema();
    if (action === 'admin') return isAdmin(req) ? admin() : json({ error: 'unauthorized' }, 401);
    if (action === 'me') { const m = await auth(req); return m ? me(m) : json({ error: 'unauthorized' }, 401); }
    return json({ error: 'not_found' }, 404);
  } catch (e) { console.error(e); return json({ error: 'server' }, 500); }
}

export async function POST(req) {
  try {
    await ensureSchema();
    const action = new URL(req.url).searchParams.get('action');
    const body = await req.json().catch(() => ({}));
    if (action === 'register') return register(body);
    if (action === 'login') return login(body);
    const m = await auth(req); if (!m) return json({ error: 'unauthorized' }, 401);
    if (action === 'verify') return verify(m, body);
    if (action === 'resend') return resend(m);
    if (action === 'apply') return apply(m, body);
    if (action === 'decide') return decide(m, body);
    return json({ error: 'not_found' }, 404);
  } catch (e) { console.error(e); return json({ error: 'server' }, 500); }
}
