import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Flag,
  RotateCcw,
} from 'lucide-react';
import satMocksRaw from '../data/packs/sat/sat-mocks.json';
import satDrillsRaw from '../data/packs/sat/sat-drills.json';
import satRevisionGuideMd from '../data/packs/sat/sat-revision-guide.md?raw';
import { AdmissionsTest } from '../data/allTests';
import { GenericAttempt, OfficialResourcesPanel } from './TestWorkspace';

interface SatOption {
  letter: string;
  text: string;
  explanation?: string;
}

interface SatQuestion {
  id: string;
  number?: number;
  section: 'rw' | 'math';
  domain: string;
  skill: string;
  difficulty: string;
  type: 'mcq' | 'spr';
  passage?: string;
  underlined?: string;
  texts?: { label: string; body: string }[];
  notes?: string[];
  tableTitle?: string;
  table?: { columns: string[]; rows: string[][] };
  question: string;
  options?: SatOption[];
  correct?: string;
  acceptedAnswers?: string[];
  explanation: string;
}

interface SatModule {
  id: string;
  section: 'rw' | 'math';
  title: string;
  minutes: number;
  route: string;
  questionCount: number;
  questions: SatQuestion[];
}

interface SatMock {
  id: string;
  title: string;
  description: string;
  breakAfterModule?: string;
  breakMinutes?: number;
  modules: SatModule[];
}

interface SatDrill {
  id: string;
  section: 'rw' | 'math';
  domain: string;
  questions: SatQuestion[];
}

const SAT_MOCKS = (satMocksRaw as { mocks: SatMock[] }).mocks;
const SAT_DRILLS = (satDrillsRaw as { drills: SatDrill[] }).drills;

/** Parse fraction or decimal string into a finite number for SPR equivalence */
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

function isSatAnswerCorrect(q: SatQuestion, rawAnswer: string | undefined): boolean {
  if (!rawAnswer) return false;
  if (q.type === 'mcq') {
    return rawAnswer.trim().toUpperCase() === (q.correct ?? '').trim().toUpperCase();
  }
  const accepted = q.acceptedAnswers ?? [];
  const trimmed = rawAnswer.trim();
  if (accepted.some((a) => a.trim().toLowerCase() === trimmed.toLowerCase())) return true;
  const userNum = parseNumeric(trimmed);
  if (userNum === null) return false;
  return accepted.some((a) => {
    const accNum = parseNumeric(a);
    return accNum !== null && Math.abs(userNum - accNum) < 1e-4;
  });
}

function renderPassageWithUnderline(passage: string, underlined?: string) {
  if (!underlined) return passage;
  const idx = passage.indexOf(underlined);
  if (idx === -1) return passage;
  return (
    <>
      {passage.slice(0, idx)}
      <span className="underline decoration-[var(--accent)] decoration-2 underline-offset-4 text-[var(--ink)]">
        {underlined}
      </span>
      {passage.slice(idx + underlined.length)}
    </>
  );
}

interface ActiveSatRun {
  title: string;
  section: 'rw' | 'math';
  minutes: number;
  questions: SatQuestion[];
}

interface SatWorkspaceProps {
  test: AdmissionsTest;
  subTab: 'practice' | 'resources' | 'progress';
  attempts: GenericAttempt[];
  onSaveAttempt: (attempt: GenericAttempt) => void;
}

