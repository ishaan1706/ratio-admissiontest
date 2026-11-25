import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  ExternalLink,
  Layers,
  PenTool,
  Sparkles,
  Target,
  XCircle,
} from 'lucide-react';
import { AppView, SectionAAttempt, SectionBEssayRecord } from '../types';
import { UNI_BENCHMARKS } from '../data/benchmarks';
import { EXAM_TRACKS, OFFICIAL_FOUR_QUESTIONS } from '../data/exams';

interface HomeViewProps {
  attempts: SectionAAttempt[];
  essays: SectionBEssayRecord[];
  onStartDiagnostic: () => void;
  onNavigate: (view: AppView) => void;
}

const HERO_SAMPLE_OPTIONS = [
  {
    letter: 'A',
    text: 'Statistical models are less consistent than individual judges.',
    correct: false,
    why: 'Misreads the concession—the author grants models can be more uniform, but argues uniformity is not fairness.',
  },
  {
    letter: 'B',
    text: 'Past policing disparities are disguised as neutral mathematical scores.',
    correct: true,
    why: 'Spot on. Converting a “contestable pattern of enforcement into a neutral-looking decimal” is the exact meaning of laundering bias.',
  },
  {
    letter: 'C',
    text: 'Software engineers intentionally fabricate crime statistics.',
    correct: false,
    why: 'Unsupported leap—the bias comes from historical arrest data, not deliberate fraud.',
  },
];

