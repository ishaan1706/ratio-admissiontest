import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bookmark,
  BookOpen,
  Calculator,
  Check,
  ExternalLink,
  Filter,
  RotateCcw,
  Shuffle,
  Sparkles,
  X,
} from 'lucide-react';
import satBankRaw from '../data/packs/sat-suite/sat-question-bank.json';
import satVocabRaw from '../data/packs/sat-suite/sat-vocab.json';
import officialResourcesRaw from '../data/packs/sat-suite/official-resources-map.json';
import skillLessonsMd from '../data/packs/sat-suite/skill-lessons.md?raw';
import desmosGuideMd from '../data/packs/sat-suite/desmos-guide.md?raw';
import formulaSheetMd from '../data/packs/sat-suite/formula-sheet.md?raw';
import grammarGuideMd from '../data/packs/sat-suite/grammar-and-transitions.md?raw';
import studyPlansMd from '../data/packs/sat-suite/study-plans.md?raw';
import collegeBoardAlignmentMd from '../data/packs/sat-suite/college-board-alignment.md?raw';
import satRevisionGuideMd from '../data/packs/sat/sat-revision-guide.md?raw';
import { MarkdownRenderer } from './MarkdownRenderer';

interface OfficialSkillResource {
  id: string;
  ratioSkill: string;
  officialSkill: string;
  section: 'rw' | 'math';
  officialDomain: string;
  approxDomainShare: number;
  questionBank: {
    studentUrl: string;
    educatorUrl: string;
    assessment: string;
    section: string;
    domain: string;
    skill: string;
  };
  khanUnitUrl: string;
  bluebookUrl: string;
  skillsInsightUrl: string;
  progress?: {
    foundation: string;
    stretch: string;
  };
}

const OFFICIAL_SKILL_RESOURCES = (
  officialResourcesRaw as { skills: OfficialSkillResource[] }
).skills;

export const SAT_BANK_TOTAL = (
  satBankRaw as { drills: { questions: unknown[] }[] }
).drills.reduce((sum, d) => sum + d.questions.length, 0);

export interface BankOption {
  letter: string;
  text: string;
  explanation?: string;
}

export interface BankQuestion {
  id: string;
  section: 'rw' | 'math';
  domain: string;
  skill: string;
  difficulty: string;
  type: 'mcq' | 'spr';
  passage?: string | null;
  underlined?: string;
  texts?: { label: string; body: string }[];
  notes?: string[];
  tableTitle?: string;
  table?: { columns: string[]; rows: string[][] };
  question: string;
  options?: BankOption[];
  correct?: string;
  acceptedAnswers?: string[];
  explanation: string;
  commonTrap?: string;
  desmosFriendly?: boolean;
  practiceBand?: number;
}

interface BankDrillWrapper {
  id: string;
  section: 'rw' | 'math';
  domain: string;
  questions: BankQuestion[];
}

interface VocabEntry {
  id: string;
  word: string;
  category: string;
  definition: string;
  example: string;
  cloze: string;
}

interface BankHistoryEntry {
  attempts: number;
  correctCount: number;
  lastCorrect: boolean;
  saved?: boolean;
}

const BANK_HISTORY_KEY = 'ratio_sat_bank_history_v1';
const VOCAB_MASTERED_KEY = 'ratio_sat_vocab_mastered_v1';

const ALL_BANK_QUESTIONS: BankQuestion[] = (
  (satBankRaw as { drills: BankDrillWrapper[] }).drills || []
).flatMap((d) =>
  d.questions.map((q) => ({
    ...q,
    section: q.section || d.section,
    domain: q.domain || d.domain,
  }))
);

const ALL_VOCAB: VocabEntry[] = (satVocabRaw as { entries: VocabEntry[] }).entries || [];

interface SkillLesson {
  skill: string;
  body: string;
}

const SKILL_LESSONS: SkillLesson[] = (() => {
  const sections: SkillLesson[] = [];
  const lines = skillLessonsMd.replace(/\r\n/g, '\n').split('\n');
  let currentSkill: string | null = null;
  let buf: string[] = [];
  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentSkill) {
        sections.push({ skill: currentSkill, body: buf.join('\n').trim() });
      }
      currentSkill = line.slice(3).trim();
      buf = [];
    } else if (currentSkill) {
      buf.push(line);
    }
  }
  if (currentSkill) {
    sections.push({ skill: currentSkill, body: buf.join('\n').trim() });
  }
  return sections;
})();

