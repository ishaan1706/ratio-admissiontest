import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Clock,
  Eye,
  FileText,
  Lock,
  RotateCcw,
} from 'lucide-react';
import taraStudioRaw from '../data/packs/tara-practice/tara_essay_studio.json';

interface StudioPrompt {
  id: string;
  type: string;
  theme: string;
  statement: string;
  stem: string;
  planningGuidance: string;
  plan: {
    interpret: string;
    challenge: string;
    judge: string;
  };
}

interface StudioPromptSet {
  id: string;
  title: string;
  promptIds: string[];
}

interface StudioModel {
  id: string;
  promptId: string;
  title: string;
  wordCount: number;
  paragraphs: { text: string; annotation: string }[];
}

interface StudioRubricItem {
  id: string;
  title: string;
  anchors: {
    notYet: string;
    developing: string;
    clear: string;
  };
  nextStep: string;
}

interface RawTaraStudio {
  durationMinutes: number;
  wordLimit: number;
  answerCount: number;
  scored: boolean;
  instructions: string;
  timing: { id: string; title: string; minutes: number }[];
  rubricDisclaimer: string;
  rubric: StudioRubricItem[];
  prompts: StudioPrompt[];
  promptSets: StudioPromptSet[];
  models: StudioModel[];
}

const STUDIO_DATA = taraStudioRaw as RawTaraStudio;
const PROMPT_MAP = new Map(STUDIO_DATA.prompts.map((p) => [p.id, p]));
const MODEL_BY_PROMPT = new Map(STUDIO_DATA.models.map((m) => [m.promptId, m]));

const STUDIO_STORAGE_KEY = 'ratio_tara_studio_v1';

type RubricRating = 'notYet' | 'developing' | 'clear';

interface StudioPromptRecord {
  draft: string;
  submittedSnapshot?: string;
  submittedAt?: string;
  submittedOverLimit?: boolean;
  submittedIncomplete?: boolean;
  rubric: Record<string, RubricRating>;
  updatedAt: string;
}

