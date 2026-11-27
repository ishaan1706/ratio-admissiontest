import React, { useState } from 'react';
import {
  Bookmark,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Eye,
  EyeOff,
  Flag,
  LayoutGrid,
  X,
} from 'lucide-react';

export interface NavItemStatus {
  index: number;
  answered: boolean;
  flagged: boolean;
}

function fmtClock(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. PEARSON VUE OFFICIAL CBT SHELL (LNAT · UCAT · ESAT · TMUA · TARA)
   Crisp clinical white test canvas (#FFFFFF) with Pearson VUE blue top &
   bottom bars (#005A9C, or UAT-UK navy #0B4F6C for TARA/ESAT/TMUA).
   ═══════════════════════════════════════════════════════════════════════════ */
interface PearsonVueShellProps {
  examLabel: string;
  sectionLabel: string;
  brand?: 'pearson' | 'uatuk';
  questionIndex: number;
  totalQuestions: number;
  secondsLeft: number;
  isFlagged: boolean;
  onToggleFlag: () => void;
  navItems: NavItemStatus[];
  onJump: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
  onExit: () => void;
  canPrev?: boolean;
  isLast?: boolean;
  finishLabel?: string;
  noCalculatorBadge?: boolean;
  toolbarExtra?: React.ReactNode;
  children: React.ReactNode;
}

export const PearsonVueShell: React.FC<PearsonVueShellProps> = ({
  examLabel,
  sectionLabel,
  brand = 'pearson',
  questionIndex,
  totalQuestions,
  secondsLeft,
  isFlagged,
  onToggleFlag,
  navItems,
  onJump,
  onPrev,
  onNext,
  onFinish,
  onExit,
  canPrev = questionIndex > 0,
  isLast = questionIndex >= totalQuestions - 1,
  finishLabel = 'End Exam',
  noCalculatorBadge = false,
  toolbarExtra,
  children,
}) => {
  const [navOpen, setNavOpen] = useState(false);
  const barBg = brand === 'uatuk' ? 'bg-[#0B4F6C]' : 'bg-[#005A9C]';
  const subBarBg = brand === 'uatuk' ? 'bg-[#E9F1F5]' : 'bg-[#EBF2F7]';
  const answeredCount = navItems.filter((n) => n.answered).length;
  const flaggedCount = navItems.filter((n) => n.flagged).length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white text-[#1A1A1A] font-sans select-text">
      {/* Top Pearson VUE Blue Header Bar */}
      <header className={`${barBg} text-white px-4 sm:px-6 h-12 flex items-center justify-between gap-3 shrink-0 shadow-sm`}>
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-semibold text-sm tracking-tight truncate">{examLabel}</span>
          <span className="hidden sm:inline text-white/50">|</span>
          <span className="hidden sm:inline text-xs text-white/90 truncate">{sectionLabel}</span>
          {noCalculatorBadge && (
            <span className="hidden md:inline-block px-2 py-0.5 rounded bg-white/15 text-[11px] font-medium">
              No Calculator
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs shrink-0">
          <div className="flex items-center gap-1.5 font-mono-tabular">
            <Clock className="w-3.5 h-3.5 text-white/80" />
            <span className="hidden sm:inline text-white/80">Time Remaining</span>
            <span className={`font-bold text-sm ${secondsLeft < 300 ? 'text-amber-300' : 'text-white'}`}>
              {fmtClock(secondsLeft)}
            </span>
          </div>
          <div className="font-mono-tabular font-semibold bg-white/15 px-2.5 py-1 rounded">
            {questionIndex + 1} of {totalQuestions}
          </div>
        </div>
      </header>

      {/* Secondary Light Utility Toolbar (Flag for Review, Calculator/Highlighter, Exit) */}
      <div className={`${subBarBg} border-b border-[#C5D3DF] px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs text-[#1A1A1A]`}>
        <div className="flex flex-wrap items-center gap-2">
          {toolbarExtra}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleFlag}
            className={`px-2.5 py-1 rounded border text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
              isFlagged
                ? 'bg-[#FEF3C7] border-[#D97706] text-[#92400E]'
                : 'bg-white border-[#B6C5D3] text-[#1F2937] hover:bg-[#F3F7FA]'
            }`}
          >
            <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-[#D97706] text-[#D97706]' : ''}`} />
            {isFlagged ? 'Flagged for Review' : 'Flag for Review'}
          </button>
          <button
            type="button"
            onClick={onExit}
            className="px-2.5 py-1 rounded border border-[#B6C5D3] bg-white hover:bg-[#F3F7FA] text-xs text-[#374151] cursor-pointer"
          >
            Exit to Studio
          </button>
        </div>
      </div>

      {/* Main Crisp White Exam Canvas */}
      <div className="flex-1 overflow-y-auto bg-white">
        {children}
      </div>

      {/* Bottom Pearson VUE Blue Navigation Footer */}
      <footer className={`${barBg} text-white px-4 sm:px-6 h-12 flex items-center justify-between gap-3 shrink-0`}>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onFinish}
            className="px-3 py-1.5 rounded bg-white/15 hover:bg-white/25 text-xs font-semibold cursor-pointer transition-colors"
          >
            {finishLabel}
          </button>
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            className="px-3 py-1.5 rounded bg-white/15 hover:bg-white/25 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Navigator ({answeredCount}/{totalQuestions})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!canPrev}
            onClick={onPrev}
            className="px-3.5 py-1.5 rounded bg-white/15 hover:bg-white/25 disabled:opacity-40 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          {!isLast ? (
            <button
              type="button"
              onClick={onNext}
              className="px-4 py-1.5 rounded bg-white text-[#005A9C] hover:bg-[#F0F7FC] text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onFinish}
              className="px-4 py-1.5 rounded bg-[#F59E0B] text-[#111827] hover:bg-[#FBBF24] text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              {finishLabel}
            </button>
          )}
        </div>
      </footer>

      {/* Pearson VUE Navigator Modal */}
      {navOpen && (
        <div className="fixed inset-0 z-60 bg-black/45 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-lg bg-white text-[#1A1A1A] shadow-2xl border border-[#C5D3DF] overflow-hidden">
            <div className={`${barBg} text-white px-4 py-3 flex items-center justify-between`}>
              <div className="text-sm font-semibold">
                Navigator — {answeredCount} Complete · {totalQuestions - answeredCount} Incomplete · {flaggedCount} Flagged
              </div>
              <button
                type="button"
                onClick={() => setNavOpen(false)}
                className="p-1 hover:bg-white/15 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E7EB]">
              {navItems.map((item) => (
                <button
                  key={item.index}
                  type="button"
                  onClick={() => {
                    onJump(item.index);
                    setNavOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 flex items-center justify-between text-xs hover:bg-[#F0F7FC] cursor-pointer ${
                    item.index === questionIndex ? 'bg-[#E6F1FA] font-semibold' : ''
                  }`}
                >
                  <span>Question {item.index + 1}</span>
                  <div className="flex items-center gap-3">
                    <span className={item.answered ? 'text-[#047857]' : 'text-[#B91C1C]'}>
                      {item.answered ? 'Complete' : 'Incomplete'}
                    </span>
                    <Flag
                      className={`w-3.5 h-3.5 ${
                        item.flagged ? 'fill-[#D97706] text-[#D97706]' : 'text-gray-300'
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
            <div className="px-4 py-2.5 bg-[#F8FAFC] border-t border-[#E5E7EB] flex justify-end">
              <button
                type="button"
                onClick={() => setNavOpen(false)}
                className={`px-4 py-1.5 rounded ${barBg} text-white text-xs font-semibold cursor-pointer`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   2. COLLEGE BOARD BLUEBOOK OFFICIAL SHELL (Digital SAT)
   Crisp white split-pane canvas, light #F8FAFC header/footer, centered
   hide-able countdown timer, Reference Sheet button, black Question X of Y
   popover bar, and royal-blue pill Back / Next navigation.
   ═══════════════════════════════════════════════════════════════════════════ */
interface BluebookShellProps {
  sectionTitle: string;
  studentLabel?: string;
  questionIndex: number;
  totalQuestions: number;
  secondsLeft: number;
  navItems: NavItemStatus[];
  onJump: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
  onExit: () => void;
  headerRightExtra?: React.ReactNode;
  children: React.ReactNode;
}

export const BluebookShell: React.FC<BluebookShellProps> = ({
  sectionTitle,
  studentLabel = 'Digital SAT Practice',
  questionIndex,
  totalQuestions,
  secondsLeft,
  navItems,
  onJump,
  onPrev,
  onNext,
  onFinish,
  onExit,
  headerRightExtra,
  children,
}) => {
  const [hideTimer, setHideTimer] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white text-[#1E1E1E] font-sans select-text">
      {/* Bluebook Top Bar */}
      <header className="bg-[#F8FAFC] border-b border-dashed border-[#CBD5E1] px-4 sm:px-6 py-2.5 grid grid-cols-3 items-center shrink-0">
        {/* Left: Section & Module */}
        <div className="min-w-0">
          <div className="text-xs sm:text-sm font-semibold text-[#111827] truncate">
            {sectionTitle}
          </div>
          <div className="text-[11px] text-[#4B5563]">Bluebook Practice Mode</div>
        </div>

        {/* Center: Countdown Timer + Hide button */}
        <div className="flex flex-col items-center justify-center">
          {!hideTimer ? (
            <div className={`font-mono-tabular text-base sm:text-lg font-bold leading-none ${secondsLeft < 300 ? 'text-[#B91C1C]' : 'text-[#111827]'}`}>
              {fmtClock(secondsLeft)}
            </div>
          ) : (
            <Clock className="w-4 h-4 text-[#4B5563]" />
          )}
          <button
            type="button"
            onClick={() => setHideTimer((h) => !h)}
            className="mt-1 px-2.5 py-0.5 rounded-full border border-[#CBD5E1] bg-white hover:bg-[#F1F5F9] text-[10px] font-semibold text-[#334155] inline-flex items-center gap-1 cursor-pointer"
          >
            {hideTimer ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            {hideTimer ? 'Show' : 'Hide'}
          </button>
        </div>

        {/* Right: Reference / Exit */}
        <div className="flex items-center justify-end gap-2">
          {headerRightExtra}
          <button
            type="button"
            onClick={onExit}
            className="px-3 py-1.5 rounded-full border border-[#CBD5E1] bg-white hover:bg-[#F1F5F9] text-xs font-medium text-[#334155] cursor-pointer"
          >
            Save &amp; Exit
          </button>
        </div>
      </header>

      {/* Main White Bluebook Canvas */}
      <div className="flex-1 overflow-y-auto bg-white">
        {children}
      </div>

      {/* Bluebook Bottom Bar */}
      <footer className="relative bg-[#F8FAFC] border-t border-dashed border-[#CBD5E1] px-4 sm:px-6 h-14 grid grid-cols-3 items-center shrink-0">
        <div className="text-xs font-semibold text-[#334155] truncate">{studentLabel}</div>

        {/* Center Black Question X of Y Pill */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setPaletteOpen((o) => !o)}
            className="px-4 py-1.5 rounded-lg bg-[#111827] hover:bg-[#1F2937] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            Question {questionIndex + 1} of {totalQuestions}
            {paletteOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Right Royal Blue Pill Buttons */}
        <div className="flex items-center justify-end gap-2">
          {questionIndex > 0 && (
            <button
              type="button"
              onClick={onPrev}
              className="px-4 py-1.5 rounded-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold cursor-pointer"
            >
              Back
            </button>
          )}
          {questionIndex < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={onNext}
              className="px-5 py-1.5 rounded-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold cursor-pointer"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={onFinish}
              className="px-5 py-1.5 rounded-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold cursor-pointer"
            >
              Score Module
            </button>
          )}
        </div>

        {/* Bluebook Question Palette Popover */}
        {paletteOpen && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[340px] sm:w-[420px] rounded-xl bg-white border border-[#CBD5E1] shadow-2xl p-4 space-y-3 z-60">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <span className="text-xs font-bold text-[#111827]">{sectionTitle}</span>
              <button
                type="button"
                onClick={() => setPaletteOpen(false)}
                className="p-1 text-[#64748B] hover:text-[#111827] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-center gap-4 text-[11px] text-[#475569]">
              <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#1D4ED8] inline-block" /> Answered</span>
              <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded border border-dashed border-[#64748B] inline-block" /> Unanswered</span>
              <span className="inline-flex items-center gap-1"><Bookmark className="w-3 h-3 fill-[#DC2626] text-[#DC2626]" /> For Review</span>
            </div>
            <div className="grid grid-cols-7 gap-2 max-h-56 overflow-y-auto pt-1">
              {navItems.map((item) => (
                <button
                  key={item.index}
                  type="button"
                  onClick={() => {
                    onJump(item.index);
                    setPaletteOpen(false);
                  }}
                  className={`relative h-9 rounded text-xs font-bold cursor-pointer transition-colors ${
                    item.answered
                      ? 'bg-[#1D4ED8] text-white'
                      : 'border border-dashed border-[#64748B] text-[#1D4ED8] hover:bg-[#EFF6FF]'
                  } ${item.index === questionIndex ? 'ring-2 ring-[#111827] ring-offset-1' : ''}`}
                >
                  {item.index + 1}
                  {item.flagged && (
                    <Bookmark className="w-3 h-3 fill-[#DC2626] text-[#DC2626] absolute -top-1 -right-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </footer>
    </div>
  );
};