function loadHistory(): Record<string, BankHistoryEntry> {
  try {
    return JSON.parse(localStorage.getItem(BANK_HISTORY_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveHistory(h: Record<string, BankHistoryEntry>) {
  try {
    localStorage.setItem(BANK_HISTORY_KEY, JSON.stringify(h));
  } catch {
    // ignore
  }
}

function loadMasteredVocab(): string[] {
  try {
    return JSON.parse(localStorage.getItem(VOCAB_MASTERED_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveMasteredVocab(ids: string[]) {
  try {
    localStorage.setItem(VOCAB_MASTERED_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

function parseNumeric(raw: string): number | null {
  const s = raw.trim().replace(/\s+/g, '');
  if (!s) return null;
  if (s.includes('/')) {
    const parts = s.split('/');
    if (parts.length !== 2) return null;
    const num = Number(parts[0]);
    const den = Number(parts[1]);
    if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) return null;
    return num / den;
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function checkBankAnswer(q: BankQuestion, raw: string): boolean {
  if (!raw.trim()) return false;
  if (q.type === 'mcq') {
    return raw.trim().toUpperCase() === (q.correct || '').trim().toUpperCase();
  }
  const accepted = q.acceptedAnswers || [];
  const trimmed = raw.trim();
  if (accepted.some((a) => a.trim().toLowerCase() === trimmed.toLowerCase())) return true;
  const userNum = parseNumeric(trimmed);
  if (userNum === null) return false;
  return accepted.some((a) => {
    const accNum = parseNumeric(a);
    return accNum !== null && Math.abs(userNum - accNum) < 1e-4;
  });
}

/* ── 1. OnePrep-Style Filterable 600-Question Bank ──────────────────────── */
export const SatQuestionBankView: React.FC<{
  initialSkill?: string | null;
  onOpenLesson: (skill: string) => void;
  onStartTimedSprint: (title: string, section: 'rw' | 'math', minutes: number, qs: BankQuestion[]) => void;
}> = ({ initialSkill, onOpenLesson, onStartTimedSprint }) => {
  const [section, setSection] = useState<'all' | 'rw' | 'math'>('all');
  const [domain, setDomain] = useState<string>('all');
  const [skill, setSkill] = useState<string>(initialSkill || 'all');
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unanswered' | 'incorrect' | 'saved'>('all');
  const [formatFilter, setFormatFilter] = useState<'all' | 'mcq' | 'spr'>('all');
  const [desmosOnly, setDesmosOnly] = useState(false);

  const [history, setHistory] = useState<Record<string, BankHistoryEntry>>(() => loadHistory());
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState('');
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (initialSkill) {
      setSection('all');
      setDomain('all');
      setSkill(initialSkill);
      setIdx(0);
      setSelected('');
      setSubmitted(false);
    }
  }, [initialSkill]);

  const domains = useMemo(() => {
    const set = new Set<string>();
    for (const q of ALL_BANK_QUESTIONS) {
      if (section === 'all' || q.section === section) set.add(q.domain);
    }
    return Array.from(set);
  }, [section]);

  const skills = useMemo(() => {
    const set = new Set<string>();
    for (const q of ALL_BANK_QUESTIONS) {
      if ((section === 'all' || q.section === section) && (domain === 'all' || q.domain === domain)) {
        set.add(q.skill);
      }
    }
    return Array.from(set);
  }, [section, domain]);

  const filtered = useMemo(() => {
    return ALL_BANK_QUESTIONS.filter((q) => {
      if (section !== 'all' && q.section !== section) return false;
      if (domain !== 'all' && q.domain !== domain) return false;
      if (skill !== 'all' && q.skill !== skill) return false;
      if (difficulty !== 'all' && q.difficulty.toLowerCase() !== difficulty) return false;
      if (formatFilter !== 'all' && q.type !== formatFilter) return false;
      if (desmosOnly && !q.desmosFriendly) return false;
      const h = history[q.id];
      if (statusFilter === 'unanswered' && h && h.attempts > 0) return false;
      if (statusFilter === 'incorrect' && !(h && h.attempts > 0 && !h.lastCorrect)) return false;
      if (statusFilter === 'saved' && !h?.saved) return false;
      return true;
    });
  }, [section, domain, skill, difficulty, formatFilter, desmosOnly, statusFilter, history]);

  const safeIdx = filtered.length > 0 ? Math.min(idx, filtered.length - 1) : 0;
  const q = filtered[safeIdx] || null;

  const stats = useMemo(() => {
    let attempted = 0;
    let correct = 0;
    let incorrect = 0;
    let saved = 0;
    for (const qItem of ALL_BANK_QUESTIONS) {
      const h = history[qItem.id];
      if (!h) continue;
      if (h.saved) saved++;
      if (h.attempts > 0) {
        attempted++;
        if (h.lastCorrect) correct++;
        else incorrect++;
      }
    }
    return { attempted, correct, incorrect, saved };
  }, [history]);

  const updateHistory = (next: Record<string, BankHistoryEntry>) => {
    setHistory(next);
    saveHistory(next);
  };

  const handleSubmit = () => {
    if (!q || !selected.trim()) return;
    const isOk = checkBankAnswer(q, selected);
    const prev = history[q.id] || { attempts: 0, correctCount: 0, lastCorrect: false, saved: false };
    updateHistory({
      ...history,
      [q.id]: {
        ...prev,
        attempts: prev.attempts + 1,
        correctCount: prev.correctCount + (isOk ? 1 : 0),
        lastCorrect: isOk,
      },
    });
    setSubmitted(true);
  };

  const toggleSave = (qid: string) => {
    const prev = history[qid] || { attempts: 0, correctCount: 0, lastCorrect: false, saved: false };
    updateHistory({
      ...history,
      [qid]: { ...prev, saved: !prev.saved },
    });
  };

  const go = (nextIdx: number) => {
    setIdx(nextIdx);
    setSelected('');
    setSubmitted(false);
  };

  const resetFilters = () => {
    setSection('all');
    setDomain('all');
    setSkill('all');
    setDifficulty('all');
    setStatusFilter('all');
    setFormatFilter('all');
    setDesmosOnly(false);
    go(0);
  };

  const isCorrectNow = q && submitted ? checkBankAnswer(q, selected) : false;

  return (
    <div className="space-y-6">
      {/* Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[var(--rule)] bg-[var(--surface)] p-3.5">
          <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--text-muted)]">
            Bank Size
          </div>
          <div className="font-display text-2xl text-[var(--ink)] mt-0.5">
            {ALL_BANK_QUESTIONS.length} Qs
          </div>
        </div>
        <div className="rounded-xl border border-[var(--rule)] bg-[var(--surface)] p-3.5">
          <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--text-muted)]">
            Completed
          </div>
          <div className="font-display text-2xl text-[var(--ink)] mt-0.5">
            {stats.attempted} / {ALL_BANK_QUESTIONS.length}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setStatusFilter(statusFilter === 'incorrect' ? 'all' : 'incorrect');
            go(0);
          }}
          className={`rounded-xl border p-3.5 text-left cursor-pointer transition-colors ${
            statusFilter === 'incorrect'
              ? 'border-red-500/50 bg-red-500/10'
              : 'border-[var(--rule)] bg-[var(--surface)] hover:border-[var(--accent)]'
          }`}
        >
          <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--text-muted)]">
            Error Log (Missed)
          </div>
          <div className="font-display text-2xl text-red-400 mt-0.5">{stats.incorrect} Qs</div>
        </button>
        <button
          type="button"
          onClick={() => {
            setStatusFilter(statusFilter === 'saved' ? 'all' : 'saved');
            go(0);
          }}
          className={`rounded-xl border p-3.5 text-left cursor-pointer transition-colors ${
            statusFilter === 'saved'
              ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
              : 'border-[var(--rule)] bg-[var(--surface)] hover:border-[var(--accent)]'
          }`}
        >
          <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--text-muted)]">
            Saved / Bookmarked
          </div>
          <div className="font-display text-2xl text-[var(--accent)] mt-0.5">{stats.saved} Qs</div>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-[var(--rule)] bg-[var(--surface)] p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
            <Filter className="w-3.5 h-3.5" /> Filter Question Bank ({filtered.length} matching)
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {filtered.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  const sprintQs = filtered.slice(0, 10);
                  const sec = sprintQs[0].section;
                  onStartTimedSprint(
                    `SAT Bank Sprint · ${skill !== 'all' ? skill : domain !== 'all' ? domain : 'Mixed'} (${sprintQs.length} Qs)`,
                    sec,
                    sec === 'rw' ? 12 : 16,
                    sprintQs
                  );
                }}
                className="px-3 py-1.5 rounded-lg bg-[var(--accent)] text-[var(--accent-fg)] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                Timed Sprint ({Math.min(10, filtered.length)} Qs) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={resetFilters}
              className="px-2.5 py-1.5 rounded-lg border border-[var(--rule)] text-xs text-[var(--text-muted)] hover:text-[var(--ink)] inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          <select
            value={section}
            onChange={(e) => {
              setSection(e.target.value as 'all' | 'rw' | 'math');
              setDomain('all');
              setSkill('all');
              go(0);
            }}
            className="px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--rule)] text-[var(--ink)]"
          >
            <option value="all">All Sections (600 Qs)</option>
            <option value="rw">Reading &amp; Writing (220 Qs)</option>
            <option value="math">Math (380 Qs)</option>
          </select>

          <select
            value={domain}
            onChange={(e) => {
              setDomain(e.target.value);
              setSkill('all');
              go(0);
            }}
            className="px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--rule)] text-[var(--ink)]"
          >
            <option value="all">All Domains ({domains.length})</option>
            {domains.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={skill}
            onChange={(e) => {
              setSkill(e.target.value);
              go(0);
            }}
            className="px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--rule)] text-[var(--ink)]"
          >
            <option value="all">All Skills ({skills.length})</option>
            {skills.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value as 'all' | 'easy' | 'medium' | 'hard');
              go(0);
            }}
            className="px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--rule)] text-[var(--ink)]"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {(
            [
              ['all', 'All'],
              ['unanswered', 'Unanswered'],
              ['incorrect', 'Incorrect Only'],
              ['saved', 'Saved'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setStatusFilter(id);
                go(0);
              }}
              className={`px-2.5 py-1 rounded-lg border cursor-pointer ${
                statusFilter === id
                  ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                  : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
              }`}
            >
              {label}
            </button>
          ))}

          <span className="text-[var(--rule)]">|</span>

          {(
            [
              ['all', 'MCQ + SPR'],
              ['mcq', 'MCQ Only'],
              ['spr', 'SPR Grid-In Only'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setFormatFilter(id);
                go(0);
              }}
              className={`px-2.5 py-1 rounded-lg border cursor-pointer ${
                formatFilter === id
                  ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                  : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
              }`}
            >
              {label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              setDesmosOnly((v) => !v);
              go(0);
            }}
            className={`px-2.5 py-1 rounded-lg border inline-flex items-center gap-1 cursor-pointer ${
              desmosOnly
                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
            }`}
          >
            <Calculator className="w-3 h-3" /> Desmos-Friendly Only
          </button>
        </div>
      </div>

      {/* Active Question Tutor Card */}
      {!q ? (
        <div className="rounded-2xl border border-[var(--rule)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--text-muted)]">
          No questions match these filters. Try resetting filters or switching status.
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--rule)] pb-3">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono-tabular">
              <span className="text-[var(--ink)] font-semibold">
                {safeIdx + 1} / {filtered.length}
              </span>
              <span className="px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--rule)] text-[var(--text-muted)]">
                {q.section === 'rw' ? 'R&W' : 'Math'} · {q.domain}
              </span>
              <span className="px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--rule)] text-[var(--accent)]">
                {q.skill}
              </span>
              <span className="px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--rule)] uppercase text-[var(--text-muted)]">
                {q.difficulty}
              </span>
              {typeof q.practiceBand === 'number' && (
                <span
                  title="Ratio practice band (not a score)"
                  className="px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--rule)] text-[var(--text-muted)]"
                >
                  Ratio practice band (not a score): {q.practiceBand}/7
                </span>
              )}
              {q.desmosFriendly && (
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 inline-flex items-center gap-1">
                  <Calculator className="w-3 h-3" /> Desmos-friendly
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenLesson(q.skill)}
                className="px-2.5 py-1 rounded-lg border border-[var(--rule)] hover:border-[var(--accent)] text-xs text-[var(--text-muted)] hover:text-[var(--ink)] inline-flex items-center gap-1 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" /> Skill Lesson
              </button>
              <button
                type="button"
                onClick={() => toggleSave(q.id)}
                className={`px-2.5 py-1 rounded-lg border text-xs inline-flex items-center gap-1 cursor-pointer ${
                  history[q.id]?.saved
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                    : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" /> {history[q.id]?.saved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>

          {/* Stimulus: passage, paired texts, notes, table */}
          {q.passage && (
            <div className="rounded-xl border border-[var(--rule)] bg-[var(--bg)] p-4 text-sm text-[var(--text)] leading-relaxed whitespace-pre-line">
              {q.passage}
            </div>
          )}

          {q.texts && q.texts.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-3">
              {q.texts.map((t, i) => (
                <div key={i} className="rounded-xl border border-[var(--rule)] bg-[var(--bg)] p-4 space-y-1.5">
                  <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                    {t.label}
                  </div>
                  <p className="text-sm text-[var(--text)] leading-relaxed">{t.body}</p>
                </div>
              ))}
            </div>
          )}

          {q.notes && q.notes.length > 0 && (
            <ul className="rounded-xl border border-[var(--rule)] bg-[var(--bg)] p-4 space-y-1.5 list-disc pl-8 text-sm text-[var(--text)]">
              {q.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          )}

          {q.table && (
            <div className="overflow-x-auto rounded-xl border border-[var(--rule)] bg-[var(--bg)]">
              {q.tableTitle && (
                <div className="px-4 py-2 border-b border-[var(--rule)] text-xs font-semibold text-[var(--ink)]">
                  {q.tableTitle}
                </div>
              )}
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--rule)] bg-[var(--surface-2)]">
                    {q.table.columns.map((c, ci) => (
                      <th key={ci} className="px-3 py-2 font-mono-tabular text-[var(--text-muted)]">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--rule)]">
                  {q.table.rows.map((r, ri) => (
                    <tr key={ri}>
                      {r.map((cell, ci) => (
                        <td key={ci} className="px-3 py-2 text-[var(--text)]">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Question Stem */}
          <div className="text-base font-medium text-[var(--ink)] leading-relaxed">{q.question}</div>

          {/* Options or SPR Input */}
          {q.type === 'mcq' && q.options ? (
            <div className="space-y-2.5">
              {q.options.map((opt) => {
                const isChosen = selected === opt.letter;
                const isRight = opt.letter === q.correct;
                let borderCls = 'border-[var(--rule)] bg-[var(--bg)] hover:border-[var(--accent)]/60';
                if (submitted) {
                  if (isRight) borderCls = 'border-emerald-500 bg-emerald-500/10';
                  else if (isChosen && !isRight) borderCls = 'border-red-500 bg-red-500/10';
                } else if (isChosen) {
                  borderCls = 'border-[var(--accent)] bg-[var(--accent-soft)]';
                }
                return (
                  <button
                    key={opt.letter}
                    type="button"
                    disabled={submitted}
                    onClick={() => setSelected(opt.letter)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer disabled:cursor-default ${borderCls}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-md border border-[var(--rule)] flex items-center justify-center text-xs font-mono-tabular font-semibold shrink-0 text-[var(--ink)]">
                        {opt.letter}
                      </span>
                      <div className="space-y-1 flex-1">
                        <div className="text-sm text-[var(--ink)] whitespace-pre-wrap">{opt.text}</div>
                        {submitted && opt.explanation && (
                          <div className="text-xs text-[var(--text-muted)] pt-1 border-t border-[var(--rule)]/60">
                            {opt.explanation}
                          </div>
                        )}
                      </div>
                      {submitted && isRight && <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                      {submitted && isChosen && !isRight && <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2 max-w-xs">
              <label className="block text-xs font-mono-tabular uppercase tracking-wider text-[var(--text-muted)]">
                Student-Produced Response (exact fraction or decimal)
              </label>
              <input
                type="text"
                disabled={submitted}
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !submitted && selected.trim()) handleSubmit();
                }}
                placeholder="e.g. 5 or 3/4 or 0.75"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--rule)] focus:border-[var(--accent)] outline-none font-mono-tabular text-sm text-[var(--ink)]"
              />
            </div>
          )}

          {/* Feedback, Explanation & Common Trap */}
          {submitted && (
            <div className="space-y-3 pt-2">
              <div
                className={`rounded-xl border p-4 text-sm ${
                  isCorrectNow
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                    : 'border-red-500/40 bg-red-500/10 text-red-200'
                }`}
              >
                <div className="font-semibold mb-1">
                  {isCorrectNow ? 'Correct' : 'Incorrect'} —{' '}
                  {q.type === 'mcq'
                    ? `Answer: ${q.correct}`
                    : `Accepted: ${(q.acceptedAnswers || []).join(', ')}`}
                </div>
                <p className="text-xs leading-relaxed text-[var(--text)]">{q.explanation}</p>
              </div>

              {q.commonTrap && (
                <div className="rounded-xl border border-amber-500/35 bg-amber-500/10 p-3.5 flex items-start gap-2.5 text-xs text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold uppercase tracking-wider font-mono-tabular text-amber-300">
                      Common Trap:{' '}
                    </span>
                    {q.commonTrap}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--rule)]">
            <button
              type="button"
              disabled={safeIdx === 0}
              onClick={() => go(safeIdx - 1)}
              className="px-3.5 py-2 rounded-lg border border-[var(--rule)] text-xs text-[var(--ink)] disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {!submitted ? (
                <button
                  type="button"
                  disabled={!selected.trim()}
                  onClick={handleSubmit}
                  className="px-5 py-2 rounded-lg bg-[var(--accent)] text-[var(--accent-fg)] text-xs font-semibold disabled:opacity-40 cursor-pointer"
                >
                  Check Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSelected('');
                    setSubmitted(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-[var(--rule)] text-xs text-[var(--text-muted)] hover:text-[var(--ink)] cursor-pointer"
                >
                  Try Again
                </button>
              )}

              <button
                type="button"
                disabled={safeIdx >= filtered.length - 1}
                onClick={() => go(safeIdx + 1)}
                className="px-4 py-2 rounded-lg bg-[var(--ink)] text-[var(--bg)] text-xs font-semibold disabled:opacity-40 cursor-pointer"
              >
                Next Question →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── 2. 30 Skill Lessons Browser ────────────────────────────────────────── */
export const SatSkillLessonsView: React.FC<{
  initialSkill?: string | null;
  onPracticeSkill: (skill: string) => void;
}> = ({ initialSkill, onPracticeSkill }) => {
  const [selectedSkill, setSelectedSkill] = useState<string>(
    initialSkill || SKILL_LESSONS[0]?.skill || ''
  );
  const [query, setQuery] = useState('');

  React.useEffect(() => {
    if (initialSkill) setSelectedSkill(initialSkill);
  }, [initialSkill]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? SKILL_LESSONS.filter((l) => l.skill.toLowerCase().includes(q)) : SKILL_LESSONS;
  }, [query]);

  const active = SKILL_LESSONS.find((l) => l.skill === selectedSkill) || filtered[0];

  return (
    <div className="grid lg:grid-cols-12 gap-5">
      <div className="lg:col-span-4 rounded-2xl border border-[var(--rule)] bg-[var(--surface)] p-4 space-y-3 max-h-[680px] flex flex-col">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 30 SAT skills…"
          className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--rule)] text-xs text-[var(--ink)] outline-none focus:border-[var(--accent)]"
        />
        <div className="overflow-y-auto space-y-1 pr-1 flex-1">
          {filtered.map((l) => (
            <button
              key={l.skill}
              type="button"
              onClick={() => setSelectedSkill(l.skill)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                active?.skill === l.skill
                  ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-semibold border border-[var(--accent)]/40'
                  : 'text-[var(--text-muted)] hover:text-[var(--ink)] hover:bg-[var(--bg)]'
              }`}
            >
              {l.skill}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-8 rounded-2xl border border-[var(--rule)] bg-[var(--surface)] p-6 sm:p-8 space-y-5">
        {active ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--rule)] pb-4">
              <div>
                <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                  SAT Skill Lesson
                </div>
                <h3 className="font-display text-2xl sm:text-3xl text-[var(--ink)] mt-0.5">
                  {active.skill}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onPracticeSkill(active.skill)}
                className="px-4 py-2 rounded-xl bg-[var(--accent)] text-[var(--accent-fg)] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                Practice Qs on this skill <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {(() => {
              const res = OFFICIAL_SKILL_RESOURCES.find(
                (r) => r.ratioSkill.toLowerCase() === active.skill.toLowerCase()
              );
              if (!res) return null;
              return (
                <div className="rounded-xl border border-[var(--rule)] bg-[var(--bg)] p-4 space-y-2.5 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono-tabular uppercase tracking-wider text-[11px] text-[var(--accent)]">
                      Official College Board &amp; Khan Links · ~{res.approxDomainShare}% domain share
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      Filter: {res.questionBank.section} → {res.questionBank.domain} →{' '}
                      {res.questionBank.skill}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={res.questionBank.studentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg border border-[var(--rule)] hover:border-[var(--accent)] text-[var(--ink)] inline-flex items-center gap-1"
                    >
                      MyPractice Bank <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={res.questionBank.educatorUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg border border-[var(--rule)] hover:border-[var(--accent)] text-[var(--ink)] inline-flex items-center gap-1"
                    >
                      Educator Bank <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={res.khanUnitUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg border border-[var(--rule)] hover:border-[var(--accent)] text-[var(--ink)] inline-flex items-center gap-1"
                    >
                      Khan Academy Unit <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={res.bluebookUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg border border-[var(--rule)] hover:border-[var(--accent)] text-[var(--ink)] inline-flex items-center gap-1"
                    >
                      Bluebook Tests <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={res.skillsInsightUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg border border-[var(--rule)] hover:border-[var(--accent)] text-[var(--ink)] inline-flex items-center gap-1"
                    >
                      Skills Insight <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  {res.progress && (
                    <div className="text-[11px] text-[var(--text-muted)] pt-1 border-t border-[var(--rule)] grid sm:grid-cols-2 gap-2">
                      <div>
                        <strong className="text-[var(--ink)]">Foundation:</strong>{' '}
                        {res.progress.foundation}
                      </div>
                      <div>
                        <strong className="text-[var(--ink)]">Stretch:</strong>{' '}
                        {res.progress.stretch}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
            <MarkdownRenderer content={active.body} />
          </>
        ) : (
          <div className="text-sm text-[var(--text-muted)]">Select a skill lesson to begin.</div>
        )}
      </div>
    </div>
  );
};

/* ── 3. 400-Word SAT Vocab Trainer (Forward Cloze + Reverse Flashcard) ─── */
export const SatVocabView: React.FC = () => {
  const [category, setCategory] = useState<string>('all');
  const [mode, setMode] = useState<'cloze' | 'flashcard'>('cloze');
  const [mastered, setMastered] = useState<string[]>(() => loadMasteredVocab());
  const [orderSeed, setOrderSeed] = useState(0);
  const [idx, setIdx] = useState(0);
  const [guess, setGuess] = useState('');
  const [revealed, setRevealed] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(ALL_VOCAB.map((v) => v.category))).sort(),
    []
  );

  const deck = useMemo(() => {
    const base = category === 'all' ? ALL_VOCAB : ALL_VOCAB.filter((v) => v.category === category);
    if (orderSeed === 0) return base;
    const arr = [...base];
    let s = orderSeed * 9301 + 49297;
    for (let i = arr.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const j = s % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [category, orderSeed]);

  const safeIdx = deck.length > 0 ? Math.min(idx, deck.length - 1) : 0;
  const entry = deck[safeIdx];

  const isMastered = entry ? mastered.includes(entry.id) : false;
  const clozeCorrect =
    entry && revealed && mode === 'cloze'
      ? guess.trim().toLowerCase() === entry.word.trim().toLowerCase()
      : false;

  const toggleMastered = (id: string, force?: boolean) => {
    const exists = mastered.includes(id);
    const shouldAdd = force !== undefined ? force : !exists;
    const next = shouldAdd ? Array.from(new Set([...mastered, id])) : mastered.filter((x) => x !== id);
    setMastered(next);
    saveMasteredVocab(next);
  };

  const go = (nextIdx: number) => {
    setIdx(nextIdx);
    setGuess('');
    setRevealed(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              go(0);
            }}
            className="px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink)]"
          >
            <option value="all">All 20 Themes (400 words)</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              setMode('cloze');
              setGuess('');
              setRevealed(false);
            }}
            className={`px-3 py-2 rounded-lg border text-xs cursor-pointer ${
              mode === 'cloze'
                ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                : 'border-[var(--rule)] text-[var(--text-muted)]'
            }`}
          >
            Cloze Quiz (Type Word)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('flashcard');
              setRevealed(false);
            }}
            className={`px-3 py-2 rounded-lg border text-xs cursor-pointer ${
              mode === 'flashcard'
                ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                : 'border-[var(--rule)] text-[var(--text-muted)]'
            }`}
          >
            Reverse Flashcard
          </button>
          <button
            type="button"
            onClick={() => {
              setOrderSeed((s) => s + 1);
              go(0);
            }}
            className="px-3 py-2 rounded-lg border border-[var(--rule)] text-xs text-[var(--text-muted)] hover:text-[var(--ink)] inline-flex items-center gap-1 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" /> Shuffle
          </button>
        </div>

        <div className="text-xs font-mono-tabular text-[var(--text-muted)]">
          Mastered: <span className="text-[var(--accent)] font-semibold">{mastered.length}</span> / {ALL_VOCAB.length}
        </div>
      </div>

      {entry && (
        <div className="rounded-2xl border border-[var(--rule)] bg-[var(--surface)] p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between text-[11px] font-mono-tabular text-[var(--text-muted)]">
            <span>
              Word {safeIdx + 1} / {deck.length} · {entry.category}
            </span>
            {isMastered && (
              <span className="text-emerald-400 inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Mastered
              </span>
            )}
          </div>

          {mode === 'cloze' ? (
            <div className="space-y-4">
              <div>
                <div className="text-xs uppercase tracking-wider font-mono-tabular text-[var(--accent)]">
                  Definition
                </div>
                <div className="font-display text-2xl text-[var(--ink)] mt-1">{entry.definition}</div>
              </div>
              <div className="rounded-xl border border-[var(--rule)] bg-[var(--bg)] p-4 text-sm text-[var(--text)]">
                {revealed ? entry.example : entry.cloze}
              </div>

              {!revealed ? (
                <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                  <input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && guess.trim()) setRevealed(true);
                    }}
                    placeholder="Type the SAT word…"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--rule)] focus:border-[var(--accent)] outline-none text-sm text-[var(--ink)]"
                  />
                  <button
                    type="button"
                    onClick={() => setRevealed(true)}
                    className="px-4 py-2.5 rounded-xl bg-[var(--accent)] text-[var(--accent-fg)] text-xs font-semibold cursor-pointer"
                  >
                    Check / Reveal
                  </button>
                </div>
              ) : (
                <div
                  className={`rounded-xl border p-4 text-sm ${
                    clozeCorrect
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                      : 'border-amber-500/40 bg-amber-500/10 text-amber-200'
                  }`}
                >
                  <div className="font-semibold">
                    {clozeCorrect ? 'Exact match!' : `Word: ${entry.word}`}
                  </div>
                  <div className="text-xs text-[var(--text)] mt-1">{entry.example}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="font-display text-4xl text-[var(--ink)]">{entry.word}</div>
              {!revealed ? (
                <button
                  type="button"
                  onClick={() => setRevealed(true)}
                  className="px-4 py-2 rounded-xl bg-[var(--accent)] text-[var(--accent-fg)] text-xs font-semibold cursor-pointer"
                >
                  Reveal Definition &amp; Example
                </button>
              ) : (
                <div className="space-y-2 rounded-xl border border-[var(--rule)] bg-[var(--bg)] p-4">
                  <div className="text-sm font-semibold text-[var(--ink)]">{entry.definition}</div>
                  <div className="text-sm text-[var(--text-muted)] italic">{entry.example}</div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--rule)]">
            <button
              type="button"
              disabled={safeIdx === 0}
              onClick={() => go(safeIdx - 1)}
              className="px-3.5 py-2 rounded-lg border border-[var(--rule)] text-xs text-[var(--ink)] disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleMastered(entry.id)}
                className={`px-3.5 py-2 rounded-lg border text-xs cursor-pointer ${
                  isMastered
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                    : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                }`}
              >
                {isMastered ? 'Mastered ✓' : 'Mark Mastered'}
              </button>
              <button
                type="button"
                disabled={safeIdx >= deck.length - 1}
                onClick={() => go(safeIdx + 1)}
                className="px-4 py-2 rounded-lg bg-[var(--ink)] text-[var(--bg)] text-xs font-semibold disabled:opacity-40 cursor-pointer"
              >
                Next Word →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── 4. Reference Guides, 4 Study Plans & Illustrative Score Estimator ─── */
export const SatGuidesAndPlansView: React.FC = () => {
  const [sub, setSub] = useState<
    'alignment' | 'desmos' | 'formulas' | 'grammar' | 'plans' | 'guide' | 'estimator'
  >('alignment');
  const [rwRaw, setRwRaw] = useState(40);
  const [mathRaw, setMathRaw] = useState(34);

  // Illustrative linear-to-banded approximation (200-800 per section), clearly labeled non-official
  const rwEst = Math.round((200 + (rwRaw / 54) * 600) / 10) * 10;
  const mathEst = Math.round((200 + (mathRaw / 44) * 600) / 10) * 10;
  const totalEst = rwEst + mathEst;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ['alignment', 'College Board Alignment'],
            ['desmos', 'Desmos Guide'],
            ['formulas', 'Formula Sheet'],
            ['grammar', 'Grammar & Transitions'],
            ['plans', 'Study Plans (2–12 Wk)'],
            ['guide', 'Full SAT Guide'],
            ['estimator', 'Illustrative Estimator'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setSub(id)}
            className={`px-3 py-1.5 rounded-lg text-xs border cursor-pointer transition-colors ${
              sub === id
                ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-medium'
                : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {sub === 'estimator' ? (
        <div className="rounded-2xl border border-[var(--rule)] bg-[var(--surface)] p-6 sm:p-8 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
              <Sparkles className="w-3.5 h-3.5" /> Illustrative Raw-to-Scale Estimator
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-[var(--ink)] mt-1">
              Explore rough 400–1600 bands
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
              This is an illustrative non-adaptive approximation only — not an official College Board
              equating table or predicted SAT score. For official adaptive scoring, take a practice
              test in{' '}
              <a
                href="https://satsuite.collegeboard.org/practice/practice-tests/bluebook"
                target="_blank"
                rel="noreferrer"
                className="text-[var(--accent)] underline"
              >
                Bluebook
              </a>
              .
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="rounded-xl border border-[var(--rule)] bg-[var(--bg)] p-4 space-y-2">
              <div className="flex justify-between text-xs font-mono-tabular">
                <span className="text-[var(--text-muted)]">Reading &amp; Writing Raw</span>
                <span className="text-[var(--ink)] font-semibold">{rwRaw} / 54</span>
              </div>
              <input
                type="range"
                min={0}
                max={54}
                value={rwRaw}
                onChange={(e) => setRwRaw(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="text-xs text-[var(--accent)] font-mono-tabular">
                Illustrative R&amp;W: ~{rwEst} (200–800)
              </div>
            </div>

            <div className="rounded-xl border border-[var(--rule)] bg-[var(--bg)] p-4 space-y-2">
              <div className="flex justify-between text-xs font-mono-tabular">
                <span className="text-[var(--text-muted)]">Math Raw</span>
                <span className="text-[var(--ink)] font-semibold">{mathRaw} / 44</span>
              </div>
              <input
                type="range"
                min={0}
                max={44}
                value={mathRaw}
                onChange={(e) => setMathRaw(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="text-xs text-[var(--accent)] font-mono-tabular">
                Illustrative Math: ~{mathEst} (200–800)
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--accent)]/40 bg-[var(--accent-soft)]/30 p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--text-muted)]">
                Illustrative Total
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">
                R&amp;W {rwEst} + Math {mathEst}
              </div>
            </div>
            <div className="font-display text-4xl text-[var(--ink)]">{totalEst}</div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--rule)] bg-[var(--surface)] p-6 sm:p-8">
          <MarkdownRenderer
            content={
              sub === 'alignment'
                ? collegeBoardAlignmentMd
                : sub === 'desmos'
                  ? desmosGuideMd
                  : sub === 'formulas'
                    ? formulaSheetMd
                    : sub === 'grammar'
                      ? grammarGuideMd
                      : sub === 'plans'
                        ? studyPlansMd
                        : satRevisionGuideMd
            }
          />
        </div>
      )}
    </div>
  );
};
