import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ExternalLink,
  Plus,
  Scale,
  X,
} from 'lucide-react';
import { AppView } from '../types';
import { UNI_BENCHMARKS } from '../data/benchmarks';
import { OFFICIAL_FOUR_QUESTIONS } from '../data/exams';
import {
  GridCrosshair,
  RevealLine,
  SlidingMarquee,
  TextScramble,
} from './ReactBits';

interface LandingViewProps {
  onEnterApp: (view?: AppView) => void;
  onStartDiagnostic: () => void;
}

const MARQUEE_ROW_1 = [
  { label: 'Inference', tag: 'Sec A' },
  { label: 'Assumption & Flaw', tag: 'Sec A' },
  { label: 'Main Argument', tag: 'Sec A' },
  { label: 'Tone & Attitude', tag: 'Sec A' },
  { label: 'Structure & Evidence', tag: 'Sec A' },
  { label: 'Algorithmic Justice', tag: 'Passage 01' },
  { label: 'Constitutional Law', tag: 'Passage 02' },
  { label: 'Bioethics & Consent', tag: 'Passage 03' },
  { label: '500–600w Essay Craft', tag: 'Sec B' },
  { label: 'Counter-Argument Pivots', tag: 'Sec B' },
  { label: 'Pearson VUE Review Screen', tag: 'Exam UI' },
];

const MARQUEE_ROW_2 = [
  { label: 'Oxford Law', tag: '28–34 / 42' },
  { label: 'Cambridge Law', tag: '27–33 / 42' },
  { label: 'LSE Law', tag: '27–32 / 42' },
  { label: 'UCL Laws', tag: '26–31 / 42' },
  { label: "King's College London", tag: '25–30 / 42' },
  { label: 'Durham Law', tag: '24–29 / 42' },
  { label: 'Bristol Law', tag: '23–28 / 42' },
  { label: 'LNAT', tag: 'Live' },
  { label: 'TSA Oxford', tag: 'Next' },
  { label: 'UCAT', tag: 'Next' },
  { label: 'TMUA & ESAT', tag: 'Next' },
];

const PROOF_SENTENCES = [
  {
    id: 's1',
    text: 'When an algorithm assigns a higher recidivism score to a postcode that has long been heavily patrolled, it does not eliminate human bias.',
    role: 'Claim',
    hl: 'hl-claim',
  },
  {
    id: 's2',
    text: 'It launders it, converting a contestable pattern of enforcement into a neutral-looking decimal.',
    role: 'Metaphor',
    hl: 'hl-evidence',
  },
  {
    id: 's3',
    text: 'Defenders reply that statistical models are at least consistent—yet consistency in error is still injustice.',
    role: 'Pivot',
    hl: 'hl-counter',
  },
];

const SAMPLE_OPTIONS = [
  {
    letter: 'A',
    text: 'Statistical models are less consistent than individual judges.',
    correct: false,
    why: 'Contradicts sentence 3 — the author concedes uniformity, but denies that uniformity equals fairness.',
  },
  {
    letter: 'B',
    text: 'Past policing disparities are disguised as neutral mathematical scores.',
    correct: true,
    why: 'Correct. Turning a contestable pattern of enforcement into a neutral decimal is exactly what “launders” conveys.',
  },
  {
    letter: 'C',
    text: 'Software engineers intentionally fabricate crime statistics.',
    correct: false,
    why: 'Unsupported leap — the flaw comes from historical arrest data, not deliberate fraud.',
  },
];

const FAQ_ITEMS: [string, string][] = [
  [
    'What is Ratio?',
    'A focused UK admissions test studio starting with the LNAT (Section A multiple choice, Section B 40-minute essays, and official lnat.ac.uk reading frameworks), built so TSA, UCAT, and TMUA can slot in cleanly after.',
  ],
  [
    'When can I sit the LNAT?',
    'You can sit the LNAT at any point during your testing window. Ratio has no artificial countdowns — practise passages and timed essays whenever you are ready.',
  ],
  [
    'How close is Section A to Pearson VUE?',
    'Split-screen passage on the left, five-option MCQ on the right, sentence highlighting (Claim / Evidence / Pivot), option strike-out, confidence tagging, and a full Review Screen before scoring.',
  ],
  [
    'Does my progress save without an account?',
    'Yes. Completed diagnostics, passage scores, essay drafts, and skill analytics save automatically in your browser.',
  ],
];