export const SatWorkspace: React.FC<SatWorkspaceProps> = ({
  test,
  subTab,
  attempts,
  onSaveAttempt,
}) => {
  const [mode, setMode] = useState<'mocks' | 'drills' | 'guide'>('mocks');
  const [activeRun, setActiveRun] = useState<ActiveSatRun | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(32 * 60);
  const [showRefSheet, setShowRefSheet] = useState(false);

  useEffect(() => {
    if (!activeRun || finished) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [activeRun, finished]);

  const startRun = (run: ActiveSatRun) => {
    setActiveRun(run);
    setQIdx(0);
    setAnswers({});
    setFlagged({});
    setFinished(false);
    setShowRefSheet(false);
    setSecondsLeft(run.minutes * 60);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finishRun = () => {
    if (!activeRun) return;
    const correct = activeRun.questions.filter((q) =>
      isSatAnswerCorrect(q, answers[q.id])
    ).length;
    onSaveAttempt({
      id: `sat-${Date.now()}`,
      testId: 'sat',
      testCode: activeRun.title,
      correct,
      total: activeRun.questions.length,
      createdAt: new Date().toISOString(),
    });
    setFinished(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
  };

  const domainBreakdown = useMemo(() => {
    if (!activeRun || !finished) return [];
    const map = new Map<string, { correct: number; total: number }>();
    for (const q of activeRun.questions) {
      const cur = map.get(q.domain) ?? { correct: 0, total: 0 };
      cur.total += 1;
      if (isSatAnswerCorrect(q, answers[q.id])) cur.correct += 1;
      map.set(q.domain, cur);
    }
    return Array.from(map.entries()).map(([domain, stats]) => ({ domain, ...stats }));
  }, [activeRun, finished, answers]);

  if (subTab === 'resources') {
    return <OfficialResourcesPanel test={test} />;
  }

  if (subTab === 'progress') {
    const satAttempts = attempts.filter((a) => a.testId === 'sat');
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-3xl text-[var(--ink)]">SAT Progress</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Raw scores by module and domain (for 400–1600 scaled scores, take official College Board
            Bluebook practice tests).
          </p>
        </div>
        {satAttempts.length === 0 ? (
          <div className="border border-[var(--rule)] p-6 text-sm text-[var(--text-muted)]">
            No SAT modules or domain drills completed yet.
          </div>
        ) : (
          <div className="border-t border-[var(--rule)] divide-y divide-[var(--rule)]">
            {satAttempts.map((a) => (
              <div key={a.id} className="py-3.5 flex items-center justify-between text-sm">
                <div className="font-medium text-[var(--ink)]">{a.testCode}</div>
                <div className="flex items-center gap-5 font-mono-tabular">
                  <span className="text-[var(--accent)] font-semibold">
                    {a.correct} / {a.total} ({Math.round((a.correct / a.total) * 100)}%)
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ── Active Digital SAT Module / Drill Runner ──────────────────────────── */
  if (activeRun) {
    const qs = activeRun.questions;
    if (finished) {
      const correct = qs.filter((q) => isSatAnswerCorrect(q, answers[q.id])).length;
      return (
        <div className="space-y-8">
          <div className="border border-[var(--rule)] bg-[var(--surface)] p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                {activeRun.title} · Review
              </div>
              <div className="font-display text-4xl text-[var(--ink)] mt-1">
                {correct} / {qs.length} ({Math.round((correct / qs.length) * 100)}%)
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Raw section &amp; domain score (Module 2 uses the harder route). No invented 1600
                conversion.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => startRun(activeRun)}
                className="px-4 py-2 border border-[var(--rule)] text-xs font-medium text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake
              </button>
              <button
                type="button"
                onClick={() => setActiveRun(null)}
                className="px-4 py-2 bg-[var(--ink)] text-[var(--bg)] text-xs font-semibold cursor-pointer"
              >
                Back to SAT Hub
              </button>
            </div>
          </div>

          {domainBreakdown.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-2">
              {domainBreakdown.map((d) => (
                <div
                  key={d.domain}
                  className="border border-[var(--rule)] p-3 flex items-center justify-between text-xs"
                >
                  <span className="text-[var(--text-muted)]">{d.domain}</span>
                  <span className="font-mono-tabular text-[var(--ink)] font-semibold">
                    {d.correct}/{d.total}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {qs.map((q, idx) => {
              const userVal = answers[q.id];
              const isRight = isSatAnswerCorrect(q, userVal);
              const correctLabel =
                q.type === 'mcq'
                  ? `${q.correct}: ${q.options?.find((o) => o.letter === q.correct)?.text ?? ''}`
                  : (q.acceptedAnswers ?? []).join(' or ');
              return (
                <div key={q.id} className="border border-[var(--rule)] p-5 space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono-tabular">
                    <span className="text-[var(--text-muted)]">
                      Q{idx + 1} · {q.domain} · {q.skill} ({q.difficulty})
                    </span>
                    <span className={isRight ? 'text-[var(--accent)]' : 'text-[var(--danger)]'}>
                      {isRight ? 'Correct' : `Your answer: ${userVal ?? '—'}`}
                    </span>
                  </div>
                  <div className="text-sm text-[var(--ink)] font-medium">{q.question}</div>
                  <div className="text-xs text-[var(--accent)]">Correct: {correctLabel}</div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    const q = qs[qIdx];
    const picked = answers[q.id] ?? '';

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--rule)] pb-3 text-xs font-mono-tabular">
          <span className="text-[var(--text-muted)]">
            {activeRun.title} · Q{qIdx + 1}/{qs.length} · {q.domain}
          </span>
          <div className="flex items-center gap-4">
            {activeRun.section === 'math' && (
              <button
                type="button"
                onClick={() => setShowRefSheet((r) => !r)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 border cursor-pointer ${
                  showRefSheet
                    ? 'border-[var(--accent)] text-[var(--accent)]'
                    : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Reference Sheet
              </button>
            )}
            <button
              type="button"
              onClick={() => setFlagged((f) => ({ ...f, [q.id]: !f[q.id] }))}
              className={`inline-flex items-center gap-1 cursor-pointer ${
                flagged[q.id]
                  ? 'text-[var(--gold)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--ink)]'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              {flagged[q.id] ? 'Flagged' : 'Flag'}
            </button>
            <span className="inline-flex items-center gap-1.5 text-[var(--ink)]">
              <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
              {formatTime(secondsLeft)}
            </span>
            <button
              type="button"
              onClick={() => setActiveRun(null)}
              className="text-[var(--text-muted)] hover:text-[var(--ink)] cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>

        {showRefSheet && activeRun.section === 'math' && (
          <div className="border border-[var(--accent)] bg-[var(--surface)] p-4 text-xs font-mono-tabular text-[var(--text)] grid sm:grid-cols-2 gap-2">
            <div>Circle: A = πr² · C = 2πr · 360° = 2π rad</div>
            <div>Triangle: A = ½bh · Pythagoras: a² + b² = c²</div>
            <div>30°–60°–90°: x : x√3 : 2x · 45°–45°–90°: s : s : s√2</div>
            <div>V: Prism lwh · Cyl πr²h · Sphere ⁴⁄₃πr³ · Cone ⅓πr²h · Pyr ⅓lwh</div>
          </div>
        )}

        {/* Question Navigator */}
        <div className="flex flex-wrap gap-1">
          {qs.map((item, i) => {
            const isCur = i === qIdx;
            const isAns = !!answers[item.id];
            const isFlg = !!flagged[item.id];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setQIdx(i)}
                className={`w-7 h-7 text-[11px] font-mono-tabular border cursor-pointer transition-colors ${
                  isCur
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)] font-semibold'
                    : isFlg
                    ? 'border-[var(--gold)] text-[var(--gold)]'
                    : isAns
                    ? 'border-[var(--border-strong)] bg-[var(--surface-subtle)] text-[var(--ink)]'
                    : 'border-[var(--rule)] text-[var(--text-muted)]'
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        {/* Stimulus: passage, paired texts, notes, or table */}
        {q.passage && (
          <div className="border-l-2 border-[var(--accent)] pl-4 py-1 font-serif-passage text-sm sm:text-base text-[var(--ink)] whitespace-pre-line leading-relaxed">
            {renderPassageWithUnderline(q.passage, q.underlined)}
          </div>
        )}

        {q.texts && q.texts.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-4">
            {q.texts.map((t) => (
              <div key={t.label} className="border border-[var(--rule)] bg-[var(--surface)] p-4 space-y-1.5">
                <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                  {t.label}
                </div>
                <p className="font-serif-passage text-sm text-[var(--ink)] leading-relaxed">
                  {t.body}
                </p>
              </div>
            ))}
          </div>
        )}

        {q.notes && q.notes.length > 0 && (
          <ul className="border border-[var(--rule)] bg-[var(--surface)] p-4 space-y-1.5 text-sm text-[var(--text)]">
            {q.notes.map((n, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[var(--accent)]">•</span>
                <span>{n}</span>
              </li>
            ))}
          </ul>
        )}

        {q.table && (
          <div className="border border-[var(--rule)] bg-[var(--surface)] p-4 space-y-2 overflow-x-auto">
            {q.tableTitle && (
              <div className="text-xs font-semibold text-[var(--ink)]">{q.tableTitle}</div>
            )}
            <table className="w-full text-xs font-mono-tabular text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--rule)] text-[var(--text-muted)]">
                  {q.table.columns.map((c) => (
                    <th key={c} className="py-1.5 pr-4 font-medium">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--rule)] text-[var(--ink)]">
                {q.table.rows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-1.5 pr-4">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="text-base font-medium text-[var(--ink)] whitespace-pre-line">
          {q.question}
        </div>

        {/* MCQ vs SPR Input */}
        {q.type === 'mcq' && q.options ? (
          <div className="space-y-2.5">
            {q.options.map((opt) => {
              const selected = picked === opt.letter;
              return (
                <button
                  key={opt.letter}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.letter }))}
                  className={`w-full text-left p-4 border transition-colors flex items-start gap-3 cursor-pointer ${
                    selected
                      ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)]'
                      : 'border-[var(--rule)] hover:border-[var(--border-strong)] text-[var(--text)]'
                  }`}
                >
                  <span className="font-mono-tabular text-xs text-[var(--text-muted)] mt-0.5">
                    {opt.letter}
                  </span>
                  <span className="text-sm leading-relaxed">{opt.text}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="border border-[var(--rule)] bg-[var(--surface)] p-5 space-y-2 max-w-sm">
            <label className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)] block">
              Student-Produced Response (Grid-in)
            </label>
            <input
              type="text"
              maxLength={6}
              value={picked}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
              placeholder="e.g. 13, 3/4, or -0.5"
              className="w-full px-3 py-2.5 bg-[var(--bg)] border border-[var(--rule)] focus:border-[var(--accent)] focus:outline-none font-mono-tabular text-base text-[var(--ink)]"
            />
            <p className="text-[11px] text-[var(--text-muted)]">
              Up to 5 characters (6 with leading minus). Fractions and equivalent decimals accepted.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            disabled={qIdx === 0}
            onClick={() => setQIdx((i) => Math.max(0, i - 1))}
            className="px-4 py-2 border border-[var(--rule)] text-xs text-[var(--text-muted)] disabled:opacity-40 cursor-pointer"
          >
            Previous
          </button>
          {qIdx < qs.length - 1 ? (
            <button
              type="button"
              onClick={() => setQIdx((i) => i + 1)}
              className="px-5 py-2 bg-[var(--ink)] text-[var(--bg)] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={finishRun}
              className="px-5 py-2 bg-[var(--accent)] text-[var(--accent-fg)] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              Finish &amp; Score <Check className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ── SAT Hub (2 Full Mocks · 8 Domain Drills · Revision Guide) ─────────── */
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--rule)] pb-4">
        <div>
          <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
            DIGITAL SAT · 2 FULL MOCKS (196 QS) · 8 DOMAIN DRILLS (80 QS)
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[var(--ink)] mt-0.5">
            {test.name}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {(
            [
              ['mocks', '2 Full Mocks'],
              ['drills', '8 Domain Drills'],
              ['guide', 'Revision Guide'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={`px-3 py-1.5 border cursor-pointer transition-colors ${
                mode === id
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'mocks' && (
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-muted)]">
            Two original full-length Digital SAT practice tests. Each Module 2 uses the harder route
            so you practise at top-band difficulty. Take a 10-minute break between Reading &amp;
            Writing Module 2 and Math Module 1.
          </p>
          {SAT_MOCKS.map((mock) => (
            <div
              key={mock.id}
              className="border border-[var(--rule)] bg-[var(--surface)] p-5 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-2xl text-[var(--ink)]">{mock.title}</h3>
                <span className="text-xs font-mono-tabular text-[var(--text-muted)]">
                  4 modules · 98 questions · 134 mins
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {mock.modules.map((mod) => (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() =>
                      startRun({
                        title: `${mock.title} · ${mod.title}`,
                        section: mod.section,
                        minutes: mod.minutes,
                        questions: mod.questions,
                      })
                    }
                    className="p-4 border border-[var(--rule)] hover:border-[var(--accent)] bg-[var(--bg)] text-left transition-colors cursor-pointer group flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono-tabular">
                        <span className="text-[var(--accent)]">
                          {mod.minutes} min · {mod.questionCount} Qs
                        </span>
                        <span className="text-[var(--text-muted)] uppercase">{mod.route}</span>
                      </div>
                      <div className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] mt-1">
                        {mod.title}
                      </div>
                    </div>
                    <div className="text-xs font-medium text-[var(--ink)] inline-flex items-center gap-1">
                      Start module <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === 'drills' && (
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-muted)]">
            Targeted 10-question drills across all 8 official Digital SAT Reading &amp; Writing and
            Math domains (including Student-Produced Response math items).
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {SAT_DRILLS.map((drill) => (
              <button
                key={drill.id}
                type="button"
                onClick={() =>
                  startRun({
                    title: `SAT Drill · ${drill.domain}`,
                    section: drill.section,
                    minutes: drill.section === 'rw' ? 12 : 16,
                    questions: drill.questions,
                  })
                }
                className="p-4 border border-[var(--rule)] hover:border-[var(--accent)] bg-[var(--surface)] text-left transition-colors cursor-pointer group flex items-center justify-between gap-4"
              >
                <div>
                  <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                    {drill.section === 'rw' ? 'Reading & Writing' : 'Math'} · {drill.questions.length} Qs
                  </div>
                  <div className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] mt-1">
                    {drill.domain}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === 'guide' && (
        <pre className="whitespace-pre-wrap font-sans text-sm text-[var(--text)] leading-relaxed border border-[var(--rule)] bg-[var(--surface)] p-6 overflow-x-auto">
          {satRevisionGuideMd}
        </pre>
      )}
    </div>
  );
};
