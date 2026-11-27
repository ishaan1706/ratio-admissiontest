import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Clock,
  Flag,
  Layers,
  Monitor,
  ShieldCheck,
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
  { mocks: string; extras: string; interfaceLabel: string; universities: string }
> = {
  lnat: {
    mocks: 'Full 95-min Mock (42 Qs)',
    extras: '15 Essay Prompts · Revision Lab',
    interfaceLabel: 'Pearson VUE screen',
    universities: 'Oxford · Cambridge · UCL · LSE · KCL',
  },
  ucat: {
    mocks: '2 Full Mocks (368 Qs)',
    extras: '12 Timed Drills · 60 Flashcards',
    interfaceLabel: 'Pearson VUE + Calculator',
    universities: 'UK & ANZ Medicine & Dentistry',
  },
  tara: {
    mocks: '3 Full Mocks (132 MCQs)',
    extras: '9 Writing Prompts · Worked Guide',
    interfaceLabel: 'UAT-UK exam screen',
    universities: 'Oxford · UCL · Warwick',
  },
  esat: {
    mocks: '400-Q Practice + 2 Mocks',
    extras: 'Daily 5 · 1:30/Q Pace · Mistake Queue',
    interfaceLabel: 'UAT-UK exam screen',
    universities: 'Cambridge · Imperial · UCL',
  },
  tmua: {
    mocks: 'Full Mock (Paper 1 & 2 · 40 Qs)',
    extras: 'Logic & Proof Guide · Flashcards',
    interfaceLabel: 'UAT-UK exam screen',
    universities: 'Cambridge · Imperial · LSE · Warwick',
  },
  sat: {
    mocks: '600-Q Bank + 2 Full Mocks',
    extras: '30 Skill Lessons · 400 Vocab',
    interfaceLabel: 'Bluebook screen',
    universities: 'US Ivy League · MIT · Stanford',
  },
};

const SAMPLE_QUESTIONS: Record<
  'lnat' | 'ucat' | 'esat' | 'sat',
  {
    badge: string;
    screenStyle: string;
    passage: string;
    stem: string;
    options: string[];
    correct: number;
    explanation: string;
  }
