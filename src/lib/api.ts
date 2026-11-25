import { SectionAAttempt, SectionBEssayRecord } from '../types';

const ATTEMPTS_KEY = 'ratio_lnat_attempts_v1';
const ESSAYS_KEY = 'ratio_lnat_essays_v1';
const REPORTS_KEY = 'ratio_lnat_reports_v1';

// Static hosts (e.g. GitHub Pages) have no Express/SQLite backend; use localStorage directly.
function isStaticHost(): boolean {
  if (typeof window === 'undefined') return true;
  return window.location.hostname.endsWith('.github.io');
}

function readLocal<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeLocal<T>(key: string, items: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // ignore storage quota errors
  }
}

export async function fetchAttempts(): Promise<SectionAAttempt[]> {
  if (!isStaticHost()) {
    try {
      const res = await fetch('/api/attempts');
      if (res.ok) {
        const data = (await res.json()) as SectionAAttempt[];
        writeLocal(ATTEMPTS_KEY, data);
        return data;
      }
    } catch {
      // Fallback to localStorage
    }
  }
  return readLocal<SectionAAttempt>(ATTEMPTS_KEY);
}

export async function saveAttempt(attempt: SectionAAttempt): Promise<void> {
  const existing = readLocal<SectionAAttempt>(ATTEMPTS_KEY);
  writeLocal(ATTEMPTS_KEY, [attempt, ...existing.filter((a) => a.id !== attempt.id)]);

  if (!isStaticHost()) {
    try {
      await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attempt),
      });
    } catch {
      // Saved locally even if API is unavailable
    }
  }
}

export async function fetchEssays(): Promise<SectionBEssayRecord[]> {
  if (!isStaticHost()) {
    try {
      const res = await fetch('/api/essays');
      if (res.ok) {
        const data = (await res.json()) as SectionBEssayRecord[];
        writeLocal(ESSAYS_KEY, data);
        return data;
      }
    } catch {
      // Fallback to localStorage
    }
  }
  return readLocal<SectionBEssayRecord>(ESSAYS_KEY);
}

export async function saveEssay(essay: SectionBEssayRecord): Promise<void> {
  const existing = readLocal<SectionBEssayRecord>(ESSAYS_KEY);
  writeLocal(ESSAYS_KEY, [essay, ...existing.filter((e) => e.id !== essay.id)]);

  if (!isStaticHost()) {
    try {
      await fetch('/api/essays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(essay),
      });
    } catch {
      // Saved locally
    }
  }
}

export async function submitQuestionReport(
  questionId: string,
  reason: string,
  note: string
): Promise<boolean> {
  const existing = readLocal<{
    id: string;
    question_id: string;
    reason: string;
    note: string;
    created_at: string;
  }>(REPORTS_KEY);
  writeLocal(REPORTS_KEY, [
    {
      id: `rep-${Date.now()}`,
      question_id: questionId,
      reason,
      note,
      created_at: new Date().toISOString(),
    },
    ...existing,
  ]);

  if (!isStaticHost()) {
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id: questionId, reason, note }),
      });
      return res.ok;
    } catch {
      return true;
    }
  }
  return true;
}
