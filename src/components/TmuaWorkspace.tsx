import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, Clock, Eye, EyeOff, Flag, RotateCcw, Shuffle } from 'lucide-react';
import {
  TMUA_FLASHCARDS,
  TMUA_LOGIC_GUIDE,
  TMUA_MOCKS,
  TmuaPaper,
} from '../data/packs/tmua/tmuaData';
import { AdmissionsTest } from '../data/allTests';
import { GenericAttempt, OfficialResourcesPanel } from './TestWorkspace';

interface TmuaWorkspaceProps {
  test: AdmissionsTest;
  subTab: 'practice' | 'resources' | 'progress';
  attempts: GenericAttempt[];
  onSaveAttempt: (attempt: GenericAttempt) => void;
}

export const TmuaWorkspace: React.FC<TmuaWorkspaceProps> = ({
  test,
  subTab,
  attempts,
  onSaveAttempt,
}) => {
  const [mode, setMode] = useState<'mocks' | 'flashcards' | 'logic'>('mocks');
  const [activePaper, setActivePaper] = useState<{ mockTitle: string; paper: TmuaPaper } | null>(
    null
  );
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(75 * 60);

  const [fcFilter, setFcFilter] = useState<'All' | 'Paper 1' | 'Paper 2'>('All');
  const [fcIdx, setFcIdx] = useState(0);
  const [fcRevealed, setFcRevealed] = useState(false);
  const [fcSeed, setFcSeed] = useState(0);

  useEffect(() => {
    if (!activePaper || finished) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [activePaper, finished]);

  const cards = useMemo(() => {
    const base =
      fcFilter === 'All'
        ? TMUA_FLASHCARDS
        : TMUA_FLASHCARDS.filter((c) => c.paper === fcFilter);
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

  const startPaper = (mockTitle: string, paper: TmuaPaper) => {
    setActivePaper({ mockTitle, paper });
    setQIdx(0);
    setAnswers({});
    setFlagged({});
    setFinished(false);
    setSecondsLeft(paper.minutes * 60);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finishPaper = () => {
    if (!activePaper) return;
    const correct = activePaper.paper.questions.filter((q) => answers[q.id] === q.answer).length;
    onSaveAttempt({
      id: `tmua-${Date.now()}`,
      testId: 'tmua',
      testCode: `${activePaper.mockTitle} · Paper ${activePaper.paper.paperNumber}`,
      correct,
      total: activePaper.paper.questions.length,
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
    const tmuaAttempts = attempts.filter((a) => a.testId === 'tmua');
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-3xl text-[var(--ink)]">TMUA Progress</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Raw Paper 1 &amp; Paper 2 scores out of 20 (official UAT-UK 1.0–9.0 grades are scaled
            each sitting across both papers combined).
          </p>
        </div>
        {tmuaAttempts.length === 0 ? (
          <div className="border border-[var(--rule)] p-6 text-sm text-[var(--text-muted)]">
            No TMUA papers completed yet.
          </div>
        ) : (
          <div className="border-t border-[var(--rule)] divide-y divide-[var(--rule)]">
            {tmuaAttempts.map((a) => (
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

  /* ── Active TMUA 75-Min Paper Runner ──────────────────────────────────── */
  if (activePaper) {
    const { mockTitle, paper } = activePaper;
    const qs = paper.questions;

    if (finished) {
      const correct = qs.filter((q) => answers[q.id] === q.answer).length;
      const byTopic: Record<string, { ok: number; total: number }> = {};
      for (const q of qs) {
        if (!byTopic[q.topic]) byTopic[q.topic] = { ok: 0, total: 0 };
        byTopic[q.topic].total += 1;
        if (answers[q.id] === q.answer) byTopic[q.topic].ok += 1;
      }

      return (
        <div className="space-y-8">
          <div className="border border-[var(--rule)] bg-[var(--surface)] p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                {mockTitle} · Paper {paper.paperNumber} Review
              </div>
              <div className="font-display text-4xl text-[var(--ink)] mt-1">
                {correct} / {qs.length} ({Math.round((correct / qs.length) * 100)}%)
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Raw practice score out of 20 (no negative marking, no calculator).
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => startPaper(mockTitle, paper)}
                className="px-4 py-2 border border-[var(--rule)] text-xs font-medium text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake
              </button>
              <button
                type="button"
                onClick={() => setActivePaper(null)}
                className="px-4 py-2 bg-[var(--ink)] text-[var(--bg)] text-xs font-semibold cursor-pointer"
              >
                Back to TMUA Hub
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-2.5">
            {Object.entries(byTopic).map(([topic, stat]) => (
              <div
                key={topic}
                className="border border-[var(--rule)] px-3.5 py-2.5 flex items-center justify-between text-xs"
              >
                <span className="text-[var(--text-muted)] truncate pr-2">{topic}</span>
                <span className="font-mono-tabular text-[var(--ink)] font-semibold">
                  {stat.ok}/{stat.total}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {qs.map((q, idx) => {
              const picked = answers[q.id];
              const ok = picked === q.answer;
              return (
                <div key={q.id} className="border border-[var(--rule)] p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono-tabular">
                    <span className="text-[var(--text-muted)]">
                      Q{idx + 1} · {q.topic}
                    </span>
                    <span className={ok ? 'text-[var(--accent)]' : 'text-[var(--crimson)]'}>
                      {ok ? 'Correct' : picked === undefined ? 'Unanswered' : 'Incorrect'}
                    </span>
                  </div>
                  <div className="text-sm text-[var(--ink)] font-medium whitespace-pre-line">
                    {q.stem}
                  </div>
                  <div className="text-xs text-[var(--accent)]">
                    Answer: {String.fromCharCode(65 + q.answer)} — {q.options[q.answer]}
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
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--rule)] pb-3 text-xs font-mono-tabular">
          <span className="text-[var(--text-muted)]">
            {mockTitle} · Paper {paper.paperNumber} · Q{qIdx + 1}/{qs.length} · No calculator
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
              onClick={() => setActivePaper(null)}
              className="text-[var(--text-muted)] hover:text-[var(--ink)] cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {qs.map((item, i) => {
            const isCur = i === qIdx;
            const isAns = answers[item.id] !== undefined;
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

        <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
          {q.topic}
        </div>
        <div className="text-base font-medium text-[var(--ink)] leading-relaxed whitespace-pre-line">
          {q.stem}
        </div>

        <div className="space-y-2.5">
          {q.options.map((opt, idx) => {
            const selected = answers[q.id] === idx;
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
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm leading-relaxed">{opt}</span>
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
              onClick={finishPaper}
              className="px-5 py-2 bg-[var(--accent)] text-[var(--accent-fg)] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              Finish &amp; Score <Check className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ── TMUA Hub ──────────────────────────────────────────────────────────── */
  const card = cards[fcIdx % Math.max(1, cards.length)];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--rule)] pb-4">
        <div>
          <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
            TMUA · PAPER 1 (75 MIN) &amp; PAPER 2 (75 MIN) · NO CALCULATOR
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[var(--ink)] mt-0.5">
            {test.name}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {(
            [
              ['mocks', 'Full Mock (P1 & P2)'],
              ['flashcards', 'Logic & Formula Cards'],
              ['logic', 'Paper 2 Logic Guide'],
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
        <div className="space-y-5">
          <p className="text-sm text-[var(--text-muted)]">
            Exact UAT-UK format: two separate 75-minute, 20-question papers with no calculator, no
            formula sheet, and no negative marking.
          </p>
          {TMUA_MOCKS.map((mock) => (
            <div
              key={mock.id}
              className="border border-[var(--rule)] bg-[var(--surface)] p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl text-[var(--ink)]">{mock.title}</h3>
                <span className="text-xs font-mono-tabular text-[var(--text-muted)]">
                  40 questions · 150 min total
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {mock.papers.map((paper) => (
                  <button
                    key={paper.id}
                    type="button"
                    onClick={() => startPaper(mock.title, paper)}
                    className="p-4 border border-[var(--rule)] hover:border-[var(--accent)] bg-[var(--bg)] text-left transition-colors cursor-pointer group flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-mono-tabular text-[var(--accent)]">
                        Paper {paper.paperNumber} · {paper.minutes} min · {paper.questions.length} Qs
                      </div>
                      <div className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] mt-1">
                        {paper.title}
                      </div>
                    </div>
                    <div className="text-xs font-medium text-[var(--ink)] inline-flex items-center gap-1">
                      Start Paper {paper.paperNumber} <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === 'flashcards' && card && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-1.5">
              {(['All', 'Paper 1', 'Paper 2'] as const).map((sec) => (
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
              <span className="text-[var(--accent)]">{card.paper}</span>
              <span>
                {(fcIdx % cards.length) + 1} / {cards.length}
              </span>
            </div>
            <div className="font-display text-2xl sm:text-3xl text-[var(--ink)] leading-snug">
              {card.front}
            </div>
            {fcRevealed && (
              <div className="pt-4 border-t border-[var(--rule)] text-sm text-[var(--accent)] leading-relaxed">
                {card.back}
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
                    setFcIdx((i) => (i - 1 + cards.length) % cards.length);
                  }}
                  className="text-[var(--text-muted)] hover:text-[var(--ink)] cursor-pointer"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFcRevealed(false);
                    setFcIdx((i) => (i + 1) % cards.length);
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

      {mode === 'logic' && (
        <pre className="whitespace-pre-wrap font-sans text-sm text-[var(--text)] leading-relaxed border border-[var(--rule)] bg-[var(--surface)] p-6 overflow-x-auto">
          {TMUA_LOGIC_GUIDE}
        </pre>
      )}
    </div>
  );
};
