import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  XCircle,
} from 'lucide-react';
import { AppView, SectionAAttempt, SectionBEssayRecord } from '../types';
import { EXAM_TRACKS, OFFICIAL_FOUR_QUESTIONS } from '../data/exams';
import { UNI_BENCHMARKS } from '../data/benchmarks';

interface HomeViewProps {
  onStartDiagnostic: () => void;
  onNavigate: (view: AppView) => void;
  attempts: SectionAAttempt[];
  essays: SectionBEssayRecord[];
  daysUntilDeadline: number;
}

const HERO_SAMPLE_OPTIONS = [
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

export const HomeView: React.FC<HomeViewProps> = ({
  onStartDiagnostic,
  onNavigate,
  attempts,
  essays,
  daysUntilDeadline,
}) => {
  const [selectedUni, setSelectedUni] = useState(UNI_BENCHMARKS[0].shortName);
  const [samplePick, setSamplePick] = useState<string | null>(null);

  const uni =
    UNI_BENCHMARKS.find((b) => b.shortName === selectedUni) || UNI_BENCHMARKS[0];
  const latest = attempts[0];
  const sampleResult = HERO_SAMPLE_OPTIONS.find((o) => o.letter === samplePick);

  const studioIndex: {
    num: string;
    title: string;
    blurb: string;
    meta: string;
    onClick: () => void;
  }[] = [
    {
      num: '01',
      title: 'Section A — Reading Simulator',
      blurb:
        'Pearson VUE split-screen, 3-colour Claim / Evidence / Pivot highlighter, option strike-out, confidence tags, and full review screen.',
      meta: '6 passages · 22 MCQs',
      onClick: () => onNavigate('practice'),
    },
    {
      num: '02',
      title: 'Section B — Essay Studio',
      blurb:
        '40-minute timed prompts with 5-minute planning scratchpad, live 500–600w sweet-spot telemetry, counter-argument detector, and model outlines.',
      meta: `${essays.length} saved · 3 exam sets`,
      onClick: () => onNavigate('essay'),
    },
    {
      num: '03',
      title: 'Study Plan — Day-by-Day Schedule',
      blurb:
        'Pick your Pearson VUE date and target university to get a review-first priority list and checkable daily sessions.',
      meta: 'Auto-ranked by weak skills',
      onClick: () => onNavigate('plan'),
    },
    {
      num: '04',
      title: 'Official LNAT Guide & Reading Lab',
      blurb:
        'Direct links to lnat.ac.uk practice tests, tutorial, and sample essays paired with an interactive 4-question active reading lab.',
      meta: 'Official lnat.ac.uk',
      onClick: () => onNavigate('resources'),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-24 space-y-16">
      {/* Monumental Paper-First Editorial Hero */}
      <section className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-end">
        <div className="lg:col-span-8">
          <div className="studio-kicker mb-4">
            UK Admissions Studio · Built on official lnat.ac.uk structure · Expanding to TSA, UCAT &amp; TMUA
          </div>

          <h1 className="font-display text-[3.2rem] sm:text-[4.8rem] lg:text-[5.4rem] leading-[0.92] tracking-[-0.025em] text-[var(--ink)]">
            Train for the LNAT like an{' '}
            <span className="italic text-[var(--accent)]">admissions tutor</span> reads.
          </h1>

          <p className="font-serif-passage text-lg sm:text-xl text-[var(--text-muted)] mt-6 max-w-2xl leading-relaxed">
            Dense editorial passages, Pearson VUE split-screen controls, multi-colour argument
            highlighting, live Section B telemetry, and a day-by-day countdown planner — zero
            filler, zero AI-sounding slop.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-8">
            <button
              type="button"
              onClick={onStartDiagnostic}
              className="px-6 py-3 rounded-full bg-[var(--ink)] hover:bg-[var(--accent)] text-[var(--paper)] hover:text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              Start 15-min Free Diagnostic
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('plan')}
              className="px-5 py-3 rounded-full border border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)] text-sm font-medium text-[var(--ink)] inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              Build Study Plan
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('essay')}
              className="px-3 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--ink)] inline-flex items-center gap-1 cursor-pointer"
            >
              Essay Studio
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Vertical-Ruled Monumental Countdown + Target Calibrator */}
        <div className="lg:col-span-4 lg:border-l lg:border-[var(--rule)] lg:pl-8 space-y-5">
          <div>
            <div className="font-display text-7xl sm:text-8xl leading-[0.85] tracking-[-0.04em] text-[var(--ink)] font-mono-tabular">
              {daysUntilDeadline}
            </div>
            <div className="studio-kicker mt-2.5 text-[var(--ink)]">
              Days to LNAT UCAS Deadline · 20 Jan
            </div>
            <div className="font-serif-passage text-sm text-[var(--text-muted)] mt-1">
              {latest
                ? `Latest projected score: ${latest.projected_42}/42 · ${essays.length} saved essay${essays.length === 1 ? '' : 's'}`
                : 'Oxford/Cambridge sit by 15 Oct · LSE, UCL, KCL, Durham by 20 Jan'}
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--rule)]">
            <div className="studio-kicker mb-2.5">Target Law School Band</div>
            <div className="flex flex-wrap gap-1.5">
              {UNI_BENCHMARKS.map((b) => {
                const active = b.shortName === selectedUni;
                return (
                  <button
                    key={b.shortName}
                    type="button"
                    onClick={() => setSelectedUni(b.shortName)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                      active
                        ? 'bg-[var(--ink)] text-[var(--paper)]'
                        : 'border border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {b.shortName}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-baseline justify-between text-xs">
              <span className="text-[var(--text-muted)]">Typical shortlisted band</span>
              <span className="font-mono-tabular font-semibold text-base text-[var(--ink)]">
                {uni.typicalOfferRange[0]}–{uni.typicalOfferRange[1]}
                <span className="text-xs font-normal text-[var(--text-muted)]">/42</span>
              </span>
            </div>
            <p className="font-serif-passage text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
              {uni.note}
            </p>
          </div>
        </div>
      </section>

      {/* 4-Column Ruled Specification Strip */}
      <section className="border-t border-[var(--ink)] border-b border-b-[var(--rule)] grid grid-cols-2 lg:grid-cols-4">
        <div className="py-6 pr-5">
          <div className="font-display text-5xl leading-none text-[var(--ink)] font-mono-tabular">
            95m
          </div>
          <div className="studio-kicker mt-2.5">Section A</div>
          <p className="font-serif-passage text-sm text-[var(--text-muted)] mt-1">
            42 five-option MCQs across 12 unseen argumentative passages.
          </p>
        </div>
        <div className="py-6 px-5 border-l border-[var(--rule)]">
          <div className="font-display text-5xl leading-none text-[var(--ink)] font-mono-tabular">
            40m
          </div>
          <div className="studio-kicker mt-2.5">Section B</div>
          <p className="font-serif-passage text-sm text-[var(--text-muted)] mt-1">
            1 of 3 prompts · 500–600 word sweet spot, 750-word hard cap.
          </p>
        </div>
        <div className="py-6 lg:px-5 lg:border-l border-t lg:border-t-0 border-[var(--rule)] pr-5">
          <div className="font-display text-5xl leading-none text-[var(--ink)] font-mono-tabular">
            2m15
          </div>
          <div className="studio-kicker mt-2.5">Target Pace</div>
          <p className="font-serif-passage text-sm text-[var(--text-muted)] mt-1">
            Per question average to finish with time for your Review Screen.
          </p>
        </div>
        <div className="py-6 pl-5 border-l border-t lg:border-t-0 border-[var(--rule)]">
          <div className="font-display text-5xl leading-none text-[var(--ink)] font-mono-tabular">
            04
          </div>
          <div className="studio-kicker mt-2.5">UK Test Tracks</div>
          <p className="font-serif-passage text-sm text-[var(--text-muted)] mt-1">
            LNAT live now · TSA, UCAT, and TMUA/ESAT interactive previews.
          </p>
        </div>
      </section>

      {/* Split Editorial Workbench: 30-Second Live Sample + Official 4-Question Method */}
      <section className="studio-section grid lg:grid-cols-12 gap-10">
        {/* Left: Instant Interactive Question */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="studio-kicker text-[var(--accent)]">
              30-Second Live Sample · Tone &amp; Metaphor
            </span>
            <span className="text-xs text-[var(--text-muted)]">Try without signing up</span>
          </div>

          <blockquote className="font-serif-passage text-[17px] leading-[1.7] text-[var(--ink)] pl-4 border-l-2 border-[var(--accent)] py-1">
            “When an algorithm assigns a higher recidivism score to a postcode that has long been
            heavily patrolled, it does not eliminate human bias. It{' '}
            <mark className="hl-claim font-semibold text-[var(--ink)]">launders it</mark>,
            converting a contestable pattern of enforcement into a neutral-looking decimal.”
          </blockquote>

          <div className="text-sm font-semibold text-[var(--ink)] pt-1">
            Why does the author use the verb “launders” here?
          </div>

          <div className="divide-y divide-[var(--rule)] border-t border-b border-[var(--rule)]">
            {HERO_SAMPLE_OPTIONS.map((opt) => {
              const picked = samplePick === opt.letter;
              let rowTone = 'hover:text-[var(--accent)]';
              if (samplePick) {
                if (opt.correct) rowTone = 'text-[var(--emerald)] font-medium';
                else if (picked) rowTone = 'text-[var(--crimson)]';
                else rowTone = 'text-[var(--text-muted)]';
              }
              return (
                <button
                  key={opt.letter}
                  type="button"
                  onClick={() => setSamplePick(opt.letter)}
                  className={`w-full text-left py-3 text-sm flex items-start gap-3 transition-colors cursor-pointer ${rowTone}`}
                >
                  <span className="font-mono-tabular font-semibold text-xs mt-0.5 shrink-0">
                    {opt.letter}.
                  </span>
                  <span className="flex-1">{opt.text}</span>
                  {samplePick && opt.correct && (
                    <CheckCircle2 className="w-4 h-4 text-[var(--emerald)] shrink-0 mt-0.5" />
                  )}
                  {samplePick && picked && !opt.correct && (
                    <XCircle className="w-4 h-4 text-[var(--crimson)] shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {sampleResult && (
            <div className="pt-2 flex items-start justify-between gap-4">
              <p className="font-serif-passage text-sm text-[var(--text-muted)] leading-relaxed">
                <strong
                  className={
                    sampleResult.correct ? 'text-[var(--emerald)]' : 'text-[var(--crimson)]'
                  }
                >
                  {sampleResult.correct ? 'Correct.' : 'Not quite.'}
                </strong>{' '}
                {sampleResult.why}
              </p>
              <button
                type="button"
                onClick={onStartDiagnostic}
                className="shrink-0 text-xs font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                Full diagnostic
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Official 4-Question Method */}
        <div className="lg:col-span-5 lg:border-l lg:border-[var(--rule)] lg:pl-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="studio-kicker">From official lnat.ac.uk</span>
              <a
                href="https://lnat.ac.uk/how-to-prepare/"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[var(--text-muted)] hover:text-[var(--ink)] inline-flex items-center gap-1"
              >
                Source
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <h2 className="font-display text-3xl text-[var(--ink)] leading-tight mb-5">
              The 4 questions LNAT tells every candidate to ask
            </h2>

            <div className="divide-y divide-[var(--rule)] border-t border-[var(--rule)]">
              {OFFICIAL_FOUR_QUESTIONS.map((q) => (
                <div key={q.step} className="py-3.5 flex items-start gap-3">
                  <span className="font-mono-tabular text-[11px] font-semibold text-[var(--accent)] mt-0.5">
                    {q.step}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-[var(--ink)]">{q.question}</div>
                    <p className="font-serif-passage text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
                      {q.tip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('resources')}
            className="mt-5 pt-4 border-t border-[var(--rule)] w-full text-left flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink)] hover:text-[var(--accent)] cursor-pointer group"
          >
            <span>Open Official Guide &amp; Reading Lab</span>
            <ArrowUpRight className="w-4 h-4 studio-row-arrow" />
          </button>
        </div>
      </section>

      {/* Numbered Studio Index (inspired by recall-politics's hairline numbered index) */}
      <section className="studio-section">
        <div className="flex items-end justify-between pb-4 border-b border-[var(--rule)]">
          <div>
            <div className="studio-kicker">Studio Modules</div>
            <h2 className="font-display text-4xl sm:text-5xl text-[var(--ink)] mt-1">
              Everything you need for LNAT
            </h2>
          </div>
          <span className="studio-kicker hidden sm:inline">04 workspaces</span>
        </div>

        <div>
          {studioIndex.map((item) => (
            <button
              key={item.num}
              type="button"
              onClick={item.onClick}
              className="studio-row w-full py-6 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-center text-left cursor-pointer"
            >
              <div className="md:col-span-1 font-mono-tabular text-xs text-[var(--text-muted)]">
                N — {item.num}
              </div>
              <div className="md:col-span-4 studio-row-title font-display text-2xl sm:text-3xl text-[var(--ink)] leading-tight">
                {item.title}
              </div>
              <div className="md:col-span-5 font-serif-passage text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                {item.blurb}
              </div>
              <div className="md:col-span-2 flex items-center md:justify-end justify-between gap-3">
                <span className="studio-kicker text-[10px]">{item.meta}</span>
                <ArrowUpRight className="w-5 h-5 text-[var(--ink)] studio-row-arrow shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Numbered UK Admissions Test Index */}
      <section className="studio-section">
        <div className="flex flex-wrap items-end justify-between gap-4 pb-4 border-b border-[var(--rule)]">
          <div>
            <div className="studio-kicker">Expanding Platform</div>
            <h2 className="font-display text-4xl sm:text-5xl text-[var(--ink)] mt-1">
              LNAT first. Built for all UK admissions tests.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('tests')}
            className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            Try live samples
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div>
          {EXAM_TRACKS.map((exam, idx) => (
            <button
              key={exam.id}
              type="button"
              onClick={() => onNavigate(exam.status === 'live' ? 'practice' : 'tests')}
              className="studio-row w-full py-5 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-center text-left cursor-pointer"
            >
              <div className="md:col-span-1 font-mono-tabular text-xs text-[var(--text-muted)]">
                0{idx + 1}
              </div>
              <div className="md:col-span-3 flex items-center gap-3">
                <span className="studio-row-title font-display text-3xl text-[var(--ink)]">
                  {exam.shortName}
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full ${
                    exam.status === 'live'
                      ? 'bg-[var(--emerald-soft)] text-[var(--emerald)]'
                      : 'border border-[var(--rule)] text-[var(--text-muted)]'
                  }`}
                >
                  {exam.status === 'live' ? 'Live' : 'Preview'}
                </span>
              </div>
              <div className="md:col-span-5 font-serif-passage text-sm text-[var(--text-muted)]">
                {exam.field} · {exam.universities.slice(0, 4).join(', ')}
              </div>
              <div className="md:col-span-3 flex items-center md:justify-end justify-between gap-3">
                <span className="font-mono-tabular text-xs text-[var(--text-muted)]">
                  {exam.duration}
                </span>
                <ArrowUpRight className="w-4 h-4 text-[var(--ink)] studio-row-arrow shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* High-Contrast Closing Band */}
      <section className="bg-[var(--ink)] text-[var(--paper)] px-7 sm:px-12 py-12 sm:py-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70 mb-3">
            Start in 15 minutes
          </div>
          <h2 className="font-display text-4xl sm:text-5xl leading-[0.95] text-[var(--paper)]">
            Find your projected /42 score and weak skills before your next mock.
          </h2>
          <p className="font-serif-passage text-base sm:text-lg opacity-75 mt-4">
            Works straight in your browser with automatic local progress saving and a shareable
            UK law school readiness card.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            type="button"
            onClick={onStartDiagnostic}
            className="px-6 py-3 rounded-full bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--accent)] hover:text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            Start Diagnostic
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('plan')}
            className="px-5 py-3 rounded-full border border-current/30 hover:border-current text-sm font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            Study Plan
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
