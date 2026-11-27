import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { ADMISSIONS_TESTS, TestId } from '../data/allTests';
import { SlidingMarquee, SplitText, SpotlightTile } from './ReactBits';
import { RatioUser } from '../lib/account';
import { LegalDoc } from './LegalModal';

interface LandingViewProps {
  onSelectTest: (testId: TestId) => void;
  user: RatioUser | null;
  isPro: boolean;
  onOpenAccount: () => void;
  onOpenPricing: (reason?: string) => void;
  onOpenLegal: (doc: LegalDoc) => void;
}

const MARQUEE_ROW_1 = [
  { label: 'LNAT', tag: '12-Passage Full Mock' },
  { label: 'UCAT', tag: '2 Full 2026 Mocks' },
  { label: 'TARA', tag: '3 Full UAT-UK Mocks' },
  { label: 'ESAT', tag: '270 Science & Maths Qs' },
  { label: 'TMUA', tag: 'Paper 1 & Paper 2 Logic' },
  { label: 'SAT', tag: 'Digital Adaptive Format' },
  { label: 'Critical Thinking', tag: 'LNAT · TARA' },
  { label: 'Verbal Reasoning', tag: 'UCAT' },
  { label: 'Quantitative', tag: 'UCAT · ESAT · SAT' },
  { label: 'Timed Essays', tag: 'LNAT · TARA' },
];

const MARQUEE_ROW_2 = [
  { label: 'Oxford', tag: 'LNAT · TARA · UCAT' },
  { label: 'Cambridge', tag: 'LNAT · ESAT · TMUA · UCAT' },
  { label: 'Imperial', tag: 'ESAT · TMUA · UCAT' },
  { label: 'UCL', tag: 'LNAT · TARA · ESAT · TMUA' },
  { label: 'LSE', tag: 'LNAT · TMUA' },
  { label: "King's College London", tag: 'LNAT · UCAT' },
  { label: 'Durham & Bristol', tag: 'LNAT' },
  { label: 'Ivy League & MIT', tag: 'SAT' },
];

const EXAM_STATS: Record<
  TestId,
  { mocks: string; extras: string; highlight: string }
> = {
  lnat: {
    mocks: 'Full 95-min Mock (42 Qs)',
    extras: '15 Essay Prompts · Revision Lab',
    highlight: 'Split-screen highlighter + 750-word essay ruler',
  },
  ucat: {
    mocks: '2 Full Mocks (368 Qs)',
    extras: '12 Timed Drills · 60 Flashcards',
    highlight: 'VR, DM, QR, SJT · Calc & +25% SEN timer',
  },
  tara: {
    mocks: '3 Full Mocks (132 MCQs)',
    extras: '9 Writing Prompts · Worked Guide',
    highlight: 'Per-module 40-min timers · raw /22 scoring',
  },
  esat: {
    mocks: '2 Mocks × 5 Modules (270 Qs)',
    extras: '160 Flashcards · Formula Sheets',
    highlight: 'No-calculator sprint · 10-week study plan',
  },
  tmua: {
    mocks: 'Full Mock (Paper 1 & 2 · 40 Qs)',
    extras: 'Logic & Proof Guide · Flashcards',
    highlight: '75-min no-calculator papers · 2016–23 archive',
  },
  sat: {
    mocks: '600-Q Bank + 2 Full Mocks',
    extras: '30 Skill Lessons · 400 Vocab',
    highlight: 'Desmos guide · Error log · 2–12 wk plans',
  },
};

const SAMPLE_QUESTIONS: Record<
  'lnat' | 'ucat' | 'sat',
  {
    badge: string;
    passage: string;
    stem: string;
    options: string[];
    correct: number;
    explanation: string;
  }
