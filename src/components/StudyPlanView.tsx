import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  CalendarClock,
  Check,
  Compass,
  PenTool,
  RotateCcw,
  Target,
} from 'lucide-react';
import { PASSAGES } from '../data/passages';
import { UNI_BENCHMARKS } from '../data/benchmarks';
import { AppView, LnatPassage, LnatSkill, SectionAAttempt, SectionBEssayRecord } from '../types';

interface StudyPlanViewProps {
  attempts: SectionAAttempt[];
  essays: SectionBEssayRecord[];
  onStartDiagnostic: () => void;
  onStartPassage: (passage: LnatPassage) => void;
  onStartSkill: (skill: LnatSkill) => void;
  onNavigate: (view: AppView) => void;
}

interface PlanTask {
  id: string;
  kind: 'diagnostic' | 'passage' | 'skill' | 'essay' | 'official' | 'recap';
  label: string;
  detail: string;
  passageId?: string;
  skill?: LnatSkill;
}

interface PlanDay {
  dayIndex: number;
  dateStr: string;
  heading: string;
  focus: string;
  tasks: PlanTask[];
}

const PLAN_STORAGE_KEY = 'ratio_lnat_study_plan_v1';

interface SavedPlanState {
  testDate: string;
  targetUni: string;
  done: Record<string, boolean>;
}

const ALL_SKILLS: LnatSkill[] = [
  'Inference',
  'Assumption & Flaw',
  'Main Argument',
  'Tone & Attitude',
  'Structure & Evidence',
];

function defaultTestDate(): string {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14);
  return target.toISOString().slice(0, 10);
}

