import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  Clock,
  Eye,
  EyeOff,
  Flag,
  RotateCcw,
  Shuffle,
} from 'lucide-react';
import esatMocksRaw from '../data/packs/esat/esat-mocks.json';
import esatFlashcardsRaw from '../data/packs/esat/esat-flashcards.json';
import esatFormulaSheetsMd from '../data/packs/esat/esat-formula-sheets.md?raw';
import esatStudyPlanMd from '../data/packs/esat/esat-study-plan.md?raw';
import { AdmissionsTest } from '../data/allTests';
import { GenericAttempt, OfficialResourcesPanel } from './TestWorkspace';

interface EsatOption {
  label: string;
  text: string;
}

interface EsatQuestion {
  id: string;
  number: number;
  topic: string;
  difficulty: number;
  stem: string;
  options: EsatOption[];
  answer: string;
  explanation: string;
}

interface EsatModule {
  module: string;
  key: string;
  time_minutes: number;
  question_count: number;
  questions: EsatQuestion[];
}

interface EsatMock {
  id: string;
  title: string;
  modules: EsatModule[];
}

interface EsatFlashcard {
  id: string;
  module: string;
  topic: string;
  front: string;
  back: string;
}

const ESAT_MOCKS = (esatMocksRaw as { mocks: EsatMock[] }).mocks;
const ESAT_CARDS = (esatFlashcardsRaw as { cards: EsatFlashcard[] }).cards;

const MODULE_NAMES = ['All', 'Mathematics 1', 'Mathematics 2', 'Physics', 'Chemistry', 'Biology'];

interface EsatWorkspaceProps {
  test: AdmissionsTest;
  subTab: 'practice' | 'resources' | 'progress';
  attempts: GenericAttempt[];
  onSaveAttempt: (attempt: GenericAttempt) => void;
}

