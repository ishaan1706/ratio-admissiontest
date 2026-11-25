import React from 'react';
import { ArrowRight, BookOpen, Clock, Filter, Layers, Sparkles } from 'lucide-react';
import { ActiveExamConfig, LnatSkill } from '../types';
import { PASSAGES, ALL_QUESTIONS } from '../data/passages';

interface PracticeHubProps {
  onStartExam: (config: ActiveExamConfig) => void;
}

const SKILLS: LnatSkill[] = [
  'Main Argument',
  'Inference',
  'Assumption & Flaw',
  'Tone & Attitude',
  'Structure & Evidence',
];

export const PracticeHub: React.FC<PracticeHubProps> = ({ onStartExam }) => {
  const freePassageIds = PASSAGES.filter((p) => p.freeTier).map((p) => p.id);
  const allPassageIds = PASSAGES.map((p) => p.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-24 md:pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="font-serif-editorial text-3xl font-medium text-[var(--text)]">
            Section A · Critical Reading
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Pearson VUE split-screen simulator with passage highlighting, distractor strike-out,
            and paragraph-anchored explanations.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[var(--emerald-soft)] text-[var(--emerald)] text-xs font-medium shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          Preview mode: all 6 passages unlocked
        </div>
      </div>

      {/* Primary Timed Sessions */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-6 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
                Recommended start
              </span>
              <span className="font-mono-tabular text-xs text-[var(--text-muted)] inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 15 min · 11 Qs
              </span>
            </div>
            <h2 className="font-serif-editorial text-2xl font-medium text-[var(--text)]">
              Free LNAT Diagnostic
            </h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              3 passages spanning Law &amp; Tech, Constitutional Theory, and Media Privacy. Get a
              projected score out of 42, skill profile, and shareable university readiness card.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onStartExam({
                mode: 'diagnostic',
                label: 'Free LNAT Diagnostic',
                timeLimitSeconds: 15 * 60,
                passageIds: freePassageIds,
              })
            }
            className="w-full py-2.5 px-4 rounded-[8px] bg-[var(--primary-action)] hover:bg-[var(--accent-hover)] text-[var(--primary-action-fg)] text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            Start 15-min Diagnostic
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Endurance mock
              </span>
              <span className="font-mono-tabular text-xs text-[var(--text-muted)] inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 45 min · {ALL_QUESTIONS.length} Qs
              </span>
            </div>
            <h2 className="font-serif-editorial text-2xl font-medium text-[var(--text)]">
              Full Bank Half-Mock
            </h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              All 6 passages back-to-back at authentic Pearson VUE pacing (~2 min per question).
              Tests reading stamina across law, economics, bioethics, and public philosophy.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onStartExam({
                mode: 'mock',
                label: 'Full Bank Half-Mock',
                timeLimitSeconds: 45 * 60,
                passageIds: allPassageIds,
              })
            }
            className="w-full py-2.5 px-4 rounded-[8px] border border-[var(--border-strong)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--text)] text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            Start 45-min Half-Mock
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Targeted Skill Drills */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--accent)]" />
          <h2 className="font-semibold text-base text-[var(--text)]">
            Targeted Reasoning Skill Drills
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {SKILLS.map((skill) => {
            const count = ALL_QUESTIONS.filter((q) => q.skill === skill).length;
            const matchingPassages = Array.from(
              new Set(ALL_QUESTIONS.filter((q) => q.skill === skill).map((q) => q.passageId))
            );
            return (
              <button
                key={skill}
                type="button"
                onClick={() =>
                  onStartExam({
                    mode: 'drill',
                    label: `${skill} Drill`,
                    timeLimitSeconds: Math.max(8, count * 2) * 60,
                    passageIds: matchingPassages,
                    skillFilter: skill,
                  })
                }
                className="text-left p-4 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors space-y-1.5 cursor-pointer"
              >
                <div className="text-sm font-medium text-[var(--text)]">{skill}</div>
                <div className="font-mono-tabular text-xs text-[var(--text-muted)]">
                  {count} questions · {Math.max(8, count * 2)} min
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Individual Passages */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[var(--accent)]" />
          <h2 className="font-semibold text-base text-[var(--text)]">Individual Passages</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PASSAGES.map((passage, idx) => (
            <div
              key={passage.id}
              className="p-5 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono-tabular text-[var(--text-muted)]">
                    Passage {idx + 1} · {passage.domain}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      passage.freeTier
                        ? 'bg-[var(--emerald-soft)] text-[var(--emerald)]'
                        : 'bg-[var(--accent-soft)] text-[var(--accent)]'
                    }`}
                  >
                    {passage.freeTier ? 'Free' : 'Season Pass'}
                  </span>
                </div>
                <h3 className="font-serif-editorial text-lg font-medium text-[var(--text)] leading-snug">
                  {passage.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  {passage.sourceStyle} · {passage.wordCount} words · {passage.questions.length}{' '}
                  MCQs
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onStartExam({
                    mode: 'drill',
                    label: passage.title,
                    timeLimitSeconds: passage.questions.length * 150,
                    passageIds: [passage.id],
                  })
                }
                className="w-full py-2 px-3 rounded-[6px] border border-[var(--border-strong)] hover:bg-[var(--surface-subtle)] text-xs font-medium text-[var(--text)] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Practice passage
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
