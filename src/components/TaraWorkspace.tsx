import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  Clock,
  Eye,
  EyeOff,
  Flag,
  RotateCcw,
  X,
} from 'lucide-react';
import taraMocksRaw from '../data/packs/tara_mocks.json';
import taraRevisionRaw from '../data/packs/tara_revision.json';
import { AdmissionsTest } from '../data/allTests';
import { GenericAttempt, OfficialResourcesPanel } from './TestWorkspace';

interface TaraMcqQuestion {
  id: string;
  type: string;
  stem: string;
  options: Record<string, string>;
  answer: string;
  explanation: string;
}

interface TaraWritingPrompt {
  id: string;
  type: string;
  statement: string;
  stem: string;
  planningGuidance: string;
}

interface TaraModule {
  id: string;
  type: 'critical-thinking' | 'problem-solving' | 'writing-task';
  title: string;
  durationMinutes: number;
  questions?: TaraMcqQuestion[];
  prompts?: TaraWritingPrompt[];
  wordLimit?: number;
}

interface TaraMock {
  id: string;
  title: string;
  modules: TaraModule[];
}

interface TaraRevisionSection {
  id: string;
  title: string;
  skill?: string;
  body: string[];
  example?: {
    stem: string;
    answer: string;
    explanation: string;
  };
}

const TARA_MOCKS = (taraMocksRaw as { mocks: TaraMock[] }).mocks;
const TARA_REVISION = taraRevisionRaw as { title: string; sections: TaraRevisionSection[] };
const TARA_ESSAYS_KEY = 'ratio_tara_essays_v1';

interface SavedTaraEssay {
  id: string;
  mockTitle: string;
  promptStatement: string;
  body: string;
  wordCount: number;
  createdAt: string;
}