export const EsatWorkspace: React.FC<EsatWorkspaceProps> = ({
  test,
  subTab,
  attempts,
  onSaveAttempt,
}) => {
  const [mode, setMode] = useState<'mocks' | 'flashcards' | 'sheets'>('mocks');
  const [activeRun, setActiveRun] = useState<{ mock: EsatMock; mod: EsatModule } | null>(null);

  // Exam runner state
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(40 * 60);

  // Flashcards state
  const [fcModule, setFcModule] = useState('All');
  const [fcIdx, setFcIdx] = useState(0);
  const [fcRevealed, setFcRevealed] = useState(false);
  const [fcShuffleSeed, setFcShuffleSeed] = useState(0);

  // Sheets sub-view
  const [sheetTab, setSheetTab] = useState<'formulas' | 'plan'>('formulas');

  useEffect(() => {
    if (!activeRun || finished) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [activeRun, finished]);

  const filteredCards = useMemo(() => {
    const base =
      fcModule === 'All' ? ESAT_CARDS : ESAT_CARDS.filter((c) => c.module === fcModule);
    if (fcShuffleSeed === 0) return base;
    const copy = [...base];
    let s = fcShuffleSeed;
    for (let i = copy.length - 1; i > 0; i--) {
      s = (s * 1664525 + 1013904223) % 4294967296;
      const j = s % (i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, [fcModule, fcShuffleSeed]);

  const startModule = (mock: EsatMock, mod: EsatModule) => {
    setActiveRun({ mock, mod });
    setQIdx(0);
    setAnswers({});
    setFlagged({});
    setFinished(false);
    setSecondsLeft(mod.time_minutes * 60);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finishModule = () => {
    if (!activeRun) return;
    const qs = activeRun.mod.questions;
    const correct = qs.filter((q) => answers[q.id] === q.answer).length;
    onSaveAttempt({
      id: `${activeRun.mock.id}-${activeRun.mod.key}-${Date.now()}`,
      testId: 'esat',
      testCode: `${activeRun.mock.title} · ${activeRun.mod.module}`,
      correct,
      total: qs.length,
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
    const esatAttempts = attempts.filter((a) => a.testId === 'esat');
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-3xl text-[var(--ink)]">ESAT Progress</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Completed 27-question ESAT module sittings saved in your browser.
          </p>
        </div>
        {esatAttempts.length === 0 ? (
          <div className="border border-[var(--rule)] p-6 text-sm text-[var(--text-muted)]">
            No ESAT modules completed yet. Pick a module under Practice to begin.
          </div>
        ) : (
          <div className="border-t border-[var(--rule)] divide-y divide-[var(--rule)]">
            {esatAttempts.map((a) => (
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

  /* ── Active 40-Min No-Calculator Module Runner ─────────────────────────── */
  if (activeRun) {
    const { mock, mod } = activeRun;
    const qs = mod.questions;

    if (finished) {
      const correct = qs.filter((q) => answers[q.id] === q.answer).length;
      const byDiff = [1, 2, 3].map((d) => {
        const sub = qs.filter((q) => q.difficulty === d);
        const right = sub.filter((q) => answers[q.id] === q.answer).length;
        return {
          label: d === 1 ? 'Core' : d === 2 ? 'Standard' : 'Hard',
          right,
          total: sub.length,
        };
      });

      return (
        <div className="space-y-8">
          <div className="border border-[var(--rule)] bg-[var(--surface)] p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                {mock.title} · {mod.module} Review
              </div>
              <div className="font-display text-4xl text-[var(--ink)] mt-1">
                {correct} / {qs.length} ({Math.round((correct / qs.length) * 100)}%)
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Raw module score (no negative marking). Official UAT-UK scores are scaled 1.0–9.0
                per module (cohort median ~4.5, 90th percentile ~7.0).
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => startModule(mock, mod)}
                className="px-4 py-2 border border-[var(--rule)] text-xs font-medium text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake
              </button>
              <button
                type="button"
                onClick={() => setActiveRun(null)}
                className="px-4 py-2 bg-[var(--ink)] text-[var(--bg)] text-xs font-semibold cursor-pointer"
              >
                All ESAT Mocks
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-2">
            {byDiff.map((d) => (
              <div
                key={d.label}
                className="border border-[var(--rule)] p-3 flex items-center justify-between text-xs"
              >
                <span className="text-[var(--text-muted)]">{d.label} questions</span>
                <span className="font-mono-tabular text-[var(--ink)] font-semibold">
                  {d.right}/{d.total}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {qs.map((q) => {
              const picked = answers[q.id];
              const isRight = picked === q.answer;
              const ansObj = q.options.find((o) => o.label === q.answer);
              return (
                <div key={q.id} className="border border-[var(--rule)] p-5 space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono-tabular">
                    <span className="text-[var(--text-muted)]">
                      Q{q.number} · Spec {q.topic} ·{' '}
                      {q.difficulty === 1 ? 'Core' : q.difficulty === 2 ? 'Standard' : 'Hard'}
                    </span>
                    <span className={isRight ? 'text-[var(--accent)]' : 'text-[var(--danger)]'}>
                      {isRight ? 'Correct' : `Picked ${picked ?? '—'} · Correct ${q.answer}`}
                    </span>
                  </div>
                  <div className="text-sm text-[var(--ink)] whitespace-pre-line leading-relaxed">
                    {q.stem}
                  </div>
                  <div className="text-xs text-[var(--accent)]">
                    Answer {q.answer}: {ansObj?.text}
                  </div>
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
    const picked = answers[q.id];

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--rule)] pb-3 text-xs font-mono-tabular">
          <span className="text-[var(--text-muted)]">
            {mock.title} · {mod.module} · Q{qIdx + 1}/{qs.length} · No calculator · No formula sheet
          </span>
          <div className="flex items-center gap-4">
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

        {/* 27-question navigator */}
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

        <div className="text-sm sm:text-base text-[var(--ink)] whitespace-pre-line leading-relaxed">
          {q.stem}
        </div>

        <div className="space-y-2.5">
          {q.options.map((opt) => {
            const selected = picked === opt.label;
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.label }))}
                className={`w-full text-left p-4 border transition-colors flex items-start gap-3 cursor-pointer ${
                  selected
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)]'
                    : 'border-[var(--rule)] hover:border-[var(--border-strong)] text-[var(--text)]'
                }`}
              >
                <span className="font-mono-tabular text-xs text-[var(--text-muted)] mt-0.5">
                  {opt.label}
                </span>
                <span className="text-sm leading-relaxed">{opt.text}</span>
              </button>
            );
          })}
        </div>

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
              onClick={finishModule}
              className="px-5 py-2 bg-[var(--accent)] text-[var(--accent-fg)] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              Finish &amp; Score <Check className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ── ESAT Hub (270-Q Mocks · 160 Flashcards · Formula Sheets & Plan) ──── */
  const currentCard = filteredCards[fcIdx % Math.max(1, filteredCards.length)];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--rule)] pb-4">
        <div>
          <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
            ESAT · 270 ORIGINAL MCQS · 160 FLASHCARDS · 5 MODULES
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[var(--ink)] mt-0.5">
            {test.name}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {(
            [
              ['mocks', 'Mocks (270 Qs)'],
              ['flashcards', '160 Flashcards'],
              ['sheets', 'Formulas & Plan'],
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
            Pick Mathematics 1 (compulsory) plus the two modules your course requires. Each module
            runs as an authentic 40-minute, 27-question no-calculator paper.
          </p>
          {ESAT_MOCKS.map((mock) => (
            <div
              key={mock.id}
              className="border border-[var(--rule)] bg-[var(--surface)] p-5 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-2xl text-[var(--ink)]">{mock.title}</h3>
                <span className="text-xs font-mono-tabular text-[var(--text-muted)]">
                  5 modules · 27 Qs / 40 min each
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {mock.modules.map((mod) => (
                  <button
                    key={mod.key}
                    type="button"
                    onClick={() => startModule(mock, mod)}
                    className="p-4 border border-[var(--rule)] hover:border-[var(--accent)] bg-[var(--bg)] text-left transition-colors cursor-pointer group flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono-tabular">
                        <span className="text-[var(--accent)]">{mod.time_minutes} min</span>
                        {mod.key === 'm1' && (
                          <span className="text-[var(--text-muted)]">Compulsory</span>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] mt-1">
                        {mod.module}
                      </div>
                      <div className="text-xs text-[var(--text-muted)] mt-0.5">
                        {mod.question_count} MCQs · No calculator
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

      {mode === 'flashcards' && currentCard && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {MODULE_NAMES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setFcModule(m);
                    setFcIdx(0);
                    setFcRevealed(false);
                  }}
                  className={`px-2.5 py-1 text-xs border cursor-pointer transition-colors ${
                    fcModule === m
                      ? 'border-[var(--accent)] text-[var(--accent)]'
                      : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setFcShuffleSeed((s) => s + 1);
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
              <span className="text-[var(--accent)]">
                {currentCard.module} · Spec {currentCard.topic}
              </span>
              <span>
                {(fcIdx % filteredCards.length) + 1} / {filteredCards.length}
              </span>
            </div>
            <div className="font-display text-2xl sm:text-3xl text-[var(--ink)] leading-snug">
              {currentCard.front}
            </div>
            {fcRevealed && (
              <div className="pt-4 border-t border-[var(--rule)] text-base font-mono-tabular text-[var(--accent)] leading-relaxed">
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

      {mode === 'sheets' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setSheetTab('formulas')}
              className={`px-3 py-1.5 border cursor-pointer ${
                sheetTab === 'formulas'
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-[var(--rule)] text-[var(--text-muted)]'
              }`}
            >
              Formula &amp; Fact Sheets (All 5 Modules)
            </button>
            <button
              type="button"
              onClick={() => setSheetTab('plan')}
              className={`px-3 py-1.5 border cursor-pointer ${
                sheetTab === 'plan'
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-[var(--rule)] text-[var(--text-muted)]'
              }`}
            >
              10-Week ESAT Study Plan
            </button>
          </div>
          <pre className="whitespace-pre-wrap font-sans text-sm text-[var(--text)] leading-relaxed border border-[var(--rule)] bg-[var(--surface)] p-6 overflow-x-auto">
            {sheetTab === 'formulas' ? esatFormulaSheetsMd : esatStudyPlanMd}
          </pre>
        </div>
      )}
    </div>
  );
};
