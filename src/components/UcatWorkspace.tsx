import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Calculator,
  Check,
  Clock,
  Eye,
  EyeOff,
  Flag,
  RotateCcw,
  Shuffle,
} from 'lucide-react';
import ucatMocksRaw from '../data/packs/ucat/ucat-mocks.json';
import ucatDrillsRaw from '../data/packs/ucat/ucat-drills.json';
import ucatRevisionRaw from '../data/packs/ucat/ucat-revision.json';
import { AdmissionsTest } from '../data/allTests';
import { GenericAttempt, OfficialResourcesPanel } from './TestWorkspace';
import { UcatBasicCalculator } from './ExamRevisionTools';

interface UcatChart {
  type: 'table' | 'bar' | 'line';
  title: string;
  labels: string[];
  series: { name: string; values: number[] }[];
}

interface UcatVenn {
  sets: string[];
  regions: Record<string, number>;
}

interface UcatQuestion {
  id: string;
  format:
    | 'single-choice'
    | 'true-false-cant-tell'
    | 'yes-no-5'
    | 'appropriateness'
    | 'importance'
    | 'most-least';
  stem: string;
  options: string[];
  statements?: string[];
  answer: number | number[];
  explanation: string;
  maxMarks?: number;
}

interface UcatGroup {
  id?: string;
  title?: string;
  stimulus?: string;
  chart?: UcatChart;
  venn?: UcatVenn;
  questions: UcatQuestion[];
}

interface UcatSection {
  code: 'VR' | 'DM' | 'QR' | 'SJT';
  questionCount: number;
  instructionSeconds: number;
  testSeconds: number;
  extraTime25Seconds: number;
  groups: UcatGroup[];
}

interface UcatMock {
  id: string;
  title: string;
  sections: UcatSection[];
}

interface UcatDrill {
  id: string;
  title: string;
  section: UcatSection;
}

interface UcatFlashcard {
  id: string;
  section: string;
  front: string;
  back: string;
}

interface UcatRevisionData {
  studyPath: {
    stepsMarkdown: string;
    plans: Record<string, { week: string | number; task: string }[]>;
  };
  strategies: Record<string, string>;
  dmLogicMarkdown: string;
  qrMathsMarkdown: string;
  sjtFrameworkMarkdown: string;
  flashcards: UcatFlashcard[];
}

const UCAT_MOCKS = (ucatMocksRaw as { mocks: UcatMock[] }).mocks;
const UCAT_DRILLS = (ucatDrillsRaw as { drills: UcatDrill[] }).drills;
const UCAT_REV = ucatRevisionRaw as UcatRevisionData;

const SECTION_LABELS: Record<UcatSection['code'], string> = {
  VR: 'Verbal Reasoning',
  DM: 'Decision Making',
  QR: 'Quantitative Reasoning',
  SJT: 'Situational Judgement',
};

type UserAnswer =
  | number
  | (number | null)[]
  | { most: number | null; least: number | null }
  | undefined;

function maxMarksForQuestion(q: UcatQuestion): number {
  if (typeof q.maxMarks === 'number') return q.maxMarks;
  return q.format === 'yes-no-5' ? 2 : 1;
}

function scoreQuestion(q: UcatQuestion, ans: UserAnswer): number {
  if (ans === undefined) return 0;
  if (q.format === 'single-choice' || q.format === 'true-false-cant-tell') {
    return typeof ans === 'number' && ans === q.answer ? 1 : 0;
  }
  if (q.format === 'appropriateness' || q.format === 'importance') {
    if (typeof ans !== 'number' || typeof q.answer !== 'number') return 0;
    const diff = Math.abs(ans - q.answer);
    if (diff === 0) return 1;
    if (diff === 1) return 0.5;
    return 0;
  }
  if (q.format === 'yes-no-5') {
    if (!Array.isArray(ans) || !Array.isArray(q.answer)) return 0;
    let right = 0;
    for (let i = 0; i < q.answer.length; i++) {
      if (ans[i] === q.answer[i]) right += 1;
    }
    if (right === q.answer.length) return 2;
    if (right === q.answer.length - 1) return 1;
    return 0;
  }
  if (q.format === 'most-least') {
    if (
      typeof ans !== 'object' ||
      Array.isArray(ans) ||
      !Array.isArray(q.answer) ||
      ans.most === null ||
      ans.least === null ||
      ans.most === ans.least
    ) {
      return 0;
    }
    let pts = 0;
    if (ans.most === q.answer[0]) pts += 0.5;
    if (ans.least === q.answer[1]) pts += 0.5;
    return pts;
  }
  return 0;
}

