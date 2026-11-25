import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  Highlighter,
  Strikethrough,
  X,
  AlertCircle,
  CheckCircle2,
  Minus,
  Plus,
} from 'lucide-react';
import { ActiveExamConfig, LnatPassage, LnatQuestion, SectionAAttempt, SkillStat } from '../types';
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
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [struckOut, setStruckOut] = useState<Record<string, Record<string, boolean>>>({});
  const [highlights, setHighlights] = useState<Record<string, boolean>>({});
  const [highlightMode, setHighlightMode] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [secondsLeft, setSecondsLeft] = useState(config.timeLimitSeconds);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const currentSlot = slots[currentIndex];
  const answeredCount = Object.keys(answers).length;

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

  // Keyboard shortcuts: A-E select, F flag, Left/Right navigate
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (showConfirmModal || !currentSlot) return;
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
  }, [currentIndex, currentSlot, showConfirmModal, slots.length]);

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
    if (!highlightMode) return;
    setHighlights((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const passageFontClass =
    fontSize === 'sm'
      ? 'text-[15px] leading-[1.72]'
      : fontSize === 'lg'
        ? 'text-[19px] leading-[1.8]'
        : 'text-[17px] leading-[1.76]';

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-[var(--bg)]">
      {/* Pearson-style exam control bar */}
      <div className="shrink-0 border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-6 h-12 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onExit}
            className="p-1.5 rounded hover:bg-[var(--surface-subtle)] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
            title="Exit exam"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="truncate">
            <span className="text-sm font-semibold text-[var(--text)]">{config.label}</span>
            <span className="hidden sm:inline text-xs text-[var(--text-muted)] ml-2">
              Question {currentIndex + 1} of {slots.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setHighlightMode((v) => !v)}
            className={`px-2.5 py-1 rounded-[6px] text-xs font-medium inline-flex items-center gap-1.5 border transition-colors cursor-pointer ${
              highlightMode
                ? 'border-[#CA8A04] bg-[#FEF08A] text-[var(--text)]'
                : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
            title="Click sentences in the passage to highlight"
          >
            <Highlighter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Highlight</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setFlagged((prev) => ({ ...prev, [question.id]: !prev[question.id] }))
            }
            className={`px-2.5 py-1 rounded-[6px] text-xs font-medium inline-flex items-center gap-1.5 border transition-colors cursor-pointer ${
              isFlagged
                ? 'border-[var(--crimson)] bg-[var(--crimson-soft)] text-[var(--crimson)]'
                : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
            title="Flag question for review (F)"
          >
            <Flag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isFlagged ? 'Flagged' : 'Flag'}</span>
          </button>

          <div
            className={`px-2.5 py-1 rounded-[6px] font-mono-tabular text-xs font-semibold inline-flex items-center gap-1.5 border ${
              isLowTime
                ? 'border-[var(--crimson)] bg-[var(--crimson-soft)] text-[var(--crimson)]'
                : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text)]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            {formatTime(secondsLeft)}
          </div>

          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="px-3 py-1 rounded-[6px] bg-[var(--primary-action)] hover:bg-[var(--accent-hover)] text-[var(--primary-action-fg)] text-xs font-medium transition-colors cursor-pointer"
          >
            Finish ({answeredCount}/{slots.length})
          </button>
        </div>
      </div>

      {/* Split-screen exam workspace */}
      <div className="flex-1 min-h-0 grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border)]">
        {/* Left: Reading passage */}
        <div className="overflow-y-auto exam-scroll bg-[var(--surface)] px-5 sm:px-8 py-6">
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] pb-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider font-medium text-[var(--text-muted)]">
                  {passage.domain} · {passage.sourceStyle}
                </div>
                <h2 className="font-serif-editorial text-2xl font-medium text-[var(--text)] mt-1">
                  {passage.title}
                </h2>
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

            {highlightMode && (
              <div className="px-3 py-2 rounded-[6px] bg-[#FEF9C3] border border-[#FDE047] text-xs text-[var(--text)]">
                Highlight mode on: click any sentence below to highlight or unhighlight it.
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
                      const isLit = Boolean(highlights[key]);
                      return (
                        <span
                          key={key}
                          onClick={() => toggleSentenceHighlight(key)}
                          className={`${isLit ? 'passage-highlight' : ''} ${
                            highlightMode ? 'cursor-pointer hover:bg-[#FEF08A]/50 rounded-[2px]' : ''
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
              <span className="font-mono-tabular font-medium text-[var(--text)]">
                Question {currentIndex + 1} of {slots.length}
              </span>
              <span>{question.difficulty} · {question.skill}</span>
            </div>

            <h3 className="text-base sm:text-lg font-medium text-[var(--text)] leading-snug">
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
                    className={`group flex items-stretch rounded-[8px] border transition-colors ${
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
                        className={`w-6 h-6 rounded-full font-mono-tabular text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5 border ${
                          isSelected
                            ? 'bg-[var(--accent)] text-[var(--accent-fg)] border-[var(--accent)]'
                            : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border-strong)]'
                        }`}
                      >
                        {opt.letter}
                      </span>
                      <span
                        className={`text-sm leading-relaxed ${
                          isStruck
                            ? 'line-through text-[var(--text-muted)]/60'
                            : 'text-[var(--text)]'
                        }`}
                      >
                        {opt.text}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStrike(opt.letter)}
                      title="Cross out option (or right-click)"
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

            <p className="text-[11px] text-[var(--text-muted)]">
              Shortcuts: press <kbd className="font-mono-tabular px-1 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">A</kbd>–<kbd className="font-mono-tabular px-1 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">E</kbd> to answer, <kbd className="font-mono-tabular px-1 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">F</kbd> to flag, right-click an option to strike through.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom navigator */}
      <div className="shrink-0 border-t border-[var(--border)] bg-[var(--surface)] px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          className="px-3 py-1.5 rounded-[6px] border border-[var(--border)] text-xs font-medium text-[var(--text)] disabled:opacity-40 hover:bg-[var(--surface-subtle)] inline-flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
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
                className={`relative w-7 h-7 rounded-[6px] font-mono-tabular text-xs font-medium shrink-0 transition-colors cursor-pointer border ${
                  isCurr
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]'
                    : isAns
                      ? 'border-[var(--emerald)]/40 bg-[var(--emerald-soft)] text-[var(--emerald)]'
                      : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {idx + 1}
                {isFlg && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--crimson)]" />
                )}
              </button>
            );
          })}
        </div>

        {currentIndex < slots.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => Math.min(slots.length - 1, i + 1))}
            className="px-3 py-1.5 rounded-[6px] bg-[var(--primary-action)] hover:bg-[var(--accent-hover)] text-[var(--primary-action-fg)] text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="px-3 py-1.5 rounded-[6px] bg-[var(--emerald)] hover:opacity-90 text-white text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            Submit <CheckCircle2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Submit confirmation modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[10px] bg-[var(--surface)] border border-[var(--border)] p-6 space-y-4 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-[var(--text)]">Submit Section A attempt?</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  You have answered{' '}
                  <span className="font-mono-tabular font-semibold text-[var(--text)]">
                    {answeredCount} of {slots.length}
                  </span>{' '}
                  questions with{' '}
                  <span className="font-mono-tabular font-semibold text-[var(--text)]">
                    {formatTime(secondsLeft)}
                  </span>{' '}
                  remaining.
                </p>
                {answeredCount < slots.length && (
                  <p className="text-xs text-[var(--crimson)] mt-2">
                    There is no negative marking on the LNAT—consider guessing unanswered items
                    before submitting.
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-3.5 py-2 rounded-[6px] border border-[var(--border-strong)] text-xs font-medium text-[var(--text)] hover:bg-[var(--surface-subtle)] cursor-pointer"
              >
                Keep reviewing
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 rounded-[6px] bg-[var(--primary-action)] hover:bg-[var(--accent-hover)] text-[var(--primary-action-fg)] text-xs font-medium cursor-pointer"
              >
                Submit &amp; score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
