import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import esatMocksRaw from '../data/packs/esat/esat-mocks.json';
import esatFormulaSheetsMd from '../data/packs/esat/esat-formula-sheets.md?raw';
import esatStudyPlanMd from '../data/packs/esat/esat-study-plan.md?raw';
import { AdmissionsTest } from '../data/allTests';
import { GenericAttempt, OfficialResourcesPanel } from './TestWorkspace';
import { MarkdownRenderer } from './MarkdownRenderer';
import { PearsonVueShell } from './OfficialExamChrome';
import {
  buildLeastPractisedModule,
  ESAT_MODULES_META,
  EsatModuleKey,
  EsatPracticeQuestion,
  EsatPracticeSuite,
  EsatQuestionRecord,
  loadChosenModules,
  loadEsatHistory,
  saveChosenModules,
  saveEsatHistory,
} from './EsatPracticeSuite';

interface EsatOption {
  label: string;
  text: string;
}

interface EsatQuestion {
  id: string;
  number: number;
  topic: string;
  difficulty: number;
  stem: string;
  options: EsatOption[];
  answer: string;
  explanation: string;
}

interface EsatModule {
  module: string;
  key: string;
  time_minutes: number;
  question_count: number;
  questions: EsatQuestion[];
}

interface EsatMock {
  id: string;
  title: string;
  modules: EsatModule[];
}

const ESAT_MOCKS = (esatMocksRaw as { mocks: EsatMock[] }).mocks;

interface EsatWorkspaceProps {
  test: AdmissionsTest;
  subTab: 'practice' | 'resources' | 'progress';
  attempts: GenericAttempt[];
  onSaveAttempt: (attempt: GenericAttempt) => void;
}