> = {
  lnat: {
    badge: 'LNAT · Section A · Assumption',
    passage:
      'Defenders of mandatory minimum sentences argue that judicial discretion produces inconsistent outcomes across courts. Yet removing discretion does not eliminate disparity; it merely transfers it from open courtrooms to prosecutors deciding which charge to bring.',
    stem: 'Which assumption underlies the author’s objection?',
    options: [
      'Prosecutors always seek the harshest available sentence.',
      'Charging decisions made by prosecutors are less transparent than judicial sentencing.',
      'Mandatory minimums have reduced overall crime rates.',
    ],
    correct: 1,
    explanation:
      'The contrast between "open courtrooms" and prosecutorial charging assumes prosecutorial discretion operates with less public scrutiny than judicial sentencing.',
  },
  ucat: {
    badge: 'UCAT · Decision Making · Syllogism',
    passage:
      'Every glazed tile in a crate passed inspection. Some square tiles in the crate are glazed. No tile that passed inspection is chipped.',
    stem: 'Which conclusion MUST follow from the statements above?',
    options: [
      'Every square tile in the crate passed inspection.',
      'Some square tiles in the crate are not chipped.',
      'No chipped tiles are square.',
    ],
    correct: 1,
    explanation:
      'Some square tiles are glazed → all glazed tiles passed inspection → none that passed are chipped. Therefore those square glazed tiles cannot be chipped.',
  },
  sat: {
    badge: 'Digital SAT · Math · Algebra',
    passage:
      'A quadratic function f(x) = a(x − 4)² + 12 passes through the point (6, 20), where a is a constant.',
    stem: 'What is the value of f(1)?',
    options: ['24', '30', '36'],
    correct: 1,
    explanation:
      'Plug in (6, 20): a(2)² + 12 = 20 ⇒ 4a = 8 ⇒ a = 2. Then f(1) = 2(1 − 4)² + 12 = 2(9) + 12 = 30.',
  },
};

