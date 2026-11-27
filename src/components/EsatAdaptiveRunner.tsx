import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bookmark,
  Check,
  Clock,
  Eye,
  EyeOff,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import {
  AdaptiveAttempt,
  nextQuestion,
  runSummary,
} from '../lib/esatAdaptive';
import {
  EsatPracticeQuestion,
  EsatQuestionRecord,
} from './EsatPracticeSuite';

export interface PersistedAdaptiveState {
  currentId: string | null;
  history: AdaptiveAttempt[];
  answers: Record<string, string>;
  totalElapsed: number;
  finished: boolean;
}

const LEVEL_LABELS: Record<number, string> = {
  1: 'Level 1 · Warm-up',
  2: 'Level 2 · Foundation',
  3: 'Level 3 · Standard ESAT',
  4: 'Level 4 · Hard ESAT',
  5: 'Level 5 · Peak ESAT',
};

function fmtSec(total: number): string {
  const s = Math.max(0, Math.round(total));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

export function loadPersistedAdaptive(storageKey: string): PersistedAdaptiveState | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.history)) {
      return parsed as PersistedAdaptiveState;
    }
  } catch {
    // ignore
  }
  return null;
}

function savePersistedAdaptive(storageKey: string, state: PersistedAdaptiveState) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // ignore
  }
}

interface EsatAdaptiveRunnerProps {
  storageKey: string;
  title: string;
  subtitle: string;
  bank: EsatPracticeQuestion[];
  runLength: number;
  isDaily?: boolean;
  globalHistory: Record<string, EsatQuestionRecord>;
  onRecordAnswer: (q: EsatPracticeQuestion, isCorrect: boolean, secondsSpent: number, isDaily?: boolean) => void;
  onToggleFlag: (qId: string, flag: 'tooHard' | 'revisit') => void;
  onDailyAttempt?: (qId: string) => void;
  onSaveAttemptSummary: (title: string, score: number, total: number) => void;
  onExit: () => void;
}

