import React from 'react';
import { ArrowUpRight, Clock, Layers, Target, Zap } from 'lucide-react';
import { PASSAGES } from '../data/passages';
import { LnatPassage, SectionAAttempt, SkillTag } from '../types';

interface PracticeHubProps {
  onStartDiagnostic: () => void;
  onStartHalfMock: () => void;
  onStartPassage: (passage: LnatPassage) => void;
  onStartSkill: (skill: SkillTag) => void;
  attempts: SectionAAttempt[];
}

const SKILLS: { tag: SkillTag; desc: string }[] = [
  { tag: 'Inference', desc: 'What follows necessarily from the text without over-extrapolating.' },
  { tag: 'Assumption', desc: 'Unstated premises required for the author’s argument to hold.' },
  { tag: 'Main Argument', desc: 'Central thesis vs. concessions, illustrations, and counter-views.' },
  { tag: 'Tone & Attitude', desc: 'Register, irony, metaphor, and precise authorial stance.' },
  { tag: 'Evidence & Structure', desc: 'How examples, studies, and paragraphs function structurally.' },
];

export const PracticeHub: React.FC<PracticeHubProps> = ({
  onStartDiagnostic,
  onStartHalfMock,
  onStartPassage,
  onStartSkill,
  attempts,
}) => {
  const bestForLabel = (label: string) => {
    const matching = attempts.filter((a) => a.label === label);
    if (matching.length === 0) return null;
    return matching.reduce((best, cur) => (cur.score > best.score ? cur : best), matching[0]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 pb-24 space-y-14">
      {/* Header */}
      <section>
        <div className="studio-kicker mb-3">Section A · Multiple-Choice Simulator</div>
        <h1 className="font-display text-5xl sm:text-6xl leading-[0.95] text-[var(--ink)]">
          Argumentative passages, <span className="italic text-[var(--accent)]">Pearson VUE pace.</span>
        </h1>
        <p className="font-serif-passage text-lg text-[var(--text-muted)] mt-4 max-w-2xl leading-relaxed">
          Every passage is written and edited to mirror real LNAT prose. Click sentences to highlight
          Claims, Evidence, or Pivots, strike out distractors, and calibrate your confidence.
        </p>
      </section>

      {/* Timed Modes — Ruled 2-Column Strip */}
      <section className="border-t border-[var(--ink)] border-b border-b-[var(--rule)] grid md:grid-cols-2">
        <button
          type="button"
          onClick={onStartDiagnostic}
          className="py-7 md:pr-8 text-left group cursor-pointer flex flex-col justify-between gap-4"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="studio-kicker text-[var(--accent)] inline-flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Free Diagnostic · 15 min
              </span>
              <ArrowUpRight className="w-5 h-5 text-[var(--ink)] studio-row-arrow" />
            </div>
            <h2 className="font-display text-3xl text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors mt-2">
              15-Minute Baseline Diagnostic
            </h2>
            <p className="font-serif-passage text-sm sm:text-base text-[var(--text-muted)] mt-2 leading-relaxed">
              2 passages, 8 questions across all five LNAT skills. Outputs a projected score out of
              42 and a shareable UK law school readiness card.
            </p>
          </div>
          <div className="studio-kicker text-[10px]">
            Recommended first · 15:00 timer · 8 MCQs
          </div>
        </button>

        <button
          type="button"
          onClick={onStartHalfMock}
          className="py-7 md:pl-8 border-t md:border-t-0 md:border-l border-[var(--rule)] text-left group cursor-pointer flex flex-col justify-between gap-4"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="studio-kicker inline-flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Half-Mock · 48 min
              </span>
              <ArrowUpRight className="w-5 h-5 text-[var(--ink)] studio-row-arrow" />
            </div>
            <h2 className="font-display text-3xl text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors mt-2">
              Full 6-Passage Half-Mock
            </h2>
            <p className="font-serif-passage text-sm sm:text-base text-[var(--text-muted)] mt-2 leading-relaxed">
              All 6 curated passages and 22 questions under real LNAT pace (~2m 10s per question)
              with a full Pearson-style Review Screen before scoring.
            </p>
          </div>
          <div className="studio-kicker text-[10px]">
            Exam endurance · 48:00 timer · 22 MCQs
          </div>
        </button>
      </section>

      {/* Numbered Passage Index (recall-politics Studio-inspired hairline rows) */}
      <section className="studio-section">
        <div className="flex items-end justify-between pb-4 border-b border-[var(--rule)]">
          <div>
            <div className="studio-kicker">Passage Bank</div>
            <h2 className="font-display text-4xl text-[var(--ink)] mt-1">
              Individual Passage Drills
            </h2>
          </div>
          <span className="studio-kicker hidden sm:inline">
            {PASSAGES.length} passages · {PASSAGES.reduce((n, p) => n + p.questions.length, 0)} MCQs
          </span>
        </div>

        <div>
          {PASSAGES.map((passage, idx) => {
            const best = bestForLabel(passage.title);
            return (
              <button
                key={passage.id}
                type="button"
                onClick={() => onStartPassage(passage)}
                className="studio-row w-full py-5 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-5 items-center text-left cursor-pointer"
              >
                <div className="md:col-span-1 font-mono-tabular text-xs text-[var(--text-muted)]">
                  N — {String(idx + 1).padStart(2, '0')}
                </div>
                <div className="md:col-span-4">
                  <div className="studio-row-title font-display text-2xl sm:text-[1.75rem] leading-tight text-[var(--ink)]">
                    {passage.title}
                  </div>
                  <div className="studio-kicker text-[10px] mt-1">{passage.domain}</div>
                </div>
                <div className="md:col-span-4 font-serif-passage text-sm text-[var(--text-muted)]">
                  {passage.sourceStyle}
                </div>
                <div className="md:col-span-3 flex items-center md:justify-end justify-between gap-4">
                  <div className="flex items-center gap-3 text-xs font-mono-tabular text-[var(--text-muted)]">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {passage.readingMinutes}m
                    </span>
                    <span>{passage.questions.length} Qs</span>
                    <span
                      className={`text-[10px] uppercase tracking-[0.08em] px-2 py-0.5 rounded-full ${
                        passage.difficulty === 'Stretch'
                          ? 'bg-[var(--crimson-soft)] text-[var(--crimson)]'
                          : passage.difficulty === 'Challenging'
                          ? 'bg-[var(--amber-soft)] text-[var(--amber)]'
                          : 'bg-[var(--emerald-soft)] text-[var(--emerald)]'
                      }`}
                    >
                      {passage.difficulty}
                    </span>
                    {best && (
                      <span className="text-[var(--emerald)] font-semibold">
                        {best.score}/{best.total}
                      </span>
                    )}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[var(--ink)] studio-row-arrow shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Skill Drills — Numbered Hairline Rows */}
      <section className="studio-section">
        <div className="flex items-end justify-between pb-4 border-b border-[var(--rule)]">
          <div>
            <div className="studio-kicker inline-flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[var(--accent)]" />
              Targeted Weak-Skill Drills
            </div>
            <h2 className="font-display text-4xl text-[var(--ink)] mt-1">Drill by LNAT Skill</h2>
          </div>
          <span className="studio-kicker hidden sm:inline">05 core question types</span>
        </div>

        <div>
          {SKILLS.map((s, idx) => {
            const count = PASSAGES.flatMap((p) => p.questions).filter(
              (q) => q.skill === s.tag
            ).length;
            return (
              <button
                key={s.tag}
                type="button"
                onClick={() => onStartSkill(s.tag)}
                className="studio-row w-full py-4 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-5 items-center text-left cursor-pointer"
              >
                <div className="md:col-span-1 font-mono-tabular text-xs text-[var(--text-muted)]">
                  0{idx + 1}
                </div>
                <div className="md:col-span-3 studio-row-title text-base font-semibold text-[var(--ink)]">
                  {s.tag}
                </div>
                <div className="md:col-span-6 font-serif-passage text-sm text-[var(--text-muted)]">
                  {s.desc}
                </div>
                <div className="md:col-span-2 flex items-center md:justify-end justify-between gap-3">
                  <span className="font-mono-tabular text-xs text-[var(--text-muted)]">
                    {count} Qs
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[var(--ink)] studio-row-arrow shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
