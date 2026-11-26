import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

const DATA_DIR = process.env.DATA_DIR || '/home/ubuntu/lnat-prep-data';
fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = path.join(DATA_DIR, 'ratio.db');

const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  crypto.createHash('sha256').update(`ratio-local-secret-${DB_PATH}`).digest('hex');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const STRIPE_PRICE_MONTHLY = process.env.STRIPE_PRICE_MONTHLY || '';
const STRIPE_PRICE_SEASON = process.env.STRIPE_PRICE_SEASON || '';
const APP_URL = process.env.APP_URL || '';
const ACCESS_CODES = new Set(
  (process.env.RATIO_ACCESS_CODES || 'RATIO-FOUNDER,RATIO-PRO-2026')
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)
);

const db = new DatabaseSync(DB_PATH);
db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'free',
    stripe_customer_id TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS user_sync (
    user_id TEXT PRIMARY KEY,
    payload TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS section_a_attempts (
    id TEXT PRIMARY KEY,
    mode TEXT NOT NULL,
    label TEXT NOT NULL,
    correct INTEGER NOT NULL,
    total INTEGER NOT NULL,
    projected_42 INTEGER NOT NULL,
    duration_seconds INTEGER NOT NULL,
    skill_breakdown TEXT NOT NULL,
    answers TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS section_b_essays (
    id TEXT PRIMARY KEY,
    prompt_id TEXT NOT NULL,
    prompt_text TEXT NOT NULL,
    set_title TEXT NOT NULL,
    plan_text TEXT NOT NULL,
    essay_text TEXT NOT NULL,
    word_count INTEGER NOT NULL,
    duration_seconds INTEGER NOT NULL,
    rubric_scores TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS question_reports (
    id TEXT PRIMARY KEY,
    question_id TEXT NOT NULL,
    reason TEXT NOT NULL,
    note TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPassword(password, stored) {
  const [salt, key] = String(stored || '').split(':');
  if (!salt || !key) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(key, 'hex');
  return keyBuf.length === derived.length && crypto.timingSafeEqual(keyBuf, derived);
}

function signSession(userId) {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
  const body = Buffer.from(JSON.stringify({ uid: userId, exp })).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verifySession(token) {
  if (!token || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(body).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!parsed.uid || parsed.exp < Date.now()) return null;
    return parsed.uid;
  } catch {
    return null;
  }
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const out = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx > 0) {
      out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return out;
}

function getSessionUser(req) {
  const cookies = parseCookies(req);
  const uid = verifySession(cookies.ratio_session);
  if (!uid) return null;
  const row = db
    .prepare('SELECT id, email, name, plan, stripe_customer_id, created_at FROM users WHERE id = ?')
    .get(uid);
  return row || null;
}

function setSessionCookie(res, userId) {
  const token = signSession(userId);
  const secure = process.env.NODE_ENV === 'production' && APP_URL.startsWith('https://');
  res.setHeader(
    'Set-Cookie',
    `ratio_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}${secure ? '; Secure' : ''}`
  );
}

const app = express();

// Stripe webhook needs raw body for HMAC-SHA256 verification
app.post('/api/billing/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  if (!STRIPE_WEBHOOK_SECRET) {
    return res.status(400).json({ error: 'Stripe webhook secret not configured' });
  }
  const sigHeader = req.headers['stripe-signature'] || '';
  const parts = Object.fromEntries(
    String(sigHeader)
      .split(',')
      .map((kv) => kv.split('='))
      .filter((p) => p.length === 2)
  );
  const rawBody = req.body instanceof Buffer ? req.body.toString('utf8') : String(req.body || '');
  const signedPayload = `${parts.t}.${rawBody}`;
  const expected = crypto
    .createHmac('sha256', STRIPE_WEBHOOK_SECRET)
    .update(signedPayload)
    .digest('hex');

  if (!parts.v1 || parts.v1 !== expected) {
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  try {
    const event = JSON.parse(rawBody);
    if (event.type === 'checkout.session.completed') {
      const session = event.data?.object;
      const uid = session?.client_reference_id;
      const email = session?.customer_details?.email;
      const customerId = session?.customer || null;
      if (uid) {
        db.prepare('UPDATE users SET plan = ?, stripe_customer_id = ? WHERE id = ?').run(
          'pro',
          customerId,
          uid
        );
      } else if (email) {
        db.prepare('UPDATE users SET plan = ?, stripe_customer_id = ? WHERE email = ?').run(
          'pro',
          customerId,
          String(email).toLowerCase()
        );
      }
    } else if (event.type === 'customer.subscription.deleted') {
      const sub = event.data?.object;
      if (sub?.customer) {
        db.prepare('UPDATE users SET plan = ? WHERE stripe_customer_id = ?').run(
          'free',
          String(sub.customer)
        );
      }
    }
    res.json({ received: true });
  } catch (err) {
    res.status(400).json({ error: 'Webhook parse error' });
  }
});

app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    dbPath: DB_PATH,
    stripeConfigured: Boolean(STRIPE_SECRET_KEY && (STRIPE_PRICE_MONTHLY || STRIPE_PRICE_SEASON)),
  });
});

