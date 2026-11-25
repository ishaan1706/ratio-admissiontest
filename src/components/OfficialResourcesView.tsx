import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { OFFICIAL_FOUR_QUESTIONS, OFFICIAL_LNAT_RESOURCES } from '../data/exams';
import { PASSAGES } from '../data/passages';

interface OfficialResourcesViewProps {
  onStartDiagnostic: () => void;
}

const LAB_ANSWERS: Record<string, string> = {
  '01': 'Whether algorithmic risk-scoring tools make criminal sentencing fairer—or merely more uniform at the cost of transparent accountability.',
  '02': 'Proponents assume that consistency (uniform outcomes) automatically equals fairness, and that "advisory" scores leave judges genuinely free to depart.',
  '03': 'Evidence: arrest/conviction data reflects prior policing patterns (para 2); institutional/tabloid pressure creates friction against overriding high-risk scores (para 3) → Conclusion: public sentencing guidelines outperform proprietary algorithms.',
  '04': 'Counterargument: even imperfect statistical models can surface gross judicial outliers if their weights are open-source and audited by Parliament rather than proprietary.',
};

export const OfficialResourcesView: React.FC<OfficialResourcesViewProps> = ({
  onStartDiagnostic,
}) => {
  const [revealedSteps, setRevealedSteps] = useState<Record<string, boolean>>({});
  const labPassage = PASSAGES[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10 pb-24 lg:pb-14">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            <ShieldCheck className="w-4 h-4" />
            Grounded in official LNAT.ac.uk guidance
          </div>
          <h1 className="font-display text-4xl text-[var(--text)]">
            Official LNAT Resources &amp; Reading Lab
          </h1>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            The LNAT Consortium publishes an official onscreen tutorial, sample test, and two PDF
            papers with commentary. Use them first—then train daily with Ratio’s timed simulator
            and active reading drills.
          </p>
        </div>
        <button
          type="button"
          onClick={onStartDiagnostic}
          className="px-4 py-2.5 rounded-[8px] bg-[var(--primary-action)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          Launch Ratio Diagnostic <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Official Format Spec Strip */}
      <section className="grid sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-[12px] bg-[#0F172A] text-white space-y-1.5">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
            Section A · Multiple Choice
          </div>
          <div className="font-mono-tabular text-2xl font-bold text-blue-300">
            95 min · 42 Qs
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            12 argumentative passages (3–4 Qs each). Flag and review freely via the Review screen,
            but once Section B starts you cannot return.
          </p>
        </div>

        <div className="p-5 rounded-[12px] bg-[#0F172A] text-white space-y-1.5">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
            Section B · Argument Essay
          </div>
          <div className="font-mono-tabular text-2xl font-bold text-amber-300">
            40 min · 1 of 3
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Official LNAT target: 500–600 words ideal (750 max). No spellcheck. Do not click End
            Review on the Review screen until finished.
          </p>
        </div>

        <div className="p-5 rounded-[12px] bg-[#0F172A] text-white space-y-1.5">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
            2026 Test-Day Update
          </div>
          <div className="font-mono-tabular text-2xl font-bold text-emerald-300 inline-flex items-center gap-1.5">
            <Clock className="w-5 h-5" /> 2¼ Hours
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Candidates granted rest-break access arrangements now have a “Pause the Clock” control
            in Pearson VUE—walk through the official tutorial before test day.
          </p>
        </div>
      </section>

      {/* Official LNAT.ac.uk Links Grid */}
      <section className="space-y-3">
        <h2 className="font-display text-2xl text-[var(--text)]">
          Direct Official LNAT Consortium Links
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {OFFICIAL_LNAT_RESOURCES.map((res) => (
            <a
              key={res.title}
              href={res.url}
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
                    {res.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[11px] font-medium text-[var(--text-muted)]">
                    {res.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-[var(--text)] group-hover:text-[var(--accent)]">
                  {res.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {res.description}
                </p>
              </div>
              <div className="text-xs font-medium text-[var(--accent)] inline-flex items-center gap-1">
                Open on lnat.ac.uk <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Interactive 4-Question Active Reading Lab */}
      <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <div className="px-6 py-5 border-b border-[var(--border)] bg-[var(--bg)]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl text-[var(--text)]">
              Interactive Active Reading Lab
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Practise the exact four questions LNAT recommends asking of every editorial—click any
              step to compare your analysis against our model breakdown.
            </p>
          </div>
          <span className="text-xs font-mono-tabular text-[var(--accent)] inline-flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> Passage: {labPassage.title}
          </span>
        </div>

        <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border)]">
          <div className="lg:col-span-6 p-6 space-y-3 font-serif-editorial text-[15px] leading-[1.72] text-[var(--text)] max-h-[460px] overflow-y-auto exam-scroll">
            {labPassage.paragraphs.map((p, idx) => (
              <p key={idx}>
                <span className="font-mono-tabular text-[11px] text-[var(--text-muted)] mr-2">
                  [{idx + 1}]
                </span>
                {p}
              </p>
            ))}
          </div>

          <div className="lg:col-span-6 p-6 space-y-3.5">
            {OFFICIAL_FOUR_QUESTIONS.map((item) => {
              const revealed = Boolean(revealedSteps[item.step]);
              return (
                <div
                  key={item.step}
                  className="p-4 rounded-[10px] border border-[var(--border)] bg-[var(--bg)] space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono-tabular text-xs font-bold text-[var(--accent)] mt-0.5">
                        {item.step}
                      </span>
                      <div className="text-sm font-semibold text-[var(--text)]">
                        {item.question}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setRevealedSteps((prev) => ({ ...prev, [item.step]: !prev[item.step] }))
                      }
                      className="text-xs font-medium text-[var(--accent)] hover:underline inline-flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {revealed ? 'Hide' : 'Model answer'}
                    </button>
                  </div>
                  {revealed ? (
                    <div className="p-3 rounded-[8px] bg-[var(--emerald-soft)] text-xs text-[var(--text)] leading-relaxed flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[var(--emerald)] shrink-0 mt-0.5" />
                      <span>{LAB_ANSWERS[item.step]}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--text-muted)]">{item.tip}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
