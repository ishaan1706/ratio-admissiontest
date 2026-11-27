import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Atom,
  BookOpen,
  Check,
  Clock,
  Compass,
  Feather,
  Flame,
  GraduationCap,
  Layers,
  Monitor,
  Plus,
  Scale,
  ShieldCheck,
  Sigma,
  Sparkles,
  Target,
  User,
} from 'lucide-react';
import { ADMISSIONS_TESTS, TestId } from '../data/allTests';
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

const EXAM_STATS: Record<
  TestId,
  { mocks: string; extras: string; interfaceLabel: string; universities: string; tag: string }
> = {
  lnat: {
    mocks: 'Full 95-min Mock (42 Qs)',
    extras: '15 Essay Prompts · Revision Lab',
    interfaceLabel: 'Pearson VUE screen',
    universities: 'Oxford · Cambridge · UCL · LSE · KCL',
    tag: 'Law',
  },
  ucat: {
    mocks: '2 Full Mocks (368 Qs)',
    extras: '12 Timed Drills · 60 Flashcards',
    interfaceLabel: 'Pearson VUE + Calculator',
    universities: 'UK & ANZ Medicine & Dentistry',
    tag: 'Medicine',
  },
  tara: {
    mocks: '205-Q Drills + 3 Full Mocks',
    extras: 'Essay Studio (18 Prompts · Models) · Daily 5',
    interfaceLabel: 'UAT-UK exam screen',
    universities: 'Oxford · UCL · Warwick',
    tag: 'Applied Reasoning',
  },
  esat: {
    mocks: '800-Q Adaptive Bank + 2 Mocks',
    extras: '160/Module · Levels 1–5 · 1:30/Q Pace',
    interfaceLabel: 'UAT-UK exam screen',
    universities: 'Cambridge · Imperial · UCL',
    tag: 'Engineering & Science',
  },
  tmua: {
    mocks: 'Full Mock (Paper 1 & 2 · 40 Qs)',
    extras: 'Logic & Proof Guide · Flashcards',
    interfaceLabel: 'UAT-UK exam screen',
    universities: 'Cambridge · Imperial · LSE · Warwick',
    tag: 'Mathematics',
  },
  sat: {
    mocks: '1,000-Q Bank + 4 Full Mocks',
    extras: 'Adaptive M2 · 30 Lessons · 400 Vocab',
    interfaceLabel: 'Bluebook screen',
    universities: 'US Ivy League · MIT · Stanford',
    tag: 'US Admissions',
  },
};

type SampleKey = 'lnat' | 'ucat' | 'tara' | 'esat' | 'sat';

const SAMPLE_QUESTIONS: Record<
  SampleKey,
  {
    code: string;
    badge: string;
    screenStyle: string;
    timer: string;
    passage: string;
    stem: string;
    options: string[];
    correct: number;
    explanation: string;
  }
