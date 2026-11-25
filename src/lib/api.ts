import { SectionAAttempt, SectionBEssayRecord } from '../types';

const ATTEMPTS_KEY = 'ratio_lnat_attempts_v1';
const ESSAYS_KEY = 'ratio_lnat_essays_v1';

export async function fetchAttempts(): Promise<SectionAAttempt[]> {
  try {
    const res = await fetch('/api/attempts');
    if (res.ok) {
      const data = (await res.json()) as SectionAAttempt[];
      localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(data));
      return data;
    }
  } catch {
    // Fallback to localStorage
  }
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    return raw ? (JSON.parse(raw) as SectionAAttempt[]) : [];
  } catch {
    return [];
  }
}

export async function saveAttempt(attempt: SectionAAttempt): Promise<void> {
  try {
    const existing = await fetchAttempts();
    const updated = [attempt, ...existing.filter((a) => a.id !== attempt.id)];
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage quota errors
  }

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

export async function fetchEssays(): Promise<SectionBEssayRecord[]> {
  try {
    const res = await fetch('/api/essays');
    if (res.ok) {
      const data = (await res.json()) as SectionBEssayRecord[];
      localStorage.setItem(ESSAYS_KEY, JSON.stringify(data));
      return data;
    }
  } catch {
    // Fallback to localStorage
  }
  try {
    const raw = localStorage.getItem(ESSAYS_KEY);
    return raw ? (JSON.parse(raw) as SectionBEssayRecord[]) : [];
  } catch {
    return [];
  }
}

export async function saveEssay(essay: SectionBEssayRecord): Promise<void> {
  try {
    const existing = await fetchEssays();
    const updated = [essay, ...existing.filter((e) => e.id !== essay.id)];
    localStorage.setItem(ESSAYS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

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

export async function submitQuestionReport(
  questionId: string,
  reason: string,
  note: string
): Promise<boolean> {
  try {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id: questionId, reason, note }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