function isAnswered(q: UcatQuestion, ans: UserAnswer): boolean {
  if (ans === undefined) return false;
  if (q.format === 'yes-no-5') {
    return Array.isArray(ans) && ans.some((v) => v !== null);
  }
  if (q.format === 'most-least') {
    return (
      typeof ans === 'object' &&
      !Array.isArray(ans) &&
      ans.most !== null &&
      ans.least !== null &&
      ans.most !== ans.least
    );
  }
  return typeof ans === 'number';
}

interface FlatItem {
  group: UcatGroup;
  question: UcatQuestion;
}

interface ActiveUcatRun {
  title: string;
  section: UcatSection;
  items: FlatItem[];
  extraTime: boolean;
}

interface UcatWorkspaceProps {
  test: AdmissionsTest;
  subTab: 'practice' | 'resources' | 'progress';
  attempts: GenericAttempt[];
  onSaveAttempt: (attempt: GenericAttempt) => void;
}

export const UcatWorkspace: React.FC<UcatWorkspaceProps> = ({
  test,
  subTab,
  attempts,
  onSaveAttempt,
}) => {
  const [mode, setMode] = useState<'mocks' | 'drills' | 'flashcards' | 'guides'>('mocks');
  const [extraTime25, setExtraTime25] = useState(false);
  const [activeRun, setActiveRun] = useState<ActiveUcatRun | null>(null);

  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [showCalc, setShowCalc] = useState(false);

  // Flashcards state
  const [fcFilter, setFcFilter] = useState('All');
  const [fcIdx, setFcIdx] = useState(0);
  const [fcRevealed, setFcRevealed] = useState(false);
  const [fcSeed, setFcSeed] = useState(0);

  // Guides sub-tab
  const [guideTab, setGuideTab] = useState<'plans' | 'dm' | 'qr' | 'sjt'>('plans');
  const [planWeeks, setPlanWeeks] = useState<'4' | '6' | '8'>('6');

  useEffect(() => {
    if (!activeRun || finished) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [activeRun, finished]);

  const fcSections = useMemo(
    () => ['All', ...Array.from(new Set(UCAT_REV.flashcards.map((c) => c.section)))],
    []
  );

  const filteredCards = useMemo(() => {
    const base =
      fcFilter === 'All'
        ? UCAT_REV.flashcards
        : UCAT_REV.flashcards.filter((c) => c.section === fcFilter);
    if (fcSeed === 0) return base;
    const copy = [...base];
    let s = fcSeed;
    for (let i = copy.length - 1; i > 0; i--) {
      s = (s * 1664525 + 1013904223) % 4294967296;
      const j = s % (i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, [fcFilter, fcSeed]);

  const startSection = (title: string, section: UcatSection) => {
    const items: FlatItem[] = section.groups.flatMap((group) =>
      group.questions.map((question) => ({ group, question }))
    );
    setActiveRun({ title, section, items, extraTime: extraTime25 });
    setQIdx(0);
    setAnswers({});
    setFlagged({});
    setFinished(false);
    setShowCalc(false);
    setSecondsLeft(extraTime25 ? section.extraTime25Seconds : section.testSeconds);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finishRun = () => {
    if (!activeRun) return;
    const rawScore = activeRun.items.reduce(
      (sum, it) => sum + scoreQuestion(it.question, answers[it.question.id]),
      0
    );
    const maxScore = activeRun.items.reduce(
      (sum, it) => sum + maxMarksForQuestion(it.question),
      0
    );
    onSaveAttempt({
      id: `ucat-${Date.now()}`,
      testId: 'ucat',
      testCode: activeRun.title,
      correct: Math.round(rawScore * 10) / 10,
      total: maxScore,
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

  if (subTab === 'resources') {
    return <OfficialResourcesPanel test={test} />;
  }

  if (subTab === 'progress') {
    const ucatAttempts = attempts.filter((a) => a.testId === 'ucat');
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-3xl text-[var(--ink)]">UCAT Progress</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Raw practice marks by subtest and drill (official 900–2700 scaled scores and SJT Bands
            come only from calibrated UCAT Consortium tests).
          </p>
        </div>
        {ucatAttempts.length === 0 ? (
          <div className="border border-[var(--rule)] p-6 text-sm text-[var(--text-muted)]">
            No UCAT sections or drills completed yet.
          </div>
        ) : (
          <div className="border-t border-[var(--rule)] divide-y divide-[var(--rule)]">
            {ucatAttempts.map((a) => (
              <div key={a.id} className="py-3.5 flex items-center justify-between text-sm">
                <div className="font-medium text-[var(--ink)]">{a.testCode}</div>
                <div className="flex items-center gap-5 font-mono-tabular">
                  <span className="text-[var(--accent)] font-semibold">
                    {a.correct} / {a.total} ({Math.round((a.correct / Math.max(1, a.total)) * 100)}%)
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

  /* ── Active UCAT Section / Drill Runner ────────────────────────────────── */
  if (activeRun) {
    const { items, section } = activeRun;

    if (finished) {
      const earned = items.reduce(
        (sum, it) => sum + scoreQuestion(it.question, answers[it.question.id]),
        0
      );
      const maxMarks = items.reduce((sum, it) => sum + maxMarksForQuestion(it.question), 0);
      const blanks = items.filter((it) => !isAnswered(it.question, answers[it.question.id])).length;

      return (
        <div className="space-y-8">
          <div className="border border-[var(--rule)] bg-[var(--surface)] p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                {activeRun.title} · Review
              </div>
              <div className="font-display text-4xl text-[var(--ink)] mt-1">
                {Math.round(earned * 10) / 10} / {maxMarks} raw marks
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {items.length} questions · {blanks} unanswered.{' '}
                {section.code === 'SJT'
                  ? 'Ratio SJT partial credit (1 exact, 0.5 adjacent / per role) is a practice approximation, not an official Band.'
                  : 'Raw practice score only (DM 5-statement items carry 2 marks). Do not treat raw marks as official 900–2700 scaled scores.'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => startSection(activeRun.title, section)}
                className="px-4 py-2 border border-[var(--rule)] text-xs font-medium text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake
              </button>
              <button
                type="button"
                onClick={() => setActiveRun(null)}
                className="px-4 py-2 bg-[var(--ink)] text-[var(--bg)] text-xs font-semibold cursor-pointer"
              >
                Back to UCAT Hub
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {items.map(({ question: q }, idx) => {
              const pts = scoreQuestion(q, answers[q.id]);
              const maxP = maxMarksForQuestion(q);
              const ansLabel =
                q.format === 'yes-no-5' && Array.isArray(q.answer)
                  ? q.answer.map((v, i) => `S${i + 1}: ${v === 0 ? 'Yes' : 'No'}`).join(' · ')
                  : q.format === 'most-least' && Array.isArray(q.answer)
                  ? `Most: ${q.options[q.answer[0]]} | Least: ${q.options[q.answer[1]]}`
                  : typeof q.answer === 'number'
                  ? q.options[q.answer]
                  : '';
              return (
                <div key={q.id} className="border border-[var(--rule)] p-5 space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono-tabular">
                    <span className="text-[var(--text-muted)]">
                      Q{idx + 1} · {q.format}
                    </span>
                    <span
                      className={
                        pts === maxP
                          ? 'text-[var(--accent)]'
                          : pts > 0
                          ? 'text-[var(--gold)]'
                          : 'text-[var(--danger)]'
                      }
                    >
                      {pts} / {maxP} marks
                    </span>
                  </div>
                  <div className="text-sm text-[var(--ink)] font-medium">{q.stem}</div>
                  <div className="text-xs text-[var(--accent)]">Key: {ansLabel}</div>
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

    const { group, question: q } = items[qIdx];
    const currentAns = answers[q.id];

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--rule)] pb-3 text-xs font-mono-tabular">
          <span className="text-[var(--text-muted)]">
            {activeRun.title} · Q{qIdx + 1}/{items.length}
            {activeRun.extraTime ? ' · +25% time' : ''}
          </span>
          <div className="flex items-center gap-4">
            {(section.code === 'QR' || section.code === 'DM') && (
              <button
                type="button"
                onClick={() => setShowCalc((c) => !c)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 border cursor-pointer ${
                  showCalc
                    ? 'border-[var(--accent)] text-[var(--accent)]'
                    : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" /> Calc
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

        {showCalc && (
          <div className="flex justify-end">
            <UcatBasicCalculator />
          </div>
        )}

        {/* Compact Question Strip */}
        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
          {items.map((it, i) => {
            const isCur = i === qIdx;
            const isAns = isAnswered(it.question, answers[it.question.id]);
            const isFlg = !!flagged[it.question.id];
            return (
              <button
                key={it.question.id}
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

        {/* Shared Group Stimulus, Chart, or Venn */}
        {(group.stimulus || group.chart || group.venn) && (
          <div className="border border-[var(--rule)] bg-[var(--surface)] p-5 space-y-3">
            {group.title && (
              <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                {group.title}
              </div>
            )}
            {group.stimulus && (
              <p className="font-serif-passage text-sm sm:text-base text-[var(--ink)] leading-relaxed whitespace-pre-line">
                {group.stimulus}
              </p>
            )}
            {group.chart && (
              <div className="overflow-x-auto space-y-2">
                <div className="text-xs font-semibold text-[var(--ink)]">{group.chart.title}</div>
                <table className="w-full text-xs font-mono-tabular text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--rule)] text-[var(--text-muted)]">
                      <th className="py-1.5 pr-4">Metric</th>
                      {group.chart.labels.map((lbl) => (
                        <th key={lbl} className="py-1.5 pr-4">
                          {lbl}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--rule)] text-[var(--ink)]">
                    {group.chart.series.map((s) => (
                      <tr key={s.name}>
                        <td className="py-1.5 pr-4 text-[var(--text-muted)]">{s.name}</td>
                        {s.values.map((v, i) => (
                          <td key={i} className="py-1.5 pr-4">
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {group.venn && (
              <div className="text-xs font-mono-tabular space-y-1.5">
                <div className="text-[var(--text-muted)]">
                  Venn exclusive regions ({group.venn.sets.join(', ')}):
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(group.venn.regions).map(([k, v]) => (
                    <span
                      key={k}
                      className="px-2 py-1 border border-[var(--rule)] bg-[var(--bg)] text-[var(--ink)]"
                    >
                      {k}: {v}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-base font-medium text-[var(--ink)] whitespace-pre-line">{q.stem}</div>

        {/* Format-Specific Inputs */}
        {q.format === 'yes-no-5' && q.statements ? (
          <div className="border-t border-[var(--rule)] divide-y divide-[var(--rule)]">
            {q.statements.map((stmt, sIdx) => {
              const arr = Array.isArray(currentAns)
                ? currentAns
                : new Array(q.statements!.length).fill(null);
              const val = arr[sIdx];
              const setChoice = (choice: number) => {
                const next = [...arr];
                next[sIdx] = choice;
                setAnswers((prev) => ({ ...prev, [q.id]: next }));
              };
              return (
                <div
                  key={sIdx}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <span className="text-sm text-[var(--ink)] leading-relaxed">
                    {sIdx + 1}. {stmt}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    {q.options.map((optLabel, oIdx) => (
                      <button
                        key={optLabel}
                        type="button"
                        onClick={() => setChoice(oIdx)}
                        className={`px-3.5 py-1.5 text-xs font-mono-tabular border cursor-pointer transition-colors ${
                          val === oIdx
                            ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)] font-semibold'
                            : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                        }`}
                      >
                        {optLabel}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : q.format === 'most-least' ? (
          <div className="space-y-3">
            <div className="text-xs text-[var(--text-muted)]">
              Pick one option as <strong>Most Appropriate</strong> and a different option as{' '}
              <strong>Least Appropriate</strong>.
            </div>
            {q.options.map((opt, idx) => {
              const cur =
                typeof currentAns === 'object' && !Array.isArray(currentAns)
                  ? currentAns
                  : { most: null, least: null };
              const isMost = cur.most === idx;
              const isLeast = cur.least === idx;
              return (
                <div
                  key={idx}
                  className="p-4 border border-[var(--rule)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <span className="text-sm text-[var(--ink)] leading-relaxed">{opt}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [q.id]: {
                            most: idx,
                            least: cur.least === idx ? null : cur.least,
                          },
                        }))
                      }
                      className={`px-3 py-1 text-xs font-mono-tabular border cursor-pointer ${
                        isMost
                          ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)] font-semibold'
                          : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                      }`}
                    >
                      Most
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [q.id]: {
                            most: cur.most === idx ? null : cur.most,
                            least: idx,
                          },
                        }))
                      }
                      className={`px-3 py-1 text-xs font-mono-tabular border cursor-pointer ${
                        isLeast
                          ? 'border-[var(--danger)] bg-[var(--danger-soft)] text-[var(--ink)] font-semibold'
                          : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                      }`}
                    >
                      Least
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2.5">
            {q.options.map((opt, idx) => {
              const selected = currentAns === idx;
              const letter = String.fromCharCode(65 + idx);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: idx }))}
                  className={`w-full text-left p-4 border transition-colors flex items-start gap-3 cursor-pointer ${
                    selected
                      ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)]'
                      : 'border-[var(--rule)] hover:border-[var(--border-strong)] text-[var(--text)]'
                  }`}
                >
                  <span className="font-mono-tabular text-xs text-[var(--text-muted)] mt-0.5">
                    {letter}
                  </span>
                  <span className="text-sm leading-relaxed">{opt}</span>
                </button>
              );
            })}
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
          {qIdx < items.length - 1 ? (
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

  /* ── UCAT Hub (2 Full Mocks · 12 Drills · 60 Flashcards · Plans & Guides) ─ */
  const currentCard = filteredCards[fcIdx % Math.max(1, filteredCards.length)];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--rule)] pb-4">
        <div>
          <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
            UCAT UK · 2 FULL MOCKS (368 QS) · 12 DRILLS (48 QS) · 60 FLASHCARDS
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[var(--ink)] mt-0.5">
            {test.name}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {(
            [
              ['mocks', '2 Full Mocks'],
              ['drills', '12 Drills'],
              ['flashcards', '60 Flashcards'],
              ['guides', 'Plans & Cheat Sheets'],
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[var(--text-muted)]">
              Two full-length 2026-format UCAT mocks (VR, DM, QR, SJT — no Abstract Reasoning).
              On-screen basic calculator available inside QR and DM.
            </p>
            <label className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={extraTime25}
                onChange={(e) => setExtraTime25(e.target.checked)}
                className="accent-[var(--accent)]"
              />
              UCAT SEN (+25% extra time)
            </label>
          </div>

          {UCAT_MOCKS.map((mock) => (
            <div
              key={mock.id}
              className="border border-[var(--rule)] bg-[var(--surface)] p-5 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-2xl text-[var(--ink)]">{mock.title}</h3>
                <span className="text-xs font-mono-tabular text-[var(--text-muted)]">
                  4 subtests · 184 questions
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {mock.sections.map((sec) => {
                  const mins = Math.round(
                    (extraTime25 ? sec.extraTime25Seconds : sec.testSeconds) / 60
                  );
                  return (
                    <button
                      key={sec.code}
                      type="button"
                      onClick={() =>
                        startSection(`${mock.title} · ${SECTION_LABELS[sec.code]}`, sec)
                      }
                      className="p-4 border border-[var(--rule)] hover:border-[var(--accent)] bg-[var(--bg)] text-left transition-colors cursor-pointer group flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="text-xs font-mono-tabular text-[var(--accent)]">
                          {sec.code} · {mins} min
                        </div>
                        <div className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] mt-1">
                          {SECTION_LABELS[sec.code]}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] mt-0.5">
                          {sec.questionCount} questions
                        </div>
                      </div>
                      <div className="text-xs font-medium text-[var(--ink)] inline-flex items-center gap-1">
                        Start subtest <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === 'drills' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {UCAT_DRILLS.map((drill) => (
            <button
              key={drill.id}
              type="button"
              onClick={() =>
                startSection(`UCAT Drill · ${drill.section.code}: ${drill.title}`, drill.section)
              }
              className="p-4 border border-[var(--rule)] hover:border-[var(--accent)] bg-[var(--surface)] text-left transition-colors cursor-pointer group flex flex-col justify-between gap-3"
            >
              <div>
                <div className="text-[11px] font-mono-tabular text-[var(--accent)]">
                  {drill.section.code} · {drill.section.questionCount} Qs ·{' '}
                  {Math.round(drill.section.testSeconds / 60)} min
                </div>
                <div className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] mt-1">
                  {drill.title}
                </div>
              </div>
              <div className="text-xs font-medium text-[var(--ink)] inline-flex items-center gap-1">
                Start drill <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      )}

      {mode === 'flashcards' && currentCard && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {fcSections.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => {
                    setFcFilter(sec);
                    setFcIdx(0);
                    setFcRevealed(false);
                  }}
                  className={`px-2.5 py-1 text-xs border cursor-pointer ${
                    fcFilter === sec
                      ? 'border-[var(--accent)] text-[var(--accent)]'
                      : 'border-[var(--rule)] text-[var(--text-muted)]'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setFcSeed((s) => s + 1);
                setFcIdx(0);
                setFcRevealed(false);
              }}
              className="text-xs font-mono-tabular text-[var(--text-muted)] hover:text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" /> Shuffle
            </button>
          </div>

          <div className="border border-[var(--rule)] bg-[var(--surface)] p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between text-xs font-mono-tabular text-[var(--text-muted)]">
              <span className="text-[var(--accent)]">{currentCard.section}</span>
              <span>
                {(fcIdx % filteredCards.length) + 1} / {filteredCards.length}
              </span>
            </div>
            <div className="font-display text-2xl sm:text-3xl text-[var(--ink)] leading-snug">
              {currentCard.front}
            </div>
            {fcRevealed && (
              <div className="pt-4 border-t border-[var(--rule)] text-sm text-[var(--accent)] leading-relaxed">
                {currentCard.back}
              </div>
            )}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setFcRevealed((r) => !r)}
                className="px-4 py-2 border border-[var(--rule)] hover:border-[var(--accent)] text-xs font-mono-tabular text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer"
              >
                {fcRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {fcRevealed ? 'Hide answer' : 'Reveal answer'}
              </button>
              <div className="flex items-center gap-4 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setFcRevealed(false);
                    setFcIdx((i) => (i - 1 + filteredCards.length) % filteredCards.length);
                  }}
                  className="text-[var(--text-muted)] hover:text-[var(--ink)] cursor-pointer"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFcRevealed(false);
                    setFcIdx((i) => (i + 1) % filteredCards.length);
                  }}
                  className="font-medium text-[var(--accent)] hover:underline cursor-pointer"
                >
                  Next card →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === 'guides' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {(
              [
                ['plans', '4 / 6 / 8-Week Study Plans'],
                ['dm', 'DM Logic Cheat Sheet'],
                ['qr', 'QR Maths Cheat Sheet'],
                ['sjt', 'SJT Ethical Framework'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setGuideTab(id)}
                className={`px-3 py-1.5 border cursor-pointer ${
                  guideTab === id
                    ? 'border-[var(--accent)] text-[var(--accent)]'
                    : 'border-[var(--rule)] text-[var(--text-muted)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {guideTab === 'plans' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono-tabular">
                {(['4', '6', '8'] as const).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setPlanWeeks(w)}
                    className={`px-3 py-1 border cursor-pointer ${
                      planWeeks === w
                        ? 'bg-[var(--ink)] text-[var(--bg)] border-[var(--ink)]'
                        : 'border-[var(--rule)] text-[var(--text-muted)]'
                    }`}
                  >
                    {w}-Week Plan
                  </button>
                ))}
              </div>
              <div className="border-t border-[var(--rule)] divide-y divide-[var(--rule)]">
                {(UCAT_REV.studyPath.plans[planWeeks] ?? []).map((row, idx) => (
                  <div key={idx} className="py-3.5 grid sm:grid-cols-12 gap-2 text-sm">
                    <div className="sm:col-span-2 font-mono-tabular text-xs text-[var(--accent)]">
                      Week {row.week}
                    </div>
                    <div className="sm:col-span-10 text-[var(--text)] leading-relaxed">
                      {row.task}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-sm text-[var(--text)] leading-relaxed border border-[var(--rule)] bg-[var(--surface)] p-6 overflow-x-auto">
              {guideTab === 'dm'
                ? UCAT_REV.dmLogicMarkdown
                : guideTab === 'qr'
                ? UCAT_REV.qrMathsMarkdown
                : UCAT_REV.sjtFrameworkMarkdown}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};
