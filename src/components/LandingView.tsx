import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Plus,
  User,
} from 'lucide-react';
import { ADMISSIONS_TESTS, TestId } from '../data/allTests';

interface LandingViewProps {
  user: { name: string; email?: string } | null;
  isPro: boolean;
  onSelectTest: (id: TestId) => void;
  onOpenPricing: () => void;
  onOpenAccount: () => void;
  onOpenLegal: (tab: 'terms' | 'privacy' | 'refunds') => void;
}

const EXAM_STATS: Record<
  TestId,
  {
    index: string;
    mocks: string;
    extras: string;
    interfaceLabel: string;
    universities: string;
    subject: string;
  }
> = {
  lnat: {
    index: '01',
    mocks: '2 Full Mocks (84 MCQs)',
    extras: '8 Essay Sets · Flaw & Assumption Drills',
    interfaceLabel: 'Pearson VUE split-screen',
    universities: 'Oxford · UCL · LSE · KCL · Bristol',
    subject: 'Law',
  },
  ucat: {
    index: '02',
    mocks: '2 Full Mocks (268 Qs)',
    extras: 'VR · DM · QR · SJT · Calculator',
    interfaceLabel: 'Pearson VUE + Calculator',
    universities: 'UK & ANZ Medical Schools',
    subject: 'Medicine',
  },
  tara: {
    index: '03',
    mocks: '3 Full Mocks + 205 Drills',
    extras: '18-Prompt Essay Studio · Daily 5',
    interfaceLabel: 'UAT-UK exam screen',
    universities: 'Cambridge · UCL · Warwick',
    subject: 'Applied Reasoning',
  },
  esat: {
    index: '04',
    mocks: '800-Q Adaptive Bank + 2 Mocks',
    extras: '160/Module · Levels 1–5 · 1:30/Q Pace',
    interfaceLabel: 'UAT-UK no-calculator',
    universities: 'Cambridge · Imperial · UCL',
    subject: 'Engineering & Science',
  },
  tmua: {
    index: '05',
    mocks: '3 Full Mocks + 460 Drills',
    extras: 'Daily 5 · Mistake Queue · Logic Primer',
    interfaceLabel: 'UAT-UK 75m × 2',
    universities: 'Cambridge · Imperial · LSE · Warwick',
    subject: 'Mathematics',
  },
  sat: {
    index: '06',
    mocks: '1,000-Q Bank + 4 Full Mocks',
    extras: 'Adaptive M2 · 30 Lessons · 400 Vocab',
    interfaceLabel: 'College Board Bluebook',
    universities: 'US Ivy League · MIT · Stanford',
    subject: 'US Admissions',
  },
};

type SampleKey = TestId;