export const LandingView: React.FC<LandingViewProps> = ({
  onSelectTest,
  user,
  isPro,
  onOpenAccount,
  onOpenPricing,
  onOpenLegal,
}) => {
  const [sampleTab, setSampleTab] = useState<'lnat' | 'ucat' | 'sat'>('lnat');
  const [picked, setPicked] = useState<number | null>(null);
  const sample = SAMPLE_QUESTIONS[sampleTab];

  return (
    <div className="min-h-screen bg-[#09090B] text-[#F4F4F5] flex flex-col overflow-x-hidden selection:bg-[#10B981]/25">
      {/* Crisp Sticky Header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#09090B]/88 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <span className="font-display text-2xl tracking-tight text-white leading-none">
              Ratio
            </span>
            <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-400">
              <a href="#exams" className="hover:text-white transition-colors">
                6 Exams
              </a>
              <a href="#pricing" className="hover:text-white transition-colors">
                Pricing
              </a>
              <button
                type="button"
                onClick={() => onSelectTest('lnat')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Open Studio
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenAccount}
              className="px-3 py-1.5 rounded-lg border border-white/[0.1] hover:border-white/25 text-xs text-zinc-300 hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              {user ? user.name : 'Sign in'}
            </button>
            <button
              type="button"
              onClick={() => onSelectTest('lnat')}
              className="px-4 py-1.5 rounded-lg bg-[#F4F4F5] hover:bg-white text-[#09090B] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isPro ? 'Open Studio' : 'Start Free'}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Asymmetric Paid-Grade Hero with Live Interactive Question Specimen */}
        <section className="relative border-b border-white/[0.07]">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(640px circle at 78% 24%, rgba(16,185,129,0.11), transparent 60%)',
            }}
          />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-16 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.1] bg-white/[0.03] text-[11px] font-mono-tabular text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                LNAT · UCAT · TARA · ESAT · TMUA · SAT
              </div>

              <h1 className="font-display text-[3.2rem] sm:text-[4.6rem] leading-[0.94] tracking-[-0.025em] text-white">
                <SplitText text="Admissions prep" />
                <br />
                <SplitText
                  text="built like the real exam."
                  delayOffset={0.12}
                  className="italic text-[#34D399]"
                />
              </h1>

              <p className="font-serif-passage text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-xl">
                Full-length original mocks, exam-authentic interfaces, active-recall flashcards, and
                verified official board links — all in one calm studio.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onSelectTest('lnat')}
                  className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#09090B] text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {isPro ? 'Continue practicing' : 'Start practicing free'}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#pricing"
                  className="px-5 py-3 rounded-xl border border-white/12 hover:border-white/25 bg-white/[0.03] text-sm font-medium text-white inline-flex items-center gap-2 transition-colors"
                >
                  {isPro ? 'Ratio Pro Active' : 'See Pricing — from £24'}
                </a>
              </div>

              {!isPro && (
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500 pt-1">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> No card required to try
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 14-day refund guarantee
                  </span>
                </div>
              )}
            </div>

            {/* Live Interactive Question Specimen (Try Before Signing Up) */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-white/[0.11] bg-[#111114]/95 shadow-[0_24px_80px_rgba(0,0,0,0.55)] overflow-hidden">
                <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between gap-2 bg-white/[0.02]">
                  <span className="text-[11px] font-mono-tabular uppercase tracking-wider text-emerald-400">
                    Try a real question
                  </span>
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#09090B] border border-white/[0.08]">
                    {(['lnat', 'ucat', 'sat'] as const).map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          setSampleTab(id);
                          setPicked(null);
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono-tabular uppercase cursor-pointer transition-colors ${
                          sampleTab === id
                            ? 'bg-white text-[#09090B] font-semibold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                  <div className="text-[11px] font-mono-tabular text-zinc-500">{sample.badge}</div>
                  <p className="font-serif-passage text-sm sm:text-[15px] text-zinc-200 leading-relaxed bg-[#09090B] border border-white/[0.07] rounded-xl p-4">
                    {sample.passage}
                  </p>
                  <div className="text-sm font-medium text-white">{sample.stem}</div>
                  <div className="space-y-2">
                    {sample.options.map((opt, idx) => {
                      const isPicked = picked === idx;
                      const isRight = idx === sample.correct;
                      const showResult = picked !== null;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setPicked(idx)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-2.5 cursor-pointer ${
                            showResult && isRight
                              ? 'border-emerald-500/60 bg-emerald-500/12 text-white'
                              : showResult && isPicked && !isRight
                              ? 'border-red-500/50 bg-red-500/10 text-zinc-200'
                              : 'border-white/[0.09] hover:border-white/25 bg-[#09090B]/60 text-zinc-300'
                          }`}
                        >
                          <span className="font-mono-tabular text-[11px] text-zinc-500 mt-0.5">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {picked !== null && (
                    <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.07] p-3.5 text-xs text-zinc-200 leading-relaxed flex items-start justify-between gap-3">
                      <div>
                        <span className="font-semibold text-emerald-300">
                          {picked === sample.correct ? 'Correct — ' : 'Not quite — '}
                        </span>
                        {sample.explanation}
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectTest(sampleTab)}
                        className="shrink-0 text-emerald-300 hover:text-emerald-200 font-semibold whitespace-nowrap cursor-pointer"
                      >
                        Full mock →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real Verified Inventory Strip */}
        <section className="border-b border-white/[0.07] bg-[#0C0C0F]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '1,680+', label: 'Original exam-format questions' },
              { value: '11', label: 'Full-length timed mocks' },
              { value: '630+', label: 'Flashcards & SAT vocab cards' },
              { value: '54', label: 'Verified official board links' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-3xl sm:text-4xl text-white">{stat.value}</div>
                <div className="text-xs text-zinc-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 5-Exam Studio Selector */}
        <section id="exams" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-mono-tabular uppercase tracking-wider text-emerald-400">
                Six admissions tracks
              </div>
              <h2 className="font-display text-3xl sm:text-5xl text-white mt-1">
                Pick your test and start in seconds.
              </h2>
            </div>
            <p className="text-sm text-zinc-400 max-w-sm">
              Every track mirrors its real exam timing, question formats, and official resources.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ADMISSIONS_TESTS.map((test) => {
              const meta = EXAM_STATS[test.id];
              return (
                <SpotlightTile
                  key={test.id}
                  onClick={() => onSelectTest(test.id)}
                  className="p-5 rounded-2xl border border-white/[0.09] bg-[#111114] hover:bg-[#16161B] gap-5"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-3xl text-white group-hover:text-[#34D399] transition-colors">
                        {test.code}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <div className="text-xs font-medium text-zinc-200 mt-1.5">{test.subject}</div>
                    <div className="mt-4 space-y-1.5 text-[11px] text-zinc-400 leading-snug">
                      <div className="text-emerald-400/90 font-medium">{meta.mocks}</div>
                      <div>{meta.extras}</div>
                      <div className="text-zinc-500">{meta.highlight}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.07] flex items-center justify-between font-mono-tabular text-[11px] text-zinc-400">
                    <span>{test.duration}</span>
                    <span className="text-zinc-300 group-hover:text-emerald-300">Open →</span>
                  </div>
                </SpotlightTile>
              );
            })}
          </div>
        </section>

        {/* Dual Opposing Sliding Marquee (retained per Ishaan's preference) */}
        <section className="border-y border-white/[0.07] py-9 space-y-2.5 bg-[#0B0B0E]">
          <SlidingMarquee items={MARQUEE_ROW_1} />
          <SlidingMarquee items={MARQUEE_ROW_2} reverse />
        </section>

        {/* Clear Free vs Pro Pricing Section */}
        <section id="pricing" className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-xs font-mono-tabular uppercase tracking-wider text-emerald-400">
              Simple Pricing
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-white">
              One-off pricing. No subscriptions.
            </h2>
            <p className="text-sm text-zinc-400">
              Start free, buy a single test pass through the end of its exam season for £24, or
              unlock all six tests together for £39.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {/* Free */}
            <div className="rounded-2xl border border-white/[0.09] bg-[#111114] p-6 flex flex-col justify-between gap-6">
              <div>
                <div className="text-xs font-mono-tabular uppercase tracking-wider text-zinc-400">
                  Free Starter
                </div>
                <div className="mt-3 font-display text-4xl text-white">£0</div>
                <p className="text-xs text-zinc-400 mt-2">
                  Try the interface, diagnostics, and official links before paying a penny.
                </p>
                <ul className="mt-5 space-y-2.5 text-xs text-zinc-300">
                  {[
                    'Diagnostic & Mock 1 access',
                    'All 54 verified official board links',
                    'Built-in calculators, timers & essay rulers',
                    'Local progress saving in your browser',
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onSelectTest('lnat')}
                className="w-full py-2.5 rounded-xl border border-white/15 hover:border-white/30 text-xs font-semibold text-white cursor-pointer transition-colors"
              >
                {isPro ? 'Open Studio' : 'Start Free Now'}
              </button>
            </div>

            {/* Single Test Pass (£24) */}
            <div className="rounded-2xl border border-white/[0.11] bg-[#111114] p-6 flex flex-col justify-between gap-6">
              <div>
                <div className="text-xs font-mono-tabular uppercase tracking-wider text-zinc-300">
                  Single Test Pass · One-Off
                </div>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="font-display text-4xl text-white">£24</span>
                  <span className="text-xs text-zinc-400">until exam season ends</span>
                </div>
                <p className="text-xs text-zinc-400 mt-2">
                  Pick any one test (LNAT, UCAT, TARA, ESAT, TMUA, or SAT). Pay once, no renewals.
                </p>
                <ul className="mt-5 space-y-2.5 text-xs text-zinc-300">
                  {[
                    'Every full-length mock for your chosen test',
                    'All timed drills, flashcards & revision guides',
                    'Valid until that test’s exam season ends',
                    'Cloud account sync & JSON backup export',
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onOpenPricing()}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-[#09090B] text-xs font-semibold cursor-pointer transition-colors"
              >
                {isPro ? 'Pro Unlocked' : 'Choose Single Test (£24)'}
              </button>
            </div>

            {/* All Tests Bundle (£39) */}
            <div className="rounded-2xl border border-emerald-500/45 bg-gradient-to-b from-emerald-500/[0.12] to-[#111114] p-6 flex flex-col justify-between gap-6 relative">
              <span className="absolute -top-3 right-5 px-3 py-0.5 rounded-full bg-emerald-500 text-[#09090B] text-[10px] font-mono-tabular font-bold uppercase tracking-wider inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Best Value
              </span>
              <div>
                <div className="text-xs font-mono-tabular uppercase tracking-wider text-emerald-400">
                  All Tests Bundle · One-Off
                </div>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="font-display text-4xl text-white">£39</span>
                  <span className="text-xs text-zinc-400">all 6 tests · full cycle</span>
                </div>
                <p className="text-xs text-zinc-300 mt-2">
                  Unlock all six admissions tests together for £15 more. Zero recurring bills.
                </p>
                <ul className="mt-5 space-y-2.5 text-xs text-zinc-200">
                  {[
                    'LNAT + UCAT + TARA + ESAT + TMUA + SAT',
                    'All 1,080+ original questions & 11 full mocks',
                    '14-day no-questions-asked refund guarantee',
                    'All future mock & question additions free',
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onOpenPricing()}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#09090B] text-xs font-semibold cursor-pointer transition-colors"
              >
                {isPro ? 'Pro Unlocked' : 'Get All Tests Bundle (£39)'}
              </button>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              Protected by our 14-day refund policy. Independent prep — not affiliated with exam
              boards.
            </span>
          </div>
        </section>
      </main>

      {/* Commercial Trust & Legal Footer */}
      <footer className="border-t border-white/[0.08] py-8 px-4 sm:px-6 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-zinc-300 font-medium">Ratio · Admissions Test Studio</span>
            <button
              type="button"
              onClick={() => onOpenLegal('terms')}
              className="hover:text-zinc-200 cursor-pointer"
            >
              Terms
            </button>
            <button
              type="button"
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-zinc-200 cursor-pointer"
            >
              Privacy (UK GDPR)
            </button>
            <button
              type="button"
              onClick={() => onOpenLegal('refunds')}
              className="hover:text-zinc-200 cursor-pointer"
            >
              Refund Policy
            </button>
          </div>
          <span>Not affiliated with LNAT, UCAT, UAT-UK, or College Board.</span>
        </div>
      </footer>
    </div>
  );
};
