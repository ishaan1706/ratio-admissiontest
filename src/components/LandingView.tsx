import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Compass,
  PenTool,
  Plus,
  Scale,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { AppView } from '../types';
import { UNI_BENCHMARKS } from '../data/benchmarks';
import {
  AuroraBackground,
  BlurText,
  CountUp,
  ShinyText,
  SlidingMarquee,
  SpotlightCard,
} from './ReactBits';

interface LandingViewProps {
  onEnterApp: (view?: AppView) => void;
  onStartDiagnostic: () => void;
}

const MARQUEE_ROW_1 = [
  { label: 'Inference', tag: 'Section A' },
  { label: 'Assumption & Flaw', tag: 'Section A' },
  { label: 'Main Argument', tag: 'Section A' },
  { label: 'Tone & Attitude', tag: 'Section A' },
  { label: 'Structure & Evidence', tag: 'Section A' },
  { label: 'Algorithmic Justice', tag: 'Passage' },
  { label: 'Constitutional Law', tag: 'Passage' },
  { label: 'Bioethics & Consent', tag: 'Passage' },
  { label: '500–600w Essay Craft', tag: 'Section B' },
  { label: 'Counter-Argument Pivots', tag: 'Section B' },
  { label: 'Pearson VUE Review Screen', tag: 'Exam UI' },
];

const MARQUEE_ROW_2 = [
  { label: 'University of Oxford', tag: '28–34 / 42' },
  { label: 'University of Cambridge', tag: '27–33 / 42' },
  { label: 'LSE Law', tag: '27–32 / 42' },
  { label: 'UCL Laws', tag: '26–31 / 42' },
  { label: "King's College London", tag: '25–30 / 42' },
  { label: 'Durham University', tag: '24–29 / 42' },
  { label: 'University of Bristol', tag: '23–28 / 42' },
  { label: 'LNAT', tag: 'Live Now' },
  { label: 'TSA Oxford', tag: 'Preview' },
  { label: 'UCAT', tag: 'Preview' },
  { label: 'TMUA & ESAT', tag: 'Preview' },
];

const SAMPLE_OPTIONS = [
  {
    letter: 'A',
    text: 'Statistical models are less consistent than individual judges.',
    correct: false,
    why: 'Misreads the concession — the author grants models can be more uniform, but argues uniformity is not fairness.',
  },
  {
    letter: 'B',
    text: 'Past policing disparities are disguised as neutral mathematical scores.',
    correct: true,
    why: 'Exact match. Converting a “contestable pattern of enforcement into a neutral-looking decimal” is what “launders it” means.',
  },
  {
    letter: 'C',
    text: 'Software engineers intentionally fabricate crime statistics.',
    correct: false,
    why: 'Unsupported leap — the bias stems from historical arrest data, not deliberate fabrication.',
  },
];

const FAQ_ITEMS: [string, string][] = [
  [
    'What is Ratio?',
    'A focused UK admissions test studio starting with the LNAT (Section A multiple choice, Section B 40-minute essays, and official lnat.ac.uk reading frameworks) and expanding to TSA, UCAT, and TMUA.',
  ],
  [
    'When can I sit the LNAT?',
    'You can sit the LNAT at any point in your testing window (Oxford and Cambridge candidates typically sit by mid-October; other UK law schools by January). Ratio lets you practise at your own pace with no artificial deadlines.',
  ],
  [
    'How does Ratio handle Section A & Section B?',
    'Section A mirrors the Pearson VUE split-screen with 3-colour Claim/Evidence/Pivot highlighting, option strike-out, confidence calibration, and a full Review Screen. Section B tracks the official 500–600 word sweet spot and counter-argument pivots live.',
  ],
  [
    'Does my progress save without creating an account?',
    'Yes. Every completed diagnostic, passage drill, essay draft, and score breakdown saves automatically in your browser so you can pick up right where you left off.',
  ],
  [
    'Are other UK admissions tests coming?',
    'Yes — LNAT is the complete live track right now. Interactive previews for TSA, UCAT, and TMUA/ESAT are already inside the test switcher as we expand.',
  ],
];