const SAMPLE_QUESTIONS: Record<
  SampleKey,
  {
    code: string;
    section: string;
    screen: string;
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
    section: 'Section A · Assumption',
    screen: 'Pearson VUE',
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
      'Contrasting "open courtrooms" with prosecutorial charging assumes charging decisions operate with less public scrutiny than judicial sentencing.',
  },
  ucat: {
    code: 'UCAT',
    section: 'Decision Making · Syllogism',
    screen: 'Pearson VUE',
    timer: '28:40',
    passage:
      'Every glazed tile in a crate passed inspection. Some square tiles in the crate are glazed. No tile that passed inspection is chipped.',
    stem: 'Which conclusion MUST follow?',
    options: [
      'Every square tile in the crate passed inspection.',
      'Some square tiles in the crate are not chipped.',
      'No chipped tiles are square.',
    ],
    correct: 1,
    explanation:
      'Some square tiles are glazed → all glazed tiles passed inspection → none that passed are chipped. So those square glazed tiles cannot be chipped.',
  },
  tara: {
    code: 'TARA',
    section: 'Critical Thinking · Flaw',
    screen: 'UAT-UK CBT',
    timer: '39:10',
    passage:
      'Every student who joined the debating society this term achieved a first-class mark in their autumn essay. Clearly, joining the debating society guarantees a first-class essay mark.',
    stem: 'Which flaw is committed by the argument?',
    options: [
      'It appeals to an unqualified authority.',
      'It mistakes correlation among self-selected students for a causal guarantee.',
      'It equivocates on the word "essay".',
    ],
    correct: 1,
    explanation:
      'Strong writers may disproportionately join the society; overlap does not establish that membership itself guarantees the outcome.',
  },
  esat: {
    code: 'ESAT',
    section: 'Mathematics 1 · Level 4',
    screen: 'UAT-UK CBT',
    timer: '38:25',
    passage:
      'The quadratic equation x² − (k + 2)x + 2k + 1 = 0 has two equal real roots, where k is a real constant.',
    stem: 'What is the sum of all possible values of k?',
    options: ['0', '4', '8'],
    correct: 1,
    explanation:
      'Set Δ = 0: (k + 2)² − 4(2k + 1) = k² − 4k = 0, giving k = 0 or k = 4. Their sum is 4.',
  },
  tmua: {
    code: 'TMUA',
    section: 'Paper 2 · Necessary & Sufficient',
    screen: 'UAT-UK CBT',
    timer: '71:15',
    passage:
      'Let x be a positive integer. Statement P: 10 divides x. Statement Q: 2 divides x.',
    stem: 'Which describes P relative to Q?',
    options: [
      'Necessary but not sufficient',
      'Sufficient but not necessary',
      'Necessary and sufficient',
    ],
    correct: 1,
    explanation:
      'If 10 divides x then 2 divides x (P ⇒ Q), so P is sufficient. At x = 2, Q holds while P fails, so P is not necessary.',
  },
  sat: {
    code: 'SAT',
    section: 'Math · Module 2 (Harder)',
    screen: 'Bluebook',
    timer: '34:15',
    passage:
      'A quadratic function f(x) = a(x − 4)² + 12 passes through the point (6, 20), where a is a constant.',
    stem: 'What is the value of f(1)?',
    options: ['24', '30', '36'],
    correct: 1,
    explanation:
      'Substitute (6, 20): 20 = 4a + 12 ⇒ a = 2. Then f(1) = 2(−3)² + 12 = 18 + 12 = 30.',
  },
};

const FAQ_ITEMS: Array<[string, string]> = [
  [
    'Are these original questions or copied past papers?',
    'Every mock, drill, flashcard, and model essay in Ratio is originally authored to match the official specifications. Official past papers and specimen PDFs are linked directly to the exam boards so we never rehost copyrighted material.',
  ],
  [
    'How does the one-off pricing work?',
    'No recurring billing. The £24 Single Test Pass unlocks one admissions test until your exam season ends; the £39 All Tests Bundle unlocks all six tests in one payment. Both include a 14-day refund guarantee.',
  ],
  [
    'Do the mocks match the real exam interfaces?',
    'Yes. LNAT and UCAT run in a Pearson VUE split-screen with flagging, navigator, and UCAT calculator; ESAT, TMUA, and TARA run in the UAT-UK no-calculator interface; Digital SAT runs in a Bluebook-style adaptive runner.',
  ],
  [
    'Does my progress save without an account?',
    'Yes — every drill, mistake queue item, mock score, and essay draft saves locally in your browser immediately. Create a free account anytime to sync across devices.',
  ],
];

const REVEAL = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 as const },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