> = {
  lnat: {
    code: 'LNAT',
    badge: 'LNAT · Section A · Assumption',
    screenStyle: 'Pearson VUE split-screen',
    timer: '94:12',
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
    code: 'UCAT',
    badge: 'UCAT · Decision Making · Syllogism',
    screenStyle: 'Pearson VUE + Calculator',
    timer: '28:40',
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
  tara: {
    code: 'TARA',
    badge: 'TARA · Critical Thinking · Flaw',
    screenStyle: 'UAT-UK Pearson VUE',
    timer: '39:10',
    passage:
      'Every student who joined the university debating society this term achieved a first-class mark in their autumn essay. Clearly, joining the debating society guarantees a first-class essay mark.',
    stem: 'Which flaw is committed by the argument above?',
    options: [
      'It appeals to an unqualified authority.',
      'It mistakes a correlation among self-selected students for a causal guarantee.',
      'It relies on an equivocation on the word "essay".',
    ],
    correct: 1,
    explanation:
      'Strong writers may disproportionately join the debating society; past overlap does not establish that membership itself guarantees the outcome.',
  },
  esat: {
    code: 'ESAT',
    badge: 'ESAT · Mathematics 1 · Level 4',
    screenStyle: 'UAT-UK no-calculator',
    timer: '38:25',
    passage:
      'The quadratic equation x² − (k + 2)x + 2k + 1 = 0 has two equal real roots, where k is a real constant.',
    stem: 'What is the sum of all possible values of k?',
    options: ['0', '4', '8'],
    correct: 1,
    explanation:
      'Set discriminant Δ = 0: (k + 2)² − 4(2k + 1) = k² − 4k = 0, so k = 0 or k = 4. Their sum is 4.',
  },
  sat: {
    code: 'SAT',
    badge: 'Digital SAT · Math · Module 2 (Harder)',
    screenStyle: 'College Board Bluebook',
    timer: '34:15',
    passage:
      'A quadratic function f(x) = a(x − 4)² + 12 passes through the point (6, 20), where a is a constant.',
    stem: 'What is the value of f(1)?',
    options: ['24', '30', '36'],
    correct: 1,
    explanation:
      'Plug in (6, 20): a(2)² + 12 = 20 ⇒ 4a = 8 ⇒ a = 2. Then f(1) = 2(1 − 4)² + 12 = 2(9) + 12 = 30.',
  },
};

const HERO_STICKERS = [
  { label: 'LNAT', Icon: Scale, style: { left: '5%', top: '13%', '--r': '-10deg' } as React.CSSProperties },
  { label: 'UCAT', Icon: Activity, style: { left: '10%', top: '34%', '--r': '8deg' } as React.CSSProperties },
  { label: 'TARA', Icon: Compass, style: { left: '4%', top: '54%', '--r': '-6deg' } as React.CSSProperties },
  { label: 'ESAT', Icon: Atom, style: { right: '5%', top: '12%', '--r': '9deg' } as React.CSSProperties },
  { label: 'TMUA', Icon: Sigma, style: { right: '10%', top: '33%', '--r': '-8deg' } as React.CSSProperties },
  { label: 'SAT', Icon: GraduationCap, style: { right: '4%', top: '53%', '--r': '6deg' } as React.CSSProperties },
];

const FAQ_ITEMS: [string, string][] = [
  [
    'Which admissions tests does Ratio cover?',
    'All six major UK and US university admissions exams: LNAT (Law), UCAT (Medicine), TARA (Applied Reasoning), ESAT (Engineering & Science), TMUA (Mathematics), and the adaptive Digital SAT.',
  ],
  [
    'Do the mocks look like the real test day screen?',
    'Yes. LNAT and UCAT run in a Pearson VUE split-screen shell (with LNAT highlighter and UCAT calculator), ESAT, TMUA, and TARA use a UAT-UK no-calculator shell, and Digital SAT runs in a College Board Bluebook-style shell with adaptive Module 2 routing.',
  ],
  [
    'Is there a monthly subscription?',
    'Never. You can start free, unlock any single test through the end of its exam season for a one-off £24, or unlock all six tests together for a one-off £39.',
  ],
  [
    'Are the questions original or copied from past papers?',
    'Every question, drill, and essay model inside Ratio is 100% original and written to exam-board format. Official past papers and specimen tests are linked directly to the exam boards in each track’s Official Resources tab.',
  ],
  [
    'Does my progress save automatically?',
    'Yes — every Daily 5, mistake queue item, mock attempt, and essay draft saves automatically in your browser, with optional account sync and JSON export.',
  ],
];

export const LandingView: React.FC<LandingViewProps> = ({
  onSelectTest,
  user,
  isPro,
  onOpenAccount,
  onOpenPricing,
  onOpenLegal,
}) => {
  const [sampleTab, setSampleTab] = useState<SampleKey>('lnat');
  const [picked, setPicked] = useState<number | null>(null);
  const [showcaseScreen, setShowcaseScreen] = useState<'pearson' | 'uatuk' | 'bluebook'>('pearson');
  const sample = SAMPLE_QUESTIONS[sampleTab];

  return (
    <div className="min-h-screen bg-[#070709] text-[#F4F4F5] flex flex-col selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Frosted Platinum Glass Sticky Header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#070709]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <a href="#" className="flex items-center gap-2.5 group">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-white/15 to-white/[0.03] border border-white/15 flex items-center justify-center text-xs font-display text-emerald-400 shadow-inner">
                R
              </span>
              <span className="font-display text-2xl tracking-tight text-white leading-none">
                Ratio
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono-tabular uppercase tracking-[0.16em] text-zinc-500 border-l border-white/10 pl-2.5">
                Admissions Studio
              </span>
            </a>
            <nav className="hidden md:flex items-center gap-7 text-[13px] text-zinc-400">
              <a href="#exams" className="hover:text-white transition-colors">
                Exams
              </a>
              <a href="#features" className="hover:text-white transition-colors">
                Inside the studio
              </a>
              <a href="#pricing" className="hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#faq" className="hover:text-white transition-colors">
                FAQ
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenAccount}
              className="px-3.5 py-2 rounded-xl border border-white/[0.1] hover:border-white/25 bg-white/[0.03] hover:bg-white/[0.06] text-xs font-medium text-zinc-200 inline-flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-zinc-400" />
              {user ? user.name : 'Sign in'}
            </button>
            <button
              type="button"
              onClick={() => onSelectTest('lnat')}
              className="ratio-btn-3d px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              {isPro ? 'Open Studio' : 'Start Free'}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Centered Black-Platinum Architectural Grid Hero */}
        <section className="relative ratio-grid-bg overflow-hidden">
          {/* Ambient Emerald × Midnight Radial Spotlight */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(56% 42% at 50% 18%, rgba(16, 185, 129, 0.14), rgba(24, 30, 48, 0.28) 48%, transparent 78%)',
            }}
          />

          {/* Floating Tactile Subject Stickers (desktop only, inspired by recall-politics) */}
          <div className="hidden xl:block pointer-events-none absolute inset-0 max-w-7xl mx-auto">
            {HERO_STICKERS.map(({ label, Icon, style }) => (
              <div
                key={label}
                style={style}
                className="ratio-sticker absolute w-[74px] h-[74px] rounded-[22px] flex flex-col items-center justify-center gap-1 text-zinc-200"
              >
                <Icon className="w-6 h-6 text-emerald-300/90" strokeWidth={1.6} />
                <span className="text-[9px] font-mono-tabular uppercase tracking-widest text-zinc-400">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.04] backdrop-blur-md text-xs text-zinc-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
              <span>
                Built for <strong className="text-white font-semibold">LNAT · UCAT · TARA · ESAT · TMUA · SAT</strong>
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-display text-[3.3rem] sm:text-[5.25rem] leading-[0.96] tracking-[-0.03em] max-w-4xl mx-auto ratio-platinum-text"
            >
              Practice in the
              <br />
              <em className="italic font-normal text-emerald-300/95 not-italic-override">
                exact exam room.
              </em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 text-[16px] sm:text-[18px] text-zinc-400 leading-[1.65] max-w-xl mx-auto"
            >
              Original full-length mocks, authentic Pearson VUE, UAT-UK, and Bluebook screens,
              adaptive drills, and essay studios.{' '}
              <strong className="text-zinc-200 font-medium">
                Six admissions tests, one calm workspace.
              </strong>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
            >
              <button
                type="button"
                onClick={() => onSelectTest('lnat')}
                className="ratio-btn-3d px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                {isPro ? 'Continue practicing' : 'Start practicing free'}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpenPricing()}
                className="px-5 py-3 rounded-xl border border-white/[0.12] hover:border-white/25 bg-white/[0.03] hover:bg-white/[0.07] text-sm font-medium text-zinc-200 hover:text-white transition-all cursor-pointer"
              >
                Pricing — from £24
              </button>
            </motion.div>

            {!isPro && (
              <div className="mt-3.5 text-[11px] font-mono-tabular text-zinc-500">
                No card required to try · One-off passes, zero subscriptions
              </div>
            )}

            {/* macOS-Framed Interactive Studio Stage (Live Question Preview + Floating Adaptive Card) */}
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-4xl mx-auto mt-14 sm:mt-16 text-left"
            >
              {/* Soft backlight behind window */}
              <div
                className="pointer-events-none absolute -inset-8 opacity-60 blur-3xl"
                style={{
                  background:
                    'radial-gradient(closest-side, rgba(16, 185, 129, 0.18), rgba(255, 255, 255, 0.06) 55%, transparent)',
                }}
              />

              <div className="relative rounded-2xl border border-white/[0.14] bg-[#0D0E12] shadow-[0_50px_120px_-30px_rgba(0,0,0,0.95)] overflow-hidden">
                {/* macOS Window Chrome */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#13141A] border-b border-white/[0.08]">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <span className="text-[11px] font-mono-tabular text-zinc-400 bg-black/40 border border-white/[0.06] px-2.5 py-0.5 rounded-md">
                      ratio.studio / {sample.screenStyle}
                    </span>
                  </div>

                  {/* Interactive 5-Exam Live Switcher */}
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/50 border border-white/[0.07]">
                    {(['lnat', 'ucat', 'tara', 'esat', 'sat'] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => {
                          setSampleTab(tab);
                          setPicked(null);
                        }}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono-tabular font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                          sampleTab === tab
                            ? 'bg-white text-[#09090B] shadow-sm'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Split Question Body */}
                <div className="p-5 sm:p-7 grid md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-6 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono-tabular">
                      <span className="text-emerald-400 uppercase tracking-wider">
                        {sample.badge}
                      </span>
                      <span className="inline-flex items-center gap-1 text-zinc-400 bg-white/[0.04] border border-white/[0.07] px-2 py-0.5 rounded">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        {sample.timer}
                      </span>
                    </div>
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5 text-[13.5px] text-zinc-200 leading-[1.7] font-serif-passage">
                      {sample.passage}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                      <span>Try answering live →</span>
                      <button
                        type="button"
                        onClick={() => onSelectTest(sampleTab)}
                        className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                      >
                        Open full {sample.code} workspace <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-6 space-y-3">
                    <p className="text-[14px] font-medium text-white leading-snug">{sample.stem}</p>
                    <div className="space-y-2">
                      {sample.options.map((opt, idx) => {
                        const isPicked = picked === idx;
                        const isRight = idx === sample.correct;
                        const stateCls =
                          picked === null
                            ? 'border-white/[0.09] bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.05] text-zinc-200'
                            : isRight
                              ? 'border-emerald-400/60 bg-emerald-500/12 text-emerald-100'
                              : isPicked
                                ? 'border-rose-400/50 bg-rose-500/10 text-rose-200'
                                : 'border-white/[0.05] bg-transparent text-zinc-500';
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setPicked(idx)}
                            className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-[13px] transition-all flex items-start gap-2.5 cursor-pointer ${stateCls}`}
                          >
                            <span className="font-mono-tabular text-[11px] font-semibold mt-0.5 opacity-75">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {picked !== null && (
                      <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.07] p-3.5 text-xs text-zinc-200 leading-relaxed">
                        <span className="font-semibold text-emerald-300 mr-1.5">
                          {picked === sample.correct ? 'Correct.' : 'Explanation:'}
                        </span>
                        {sample.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Floating Companion Card (Daily 5 & Adaptive Pace, desktop only) */}
              <div className="hidden lg:block absolute -right-6 -bottom-7 w-64 rounded-2xl border border-white/[0.15] bg-[#12141B]/95 backdrop-blur-xl p-4 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)] rotate-[2deg]">
                <div className="flex items-center justify-between text-[10px] font-mono-tabular uppercase tracking-wider text-emerald-400">
                  <span className="inline-flex items-center gap-1">
                    <Flame className="w-3 h-3" /> Adaptive Daily 5
                  </span>
                  <span className="text-zinc-400">Lvl 4 / 5</span>
                </div>
                <div className="mt-2.5 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <span
                      key={lvl}
                      className={`h-1.5 flex-1 rounded-full ${
                        lvl <= 4 ? 'bg-emerald-400' : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-300">
                  <span>Pace: 1:18 / Q</span>
                  <span className="text-emerald-400 font-mono-tabular">−12s ahead</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Smooth Bottom Fade out of Grid */}
          <div className="h-24 -mt-10 relative pointer-events-none bg-gradient-to-b from-transparent to-[#070709]" />
        </section>

        {/* 5-Column Platinum Stats Strip (inspired by recall-politics .lp-strip) */}
        <section className="border-y border-white/[0.08] bg-gradient-to-r from-transparent via-white/[0.035] to-transparent">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
            {[
              ['3,375+', 'Original questions', 'Written to real exam-board specs'],
              ['13', 'Full-length mocks', 'Timed under official conditions'],
              ['6', 'Exam screens', 'Pearson VUE, UAT-UK & Bluebook'],
              ['470+', 'Vocab & flashcards', 'SAT themes, UCAT & TMUA logic'],
              ['54', 'Official board links', 'Direct past papers & specimens'],
            ].map(([num, label, sub]) => (
              <div key={label} className="px-6 py-8">
                <div className="font-display text-4xl sm:text-[2.75rem] leading-none ratio-platinum-num">
                  {num}
                </div>
                <div className="mt-2.5 text-sm font-semibold text-white">{label}</div>
                <div className="mt-1 text-xs text-zinc-400 leading-relaxed">{sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 6 Admissions Tracks — Crisp Static Interactive Grid (No Marquee) */}
        <section id="exams" className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="text-[11px] font-mono-tabular uppercase tracking-[0.16em] text-emerald-400">
                Admissions Tracks
              </div>
              <h2 className="font-display text-4xl sm:text-5xl ratio-platinum-text tracking-tight mt-2">
                Choose your exam.
              </h2>
            </div>
            <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
              Every track opens directly into its own full workspace with authentic timed mocks,
              targeted skill banks, mistake queues, and official resources.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ADMISSIONS_TESTS.map((test) => {
              const info = EXAM_STATS[test.id];
              return (
                <button
                  key={test.id}
                  type="button"
                  onClick={() => onSelectTest(test.id)}
                  className="ratio-card-lift group text-left rounded-2xl border border-white/[0.09] hover:border-emerald-400/45 bg-gradient-to-b from-[#13141A] to-[#0D0E12] p-6 flex flex-col justify-between gap-6 cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono-tabular text-xs font-bold tracking-[0.12em] uppercase text-white">
                        {test.code}
                      </span>
                      <span className="text-[10px] font-mono-tabular uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/[0.09] bg-white/[0.03] text-zinc-400 group-hover:border-emerald-500/30 group-hover:text-emerald-300 transition-colors">
                        {info.interfaceLabel}
                      </span>
                    </div>

                    <div>
                      <div className="text-[15px] font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        {info.mocks}
                      </div>
                      <div className="text-xs text-zinc-400 mt-1 leading-relaxed">{info.extras}</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between gap-2">
                    <span className="text-[11px] text-zinc-500 truncate">{info.universities}</span>
                    <span className="text-xs font-semibold text-zinc-200 group-hover:text-emerald-300 inline-flex items-center gap-1 shrink-0 transition-colors">
                      Enter{' '}
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3 Alternating Editorial Feature Showcases (inspired by recall-politics .lp-feat) */}
        <section id="features" className="max-w-6xl mx-auto px-5 sm:px-8 pb-20 sm:pb-28 space-y-6">
          {/* Feature 1: Official Exam Screens */}
          <div className="rounded-[28px] border border-white/[0.09] bg-gradient-to-br from-[#101923] via-[#0B0E14] to-[#090A0D] p-7 sm:p-12 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center overflow-hidden">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono-tabular uppercase tracking-wider text-emerald-300">
                <Monitor className="w-4 h-4" /> Official Exam Screens
              </div>
              <h3 className="font-display text-3xl sm:text-[2.6rem] leading-[1.05] text-white tracking-tight">
                Zero test-day surprises.
              </h3>
              <p className="text-sm sm:text-[15px] text-zinc-400 leading-relaxed">
                Sit every mock in the exact chrome your exam uses — Pearson VUE split-screen with
                highlighter and UCAT calculator, UAT-UK no-calculator CBT, or College Board Bluebook
                with adaptive Module 2 routing.
              </p>
              <hr className="border-white/[0.08]" />
              <div className="text-xs font-mono-tabular text-zinc-300">
                Flag for Review · Question Navigator · Official timing rules
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/[0.14] bg-[#0B0C10] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.9)] overflow-hidden lg:rotate-[1.2deg] hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08] bg-[#14161D]">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono-tabular text-zinc-400">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Preview exam chrome
                  </div>
                  <div className="flex gap-1">
                    {(
                      [
                        ['pearson', 'Pearson VUE'],
                        ['uatuk', 'UAT-UK'],
                        ['bluebook', 'Bluebook'],
                      ] as const
                    ).map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setShowcaseScreen(id)}
                        className={`px-2.5 py-1 rounded text-[10px] font-mono-tabular cursor-pointer transition-colors ${
                          showcaseScreen === id
                            ? 'bg-emerald-400 text-[#04130D] font-semibold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-5">
                  <div
                    className={`rounded-xl overflow-hidden border ${
                      showcaseScreen === 'bluebook'
                        ? 'border-zinc-200 bg-white text-zinc-900'
                        : 'border-slate-300 bg-white text-slate-900'
                    }`}
                  >
                    <div
                      className={`px-4 py-2.5 flex items-center justify-between text-xs font-semibold ${
                        showcaseScreen === 'pearson'
                          ? 'bg-[#005A9C] text-white'
                          : showcaseScreen === 'uatuk'
                            ? 'bg-[#0B4F6C] text-white'
                            : 'bg-[#F3F4F6] text-zinc-900 border-b border-zinc-200'
                      }`}
                    >
                      <span>
                        {showcaseScreen === 'pearson'
                          ? 'LNAT / UCAT · Section A'
                          : showcaseScreen === 'uatuk'
                            ? 'ESAT / TARA / TMUA · No Calculator'
                            : 'Digital SAT · Reading & Writing · Module 2'}
                      </span>
                      <span className="font-mono-tabular">
                        {showcaseScreen === 'bluebook' ? '31:42 · Hide' : 'Time Remaining 39:18'}
                      </span>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-4 text-[11px] leading-relaxed">
                      <div className="border-r border-slate-200 pr-3 text-slate-600">
                        <div className="font-semibold text-slate-900 mb-1">Passage / Stem</div>
                        Authentic split-pane layout with keyboard shortcuts, strikethrough, and
                        instant review jump.
                      </div>
                      <div className="space-y-1.5">
                        {['A. Option one', 'B. Option two (selected)', 'C. Option three'].map(
                          (o, i) => (
                            <div
                              key={o}
                              className={`px-2.5 py-1.5 rounded border text-[11px] ${
                                i === 1
                                  ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                                  : 'border-slate-200 text-slate-700'
                              }`}
                            >
                              {o}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Adaptive Drills, Daily 5 & Mistake Queues */}
          <div className="rounded-[28px] border border-white/[0.09] bg-gradient-to-br from-[#141220] via-[#0B0B11] to-[#090A0D] p-7 sm:p-12 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center overflow-hidden">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="rounded-2xl border border-white/[0.14] bg-[#0D0E13] p-5 sm:p-6 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.9)] lg:-rotate-[1.2deg] hover:rotate-0 transition-transform duration-300 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-tabular uppercase tracking-wider text-emerald-400 inline-flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" /> Adaptive Run · ESAT Maths 2
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-mono-tabular text-emerald-300">
                    Stepped up → Level 4
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {['L1', 'L2', 'L3', 'L4', 'L5'].map((l, idx) => (
                    <div
                      key={l}
                      className={`py-2 rounded-lg border text-center text-xs font-mono-tabular ${
                        idx === 3
                          ? 'border-emerald-400 bg-emerald-500/15 text-emerald-200 font-semibold'
                          : idx < 3
                            ? 'border-white/10 bg-white/[0.04] text-zinc-400'
                            : 'border-white/[0.06] bg-transparent text-zinc-600'
                      }`}
                    >
                      {l}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
                    <div className="text-[10px] font-mono-tabular uppercase text-zinc-500">
                      Daily 5
                    </div>
                    <div className="text-sm font-semibold text-white mt-0.5">5 / 5 Locked</div>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
                    <div className="text-[10px] font-mono-tabular uppercase text-zinc-500">
                      Pace Target
                    </div>
                    <div className="text-sm font-semibold text-emerald-300 mt-0.5">1:30 / Q</div>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
                    <div className="text-[10px] font-mono-tabular uppercase text-zinc-500">
                      Review Queue
                    </div>
                    <div className="text-sm font-semibold text-amber-300 mt-0.5">3 to retry</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono-tabular uppercase tracking-wider text-emerald-300">
                <Layers className="w-4 h-4" /> Adaptive Drills &amp; Mistake Queues
              </div>
              <h3 className="font-display text-3xl sm:text-[2.6rem] leading-[1.05] text-white tracking-tight">
                Harder as you get sharper.
              </h3>
              <p className="text-sm sm:text-[15px] text-zinc-400 leading-relaxed">
                ESAT adapts from Level 1 to Level 5 in real time. TARA and SAT filter by exact
                skill, lock a persistent Daily 5, and keep missed or guessed items in your Review
                Queue until you earn an unflagged correct retry.
              </p>
              <hr className="border-white/[0.08]" />
              <div className="text-xs font-mono-tabular text-zinc-300">
                First-attempt stats kept separate · Never inflates practice accuracy
              </div>
            </div>
          </div>

          {/* Feature 3: Essay Studios & Self-Review Rubrics */}
          <div className="rounded-[28px] border border-white/[0.09] bg-gradient-to-br from-[#0F1B18] via-[#0B0E0E] to-[#090A0D] p-7 sm:p-12 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center overflow-hidden">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono-tabular uppercase tracking-wider text-emerald-300">
                <Feather className="w-4 h-4" /> LNAT &amp; TARA Essay Studios
              </div>
              <h3 className="font-display text-3xl sm:text-[2.6rem] leading-[1.05] text-white tracking-tight">
                Write under the clock. Review with precision.
              </h3>
              <p className="text-sm sm:text-[15px] text-zinc-400 leading-relaxed">
                Pick one of three prompts in 40 minutes with live word count and a 750-word
                guardrail. Plans, paragraph-annotated model essays, and self-review rubrics unlock
                only after you submit — or open untimed revision mode anytime.
              </p>
              <hr className="border-white/[0.08]" />
              <div className="text-xs font-mono-tabular text-zinc-300">
                18 TARA prompts + 15 LNAT prompts · Annotated models · No fake AI grades
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/[0.14] bg-[#0D0E13] p-5 sm:p-6 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.9)] lg:rotate-[1.2deg] hover:rotate-0 transition-transform duration-300 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono-tabular">
                  <span className="text-white font-semibold">TARA Essay Studio · Set 1</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/[0.06] text-zinc-300">
                      612 / 750 words
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                      08:14 left
                    </span>
                  </div>
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5 text-xs text-zinc-300 leading-relaxed font-serif-passage">
                  “While algorithmic triage speeds initial screening, delegating moral judgement to
                  opaque models erodes public accountability unless human review remains binding…”
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  {[
                    ['Thesis & Scope', 'Clear'],
                    ['Counterargument', 'Clear'],
                    ['Precision', 'Developing'],
                  ].map(([crit, state]) => (
                    <div
                      key={crit}
                      className="rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-2 flex items-center justify-between"
                    >
                      <span className="text-zinc-400 truncate">{crit}</span>
                      <span
                        className={`font-mono-tabular font-semibold ${
                          state === 'Clear' ? 'text-emerald-400' : 'text-amber-300'
                        }`}
                      >
                        {state}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* One-Off Pricing Section */}
        <section id="pricing" className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <div className="text-[11px] font-mono-tabular uppercase tracking-[0.16em] text-emerald-400">
              Pricing
            </div>
            <h2 className="font-display text-4xl sm:text-5xl ratio-platinum-text tracking-tight">
              Pay once. No subscriptions.
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Try Ratio free, unlock one test through the end of its exam season for £24, or get
              all six tests together for £39.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {/* Free */}
            <div className="ratio-card-lift rounded-2xl border border-white/[0.09] bg-[#101116] p-6 flex flex-col justify-between gap-6">
              <div>
                <div className="text-xs font-mono-tabular uppercase tracking-wider text-zinc-400">
                  Free Starter
                </div>
                <div className="mt-3 font-display text-4xl text-white">£0</div>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Explore the studio, diagnostic mocks, and official links before paying.
                </p>
                <ul className="mt-5 space-y-2.5 text-xs text-zinc-300">
                  {[
                    'Diagnostic & starter mock access',
                    'All 54 verified official board links',
                    'Official exam-screen mock interfaces',
                    'Local progress saving in your browser',
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onSelectTest('lnat')}
                className="w-full py-2.5 rounded-xl border border-white/[0.14] hover:border-white/30 hover:bg-white/[0.04] text-xs font-semibold text-white cursor-pointer transition-all"
              >
                {isPro ? 'Open Studio' : 'Start Free'}
              </button>
            </div>

            {/* Single Test Pass (£24) */}
            <div className="ratio-card-lift rounded-2xl border border-white/[0.12] bg-[#111319] p-6 flex flex-col justify-between gap-6">
              <div>
                <div className="text-xs font-mono-tabular uppercase tracking-wider text-zinc-300">
                  Single Test Pass
                </div>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="font-display text-4xl text-white">£24</span>
                  <span className="text-xs text-zinc-500">one-off · full season</span>
                </div>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Pick any one test (LNAT, UCAT, TARA, ESAT, TMUA, or SAT). Valid until its exam
                  season ends.
                </p>
                <ul className="mt-5 space-y-2.5 text-xs text-zinc-300">
                  {[
                    'Every full-length mock for your chosen test',
                    'All timed drills, question banks & guides',
                    'Valid until that test’s exam season ends',
                    'Cloud account sync & JSON backup export',
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-zinc-300 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onOpenPricing()}
                className="w-full py-2.5 rounded-xl border border-white/25 hover:bg-white hover:text-[#09090B] text-xs font-semibold text-white cursor-pointer transition-all"
              >
                {isPro ? 'Pro Unlocked' : 'Choose Single Test (£24)'}
              </button>
            </div>

            {/* All Tests Bundle (£39) */}
            <div className="ratio-card-lift rounded-2xl border border-emerald-400/40 bg-gradient-to-b from-[#131C1A] to-[#0E1114] p-6 flex flex-col justify-between gap-6 relative shadow-[0_24px_60px_-24px_rgba(16,185,129,0.28)]">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono-tabular uppercase tracking-wider text-white">
                    All Tests Bundle
                  </span>
                  <span className="text-[10px] font-mono-tabular uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/35">
                    Best value
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="font-display text-4xl text-white">£39</span>
                  <span className="text-xs text-zinc-400">one-off · all 6 tests</span>
                </div>
                <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                  Unlock all six admissions tests together for £15 more. Zero recurring bills.
                </p>
                <ul className="mt-5 space-y-2.5 text-xs text-zinc-200">
                  {[
                    'LNAT + UCAT + TARA + ESAT + TMUA + SAT',
                    'All 3,375+ original questions & 13 full mocks',
                    '14-day no-questions-asked refund guarantee',
                    'All future mock & question additions included',
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
                className="ratio-btn-emerald w-full py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                {isPro ? 'Pro Unlocked' : 'Get All Tests Bundle (£39)'}
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-white/[0.08] text-xs text-zinc-500">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400/80" />
              14-day refund guarantee · Independent prep, not affiliated with exam boards.
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              All official past papers linked directly to exam boards.
            </span>
          </div>
        </section>

        {/* 2-Column Interactive FAQ (inspired by recall-politics .lp-faq) */}
        <section id="faq" className="max-w-5xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="text-[11px] font-mono-tabular uppercase tracking-[0.16em] text-emerald-400">
                FAQ
              </div>
              <h2 className="font-display text-4xl ratio-platinum-text tracking-tight">
                Got questions?
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Everything you need to know about mocks, exam screens, pricing, and how progress
                saves.
              </p>
              <button
                type="button"
                onClick={() => onSelectTest('lnat')}
                className="px-4 py-2.5 rounded-xl border border-white/[0.12] hover:border-white/25 bg-white/[0.03] text-xs font-semibold text-white inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {isPro ? 'Open Studio' : 'Try a free mock'} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="lg:col-span-7 ratio-faq rounded-2xl border border-white/[0.09] bg-[#0D0E13] divide-y divide-white/[0.08] overflow-hidden">
              {FAQ_ITEMS.map(([q, a], idx) => (
                <details key={q} open={idx === 0} className="group">
                  <summary className="list-none cursor-pointer px-6 py-5 font-display text-xl text-white flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                    <span>{q}</span>
                    <Plus className="ratio-faq-plus w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200" />
                  </summary>
                  <p className="px-6 pb-5 text-sm text-zinc-400 leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Closing Radial-Glow CTA Card (inspired by recall-politics .lp-cta) */}
        <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-20">
          <div
            className="rounded-[28px] border border-white/[0.1] px-6 py-14 sm:py-16 text-center space-y-5"
            style={{
              background:
                'radial-gradient(65% 85% at 50% 0%, rgba(16, 185, 129, 0.16), rgba(16, 20, 32, 0.7) 52%, #0A0B0F 100%)',
            }}
          >
            <h2 className="font-display text-4xl sm:text-5xl ratio-platinum-text tracking-tight">
              Walk into exam day calm.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-md mx-auto leading-relaxed">
              Open your test workspace now, take a timed diagnostic or Daily 5, and pick up right
              where you left off on any device.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onSelectTest('lnat')}
                className="ratio-btn-3d px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                {isPro ? 'Continue practicing' : 'Start practicing free'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Commercial & Legal Footer */}
      <footer className="border-t border-white/[0.08] py-8 px-5 sm:px-8 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-5">
            <span className="font-display text-lg text-zinc-200">Ratio</span>
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