function loadTaraEssays(): SavedTaraEssay[] {
  try {
    const raw = localStorage.getItem(TARA_ESSAYS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTaraEssay(entry: SavedTaraEssay): SavedTaraEssay[] {
  const next = [entry, ...loadTaraEssays()].slice(0, 30);
  try {
    localStorage.setItem(TARA_ESSAYS_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

interface TaraWorkspaceProps {
  test: AdmissionsTest;
  subTab: 'practice' | 'resources' | 'progress';
  attempts: GenericAttempt[];
  onSaveAttempt: (attempt: GenericAttempt) => void;
}

export const TaraWorkspace: React.FC<TaraWorkspaceProps> = ({
  test,
  subTab,
  attempts,
  onSaveAttempt,
}) => {
  const [mode, setMode] = useState<'mocks' | 'revision'>('mocks');
  const [activeRun, setActiveRun] = useState<{ mock: TaraMock; mod: TaraModule } | null>(null);

  // MCQ runner state
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(40 * 60);

  // Writing runner state
  const [promptIdx, setPromptIdx] = useState(0);
  const [essayBody, setEssayBody] = useState('');
  const [writingReviewed, setWritingReviewed] = useState(false);
  const [savedEssays, setSavedEssays] = useState<SavedTaraEssay[]>(() => loadTaraEssays());

  // Revision guide state
  const [openExamples, setOpenExamples] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!activeRun || finished || writingReviewed) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [activeRun, finished, writingReviewed]);

  const startModule = (mock: TaraMock, mod: TaraModule) => {
    setActiveRun({ mock, mod });
    setQIdx(0);
    setAnswers({});
    setFlagged({});
    setFinished(false);
    setPromptIdx(0);
    setEssayBody('');
    setWritingReviewed(false);
    setSecondsLeft(mod.durationMinutes * 60);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
  };

  const finishMcq = () => {
    if (!activeRun || !activeRun.mod.questions) return;
    const qs = activeRun.mod.questions;
    const correct = qs.filter((q) => answers[q.id] === q.answer).length;
    onSaveAttempt({
      id: `${activeRun.mod.id}-${Date.now()}`,
      testId: 'tara',
      testCode: `${activeRun.mock.title} · ${activeRun.mod.title}`,
      correct,
      total: qs.length,
      createdAt: new Date().toISOString(),
    });
    setFinished(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finishWriting = () => {
    if (!activeRun || !activeRun.mod.prompts) return;
    const prompt = activeRun.mod.prompts[promptIdx];
    const wc = essayBody.trim() ? essayBody.trim().split(/\s+/).length : 0;
    if (wc > 0) {
      setSavedEssays(
        saveTaraEssay({
          id: `${prompt.id}-${Date.now()}`,
          mockTitle: activeRun.mock.title,
          promptStatement: prompt.statement,
          body: essayBody,
          wordCount: wc,
          createdAt: new Date().toISOString(),
        })
      );
    }
    setWritingReviewed(true);
  };

  const skillBreakdown = useMemo(() => {
    if (!activeRun?.mod.questions || !finished) return [];
    const map = new Map<string, { correct: number; total: number }>();
    for (const q of activeRun.mod.questions) {
      const cur = map.get(q.type) ?? { correct: 0, total: 0 };
      cur.total += 1;
      if (answers[q.id] === q.answer) cur.correct += 1;
      map.set(q.type, cur);
    }
    return Array.from(map.entries()).map(([skill, stats]) => ({ skill, ...stats }));
  }, [activeRun, finished, answers]);

  if (subTab === 'resources') {
    return <OfficialResourcesPanel test={test} />;
  }

  if (subTab === 'progress') {
    const taraAttempts = attempts.filter((a) => a.testId === 'tara');
    return (
      <div className="space-y-10">
        <div>
          <h2 className="font-display text-3xl text-[var(--ink)]">TARA Progress</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Separate raw scores out of 22 for Critical Thinking and Problem Solving, plus saved
            Writing Task responses.
          </p>
        </div>

        <section className="space-y-3">
          <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--text-muted)]">
            Completed MCQ Modules ({taraAttempts.length})
          </div>
          {taraAttempts.length === 0 ? (
            <div className="border border-[var(--rule)] p-6 text-sm text-[var(--text-muted)]">
              No TARA modules completed yet.
            </div>
          ) : (
            <div className="border-t border-[var(--rule)] divide-y divide-[var(--rule)]">
              {taraAttempts.map((a) => (
                <div key={a.id} className="py-3.5 flex items-center justify-between text-sm">
                  <div className="font-medium text-[var(--ink)]">{a.testCode}</div>
                  <div className="flex items-center gap-5 font-mono-tabular">
                    <span className="text-[var(--accent)] font-semibold">
                      {a.correct} / {a.total}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--text-muted)]">
            Saved Writing Tasks ({savedEssays.length})
          </div>
          {savedEssays.length === 0 ? (
            <div className="border border-[var(--rule)] p-6 text-sm text-[var(--text-muted)]">
              No TARA essays saved yet.
            </div>
          ) : (
            <div className="border-t border-[var(--rule)] divide-y divide-[var(--rule)]">
              {savedEssays.map((e) => (
                <div key={e.id} className="py-4 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono-tabular text-[var(--text-muted)]">
                    <span>{e.mockTitle}</span>
                    <span>
                      {e.wordCount} / 750 words · {new Date(e.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-[var(--ink)]">{e.promptStatement}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  /* ── Active Module Runner ──────────────────────────────────────────────── */
  if (activeRun) {
    const { mock, mod } = activeRun;

    // Writing Task Runner
    if (mod.type === 'writing-task' && mod.prompts) {
      const prompt = mod.prompts[promptIdx];
      const wordLimit = mod.wordLimit ?? 750;
      const wc = essayBody.trim() ? essayBody.trim().split(/\s+/).length : 0;

      return (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--rule)] pb-3 text-xs font-mono-tabular">
            <span className="text-[var(--text-muted)]">
              {mock.title} · {mod.title} · Unscored · Max {wordLimit} words
            </span>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-[var(--ink)]">
                <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
                {formatTime(secondsLeft)}
              </span>
              <button
                type="button"
                onClick={() => setActiveRun(null)}
                className="text-[var(--text-muted)] hover:text-[var(--ink)] cursor-pointer"
              >
                Exit
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--text-muted)]">
              Choose 1 of 3 prompts
            </div>
            {mod.prompts.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                disabled={writingReviewed}
                onClick={() => setPromptIdx(idx)}
                className={`w-full text-left p-4 border text-sm whitespace-pre-line transition-colors cursor-pointer ${
                  promptIdx === idx
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)]'
                    : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                }`}
              >
                <span className="font-mono-tabular text-xs text-[var(--accent)] mr-2">
                  Prompt {idx + 1}
                </span>
                {'\n'}
                {p.stem}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono-tabular">
              <span className="text-[var(--text-muted)]">Spellcheck disabled (exam conditions)</span>
              <span className={wc > wordLimit ? 'text-[var(--danger)] font-semibold' : 'text-[var(--ink)]'}>
                {wc} / {wordLimit} words
              </span>
            </div>
            <textarea
              value={essayBody}
              onChange={(e) => setEssayBody(e.target.value)}
              readOnly={writingReviewed}
              spellCheck={false}
              rows={12}
              placeholder="Write your timed TARA essay response here..."
              className="w-full p-4 bg-[var(--surface)] border border-[var(--rule)] text-sm text-[var(--ink)] font-serif-passage leading-relaxed focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          {!writingReviewed ? (
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setEssayBody('')}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--ink)] inline-flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
              <button
                type="button"
                onClick={finishWriting}
                className="px-5 py-2.5 bg-[var(--accent)] text-[var(--accent-fg)] text-xs font-semibold cursor-pointer"
              >
                Finish &amp; Reveal Planning Guidance
              </button>
            </div>
          ) : (
            <div className="border border-[var(--accent)] bg-[var(--surface)] p-5 space-y-3">
              <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                Planning Guidance · Prompt {promptIdx + 1}
              </div>
              <p className="text-sm text-[var(--ink)] leading-relaxed">{prompt.planningGuidance}</p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveRun(null)}
                  className="px-4 py-2 bg-[var(--ink)] text-[var(--bg)] text-xs font-semibold cursor-pointer"
                >
                  Back to TARA Mocks
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    // MCQ Runner (Critical Thinking / Problem Solving)
    const questions = mod.questions ?? [];
    if (finished) {
      const correct = questions.filter((q) => answers[q.id] === q.answer).length;
      return (
        <div className="space-y-8">
          <div className="border border-[var(--rule)] bg-[var(--surface)] p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                {mock.title} · {mod.title} Review
              </div>
              <div className="font-display text-4xl text-[var(--ink)] mt-1">
                {correct} / {questions.length} raw marks
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Raw practice score (1 mark per correct answer, no penalty). UAT-UK reports official
                scores separately on a 1.0–9.0 scale.
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
                All TARA Mocks
              </button>
            </div>
          </div>

          {skillBreakdown.length > 0 && (
            <div className="grid sm:grid-cols-3 gap-2">
              {skillBreakdown.map((s) => (
                <div
                  key={s.skill}
                  className="border border-[var(--rule)] p-3 flex items-center justify-between text-xs"
                >
                  <span className="text-[var(--text-muted)] capitalize">
                    {s.skill.replace(/-/g, ' ')}
                  </span>
                  <span className="font-mono-tabular text-[var(--ink)] font-semibold">
                    {s.correct}/{s.total}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const picked = answers[q.id];
              const isRight = picked === q.answer;
              return (
                <div key={q.id} className="border border-[var(--rule)] p-5 space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono-tabular">
                    <span className="text-[var(--text-muted)]">
                      Q{idx + 1} · {q.type.replace(/-/g, ' ')}
                    </span>
                    <span className={isRight ? 'text-[var(--accent)]' : 'text-[var(--danger)]'}>
                      {isRight ? 'Correct' : `Picked ${picked ?? '—'} · Correct ${q.answer}`}
                    </span>
                  </div>
                  <div className="text-sm text-[var(--ink)] whitespace-pre-line leading-relaxed">
                    {q.stem}
                  </div>
                  <div className="text-xs text-[var(--accent)]">
                    Answer {q.answer}: {q.options[q.answer]}
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

    const q = questions[qIdx];
    const picked = answers[q.id];
    const optionKeys = Object.keys(q.options);

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--rule)] pb-3 text-xs font-mono-tabular">
          <span className="text-[var(--text-muted)]">
            {mock.title} · {mod.title} · Q{qIdx + 1}/{questions.length} · No calculator
          </span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setFlagged((f) => ({ ...f, [q.id]: !f[q.id] }))}
              className={`inline-flex items-center gap-1 cursor-pointer ${
                flagged[q.id] ? 'text-[var(--gold)]' : 'text-[var(--text-muted)] hover:text-[var(--ink)]'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              {flagged[q.id] ? 'Flagged' : 'Flag'}
            </button>
            <span className="inline-flex items-center gap-1.5 text-[var(--ink)]">
              <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
              {formatTime(secondsLeft)}
            </span>
            <button
              type="button"
              onClick={() => setActiveRun(null)}
              className="text-[var(--text-muted)] hover:text-[var(--ink)] cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Question Navigator Strip */}
        <div className="flex flex-wrap gap-1">
          {questions.map((item, i) => {
            const isCur = i === qIdx;
            const isAns = !!answers[item.id];
            const isFlg = !!flagged[item.id];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setQIdx(i)}
                className={`w-7 h-7 text-[11px] font-mono-tabular border cursor-pointer transition-colors ${
                  isCur
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)] font-semibold'
                    : isFlg
                    ? 'border-[var(--gold)] text-[var(--gold)]'
                    : isAns
                    ? 'border-[var(--border-strong)] bg-[var(--surface-subtle)] text-[var(--ink)]'
                    : 'border-[var(--rule)] text-[var(--text-muted)]'
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <div className="text-sm sm:text-base text-[var(--ink)] whitespace-pre-line leading-relaxed font-serif-passage">
          {q.stem}
        </div>

        <div className="space-y-2.5">
          {optionKeys.map((key) => {
            const selected = picked === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: key }))}
                className={`w-full text-left p-4 border transition-colors flex items-start gap-3 cursor-pointer ${
                  selected
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)]'
                    : 'border-[var(--rule)] hover:border-[var(--border-strong)] text-[var(--text)]'
                }`}
              >
                <span className="font-mono-tabular text-xs text-[var(--text-muted)] mt-0.5">
                  {key}
                </span>
                <span className="text-sm leading-relaxed">{q.options[key]}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            disabled={qIdx === 0}
            onClick={() => setQIdx((i) => Math.max(0, i - 1))}
            className="px-4 py-2 border border-[var(--rule)] text-xs text-[var(--text-muted)] disabled:opacity-40 cursor-pointer"
          >
            Previous
          </button>
          {qIdx < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setQIdx((i) => i + 1)}
              className="px-5 py-2 bg-[var(--ink)] text-[var(--bg)] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={finishMcq}
              className="px-5 py-2 bg-[var(--accent)] text-[var(--accent-fg)] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              Finish &amp; Score <Check className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ── TARA Hub (3 Full Mocks + Interactive Revision Guide) ──────────────── */
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--rule)] pb-4">
        <div>
          <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
            TARA · 3 FULL MOCKS · 132 MCQS + 9 WRITING PROMPTS
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[var(--ink)] mt-0.5">
            {test.name}
          </h2>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => setMode('mocks')}
            className={`px-3 py-1.5 border cursor-pointer transition-colors ${
              mode === 'mocks'
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
            }`}
          >
            3 Full Mocks
          </button>
          <button
            type="button"
            onClick={() => setMode('revision')}
            className={`px-3 py-1.5 border cursor-pointer transition-colors ${
              mode === 'revision'
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
            }`}
          >
            TARA Revision Guide
          </button>
        </div>
      </div>

      {mode === 'revision' ? (
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-muted)]">
            Structured TARA strategy guide with worked examples for every Critical Thinking, Problem
            Solving, and Writing Task skill.
          </p>
          <div className="border-t border-[var(--rule)] divide-y divide-[var(--rule)]">
            {TARA_REVISION.sections.map((sec) => {
              const exOpen = !!openExamples[sec.id];
              return (
                <div key={sec.id} className="py-5 space-y-3">
                  <h3 className="font-display text-2xl text-[var(--ink)]">{sec.title}</h3>
                  {sec.body.map((p, idx) => (
                    <p key={idx} className="text-sm text-[var(--text)] leading-relaxed">
                      {p}
                    </p>
                  ))}
                  {sec.example && (
                    <div className="border border-[var(--rule)] bg-[var(--surface)] p-4 space-y-2.5">
                      <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                        Worked Example
                      </div>
                      <p className="text-sm text-[var(--ink)] leading-relaxed">
                        {sec.example.stem}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenExamples((prev) => ({ ...prev, [sec.id]: !prev[sec.id] }))
                        }
                        className="text-xs font-mono-tabular text-[var(--text-muted)] hover:text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        {exOpen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {exOpen ? 'Hide solution' : 'Check solution'}
                      </button>
                      {exOpen && (
                        <div className="pt-2 border-t border-[var(--rule)] space-y-1 text-xs">
                          <div className="text-[var(--accent)] font-medium">
                            Answer: {sec.example.answer}
                          </div>
                          <p className="text-[var(--text-muted)] leading-relaxed">
                            {sec.example.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-muted)]">
            Three complete original TARA papers. Each module has its own 40-minute timer (no
            calculator, no dictionary; raw MCQ scores reported separately out of 22).
          </p>
          <div className="space-y-5">
            {TARA_MOCKS.map((mock) => (
              <div key={mock.id} className="border border-[var(--rule)] bg-[var(--surface)] p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-2xl text-[var(--ink)]">{mock.title}</h3>
                  <span className="text-xs font-mono-tabular text-[var(--text-muted)]">
                    3 × 40 mins · 44 MCQs + 1 Essay
                  </span>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {mock.modules.map((mod) => (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => startModule(mock, mod)}
                      className="p-4 border border-[var(--rule)] hover:border-[var(--accent)] bg-[var(--bg)] text-left transition-colors cursor-pointer group flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="text-xs font-mono-tabular text-[var(--accent)]">
                          {mod.durationMinutes} min
                        </div>
                        <div className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] mt-1">
                          {mod.title}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">
                          {mod.questions
                            ? `${mod.questions.length} MCQs · A–E`
                            : `Choose 1 of ${mod.prompts?.length ?? 3} · max 750w`}
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
        </div>
      )}
    </div>
  );
};