function loadStudioStore(): Record<string, StudioPromptRecord> {
  try {
    const raw = localStorage.getItem(STUDIO_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveStudioStore(store: Record<string, StudioPromptRecord>) {
  try {
    localStorage.setItem(STUDIO_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore
  }
}

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function fmtClock(sec: number): string {
  const s = Math.max(0, sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

export const TaraEssayStudio: React.FC = () => {
  const [store, setStore] = useState<Record<string, StudioPromptRecord>>(() => loadStudioStore());
  const [activeSetId, setActiveSetId] = useState<string | null>(null);
  const [studioMode, setStudioMode] = useState<'timed' | 'revision'>('timed');
  const [selectedPromptId, setSelectedPromptId] = useState<string>('');
  const [secondsLeft, setSecondsLeft] = useState(STUDIO_DATA.durationMinutes * 60);
  const [timedSubmitted, setTimedSubmitted] = useState(false);
  const [expired, setExpired] = useState(false);
  const [annotationStep, setAnnotationStep] = useState(0);

  const activeSet = useMemo(
    () => STUDIO_DATA.promptSets.find((s) => s.id === activeSetId) || null,
    [activeSetId],
  );

  const setPrompts = useMemo(
    () =>
      activeSet
        ? (activeSet.promptIds.map((id) => PROMPT_MAP.get(id)).filter(Boolean) as StudioPrompt[])
        : [],
    [activeSet],
  );

  const currentPrompt = PROMPT_MAP.get(selectedPromptId) || setPrompts[0] || null;
  const currentRec: StudioPromptRecord = currentPrompt
    ? store[currentPrompt.id] || { draft: '', rubric: {}, updatedAt: '' }
    : { draft: '', rubric: {}, updatedAt: '' };
  const currentModel = currentPrompt ? MODEL_BY_PROMPT.get(currentPrompt.id) || null : null;

  const updateRecord = (promptId: string, updater: (prev: StudioPromptRecord) => StudioPromptRecord) => {
    setStore((prev) => {
      const cur = prev[promptId] || { draft: '', rubric: {}, updatedAt: '' };
      const next = {
        ...prev,
        [promptId]: { ...updater(cur), updatedAt: new Date().toISOString() },
      };
      saveStudioStore(next);
      return next;
    });
  };

  const openSet = (set: StudioPromptSet, mode: 'timed' | 'revision') => {
    setActiveSetId(set.id);
    setStudioMode(mode);
    setSelectedPromptId(set.promptIds[0] || '');
    setSecondsLeft(STUDIO_DATA.durationMinutes * 60);
    setTimedSubmitted(false);
    setExpired(false);
    setAnnotationStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const lockTimedSubmission = (wasExpired: boolean) => {
    if (!currentPrompt || timedSubmitted) return;
    const text = currentRec.draft;
    const wc = countWords(text);
    updateRecord(currentPrompt.id, (prev) => ({
      ...prev,
      submittedSnapshot: text,
      submittedAt: new Date().toISOString(),
      submittedOverLimit: wc > STUDIO_DATA.wordLimit,
      submittedIncomplete: wc < 100,
    }));
    setTimedSubmitted(true);
    setExpired(wasExpired);
  };

  // Timed 40-minute countdown
  useEffect(() => {
    if (!activeSet || studioMode !== 'timed' || timedSubmitted) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          lockTimedSubmission(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [activeSet, studioMode, timedSubmitted, currentPrompt, currentRec.draft]);

  /* ── Active Set Workspace (Timed Exam Rehearsal OR Untimed Revision) ──── */
  if (activeSet && currentPrompt) {
    const draftText =
      studioMode === 'timed' && timedSubmitted
        ? currentRec.submittedSnapshot ?? currentRec.draft
        : currentRec.draft;
    const wc = countWords(draftText);
    const overLimit = wc > STUDIO_DATA.wordLimit;
    const showStudyAids = studioMode === 'revision' || timedSubmitted;

    return (
      <div className="space-y-6">
        {/* Top Bar */}
        <div className="border border-[var(--rule)] bg-[var(--surface)] p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
              {activeSet.title} ·{' '}
              {studioMode === 'timed' ? 'Timed Rehearsal (40 min)' : 'Untimed Planning & Revision'}
            </div>
            <div className="text-[var(--text-muted)] mt-0.5">
              Choose 1 of 3 prompts · Max {STUDIO_DATA.wordLimit} words · Unscored by UAT-UK
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono-tabular">
            {studioMode === 'timed' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[var(--rule)] bg-[var(--bg)] text-[var(--ink)]">
                <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
                {fmtClock(secondsLeft)}
              </span>
            )}
            <button
              type="button"
              onClick={() => setActiveSetId(null)}
              className="px-3 py-1.5 border border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)] cursor-pointer"
            >
              All 6 Essay Sets
            </button>
          </div>
        </div>

        {/* Suggested 7 / 28 / 5 Pacing Strip */}
        <div className="grid sm:grid-cols-3 gap-2 text-xs">
          {STUDIO_DATA.timing.map((t) => (
            <div
              key={t.id}
              className="px-3.5 py-2 border border-[var(--rule)] bg-[var(--surface)] flex items-center justify-between"
            >
              <span className="text-[var(--text-muted)]">Suggested: {t.title}</span>
              <span className="font-mono-tabular text-[var(--ink)] font-semibold">
                {t.minutes} min
              </span>
            </div>
          ))}
        </div>

        {/* 3-Choice Prompt Selector */}
        <div className="space-y-2">
          <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--text-muted)]">
            Choose 1 of 3 prompts ({activeSet.title})
          </div>
          <div className="grid gap-2.5">
            {setPrompts.map((p, i) => {
              const active = p.id === currentPrompt.id;
              const hasModel = MODEL_BY_PROMPT.has(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={studioMode === 'timed' && timedSubmitted}
                  onClick={() => {
                    setSelectedPromptId(p.id);
                    setAnnotationStep(0);
                  }}
                  className={`w-full text-left p-4 border text-sm whitespace-pre-line transition-colors cursor-pointer disabled:cursor-default ${
                    active
                      ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)]'
                      : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-mono-tabular mb-1.5">
                    <span className="text-[var(--accent)]">
                      Prompt {i + 1} · {p.theme}
                    </span>
                    {hasModel && (
                      <span className="text-[10px] px-2 py-0.5 border border-[var(--accent)]/40 text-[var(--accent)]">
                        Includes Annotated Model
                      </span>
                    )}
                  </div>
                  {p.stem}
                </button>
              );
            })}
          </div>
        </div>

        {/* Draft Editor + Live Word Count */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tabular">
            <span className="text-[var(--text-muted)]">
              Draft auto-saved locally · Spellcheck disabled (exam conditions)
            </span>
            <span className={overLimit ? 'text-[var(--danger)] font-semibold' : 'text-[var(--ink)]'}>
              {wc} / {STUDIO_DATA.wordLimit} words
              {overLimit ? ' — over 750-word limit (edit down before submitting)' : ''}
            </span>
          </div>

          <textarea
            value={draftText}
            onChange={(e) =>
              updateRecord(currentPrompt.id, (prev) => ({ ...prev, draft: e.target.value }))
            }
            readOnly={studioMode === 'timed' && timedSubmitted}
            spellCheck={false}
            rows={13}
            placeholder="Write your TARA essay here (interpret the claim, challenge it, and reach a reasoned judgement)..."
            className="w-full p-4 bg-[var(--surface)] border border-[var(--rule)] text-sm text-[var(--ink)] font-serif-passage leading-relaxed focus:outline-none focus:border-[var(--accent)]"
          />

          {studioMode === 'timed' && !timedSubmitted && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <span className="text-xs text-[var(--text-muted)] inline-flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Worked plan, model answer &amp; self-review rubric
                unlock after submission.
              </span>
              <button
                type="button"
                onClick={() => lockTimedSubmission(false)}
                className="px-5 py-2.5 bg-[var(--accent)] text-[var(--accent-fg)] text-xs font-semibold cursor-pointer"
              >
                Submit &amp; Lock Timed Essay
              </button>
            </div>
          )}

          {studioMode === 'timed' && timedSubmitted && (
            <div className="p-4 border border-[var(--rule)] bg-[var(--surface)] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="font-semibold text-[var(--ink)] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[var(--accent)]" />
                  {expired ? 'Time expired — submitted snapshot locked.' : 'Timed submission locked.'}
                </div>
                {(overLimit || wc < 100) && (
                  <div className="text-amber-300 inline-flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {overLimit
                      ? `Over-limit attempt (${wc}/${STUDIO_DATA.wordLimit} words).`
                      : `Incomplete attempt (${wc} words — under 100 words).`}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setStudioMode('revision');
                  setTimedSubmitted(false);
                }}
                className="px-3.5 py-2 border border-[var(--rule)] text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Open in Revision Mode to Edit
              </button>
            </div>
          )}
        </div>

        {/* Study Aids (Hidden in timed mode until submission; visible immediately in revision mode) */}
        {showStudyAids && (
          <div className="space-y-6 pt-2">
            {/* 3-Part Worked Plan */}
            <div className="border border-[var(--rule)] bg-[var(--surface)] p-5 space-y-3">
              <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                Three-Part Plan · {currentPrompt.theme}
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {currentPrompt.planningGuidance}
              </p>
              <div className="grid md:grid-cols-3 gap-3 text-xs">
                {(
                  [
                    ['1. Interpret', currentPrompt.plan.interpret],
                    ['2. Challenge', currentPrompt.plan.challenge],
                    ['3. Judge', currentPrompt.plan.judge],
                  ] as const
                ).map(([label, text]) => (
                  <div key={label} className="p-3.5 border border-[var(--rule)] bg-[var(--bg)] space-y-1">
                    <div className="font-semibold text-[var(--ink)]">{label}</div>
                    <p className="text-[var(--text-muted)] leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Annotated Model Comparison (step-by-step annotations, excluded from word count) */}
            {currentModel && (
              <div className="border border-[var(--accent)]/40 bg-[var(--surface)] p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                      Annotated Model Answer · {currentModel.wordCount} words (annotations excluded)
                    </div>
                    <h4 className="font-display text-2xl text-[var(--ink)] mt-0.5">
                      {currentModel.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono-tabular">
                    <button
                      type="button"
                      disabled={annotationStep === 0}
                      onClick={() => setAnnotationStep((s) => Math.max(0, s - 1))}
                      className="px-2.5 py-1 border border-[var(--rule)] disabled:opacity-40 cursor-pointer"
                    >
                      Prev
                    </button>
                    <span className="text-[var(--text-muted)]">
                      Paragraph {annotationStep + 1} / {currentModel.paragraphs.length}
                    </span>
                    <button
                      type="button"
                      disabled={annotationStep + 1 >= currentModel.paragraphs.length}
                      onClick={() =>
                        setAnnotationStep((s) => Math.min(currentModel.paragraphs.length - 1, s + 1))
                      }
                      className="px-2.5 py-1 border border-[var(--rule)] disabled:opacity-40 cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentModel.paragraphs.map((para, idx) => {
                    const focused = idx === annotationStep;
                    return (
                      <div
                        key={idx}
                        onClick={() => setAnnotationStep(idx)}
                        className={`p-4 border transition-colors cursor-pointer space-y-2 ${
                          focused
                            ? 'border-[var(--accent)] bg-[var(--bg)]'
                            : 'border-[var(--rule)] bg-[var(--bg)]/50 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <p className="text-sm font-serif-passage text-[var(--ink)] leading-relaxed">
                          {para.text}
                        </p>
                        {focused && (
                          <div className="pt-2 border-t border-[var(--rule)] text-xs text-[var(--accent)] leading-relaxed">
                            <strong>Annotation (P{idx + 1}):</strong> {para.annotation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Self-Review Rubric Checklist (No Numeric Grade) */}
            <div className="border border-[var(--rule)] bg-[var(--surface)] p-5 space-y-4">
              <div>
                <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                  Self-Review Checklist (Unscored)
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {STUDIO_DATA.rubricDisclaimer}
                </p>
              </div>
              <div className="space-y-3">
                {STUDIO_DATA.rubric.map((crit) => {
                  const chosen = currentRec.rubric[crit.id];
                  return (
                    <div
                      key={crit.id}
                      className="p-4 border border-[var(--rule)] bg-[var(--bg)] space-y-2.5 text-xs"
                    >
                      <div className="font-semibold text-[var(--ink)] text-sm">{crit.title}</div>
                      <div className="grid md:grid-cols-3 gap-2">
                        {(
                          [
                            ['notYet', 'Not yet', crit.anchors.notYet],
                            ['developing', 'Developing', crit.anchors.developing],
                            ['clear', 'Clear', crit.anchors.clear],
                          ] as const
                        ).map(([key, label, desc]) => {
                          const active = chosen === key;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() =>
                                updateRecord(currentPrompt.id, (prev) => ({
                                  ...prev,
                                  rubric: { ...prev.rubric, [crit.id]: key },
                                }))
                              }
                              className={`text-left p-3 border transition-colors cursor-pointer space-y-1 ${
                                active
                                  ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)]'
                                  : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                              }`}
                            >
                              <div className="font-semibold flex items-center justify-between">
                                <span>{label}</span>
                                {active && <Check className="w-3.5 h-3.5 text-[var(--accent)]" />}
                              </div>
                              <p className="leading-relaxed">{desc}</p>
                            </button>
                          );
                        })}
                      </div>
                      {chosen && chosen !== 'clear' && (
                        <div className="text-[var(--accent)] pt-1">
                          <strong>Next revision step:</strong> {crit.nextStep}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── Essay Studio Hub (6 Three-Choice Sets) ──────────────────────────── */
  return (
    <div className="space-y-6">
      <div className="border border-[var(--rule)] bg-[var(--surface)] p-5 space-y-2">
        <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
          TARA Writing Task Studio · 18 Prompts · 6 Three-Choice Sets · 2 Annotated Models
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          {STUDIO_DATA.instructions} {STUDIO_DATA.rubricDisclaimer}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {STUDIO_DATA.promptSets.map((set) => {
          const prompts = set.promptIds.map((id) => PROMPT_MAP.get(id)).filter(Boolean) as StudioPrompt[];
          const hasModel = prompts.some((p) => MODEL_BY_PROMPT.has(p.id));
          const savedCount = prompts.filter((p) => countWords(store[p.id]?.draft || '') > 0).length;
          return (
            <div
              key={set.id}
              className="border border-[var(--rule)] bg-[var(--surface)] p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-2xl text-[var(--ink)]">{set.title}</h3>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono-tabular">
                    {hasModel && (
                      <span className="px-2 py-0.5 border border-[var(--accent)]/40 text-[var(--accent)]">
                        Annotated Model
                      </span>
                    )}
                    {savedCount > 0 && (
                      <span className="text-[var(--text-muted)]">{savedCount}/3 drafted</span>
                    )}
                  </div>
                </div>
                <ul className="space-y-1.5 text-xs text-[var(--text-muted)]">
                  {prompts.map((p, idx) => (
                    <li key={p.id} className="truncate">
                      <span className="font-mono-tabular text-[var(--accent)] mr-1.5">
                        {idx + 1}.
                      </span>
                      <span className="text-[var(--ink)]">{p.theme}:</span> {p.statement}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openSet(set, 'timed')}
                  className="flex-1 py-2 px-3 bg-[var(--accent)] text-[var(--accent-fg)] text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" /> Timed 40-Min Exam
                </button>
                <button
                  type="button"
                  onClick={() => openSet(set, 'revision')}
                  className="py-2 px-3 border border-[var(--rule)] hover:border-[var(--accent)] text-xs font-medium text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> Plan &amp; Revise
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
