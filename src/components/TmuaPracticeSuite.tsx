import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Eye,
  Flag,
  HelpCircle,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  XCircle,
} from 'lucide-react';
import {
  TMUA_DRILL_PACK,
  TMUA_PACK_MOCK_QUESTIONS,
} from '../data/packs/tmua-practice';
import {
  advanceSrsCleanRetry,
  loadTmuaConfidenceLog,
  loadTmuaSrs,
  saveTmuaConfidenceLog,
  saveTmuaSrs,
  scheduleSrsMiss,
  srsStageLabel,
  TMUA_CONFIDENCE_BANDS,
  TMUA_FIVE_STAGE_PLAN,
  TMUA_TECHNIQUE_META,
  TMUA_TRAP_TAXONOMY,
  TmuaConfidenceLevel,
  TmuaSrsMap,
} from '../data/packs/tmua-practice/tmuaExtras';
import {
  bankQuestions,
  dailyFive,
  firstAttemptStats,
  listReview,
  localDay,
  practiceSeconds,
  readHistory,
  recordResult,
  selectQuestions,
  TmuaDailyState,
  TmuaDrillHistory,
  TmuaDrillQuestion,
} from '../data/packs/tmua-practice/tmua_practice.mjs';

export const TMUA_HISTORY_KEY = 'ratio_tmua_drill_history_v1';
export const TMUA_DAILY_KEY = 'ratio_tmua_daily_v1';
const TMUA_ACTIVE_SESSION_KEY = 'ratio_tmua_active_session_v1';

interface ActiveDrillSession {
  id: string;
  label: string;
  kind: 'daily' | 'custom' | 'retry';
  dailyDay?: string;
  timed: boolean;
  deadlineMs: number | null;
  totalSeconds: number;
  questionIds: string[];
  firstAttemptSnapshot: Record<string, boolean>; // true if unseen before session started
  currentIndex: number;
  answers: Record<string, number>;
  navFlagged: Record<string, boolean>;
  guessed: Record<string, boolean>;
  assisted: Record<string, boolean>;
  reasons: Record<string, string | null>;
  notes: Record<string, string>;
  confidence?: Record<string, TmuaConfidenceLevel>;
  committed: Record<string, boolean>; // for untimed per-question commit
  submitted: boolean;
  submittedAt: string | null;
}

function safeReadStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeWriteStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage errors never block practice
  }
}

function safeRemoveStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