function loadPlanState(): SavedPlanState {
  try {
    const raw = localStorage.getItem(PLAN_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SavedPlanState>;
      return {
        testDate: parsed.testDate || defaultTestDate(),
        targetUni: parsed.targetUni || 'Oxford',
        done: parsed.done || {},
      };
    }
  } catch {
    // ignore storage errors
  }
  return {
    testDate: defaultTestDate(),
    targetUni: 'Oxford',
    done: {},
  };
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({
  attempts,
  essays,
  onStartDiagnostic,
  onStartPassage,
  onStartSkill,
  onNavigate,
}) => {
  const [state, setState] = useState<SavedPlanState>(() => loadPlanState());

  useEffect(() => {
    try {
      localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }, [state]);

  const targetBenchmark =
    UNI_BENCHMARKS.find((b) => b.shortName === state.targetUni) || UNI_BENCHMARKS[0];

  const daysUntilTest = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(`${state.testDate}T00:00:00`);
    if (Number.isNaN(target.getTime())) return 14;
    return Math.max(0, Math.round((target.getTime() - today.getTime()) / 86400000));
  }, [state.testDate]);

  // Rank skills from weakest to strongest using real attempt history
  const skillStats = useMemo(() => {
    const agg: Record<LnatSkill, { correct: number; total: number }> = {
      Inference: { correct: 0, total: 0 },
      'Assumption & Flaw': { correct: 0, total: 0 },
      'Main Argument': { correct: 0, total: 0 },
      'Tone & Attitude': { correct: 0, total: 0 },
      'Structure & Evidence': { correct: 0, total: 0 },
    };
    for (const a of attempts) {
      for (const [k, v] of Object.entries(a.skill_breakdown || {})) {
        if (k in agg) {
          agg[k as LnatSkill].correct += v.correct;
          agg[k as LnatSkill].total += v.total;
        }
      }
    }
    return ALL_SKILLS.map((skill) => {
      const { correct, total } = agg[skill];
      const pct = total > 0 ? Math.round((correct / total) * 100) : null;
      return { skill, correct, total, pct };
    }).sort((a, b) => {
      if (a.pct === null && b.pct === null) return 0;
      if (a.pct === null) return 1;
      if (b.pct === null) return -1;
      return a.pct - b.pct;
    });
  }, [attempts]);

  const attemptedLabels = useMemo(() => new Set(attempts.map((a) => a.label)), [attempts]);

  const untouchedPassages = useMemo(
    () => PASSAGES.filter((p) => !attemptedLabels.has(p.title)),
    [attemptedLabels]
  );

  // "What to fix first" priority queue (inspired by recall-politics's review-first list)
  const priorities = useMemo(() => {
    const out: {
      tag: string;
      text: string;
      cta: string;
      onRun: () => void;
    }[] = [];

    if (attempts.length === 0) {
      out.push({
        tag: 'Baseline',
        text: 'No Section A score yet — run the 15-minute diagnostic to calibrate your projected /42 band.',
        cta: 'Start diagnostic',
        onRun: onStartDiagnostic,
      });
    } else {
      const weakest = skillStats.find((s) => s.pct !== null && s.pct < 75);
      if (weakest) {
        out.push({
          tag: weakest.skill,
          text: `Lowest accuracy at ${weakest.pct}% (${weakest.correct}/${weakest.total}) — drill this before full mocks.`,
          cta: `Drill ${weakest.skill}`,
          onRun: () => onStartSkill(weakest.skill),
        });
      }
    }

    if (essays.length === 0) {
      out.push({
        tag: 'Section B',
        text: '0 timed essays saved — complete one 40-minute essay hitting the 500–600 word sweet spot.',
        cta: 'Open Essay Studio',
        onRun: () => onNavigate('essay'),
      });
    } else if (essays.length < 3) {
      out.push({
        tag: 'Section B',
        text: `${essays.length} of 3 curated essay sets practised — add another timed response with an explicit counter-argument.`,
        cta: 'Write next essay',
        onRun: () => onNavigate('essay'),
      });
    }

    if (untouchedPassages.length > 0) {
      const nextP = untouchedPassages[0];
      out.push({
        tag: nextP.domain,
        text: `${untouchedPassages.length} of ${PASSAGES.length} passages still untouched — start "${nextP.title}".`,
        cta: 'Open passage',
        onRun: () => onStartPassage(nextP),
      });
    }

    out.push({
      tag: 'Official lnat.ac.uk',
      text: 'Walk through the Pearson VUE interface tutorial and the official 4-question reading method.',
      cta: 'Open Official Guide',
      onRun: () => onNavigate('resources'),
    });

    return out.slice(0, 4);
  }, [
    attempts.length,
    essays.length,
    onNavigate,
    onStartDiagnostic,
    onStartPassage,
    onStartSkill,
    skillStats,
    untouchedPassages,
  ]);

  // Day-by-day schedule (capped at 7 visible study days + test day so it stays crisp and actionable)
  const schedule = useMemo<PlanDay[]>(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const studyDays = Math.min(6, Math.max(1, daysUntilTest));
    const days: PlanDay[] = [];

    const orderedPassages = [
      ...untouchedPassages,
      ...PASSAGES.filter((p) => attemptedLabels.has(p.title)),
    ];

    for (let i = 0; i < studyDays; i++) {
      const d = new Date(start.getTime() + i * 86400000);
      const heading =
        i === 0
          ? 'Today'
          : i === 1
          ? 'Tomorrow'
          : d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
      const dateStr = d.toISOString().slice(0, 10);
      const passage = orderedPassages[i % orderedPassages.length];
      const skill = skillStats[i % skillStats.length].skill;

      const tasks: PlanTask[] = [];
      if (i === 0 && attempts.length === 0) {
        tasks.push({
          id: `d${i}-diag`,
          kind: 'diagnostic',
          label: 'Run 15-minute Section A Diagnostic',
          detail: 'Establish baseline /42 score and weak skill tags.',
        });
      } else {
        tasks.push({
          id: `d${i}-p-${passage.id}`,
          kind: 'passage',
          label: `Passage: ${passage.title}`,
          detail: `${passage.domain} · ${passage.wordCount}w · ${passage.questions.length} MCQs with Claim/Evidence highlighting.`,
          passageId: passage.id,
        });
      }

      tasks.push({
        id: `d${i}-sk-${skill}`,
        kind: 'skill',
        label: `Targeted drill: ${skill}`,
        detail: 'Tag every answer Sure / Unsure / Guess and read every distractor rationale.',
        skill,
      });

      if (i % 2 === 0) {
        tasks.push({
          id: `d${i}-essay`,
          kind: 'essay',
          label: '40-minute Section B timed essay',
          detail: '5 min plan + 35 min write · aim for 500–600 words with a counter-argument pivot.',
        });
      } else {
        tasks.push({
          id: `d${i}-official`,
          kind: 'official',
          label: 'Official 4-Question Reading Lab',
          detail: 'Practise issues, assumptions, evidence, and counterargument on a fresh article.',
        });
      }

      days.push({
        dayIndex: i,
        dateStr,
        heading,
        focus: i === 0 ? 'Calibration & weak skills' : `${passage.domain} + ${skill}`,
        tasks,
      });
    }

    days.push({
      dayIndex: studyDays,
      dateStr: state.testDate,
      heading: daysUntilTest === 0 ? 'Today · Test Day' : 'Test Day',
      focus: 'Light warm-up only',
      tasks: [
        {
          id: 'test-day-recap',
          kind: 'recap',
          label: 'Light recap only — no full mocks',
          detail: 'Review your saved Section B outlines, check Pearson VUE ID rules, and arrive calm.',
        },
      ],
    });

    return days;
  }, [attempts.length, attemptedLabels, daysUntilTest, skillStats, state.testDate, untouchedPassages]);

  const toggleDone = (taskId: string) => {
    setState((prev) => ({
      ...prev,
      done: { ...prev.done, [taskId]: !prev.done[taskId] },
    }));
  };

  const runTask = (task: PlanTask) => {
    if (task.kind === 'diagnostic') return onStartDiagnostic();
    if (task.kind === 'passage' && task.passageId) {
      const p = PASSAGES.find((x) => x.id === task.passageId);
      if (p) return onStartPassage(p);
    }
    if (task.kind === 'skill' && task.skill) return onStartSkill(task.skill);
    if (task.kind === 'essay') return onNavigate('essay');
    if (task.kind === 'official') return onNavigate('resources');
    onNavigate('progress');
  };

  const totalTasks = schedule.reduce((n, d) => n + d.tasks.length, 0);
  const completedTasks = schedule.reduce(
    (n, d) => n + d.tasks.filter((t) => state.done[t.id]).length,
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 pb-24 space-y-12">
      {/* Header */}
      <section className="grid lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-8">
          <div className="studio-kicker mb-3">Study Plan · Review-First Schedule</div>
          <h1 className="font-display text-5xl sm:text-6xl leading-[0.95] tracking-tight text-[var(--ink)]">
            Your LNAT countdown, <span className="italic text-[var(--accent)]">day by day.</span>
          </h1>
          <p className="font-serif-passage text-lg text-[var(--text-muted)] mt-4 max-w-2xl leading-relaxed">
            Set your booked Pearson VUE test date and target law school. Ratio ranks your weakest
            Section A skills and untouched passages first, then builds a checkable daily plan.
          </p>
        </div>

        <div className="lg:col-span-4 lg:border-l lg:border-[var(--rule)] lg:pl-7 space-y-3">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-7xl leading-none text-[var(--ink)] font-mono-tabular">
              {daysUntilTest}
            </span>
            <span className="studio-kicker">days to your test</span>
          </div>
          <div className="text-xs text-[var(--text-muted)]">
            Target: <strong className="text-[var(--ink)]">{targetBenchmark.shortName}</strong> (
            {targetBenchmark.typicalOfferRange[0]}–{targetBenchmark.typicalOfferRange[1]}/42) ·{' '}
            {completedTasks}/{totalTasks} tasks ticked
          </div>
        </div>
      </section>

      {/* Controls Strip */}
      <section className="studio-section flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2.5 text-xs">
            <span className="studio-kicker flex items-center gap-1.5">
              <CalendarClock className="w-3.5 h-3.5 text-[var(--accent)]" />
              Test Date
            </span>
            <input
              type="date"
              value={state.testDate}
              onChange={(e) => setState((prev) => ({ ...prev, testDate: e.target.value }))}
              className="px-2.5 py-1.5 border border-[var(--rule)] bg-transparent text-xs font-mono-tabular text-[var(--ink)] focus:outline-none focus:border-[var(--ink)]"
            />
          </label>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="studio-kicker flex items-center gap-1.5 mr-1">
              <Target className="w-3.5 h-3.5 text-[var(--accent)]" />
              Target
            </span>
            {UNI_BENCHMARKS.map((u) => {
              const active = u.shortName === state.targetUni;
              return (
                <button
                  key={u.shortName}
                  type="button"
                  onClick={() => setState((prev) => ({ ...prev, targetUni: u.shortName }))}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-[var(--ink)] text-[var(--paper)]'
                      : 'border border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {u.shortName}
                </button>
              );
            })}
          </div>
        </div>

        {completedTasks > 0 && (
          <button
            type="button"
            onClick={() => setState((prev) => ({ ...prev, done: {} }))}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset ticks
          </button>
        )}
      </section>

      {/* What to fix first */}
      <section className="studio-section space-y-2">
        <div className="flex items-end justify-between pb-3 border-b border-[var(--rule)]">
          <div>
            <div className="studio-kicker">Priority Queue</div>
            <h2 className="font-display text-3xl sm:text-4xl text-[var(--ink)] mt-1">
              What to fix first
            </h2>
          </div>
          <span className="studio-kicker hidden sm:inline">Auto-ranked from your attempts</span>
        </div>

        <div>
          {priorities.map((item, idx) => (
            <button
              key={`${item.tag}-${idx}`}
              type="button"
              onClick={item.onRun}
              className="studio-row w-full py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center text-left cursor-pointer"
            >
              <div className="sm:col-span-3 flex items-center gap-3">
                <span className="font-mono-tabular text-[11px] text-[var(--text-muted)]">
                  0{idx + 1} —
                </span>
                <span className="studio-row-title text-sm font-semibold text-[var(--ink)]">
                  {item.tag}
                </span>
              </div>
              <div className="sm:col-span-7 font-serif-passage text-base text-[var(--text-muted)]">
                {item.text}
              </div>
              <div className="sm:col-span-2 flex items-center sm:justify-end gap-1 text-xs font-semibold text-[var(--ink)]">
                <span className="studio-row-title">{item.cta}</span>
                <ArrowUpRight className="w-4 h-4 studio-row-arrow" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Day-by-Day Plan */}
      <section className="studio-section space-y-2">
        <div className="flex items-end justify-between pb-3 border-b border-[var(--rule)]">
          <div>
            <div className="studio-kicker">Day-by-Day Schedule</div>
            <h2 className="font-display text-3xl sm:text-4xl text-[var(--ink)] mt-1">
              Next {schedule.length} sessions
            </h2>
          </div>
          <span className="font-mono-tabular text-xs text-[var(--text-muted)]">
            {completedTasks} / {totalTasks} complete
          </span>
        </div>

        <div className="divide-y divide-[var(--rule)]">
          {schedule.map((day) => (
            <div
              key={`${day.dayIndex}-${day.dateStr}`}
              className="py-5 grid grid-cols-1 md:grid-cols-12 gap-4"
            >
              <div className="md:col-span-3">
                <div className="text-base font-semibold text-[var(--ink)]">{day.heading}</div>
                <div className="font-mono-tabular text-xs text-[var(--text-muted)] mt-0.5">
                  {day.dateStr}
                </div>
                <div className="studio-kicker text-[10px] mt-2">{day.focus}</div>
              </div>

              <div className="md:col-span-9 space-y-2.5">
                {day.tasks.map((task) => {
                  const isDone = !!state.done[task.id];
                  return (
                    <div
                      key={task.id}
                      className="flex items-start justify-between gap-3 py-1.5 group"
                    >
                      <button
                        type="button"
                        onClick={() => toggleDone(task.id)}
                        className="flex items-start gap-3 text-left cursor-pointer flex-1"
                      >
                        <span
                          className={`mt-0.5 w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
                            isDone
                              ? 'bg-[var(--ink)] border-[var(--ink)] text-[var(--paper)]'
                              : 'border-[var(--ink)] text-transparent'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                        </span>
                        <div>
                          <div
                            className={`text-sm font-medium ${
                              isDone
                                ? 'line-through text-[var(--text-muted)]'
                                : 'text-[var(--ink)]'
                            }`}
                          >
                            {task.label}
                          </div>
                          <div className="font-serif-passage text-sm text-[var(--text-muted)]">
                            {task.detail}
                          </div>
                        </div>
                      </button>

                      {task.kind !== 'recap' && (
                        <button
                          type="button"
                          onClick={() => runTask(task)}
                          className="shrink-0 px-3 py-1 rounded-full border border-[var(--rule)] hover:border-[var(--ink)] text-xs font-medium text-[var(--ink)] inline-flex items-center gap-1 cursor-pointer"
                        >
                          {task.kind === 'essay' ? (
                            <PenTool className="w-3 h-3" />
                          ) : task.kind === 'official' ? (
                            <Compass className="w-3 h-3" />
                          ) : (
                            <BookOpen className="w-3 h-3" />
                          )}
                          Open
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