export const LandingView: React.FC<LandingViewProps> = ({
  user,
  isPro,
  onSelectTest,
  onOpenPricing,
  onOpenAccount,
  onOpenLegal,
}) => {
  const [sampleKey, setSampleKey] = useState<SampleKey>('lnat');
  const [picked, setPicked] = useState<number | null>(null);
  const [showcaseScreen, setShowcaseScreen] = useState<'pearson' | 'uatuk' | 'bluebook'>('pearson');

  const sample = SAMPLE_QUESTIONS[sampleKey];

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col selection:bg-emerald-500/25 selection:text-white">
      {/* Sticky Minimal Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--rule)] bg-[var(--bg)]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl tracking-tight text-[var(--ink)] leading-none">
              Ratio
            </span>
            <span className="hidden sm:inline-block h-3.5 w-px bg-[var(--rule)]" />
            <span className="hidden sm:inline text-[11px] font-mono-tabular uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Admissions Test Studio
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-xs text-[var(--text-muted)]">
            <a href="#exams" onClick={scrollTo('exams')} className="hover:text-[var(--ink)] transition-colors">
              Exams
            </a>
            <a href="#interfaces" onClick={scrollTo('interfaces')} className="hover:text-[var(--ink)] transition-colors">
              Exam Screens
            </a>
            <a href="#pricing" onClick={scrollTo('pricing')} className="hover:text-[var(--ink)] transition-colors">
              Pricing
            </a>
            <a href="#faq" onClick={scrollTo('faq')} className="hover:text-[var(--ink)] transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenAccount}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--ink)] inline-flex items-center gap-1.5 px-2.5 py-1.5 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span className="max-w-[110px] truncate">{user ? user.name : 'Sign in'}</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTest('lnat')}
              className="px-4 py-2 bg-[var(--ink)] text-[var(--bg)] hover:bg-[var(--accent)] hover:text-[#04130d] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isPro ? 'Open Studio' : 'Start Free'}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Asymmetric 12-Column Swiss Editorial Hero */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 sm:pt-16 pb-16 sm:pb-20">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Editorial Column */}
            <div className="lg:col-span-6 space-y-7 pt-2">
              <div className="text-[11px] font-mono-tabular uppercase tracking-[0.18em] text-[var(--accent)]">
                LNAT · UCAT · TARA · ESAT · TMUA · SAT
              </div>

              <h1 className="font-display text-5xl sm:text-[62px] leading-[1.02] tracking-[-0.025em] text-[var(--ink)]">
                Admissions prep built around the real exam screen.
              </h1>

              <p className="text-base sm:text-[17px] text-[var(--text-muted)] leading-relaxed max-w-xl">
                Original full-length mocks, adaptive skill drills, and timed essay studios rendered
                in authentic Pearson VUE, UAT-UK, and Bluebook interfaces — without subscriptions.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onSelectTest('lnat')}
                  className="px-6 py-3 bg-[var(--accent)] text-[#04130d] hover:opacity-90 text-sm font-semibold inline-flex items-center gap-2 transition-opacity cursor-pointer"
                >
                  {isPro ? 'Continue practicing' : 'Start practicing free'}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#pricing"
                  onClick={scrollTo('pricing')}
                  className="px-5 py-3 border border-[var(--rule)] hover:border-[var(--ink)]/50 text-sm font-medium text-[var(--ink)] transition-colors"
                >
                  Pricing — from £24
                </a>
              </div>

              {!isPro && (
                <p className="text-xs font-mono-tabular text-[var(--text-muted)]">
                  No card required to try · One-off season passes, zero subscriptions
                </p>
              )}
            </div>

            {/* Right Column: Live Interactive Exam Desk (No fake browser chrome) */}
            <div className="lg:col-span-6 border border-[var(--rule)] bg-[var(--surface)]">
              {/* Exam Switcher Bar */}
              <div className="flex items-center justify-between border-b border-[var(--rule)] px-4 py-2.5 gap-2 overflow-x-auto">
                <div className="flex items-center gap-1">
                  {(['lnat', 'ucat', 'tara', 'esat', 'tmua', 'sat'] as SampleKey[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSampleKey(key);
                        setPicked(null);
                      }}
                      className={`px-2.5 py-1 text-[11px] font-mono-tabular uppercase tracking-wider transition-colors cursor-pointer ${
                        sampleKey === key
                          ? 'bg-[var(--ink)] text-[var(--bg)] font-semibold'
                          : 'text-[var(--text-muted)] hover:text-[var(--ink)]'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] font-mono-tabular text-[var(--text-muted)] shrink-0">
                  {sample.screen} · {sample.timer}
                </span>
              </div>

              {/* Specimen Body */}
              <div className="p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between text-[11px] font-mono-tabular uppercase tracking-wider">
                  <span className="text-[var(--accent)]">
                    {sample.code} · {sample.section}
                  </span>
                  <span className="text-[var(--text-muted)]">Interactive Specimen</span>
                </div>

                <p className="font-serif-passage text-[14.5px] leading-[1.7] text-[var(--ink)]/90 border-l-2 border-[var(--rule)] pl-4">
                  {sample.passage}
                </p>

                <div className="text-sm font-medium text-[var(--ink)]">{sample.stem}</div>

                <div className="space-y-2">
                  {sample.options.map((opt, idx) => {
                    const isPicked = picked === idx;
                    const isCorrect = idx === sample.correct;
                    let cls =
                      'border-[var(--rule)] bg-[var(--bg)] text-[var(--ink)]/90 hover:border-[var(--ink)]/40';
                    if (picked !== null) {
                      if (isCorrect) {
                        cls = 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--ink)]';
                      } else if (isPicked && !isCorrect) {
                        cls = 'border-[var(--crimson)] bg-[var(--crimson)]/10 text-[var(--ink)]';
                      } else {
                        cls = 'border-[var(--rule)] bg-[var(--bg)] text-[var(--text-muted)]';
                      }
                    }
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPicked(idx)}
                        className={`w-full text-left px-3.5 py-2.5 border text-xs sm:text-[13px] leading-snug transition-colors flex items-start gap-3 cursor-pointer ${cls}`}
                      >
                        <span className="font-mono-tabular text-[11px] text-[var(--text-muted)] mt-0.5 shrink-0">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {picked !== null ? (
                  <div className="border-t border-[var(--rule)] pt-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="text-xs leading-relaxed text-[var(--text-muted)]">
                      <span
                        className={`font-semibold mr-1.5 ${
                          picked === sample.correct ? 'text-[var(--accent)]' : 'text-[var(--crimson)]'
                        }`}
                      >
                        {picked === sample.correct ? 'Correct.' : 'Not quite.'}
                      </span>
                      {sample.explanation}
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectTest(sampleKey)}
                      className="text-xs font-medium text-[var(--accent)] hover:underline inline-flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      Open {sample.code} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-[var(--rule)] pt-3.5 flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)] font-mono-tabular">
                      Select an option to check the explanation
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectTest(sampleKey)}
                      className="text-[var(--ink)] hover:text-[var(--accent)] font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      Full {sample.code} studio <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Ruled Architectural Ledger Strip */}
        <section className="border-y border-[var(--rule)] bg-[var(--surface)]/50">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-[var(--rule)]">
            {[
              ['3,915+', 'Original questions', 'Authored to official specs'],
              ['15', 'Full-length mocks', 'Timed exam conditions'],
              ['6', 'Admissions tracks', 'UK, ANZ & US entry'],
              ['470+', 'Vocab & logic cards', 'SAT, UCAT & TMUA'],
              ['54', 'Official board links', 'Direct to past papers'],
            ].map(([num, label, sub]) => (
              <div key={label} className="py-6 sm:px-5 first:pl-0 last:pr-0">
                <div className="font-display text-3xl sm:text-4xl text-[var(--ink)] leading-none">
                  {num}
                </div>
                <div className="text-xs font-medium text-[var(--ink)] mt-2">{label}</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Six Admissions Tracks — Numbered Architectural Directory */}
        <motion.section {...REVEAL} id="exams" className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 pb-8 border-b border-[var(--rule)]">
            <div>
              <div className="text-[11px] font-mono-tabular uppercase tracking-[0.18em] text-[var(--accent)]">
                01 / Six Admissions Tracks
              </div>
              <h2 className="font-display text-4xl sm:text-5xl text-[var(--ink)] mt-2 leading-tight">
                Choose your exam.
              </h2>
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-md">
              Each workspace has its own exam-board simulator, original question bank, revision
              guide, and mistake queue.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-l border-[var(--rule)]">
            {ADMISSIONS_TESTS.map((t) => {
              const meta = EXAM_STATS[t.id];
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSelectTest(t.id)}
                  className="group text-left p-6 border-r border-b border-[var(--rule)] hover:bg-[var(--surface)] transition-colors flex flex-col justify-between gap-6 cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono-tabular text-[var(--text-muted)]">
                      <span>
                        {meta.index} · {meta.subject}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <div>
                      <h3 className="font-display text-3xl text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                        {t.code}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] mt-1">{meta.universities}</p>
                    </div>
                    <div className="text-xs text-[var(--ink)]/90 space-y-1 pt-2 border-t border-[var(--rule)]/70">
                      <div className="font-medium">{meta.mocks}</div>
                      <div className="text-[var(--text-muted)]">{meta.extras}</div>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono-tabular text-[var(--text-muted)] group-hover:text-[var(--ink)] transition-colors">
                    {meta.interfaceLabel}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* Authentic Exam Screens — Editorial Split Showcase */}
        <motion.section
          {...REVEAL}
          id="interfaces"
          className="border-t border-[var(--rule)] bg-[var(--surface)]/40"
        >
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 space-y-12">
            <div className="grid lg:grid-cols-12 gap-10 items-start">
              {/* Left Index Switcher */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <div className="text-[11px] font-mono-tabular uppercase tracking-[0.18em] text-[var(--accent)]">
                    02 / Official Exam Screens
                  </div>
                  <h2 className="font-display text-4xl text-[var(--ink)] mt-2 leading-tight">
                    Zero test-day surprises.
                  </h2>
                  <p className="text-sm text-[var(--text-muted)] mt-3 leading-relaxed">
                    Rehearse in the exact layout, timer placement, and review navigator you will
                    face in the test centre.
                  </p>
                </div>

                <div className="border-t border-[var(--rule)] divide-y divide-[var(--rule)]">
                  {(
                    [
                      [
                        'pearson',
                        '01',
                        'Pearson VUE — LNAT & UCAT',
                        'Blue header & footer, white split-screen passage, text highlighter, Flag for Review, and on-screen UCAT calculator.',
                      ],
                      [
                        'uatuk',
                        '02',
                        'UAT-UK CBT — ESAT, TMUA & TARA',
                        'Navy UAT-UK chrome, No Calculator badge, 75-minute and 40-minute paper clocks, and item navigator.',
                      ],
                      [
                        'bluebook',
                        '03',
                        'College Board Bluebook — Digital SAT',
                        'Light split-pane, hide-able centered clock, Mark for Review, Reference Sheet, and adaptive Module 2 routing.',
                      ],
                    ] as const
                  ).map(([id, num, title, desc]) => {
                    const active = showcaseScreen === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setShowcaseScreen(id)}
                        className={`w-full text-left py-4 transition-colors cursor-pointer ${
                          active ? 'text-[var(--ink)]' : 'text-[var(--text-muted)] hover:text-[var(--ink)]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono-tabular text-[var(--accent)]">
                            {num}
                          </span>
                          <span className="text-sm font-semibold flex-1">{title}</span>
                        </div>
                        {active && (
                          <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-2 pl-6">
                            {desc}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Authentic Screen Preview */}
              <div className="lg:col-span-7 border border-[var(--rule)] bg-[var(--bg)] p-3 sm:p-4">
                {showcaseScreen === 'pearson' && (
                  <div className="overflow-hidden border border-[#CBD5E1] bg-white text-[#111827]">
                    <div className="bg-[#005A9C] text-white px-4 py-2.5 flex items-center justify-between text-xs font-semibold">
                      <span>LNAT — Section A · Multiple Choice</span>
                      <span className="font-mono-tabular">Time Remaining 94:12</span>
                    </div>
                    <div className="bg-[#E8F1F8] border-b border-[#CBD5E1] px-4 py-1.5 flex items-center justify-between text-[11px] text-[#1E3A5F]">
                      <span>Question 14 of 42</span>
                      <span className="font-semibold">Flag for Review</span>
                    </div>
                    <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#CBD5E1] text-xs">
                      <div className="p-4 leading-relaxed text-[#1F2937]">
                        <div className="font-semibold text-[#005A9C] mb-1.5">Passage 5</div>
                        Judicial discretion has long been criticised for producing unequal sentences
                        for comparable offences. Yet mandatory minimums shift that discretion
                        upstream to prosecutors…
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="font-semibold text-[#111827] mb-2">
                          Which assumption underlies the author’s objection?
                        </div>
                        <div className="px-2.5 py-1.5 rounded border border-[#CBD5E1] text-[#334155]">
                          A. Prosecutors seek maximum sentences.
                        </div>
                        <div className="px-2.5 py-1.5 rounded border border-[#005A9C] bg-[#E6F2F7] font-medium">
                          B. Charging decisions are less transparent.
                        </div>
                        <div className="px-2.5 py-1.5 rounded border border-[#CBD5E1] text-[#334155]">
                          C. Mandatory minimums lowered crime rates.
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#005A9C] text-white px-4 py-2 flex items-center justify-between text-[11px]">
                      <span>Navigator</span>
                      <span>Previous · Next</span>
                    </div>
                  </div>
                )}

                {showcaseScreen === 'uatuk' && (
                  <div className="overflow-hidden border border-[#CBD5E1] bg-white text-[#111827]">
                    <div className="bg-[#0B4F6C] text-white px-4 py-2.5 flex items-center justify-between text-xs font-semibold">
                      <span>TMUA — Paper 2 · Mathematical Reasoning</span>
                      <span className="font-mono-tabular">74:10</span>
                    </div>
                    <div className="bg-[#EEF4F7] border-b border-[#CBD5E1] px-4 py-1.5 flex items-center justify-between text-[11px] text-[#0B4F6C]">
                      <span>No Calculator · No Formula Sheet</span>
                      <span>Question 9 of 20</span>
                    </div>
                    <div className="p-5 space-y-3 text-xs">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#0B4F6C]">
                        Necessary &amp; Sufficient Conditions
                      </div>
                      <div className="text-[#111827] leading-relaxed">
                        Let x be a positive integer. P: 10 divides x. Q: 2 divides x. Which
                        describes P relative to Q?
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {[
                          'A. Necessary, not sufficient',
                          'B. Sufficient, not necessary',
                          'C. Necessary & sufficient',
                          'D. Neither',
                        ].map((o, i) => (
                          <div
                            key={o}
                            className={`px-3 py-2 rounded border ${
                              i === 1
                                ? 'border-[#0B4F6C] bg-[#E6F2F7] font-semibold'
                                : 'border-[#CBD5E1] text-[#334155]'
                            }`}
                          >
                            {o}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-[#0B4F6C] text-white px-4 py-2 flex items-center justify-between text-[11px]">
                      <span>Flag for Review</span>
                      <span>Previous · Next</span>
                    </div>
                  </div>
                )}

                {showcaseScreen === 'bluebook' && (
                  <div className="overflow-hidden border border-[#CBD5E1] bg-[#F8FAFC] text-[#111827]">
                    <div className="bg-white border-b border-[#E2E8F0] px-4 py-2.5 flex items-center justify-between text-xs">
                      <span className="font-semibold">Section 2, Module 2: Math (Harder)</span>
                      <span className="font-mono-tabular font-bold">34:15</span>
                      <span className="text-[11px] text-[#475569]">Reference</span>
                    </div>
                    <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#E2E8F0] text-xs bg-white">
                      <div className="p-4 leading-relaxed text-[#1F2937]">
                        A quadratic function f(x) = a(x − 4)² + 12 passes through (6, 20), where a
                        is a constant.
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="font-semibold">What is the value of f(1)?</div>
                        <div className="px-2.5 py-1.5 rounded border border-[#CBD5E1]">A. 24</div>
                        <div className="px-2.5 py-1.5 rounded border-2 border-[#1D4ED8] bg-[#EFF6FF] font-semibold">
                          B. 30
                        </div>
                        <div className="px-2.5 py-1.5 rounded border border-[#CBD5E1]">C. 36</div>
                      </div>
                    </div>
                    <div className="bg-white border-t border-[#E2E8F0] px-4 py-2 flex items-center justify-between text-[11px]">
                      <span className="px-2.5 py-1 rounded bg-[#111827] text-white font-semibold">
                        Question 14 of 22
                      </span>
                      <span className="px-3 py-1 rounded bg-[#1D4ED8] text-white font-semibold">
                        Next
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Three Studio Craft Pillars — Architectural 3-Column Strip */}
            <div className="grid md:grid-cols-3 border-t border-[var(--rule)] pt-10 gap-8">
              <div className="space-y-2.5">
                <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                  Adaptive Pacing
                </div>
                <h3 className="font-display text-2xl text-[var(--ink)]">
                  Difficulty that climbs with you.
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  ESAT runs step up across levels 1–5 at 1:30/Q; TMUA adaptive sets prioritise your
                  weakest Paper 1 &amp; Paper 2 skills at 3:45/Q.
                </p>
              </div>
              <div className="space-y-2.5">
                <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                  Mistake &amp; Guess Queues
                </div>
                <h3 className="font-display text-2xl text-[var(--ink)]">
                  Lucky guesses don’t hide weak spots.
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Wrong answers, timeouts, and flagged guesses stay in your review queue until you
                  solve them cleanly without the key visible.
                </p>
              </div>
              <div className="space-y-2.5">
                <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                  Timed Essay Studios
                </div>
                <h3 className="font-display text-2xl text-[var(--ink)]">
                  Write under real clock pressure.
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  LNAT and TARA essay rehearsals enforce the 40-minute clock and 750-word limit,
                  unlocking annotated model answers and rubrics only after submission.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Flat Architectural Pricing */}
        <motion.section {...REVEAL} id="pricing" className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 pb-8 border-b border-[var(--rule)]">
            <div>
              <div className="text-[11px] font-mono-tabular uppercase tracking-[0.18em] text-[var(--accent)]">
                03 / Transparent Pricing
              </div>
              <h2 className="font-display text-4xl sm:text-5xl text-[var(--ink)] mt-2 leading-tight">
                One payment. Zero subscriptions.
              </h2>
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-md">
              Start free with zero card required. Unlock one exam until your sitting ends, or all
              six in a single pass.
            </p>
          </div>

          <div className="grid md:grid-cols-3 border-l border-[var(--rule)]">
            {/* Free */}
            <div className="p-7 border-r border-b border-[var(--rule)] flex flex-col justify-between gap-8">
              <div>
                <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--text-muted)]">
                  Starter
                </div>
                <div className="font-display text-5xl text-[var(--ink)] mt-3">£0</div>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  Try every exam track before paying a penny.
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-[var(--ink)]/85">
                  {[
                    'Diagnostic drills & Daily 5 across all 6 tests',
                    'Official exam-board links & past paper archives',
                    'Local progress saving in your browser',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[var(--accent)] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onSelectTest('lnat')}
                className="w-full py-2.5 border border-[var(--rule)] hover:border-[var(--ink)]/50 text-xs font-semibold text-[var(--ink)] transition-colors cursor-pointer"
              >
                {isPro ? 'Open Studio' : 'Start Free'}
              </button>
            </div>

            {/* Single Test Pass */}
            <div className="p-7 border-r border-b border-[var(--rule)] flex flex-col justify-between gap-8">
              <div>
                <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--text-muted)]">
                  Single Test Pass
                </div>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="font-display text-5xl text-[var(--ink)]">£24</span>
                  <span className="text-xs font-mono-tabular text-[var(--text-muted)]">
                    one-off · exam season
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  Full access to your chosen admissions test until its season ends.
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-[var(--ink)]/85">
                  {[
                    'Every full mock & adaptive bank for 1 test',
                    'Authentic Pearson VUE, UAT-UK, or Bluebook screen',
                    'Mistake review queue, guides & essay studio',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[var(--accent)] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={onOpenPricing}
                className="w-full py-2.5 border border-[var(--rule)] hover:border-[var(--accent)] text-xs font-semibold text-[var(--ink)] transition-colors cursor-pointer"
              >
                Choose a test pass
              </button>
            </div>

            {/* All Tests Bundle */}
            <div className="p-7 border-r border-b border-[var(--rule)] border-t-2 border-t-[var(--accent)] bg-[var(--surface)] flex flex-col justify-between gap-8">
              <div>
                <div className="flex items-center justify-between text-xs font-mono-tabular uppercase tracking-wider">
                  <span className="text-[var(--accent)]">All Tests Bundle</span>
                  <span className="text-[var(--text-muted)]">Best Value</span>
                </div>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="font-display text-5xl text-[var(--ink)]">£39</span>
                  <span className="text-xs font-mono-tabular text-[var(--text-muted)]">
                    one-off · all 6 tests
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  Every UK, ANZ, and US admissions track unlocked in one payment.
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-[var(--ink)]">
                  {[
                    'LNAT + UCAT + TARA + ESAT + TMUA + SAT',
                    'All 3,915+ original questions & 15 full mocks',
                    '14-day no-questions-asked refund guarantee',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[var(--accent)] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={onOpenPricing}
                className="w-full py-2.5 bg-[var(--accent)] text-[#04130d] hover:opacity-90 text-xs font-semibold transition-opacity cursor-pointer"
              >
                {isPro ? 'Manage pass' : 'Unlock all 6 tests — £39'}
              </button>
            </div>
          </div>
        </motion.section>

        {/* Editorial 2-Column FAQ */}
        <motion.section
          {...REVEAL}
          id="faq"
          className="border-t border-[var(--rule)] max-w-6xl mx-auto px-5 sm:px-8 py-20"
        >
          <div className="grid md:grid-cols-12 gap-10">
            <div className="md:col-span-4 space-y-3">
              <div className="text-[11px] font-mono-tabular uppercase tracking-[0.18em] text-[var(--accent)]">
                04 / FAQ
              </div>
              <h2 className="font-display text-4xl text-[var(--ink)] leading-tight">
                Common questions.
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                Straight answers on originality, pricing, and how progress is stored.
              </p>
            </div>
            <div className="md:col-span-8 ratio-faq border-t border-[var(--rule)] divide-y divide-[var(--rule)]">
              {FAQ_ITEMS.map(([q, a], idx) => (
                <details key={q} open={idx === 0} className="py-5 group">
                  <summary className="list-none flex items-center justify-between gap-4 cursor-pointer text-sm sm:text-[15px] font-medium text-[var(--ink)]">
                    <span>{q}</span>
                    <Plus className="w-4 h-4 text-[var(--text-muted)] shrink-0 ratio-faq-plus transition-transform" />
                  </summary>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mt-3 pr-8">
                    {a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </motion.section>
      </main>

      {/* Minimal Legal Footer */}
      <footer className="border-t border-[var(--rule)] py-8">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg text-[var(--ink)]">Ratio</span>
            <span>· Independent practice studio. Not affiliated with Pearson VUE, UAT-UK, or College Board.</span>
          </div>
          <div className="flex items-center gap-5">
            <button type="button" onClick={() => onOpenLegal('terms')} className="hover:text-[var(--ink)] cursor-pointer">
              Terms
            </button>
            <button type="button" onClick={() => onOpenLegal('privacy')} className="hover:text-[var(--ink)] cursor-pointer">
              Privacy
            </button>
            <button type="button" onClick={() => onOpenLegal('refunds')} className="hover:text-[var(--ink)] cursor-pointer">
              Refunds
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