function formatClock(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

export function loadTmuaHistory(): TmuaDrillHistory {
  const raw = safeReadStorage(TMUA_HISTORY_KEY);
  return readHistory(raw ?? '');
}

export function saveTmuaHistory(history: TmuaDrillHistory): void {
  safeWriteStorage(TMUA_HISTORY_KEY, JSON.stringify(history));
}

interface TmuaPracticeSuiteProps {
  view: 'skills' | 'techniques' | 'bank' | 'review';
  history: TmuaDrillHistory;
  onUpdateHistory: (next: TmuaDrillHistory) => void;
  onOpenPrimer: (lessonId: string) => void;
}

export const TmuaPracticeSuite: React.FC<TmuaPracticeSuiteProps> = ({
  view,
  history,
  onUpdateHistory,
  onOpenPrimer,
}) => {
  const drillQuestions = useMemo(() => bankQuestions(TMUA_DRILL_PACK), []);
  const allKnownQuestions = useMemo(
    () => [...drillQuestions, ...TMUA_PACK_MOCK_QUESTIONS],
    [drillQuestions]
  );
  const questionById = useMemo(() => {
    const map = new Map<string, TmuaDrillQuestion>();
    for (const q of allKnownQuestions) map.set(q.id, q);
    return map;
  }, [allKnownQuestions]);

  // Daily 5 state — persisted before starting so IDs stay stable across reloads
  const [daily, setDaily] = useState<TmuaDailyState>(() => {
    let saved: Partial<TmuaDailyState> | null = null;
    try {
      const raw = safeReadStorage(TMUA_DAILY_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch {
      saved = null;
    }
    const next = dailyFive(TMUA_DRILL_PACK, history, localDay(), saved);
    safeWriteStorage(TMUA_DAILY_KEY, JSON.stringify(next));
    return next;
  });

  // Custom set builder filters
  const [paperFilter, setPaperFilter] = useState<'all' | 1 | 2>('all');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 1 | 2 | 3 | 4 | 5>('all');
  const [countChoice, setCountChoice] = useState<5 | 10 | 20>(5);
  const [timedChoice, setTimedChoice] = useState<boolean>(true);
  const [adaptiveChoice, setAdaptiveChoice] = useState<boolean>(true);
  const [seedNonce, setSeedNonce] = useState<number>(1);
  const [dailyTimed, setDailyTimed] = useState<boolean>(true);

  // Spaced-repetition 1 / 3 / 7-day mistake mastery state
  const [srs, setSrs] = useState<TmuaSrsMap>(() => loadTmuaSrs());

  // Technique Index & Question Bank filter state
  const [techPaper, setTechPaper] = useState<'all' | 1 | 2>('all');
  const [techQuery, setTechQuery] = useState<string>('');
  const [bankPaper, setBankPaper] = useState<'all' | 1 | 2>('all');
  const [bankDiff, setBankDiff] = useState<'all' | 1 | 2 | 3 | 4 | 5>('all');
  const [bankStatus, setBankStatus] = useState<'all' | 'unseen' | 'queued' | 'secure'>('all');
  const [bankQuery, setBankQuery] = useState<string>('');
  const [bankLimit, setBankLimit] = useState<number>(40);

  // Active session — restored from localStorage so tab switches / reloads don't lose a timed set
  const [session, setSession] = useState<ActiveDrillSession | null>(() => {
    try {
      const raw = safeReadStorage(TMUA_ACTIVE_SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as ActiveDrillSession;
      if (!parsed || !Array.isArray(parsed.questionIds) || parsed.questionIds.length === 0
        || parsed.questionIds.some((id) => !questionById.has(id))) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const autoSubmittedRef = useRef<string | null>(null);

  // Persist active session
  useEffect(() => {
    if (session) {
      safeWriteStorage(TMUA_ACTIVE_SESSION_KEY, JSON.stringify(session));
    } else {
      safeRemoveStorage(TMUA_ACTIVE_SESSION_KEY);
    }
  }, [session]);

  // Timer tick for active timed session
  useEffect(() => {
    if (!session || !session.timed || session.submitted || !session.deadlineMs) return;
    const id = window.setInterval(() => setNowMs(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [session?.id, session?.timed, session?.submitted, session?.deadlineMs]);

  const remainingSeconds = useMemo(() => {
    if (!session || !session.timed || !session.deadlineMs) return 0;
    return Math.max(0, Math.ceil((session.deadlineMs - nowMs) / 1000));
  }, [session, nowMs]);

  // All skills list (filtered by paperFilter)
  const availableSkills = useMemo(() => {
    return TMUA_DRILL_PACK.modules
      .filter((m) => paperFilter === 'all' || m.paperNumber === paperFilter)
      .flatMap((m) =>
        m.skills.map((s) => ({
          ...s,
          paperNumber: m.paperNumber,
        }))
      );
  }, [paperFilter]);

  // Reset skillFilter if paper changed and skill no longer matches
  useEffect(() => {
    if (skillFilter !== 'all' && !availableSkills.some((s) => s.id === skillFilter)) {
      setSkillFilter('all');
    }
  }, [availableSkills, skillFilter]);

  // Preview custom set roster before starting
  const previewQuestions = useMemo(() => {
    const seed = `tmua-${localDay()}-${paperFilter}-${skillFilter}-${difficultyFilter}-${countChoice}-${adaptiveChoice ? 'adp' : 'std'}-${seedNonce}`;
    return selectQuestions(TMUA_DRILL_PACK, history, {
      count: countChoice,
      paper: paperFilter === 'all' ? undefined : paperFilter,
      skill: skillFilter === 'all' ? undefined : skillFilter,
      difficulty: difficultyFilter === 'all' ? null : difficultyFilter,
      seed,
      adaptive: adaptiveChoice,
    });
  }, [history, paperFilter, skillFilter, difficultyFilter, countChoice, adaptiveChoice, seedNonce]);

  const reviewQueue = useMemo(
    () => listReview(allKnownQuestions, history),
    [allKnownQuestions, history]
  );

  const skillStats = useMemo(
    () => firstAttemptStats(drillQuestions, history),
    [drillQuestions, history]
  );

  const totalFirstAttempted = useMemo(
    () => Object.values(skillStats).reduce((acc, s) => acc + s.total, 0),
    [skillStats]
  );
  const totalFirstCorrect = useMemo(
    () => Object.values(skillStats).reduce((acc, s) => acc + s.correct, 0),
    [skillStats]
  );
  const totalFirstSecure = useMemo(
    () => Object.values(skillStats).reduce((acc, s) => acc + s.secure, 0),
    [skillStats]
  );

  const commitSessionBatch = (targetSession: ActiveDrillSession, atIso: string) => {
    let nextHist = history;
    let nextSrs = srs;
    const confAdditions: Array<{ qid: string; topic: string; paper: 1 | 2; conf: TmuaConfidenceLevel; correct: boolean; at: string }> = [];
    for (const qid of targetSession.questionIds) {
      if (targetSession.committed[qid]) continue;
      const q = questionById.get(qid);
      if (!q) continue;
      const sel = targetSession.answers[qid] ?? null;
      const isGuessed = Boolean(targetSession.guessed[qid]);
      const isAssisted = Boolean(targetSession.assisted[qid]);
      nextHist = recordResult(nextHist, q, {
        selected: sel,
        guessed: isGuessed,
        assisted: isAssisted,
        at: atIso,
        reason: targetSession.reasons[qid] ?? (sel == null && targetSession.timed ? 'time' : null),
        note: targetSession.notes[qid] ?? '',
      });
      const isCleanCorrect = sel === q.answer && !isGuessed && !isAssisted;
      if (!isCleanCorrect) {
        nextSrs = scheduleSrsMiss(nextSrs, qid, atIso);
      } else if (nextSrs[qid]) {
        nextSrs = advanceSrsCleanRetry(nextSrs, qid, atIso);
      }
      const confVal = targetSession.confidence?.[qid];
      if (confVal && sel !== null) {
        confAdditions.push({
          qid,
          topic: q.topic,
          paper: q.tags.includes('paper-2') ? 2 : 1,
          conf: confVal,
          correct: sel === q.answer,
          at: atIso,
        });
      }
    }
    if (confAdditions.length > 0) {
      saveTmuaConfidenceLog([...loadTmuaConfidenceLog(), ...confAdditions]);
    }
    onUpdateHistory(nextHist);
    saveTmuaHistory(nextHist);
    setSrs(nextSrs);
    saveTmuaSrs(nextSrs);

    if (targetSession.kind === 'daily' && targetSession.dailyDay) {
      const updatedDaily: TmuaDailyState = {
        day: targetSession.dailyDay,
        ids: targetSession.questionIds.slice(),
        complete: true,
      };
      setDaily((prev) => (prev.day === updatedDaily.day ? updatedDaily : prev));
      safeWriteStorage(TMUA_DAILY_KEY, JSON.stringify(updatedDaily));
    }

    const allCommitted: Record<string, boolean> = { ...targetSession.committed };
    for (const qid of targetSession.questionIds) allCommitted[qid] = true;

    setSession({
      ...targetSession,
      committed: allCommitted,
      submitted: true,
      submittedAt: atIso,
    });
  };

  // Auto-submit timed set once at expiry
  useEffect(() => {
    if (!session || !session.timed || session.submitted || !session.deadlineMs) return;
    if (remainingSeconds <= 0 && autoSubmittedRef.current !== session.id) {
      autoSubmittedRef.current = session.id;
      commitSessionBatch(session, new Date().toISOString());
    }
  }, [remainingSeconds, session]);

  const startSession = (
    qs: TmuaDrillQuestion[],
    opts: { label: string; kind: 'daily' | 'custom' | 'retry'; timed: boolean; dailyDay?: string }
  ) => {
    if (qs.length === 0) return;
    const totalSeconds = practiceSeconds(Math.min(20, qs.length));
    const snapshot: Record<string, boolean> = {};
    for (const q of qs) {
      snapshot[q.id] = !history.first[q.id];
    }
    const now = Date.now();
    setNowMs(now);
    autoSubmittedRef.current = null;
    setSession({
      id: `tmua-sess-${now}`,
      label: opts.label,
      kind: opts.kind,
      dailyDay: opts.dailyDay,
      timed: opts.timed,
      deadlineMs: opts.timed ? now + totalSeconds * 1000 : null,
      totalSeconds,
      questionIds: qs.map((q) => q.id),
      firstAttemptSnapshot: snapshot,
      currentIndex: 0,
      answers: {},
      navFlagged: {},
      guessed: {},
      assisted: {},
      reasons: {},
      notes: {},
      committed: {},
      submitted: false,
      submittedAt: null,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startDaily = () => {
    // Re-persist daily IDs before starting
    safeWriteStorage(TMUA_DAILY_KEY, JSON.stringify(daily));
    const qs = daily.ids
      .map((id) => questionById.get(id))
      .filter((q): q is TmuaDrillQuestion => Boolean(q));
    startSession(qs, {
      label: `Daily 5 · ${daily.day}`,
      kind: 'daily',
      timed: dailyTimed,
      dailyDay: daily.day,
    });
  };

  const commitUntimedQuestion = (q: TmuaDrillQuestion) => {
    if (!session || session.committed[q.id]) return;
    const sel = session.answers[q.id];
    if (sel === undefined) return;
    const atIso = new Date().toISOString();
    const isGuessed = Boolean(session.guessed[q.id]);
    const isAssisted = Boolean(session.assisted[q.id]);
    const nextHist = recordResult(history, q, {
      selected: sel,
      guessed: isGuessed,
      assisted: isAssisted,
      at: atIso,
      reason: session.reasons[q.id] ?? null,
      note: session.notes[q.id] ?? '',
    });
    onUpdateHistory(nextHist);
    saveTmuaHistory(nextHist);
    const isCleanCorrect = sel === q.answer && !isGuessed && !isAssisted;
    const nextSrs = !isCleanCorrect
      ? scheduleSrsMiss(srs, q.id, atIso)
      : srs[q.id]
      ? advanceSrsCleanRetry(srs, q.id, atIso)
      : srs;
    if (nextSrs !== srs) {
      setSrs(nextSrs);
      saveTmuaSrs(nextSrs);
    }
    const confVal = session.confidence?.[q.id];
    if (confVal) {
      saveTmuaConfidenceLog([
        ...loadTmuaConfidenceLog(),
        {
          qid: q.id,
          topic: q.topic,
          paper: q.tags.includes('paper-2') ? 2 : 1,
          conf: confVal,
          correct: sel === q.answer,
          at: atIso,
        },
      ]);
    }

    const nextCommitted = { ...session.committed, [q.id]: true };
    const allDone = session.questionIds.every((id) => nextCommitted[id]);
    if (allDone && session.kind === 'daily' && session.dailyDay) {
      const updatedDaily: TmuaDailyState = {
        day: session.dailyDay,
        ids: session.questionIds.slice(),
        complete: true,
      };
      setDaily((prev) => (prev.day === updatedDaily.day ? updatedDaily : prev));
      safeWriteStorage(TMUA_DAILY_KEY, JSON.stringify(updatedDaily));
    }
    setSession({
      ...session,
      committed: nextCommitted,
      submitted: allDone,
      submittedAt: allDone ? atIso : session.submittedAt,
    });
  };

  // Update post-commit metadata (guessed toggle, mistake reason, note) without recording a new attempt
  const updateCommittedMetadata = (
    qid: string,
    patch: { guessed?: boolean; reason?: string | null; note?: string }
  ) => {
    if (!session) return;
    const nextSession: ActiveDrillSession = {
      ...session,
      guessed: patch.guessed !== undefined ? { ...session.guessed, [qid]: patch.guessed } : session.guessed,
      reasons: patch.reason !== undefined ? { ...session.reasons, [qid]: patch.reason } : session.reasons,
      notes: patch.note !== undefined ? { ...session.notes, [qid]: patch.note } : session.notes,
    };
    setSession(nextSession);

    if (!session.committed[qid]) return;
    const existingLatest = history.latest[qid];
    if (!existingLatest) return;

    const updatedOutcome = {
      ...existingLatest,
      guessed:
        patch.guessed !== undefined
          ? existingLatest.status !== 'unanswered' && patch.guessed
          : existingLatest.guessed,
      reason: patch.reason !== undefined ? patch.reason : existingLatest.reason,
      note: patch.note !== undefined ? patch.note.slice(0, 500) : existingLatest.note,
    };

    const nextFirst = { ...history.first };
    if (session.firstAttemptSnapshot[qid] && nextFirst[qid]?.at === existingLatest.at) {
      nextFirst[qid] = updatedOutcome;
    }
    const nextLatest = { ...history.latest, [qid]: updatedOutcome };
    const nextQueue = { ...history.queue };
    if (updatedOutcome.status === 'correct' && !updatedOutcome.guessed && !updatedOutcome.assisted) {
      delete nextQueue[qid];
    } else {
      nextQueue[qid] = updatedOutcome;
    }
    const nextHist: TmuaDrillHistory = {
      version: 1,
      first: nextFirst,
      latest: nextLatest,
      queue: nextQueue,
    };
    onUpdateHistory(nextHist);
    saveTmuaHistory(nextHist);
  };

  /* ── Active Drill / Retry Session Runner ──────────────────────────────── */
  if (session) {
    const qs = session.questionIds
      .map((id) => questionById.get(id))
      .filter((q): q is TmuaDrillQuestion => Boolean(q));

    if (session.submitted) {
      const correctCount = qs.filter((q) => session.answers[q.id] === q.answer).length;
      const unansweredCount = qs.filter((q) => session.answers[q.id] === undefined).length;
      const guessedCount = qs.filter((q) => session.guessed[q.id]).length;

      return (
        <div className="space-y-6">
          <div className="border border-[var(--rule)] bg-[var(--surface)] p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                {session.label} · Review &amp; Mistake Tagging
              </div>
              <div className="font-display text-4xl text-[var(--ink)] mt-1">
                {correctCount} / {qs.length} ({Math.round((correctCount / Math.max(1, qs.length)) * 100)}%)
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Raw practice mark (unanswered: {unansweredCount}, marked as guess: {guessedCount}).
                Tag mistake reasons or flag lucky guesses below — tagged items stay in Mistake Review until solved cleanly.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSession(null)}
              className="px-4 py-2 bg-[var(--ink)] text-[var(--bg)] text-xs font-semibold cursor-pointer"
            >
              Done &amp; Return
            </button>
          </div>

          <div className="space-y-4">
            {qs.map((q, idx) => {
              const picked = session.answers[q.id];
              const isCorrect = picked === q.answer;
              const isUnanswered = picked === undefined;
              const isGuessed = Boolean(session.guessed[q.id]);
              const reason = session.reasons[q.id] ?? '';
              const note = session.notes[q.id] ?? '';
              const wasReview = !session.firstAttemptSnapshot[q.id];
              const p2Skill = TMUA_DRILL_PACK.modules[1].skills.find((s) => s.id === q.type);

              return (
                <div key={q.id} className="border border-[var(--rule)] bg-[var(--surface)] p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tabular">
                    <div className="flex flex-wrap items-center gap-2 text-[var(--text-muted)]">
                      <span className="text-[var(--ink)] font-semibold">Q{idx + 1}</span>
                      <span>· {q.topic}</span>
                      <span>· L{q.difficulty} ({TMUA_DRILL_PACK.difficultyLabels[String(q.difficulty)]})</span>
                      {wasReview && (
                        <span className="px-1.5 py-0.5 border border-[var(--rule)] text-[10px] uppercase text-[var(--text-muted)]">
                          Reattempt
                        </span>
                      )}
                      {session.navFlagged[q.id] && (
                        <span className="px-1.5 py-0.5 border border-amber-500/40 text-amber-400 text-[10px] uppercase">
                          Flagged
                        </span>
                      )}
                    </div>
                    <span
                      className={
                        isCorrect && !isGuessed
                          ? 'text-[var(--accent)] font-semibold'
                          : isCorrect && isGuessed
                          ? 'text-amber-400 font-semibold'
                          : 'text-[var(--crimson)] font-semibold'
                      }
                    >
                      {isCorrect ? (isGuessed ? 'Correct (Guessed → Review)' : 'Correct') : isUnanswered ? 'Unanswered (→ Review)' : 'Incorrect (→ Review)'}
                    </span>
                  </div>

                  <div className="text-sm text-[var(--ink)] leading-relaxed whitespace-pre-line">
                    {q.stem}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2 text-xs">
                    <div className="border border-[var(--rule)] bg-[var(--bg)] px-3 py-2">
                      <span className="text-[var(--text-muted)]">Your answer: </span>
                      <span className="text-[var(--ink)] font-medium break-words">
                        {isUnanswered
                          ? 'Unanswered'
                          : `${String.fromCharCode(65 + picked)} — ${q.options[picked]}`}
                      </span>
                    </div>
                    <div className="border border-[var(--accent)]/40 bg-[var(--accent)]/5 px-3 py-2">
                      <span className="text-[var(--text-muted)]">Correct key: </span>
                      <span className="text-[var(--accent)] font-semibold break-words">
                        {String.fromCharCode(65 + q.answer)} — {q.options[q.answer]}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-[var(--text-muted)] leading-relaxed whitespace-pre-line border-l-2 border-[var(--accent)]/50 pl-3">
                    {q.explanation}
                  </div>

                  <div className="pt-2 border-t border-[var(--rule)] flex flex-wrap items-center gap-3 text-xs">
                    {isCorrect && (
                      <label className="inline-flex items-center gap-1.5 text-[var(--ink)] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isGuessed}
                          onChange={(e) =>
                            updateCommittedMetadata(q.id, { guessed: e.target.checked })
                          }
                          className="accent-emerald-500"
                        />
                        <span>Mark as guess (add to Mistake Review)</span>
                      </label>
                    )}

                    <select
                      aria-label={`Mistake reason for Q${idx + 1}`}
                      value={reason}
                      onChange={(e) =>
                        updateCommittedMetadata(q.id, {
                          reason: e.target.value || null,
                        })
                      }
                      className="bg-[var(--bg)] border border-[var(--rule)] px-2.5 py-1 text-xs text-[var(--ink)]"
                    >
                      <option value="">Tag reason (optional)</option>
                      {TMUA_DRILL_PACK.mistakeReasons.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={note}
                      onChange={(e) => updateCommittedMetadata(q.id, { note: e.target.value })}
                      placeholder="Short note (failed assumption or faster method)..."
                      className="flex-1 min-w-[200px] bg-[var(--bg)] border border-[var(--rule)] px-2.5 py-1 text-xs text-[var(--ink)]"
                    />

                    {p2Skill?.lessonId && (
                      <button
                        type="button"
                        onClick={() => {
                          setSession(null);
                          onOpenPrimer(p2Skill.lessonId!);
                        }}
                        className="text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" /> Primer
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    const q = qs[session.currentIndex];
    if (!q) return null;
    const isCommitted = Boolean(session.committed[q.id]);
    const picked = session.answers[q.id];
    const isReviewItem = !session.firstAttemptSnapshot[q.id];

    return (
      <div className="space-y-5">
        {/* Session Header Bar */}
        <div className="border border-[var(--rule)] bg-[var(--surface)] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono-tabular">
            <span className="text-[var(--accent)] font-semibold uppercase tracking-wider">
              {session.label}
            </span>
            <span className="text-[var(--text-muted)]">
              Q{session.currentIndex + 1} / {qs.length}
            </span>
            <span className="px-2 py-0.5 border border-[var(--rule)] text-[var(--ink)]">
              {q.tags.includes('paper-2') ? 'Paper 2' : 'Paper 1'}
            </span>
            {isReviewItem && (
              <span className="px-2 py-0.5 border border-amber-500/40 text-amber-400">
                Review
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {session.timed && (
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 border font-mono-tabular text-xs font-semibold ${
                  remainingSeconds <= 120
                    ? 'border-[var(--crimson)] text-[var(--crimson)]'
                    : 'border-[var(--rule)] text-[var(--ink)]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {formatClock(remainingSeconds)}
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                if (session.timed) {
                  commitSessionBatch(session, new Date().toISOString());
                } else {
                  setSession(null);
                }
              }}
              className="px-3 py-1.5 bg-[var(--ink)] text-[var(--bg)] text-xs font-semibold cursor-pointer"
            >
              {session.timed ? 'Submit Set' : 'Exit Set'}
            </button>
          </div>
        </div>

        {/* Question Navigator Pills */}
        <div className="flex flex-wrap gap-1.5">
          {qs.map((item, i) => {
            const hasAns = session.answers[item.id] !== undefined;
            const isNavFlag = Boolean(session.navFlagged[item.id]);
            const isGuess = Boolean(session.guessed[item.id]);
            const done = Boolean(session.committed[item.id]);
            const isCurr = i === session.currentIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSession({ ...session, currentIndex: i })}
                className={`w-8 h-8 text-xs font-mono-tabular border cursor-pointer relative transition-colors ${
                  isCurr
                    ? 'border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)] font-semibold'
                    : done
                    ? session.answers[item.id] === item.answer
                      ? 'border-[var(--accent)]/50 text-[var(--accent)]'
                      : 'border-[var(--crimson)]/50 text-[var(--crimson)]'
                    : hasAns
                    ? 'border-[var(--ink)]/50 text-[var(--ink)] bg-[var(--surface)]'
                    : 'border-[var(--rule)] text-[var(--text-muted)]'
                }`}
                title={`Q${i + 1}${isNavFlag ? ' (Flagged)' : ''}${isGuess ? ' (Guess)' : ''}`}
              >
                {i + 1}
                {isNavFlag && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Question Card */}
        <div className="border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs font-mono-tabular text-[var(--accent)] uppercase tracking-wider">
              {q.topic} · Level {q.difficulty} ({TMUA_DRILL_PACK.difficultyLabels[String(q.difficulty)]})
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() =>
                  setSession({
                    ...session,
                    navFlagged: { ...session.navFlagged, [q.id]: !session.navFlagged[q.id] },
                  })
                }
                className={`px-2.5 py-1 border inline-flex items-center gap-1 cursor-pointer ${
                  session.navFlagged[q.id]
                    ? 'border-amber-400 text-amber-400 bg-amber-400/10'
                    : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                }`}
              >
                <Flag className="w-3 h-3" /> {session.navFlagged[q.id] ? 'Flagged' : 'Flag to return'}
              </button>
              <button
                type="button"
                onClick={() =>
                  updateCommittedMetadata(q.id, { guessed: !session.guessed[q.id] })
                }
                className={`px-2.5 py-1 border inline-flex items-center gap-1 cursor-pointer ${
                  session.guessed[q.id]
                    ? 'border-sky-400 text-sky-400 bg-sky-400/10'
                    : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                }`}
              >
                <HelpCircle className="w-3 h-3" /> {session.guessed[q.id] ? 'Marked as guess' : 'Mark as guess'}
              </button>
            </div>
          </div>

          <div className="text-[15px] text-[var(--ink)] leading-relaxed whitespace-pre-line break-words">
            {q.stem}
          </div>

          <div className="space-y-2.5">
            {q.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isPicked = picked === idx;
              const isKey = idx === q.answer;
              let cls =
                'border-[var(--rule)] bg-[var(--bg)] hover:border-[var(--ink)]/40 text-[var(--ink)]';
              if (!session.timed && isCommitted) {
                if (isKey) {
                  cls = 'border-[var(--accent)] bg-[var(--accent)]/12 text-[var(--ink)]';
                } else if (isPicked && !isKey) {
                  cls = 'border-[var(--crimson)] bg-[var(--crimson)]/10 text-[var(--ink)]';
                }
              } else if (isPicked) {
                cls = 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--ink)]';
              }
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={!session.timed && isCommitted}
                  onClick={() =>
                    setSession({
                      ...session,
                      answers: { ...session.answers, [q.id]: idx },
                    })
                  }
                  className={`w-full text-left px-4 py-3 border transition-colors flex items-start gap-3 cursor-pointer disabled:cursor-default ${cls}`}
                >
                  <span
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono-tabular font-bold shrink-0 mt-0.5 ${
                      isPicked
                        ? 'border-[var(--accent)] bg-[var(--accent)] text-[#04130d]'
                        : 'border-[var(--rule)] text-[var(--text-muted)]'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="text-sm leading-relaxed whitespace-pre-line break-words">
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Confidence Calibration Selector (Guess 30% / Unsure 60% / Sure 90%) */}
          {(!isCommitted || session.timed) && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--rule)]/70">
              <span className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--text-muted)]">
                Confidence calibration (optional)
              </span>
              <div className="flex items-center gap-1.5">
                {TMUA_CONFIDENCE_BANDS.map((band) => {
                  const active = session.confidence?.[q.id] === band.p;
                  return (
                    <button
                      key={band.label}
                      type="button"
                      onClick={() =>
                        setSession({
                          ...session,
                          confidence: { ...(session.confidence ?? {}), [q.id]: band.p },
                          guessed:
                            band.p === 0.3
                              ? { ...session.guessed, [q.id]: true }
                              : session.guessed,
                        })
                      }
                      className={`px-2.5 py-1 text-[11px] font-mono-tabular border cursor-pointer transition-colors ${
                        active
                          ? 'border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)] font-semibold'
                          : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                      }`}
                    >
                      {band.label} · {band.pct}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Untimed peek / commit controls */}
          {!session.timed && !isCommitted && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--rule)]">
              <button
                type="button"
                onClick={() =>
                  setSession({
                    ...session,
                    assisted: { ...session.assisted, [q.id]: true },
                  })
                }
                className="text-xs text-[var(--text-muted)] hover:text-[var(--ink)] inline-flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                {session.assisted[q.id] ? 'Solution peeked (marked assisted)' : 'Peek explanation (marks assisted)'}
              </button>
              <button
                type="button"
                disabled={picked === undefined}
                onClick={() => commitUntimedQuestion(q)}
                className="px-4 py-2 bg-[var(--accent)] text-[#04130d] text-xs font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Check Answer
              </button>
            </div>
          )}

          {/* Untimed peeked explanation BEFORE committing */}
          {!session.timed && !isCommitted && session.assisted[q.id] && (
            <div className="border border-amber-500/40 bg-amber-500/5 p-4 text-xs text-[var(--text-muted)] leading-relaxed whitespace-pre-line">
              <div className="font-semibold text-amber-400 mb-1">
                Assisted explanation (this attempt will stay in Mistake Review)
              </div>
              {q.explanation}
            </div>
          )}

          {/* Untimed immediate explanation AFTER committing */}
          {!session.timed && isCommitted && (
            <div className="border-t border-[var(--rule)] pt-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold">
                {picked === q.answer ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                    <span className="text-[var(--accent)]">
                      {session.guessed[q.id]
                        ? 'Correct (marked as guess — added to Mistake Review)'
                        : session.assisted[q.id]
                        ? 'Correct (assisted — stays in Mistake Review)'
                        : 'Correct!'}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-[var(--crimson)]" />
                    <span className="text-[var(--crimson)]">
                      Incorrect — Answer is {String.fromCharCode(65 + q.answer)} ({q.options[q.answer]})
                    </span>
                  </>
                )}
              </div>
              <div className="text-xs text-[var(--text-muted)] leading-relaxed whitespace-pre-line">
                {q.explanation}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                <select
                  value={session.reasons[q.id] ?? ''}
                  onChange={(e) =>
                    updateCommittedMetadata(q.id, { reason: e.target.value || null })
                  }
                  className="bg-[var(--bg)] border border-[var(--rule)] px-2.5 py-1 text-xs text-[var(--ink)]"
                >
                  <option value="">Tag reason (optional)</option>
                  {TMUA_DRILL_PACK.mistakeReasons.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={session.notes[q.id] ?? ''}
                  onChange={(e) => updateCommittedMetadata(q.id, { note: e.target.value })}
                  placeholder="Personal note..."
                  className="flex-1 min-w-[200px] bg-[var(--bg)] border border-[var(--rule)] px-2.5 py-1 text-xs text-[var(--ink)]"
                />
              </div>
            </div>
          )}

          {/* Prev / Next Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--rule)] text-xs">
            <button
              type="button"
              disabled={session.currentIndex === 0}
              onClick={() =>
                setSession({ ...session, currentIndex: Math.max(0, session.currentIndex - 1) })
              }
              className="px-3 py-1.5 border border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)] disabled:opacity-40 cursor-pointer"
            >
              ← Previous
            </button>
            {session.currentIndex < qs.length - 1 ? (
              <button
                type="button"
                onClick={() =>
                  setSession({
                    ...session,
                    currentIndex: Math.min(qs.length - 1, session.currentIndex + 1),
                  })
                }
                className="px-3 py-1.5 border border-[var(--accent)] text-[var(--accent)] font-medium cursor-pointer"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => commitSessionBatch(session, new Date().toISOString())}
                className="px-4 py-1.5 bg-[var(--accent)] text-[#04130d] font-semibold cursor-pointer"
              >
                Finish &amp; Review
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Technique Index (46 Method Families) ─────────────────────────────── */
  if (view === 'techniques') {
    const qLower = techQuery.trim().toLowerCase();
    const groups = new Map<
      string,
      {
        family: string;
        paper: 1 | 2;
        topic: string;
        type: string;
        questions: TmuaDrillQuestion[];
        tried: number;
        secure: number;
        queued: number;
      }
    >();
    for (const q of drillQuestions) {
      const paper: 1 | 2 = q.tags.includes('paper-2') ? 2 : 1;
      if (techPaper !== 'all' && paper !== techPaper) continue;
      let g = groups.get(q.family);
      if (!g) {
        g = {
          family: q.family,
          paper,
          topic: q.topic,
          type: q.type,
          questions: [],
          tried: 0,
          secure: 0,
          queued: 0,
        };
        groups.set(q.family, g);
      }
      g.questions.push(q);
      const latest = history.latest[q.id];
      if (latest) {
        g.tried++;
        if (latest.status === 'correct' && !latest.guessed && !latest.assisted) g.secure++;
      }
      if (history.queue[q.id]) g.queued++;
    }
    const list = Array.from(groups.values()).filter((g) => {
      if (!qLower) return true;
      const meta = TMUA_TECHNIQUE_META[g.family];
      return (
        g.family.toLowerCase().includes(qLower) ||
        g.topic.toLowerCase().includes(qLower) ||
        (meta?.title.toLowerCase().includes(qLower) ?? false) ||
        (meta?.spec.toLowerCase().includes(qLower) ?? false) ||
        (meta?.idea.toLowerCase().includes(qLower) ?? false)
      );
    });

    return (
      <div className="space-y-6">
        <div className="border border-[var(--rule)] bg-[var(--surface)] p-5 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
              Technique Index · 46 Method Families (24 Paper 1 · 22 Paper 2)
            </div>
            <h3 className="font-display text-2xl text-[var(--ink)]">
              Browse by the exact method that cracks the question
            </h3>
            <p className="text-xs text-[var(--text-muted)] max-w-2xl">
              Every family contains 10 original no-calculator variants. Pick a method below to drill 5 or all 10 variants until the pattern is automatic.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(['all', 1, 2] as const).map((p) => (
              <button
                key={String(p)}
                type="button"
                onClick={() => setTechPaper(p)}
                className={`px-3 py-1.5 text-xs font-mono-tabular border cursor-pointer ${
                  techPaper === p
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] font-semibold'
                    : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                }`}
              >
                {p === 'all' ? 'All (46)' : p === 1 ? 'Paper 1 (24)' : 'Paper 2 (22)'}
              </button>
            ))}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={techQuery}
                onChange={(e) => setTechQuery(e.target.value)}
                placeholder="Filter by method or spec (MM1, Arg2...)"
                className="bg-[var(--bg)] border border-[var(--rule)] pl-8 pr-3 py-1.5 text-xs text-[var(--ink)] w-64"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {list.map((g) => {
            const meta = TMUA_TECHNIQUE_META[g.family];
            const pct = Math.round((g.secure / Math.max(1, g.questions.length)) * 100);
            return (
              <div
                key={g.family}
                className="border border-[var(--rule)] bg-[var(--surface)] p-4 flex flex-col justify-between gap-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono-tabular">
                    <span className="text-[var(--accent)]">
                      Paper {g.paper} · {meta?.spec ?? g.type} · L{g.questions[0]?.difficulty ?? 3}
                    </span>
                    <span className="text-[var(--text-muted)]">
                      {g.secure}/{g.questions.length} secure
                      {g.queued > 0 ? ` · ${g.queued} queued` : ''}
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-[var(--ink)]">
                    {meta?.title ?? g.family}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {meta?.idea ?? g.topic}
                  </p>
                  <div className="h-1 bg-[var(--bg)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent)] transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] text-[var(--text-muted)] truncate">{g.topic}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        startSession(g.questions.slice(0, 5), {
                          label: `Technique · ${meta?.title ?? g.family} (5 Qs)`,
                          kind: 'custom',
                          timed: false,
                        })
                      }
                      className="px-2.5 py-1 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)]/10 text-[11px] font-semibold cursor-pointer"
                    >
                      Drill 5
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        startSession(g.questions, {
                          label: `Technique · ${meta?.title ?? g.family} (${g.questions.length} Qs)`,
                          kind: 'custom',
                          timed: true,
                        })
                      }
                      className="px-2.5 py-1 border border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)] text-[11px] cursor-pointer"
                    >
                      Timed 10
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── Searchable 460-Q Question Bank ───────────────────────────────────── */
  if (view === 'bank') {
    const qLower = bankQuery.trim().toLowerCase();
    const filtered = drillQuestions.filter((q) => {
      const paper: 1 | 2 = q.tags.includes('paper-2') ? 2 : 1;
      if (bankPaper !== 'all' && paper !== bankPaper) return false;
      if (bankDiff !== 'all' && q.difficulty !== bankDiff) return false;
      const latest = history.latest[q.id];
      const isQueued = Boolean(history.queue[q.id]);
      const isSecure = Boolean(latest && latest.status === 'correct' && !latest.guessed && !latest.assisted);
      if (bankStatus === 'unseen' && latest) return false;
      if (bankStatus === 'queued' && !isQueued) return false;
      if (bankStatus === 'secure' && !isSecure) return false;
      if (qLower) {
        const meta = TMUA_TECHNIQUE_META[q.family];
        const hit =
          q.stem.toLowerCase().includes(qLower) ||
          q.topic.toLowerCase().includes(qLower) ||
          q.family.toLowerCase().includes(qLower) ||
          (meta?.title.toLowerCase().includes(qLower) ?? false) ||
          (meta?.spec.toLowerCase().includes(qLower) ?? false);
        if (!hit) return false;
      }
      return true;
    });
    const visible = filtered.slice(0, bankLimit);

    return (
      <div className="space-y-5">
        <div className="border border-[var(--rule)] bg-[var(--surface)] p-5 space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                Original TMUA Question Bank · {filtered.length} / {drillQuestions.length} shown
              </div>
              <h3 className="font-display text-2xl text-[var(--ink)] mt-0.5">
                Filter &amp; play any drill on the spot
              </h3>
            </div>
            {filtered.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  startSession(filtered.slice(0, 10), {
                    label: `Bank Set (${Math.min(10, filtered.length)} Qs)`,
                    kind: 'custom',
                    timed: false,
                  })
                }
                className="px-4 py-2 bg-[var(--accent)] text-[#04130d] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" /> Play Top {Math.min(10, filtered.length)} Filtered
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={bankQuery}
                onChange={(e) => {
                  setBankQuery(e.target.value);
                  setBankLimit(40);
                }}
                placeholder="Search stem, topic, technique..."
                className="w-full bg-[var(--bg)] border border-[var(--rule)] pl-8 pr-2.5 py-2 text-xs text-[var(--ink)]"
              />
            </div>
            <select
              value={String(bankPaper)}
              onChange={(e) => {
                const v = e.target.value;
                setBankPaper(v === 'all' ? 'all' : (Number(v) as 1 | 2));
                setBankLimit(40);
              }}
              className="bg-[var(--bg)] border border-[var(--rule)] px-2.5 py-2 text-xs text-[var(--ink)]"
            >
              <option value="all">Both Papers (460)</option>
              <option value="1">Paper 1 Only (240)</option>
              <option value="2">Paper 2 Only (220)</option>
            </select>
            <select
              value={String(bankDiff)}
              onChange={(e) => {
                const v = e.target.value;
                setBankDiff(v === 'all' ? 'all' : (Number(v) as 1 | 2 | 3 | 4 | 5));
                setBankLimit(40);
              }}
              className="bg-[var(--bg)] border border-[var(--rule)] px-2.5 py-2 text-xs text-[var(--ink)]"
            >
              <option value="all">All Difficulties (L1–L5)</option>
              <option value="1">L1 · Foundation</option>
              <option value="2">L2 · Standard</option>
              <option value="3">L3 · Exam Core</option>
              <option value="4">L4 · Stretch</option>
              <option value="5">L5 · Challenge</option>
            </select>
            <select
              value={bankStatus}
              onChange={(e) => {
                setBankStatus(e.target.value as 'all' | 'unseen' | 'queued' | 'secure');
                setBankLimit(40);
              }}
              className="bg-[var(--bg)] border border-[var(--rule)] px-2.5 py-2 text-xs text-[var(--ink)]"
            >
              <option value="all">All Statuses</option>
              <option value="unseen">Unseen</option>
              <option value="queued">In Mistake Review</option>
              <option value="secure">Solved Securely</option>
            </select>
          </div>
        </div>

        <div className="border border-[var(--rule)] divide-y divide-[var(--rule)] bg-[var(--surface)]">
          {visible.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--text-muted)]">
              No drills match those filters.
            </div>
          ) : (
            visible.map((q) => {
              const paper = q.tags.includes('paper-2') ? 'P2' : 'P1';
              const meta = TMUA_TECHNIQUE_META[q.family];
              const isQueued = Boolean(history.queue[q.id]);
              const latest = history.latest[q.id];
              const isSecure = Boolean(latest && latest.status === 'correct' && !latest.guessed && !latest.assisted);
              return (
                <div
                  key={q.id}
                  className="p-3.5 flex flex-wrap items-center justify-between gap-3 hover:bg-[var(--bg)]/50 transition-colors"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono-tabular">
                      <span className="px-1.5 py-0.5 border border-[var(--rule)] text-[var(--ink)]">
                        {paper}
                      </span>
                      <span className="text-[var(--accent)]">{meta?.spec ?? q.type}</span>
                      <span className="text-[var(--text-muted)]">
                        L{q.difficulty} · {meta?.title ?? q.family}
                      </span>
                      {isQueued && (
                        <span className="px-1.5 py-0.5 border border-[var(--crimson)]/40 text-[var(--crimson)]">
                          Queued
                        </span>
                      )}
                      {isSecure && !isQueued && (
                        <span className="px-1.5 py-0.5 border border-[var(--accent)]/40 text-[var(--accent)]">
                          Secure
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--ink)] line-clamp-1">{q.stem}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      startSession([q], {
                        label: `Bank · ${meta?.title ?? q.topic}`,
                        kind: 'custom',
                        timed: false,
                      })
                    }
                    className="px-3 py-1.5 border border-[var(--rule)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-xs font-medium cursor-pointer shrink-0"
                  >
                    Play →
                  </button>
                </div>
              );
            })
          )}
        </div>

        {filtered.length > visible.length && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => setBankLimit((n) => n + 40)}
              className="px-4 py-2 border border-[var(--rule)] hover:border-[var(--ink)] text-xs font-mono-tabular text-[var(--ink)] cursor-pointer"
            >
              Load 40 more ({filtered.length - visible.length} remaining)
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ── Mistake Review Tab (with 1 / 3 / 7-Day Spaced Repetition) ─────────── */
  if (view === 'review') {
    const reasonMap = new Map(TMUA_DRILL_PACK.mistakeReasons.map((r) => [r.id, r.label]));
    const nowTime = Date.now();
    const masteredCount = Object.values(srs).filter((e) => e.stage === 3).length;
    const dueNowCount = reviewQueue.filter((q) => {
      const s = srs[q.id];
      return !s || Date.parse(s.dueAt) <= nowTime;
    }).length;
    return (
      <div className="space-y-6">
        <div className="border border-[var(--rule)] bg-[var(--surface)] p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
              1 / 3 / 7-Day Mistake Review · {reviewQueue.length} queued · {dueNowCount} due now · {masteredCount} mastered
            </div>
            <h3 className="font-display text-2xl text-[var(--ink)] mt-0.5">
              Clear items across the 1-day, 3-day, and 7-day mastery ladder
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Wrong answers, timeouts, marked guesses, and assisted attempts enter at 1-day review. Solve cleanly without the key to clear the queue and advance 1d → 3d → 7d → Mastered. Retries never rewrite your first-attempt stats.
            </p>
          </div>
          {reviewQueue.length > 0 && (
            <button
              type="button"
              onClick={() =>
                startSession(reviewQueue.slice(0, 20), {
                  label: `Mistake Review (${Math.min(20, reviewQueue.length)} Qs)`,
                  kind: 'retry',
                  timed: false,
                })
              }
              className="px-4 py-2 bg-[var(--accent)] text-[#04130d] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retry Queue ({Math.min(20, reviewQueue.length)})
            </button>
          )}
        </div>

        {reviewQueue.length === 0 ? (
          <div className="border border-[var(--rule)] p-8 text-center text-sm text-[var(--text-muted)]">
            Your Mistake Review queue is clear. Wrong answers, timeouts, and flagged guesses from
            Daily 5 or Skills Practice appear here automatically.
          </div>
        ) : (
          <div className="space-y-3">
            {reviewQueue.map((q) => {
              const entry = history.queue[q.id];
              const srsItem = srs[q.id];
              const badge =
                entry.status === 'unanswered'
                  ? 'Unanswered'
                  : entry.status === 'wrong'
                  ? 'Incorrect'
                  : entry.guessed
                  ? 'Guessed'
                  : 'Assisted';
              const srsText = srsItem
                ? `${srsStageLabel(srsItem.stage)} · ${
                    Date.parse(srsItem.dueAt) <= nowTime
                      ? 'Due now'
                      : `Due in ${Math.max(1, Math.ceil((Date.parse(srsItem.dueAt) - nowTime) / 86400_000))}d`
                  }`
                : '1-day review · Ready';
              return (
                <div
                  key={q.id}
                  className="border border-[var(--rule)] bg-[var(--surface)] p-4 flex flex-wrap items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular">
                      <span className="px-2 py-0.5 border border-[var(--crimson)]/40 text-[var(--crimson)]">
                        {badge}
                      </span>
                      <span className="px-2 py-0.5 border border-[var(--accent)]/40 text-[var(--accent)]">
                        {srsText}
                      </span>
                      <span className="text-[var(--text-muted)]">
                        {q.tags.includes('paper-2') ? 'Paper 2' : 'Paper 1'} · {q.topic} · L{q.difficulty}
                      </span>
                      {entry.reason && (
                        <span className="px-2 py-0.5 border border-[var(--rule)] text-[var(--ink)]">
                          {reasonMap.get(entry.reason) ?? entry.reason}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--ink)] line-clamp-2 whitespace-pre-line">
                      {q.stem}
                    </p>
                    {entry.note && (
                      <p className="text-xs text-[var(--accent)]">Note: {entry.note}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      startSession([q], {
                        label: `Retry · ${q.topic}`,
                        kind: 'retry',
                        timed: false,
                      })
                    }
                    className="px-3.5 py-2 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)]/10 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Retry without key
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* 18-Trap Paper 1 & Paper 2 Diagnostic Checklist */}
        <div className="border border-[var(--rule)] bg-[var(--surface)] p-5 space-y-4">
          <div>
            <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
              Common TMUA Trap Taxonomy · 18 Distractor Patterns
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Before locking an option, scan for these high-frequency Paper 1 and Paper 2 traps.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {([1, 2] as const).map((p) => (
              <div key={p} className="border border-[var(--rule)] bg-[var(--bg)] p-4 space-y-2.5">
                <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                  Paper {p} Traps ({TMUA_TRAP_TAXONOMY.filter((t) => t.paper === p).length})
                </div>
                <div className="space-y-2">
                  {TMUA_TRAP_TAXONOMY.filter((t) => t.paper === p).map((trap) => (
                    <div key={trap.id} className="border-b border-[var(--rule)]/50 pb-2 last:border-b-0 last:pb-0">
                      <div className="text-xs font-semibold text-[var(--ink)]">{trap.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)] leading-relaxed mt-0.5">
                        {trap.check}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Skills Practice Hub (Daily 5 + Custom/Adaptive Builder + Stats) ──── */
  const dailyQs = daily.ids
    .map((id) => questionById.get(id))
    .filter((q): q is TmuaDrillQuestion => Boolean(q));
  const selectedP2Skill = TMUA_DRILL_PACK.modules[1].skills.find((s) => s.id === skillFilter);

  return (
    <div className="space-y-8">
      {/* Daily 5 Card */}
      <div className="border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)] inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Daily 5 · {daily.day}
            </div>
            <h3 className="font-display text-2xl text-[var(--ink)] mt-0.5">
              Mixed Paper 1 &amp; Paper 2 Retrieval
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Adaptive selection from the 460-question drill bank (never pulls mock items).
              {daily.complete ? ' Completed for today — you can still review or re-run.' : ' IDs stay locked across reloads until submitted.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] border border-[var(--rule)] px-2.5 py-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={dailyTimed}
                onChange={(e) => setDailyTimed(e.target.checked)}
                className="accent-emerald-500"
              />
              Timed ({formatClock(practiceSeconds(dailyQs.length || 5))})
            </label>
            <button
              type="button"
              onClick={startDaily}
              className="px-4 py-2 bg-[var(--accent)] text-[#04130d] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              {daily.complete ? 'Re-run Daily 5' : 'Start Daily 5'}
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-5 gap-2">
          {dailyQs.map((q, idx) => {
            const seen = Boolean(history.first[q.id]);
            return (
              <div
                key={q.id}
                className="border border-[var(--rule)] bg-[var(--bg)] p-2.5 text-[11px] space-y-1"
              >
                <div className="flex items-center justify-between font-mono-tabular">
                  <span className="text-[var(--accent)]">
                    #{idx + 1} · {q.tags.includes('paper-2') ? 'P2' : 'P1'}
                  </span>
                  <span className="text-[var(--text-muted)]">
                    {seen ? 'Review' : `L${q.difficulty}`}
                  </span>
                </div>
                <div className="text-[var(--ink)] font-medium truncate" title={q.topic}>
                  {q.topic}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom & Adaptive Drill Builder */}
      <div className="border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)] inline-flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> Custom &amp; Adaptive Drill Sets · 460 Original Drills
            </div>
            <h3 className="font-display text-2xl text-[var(--ink)] mt-0.5">
              Build a targeted no-calculator set
            </h3>
          </div>
          <span className="text-xs font-mono-tabular text-[var(--text-muted)]">
            Pace: 3:45 / Q (225s) · 20 Qs = 75:00
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Paper */}
          <div className="space-y-1.5">
            <label className="block text-[var(--text-muted)] font-mono-tabular uppercase text-[11px]">
              Paper
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(['all', 1, 2] as const).map((p) => (
                <button
                  key={String(p)}
                  type="button"
                  onClick={() => setPaperFilter(p)}
                  className={`py-1.5 border cursor-pointer ${
                    paperFilter === p
                      ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10'
                      : 'border-[var(--rule)] text-[var(--text-muted)]'
                  }`}
                >
                  {p === 'all' ? 'Both' : `Paper ${p}`}
                </button>
              ))}
            </div>
          </div>

          {/* Skill */}
          <div className="space-y-1.5">
            <label className="block text-[var(--text-muted)] font-mono-tabular uppercase text-[11px]">
              Skill
            </label>
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--rule)] px-2.5 py-1.5 text-xs text-[var(--ink)]"
            >
              <option value="all">All skills ({availableSkills.length})</option>
              {availableSkills.map((s) => (
                <option key={s.id} value={s.id}>
                  P{s.paperNumber} · {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div className="space-y-1.5">
            <label className="block text-[var(--text-muted)] font-mono-tabular uppercase text-[11px]">
              Editorial Difficulty
            </label>
            <select
              value={String(difficultyFilter)}
              onChange={(e) =>
                setDifficultyFilter(
                  e.target.value === 'all' ? 'all' : (Number(e.target.value) as 1 | 2 | 3 | 4 | 5)
                )
              }
              className="w-full bg-[var(--bg)] border border-[var(--rule)] px-2.5 py-1.5 text-xs text-[var(--ink)]"
            >
              <option value="all">All levels (1–5)</option>
              {([1, 2, 3, 4, 5] as const).map((lvl) => (
                <option key={lvl} value={lvl}>
                  Level {lvl} — {TMUA_DRILL_PACK.difficultyLabels[String(lvl)]}
                </option>
              ))}
            </select>
          </div>

          {/* Length */}
          <div className="space-y-1.5">
            <label className="block text-[var(--text-muted)] font-mono-tabular uppercase text-[11px]">
              Questions
            </label>
            <div className="grid grid-cols-3 gap-1">
              {([5, 10, 20] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCountChoice(c)}
                  className={`py-1.5 border font-mono-tabular cursor-pointer ${
                    countChoice === c
                      ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10'
                      : 'border-[var(--rule)] text-[var(--text-muted)]'
                  }`}
                >
                  {c} Qs
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--rule)] text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-1.5 text-[var(--ink)] cursor-pointer">
              <input
                type="checkbox"
                checked={timedChoice}
                onChange={(e) => setTimedChoice(e.target.checked)}
                className="accent-emerald-500"
              />
              <span>
                Timed ({previewQuestions.length > 0 ? formatClock(practiceSeconds(previewQuestions.length)) : '00:00'})
              </span>
            </label>
            <label className="inline-flex items-center gap-1.5 text-[var(--ink)] cursor-pointer">
              <input
                type="checkbox"
                checked={adaptiveChoice}
                onChange={(e) => setAdaptiveChoice(e.target.checked)}
                className="accent-emerald-500"
              />
              <span>Adaptive weak-skill priority</span>
            </label>
            {selectedP2Skill?.lessonId && (
              <button
                type="button"
                onClick={() => onOpenPrimer(selectedP2Skill.lessonId!)}
                className="text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" /> Read Primer: {selectedP2Skill.title}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono-tabular text-[var(--text-muted)]">
              {previewQuestions.length === 0
                ? '0 matching questions'
                : `${previewQuestions.length} question${previewQuestions.length === 1 ? '' : 's'} ready`}
            </span>
            <button
              type="button"
              disabled={previewQuestions.length === 0}
              onClick={() => {
                const label = `${paperFilter === 'all' ? 'Mixed' : `Paper ${paperFilter}`} ${
                  timedChoice ? 'Timed' : 'Untimed'
                } Set (${previewQuestions.length} Qs)`;
                setSeedNonce((n) => n + 1);
                startSession(previewQuestions, {
                  label,
                  kind: 'custom',
                  timed: timedChoice,
                });
              }}
              className="px-4 py-2 bg-[var(--ink)] text-[var(--bg)] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Start Set <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* First-Attempt Skill Stats */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="font-display text-2xl text-[var(--ink)]">
              First-Attempt Skill Accuracy
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Tracks first attempts separately from mock aggregates and retries. “Secure” excludes
              guessed or assisted correct answers. No 1.0–9.0 UAT-UK score prediction.
            </p>
          </div>
          <div className="text-xs font-mono-tabular text-[var(--text-muted)]">
            Attempted: <span className="text-[var(--ink)] font-semibold">{totalFirstAttempted}</span> / 460 ·
            Correct: <span className="text-[var(--accent)] font-semibold">{totalFirstCorrect}</span> ·
            Secure: <span className="text-[var(--accent)] font-semibold">{totalFirstSecure}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {TMUA_DRILL_PACK.modules.map((mod) => (
            <div key={mod.type} className="border border-[var(--rule)] bg-[var(--surface)] p-4 space-y-3">
              <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                Paper {mod.paperNumber} · {mod.title}
              </div>
              <div className="space-y-2">
                {mod.skills.map((skill) => {
                  const st = skillStats[skill.id];
                  const pct = st && st.total > 0 ? Math.round((st.secure / st.total) * 100) : null;
                  return (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between gap-3 text-xs border-b border-[var(--rule)]/60 pb-2 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[var(--ink)] truncate">{skill.title}</span>
                        {skill.lessonId && (
                          <button
                            type="button"
                            onClick={() => onOpenPrimer(skill.lessonId!)}
                            className="text-[11px] text-[var(--accent)] hover:underline shrink-0 cursor-pointer"
                          >
                            Primer →
                          </button>
                        )}
                      </div>
                      <span className="font-mono-tabular text-[var(--text-muted)] shrink-0">
                        {st
                          ? `${st.secure}/${st.total} secure (${pct}%)`
                          : '0 tried'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Stage 8–10 Week TMUA Preparation Plan */}
      <div className="border border-[var(--rule)] bg-[var(--surface)] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
            <AlertCircle className="w-3.5 h-3.5" /> 5-Stage TMUA Preparation Plan (8–10 Weeks)
          </div>
          <span className="text-[11px] text-[var(--text-muted)]">
            No negative marking · 225s/Q target · 1/3/7-day mistake review
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {TMUA_FIVE_STAGE_PLAN.map((stage) => (
            <div key={stage.stage} className="border border-[var(--rule)] bg-[var(--bg)] p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono-tabular">
                <span className="text-[var(--accent)]">{stage.stage}</span>
                <span className="text-[var(--text-muted)]">{stage.weeks}</span>
              </div>
              <div className="text-xs font-semibold text-[var(--ink)]">{stage.title}</div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{stage.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
