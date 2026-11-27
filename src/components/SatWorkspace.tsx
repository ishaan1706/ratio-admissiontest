import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Flag,
  RotateCcw,
} from 'lucide-react';
import satMocksRaw from '../data/packs/sat/sat-mocks.json';
import satDrillsRaw from '../data/packs/sat/sat-drills.json';
import { AdmissionsTest } from '../data/allTests';
import { GenericAttempt, OfficialResourcesPanel } from './TestWorkspace';
import { BluebookShell } from './OfficialExamChrome';
import {
  BankQuestion,
  SatGuidesAndPlansView,
  SatQuestionBankView,
  SatSkillLessonsView,
  SatVocabView,
} from './SatRevisionSuite';

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
  passage?: string | null;
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
  commonTrap?: string;
  desmosFriendly?: boolean;
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
  const [mode, setMode] = useState<'bank' | 'mocks' | 'drills' | 'lessons' | 'vocab' | 'guide'>('bank');
  const [linkedSkill, setLinkedSkill] = useState<string | null>(null);
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

    const hasStimulus = Boolean(
      q.passage || (q.texts && q.texts.length > 0) || (q.notes && q.notes.length > 0) || q.table
    );

    return (
      <BluebookShell
        sectionTitle={`${activeRun.title} — ${q.domain}`}
        questionIndex={qIdx}
        totalQuestions={qs.length}
        secondsLeft={secondsLeft}
        navItems={qs.map((item, i) => ({
          index: i,
          answered: !!answers[item.id],
          flagged: !!flagged[item.id],
        }))}
        onJump={(i) => setQIdx(i)}
        onPrev={() => setQIdx((i) => Math.max(0, i - 1))}
        onNext={() => setQIdx((i) => Math.min(qs.length - 1, i + 1))}
        onFinish={finishRun}
        onExit={() => setActiveRun(null)}
        headerRightExtra={
          activeRun.section === 'math' ? (
            <button
              type="button"
              onClick={() => setShowRefSheet((r) => !r)}
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                showRefSheet
                  ? 'border-[#1D4ED8] bg-[#EFF6FF] text-[#1D4ED8]'
                  : 'border-[#CBD5E1] bg-white hover:bg-[#F1F5F9] text-[#334155]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Reference
            </button>
          ) : null
        }
      >
        {showRefSheet && activeRun.section === 'math' && (
          <div className="bg-[#EFF6FF] border-b border-[#BFDBFE] px-6 py-3 text-xs font-mono-tabular text-[#1E3A8A] grid sm:grid-cols-2 gap-2">
            <div>Circle: A = πr² · C = 2πr · 360° = 2π rad</div>
            <div>Triangle: A = ½bh · Pythagoras: a² + b² = c²</div>
            <div>30°–60°–90°: x : x√3 : 2x · 45°–45°–90°: s : s : s√2</div>
            <div>V: Prism lwh · Cyl πr²h · Sphere ⁴⁄₃πr³ · Cone ⅓πr²h · Pyr ⅓lwh</div>
          </div>
        )}

        <div
          className={`h-full grid ${
            hasStimulus ? 'lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#CBD5E1]' : 'max-w-3xl mx-auto'
          }`}
        >
          {/* Left Pane: Passage / Paired Texts / Notes / Table */}
          {hasStimulus && (
            <div className="p-6 sm:p-10 space-y-5 overflow-y-auto bg-white">
              {q.passage && (
                <div className="font-serif-passage text-[16px] text-[#1E1E1E] whitespace-pre-line leading-[1.75]">
                  {renderPassageWithUnderline(q.passage, q.underlined)}
                </div>
              )}

              {q.texts && q.texts.length > 0 && (
                <div className="space-y-4">
                  {q.texts.map((t) => (
                    <div key={t.label} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-1.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#1D4ED8]">
                        {t.label}
                      </div>
                      <p className="font-serif-passage text-sm text-[#1E1E1E] leading-relaxed">
                        {t.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {q.notes && q.notes.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#475569]">
                    While researching a topic, a student has taken the following notes:
                  </div>
                  <ul className="space-y-2 text-sm text-[#1E1E1E] pl-4 list-disc">
                    {q.notes.map((n, i) => (
                      <li key={i} className="leading-relaxed">{n}</li>
                    ))}
                  </ul>
                </div>
              )}

              {q.table && (
                <div className="rounded-lg border border-[#CBD5E1] overflow-x-auto">
                  {q.tableTitle && (
                    <div className="px-4 py-2 bg-[#F8FAFC] border-b border-[#CBD5E1] text-xs font-bold text-[#111827]">
                      {q.tableTitle}
                    </div>
                  )}
                  <table className="w-full text-xs font-mono-tabular text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#CBD5E1] bg-[#F8FAFC] text-[#334155]">
                        {q.table.columns.map((c) => (
                          <th key={c} className="px-3 py-2 font-semibold">{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] text-[#111827]">
                      {q.table.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-3 py-2">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Right Pane: Bluebook Question Header + Choices / SPR */}
          <div className="p-6 sm:p-10 space-y-6 bg-white">
            {/* Bluebook Question Number Bar */}
            <div className="flex items-center justify-between border-b border-dashed border-[#CBD5E1] pb-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded bg-[#111827] text-white text-xs font-bold flex items-center justify-center">
                  {qIdx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => setFlagged((f) => ({ ...f, [q.id]: !f[q.id] }))}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                    flagged[q.id] ? 'text-[#DC2626]' : 'text-[#475569] hover:text-[#111827]'
                  }`}
                >
                  <Flag className={`w-3.5 h-3.5 ${flagged[q.id] ? 'fill-[#DC2626]' : ''}`} />
                  {flagged[q.id] ? 'Marked for Review' : 'Mark for Review'}
                </button>
              </div>
              <span className="text-[11px] font-medium text-[#64748B]">{q.skill}</span>
            </div>

            <div className="text-[15px] font-medium text-[#111827] whitespace-pre-line leading-relaxed">
              {q.question}
            </div>

            {q.type === 'mcq' && q.options ? (
              <div className="space-y-3">
                {q.options.map((opt) => {
                  const selected = picked === opt.letter;
                  return (
                    <button
                      key={opt.letter}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.letter }))}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-colors flex items-start gap-3.5 cursor-pointer ${
                        selected
                          ? 'border-[#1D4ED8] bg-[#EFF6FF] text-[#111827]'
                          : 'border-[#CBD5E1] bg-white hover:border-[#94A3B8] text-[#1E1E1E]'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          selected
                            ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white'
                            : 'border-[#475569] text-[#111827]'
                        }`}
                      >
                        {opt.letter}
                      </span>
                      <span className="text-sm leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border-2 border-[#CBD5E1] bg-[#F8FAFC] p-5 space-y-2.5 max-w-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8] block">
                  Student-Produced Response
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={picked}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  placeholder="e.g. 13, 3/4, or -0.5"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border-2 border-[#94A3B8] focus:border-[#1D4ED8] focus:outline-none font-mono-tabular text-base text-[#111827]"
                />
                <div className="text-xs text-[#475569]">
                  Answer Preview: <strong className="font-mono-tabular text-[#111827]">{picked || '—'}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </BluebookShell>
    );
  }

  /* ── SAT Hub (2 Full Mocks · 8 Domain Drills · Revision Guide) ─────────── */
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--rule)] pb-4">
        <div>
          <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
            DIGITAL SAT · 600-Q FILTERABLE BANK · 2 FULL MOCKS · 30 SKILL LESSONS · 400 VOCAB
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[var(--ink)] mt-0.5">
            {test.name}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {(
            [
              ['bank', 'Question Bank (600)'],
              ['mocks', '2 Full Mocks'],
              ['drills', '8 Drills'],
              ['lessons', '30 Lessons'],
              ['vocab', '400 Vocab'],
              ['guide', 'Guides & Plans'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={`px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${
                mode === id
                  ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-medium'
                  : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'bank' && (
        <SatQuestionBankView
          initialSkill={linkedSkill}
          onOpenLesson={(sk) => {
            setLinkedSkill(sk);
            setMode('lessons');
          }}
          onStartTimedSprint={(title, section, minutes, qs: BankQuestion[]) =>
            startRun({
              title,
              section,
              minutes,
              questions: qs as SatQuestion[],
            })
          }
        />
      )}

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

      {mode === 'lessons' && (
        <SatSkillLessonsView
          initialSkill={linkedSkill}
          onPracticeSkill={(sk) => {
            setLinkedSkill(sk);
            setMode('bank');
          }}
        />
      )}

      {mode === 'vocab' && <SatVocabView />}

      {mode === 'guide' && <SatGuidesAndPlansView />}
    </div>
  );
};