export const LandingView: React.FC<LandingViewProps> = ({ onEnterApp, onStartDiagnostic }) => {
  const [samplePick, setSamplePick] = useState<string | null>(null);
  const [selectedUni, setSelectedUni] = useState(UNI_BENCHMARKS[0].shortName);

  const uni = UNI_BENCHMARKS.find((b) => b.shortName === selectedUni) || UNI_BENCHMARKS[0];
  const sampleResult = SAMPLE_OPTIONS.find((o) => o.letter === samplePick);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#07090F] text-[#F8FAFC] overflow-x-hidden selection:bg-[#10B981]/30">
      {/* Sticky Glass Welcome Nav */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#07090F]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10B981] to-[#047857] text-[#03150E] flex items-center justify-center shadow-[0_0_24px_rgba(16,185,129,0.35)]">
              <Scale className="w-4 h-4" />
            </div>
            <span className="font-display text-2xl tracking-tight text-white">Ratio</span>
            <span className="hidden sm:inline-block text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400 pl-2.5 ml-1 border-l border-white/10">
              LNAT
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#coverage" onClick={scrollTo('coverage')} className="hover:text-white transition-colors">
              Coverage
            </a>
            <a href="#features" onClick={scrollTo('features')} className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#faq" onClick={scrollTo('faq')} className="hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onEnterApp('resources')}
              className="hidden sm:inline-flex text-sm text-slate-300 hover:text-white px-2.5 py-1.5 transition-colors cursor-pointer"
            >
              Official Guide
            </button>
            <button
              type="button"
              onClick={() => onEnterApp('practice')}
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#E2E8F0] text-[#07090F] text-sm font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_0_1px_rgba(255,255,255,0.2)_inset,0_10px_28px_-10px_rgba(255,255,255,0.4)]"
            >
              Open LNAT Studio
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero with Aurora + Dot Grid + BlurText + Interactive App Stage */}
      <section className="relative rb-dot-grid pt-16 sm:pt-24 pb-16 px-4 sm:px-6">
        <AuroraBackground />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* ShinyText Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/12 bg-white/[0.04] backdrop-blur-md text-xs font-medium mb-7">
            <Sparkles className="w-3.5 h-3.5 text-[#34D399]" />
            <ShinyText>Built for LNAT · Expanding to UK Admissions Tests</ShinyText>
          </div>

          {/* BlurText Monumental Headline */}
          <h1 className="font-display text-[3.1rem] sm:text-[5rem] lg:text-[6.2rem] leading-[0.94] tracking-[-0.025em] text-white max-w-4xl mx-auto">
            <BlurText
              text="The LNAT studio that thinks like an admissions tutor."
              accentWords={['admissions', 'tutor']}
            />
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Editorially crafted passages, Pearson VUE split-screen controls, live Section B essay
            telemetry, and official <span className="text-slate-200 font-medium">lnat.ac.uk</span>{' '}
            frameworks — stripped of clutter so you only focus on your score.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={onStartDiagnostic}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-b from-[#34D399] to-[#10B981] hover:from-[#6EE7B7] hover:to-[#34D399] text-[#03150E] font-semibold text-sm sm:text-base inline-flex items-center gap-2 transition-all cursor-pointer shadow-[0_14px_34px_-10px_rgba(16,185,129,0.55)]"
            >
              Start 15-min Free Diagnostic
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onEnterApp('practice')}
              className="px-6 py-3.5 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.09] text-white font-medium text-sm sm:text-base inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              Browse Passages &amp; Essays
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Interactive macOS-Framed Live Preview Stage (inspired by recall-politics's lp-stage) */}
          <div className="mt-14 sm:mt-16 max-w-4xl mx-auto text-left">
            <div className="rounded-2xl border border-white/12 bg-[#0C1018]/95 shadow-[0_40px_100px_-24px_rgba(0,0,0,0.85),0_0_60px_-20px_rgba(16,185,129,0.2)] overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-[#090C12]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                  <span className="ml-3 text-[11px] font-mono-tabular text-slate-400 bg-white/[0.04] px-2.5 py-0.5 rounded-md border border-white/[0.06]">
                    ratio / lnat-section-a · live preview
                  </span>
                </div>
                <span className="text-[11px] text-[#34D399] font-medium hidden sm:inline">
                  Click an option to try
                </span>
              </div>

              {/* Split interactive preview */}
              <div className="grid md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
                <div className="md:col-span-7 p-6 space-y-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#34D399]">
                    30-Second Taste Test · Tone &amp; Metaphor
                  </div>
                  <blockquote className="font-serif-passage text-[16px] leading-[1.7] text-slate-200 pl-3.5 border-l-2 border-[#10B981]">
                    “When an algorithm assigns a higher recidivism score to a postcode that has long
                    been heavily patrolled, it does not eliminate human bias. It{' '}
                    <mark className="hl-claim text-white font-medium">launders it</mark>, converting
                    a contestable pattern of enforcement into a neutral-looking decimal.”
                  </blockquote>
                  <div className="text-xs font-semibold text-white">
                    Why does the author use the verb “launders” here?
                  </div>
                  <div className="space-y-2">
                    {SAMPLE_OPTIONS.map((opt) => {
                      const picked = samplePick === opt.letter;
                      let tone =
                        'border-white/10 bg-white/[0.02] hover:border-white/25 text-slate-200';
                      if (samplePick) {
                        if (opt.correct) {
                          tone = 'border-[#10B981]/60 bg-[#10B981]/12 text-white';
                        } else if (picked) {
                          tone = 'border-red-400/50 bg-red-500/10 text-red-200';
                        } else {
                          tone = 'border-white/[0.06] text-slate-500';
                        }
                      }
                      return (
                        <button
                          key={opt.letter}
                          type="button"
                          onClick={() => setSamplePick(opt.letter)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 transition-all cursor-pointer ${tone}`}
                        >
                          <span className="font-mono-tabular font-semibold text-[#34D399] shrink-0">
                            {opt.letter}.
                          </span>
                          <span className="flex-1">{opt.text}</span>
                          {samplePick && opt.correct && (
                            <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                          )}
                          {samplePick && picked && !opt.correct && (
                            <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {sampleResult && (
                    <p className="text-xs text-slate-300 leading-relaxed pt-1">
                      <strong
                        className={sampleResult.correct ? 'text-[#34D399]' : 'text-red-400'}
                      >
                        {sampleResult.correct ? 'Correct.' : 'Not quite.'}
                      </strong>{' '}
                      {sampleResult.why}
                    </p>
                  )}
                </div>

                {/* Right side of stage: Target Law School Calibrator */}
                <div className="md:col-span-5 p-6 bg-[#090D14] flex flex-col justify-between gap-6">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#F5D08A] mb-3">
                      UK Law School Target Band
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {UNI_BENCHMARKS.map((b) => {
                        const active = b.shortName === selectedUni;
                        return (
                          <button
                            key={b.shortName}
                            type="button"
                            onClick={() => setSelectedUni(b.shortName)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                              active
                                ? 'bg-[#10B981] text-[#03150E]'
                                : 'bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white'
                            }`}
                          >
                            {b.shortName}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-5 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                      <div className="text-[11px] text-slate-400">Typical shortlisted range</div>
                      <div className="font-display text-4xl text-white mt-1 font-mono-tabular">
                        {uni.typicalOfferRange[0]}–{uni.typicalOfferRange[1]}
                        <span className="text-base text-slate-500 font-sans"> / 42</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{uni.note}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onStartDiagnostic}
                    className="w-full py-2.5 px-4 rounded-xl border border-[#10B981]/40 bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#6EE7B7] text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    See your projected /42 score
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated CountUp Stats Strip */}
      <section className="border-y border-white/[0.08] bg-gradient-to-r from-transparent via-white/[0.025] to-transparent">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
          <div className="p-7 sm:p-8">
            <div className="font-display text-4xl sm:text-5xl text-white">
              <CountUp to={95} suffix="m" />
            </div>
            <div className="text-sm font-semibold text-slate-200 mt-2">Section A</div>
            <p className="text-xs text-slate-400 mt-1">
              42 five-option MCQs across 12 unseen passages.
            </p>
          </div>
          <div className="p-7 sm:p-8">
            <div className="font-display text-4xl sm:text-5xl text-white">
              <CountUp to={40} suffix="m" />
            </div>
            <div className="text-sm font-semibold text-slate-200 mt-2">Section B</div>
            <p className="text-xs text-slate-400 mt-1">
              1 of 3 prompts · 500–600w sweet spot, 750w cap.
            </p>
          </div>
          <div className="p-7 sm:p-8">
            <div className="font-display text-4xl sm:text-5xl text-white">
              <CountUp to={22} />
            </div>
            <div className="text-sm font-semibold text-slate-200 mt-2">Edited MCQs</div>
            <p className="text-xs text-slate-400 mt-1">
              6 curated passages with per-distractor rationales.
            </p>
          </div>
          <div className="p-7 sm:p-8">
            <div className="font-display text-4xl sm:text-5xl text-[#34D399]">
              <CountUp to={4} />
            </div>
            <div className="text-sm font-semibold text-slate-200 mt-2">UK Test Tracks</div>
            <p className="text-xs text-slate-400 mt-1">
              LNAT live now · TSA, UCAT &amp; TMUA previews inside.
            </p>
          </div>
        </div>
      </section>

      {/* Dual Opposing Sliding Marquee (the sliding thing from recall-politics!) */}
      <section id="coverage" className="py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-10">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#34D399] mb-3">
            Every skill &amp; law school covered
          </div>
          <h2 className="font-display text-4xl sm:text-6xl leading-[0.98] text-white">
            Built for the LNAT today.
            <br />
            <span className="italic text-slate-400">Ready for every UK admissions test.</span>
          </h2>
        </div>

        <div className="space-y-3">
          <SlidingMarquee items={MARQUEE_ROW_1} />
          <SlidingMarquee items={MARQUEE_ROW_2} reverse />
        </div>

        <p className="text-center text-xs sm:text-sm text-slate-400 mt-7 px-4">
          <strong className="text-white">Section A</strong> Reading Comprehension ·{' '}
          <strong className="text-white">Section B</strong> Timed Argumentative Essays ·{' '}
          <strong className="text-white">Official Guide</strong> Direct lnat.ac.uk Reading Lab
        </p>
      </section>

      {/* 3 Cursor-Tracking SpotlightCard Feature Showcases */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F5D08A] mb-2">
              Inside the Studio
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-white">
              Three focused tools. Zero bloat.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onEnterApp('practice')}
            className="text-sm font-medium text-[#34D399] hover:text-[#6EE7B7] inline-flex items-center gap-1 cursor-pointer"
          >
            Enter LNAT Studio
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <SpotlightCard
            onClick={() => onEnterApp('practice')}
            className="p-7 flex flex-col justify-between gap-6"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/14 border border-[#10B981]/25 text-[#34D399] flex items-center justify-center mb-5">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-display text-3xl text-white">Section A Simulator</h3>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Pearson VUE split-screen with 3-colour Claim / Evidence / Pivot highlighting,
                option strike-out, Sure / Unsure / Guess calibration, and a full Review Screen.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-medium text-slate-300">
              <span>6 passages · 22 MCQs</span>
              <ArrowUpRight className="w-4 h-4 text-[#34D399]" />
            </div>
          </SpotlightCard>

          <SpotlightCard
            onClick={() => onEnterApp('essay')}
            className="p-7 flex flex-col justify-between gap-6"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F5D08A]/14 border border-[#F5D08A]/25 text-[#F5D08A] flex items-center justify-center mb-5">
                <PenTool className="w-5 h-5" />
              </div>
              <h3 className="font-display text-3xl text-white">Section B Essay Studio</h3>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                40-minute timed prompts with a 5-minute planning scratchpad, spellcheck-off exam
                mode, live 500–600 word sweet-spot telemetry, and counter-argument detection.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-medium text-slate-300">
              <span>3 exam sets · 9 prompts</span>
              <ArrowUpRight className="w-4 h-4 text-[#F5D08A]" />
            </div>
          </SpotlightCard>

          <SpotlightCard
            onClick={() => onEnterApp('resources')}
            className="p-7 flex flex-col justify-between gap-6"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-400/14 border border-sky-400/25 text-sky-300 flex items-center justify-center mb-5">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-display text-3xl text-white">Official Reading Lab</h3>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Direct links to the official lnat.ac.uk tutorial, sample test, and essay samples —
                paired with an interactive lab built around LNAT’s 4 analytical questions.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-medium text-slate-300">
              <span>Direct lnat.ac.uk links</span>
              <ArrowUpRight className="w-4 h-4 text-sky-300" />
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#34D399] mb-2">
            FAQ
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-white">Got questions?</h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
            Everything you need to know before starting your first LNAT diagnostic.
          </p>
          <button
            type="button"
            onClick={() => onEnterApp('practice')}
            className="mt-6 px-5 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.09] text-sm font-medium text-white inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            Open LNAT Studio
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="md:col-span-7 rounded-2xl border border-white/10 bg-[#0C1018] divide-y divide-white/[0.08] overflow-hidden">
          {FAQ_ITEMS.map(([q, a], idx) => (
            <details key={q} open={idx === 0} className="group">
              <summary className="list-none cursor-pointer px-6 py-5 flex items-center justify-between gap-4 text-base font-medium text-white hover:text-[#34D399] transition-colors">
                <span>{q}</span>
                <Plus className="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 group-open:rotate-45 group-open:text-[#34D399]" />
              </summary>
              <p className="px-6 pb-5 text-sm text-slate-400 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Closing CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 pb-20">
        <div className="relative rounded-3xl border border-white/12 bg-gradient-to-b from-[#111927] to-[#0A0E17] px-6 sm:px-14 py-14 sm:py-16 text-center overflow-hidden">
          <div
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[540px] h-[220px] rounded-full blur-[90px] opacity-35"
            style={{ background: 'radial-gradient(closest-side, #10B981, transparent)' }}
          />
          <h2 className="relative font-display text-4xl sm:text-6xl text-white leading-[0.98]">
            Find your projected /42 score in 15 minutes.
          </h2>
          <p className="relative text-sm sm:text-base text-slate-400 max-w-xl mx-auto mt-4">
            No sign-up wall. Complete two edited LNAT passages and get a full skill breakdown plus a
            shareable UK law school readiness card.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={onStartDiagnostic}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-b from-[#34D399] to-[#10B981] hover:from-[#6EE7B7] hover:to-[#34D399] text-[#03150E] font-semibold text-sm sm:text-base inline-flex items-center gap-2 transition-all cursor-pointer shadow-[0_14px_34px_-10px_rgba(16,185,129,0.55)]"
            >
              Start Free Diagnostic
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Clean Welcome Footer */}
      <footer className="border-t border-white/[0.08] py-8 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#34D399]" />
            <span className="font-semibold text-slate-300">Ratio</span>
            <span>· Independent UK Admissions Studio</span>
          </div>
          <div>Not affiliated with LNAT Consortium, Pearson VUE, UCAT, or UAT-UK.</div>
        </div>
      </footer>
    </div>
  );
};