export const HomeView: React.FC<HomeViewProps> = ({
  attempts,
  essays,
  onStartDiagnostic,
  onNavigate,
}) => {
  const [selectedUniIndex, setSelectedUniIndex] = useState(0);
  const [samplePick, setSamplePick] = useState<string | null>(null);

  const selectedUni = UNI_BENCHMARKS[selectedUniIndex];
  const targetScore = selectedUni.typicalOfferRange[0];
  const targetAccuracy = Math.round((targetScore / 42) * 100);
  const latestAttempt = attempts[0];

  return (
    <div className="space-y-10 pb-24 lg:pb-14">
      {/* Dark Obsidian Command Hero */}
      <section className="bg-[#0F172A] text-white border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/8 border border-white/12 text-xs text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Built around official LNAT structure · Expanding to TSA, UCAT &amp; TMUA</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl tracking-tight leading-[1.04] text-white">
              Train for the LNAT like an{' '}
              <span className="italic text-blue-300">admissions tutor</span> reads.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Dense editorial passages, Pearson VUE split-screen controls, multi-colour argument
              highlighting, live Section B essay telemetry, and direct official{' '}
              <a
                href="https://lnat.ac.uk/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-300 hover:underline underline-offset-2"
              >
                lnat.ac.uk
              </a>{' '}
              preparation frameworks.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onStartDiagnostic}
                className="px-5 py-3 rounded-[9px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                Start 15-min Free Diagnostic
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('essay')}
                className="px-4 py-3 rounded-[9px] bg-white/8 hover:bg-white/14 border border-white/14 text-white text-sm font-medium inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <PenTool className="w-4 h-4 text-amber-300" />
                Section B Essay Studio
              </button>
              <button
                type="button"
                onClick={() => onNavigate('resources')}
                className="px-4 py-3 rounded-[9px] text-slate-300 hover:text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                Official LNAT Guide
              </button>
            </div>
          </div>

          {/* Interactive Target Uni Calibrator Card */}
          <div className="lg:col-span-5">
            <div className="rounded-[14px] bg-[#1E293B] border border-white/12 p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  <Target className="w-4 h-4 text-blue-400" />
                  Target Law School Calibrator
                </div>
                {latestAttempt && (
                  <span className="font-mono-tabular text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Your latest: {latestAttempt.projected_42}/42
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {UNI_BENCHMARKS.map((uni, i) => (
                  <button
                    key={uni.shortName}
                    type="button"
                    onClick={() => setSelectedUniIndex(i)}
                    className={`px-2.5 py-1 rounded-[7px] text-xs font-medium transition-colors cursor-pointer ${
                      i === selectedUniIndex
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-white/6 text-slate-300 hover:bg-white/12'
                    }`}
                  >
                    {uni.shortName}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-[10px] bg-[#0F172A]/80 border border-white/10">
                  <div className="text-[11px] text-slate-400">Target Band</div>
                  <div className="font-mono-tabular text-xl font-bold text-white mt-0.5">
                    {selectedUni.typicalOfferRange[0]}–{selectedUni.typicalOfferRange[1]}
                    <span className="text-xs font-normal text-slate-400">/42</span>
                  </div>
                </div>
                <div className="p-3 rounded-[10px] bg-[#0F172A]/80 border border-white/10">
                  <div className="text-[11px] text-slate-400">Min Accuracy</div>
                  <div className="font-mono-tabular text-xl font-bold text-amber-300 mt-0.5">
                    {targetAccuracy}%
                  </div>
                </div>
                <div className="p-3 rounded-[10px] bg-[#0F172A]/80 border border-white/10">
                  <div className="text-[11px] text-slate-400">Pace Limit</div>
                  <div className="font-mono-tabular text-xl font-bold text-blue-300 mt-0.5">
                    2m 15s
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{selectedUni.note}</p>

              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10">
                <span>National applicant mean: ~21–22 / 42</span>
                <span>{essays.length} saved essays</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Interactive 30-Second LNAT Taste Test */}
        <section className="grid lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                30-Second Live Sample · Tone &amp; Metaphor
              </span>
              <span className="text-[11px] font-mono-tabular text-[var(--text-muted)]">
                Try without signing up
              </span>
            </div>

            <blockquote className="p-4 rounded-[10px] bg-[var(--bg)] border-l-3 border-[var(--accent)] font-serif-editorial text-[15px] leading-relaxed text-[var(--text)]">
              “When an algorithm assigns a higher recidivism score to a postcode that has long
              been heavily patrolled, it does not eliminate human bias. It{' '}
              <span className="hl-claim font-medium">launders it</span>, converting a contestable
              pattern of enforcement into a neutral-looking decimal.”
            </blockquote>

            <div className="text-sm font-semibold text-[var(--text)]">
              Why does the author use the verb “launders” here?
            </div>

            <div className="space-y-2">
              {HERO_SAMPLE_OPTIONS.map((opt) => {
                const picked = samplePick === opt.letter;
                const showResult = samplePick !== null;
                return (
                  <button
                    key={opt.letter}
                    type="button"
                    onClick={() => setSamplePick(opt.letter)}
                    className={`w-full text-left p-3 rounded-[9px] border transition-colors cursor-pointer ${
                      showResult && opt.correct
                        ? 'border-[var(--emerald)] bg-[var(--emerald-soft)]'
                        : picked && !opt.correct
                          ? 'border-[var(--crimson)] bg-[var(--crimson-soft)]'
                          : 'border-[var(--border)] bg-[var(--bg)]/60 hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 text-sm">
                      <span className="font-mono-tabular text-xs font-bold mt-0.5 text-[var(--accent)]">
                        {opt.letter}.
                      </span>
                      <div className="flex-1">
                        <div className="text-[var(--text)] font-medium">{opt.text}</div>
                        {showResult && (picked || opt.correct) && (
                          <div className="text-xs mt-1.5 flex items-start gap-1.5 text-[var(--text-muted)]">
                            {opt.correct ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--emerald)] shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-[var(--crimson)] shrink-0 mt-0.5" />
                            )}
                            <span>{opt.why}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Official 4-Question LNAT Reading Method */}
          <div className="lg:col-span-5 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col justify-between gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ochre)]">
                  From Official LNAT.ac.uk
                </span>
                <a
                  href="https://lnat.ac.uk/how-to-prepare/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] inline-flex items-center gap-1"
                >
                  Source <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <h2 className="font-display text-2xl text-[var(--text)] leading-tight">
                The 4 questions LNAT tells every candidate to ask
              </h2>
              <div className="space-y-3">
                {OFFICIAL_FOUR_QUESTIONS.map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <span className="font-mono-tabular text-xs font-bold px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--accent)] shrink-0 mt-0.5">
                      {item.step}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text)]">
                        {item.question}
                      </div>
                      <div className="text-xs text-[var(--text-muted)] mt-0.5">{item.tip}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('resources')}
              className="w-full py-2.5 rounded-[8px] border border-[var(--border-strong)] hover:bg-[var(--surface-subtle)] text-xs font-semibold text-[var(--text)] inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Open Official LNAT Reading Lab <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Core Study Modules */}
        <section className="grid md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => onNavigate('practice')}
            className="text-left p-5 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-all space-y-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-[9px] bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-[var(--text)] group-hover:text-[var(--accent)]">
              Section A · Exam Simulator
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Multi-colour Claim / Evidence / Counter highlighting, option strike-out, confidence
              calibration, and an official Pearson-style Review screen.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('essay')}
            className="text-left p-5 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--ochre)] transition-all space-y-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-[9px] bg-[var(--ochre-soft)] text-[var(--ochre)] flex items-center justify-center">
              <PenTool className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-[var(--text)] group-hover:text-[var(--ochre)]">
              Section B · Essay Studio
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              40-minute spellcheck-off writer with live argument telemetry (500–600 word sweet
              spot, counter-argument signposting check) and model outlines.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('tests')}
            className="text-left p-5 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--emerald)] transition-all space-y-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-[9px] bg-[var(--emerald-soft)] text-[var(--emerald)] flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-[var(--text)] group-hover:text-[var(--emerald)]">
              UK Admissions Hub
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Built to grow beyond Law: LNAT is live now, with interactive previews for Oxford
              TSA, UCAT (Medicine), and TMUA / ESAT (Maths &amp; CS).
            </p>
          </button>
        </section>

        {/* Multi-Exam Roadmap Strip */}
        <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-2xl text-[var(--text)]">
                One platform across UK university admissions tests
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                LNAT is our flagship release—try interactive sample questions from our next tracks.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('tests')}
              className="text-xs font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              Explore all 4 tests <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {EXAM_TRACKS.map((track) => (
              <button
                key={track.id}
                type="button"
                onClick={() => onNavigate(track.id === 'lnat' ? 'practice' : 'tests')}
                className="text-left p-4 rounded-[10px] border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--border-strong)] transition-colors space-y-2 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono-tabular text-xs font-bold px-2 py-0.5 rounded text-white"
                    style={{ backgroundColor: track.accentColor }}
                  >
                    {track.code}
                  </span>
                  <span
                    className={`text-[11px] font-medium ${
                      track.status === 'live' ? 'text-[var(--emerald)]' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {track.status === 'live' ? 'Live now' : 'Sample ready'}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[var(--text)]">{track.field}</div>
                <div className="text-[11px] text-[var(--text-muted)] line-clamp-2">
                  {track.universities.slice(0, 4).join(', ')}
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
