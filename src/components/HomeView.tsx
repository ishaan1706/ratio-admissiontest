import React from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Flag,
  PenTool,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { AppView, SectionAAttempt, SectionBEssayRecord } from '../types';
import { UNI_BENCHMARKS } from '../data/benchmarks';

interface HomeViewProps {
  attempts: SectionAAttempt[];
  essays: SectionBEssayRecord[];
  onStartDiagnostic: () => void;
  onNavigate: (view: AppView) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  attempts,
  essays,
  onStartDiagnostic,
  onNavigate,
}) => {
  const latestAttempt = attempts[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 pb-24 md:pb-12">
      {/* Hero section */}
      <section className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-medium text-[var(--text-muted)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Editorially reviewed UK LNAT prep · Section A &amp; Section B</span>
          </div>

          <h1 className="font-serif-editorial text-3xl sm:text-5xl font-medium tracking-tight text-[var(--text)] leading-[1.12]">
            LNAT practice written like real essays, not AI filler.
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-2xl">
            Train on dense, nuanced passages in a Pearson VUE split-screen simulator—with
            five-option distractors, paragraph-referenced rationales, and a 40-minute Section B
            essay studio built for Oxford, Cambridge, LSE, UCL, and KCL applicants.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onStartDiagnostic}
              className="px-5 py-3 rounded-[8px] bg-[var(--primary-action)] hover:bg-[var(--accent-hover)] text-[var(--primary-action-fg)] text-sm font-medium inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              Take 15-min Free Diagnostic
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('essay')}
              className="px-5 py-3 rounded-[8px] border border-[var(--border-strong)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--text)] text-sm font-medium inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <PenTool className="w-4 h-4 text-[var(--accent)]" />
              Try Section B Essay Studio
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--emerald)]" />
              No sign-up needed for diagnostic
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--emerald)]" />
              Projected score out of 42 + uni benchmarks
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--emerald)]" />
              Preview mode: full bank unlocked
            </span>
          </div>
        </div>

        {/* Right summary card */}
        <div className="lg:col-span-5">
          <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3.5">
              <div>
                <h2 className="text-sm font-semibold text-[var(--text)]">
                  {latestAttempt ? 'Your Latest Diagnostic' : 'Diagnostic Preview'}
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {latestAttempt
                    ? `${latestAttempt.label} · ${new Date(latestAttempt.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                    : '3 passages · 11 questions · 15 minutes'}
                </p>
              </div>
              <span className="font-mono-tabular text-xs font-medium px-2 py-1 rounded bg-[var(--accent-soft)] text-[var(--accent)]">
                {latestAttempt ? `${latestAttempt.projected_42}/42 proj.` : 'Free'}
              </span>
            </div>

            {latestAttempt ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-[8px] bg-[var(--bg)] border border-[var(--border)]">
                    <div className="text-[11px] text-[var(--text-muted)]">Projected</div>
                    <div className="font-mono-tabular text-xl font-semibold text-[var(--text)] mt-0.5">
                      {latestAttempt.projected_42}
                      <span className="text-xs font-normal text-[var(--text-muted)]">/42</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-[8px] bg-[var(--bg)] border border-[var(--border)]">
                    <div className="text-[11px] text-[var(--text-muted)]">Accuracy</div>
                    <div className="font-mono-tabular text-xl font-semibold text-[var(--text)] mt-0.5">
                      {Math.round((latestAttempt.correct / latestAttempt.total) * 100)}%
                    </div>
                  </div>
                  <div className="p-3 rounded-[8px] bg-[var(--bg)] border border-[var(--border)]">
                    <div className="text-[11px] text-[var(--text-muted)]">Essays</div>
                    <div className="font-mono-tabular text-xl font-semibold text-[var(--text)] mt-0.5">
                      {essays.length}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('progress')}
                  className="w-full py-2.5 rounded-[6px] border border-[var(--border-strong)] hover:bg-[var(--surface-subtle)] text-sm font-medium text-[var(--text)] transition-colors cursor-pointer"
                >
                  Open full skill breakdown
                </button>
              </div>
            ) : (
              <div className="space-y-3.5 text-sm">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium text-[var(--text)]">Real LNAT pace</div>
                    <div className="text-xs text-[var(--text-muted)]">
                      Timed to match the 95-minute, 42-question Pearson VUE rhythm (~2m 15s/Q).
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium text-[var(--text)]">
                      Per-distractor rationales
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      Every option A–E explains exactly why it succeeds or fails against the text.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Flag className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium text-[var(--text)]">
                      Shareable readiness card
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      Benchmark your projected score against Oxford, Cambridge, LSE, and UCL ranges.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Core modules */}
      <section className="grid md:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => onNavigate('practice')}
          className="text-left p-5 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors space-y-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-[8px] bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
            Section A · Reading Simulator
          </h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            6 curated argumentative passages (22 MCQs) with split-screen text highlighting,
            option strike-out, flagging, and skill drills.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('essay')}
          className="text-left p-5 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors space-y-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-[8px] bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center">
            <PenTool className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
            Section B · 40-Min Essay Studio
          </h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            3 authentic 3-prompt exam sets, spellcheck-off exam mode, 5-minute planning
            scratchpad, admissions rubric, and model outlines.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('pricing')}
          className="text-left p-5 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors space-y-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-[8px] bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
            Built for Editorial Rigour
          </h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            No robotic phrasing or ambiguous answer keys. Flag any question in one click for
            editorial review, with transparent £29 one-off season pricing.
          </p>
        </button>
      </section>

      {/* UK Law Benchmarks table */}
      <section className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-serif-editorial text-xl font-medium text-[var(--text)]">
              UK Law School LNAT Reference Ranges
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Indicative Section A ranges out of 42 (national applicant mean is typically 21–22).
            </p>
          </div>
          <button
            type="button"
            onClick={onStartDiagnostic}
            className="text-xs font-medium text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            See where you stand <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg)] text-left text-xs text-[var(--text-muted)]">
                <th className="py-2.5 px-5 font-medium">University</th>
                <th className="py-2.5 px-5 font-medium text-right">Typical Offer Range</th>
                <th className="py-2.5 px-5 font-medium">Admissions Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {UNI_BENCHMARKS.map((uni) => (
                <tr key={uni.name} className="hover:bg-[var(--bg)]/60">
                  <td className="py-3 px-5 font-medium text-[var(--text)] whitespace-nowrap">
                    {uni.name}
                  </td>
                  <td className="py-3 px-5 font-mono-tabular text-right font-semibold text-[var(--accent)] whitespace-nowrap">
                    {uni.typicalOfferRange[0]}–{uni.typicalOfferRange[1]} / 42
                  </td>
                  <td className="py-3 px-5 text-xs text-[var(--text-muted)]">{uni.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