export const LandingView: React.FC<LandingViewProps> = ({ onEnterApp, onStartDiagnostic }) => {
  const [samplePick, setSamplePick] = useState<string | null>(null);
  const [activeSentence, setActiveSentence] = useState<string>('s2');
  const [selectedUni, setSelectedUni] = useState(UNI_BENCHMARKS[0].shortName);

  const sampleResult = SAMPLE_OPTIONS.find((o) => o.letter === samplePick);

  // Keyboard shortcuts printed on hero buttons (inspired by Zed)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key.toLowerCase() === 'd') onStartDiagnostic();
      if (e.key.toLowerCase() === 's') onEnterApp('practice');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onEnterApp, onStartDiagnostic]);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#07090F] text-[#F8FAFC] overflow-x-hidden selection:bg-[#10B981]/30">
      {/* Crisp Hairline Header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.09] bg-[#07090F]/92 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-[6px] bg-[#10B981] text-[#03150E] flex items-center justify-center">
              <Scale className="w-3.5 h-3.5" />
            </div>
            <span className="font-display text-2xl tracking-tight text-white leading-none">
              Ratio
            </span>
            <span className="hidden sm:inline-block font-mono-tabular text-[11px] uppercase tracking-[0.14em] text-slate-500 pl-3 border-l border-white/10">
              LNAT Studio
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-[0.12em] font-medium text-slate-400">
            <a href="#coverage" onClick={scrollTo('coverage')} className="hover:text-white transition-colors">
              Coverage
            </a>
            <a href="#specimens" onClick={scrollTo('specimens')} className="hover:text-white transition-colors">
              Inside
            </a>
            <a href="#faq" onClick={scrollTo('faq')} className="hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onEnterApp('resources')}
              className="hidden sm:inline-flex text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Official Guide
            </button>
            <button
              type="button"
              onClick={() => onEnterApp('practice')}
              className="px-3.5 py-1.5 bg-[#F8FAFC] hover:bg-[#10B981] text-[#07090F] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              Open Studio
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Asymmetric Split Drafting-Grid Hero (Zero generic centered SaaS template) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-16">
        <div className="relative border border-white/[0.09] grid lg:grid-cols-12">
          <GridCrosshair position="tl" />
          <GridCrosshair position="tr" />
          <GridCrosshair position="bl" />
          <GridCrosshair position="br" />

          {/* Left 7 Cols: Editorial Type + Shortcut-Badged Flat Controls */}
          <div className="lg:col-span-7 p-7 sm:p-12 lg:p-14 flex flex-col justify-between gap-10 lg:border-r border-white/[0.09]">
            <div>
              <div className="font-mono-tabular text-[11px] uppercase tracking-[0.16em] text-[#10B981] mb-6">
                <TextScramble text="SPECIMEN 01 / LNAT SECTION A & B" />
              </div>

              <h1 className="font-display text-[3.3rem] sm:text-[4.6rem] lg:text-[5.2rem] leading-[0.93] tracking-[-0.025em] text-white">
                <RevealLine delay={0.02}>Read the argument.</RevealLine>
                <RevealLine delay={0.1}>
                  Spot the <span className="italic text-[#34D399]">flaw.</span>
                </RevealLine>
                <RevealLine delay={0.18}>Write the brief.</RevealLine>
              </h1>

              <p className="font-serif-passage text-lg sm:text-xl text-slate-400 mt-6 max-w-xl leading-relaxed">
                Unseen argumentative passages edited to real LNAT register, paired with a Pearson VUE
                split-screen simulator, 40-minute essay studio, and official{' '}
                <span className="text-slate-200">lnat.ac.uk</span> reading protocols.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onStartDiagnostic}
                  className="px-5 py-3 bg-[#10B981] hover:bg-[#34D399] text-[#03150E] text-sm font-semibold inline-flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <span>Start 15-min Diagnostic</span>
                  <kbd className="font-mono-tabular text-[10px] px-1.5 py-0.5 bg-[#03150E]/15 border border-[#03150E]/25">
                    D
                  </kbd>
                </button>

                <button
                  type="button"
                  onClick={() => onEnterApp('practice')}
                  className="px-5 py-3 border border-white/15 hover:border-white/40 text-white text-sm font-medium inline-flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <span>Enter LNAT Studio</span>
                  <kbd className="font-mono-tabular text-[10px] px-1.5 py-0.5 text-slate-400 border border-white/15">
                    S
                  </kbd>
                </button>
              </div>

              {/* Compact Inline Spec Row */}
              <div className="pt-5 border-t border-white/[0.08] grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="font-mono-tabular text-lg font-semibold text-white">95m</div>
                  <div className="text-slate-500 mt-0.5">Section A · 42 MCQs</div>
                </div>
                <div>
                  <div className="font-mono-tabular text-lg font-semibold text-white">40m</div>
                  <div className="text-slate-500 mt-0.5">Section B · 1 of 3 essays</div>
                </div>
                <div>
                  <div className="font-mono-tabular text-lg font-semibold text-[#F5D08A]">
                    500–600w
                  </div>
                  <div className="text-slate-500 mt-0.5">Target essay length</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Real Annotated Proof Sheet (NO fake macOS traffic lights!) */}
          <div className="lg:col-span-5 bg-[#0B0F17] p-6 sm:p-8 flex flex-col justify-between gap-6 border-t lg:border-t-0 border-white/[0.09]">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <span className="font-mono-tabular text-[10px] uppercase tracking-[0.14em] text-slate-400">
                  PASSAGE EXCERPT · CLICK SENTENCE
                </span>
                <span className="font-mono-tabular text-[10px] uppercase tracking-[0.12em] text-[#F5D08A]">
                  {PROOF_SENTENCES.find((s) => s.id === activeSentence)?.role}
                </span>
              </div>

              {/* Interactive Click-to-Annotate Passage */}
              <div className="font-serif-passage text-[16px] leading-[1.72] text-slate-200 space-y-2.5">
                {PROOF_SENTENCES.map((s) => {
                  const isActive = activeSentence === s.id;
                  return (
                    <span
                      key={s.id}
                      onClick={() => setActiveSentence(s.id)}
                      className={`cursor-pointer transition-colors mr-1.5 ${
                        isActive ? `${s.hl} text-white` : 'hover:text-white text-slate-300'
                      }`}
                    >
                      {s.text}
                    </span>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-white/[0.08]">
                <div className="text-xs font-semibold text-white mb-3">
                  Q1. Why does the author use the verb “launders” in sentence 2?
                </div>

                <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
                  {SAMPLE_OPTIONS.map((opt) => {
                    const picked = samplePick === opt.letter;
                    let rowClass = 'text-slate-300 hover:text-white';
                    if (samplePick) {
                      if (opt.correct) rowClass = 'text-[#34D399] font-medium';
                      else if (picked) rowClass = 'text-red-400 line-through';
                      else rowClass = 'text-slate-600';
                    }
                    return (
                      <button
                        key={opt.letter}
                        type="button"
                        onClick={() => setSamplePick(opt.letter)}
                        className={`w-full text-left py-2.5 text-xs leading-relaxed flex items-start gap-2.5 transition-colors cursor-pointer ${rowClass}`}
                      >
                        <span className="font-mono-tabular text-[11px] px-1.5 py-0.5 border border-white/12 shrink-0">
                          {opt.letter}
                        </span>
                        <span className="flex-1">{opt.text}</span>
                        {samplePick && opt.correct && (
                          <Check className="w-3.5 h-3.5 text-[#34D399] shrink-0 mt-0.5" />
                        )}
                        {samplePick && picked && !opt.correct && (
                          <X className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {sampleResult && (
                  <p className="font-serif-passage text-xs text-slate-300 mt-3 leading-relaxed">
                    {sampleResult.why}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onStartDiagnostic}
              className="w-full py-2.5 px-4 border border-[#10B981]/40 hover:bg-[#10B981]/10 text-[#34D399] font-mono-tabular text-[11px] uppercase tracking-[0.12em] flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Try full 8-question diagnostic</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Dual Opposing Sliding Marquee (from recall-politics, crisp architectural styling) */}
      <section id="coverage" className="border-y border-white/[0.09] py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono-tabular text-[11px] uppercase tracking-[0.14em] text-slate-500 mb-2">
              INDEX / SKILLS, LAW SCHOOLS &amp; ROADMAP
            </div>
            <h2 className="font-display text-3xl sm:text-5xl text-white leading-none">
              LNAT first. Built to expand across UK admissions tests.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onEnterApp('tests')}
            className="font-mono-tabular text-[11px] uppercase tracking-[0.12em] text-[#34D399] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            Preview TSA, UCAT &amp; TMUA
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          <SlidingMarquee items={MARQUEE_ROW_1} />
          <SlidingMarquee items={MARQUEE_ROW_2} reverse />
        </div>
      </section>

      {/* Asymmetric Architectural Specimen Grid (Real UI Artifacts — NO 3 identical icon cards!) */}
      <section id="specimens" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="mb-10">
          <div className="font-mono-tabular text-[11px] uppercase tracking-[0.14em] text-slate-500 mb-2">
            WORKBENCH SPECIMENS
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-white leading-tight">
            Designed around how the real exam works.
          </h2>
        </div>

        <div className="relative border border-white/[0.09]">
          <GridCrosshair position="tl" />
          <GridCrosshair position="tr" />
          <GridCrosshair position="bl" />
          <GridCrosshair position="br" />

          {/* Row 1: 7 cols + 5 cols */}
          <div className="grid lg:grid-cols-12 border-b border-white/[0.09]">
            {/* Specimen 01: Section A Split-Screen & Strike-out */}
            <div className="lg:col-span-7 p-7 sm:p-9 lg:border-r border-white/[0.09] flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono-tabular text-[11px] uppercase tracking-[0.14em] text-[#34D399]">
                    01 / SECTION A SIMULATOR
                  </span>
                  <button
                    type="button"
                    onClick={() => onEnterApp('practice')}
                    className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
                  >
                    Open
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h3 className="font-display text-3xl text-white mt-3">
                  Three-colour argument marking &amp; Pearson Review Screen.
                </h3>
                <p className="font-serif-passage text-base text-slate-400 mt-2 max-w-xl">
                  Mark Claims, Evidence, and Pivots directly in the passage, cross out distractors
                  by right-click or toggle, tag confidence (Sure / Unsure / Guess), and review all
                  flagged questions before scoring.
                </p>
              </div>

              {/* Mini real-product artifact */}
              <div className="border border-white/[0.09] bg-[#0B0F17] p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tabular">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-yellow-400/20 text-yellow-200">Claim</span>
                    <span className="px-2 py-0.5 bg-sky-400/20 text-sky-200">Evidence</span>
                    <span className="px-2 py-0.5 bg-pink-400/20 text-pink-200">Pivot</span>
                  </div>
                  <span className="text-slate-500">Q 08 / 22 · FLAGGED</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-2 text-xs font-mono-tabular">
                  <div className="px-3 py-2 border border-[#10B981]/50 bg-[#10B981]/10 text-[#34D399]">
                    [B] Selected · Sure
                  </div>
                  <div className="px-3 py-2 border border-white/[0.07] text-slate-600 line-through">
                    [D] Eliminated distractor
                  </div>
                </div>
              </div>
            </div>

            {/* Specimen 02: Section B Essay Telemetry Ruler */}
            <div className="lg:col-span-5 p-7 sm:p-9 border-t lg:border-t-0 border-white/[0.09] flex flex-col justify-between gap-6 bg-[#0A0E16]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono-tabular text-[11px] uppercase tracking-[0.14em] text-[#F5D08A]">
                    02 / SECTION B ESSAY STUDIO
                  </span>
                  <button
                    type="button"
                    onClick={() => onEnterApp('essay')}
                    className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
                  >
                    Open
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h3 className="font-display text-3xl text-white mt-3">
                  Live 500–600w sweet-spot telemetry.
                </h3>
                <p className="font-serif-passage text-base text-slate-400 mt-2">
                  40-minute exam mode (spellcheck off), 5-minute planning scratchpad, and a live
                  counter-argument pivot detector.
                </p>
              </div>

              {/* Visual word-band ruler artifact */}
              <div className="border border-white/[0.09] bg-[#07090F] p-4 space-y-3 font-mono-tabular">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-semibold">564 words</span>
                  <span className="text-[#34D399]">In 500–600w sweet spot</span>
                </div>
                <div className="h-2 bg-white/[0.07] relative overflow-hidden">
                  <div className="absolute inset-y-0 left-[66%] right-[20%] bg-[#10B981]/30" />
                  <div className="h-full w-[75%] bg-[#10B981]" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>0w</span>
                  <span>500w</span>
                  <span>600w</span>
                  <span>750w cap</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: 5 cols + 7 cols */}
          <div className="grid lg:grid-cols-12">
            {/* Specimen 03: Interactive UK Law School /42 Range Matrix */}
            <div className="lg:col-span-5 p-7 sm:p-9 lg:border-r border-white/[0.09] bg-[#0A0E16] flex flex-col justify-between gap-5">
              <div>
                <span className="font-mono-tabular text-[11px] uppercase tracking-[0.14em] text-slate-400">
                  03 / UK LAW SCHOOL BENCHMARKS
                </span>
                <h3 className="font-display text-3xl text-white mt-3">
                  Know where your /42 score stands.
                </h3>
              </div>

              <div className="space-y-2.5">
                {UNI_BENCHMARKS.map((b) => {
                  const active = b.shortName === selectedUni;
                  const leftPct = Math.round((b.typicalOfferRange[0] / 42) * 100);
                  const widthPct = Math.round(
                    ((b.typicalOfferRange[1] - b.typicalOfferRange[0]) / 42) * 100
                  );
                  return (
                    <button
                      key={b.shortName}
                      type="button"
                      onClick={() => setSelectedUni(b.shortName)}
                      className="w-full text-left group cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span
                          className={
                            active ? 'text-white font-semibold' : 'text-slate-400 group-hover:text-slate-200'
                          }
                        >
                          {b.shortName}
                        </span>
                        <span className="font-mono-tabular text-[11px] text-slate-400">
                          {b.typicalOfferRange[0]}–{b.typicalOfferRange[1]} / 42
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/[0.07] relative">
                        <div
                          className={`absolute inset-y-0 transition-colors ${
                            active ? 'bg-[#10B981]' : 'bg-white/25 group-hover:bg-white/45'
                          }`}
                          style={{ left: `${leftPct}%`, width: `${Math.max(10, widthPct)}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specimen 04: Official lnat.ac.uk 4-Question Reading Protocol */}
            <div className="lg:col-span-7 p-7 sm:p-9 border-t lg:border-t-0 border-white/[0.09] flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono-tabular text-[11px] uppercase tracking-[0.14em] text-[#34D399]">
                    04 / OFFICIAL LNAT.AC.UK PROTOCOL
                  </span>
                  <a
                    href="https://lnat.ac.uk/how-to-prepare/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1"
                  >
                    lnat.ac.uk
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <h3 className="font-display text-3xl text-white mt-3">
                  The 4 questions LNAT advises every candidate to ask.
                </h3>
              </div>

              <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
                {OFFICIAL_FOUR_QUESTIONS.map((q) => (
                  <div key={q.step} className="py-3 grid sm:grid-cols-12 gap-2 items-baseline">
                    <span className="sm:col-span-1 font-mono-tabular text-xs text-[#34D399]">
                      {q.step}
                    </span>
                    <span className="sm:col-span-5 text-sm font-medium text-white">
                      {q.question}
                    </span>
                    <span className="sm:col-span-6 font-serif-passage text-xs text-slate-400">
                      {q.tip}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onEnterApp('resources')}
                className="self-start font-mono-tabular text-[11px] uppercase tracking-[0.12em] text-white hover:text-[#34D399] inline-flex items-center gap-1.5 cursor-pointer"
              >
                Open Official Guide &amp; Interactive Reading Lab
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hairline FAQ */}
      <section id="faq" className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <div className="font-mono-tabular text-[11px] uppercase tracking-[0.14em] text-slate-500 mb-2">
            QUESTIONS
          </div>
          <h2 className="font-display text-4xl text-white">Before you start.</h2>
        </div>

        <div className="md:col-span-8 border-t border-white/[0.12] divide-y divide-white/[0.08]">
          {FAQ_ITEMS.map(([q, a], idx) => (
            <details key={q} open={idx === 0} className="group">
              <summary className="list-none cursor-pointer py-5 flex items-center justify-between gap-4 text-base font-medium text-white hover:text-[#34D399] transition-colors">
                <span>{q}</span>
                <Plus className="w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 group-open:rotate-45 group-open:text-[#34D399]" />
              </summary>
              <p className="pb-5 font-serif-passage text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Minimal Architectural Footer */}
      <footer className="border-t border-white/[0.09] py-8 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="font-semibold text-slate-300">Ratio</span>
            <span>· Independent UK Admissions Studio</span>
          </div>
          <div>Not affiliated with LNAT Consortium, Pearson VUE, UCAT, or UAT-UK.</div>
        </div>
      </footer>
    </div>
  );
};