/* ── Authentication ─────────────────────────────────────────────────────── */
app.get('/api/auth/me', (req, res) => {
  const user = getSessionUser(req);
  res.json({
    user,
    stripeConfigured: Boolean(STRIPE_SECRET_KEY && (STRIPE_PRICE_MONTHLY || STRIPE_PRICE_SEASON)),
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body || {};
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanName = String(name || '').trim() || cleanEmail.split('@')[0] || 'Student';
  if (!cleanEmail || !cleanEmail.includes('@') || String(password || '').length < 6) {
    return res.status(400).json({ error: 'Enter a valid email and a password of at least 6 characters.' });
  }
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists. Try signing in.' });
  }
  const id = `usr-${crypto.randomUUID()}`;
  const createdAt = new Date().toISOString();
  db.prepare(
    'INSERT INTO users (id, email, name, password_hash, plan, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, cleanEmail, cleanName, hashPassword(String(password)), 'free', createdAt);

  setSessionCookie(res, id);
  res.status(201).json({
    user: { id, email: cleanEmail, name: cleanName, plan: 'free', created_at: createdAt },
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const cleanEmail = String(email || '').trim().toLowerCase();
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);
  if (!row || !verifyPassword(String(password || ''), row.password_hash)) {
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }
  setSessionCookie(res, row.id);
  res.json({
    user: {
      id: row.id,
      email: row.email,
      name: row.name,
      plan: row.plan,
      created_at: row.created_at,
    },
  });
});

app.post('/api/auth/logout', (_req, res) => {
  res.setHeader('Set-Cookie', 'ratio_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  res.json({ ok: true });
});

/* ── Cloud Progress Sync ────────────────────────────────────────────────── */
app.get('/api/sync', (req, res) => {
  const user = getSessionUser(req);
  if (!user) return res.status(401).json({ error: 'Sign in required' });
  const row = db.prepare('SELECT payload, updated_at FROM user_sync WHERE user_id = ?').get(user.id);
  res.json({ payload: row ? JSON.parse(row.payload) : null, updated_at: row?.updated_at || null });
});

app.post('/api/sync', (req, res) => {
  const user = getSessionUser(req);
  if (!user) return res.status(401).json({ error: 'Sign in required' });
  const updated_at = new Date().toISOString();
  db.prepare(
    'INSERT OR REPLACE INTO user_sync (user_id, payload, updated_at) VALUES (?, ?, ?)'
  ).run(user.id, JSON.stringify(req.body || {}), updated_at);
  res.json({ ok: true, updated_at });
});

/* ── Billing: Stripe Checkout + Customer Portal + Access Code Redemption ── */
app.post('/api/billing/checkout', async (req, res) => {
  const { tier } = req.body || {}; // 'monthly' | 'season'
  const priceId = tier === 'season' ? STRIPE_PRICE_SEASON : STRIPE_PRICE_MONTHLY;
  if (!STRIPE_SECRET_KEY || !priceId) {
    return res.status(501).json({
      error: 'Stripe is not configured on this server yet.',
      setupRequired: true,
    });
  }
  const user = getSessionUser(req);
  const origin = APP_URL || `${req.protocol}://${req.get('host')}`;
  const params = new URLSearchParams({
    mode: tier === 'season' ? 'payment' : 'subscription',
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    success_url: `${origin}/?checkout=success`,
    cancel_url: `${origin}/?checkout=cancelled`,
  });
  if (user) {
    params.set('client_reference_id', user.id);
    params.set('customer_email', user.email);
  }
  try {
    const resp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    const data = await resp.json();
    if (!resp.ok) {
      return res.status(502).json({ error: data.error?.message || 'Stripe checkout failed' });
    }
    res.json({ url: data.url });
  } catch (err) {
    res.status(502).json({ error: 'Could not reach Stripe API' });
  }
});

app.post('/api/billing/redeem', (req, res) => {
  const code = String(req.body?.code || '').trim().toUpperCase();
  if (!ACCESS_CODES.has(code)) {
    return res.status(400).json({ error: 'Invalid or expired access code.' });
  }
  const user = getSessionUser(req);
  if (user) {
    db.prepare('UPDATE users SET plan = ? WHERE id = ?').run('pro', user.id);
  }
  res.json({ ok: true, plan: 'pro' });
});

/* ── Existing LNAT Attempts, Essays & Question Reports ──────────────────── */
app.get('/api/attempts', (_req, res) => {
  const rows = db
    .prepare('SELECT * FROM section_a_attempts ORDER BY created_at DESC LIMIT 50')
    .all();
  res.json(
    rows.map((r) => ({
      ...r,
      skill_breakdown: JSON.parse(r.skill_breakdown),
      answers: JSON.parse(r.answers),
    }))
  );
});

app.post('/api/attempts', (req, res) => {
  const {
    id,
    mode,
    label,
    correct,
    total,
    projected_42,
    duration_seconds,
    skill_breakdown,
    answers,
  } = req.body || {};

  if (!id || !mode || typeof correct !== 'number' || typeof total !== 'number') {
    return res.status(400).json({ error: 'Invalid attempt payload' });
  }

  const created_at = new Date().toISOString();
  db.prepare(
    `INSERT OR REPLACE INTO section_a_attempts
     (id, mode, label, correct, total, projected_42, duration_seconds, skill_breakdown, answers, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    String(id),
    String(mode),
    String(label || mode),
    Math.round(correct),
    Math.round(total),
    Math.round(projected_42 || 0),
    Math.round(duration_seconds || 0),
    JSON.stringify(skill_breakdown || {}),
    JSON.stringify(answers || {}),
    created_at
  );

  res.status(201).json({ id, created_at });
});

app.get('/api/essays', (_req, res) => {
  const rows = db
    .prepare('SELECT * FROM section_b_essays ORDER BY created_at DESC LIMIT 30')
    .all();
  res.json(
    rows.map((r) => ({
      ...r,
      rubric_scores: JSON.parse(r.rubric_scores),
    }))
  );
});

app.post('/api/essays', (req, res) => {
  const {
    id,
    prompt_id,
    prompt_text,
    set_title,
    plan_text,
    essay_text,
    word_count,
    duration_seconds,
    rubric_scores,
  } = req.body || {};

  if (!id || !prompt_id || typeof essay_text !== 'string') {
    return res.status(400).json({ error: 'Invalid essay payload' });
  }

  const created_at = new Date().toISOString();
  db.prepare(
    `INSERT OR REPLACE INTO section_b_essays
     (id, prompt_id, prompt_text, set_title, plan_text, essay_text, word_count, duration_seconds, rubric_scores, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    String(id),
    String(prompt_id),
    String(prompt_text || ''),
    String(set_title || ''),
    String(plan_text || ''),
    essay_text,
    Math.round(word_count || 0),
    Math.round(duration_seconds || 0),
    JSON.stringify(rubric_scores || {}),
    created_at
  );

  res.status(201).json({ id, created_at });
});

app.post('/api/reports', (req, res) => {
  const { question_id, reason, note } = req.body || {};
  if (!question_id || !reason) {
    return res.status(400).json({ error: 'Missing question_id or reason' });
  }
  const id = `rep-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const created_at = new Date().toISOString();
  db.prepare(
    `INSERT INTO question_reports (id, question_id, reason, note, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).run(id, String(question_id), String(reason), String(note || ''), created_at);
  res.status(201).json({ id, created_at });
});

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR, { maxAge: '1h' }));
  app.get('/{*splat}', (_req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.status(503).send('Build not found. Run npm run build first.');
  });
}

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Ratio Studio server listening on http://0.0.0.0:${PORT}`);
});