export const EsatWorkspace: React.FC<EsatWorkspaceProps> = ({
  test,
  subTab,
  attempts,
  onSaveAttempt,
}) => {
  const [mode, setMode] = useState<'practice' | 'mocks' | 'sheets'>('practice');
  const [activeRun, setActiveRun] = useState<{ mock: EsatMock; mod: EsatModule } | null>(null);

  // Module picker & persistent practice history
  const initialMods = loadChosenModules();
  const [chosenModules, setChosenModules] = useState<EsatModuleKey[]>(initialMods.modules);
  const [modulesConfigured, setModulesConfigured] = useState<boolean>(initialMods.configured);
  const [esatHistory, setEsatHistory] = useState<Record<string, EsatQuestionRecord>>(() =>
    loadEsatHistory()
  );

  // Exam runner state
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(40 * 60);

  // Sheets sub-view
  const [sheetTab, setSheetTab] = useState<'formulas' | 'plan'>('formulas');

  useEffect(() => {
    if (!activeRun || finished) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [activeRun, finished]);

  const handleUpdateModules = (mods: EsatModuleKey[]) => {
    const saved = saveChosenModules(mods);
    setChosenModules(saved);
    setModulesConfigured(true);
  };

  const handleRecordAnswer = (
    q: EsatPracticeQuestion,
    isCorrect: boolean,
    secondsSpent: number
  ) => {
    setEsatHistory((prev) => {
      const cur = prev[q.id];
      const next: Record<string, EsatQuestionRecord> = {
        ...prev,
        [q.id]: {
          attempts: (cur?.attempts || 0) + 1,
          correctCount: (cur?.correctCount || 0) + (isCorrect ? 1 : 0),
          lastCorrect: isCorrect,
          inMistakeQueue: isCorrect ? false : true,
          totalSeconds: (cur?.totalSeconds || 0) + secondsSpent,
          flags: cur?.flags || {},
          lastAnsweredAt: new Date().toISOString(),
        },
      };
      saveEsatHistory(next);
      return next;
    });
  };

  const handleToggleFlag = (qId: string, flag: 'tooHard' | 'revisit') => {
    setEsatHistory((prev) => {
      const cur = prev[qId] || {
        attempts: 0,
        correctCount: 0,
        lastCorrect: false,
        inMistakeQueue: false,
        totalSeconds: 0,
        flags: {},
        lastAnsweredAt: new Date().toISOString(),
      };
      const next: Record<string, EsatQuestionRecord> = {
        ...prev,
        [qId]: {
          ...cur,
          flags: { ...cur.flags, [flag]: !cur.flags?.[flag] },
        },
      };
      saveEsatHistory(next);
      return next;
    });
  };

  const startLeastPractisedMock = (moduleKey: EsatModuleKey) => {
    const mod = buildLeastPractisedModule(moduleKey, esatHistory);
    startModule(
      {
        id: `esat-least-${moduleKey}-${Date.now()}`,
        title: 'ESAT Least-Practised Mock',
        modules: [mod],
      },
      mod
    );
  };

  const startModule = (mock: EsatMock, mod: EsatModule) => {
    setActiveRun({ mock, mod });
    setQIdx(0);
    setAnswers({});
    setFlagged({});
    setFinished(false);
    setSecondsLeft(mod.time_minutes * 60);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finishModule = () => {
    if (!activeRun) return;
    const qs = activeRun.mod.questions;
    const correct = qs.filter((q) => answers[q.id] === q.answer).length;
    onSaveAttempt({
      id: `${activeRun.mock.id}-${activeRun.mod.key}-${Date.now()}`,
      testId: 'esat',
      testCode: `${activeRun.mock.title} · ${activeRun.mod.module}`,
      correct,
      total: qs.length,
      createdAt: new Date().toISOString(),
    });
    setFinished(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (subTab === 'resources') {
    return <OfficialResourcesPanel test={test} />;
  }

  if (subTab === 'progress') {
    const esatAttempts = attempts.filter((a) => a.testId === 'esat');
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-3xl text-[var(--ink)]">ESAT Progress</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Completed 27-question ESAT module sittings saved in your browser.
          </p>
        </div>
        {esatAttempts.length === 0 ? (
          <div className="border border-[var(--rule)] p-6 text-sm text-[var(--text-muted)]">
            No ESAT modules completed yet. Pick a module under Practice to begin.
          </div>
        ) : (
          <div className="border-t border-[var(--rule)] divide-y divide-[var(--rule)]">
            {esatAttempts.map((a) => (
              <div key={a.id} className="py-3.5 flex items-center justify-between text-sm">
                <div className="font-medium text-[var(--ink)]">{a.testCode}</div>
                <div className="flex items-center gap-5 font-mono-tabular">
                  <span className="text-[var(--accent)] font-semibold">
                    {a.correct} / {a.total} ({Math.round((a.correct / a.total) * 100)}%)
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ── Active 40-Min No-Calculator Module Runner ─────────────────────────── */
  if (activeRun) {
    const { mock, mod } = activeRun;
    const qs = mod.questions;

    if (finished) {
      const correct = qs.filter((q) => answers[q.id] === q.answer).length;
      const byDiff = [1, 2, 3].map((d) => {
        const sub = qs.filter((q) => q.difficulty === d);
        const right = sub.filter((q) => answers[q.id] === q.answer).length;
        return {
          label: d === 1 ? 'Core' : d === 2 ? 'Standard' : 'Hard',
          right,
          total: sub.length,
        };
      });

      return (
        <div className="space-y-8">
          <div className="border border-[var(--rule)] bg-[var(--surface)] p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                {mock.title} · {mod.module} Review
              </div>
              <div className="font-display text-4xl text-[var(--ink)] mt-1">
                {correct} / {qs.length} ({Math.round((correct / qs.length) * 100)}%)
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Raw module score (no negative marking). Official UAT-UK scores are scaled 1.0–9.0
                per module (cohort median ~4.5, 90th percentile ~7.0).
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => startModule(mock, mod)}
                className="px-4 py-2 border border-[var(--rule)] text-xs font-medium text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake
              </button>
              <button
                type="button"
                onClick={() => setActiveRun(null)}
                className="px-4 py-2 bg-[var(--ink)] text-[var(--bg)] text-xs font-semibold cursor-pointer"
              >
                All ESAT Mocks
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-2">
            {byDiff.map((d) => (
              <div
                key={d.label}
                className="border border-[var(--rule)] p-3 flex items-center justify-between text-xs"
              >
                <span className="text-[var(--text-muted)]">{d.label} questions</span>
                <span className="font-mono-tabular text-[var(--ink)] font-semibold">
                  {d.right}/{d.total}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {qs.map((q) => {
              const picked = answers[q.id];
              const isRight = picked === q.answer;
              const ansObj = q.options.find((o) => o.label === q.answer);
              return (
                <div key={q.id} className="border border-[var(--rule)] p-5 space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono-tabular">
                    <span className="text-[var(--text-muted)]">
                      Q{q.number} · Spec {q.topic} ·{' '}
                      {q.difficulty === 1 ? 'Core' : q.difficulty === 2 ? 'Standard' : 'Hard'}
                    </span>
                    <span className={isRight ? 'text-[var(--accent)]' : 'text-[var(--danger)]'}>
                      {isRight ? 'Correct' : `Picked ${picked ?? '—'} · Correct ${q.answer}`}
                    </span>
                  </div>
                  <div className="text-sm text-[var(--ink)] whitespace-pre-line leading-relaxed">
                    {q.stem}
                  </div>
                  <div className="text-xs text-[var(--accent)]">
                    Answer {q.answer}: {ansObj?.text}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    const q = qs[qIdx];
    const picked = answers[q.id];

    return (
      <PearsonVueShell
        examLabel={`ESAT — ${mock.title}`}
        sectionLabel={mod.module}
        brand="uatuk"
        questionIndex={qIdx}
        totalQuestions={qs.length}
        secondsLeft={secondsLeft}
        isFlagged={!!flagged[q.id]}
        onToggleFlag={() => setFlagged((f) => ({ ...f, [q.id]: !f[q.id] }))}
        navItems={qs.map((item, i) => ({
          index: i,
          answered: !!answers[item.id],
          flagged: !!flagged[item.id],
        }))}
        onJump={(i) => setQIdx(i)}
        onPrev={() => setQIdx((i) => Math.max(0, i - 1))}
        onNext={() => setQIdx((i) => Math.min(qs.length - 1, i + 1))}
        onFinish={finishModule}
        onExit={() => setActiveRun(null)}
        finishLabel="Finish & Score"
        noCalculatorBadge
        toolbarExtra={
          <span className="text-[11px] font-medium text-[#334155]">
            UAT-UK / Pearson VUE CBT · No calculator · No formula sheet
          </span>
        }
      >
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
          <div className="text-[15px] text-[#111827] whitespace-pre-line leading-relaxed">
            {q.stem}
          </div>

          <div className="space-y-2.5 pt-2">
            {q.options.map((opt) => {
              const selected = picked === opt.label;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.label }))}
                  className={`w-full text-left px-4 py-3 rounded border transition-colors flex items-start gap-3 cursor-pointer ${
                    selected
                      ? 'border-[#0B4F6C] bg-[#E6F2F7] text-[#111827]'
                      : 'border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#1F2937]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                      selected
                        ? 'border-[#0B4F6C] bg-[#0B4F6C] text-white'
                        : 'border-[#94A3B8] text-[#475569]'
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="text-sm leading-relaxed">{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      </PearsonVueShell>
    );
  }

  /* ── ESAT Hub (400-Q Practice Suite · 270-Q Mocks · Formula Sheets & Plan) ── */
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--rule)] pb-4">
        <div>
          <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
            ESAT · 670 ORIGINAL MCQS · 5 MODULES · 1:30/Q PACE TRACKER
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[var(--ink)] mt-0.5">
            {test.name}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {(
            [
              ['practice', 'Practice & Daily 5 (400 Qs)'],
              ['mocks', '40-Min Mocks (270 Qs)'],
              ['sheets', 'Formulas & Plan'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={`px-3 py-1.5 border cursor-pointer transition-colors ${
                mode === id
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'practice' && (
        <EsatPracticeSuite
          chosenModules={chosenModules}
          configured={modulesConfigured}
          onUpdateModules={handleUpdateModules}
          history={esatHistory}
          onRecordAnswer={handleRecordAnswer}
          onToggleFlag={handleToggleFlag}
          onStartLeastPractisedMock={startLeastPractisedMock}
          onSaveAttemptSummary={(title, correct, total) =>
            onSaveAttempt({
              id: `esat-prac-${Date.now()}`,
              testId: 'esat',
              testCode: title,
              correct,
              total,
              createdAt: new Date().toISOString(),
            })
          }
        />
      )}

      {mode === 'mocks' && (
        <div className="space-y-6">
          <div className="border border-emerald-500/30 bg-[var(--surface)] p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
              <Sparkles className="w-3.5 h-3.5" /> Adaptive Least-Practised Module Mock
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Generate a fresh 27-question, 40-minute no-calculator paper built from the questions you have attempted least across the full ESAT bank.
            </p>
            <div className="flex flex-wrap gap-2">
              {ESAT_MODULES_META.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => startLeastPractisedMock(m.key)}
                  className="px-3.5 py-2 border border-[var(--rule)] hover:border-[var(--accent)] bg-[var(--bg)] text-xs font-medium text-[var(--ink)] cursor-pointer transition-colors"
                >
                  {m.name} (27 Qs) →
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-[var(--text-muted)]">
            Pick Mathematics 1 (compulsory) plus the two modules your course requires. Each fixed mock module
            runs as an authentic 40-minute, 27-question no-calculator paper.
          </p>
          {ESAT_MOCKS.map((mock) => (
            <div
              key={mock.id}
              className="border border-[var(--rule)] bg-[var(--surface)] p-5 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-2xl text-[var(--ink)]">{mock.title}</h3>
                <span className="text-xs font-mono-tabular text-[var(--text-muted)]">
                  5 modules · 27 Qs / 40 min each
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {mock.modules.map((mod) => (
                  <button
                    key={mod.key}
                    type="button"
                    onClick={() => startModule(mock, mod)}
                    className="p-4 border border-[var(--rule)] hover:border-[var(--accent)] bg-[var(--bg)] text-left transition-colors cursor-pointer group flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono-tabular">
                        <span className="text-[var(--accent)]">{mod.time_minutes} min</span>
                        {mod.key === 'm1' && (
                          <span className="text-[var(--text-muted)]">Compulsory</span>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] mt-1">
                        {mod.module}
                      </div>
                      <div className="text-xs text-[var(--text-muted)] mt-0.5">
                        {mod.question_count} MCQs · No calculator
                      </div>
                    </div>
                    <div className="text-xs font-medium text-[var(--ink)] inline-flex items-center gap-1">
                      Start module <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === 'sheets' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setSheetTab('formulas')}
              className={`px-3 py-1.5 border cursor-pointer ${
                sheetTab === 'formulas'
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-[var(--rule)] text-[var(--text-muted)]'
              }`}
            >
              Formula &amp; Fact Sheets (All 5 Modules)
            </button>
            <button
              type="button"
              onClick={() => setSheetTab('plan')}
              className={`px-3 py-1.5 border cursor-pointer ${
                sheetTab === 'plan'
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-[var(--rule)] text-[var(--text-muted)]'
              }`}
            >
              10-Week ESAT Study Plan
            </button>
          </div>
          <div className="rounded-2xl border border-[var(--rule)] bg-[var(--surface)] p-6 sm:p-8">
            <MarkdownRenderer
              content={sheetTab === 'formulas' ? esatFormulaSheetsMd : esatStudyPlanMd}
            />
          </div>
        </div>
      )}
    </div>
  );
};
