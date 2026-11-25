import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

const DATA_DIR = process.env.DATA_DIR || '/home/ubuntu/lnat-prep-data';
fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = path.join(DATA_DIR, 'ratio.db');

const db = new DatabaseSync(DB_PATH);
db.exec(`
  PRAGMA journal_mode = WAL;
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

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, dbPath: DB_PATH });
});

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
  console.log(`Ratio LNAT server listening on http://0.0.0.0:${PORT}`);
});
