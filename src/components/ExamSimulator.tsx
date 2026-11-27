import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  Highlighter,
  Strikethrough,
  X,
  CheckCircle2,
  Minus,
  Plus,
  LayoutGrid,
} from 'lucide-react';
import {
  ActiveExamConfig,
  ConfidenceLevel,
  LnatPassage,
  LnatQuestion,
  SectionAAttempt,
  SkillStat,
} from '../types';
import { PASSAGES } from '../data/passages';
import { getProjectedLnatScore } from '../data/benchmarks';

interface ExamSimulatorProps {
  config: ActiveExamConfig;
  onExit: () => void;
  onComplete: (attempt: SectionAAttempt, questions: LnatQuestion[]) => void;
}

interface QuestionSlot {
  question: LnatQuestion;
  passage: LnatPassage;
}

type HighlightType = 'claim' | 'evidence' | 'counter';

function splitSentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) || [text];
}

function formatTime(seconds: number): string {
  const s = Math.max(0, seconds);
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const ExamSimulator: React.FC<ExamSimulatorProps> = ({
  config,
  onExit,
  onComplete,
}) => {
  const slots: QuestionSlot[] = useMemo(() => {
    const selectedPassages = config.passageIds
      .map((id) => PASSAGES.find((p) => p.id === id))
      .filter((p): p is LnatPassage => Boolean(p));

    const result: QuestionSlot[] = [];
    for (const passage of selectedPassages) {
      for (const question of passage.questions) {
        if (!config.skillFilter || question.skill === config.skillFilter) {
          result.push({ passage, question });
        }
      }
    }
    return result;
  }, [config]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>>({});
  const [confidence, setConfidence] = useState<Record<string, ConfidenceLevel>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [struckOut, setStruckOut] = useState<Record<string, Record<string, boolean>>>({});
  const [highlights, setHighlights] = useState<Record<string, HighlightType>>({});
  const [activePen, setActivePen] = useState<HighlightType | null>(null);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [secondsLeft, setSecondsLeft] = useState(config.timeLimitSeconds);
  const [showReviewScreen, setShowReviewScreen] = useState(false);

  const currentSlot = slots[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    const elapsed = Math.max(1, config.timeLimitSeconds - secondsLeft);
    let correct = 0;
    const skillBreakdown: Record<string, SkillStat> = {};

    for (const { question } of slots) {
      if (!skillBreakdown[question.skill]) {
        skillBreakdown[question.skill] = { correct: 0, total: 0 };
      }
      skillBreakdown[question.skill].total += 1;
      if (answers[question.id] === question.correctLetter) {
        correct += 1;
        skillBreakdown[question.skill].correct += 1;
      }
    }

    const attempt: SectionAAttempt = {
      id: `att-${Date.now()}`,
      mode: config.mode,
      label: config.label,
      correct,
      total: slots.length,
      projected_42: getProjectedLnatScore(correct, slots.length),
      duration_seconds: elapsed,
      skill_breakdown: skillBreakdown,
      answers,
      confidence,
      created_at: new Date().toISOString(),
    };

    onComplete(
      attempt,
      slots.map((s) => s.question)
    );
  };

  useEffect(() => {
    if (secondsLeft === 0) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (showReviewScreen || !currentSlot) return;
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D', 'E'].includes(key)) {
        setAnswers((prev) => ({
          ...prev,
          [currentSlot.question.id]: key as 'A' | 'B' | 'C' | 'D' | 'E',
        }));
      } else if (key === 'F') {
        setFlagged((prev) => ({
          ...prev,
          [currentSlot.question.id]: !prev[currentSlot.question.id],
        }));
      } else if (e.key === 'ArrowRight' && currentIndex < slots.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex((i) => i - 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentIndex, currentSlot, showReviewScreen, slots.length]);

  if (!currentSlot) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-[var(--text-muted)]">No questions match this selection.</p>
        <button
          type="button"
          onClick={onExit}
          className="mt-4 px-4 py-2 rounded bg-[var(--accent)] text-white text-sm cursor-pointer"
        >
          Back
        </button>
      </div>
    );
  }

  const { passage, question } = currentSlot;
  const selectedLetter = answers[question.id];
  const isFlagged = Boolean(flagged[question.id]);
  const qStrikes = struckOut[question.id] || {};
  const isLowTime = secondsLeft <= 180;

  const toggleStrike = (letter: string) => {
    setStruckOut((prev) => ({
      ...prev,
      [question.id]: {
        ...(prev[question.id] || {}),
        [letter]: !(prev[question.id] || {})[letter],
      },
    }));
  };

  const toggleSentenceHighlight = (key: string) => {
    if (!activePen) return;
    setHighlights((prev) => {
      const next = { ...prev };
      if (next[key] === activePen) {
        delete next[key];
      } else {
        next[key] = activePen;
      }
      return next;
    });
  };

  const passageFontClass =
    fontSize === 'sm'
      ? 'text-[15px] leading-[1.72]'
      : fontSize === 'lg'
        ? 'text-[19px] leading-[1.8]'
        : 'text-[17px] leading-[1.76]';

  // Official Pearson-style Review Screen
  if (showReviewScreen) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 pb-20">
        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
          <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400">
                Pearson VUE Style · Section A Review Screen
              </div>
              <h2 className="font-display text-2xl mt-0.5">{config.label}</h2>
            </div>
            <div className="font-mono-tabular text-sm font-semibold px-3 py-1 rounded bg-white/10">
              {formatTime(secondsLeft)} left
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-[var(--emerald)]">
                  Answered: {answeredCount}/{slots.length}
                </span>
                <span className="font-semibold text-[var(--crimson)]">
                  Flagged: {flaggedCount}
                </span>
                <span className="text-[var(--text-muted)]">
                  Unanswered: {slots.length - answeredCount}
                </span>
              </div>
              <span className="text-[var(--text-muted)]">
                Click any item below to jump back before ending review.
              </span>
            </div>

            {answeredCount < slots.length && (
              <div className="p-3.5 rounded-[8px] bg-[var(--amber-soft)] text-xs text-[var(--amber)] font-medium">
                There is no negative marking on the LNAT—consider selecting your best guess on
                unanswered items before clicking End Review.
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {slots.map((slot, idx) => {
                const ans = answers[slot.question.id];
                const flg = Boolean(flagged[slot.question.id]);
                return (
                  <button
                    key={slot.question.id}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowReviewScreen(false);
                    }}
                    className={`p-3 rounded-[9px] border text-left transition-colors cursor-pointer ${
                      flg
                        ? 'border-[var(--crimson)] bg-[var(--crimson-soft)]'
                        : ans
                          ? 'border-[var(--emerald)]/40 bg-[var(--emerald-soft)]'
                          : 'border-[var(--border)] bg-[var(--bg)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-tabular text-xs font-bold text-[var(--text)]">
                        Q{idx + 1}
                      </span>
                      {flg && <Flag className="w-3.5 h-3.5 text-[var(--crimson)]" />}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-1">
                      {ans ? `Marked ${ans}` : 'Incomplete'}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setShowReviewScreen(false)}
                className="px-4 py-2 rounded-[8px] border border-[var(--border-strong)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface-subtle)] cursor-pointer"
              >
                Return to Questions
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-5 py-2 rounded-[8px] bg-[var(--primary-action)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                End Review &amp; Score <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white text-[#1A1A1A]">
      {/* Official Pearson VUE LNAT Top Blue Bar */}
      <div className="shrink-0 bg-[#005A9C] text-white px-4 sm:px-6 h-12 flex items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onExit}
            className="p-1.5 rounded hover:bg-white/15 text-white/80 hover:text-white cursor-pointer"
            title="Exit exam"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="truncate">
            <span className="text-xs sm:text-sm font-semibold text-white">
              LNAT — {config.label}
            </span>
            <span className="hidden md:inline text-xs text-white/80 ml-2 font-mono-tabular">
              Question {currentIndex + 1} of {slots.length}
            </span>
          </div>
        </div>

        {/* Multi-colour Argument Highlighter + Flag + Timer + Navigator */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1 px-1.5 py-1 rounded bg-white/12 border border-white/20">
            <Highlighter className="w-3.5 h-3.5 text-white/80 ml-1" />
            {(
              [
                { id: 'claim', label: 'Claim', cls: 'bg-[#FEF08A] text-[#1A1A1A]' },
                { id: 'evidence', label: 'Evidence', cls: 'bg-[#BFDBFE] text-[#1A1A1A]' },
                { id: 'counter', label: 'Pivot', cls: 'bg-[#FBCFE8] text-[#1A1A1A]' },
              ] as const
            ).map((pen) => (
              <button
                key={pen.id}
                type="button"
                onClick={() => setActivePen((p) => (p === pen.id ? null : pen.id))}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all cursor-pointer ${
                  activePen === pen.id
                    ? `${pen.cls} font-semibold`
                    : 'text-white/85 hover:text-white'
                }`}
              >
                {pen.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              setFlagged((prev) => ({ ...prev, [question.id]: !prev[question.id] }))
            }
            className={`px-2.5 py-1 rounded text-xs font-medium inline-flex items-center gap-1 border transition-colors cursor-pointer ${
              isFlagged
                ? 'border-[#F59E0B] bg-[#FEF3C7] text-[#92400E]'
                : 'border-white/25 bg-white/10 text-white hover:bg-white/20'
            }`}
            title="Flag question for review (F)"
          >
            <Flag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isFlagged ? 'Flagged' : 'Flag for Review'}</span>
          </button>

          <div
            className={`px-2.5 py-1 rounded font-mono-tabular text-xs font-bold inline-flex items-center gap-1.5 ${
              isLowTime
                ? 'bg-[#DC2626] text-white'
                : 'bg-white/15 text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            {formatTime(secondsLeft)}
          </div>

          <button
            type="button"
            onClick={() => setShowReviewScreen(true)}
            className="px-3 py-1 rounded bg-white text-[#005A9C] hover:bg-[#F0F7FC] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Navigator ({answeredCount}/{slots.length})
          </button>
        </div>
      </div>

      {/* Split-screen Pearson VUE white exam workspace */}
      <div className="flex-1 min-h-0 grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#C8D1DC] bg-white text-[#1A1A1A] [--bg:#FFFFFF] [--surface:#F8FAFC] [--surface-subtle:#EFF6FF] [--text:#1A1A1A] [--ink:#111827] [--text-muted:#475569] [--border:#CBD5E1] [--rule:#CBD5E1] [--accent:#005A9C] [--accent-soft:#E6F1FA]">
        {/* Left: Reading passage */}
        <div className="overflow-y-auto exam-scroll bg-white px-5 sm:px-8 py-6">
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] pb-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider font-semibold text-[var(--accent)]">
                  {passage.domain} · {passage.sourceStyle}
                </div>
                <h2 className="font-display text-3xl text-[var(--text)] mt-1">{passage.title}</h2>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setFontSize((s) => (s === 'lg' ? 'base' : s === 'base' ? 'sm' : 'sm'))
                  }
                  className="p-1.5 rounded border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[var(--text-muted)] cursor-pointer"
                  title="Decrease text size"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFontSize((s) => (s === 'sm' ? 'base' : s === 'base' ? 'lg' : 'lg'))
                  }
                  className="p-1.5 rounded border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[var(--text-muted)] cursor-pointer"
                  title="Increase text size"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {activePen && (
              <div className="px-3 py-2 rounded-[7px] bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] flex items-center justify-between">
                <span>
                  Highlighter active:{' '}
                  <strong className="capitalize">{activePen}</strong> — click any sentence to mark
                  or clear it.
                </span>
                <button
                  type="button"
                  onClick={() => setActivePen(null)}
                  className="text-[var(--accent)] font-medium cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}

            <div className={`font-serif-editorial text-[var(--text)] space-y-4 ${passageFontClass}`}>
              {passage.paragraphs.map((para, pIdx) => {
                const sentences = splitSentences(para);
                return (
                  <p key={pIdx} className="relative pl-7">
                    <span className="absolute left-0 top-1 font-mono-tabular text-[11px] text-[var(--text-muted)] select-none">
                      [{pIdx + 1}]
                    </span>
                    {sentences.map((sent, sIdx) => {
                      const key = `${passage.id}-${pIdx}-${sIdx}`;
                      const hl = highlights[key];
                      const hlClass =
                        hl === 'claim'
                          ? 'hl-claim'
                          : hl === 'evidence'
                            ? 'hl-evidence'
                            : hl === 'counter'
                              ? 'hl-counter'
                              : '';
                      return (
                        <span
                          key={key}
                          onClick={() => toggleSentenceHighlight(key)}
                          className={`${hlClass} ${
                            activePen ? 'cursor-pointer hover:bg-black/5 rounded-[3px]' : ''
                          }`}
                        >
                          {sent}
                        </span>
                      );
                    })}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Question & 5 options */}
        <div className="overflow-y-auto exam-scroll bg-[var(--bg)] px-5 sm:px-8 py-6">
          <div className="max-w-xl mx-auto space-y-5">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span className="font-mono-tabular font-semibold text-[var(--text)]">
                Question {currentIndex + 1} of {slots.length}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border)] font-medium">
                {question.difficulty} · {question.skill}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-[var(--text)] leading-snug">
              {question.stem}
            </h3>

            <div className="space-y-2.5">
              {question.options.map((opt) => {
                const isSelected = selectedLetter === opt.letter;
                const isStruck = Boolean(qStrikes[opt.letter]);
                return (
                  <div
                    key={opt.letter}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      toggleStrike(opt.letter);
                    }}
                    className={`group flex items-stretch rounded-[10px] border transition-all ${
                      isSelected
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                        : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, [question.id]: opt.letter }))
                      }
                      className="flex-1 text-left px-4 py-3 flex items-start gap-3 cursor-pointer"
                    >
                      <span
                        className={`w-6 h-6 rounded-full font-mono-tabular text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border ${
                          isSelected
                            ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                            : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border-strong)]'
                        }`}
                      >
                        {opt.letter}
                      </span>
                      <span
                        className={`text-sm leading-relaxed ${
                          isStruck
                            ? 'line-through text-[var(--text-muted)]/55'
                            : 'text-[var(--text)]'
                        }`}
                      >
                        {opt.text}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStrike(opt.letter)}
                      title="Cross out distractor (or right-click)"
                      className={`px-2.5 border-l border-[var(--border)] flex items-center justify-center transition-colors cursor-pointer ${
                        isStruck
                          ? 'text-[var(--crimson)] bg-[var(--crimson-soft)]'
                          : 'text-[var(--text-muted)]/60 hover:text-[var(--text)]'
                      }`}
                    >
                      <Strikethrough className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Confidence calibration pill */}
            <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-xs">
              <span className="text-[var(--text-muted)] font-medium">Confidence tag:</span>
              <div className="flex items-center gap-1.5">
                {(['sure', 'unsure', 'guess'] as ConfidenceLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setConfidence((prev) => ({ ...prev, [question.id]: lvl }))}
                    className={`px-2.5 py-1 rounded-full capitalize font-medium border transition-colors cursor-pointer ${
                      confidence[question.id] === lvl
                        ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                        : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-[var(--text-muted)]">
              Shortcuts: <kbd className="font-mono-tabular px-1 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">A</kbd>–<kbd className="font-mono-tabular px-1 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">E</kbd> answer · <kbd className="font-mono-tabular px-1 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">F</kbd> flag · right-click to cross out.
            </p>
          </div>
        </div>
      </div>

      {/* Official Pearson VUE Bottom Blue Navigation Bar */}
      <div className="shrink-0 bg-[#005A9C] text-white px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          className="px-3.5 py-1.5 rounded bg-white/15 hover:bg-white/25 text-xs font-semibold text-white disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {slots.map((slot, idx) => {
            const isCurr = idx === currentIndex;
            const isAns = Boolean(answers[slot.question.id]);
            const isFlg = Boolean(flagged[slot.question.id]);
            return (
              <button
                key={slot.question.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-7 h-7 rounded font-mono-tabular text-xs font-semibold shrink-0 transition-colors cursor-pointer border ${
                  isCurr
                    ? 'border-white bg-white text-[#005A9C]'
                    : isAns
                      ? 'border-white/50 bg-white/25 text-white'
                      : 'border-white/25 bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {idx + 1}
                {isFlg && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#F59E0B]" />
                )}
              </button>
            );
          })}
        </div>

        {currentIndex < slots.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => Math.min(slots.length - 1, i + 1))}
            className="px-4 py-1.5 rounded bg-white text-[#005A9C] hover:bg-[#F0F7FC] text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowReviewScreen(true)}
            className="px-4 py-1.5 rounded bg-[#F59E0B] hover:bg-[#FBBF24] text-[#111827] text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
          >
            End Review <CheckCircle2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