> = {
  lnat: {
    badge: 'LNAT · Section A · Assumption',
    screenStyle: 'Pearson VUE split-screen',
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
    screenStyle: 'Pearson VUE + Calculator',
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
  esat: {
    badge: 'ESAT · Mathematics 1 · Algebra',
    screenStyle: 'UAT-UK no-calculator',
    passage:
      'The quadratic equation x² − (k + 2)x + 2k + 1 = 0 has two equal real roots, where k is a real constant.',
    stem: 'What is the sum of all possible values of k?',
    options: ['0', '4', '8'],
    correct: 1,
    explanation:
      'Set discriminant Δ = 0: (k + 2)² − 4(2k + 1) = k² − 4k = 0, so k = 0 or k = 4. Their sum is 4.',
  },
  sat: {
    badge: 'Digital SAT · Math · Algebra',
    screenStyle: 'College Board Bluebook',
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
  const [sampleTab, setSampleTab] = useState<'lnat' | 'ucat' | 'esat' | 'sat'>('lnat');
  const [picked, setPicked] = useState<number | null>(null);
  const sample = SAMPLE_QUESTIONS[sampleTab];

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F4F4F5] flex flex-col selection:bg-white/20">
      {/* Minimal Studio-Matched Sticky Header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#0A0A0C]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <span className="font-display text-2xl tracking-tight text-white leading-none">
              Ratio
            </span>
            <nav className="hidden md:flex items-center gap-6 text-[13px] text-zinc-400">
              <a href="#exams" className="hover:text-white transition-colors">
                Exams
              </a>
              <a href="#why" className="hover:text-white transition-colors">
                How it works
              </a>
              <a href="#pricing" className="hover:text-white transition-colors">
                Pricing
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenAccount}
              className="px-3 py-1.5 rounded-md border border-white/[0.1] hover:border-white/25 text-xs text-zinc-300 hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              {user ? user.name : 'Sign in'}
            </button>
            <button
              type="button"
              onClick={() => onSelectTest('lnat')}
              className="px-3.5 py-1.5 rounded-md bg-white hover:bg-zinc-200 text-[#0A0A0C] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isPro ? 'Open Studio' : 'Start Free'}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Clean Architectural Editorial Hero */}
        <section className="relative border-b border-white/[0.07]">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                'radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              maskImage: 'linear-gradient(to bottom, black 20%, transparent 90%)',
            }}
          />

          <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-16 sm:pb-24">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-start">
              {/* Left: Sharp Editorial Pitch */}
              <div className="lg:col-span-6 space-y-7 pt-2">
                <div className="inline-flex items-center gap-2.5 text-[11px] font-mono-tabular uppercase tracking-[0.14em] text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Six admissions tests · One studio
                </div>

                <h1 className="font-display text-[3.1rem] sm:text-[4.5rem] leading-[0.96] tracking-[-0.03em] text-white">
                  Practice in the
                  <br />
                  <span className="text-zinc-400 italic font-normal">exact exam room.</span>
                </h1>

                <p className="text-[15px] sm:text-base text-zinc-400 leading-[1.7] max-w-lg">
                  Original full-length mocks, Pearson VUE, UAT-UK, and Bluebook exam screens,
                  paced daily practice, and verified official board links for LNAT, UCAT, TARA,
                  ESAT, TMUA, and Digital SAT.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => onSelectTest('lnat')}
                    className="px-5 py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-[#0A0A0C] text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    {isPro ? 'Continue practicing' : 'Start practicing free'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <a
                    href="#pricing"
                    className="px-5 py-2.5 rounded-lg border border-white/[0.12] hover:border-white/25 text-sm font-medium text-zinc-200 hover:text-white transition-colors"
                  >
                    {isPro ? 'Ratio Pro Active' : 'Pricing — from £24'}
                  </a>
                </div>

                {/* Compact Metric Bar directly integrated into hero */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-7 border-t border-white/[0.08]">
                  {[
                    { value: '2,080+', label: 'Original Qs' },
                    { value: '11', label: 'Full mocks' },
                    { value: '470+', label: 'Vocab & cards' },
                    { value: '54', label: 'Official links' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="font-mono-tabular text-xl font-semibold text-white">
                        {stat.value}
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: High-Craft Interactive Studio Specimen Card */}
              <div className="lg:col-span-6">
                <div className="rounded-xl border border-white/[0.11] bg-[#111114] shadow-[0_30px_90px_rgba(0,0,0,0.65)] overflow-hidden">
                  {/* Mock Browser / Exam Chrome Header */}
                  <div className="px-4 py-3 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-2 bg-[#141418]">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono-tabular uppercase tracking-wider text-zinc-400">
                        Live question
                      </span>
                      <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded bg-white/[0.06] text-zinc-300">
                        {sample.screenStyle}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 p-0.5 rounded-md bg-[#0A0A0C] border border-white/[0.08]">
                      {(['lnat', 'ucat', 'esat', 'sat'] as const).map((id) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            setSampleTab(id);
                            setPicked(null);
                          }}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono-tabular uppercase cursor-pointer transition-colors ${
                            sampleTab === id
                              ? 'bg-white text-[#0A0A0C] font-semibold'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          {id}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between text-[11px] font-mono-tabular text-zinc-500">
                      <span>{sample.badge}</span>
                      <span className="inline-flex items-center gap-1 text-zinc-400">
                        <Clock className="w-3 h-3" /> 01:30
                      </span>
                    </div>

                    <p className="font-serif-passage text-[14.5px] text-zinc-200 leading-[1.7] bg-[#0A0A0C] border border-white/[0.07] rounded-lg p-4">
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
                            className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs sm:text-[13px] transition-colors flex items-start gap-3 cursor-pointer ${
                              showResult && isRight
                                ? 'border-emerald-500/60 bg-emerald-500/10 text-white'
                                : showResult && isPicked && !isRight
                                ? 'border-red-500/50 bg-red-500/10 text-zinc-200'
                                : 'border-white/[0.08] hover:border-white/20 bg-[#0D0D10] text-zinc-300'
                            }`}
                          >
                            <span className="font-mono-tabular text-[11px] text-zinc-500 mt-0.5">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {picked !== null && (
                      <div className="rounded-lg border border-white/[0.1] bg-[#16161B] p-3.5 text-xs text-zinc-300 leading-relaxed flex items-start justify-between gap-3">
                        <div>
                          <span className="font-semibold text-white">
                            {picked === sample.correct ? 'Correct — ' : 'Explanation — '}
                          </span>
                          {sample.explanation}
                        </div>
                        <button
                          type="button"
                          onClick={() => onSelectTest(sampleTab)}
                          className="shrink-0 text-white hover:text-zinc-300 font-semibold whitespace-nowrap cursor-pointer underline underline-offset-4"
                        >
                          Open mock →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clean Architectural 6-Exam Grid (Matches Studio Aesthetic) */}
        <section id="exams" className="border-b border-white/[0.07]">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-22">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <div className="text-[11px] font-mono-tabular uppercase tracking-[0.14em] text-zinc-500">
                  Admissions tracks
                </div>
                <h2 className="font-display text-3xl sm:text-4xl text-white mt-1.5 tracking-tight">
                  Choose your exam.
                </h2>
              </div>
              <p className="text-sm text-zinc-400 max-w-sm">
                Each track opens directly into its own full workspace, timed mock interface, and
                revision tools.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/[0.08]">
              {ADMISSIONS_TESTS.map((test) => {
                const meta = EXAM_STATS[test.id];
                return (
                  <button
                    key={test.id}
                    type="button"
                    onClick={() => onSelectTest(test.id)}
                    className="group text-left p-6 border-r border-b border-white/[0.08] bg-[#0A0A0C] hover:bg-[#111114] transition-colors flex flex-col justify-between gap-6 cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-2xl text-white tracking-tight">
                          {test.code}
                        </span>
                        <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded border border-white/[0.09] text-zinc-400 group-hover:text-zinc-200 group-hover:border-white/20 transition-colors">
                          {meta.interfaceLabel}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-300 mt-1">{test.subject}</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">{meta.universities}</div>

                      <div className="mt-5 pt-4 border-t border-white/[0.06] space-y-1 text-xs text-zinc-400">
                        <div className="text-zinc-200 font-medium">{meta.mocks}</div>
                        <div>{meta.extras}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono-tabular text-zinc-500">
                      <span>{test.duration}</span>
                      <span className="text-zinc-300 group-hover:text-white inline-flex items-center gap-1 transition-colors">
                        Open studio <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Clean Static 3-Pillar Product Value Section (Replaces Scrolling Marquee) */}
        <section id="why" className="border-b border-white/[0.07] bg-[#0D0D10]">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
            <div className="max-w-xl mb-12">
              <div className="text-[11px] font-mono-tabular uppercase tracking-[0.14em] text-zinc-500">
                Built for test day
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-white mt-1.5 tracking-tight">
                Nothing between you and a higher score.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Monitor,
                  title: 'Official exam-screen emulation',
                  body: 'Sit mocks inside full-screen Pearson VUE (LNAT, UCAT), UAT-UK (ESAT, TMUA, TARA), and College Board Bluebook (SAT) interfaces with Navigator, Flag for Review, calculators, and reference sheets.',
                  tag: 'Pearson VUE · UAT-UK · Bluebook',
                },
                {
                  icon: Target,
                  title: 'Paced practice & mistake banks',
                  body: 'Build speed with ESAT’s 1:30/question pace timer and Daily 5, drill all 30 Digital SAT skills with Common Trap notes, and automatically resurface missed questions until mastered.',
                  tag: '2,080+ original questions',
                },
                {
                  icon: Layers,
                  title: 'Structured guides & official links',
                  body: 'Formula sheets, Paper 2 logic guides, 400 SAT vocab cards, 15 LNAT essay prompts, and 54 direct outbound links to every official specimen paper and past-paper archive.',
                  tag: 'Zero filler · 100% exam-aligned',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-xl border border-white/[0.08] bg-[#111114] p-6 flex flex-col justify-between gap-5"
                  >
                    <div className="space-y-3">
                      <div className="w-8 h-8 rounded-lg border border-white/[0.1] bg-white/[0.03] flex items-center justify-center text-zinc-200">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-[15px] font-semibold text-white">{item.title}</h3>
                      <p className="text-xs text-zinc-400 leading-[1.7]">{item.body}</p>
                    </div>
                    <div className="pt-3 border-t border-white/[0.06] text-[11px] font-mono-tabular text-zinc-500 flex items-center gap-2">
                      <Flag className="w-3 h-3 text-zinc-500" />
                      {item.tag}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Clean, Restrained One-Off Pricing Section */}
        <section id="pricing" className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="max-w-xl space-y-2.5">
            <div className="text-[11px] font-mono-tabular uppercase tracking-[0.14em] text-zinc-500">
              Pricing
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-white tracking-tight">
              Pay once. No subscriptions.
            </h2>
            <p className="text-sm text-zinc-400">
              Try Ratio free, unlock one test through the end of its exam season for £24, or get
              all six tests together for £39.
            </p>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {/* Free */}
            <div className="rounded-xl border border-white/[0.08] bg-[#111114] p-6 flex flex-col justify-between gap-6">
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
                className="w-full py-2.5 rounded-lg border border-white/[0.14] hover:border-white/30 text-xs font-semibold text-white cursor-pointer transition-colors"
              >
                {isPro ? 'Open Studio' : 'Start Free'}
              </button>
            </div>

            {/* Single Test Pass (£24) */}
            <div className="rounded-xl border border-white/[0.1] bg-[#111114] p-6 flex flex-col justify-between gap-6">
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
                className="w-full py-2.5 rounded-lg border border-white/25 hover:bg-white hover:text-[#0A0A0C] text-xs font-semibold text-white cursor-pointer transition-colors"
              >
                {isPro ? 'Pro Unlocked' : 'Choose Single Test (£24)'}
              </button>
            </div>

            {/* All Tests Bundle (£39) */}
            <div className="rounded-xl border border-white/30 bg-[#141418] p-6 flex flex-col justify-between gap-6 relative">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono-tabular uppercase tracking-wider text-white">
                    All Tests Bundle
                  </span>
                  <span className="text-[10px] font-mono-tabular uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
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
                    'All 2,080+ original questions & 11 full mocks',
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
                className="w-full py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-[#0A0A0C] text-xs font-semibold cursor-pointer transition-colors"
              >
                {isPro ? 'Pro Unlocked' : 'Get All Tests Bundle (£39)'}
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-white/[0.07] text-xs text-zinc-500">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-zinc-400" />
              14-day refund guarantee · Independent prep, not affiliated with exam boards.
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              All official past papers linked directly to exam boards.
            </span>
          </div>
        </section>
      </main>

      {/* Minimal Commercial & Legal Footer */}
      <footer className="border-t border-white/[0.07] py-7 px-5 sm:px-8 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-5">
            <span className="text-zinc-300 font-medium">Ratio</span>
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