export const EsatAdaptiveRunner: React.FC<EsatAdaptiveRunnerProps> = ({
  storageKey,
  title,
  subtitle,
  bank,
  runLength,
  isDaily,
  globalHistory,
  onRecordAnswer,
  onToggleFlag,
  onDailyAttempt,
  onSaveAttemptSummary,
  onExit,
}) => {
  const byId = useMemo(() => new Map(bank.map((q) => [q.id, q])), [bank]);

  // Prior exposures ordered oldest to newest so unseen items are preferred
  const seenIds = useMemo(() => {
    return Object.entries(globalHistory)
      .filter(([, rec]) => rec.attempts > 0)
      .sort((a, b) => (a[1].lastAnsweredAt || '').localeCompare(b[1].lastAnsweredAt || ''))
      .map(([id]) => id);
  }, [globalHistory]);

  const [state, setState] = useState<PersistedAdaptiveState>(() => {
    const saved = loadPersistedAdaptive(storageKey);
    if (saved) {
      // Ensure currentId still exists in bank if not finished
      if (!saved.finished && (!saved.currentId || !byId.has(saved.currentId))) {
        const picked = nextQuestion(bank, saved.history, { runLength, seenIds });
        const hydrated: PersistedAdaptiveState = {
          ...saved,
          currentId: picked?.id ?? null,
          finished: !picked,
        };
        savePersistedAdaptive(storageKey, hydrated);
        return hydrated;
      }
      return saved;
    }
    const first = nextQuestion(bank, [], { runLength, seenIds });
    const fresh: PersistedAdaptiveState = {
      currentId: first?.id ?? null,
      history: [],
      answers: {},
      totalElapsed: 0,
      finished: !first,
    };
    savePersistedAdaptive(storageKey, fresh);
    return fresh;
  });

  const [picked, setPicked] = useState<string>('');
  const [revealed, setRevealed] = useState<boolean>(false);
  const [lastStepNote, setLastStepNote] = useState<string>('');
  const [qElapsed, setQElapsed] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(false);
  const [hideTimer, setHideTimer] = useState<boolean>(false);

  const currentQuestion = state.currentId ? byId.get(state.currentId) ?? null : null;

  // Pace timer (1:30 / question)
  useEffect(() => {
    if (state.finished || paused || revealed || !currentQuestion) return;
    const id = window.setInterval(() => {
      setQElapsed((q) => q + 1);
      setState((prev) => ({ ...prev, totalElapsed: prev.totalElapsed + 1 }));
    }, 1000);
    return () => window.clearInterval(id);
  }, [state.finished, paused, revealed, currentQuestion]);

  const handleSubmit = () => {
    if (!currentQuestion || !picked || revealed) return;
    const isCorrect = picked === currentQuestion.answer;
    const seconds = Math.max(1, qElapsed);
    const attempt: AdaptiveAttempt = { id: currentQuestion.id, correct: isCorrect, seconds };
    const nextHistory = [...state.history, attempt];
    const nextAnswers = { ...state.answers, [currentQuestion.id]: picked };

    const delta = isCorrect ? (seconds <= 60 ? '+2 (fast correct ≤60s)' : '+1 (correct)') : '−1 (incorrect)';
    setLastStepNote(`Difficulty step: ${delta}`);
    setRevealed(true);

    onRecordAnswer(currentQuestion, isCorrect, seconds, isDaily);
    if (isDaily && onDailyAttempt) onDailyAttempt(currentQuestion.id);

    const updated: PersistedAdaptiveState = {
      ...state,
      history: nextHistory,
      answers: nextAnswers,
      finished: nextHistory.length >= runLength,
    };
    // Keep currentId until user clicks Next so they can read the explanation
    savePersistedAdaptive(storageKey, {
      ...updated,
      finished: false,
    });
    setState((prev) => ({
      ...prev,
      history: nextHistory,
      answers: nextAnswers,
    }));
  };

  const handleNext = () => {
    const nextQ = nextQuestion(bank, state.history, { runLength, seenIds });
    if (!nextQ) {
      const doneState: PersistedAdaptiveState = {
        ...state,
        currentId: null,
        finished: true,
      };
      savePersistedAdaptive(storageKey, doneState);
      setState(doneState);
      const correctCount = state.history.filter((h) => h.correct).length;
      onSaveAttemptSummary(title, correctCount, state.history.length);
      return;
    }
    const nextState: PersistedAdaptiveState = {
      ...state,
      currentId: nextQ.id,
      finished: false,
    };
    savePersistedAdaptive(storageKey, nextState);
    setState(nextState);
    setPicked('');
    setRevealed(false);
    setLastStepNote('');
    setQElapsed(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishEarly = () => {
    const doneState: PersistedAdaptiveState = {
      ...state,
      currentId: null,
      finished: true,
    };
    savePersistedAdaptive(storageKey, doneState);
    setState(doneState);
    if (state.history.length > 0) {
      const correctCount = state.history.filter((h) => h.correct).length;
      onSaveAttemptSummary(title, correctCount, state.history.length);
    }
  };

  const handleRestart = () => {
    const first = nextQuestion(bank, [], { runLength, seenIds });
    const fresh: PersistedAdaptiveState = {
      currentId: first?.id ?? null,
      history: [],
      answers: {},
      totalElapsed: 0,
      finished: !first,
    };
    savePersistedAdaptive(storageKey, fresh);
    setState(fresh);
    setPicked('');
    setRevealed(false);
    setLastStepNote('');
    setQElapsed(0);
    setPaused(false);
  };

  // Keyboard shortcuts: A-H select, Enter submit/next
  useEffect(() => {
    if (state.finished || !currentQuestion) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const k = e.key.toUpperCase();
      if (!revealed && k.length === 1 && k >= 'A' && k <= 'H') {
        if (currentQuestion.options.some((o) => o.label === k)) {
          e.preventDefault();
          setPicked(k);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (!revealed && picked) handleSubmit();
        else if (revealed) handleNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  /* ── Summary Screen ─────────────────────────────────────────────────────── */
  if (state.finished || !currentQuestion) {
    const summary = runSummary(state.history, bank);
    const correctCount = state.history.filter((h) => h.correct).length;
    const pct = state.history.length ? Math.round((correctCount / state.history.length) * 100) : 0;
    const paceStatus = summary.pace.status;
    const paceDiffAbs = Math.abs(Math.round(summary.pace.differenceSeconds));

    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-emerald-400">
                {title} · Adaptive Summary
              </div>
              <h3 className="font-display text-3xl text-white mt-1">
                {correctCount}/{state.history.length} ({pct}%)
                {summary.estimatedLevel !== null && (
                  <span className="text-emerald-400 ml-3">
                    · Est. Level {summary.estimatedLevel.toFixed(1)}/5
                  </span>
                )}
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 max-w-2xl leading-relaxed">
                Practice difficulty estimate (mean of your last 8 attempts) — for training calibration
                only, not a predicted official ESAT score.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleRestart}
                className="px-3.5 py-2 rounded-lg border border-white/15 hover:border-white/30 text-xs text-zinc-200 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> New Adaptive Run
              </button>
              <button
                type="button"
                onClick={onExit}
                className="px-4 py-2 rounded-lg bg-[#F4F4F5] text-[#09090B] text-xs font-semibold cursor-pointer"
              >
                Back to ESAT Practice
              </button>
            </div>
          </div>

          {/* Pace + Accuracy by Difficulty Level (1–5) */}
          <div className="grid sm:grid-cols-6 gap-2.5">
            <div className="sm:col-span-1 rounded-xl border border-white/[0.07] bg-[#09090B] p-3 space-y-1">
              <div className="text-[10px] font-mono-tabular uppercase text-zinc-500">Pace (1:30/Q)</div>
              <div className="text-sm font-mono-tabular font-semibold text-white">
                {fmtSec(summary.pace.elapsedSeconds)}
              </div>
              <div
                className={`text-[11px] font-mono-tabular ${
                  paceStatus === 'behind'
                    ? 'text-amber-400'
                    : paceStatus === 'ahead'
                      ? 'text-emerald-400'
                      : 'text-zinc-400'
                }`}
              >
                {paceStatus === 'behind'
                  ? `${paceDiffAbs}s behind`
                  : paceStatus === 'ahead'
                    ? `${paceDiffAbs}s ahead`
                    : 'On pace'}
              </div>
            </div>
            {[1, 2, 3, 4, 5].map((lvl) => {
              const row = summary.accuracyByLevel[lvl];
              const accPct = row && row.accuracy !== null ? Math.round(row.accuracy * 100) : null;
              return (
                <div
                  key={lvl}
                  className="rounded-xl border border-white/[0.07] bg-[#09090B] p-3 space-y-1"
                >
                  <div className="text-[10px] font-mono-tabular uppercase text-zinc-500">
                    Level {lvl}
                  </div>
                  <div className="text-sm font-mono-tabular font-semibold text-white">
                    {row && row.attempted > 0 ? `${row.correct}/${row.attempted}` : '—'}
                  </div>
                  <div className="text-[11px] font-mono-tabular text-zinc-400">
                    {accPct !== null ? `${accPct}%` : 'Not reached'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full Worked Explanations */}
        <div className="space-y-3">
          {state.history.map((att, i) => {
            const q = byId.get(att.id);
            if (!q) return null;
            const userAns = state.answers[att.id];
            return (
              <div
                key={`${att.id}-${i}`}
                className="rounded-xl border border-white/[0.08] bg-[#111114] p-4 space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-mono-tabular text-zinc-400">
                    Q{i + 1} · {q.moduleName} · Spec {q.topic} · Level {q.difficulty}/5
                    {typeof att.seconds === 'number' ? ` · ${fmtSec(att.seconds)}` : ''}
                  </span>
                  <span
                    className={
                      att.correct
                        ? 'text-emerald-400 font-semibold'
                        : 'text-rose-400 font-semibold'
                    }
                  >
                    {att.correct ? `Correct (${userAns})` : `Your answer: ${userAns} · Key: ${q.answer}`}
                  </span>
                </div>
                <p className="text-sm text-zinc-200 whitespace-pre-line leading-relaxed">{q.stem}</p>
                <p className="text-xs text-zinc-400 leading-relaxed pt-2 border-t border-white/[0.06] whitespace-pre-line">
                  <strong className="text-zinc-200">Worked explanation:</strong> {q.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── Active Adaptive Question Runner ────────────────────────────────────── */
  const qNum = state.history.length + (revealed ? 0 : 1);
  const expectedSec = Math.max(1, state.history.length + 1) * 90;
  const paceGap = state.totalElapsed - expectedSec;
  const flags = globalHistory[currentQuestion.id]?.flags || {};
  const isCorrectNow = revealed && picked === currentQuestion.answer;

  return (
    <div className="space-y-5">
      {/* Top Bar: Progress, Adaptive 1–5 Level Bar & 1:30/Q Pace Timer */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> {title} · Q{Math.min(runLength, qNum)}/{runLength}
          </div>
          <div className="text-xs text-zinc-400">
            {currentQuestion.moduleName} · Spec {currentQuestion.topic} · {subtitle}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!hideTimer && (
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[#09090B] text-xs font-mono-tabular">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>
                Q:{' '}
                <strong className={qElapsed > 90 ? 'text-amber-400' : 'text-white'}>
                  {fmtSec(qElapsed)}
                </strong>
              </span>
              <span className="text-zinc-600">|</span>
              <span>
                Total: <strong className="text-white">{fmtSec(state.totalElapsed)}</strong> /{' '}
                {fmtSec(expectedSec)}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  paceGap > 0
                    ? 'bg-amber-500/15 text-amber-300'
                    : 'bg-emerald-500/15 text-emerald-300'
                }`}
              >
                {paceGap > 0 ? `${paceGap}s behind` : `${Math.abs(paceGap)}s ahead`}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="p-2 rounded-lg border border-white/10 hover:border-white/25 text-zinc-300 hover:text-white cursor-pointer"
            title={paused ? 'Resume timer' : 'Pause timer'}
          >
            {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setHideTimer((h) => !h)}
            className="p-2 rounded-lg border border-white/10 hover:border-white/25 text-zinc-300 hover:text-white cursor-pointer"
            title={hideTimer ? 'Show timer' : 'Hide timer'}
          >
            {hideTimer ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={handleFinishEarly}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#09090B] text-xs font-semibold cursor-pointer"
          >
            End &amp; Summary
          </button>
          <button
            type="button"
            onClick={onExit}
            className="px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-white/25 text-xs text-zinc-400 hover:text-white cursor-pointer"
          >
            Save &amp; Exit
          </button>
        </div>
      </div>

      {/* Adaptive Difficulty Bar (Levels 1–5) */}
      <div className="rounded-xl border border-white/[0.07] bg-[#111114] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono-tabular uppercase tracking-wider text-zinc-400">
            Adaptive Difficulty
          </span>
          <div className="flex items-center gap-1" aria-label={`Difficulty level ${currentQuestion.difficulty} of 5`}>
            {[1, 2, 3, 4, 5].map((lvl) => (
              <span
                key={lvl}
                className={`h-2.5 w-7 rounded-sm transition-colors ${
                  lvl <= currentQuestion.difficulty
                    ? currentQuestion.difficulty >= 4
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-white font-mono-tabular">
            {LEVEL_LABELS[currentQuestion.difficulty] || `Level ${currentQuestion.difficulty}/5`}
          </span>
        </div>
        <span className="text-[11px] text-zinc-400">
          {lastStepNote || 'Correct: +1 (≤60s: +2) · Wrong: −1 · Capped at Level 5 (Peak ESAT)'}
        </span>
      </div>

      {/* Question Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono-tabular text-zinc-400">
            No calculator · Keys A–H select, Enter submit/next
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleFlag(currentQuestion.id, 'tooHard')}
              className={`px-2.5 py-1 rounded-md border text-[11px] inline-flex items-center gap-1 cursor-pointer ${
                flags.tooHard
                  ? 'border-rose-500/50 bg-rose-500/15 text-rose-300'
                  : 'border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3 h-3" /> Too hard
            </button>
            <button
              type="button"
              onClick={() => onToggleFlag(currentQuestion.id, 'revisit')}
              className={`px-2.5 py-1 rounded-md border text-[11px] inline-flex items-center gap-1 cursor-pointer ${
                flags.revisit
                  ? 'border-amber-500/50 bg-amber-500/15 text-amber-300'
                  : 'border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-3 h-3" /> Revisit
            </button>
          </div>
        </div>

        <div className="text-[15px] text-zinc-100 whitespace-pre-line leading-relaxed">
          {currentQuestion.stem}
        </div>

        <div className="space-y-2">
          {currentQuestion.options.map((opt) => {
            const isSel = picked === opt.label;
            const isKey = opt.label === currentQuestion.answer;
            let cls =
              'border-white/[0.09] bg-[#09090B] text-zinc-200 hover:border-white/25';
            if (revealed) {
              if (isKey) cls = 'border-emerald-500/60 bg-emerald-500/12 text-emerald-100';
              else if (isSel && !isKey) cls = 'border-rose-500/60 bg-rose-500/12 text-rose-100';
            } else if (isSel) {
              cls = 'border-emerald-400 bg-emerald-500/12 text-white';
            }
            return (
              <button
                key={opt.label}
                type="button"
                disabled={revealed}
                onClick={() => setPicked(opt.label)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-colors flex items-start gap-3 cursor-pointer disabled:cursor-default ${cls}`}
              >
                <span className="font-mono-tabular text-xs font-bold w-5 shrink-0 mt-0.5">
                  {opt.label}
                </span>
                <span className="text-sm leading-relaxed flex-1">{opt.text}</span>
                {revealed && isKey && <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                {revealed && isSel && !isKey && <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="rounded-xl border border-white/[0.08] bg-[#09090B] p-4 space-y-1.5 text-xs">
            <div className={isCorrectNow ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
              {isCorrectNow
                ? `Correct (${currentQuestion.answer}) · ${lastStepNote}`
                : `Incorrect — correct answer is ${currentQuestion.answer} · ${lastStepNote}`}
            </div>
            <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2">
          {!revealed ? (
            <button
              type="button"
              disabled={!picked}
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-[#09090B] text-xs font-semibold cursor-pointer"
            >
              Submit Answer
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#09090B] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              {state.history.length >= runLength ? 'View Adaptive Summary' : 'Next Adaptive Question'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress strip */}
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: runLength }, (_, i) => {
          const att = state.history[i];
          const isCurrent = i === state.history.length && !revealed;
          let cls = 'bg-[#09090B] border-white/[0.08] text-zinc-600';
          if (att) {
            cls = att.correct
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-500/20 border-rose-500/50 text-rose-300';
          } else if (isCurrent) {
            cls = 'bg-white/10 border-white/40 text-white font-semibold';
          }
          return (
            <span
              key={i}
              className={`w-7 h-7 rounded-md border text-[11px] font-mono-tabular flex items-center justify-center ${cls}`}
            >
              {i + 1}
            </span>
          );
        })}
      </div>
    </div>
  );
};
