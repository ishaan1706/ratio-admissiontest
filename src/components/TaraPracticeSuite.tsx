import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  Clock,
  Flame,
  HelpCircle,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import taraDrillsRaw from '../data/packs/tara-practice/tara_drills.json';

export interface TaraDrillSkill {
  id: string;
  title: string;
  lessonId: string;
}

export interface TaraDrillQuestion {
  id: string;
  type: string;
  stem: string;
  options: Record<string, string>;
  answer: string;
  explanation: string;
  difficulty: number;
  family?: string;
  moduleType: 'critical-thinking' | 'problem-solving';
  moduleTitle: string;
}

export interface TaraResourceLink {
  id: string;
  title: string;
  url: string;
  category: 'official' | 'legacy' | 'third-party';
  description: string;
}

interface RawTaraDrills {
  paceSeconds: number;
  dailyQuestionCount: number;
  difficultyLabels: Record<string, string>;
  mistakeReasons: { id: string; label: string }[];
  modules: {
    type: 'critical-thinking' | 'problem-solving';
    title: string;
    skills: TaraDrillSkill[];
    questions: Omit<TaraDrillQuestion, 'moduleType' | 'moduleTitle'>[];
  }[];
  studyPath: { id: string; title: string; steps: string[] }[];
  resourceLinks: TaraResourceLink[];
}

export const TARA_DRILLS_DATA = taraDrillsRaw as RawTaraDrills;

export const TARA_ALL_SKILLS: (TaraDrillSkill & {
  moduleType: 'critical-thinking' | 'problem-solving';
  moduleTitle: string;
})[] = TARA_DRILLS_DATA.modules.flatMap((m) =>
  m.skills.map((s) => ({ ...s, moduleType: m.type, moduleTitle: m.title })),
);

export const TARA_ALL_DRILL_QUESTIONS: TaraDrillQuestion[] = TARA_DRILLS_DATA.modules.flatMap((m) =>
  m.questions.map((q) => ({ ...q, moduleType: m.type, moduleTitle: m.title })),
);

const SKILL_MAP = new Map(TARA_ALL_SKILLS.map((s) => [s.id, s]));
const QUESTION_MAP = new Map(TARA_ALL_DRILL_QUESTIONS.map((q) => [q.id, q]));

const STORAGE_KEY = 'ratio_tara_drill_history_v1';

type ItemOutcome = 'correct' | 'incorrect' | 'unanswered' | 'guessed';

interface DrillItemRecord {
  firstOutcome: ItemOutcome;
  latestOutcome: ItemOutcome;
  inQueue: boolean;
  attempts: number;
  mistakeReason?: string;
  note?: string;
  lastAnsweredAt: string;
}

interface DailySetRecord {
  ids: string[];
  reuseIds: string[];
  completed: boolean;
}

interface DrillAttemptLog {
  id: string;
  mode: 'daily' | 'timed' | 'untimed' | 'queue';
  label: string;
  correct: number;
  total: number;
  createdAt: string;
}

interface TaraDrillStore {
  items: Record<string, DrillItemRecord>;
  dailySets: Record<string, DailySetRecord>;
  attemptLog: DrillAttemptLog[];
}

function loadStore(): TaraDrillStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: {}, dailySets: {}, attemptLog: [] };
    const parsed = JSON.parse(raw);
    return {
      items: parsed && typeof parsed.items === 'object' && parsed.items ? parsed.items : {},
      dailySets: parsed && typeof parsed.dailySets === 'object' && parsed.dailySets ? parsed.dailySets : {},
      attemptLog: Array.isArray(parsed?.attemptLog) ? parsed.attemptLog.slice(0, 100) : [],
    };
  } catch {
    return { items: {}, dailySets: {}, attemptLog: [] };
  }
}

function saveStore(store: TaraDrillStore) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...store,
        attemptLog: store.attemptLog.slice(0, 100),
      }),
    );
  } catch {
    // ignore
  }
}

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function hashStr(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function fmtTime(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

function selectDiverse(pool: TaraDrillQuestion[], count: number, seed: string): TaraDrillQuestion[] {
  const sorted = [...pool].sort((a, b) => hashStr(a.id + seed) - hashStr(b.id + seed));
  const picked: TaraDrillQuestion[] = [];
  const usedIds = new Set<string>();
  const usedFamilies = new Set<string>();
  const usedTypes = new Set<string>();

  // Pass 1: unique PS family & skill type
  for (const q of sorted) {
    if (picked.length >= count) break;
    if (q.family && usedFamilies.has(q.family)) continue;
    if (usedTypes.has(q.type)) continue;
    picked.push(q);
    usedIds.add(q.id);
    if (q.family) usedFamilies.add(q.family);
    usedTypes.add(q.type);
  }
  // Pass 2: unique PS family
  for (const q of sorted) {
    if (picked.length >= count) break;
    if (usedIds.has(q.id)) continue;
    if (q.family && usedFamilies.has(q.family)) continue;
    picked.push(q);
    usedIds.add(q.id);
    if (q.family) usedFamilies.add(q.family);
  }
  // Pass 3: remaining distinct items
  for (const q of sorted) {
    if (picked.length >= count) break;
    if (usedIds.has(q.id)) continue;
    picked.push(q);
    usedIds.add(q.id);
  }
  return picked;
}

function buildDailySet(store: TaraDrillStore, dateStr: string): DailySetRecord {
  const target = TARA_DRILLS_DATA.dailyQuestionCount || 5;
  const existing = store.dailySets[dateStr];
  const validIds = Array.isArray(existing?.ids)
    ? [...new Set(existing.ids.filter((id) => QUESTION_MAP.has(id)))].slice(0, target)
    : [];
  if (existing && validIds.length === target && existing.ids.length === target) return existing;
  const kept = new Set(validIds);
  const available = TARA_ALL_DRILL_QUESTIONS.filter((q) => !kept.has(q.id));
  const ctAll = available.filter((q) => q.moduleType === 'critical-thinking');
  const psAll = available.filter((q) => q.moduleType === 'problem-solving');
  const isSeen = (q: TaraDrillQuestion) => Boolean(store.items[q.id]?.attempts);

  const pickFromModule = (list: TaraDrillQuestion[], need: number, tag: string) => {
    const unseen = list.filter((q) => !isSeen(q));
    const seen = list.filter((q) => isSeen(q));
    const chosenUnseen = selectDiverse(unseen, need, `${dateStr}:${tag}:u`);
    const rem = need - chosenUnseen.length;
    const chosenSeen = rem > 0 ? selectDiverse(seen, rem, `${dateStr}:${tag}:s`) : [];
    return {
      items: [...chosenUnseen, ...chosenSeen],
      reuseIds: chosenSeen.map((q) => q.id),
    };
  };

  // Both modules represented (2 CT + 3 PS or 3 CT + 2 PS alternating by date)
  const ctNeed = hashStr(dateStr) % 2 === 0 ? 3 : 2;
  const psNeed = target - ctNeed;
  const keptCt = validIds.filter((id) => QUESTION_MAP.get(id)?.moduleType === 'critical-thinking').length;
  const ctPick = pickFromModule(ctAll, Math.max(0, ctNeed - keptCt), 'ct');
  const psPick = pickFromModule(psAll, Math.max(0, psNeed - (validIds.length - keptCt)), 'ps');
  const ids = [...validIds, ...ctPick.items.map((q) => q.id), ...psPick.items.map((q) => q.id)].slice(0, target);
  const oldReuseIds = Array.isArray(existing?.reuseIds) ? existing.reuseIds.filter((id) => kept.has(id)) : [];
  const reuseIds = [...oldReuseIds, ...ctPick.reuseIds, ...psPick.reuseIds].filter((id) => ids.includes(id));
  return {
    ids,
    reuseIds,
    completed: false,
  };
}

interface ActiveDrillSession {
  mode: 'daily' | 'timed' | 'untimed' | 'queue';
  title: string;
  questions: TaraDrillQuestion[];
  reuseIds: Set<string>;
  timed: boolean;
  totalSeconds: number;
}

interface TaraPracticeSuiteProps {
  onOpenLesson: (lessonId: string) => void;
}

export const TaraPracticeSuite: React.FC<TaraPracticeSuiteProps> = ({ onOpenLesson }) => {
  const [store, setStore] = useState<TaraDrillStore>(() => loadStore());
  const [subView, setSubView] = useState<'daily' | 'custom' | 'queue' | 'stats'>('daily');

  // Custom set builder filters
  const [modFilter, setModFilter] = useState<'all' | 'critical-thinking' | 'problem-solving'>('all');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [diffFilter, setDiffFilter] = useState<string>('all');
  const [sizeTarget, setSizeTarget] = useState<number>(10);
  const [customTimed, setCustomTimed] = useState<boolean>(true);

  // Active drill runner state
  const [session, setSession] = useState<ActiveDrillSession | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [committed, setCommitted] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  const today = todayKey();

  // Persist today's Daily 5 before first answer so reloading never reshuffles it
  const dailyRecord = useMemo(() => {
    const rec = buildDailySet(store, today);
    return rec;
  }, [store, today]);

  useEffect(() => {
    if (store.dailySets[today] !== dailyRecord) {
      const next: TaraDrillStore = {
        ...store,
        dailySets: { ...store.dailySets, [today]: dailyRecord },
      };
      saveStore(next);
      setStore(next);
    }
  }, [today, dailyRecord, store]);

  const dailyQuestions = useMemo(
    () => dailyRecord.ids.map((id) => QUESTION_MAP.get(id)).filter(Boolean) as TaraDrillQuestion[],
    [dailyRecord],
  );

  // Queue items
  const queueQuestions = useMemo(
    () =>
      Object.entries(store.items)
        .filter(([, rec]) => rec.inQueue)
        .map(([id]) => QUESTION_MAP.get(id))
        .filter(Boolean) as TaraDrillQuestion[],
    [store.items],
  );

  // Filtered pool for custom sets
  const availableSkills = useMemo(
    () =>
      modFilter === 'all'
        ? TARA_ALL_SKILLS
        : TARA_ALL_SKILLS.filter((s) => s.moduleType === modFilter),
    [modFilter],
  );

  useEffect(() => {
    if (skillFilter !== 'all' && !availableSkills.some((s) => s.id === skillFilter)) {
      setSkillFilter('all');
    }
  }, [availableSkills, skillFilter]);

  const matchingPool = useMemo(() => {
    return TARA_ALL_DRILL_QUESTIONS.filter((q) => {
      if (modFilter !== 'all' && q.moduleType !== modFilter) return false;
      if (skillFilter !== 'all' && q.type !== skillFilter) return false;
      if (diffFilter !== 'all' && String(q.difficulty) !== diffFilter) return false;
      return true;
    });
  }, [modFilter, skillFilter, diffFilter]);

  const actualCustomCount = Math.min(sizeTarget, matchingPool.length);
  const calcTimedSeconds = (n: number) => (n === 22 ? 2400 : Math.round((n * 2400) / 22));

  // Record a single item outcome while NEVER overwriting firstOutcome
  const applyItemOutcomes = (
    outcomes: { qId: string; outcome: ItemOutcome }[],
    logEntry?: DrillAttemptLog,
    markDailyComplete?: boolean,
  ) => {
    setStore((prev) => {
      const nextItems = { ...prev.items };
      const now = new Date().toISOString();
      for (const { qId, outcome } of outcomes) {
        const cur = nextItems[qId];
        const entersQueue = outcome !== 'correct';
        nextItems[qId] = {
          firstOutcome: cur ? cur.firstOutcome : outcome,
          latestOutcome: outcome,
          inQueue: entersQueue,
          attempts: (cur?.attempts || 0) + 1,
          mistakeReason: entersQueue ? cur?.mistakeReason : cur?.mistakeReason,
          note: cur?.note,
          lastAnsweredAt: now,
        };
      }
      const nextDaily = markDailyComplete
        ? {
            ...prev.dailySets,
            [today]: {
              ...dailyRecord,
              completed: true,
            },
          }
        : prev.dailySets;
      const nextStore: TaraDrillStore = {
        items: nextItems,
        dailySets: nextDaily,
        attemptLog: logEntry ? [logEntry, ...prev.attemptLog].slice(0, 100) : prev.attemptLog,
      };
      saveStore(nextStore);
      return nextStore;
    });
  };

  const toggleMarkGuessed = (qId: string) => {
    setStore((prev) => {
      const cur = prev.items[qId];
      if (!cur) return prev;
      const nextGuessed = cur.latestOutcome !== 'guessed';
      const nextOutcome: ItemOutcome = nextGuessed ? 'guessed' : 'correct';
      // If this was the first and only attempt, reflect guess on firstOutcome too
      const nextFirst: ItemOutcome =
        cur.attempts <= 1 ? nextOutcome : cur.firstOutcome;
      const nextStore: TaraDrillStore = {
        ...prev,
        items: {
          ...prev.items,
          [qId]: {
            ...cur,
            firstOutcome: nextFirst,
            latestOutcome: nextOutcome,
            inQueue: nextGuessed,
          },
        },
      };
      saveStore(nextStore);
      return nextStore;
    });
  };

  const updateMistakeMeta = (qId: string, patch: { mistakeReason?: string; note?: string }) => {
    setStore((prev) => {
      const cur = prev.items[qId];
      if (!cur) return prev;
      const nextStore: TaraDrillStore = {
        ...prev,
        items: {
          ...prev.items,
          [qId]: { ...cur, ...patch },
        },
      };
      saveStore(nextStore);
      return nextStore;
    });
  };

  const startDrill = (cfg: ActiveDrillSession) => {
    if (cfg.questions.length === 0) return;
    setSession(cfg);
    setQIdx(0);
    setAnswers({});
    setCommitted({});
    setSecondsLeft(cfg.totalSeconds);
    setElapsedSec(0);
    setSubmitted(false);
    setTimedOut(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitSession = (wasTimeout = false) => {
    if (!session || submitted) return;
    const outcomes: { qId: string; outcome: ItemOutcome }[] = [];
    let correct = 0;

    for (const q of session.questions) {
      const pick = answers[q.id];
      const isRight = pick === q.answer;
      if (isRight) correct += 1;
      // In untimed mode, already-committed items were already recorded
      if (!session.timed && committed[q.id]) continue;
      outcomes.push({
        qId: q.id,
        outcome: !pick ? 'unanswered' : isRight ? 'correct' : 'incorrect',
      });
    }

    const logEntry: DrillAttemptLog = {
      id: `tara-drill-${Date.now()}`,
      mode: session.mode,
      label: session.title,
      correct,
      total: session.questions.length,
      createdAt: new Date().toISOString(),
    };
    applyItemOutcomes(outcomes, logEntry, session.mode === 'daily');
    setSubmitted(true);
    setTimedOut(wasTimeout);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Timer tick for active sessions
  useEffect(() => {
    if (!session || submitted) return;
    const id = window.setInterval(() => {
      setElapsedSec((e) => e + 1);
      if (session.timed) {
        setSecondsLeft((s) => {
          if (s <= 1) {
            window.clearInterval(id);
            submitSession(true);
            return 0;
          }
          return s - 1;
        });
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [session, submitted, answers, committed]);

  /* ── Stats Computation (Separate CT & PS, First-Attempt Accuracy) ──────── */
  const stats = useMemo(() => {
    const byMod = {
      'critical-thinking': { firstCorrect: 0, firstTotal: 0 },
      'problem-solving': { firstCorrect: 0, firstTotal: 0 },
    };
    const bySkill = new Map<string, { title: string; moduleTitle: string; lessonId: string; firstCorrect: number; firstTotal: number }>();
    for (const s of TARA_ALL_SKILLS) {
      bySkill.set(s.id, {
        title: s.title,
        moduleTitle: s.moduleTitle,
        lessonId: s.lessonId,
        firstCorrect: 0,
        firstTotal: 0,
      });
    }
    for (const [qId, rec] of Object.entries(store.items)) {
      const q = QUESTION_MAP.get(qId);
      if (!q) continue;
      byMod[q.moduleType].firstTotal += 1;
      if (rec.firstOutcome === 'correct') byMod[q.moduleType].firstCorrect += 1;
      const sk = bySkill.get(q.type);
      if (sk) {
        sk.firstTotal += 1;
        if (rec.firstOutcome === 'correct') sk.firstCorrect += 1;
      }
    }
    return { byMod, skills: Array.from(bySkill.entries()) };
  }, [store.items]);

  const handleUntimedCommit = (q: TaraDrillQuestion) => {
    const pick = answers[q.id];
    if (!pick || committed[q.id]) return;
    setCommitted((prev) => ({ ...prev, [q.id]: true }));
    applyItemOutcomes([
      { qId: q.id, outcome: pick === q.answer ? 'correct' : 'incorrect' },
    ]);
  };

  /* ── Active Drill Runner & Review ─────────────────────────────────────── */
  if (session) {
    if (submitted) {
      const correctCount = session.questions.filter((q) => answers[q.id] === q.answer).length;
      const unansweredCount = session.questions.filter((q) => !answers[q.id]).length;
      return (
        <div className="space-y-6">
          <div className="border border-[var(--rule)] bg-[var(--surface)] p-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                  {session.title} · {timedOut ? 'Time Expired — Submitted' : 'Review'}
                </div>
                <h3 className="font-display text-3xl text-[var(--ink)] mt-1">
                  {correctCount} / {session.questions.length} correct
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {unansweredCount > 0
                    ? `${unansweredCount} unanswered item(s) counted as not correct and added to your review queue. `
                    : ''}
                  Incorrect, unanswered, and guessed items stay in your Review Queue until an
                  unflagged correct retry. Retries never overwrite first-attempt accuracy.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => startDrill(session)}
                  className="px-3.5 py-2 border border-[var(--rule)] text-xs font-medium text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retry Set
                </button>
                <button
                  type="button"
                  onClick={() => setSession(null)}
                  className="px-4 py-2 bg-[var(--ink)] text-[var(--bg)] text-xs font-semibold cursor-pointer"
                >
                  Back to Skills Practice
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {session.questions.map((q, idx) => {
              const pick = answers[q.id];
              const ok = pick === q.answer;
              const rec = store.items[q.id];
              const isGuessed = rec?.latestOutcome === 'guessed';
              const skillMeta = SKILL_MAP.get(q.type);
              return (
                <div
                  key={q.id}
                  className="border border-[var(--rule)] bg-[var(--surface)] p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tabular">
                    <span className="text-[var(--text-muted)]">
                      Q{idx + 1} · {q.moduleTitle} · {skillMeta?.title || q.type} · Diff {q.difficulty}/5
                    </span>
                    <span
                      className={
                        ok && !isGuessed
                          ? 'text-[var(--accent)] font-semibold'
                          : 'text-[var(--danger)] font-semibold'
                      }
                    >
                      {!pick
                        ? `Unanswered · Key: ${q.answer}`
                        : ok
                          ? isGuessed
                            ? `Correct (marked guessed — queued) · ${q.answer}`
                            : `Correct (${q.answer})`
                          : `Your answer: ${pick} · Key: ${q.answer}`}
                    </span>
                  </div>

                  <p className="text-sm text-[var(--ink)] whitespace-pre-line leading-relaxed">
                    {q.stem}
                  </p>

                  <p className="text-xs text-[var(--text-muted)] leading-relaxed pt-2 border-t border-[var(--rule)] whitespace-pre-line">
                    <strong className="text-[var(--ink)]">Explanation:</strong> {q.explanation}
                  </p>

                  {/* Mark guessed + Mistake reason + Note + Learn this skill */}
                  <div className="pt-2 border-t border-[var(--rule)] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      {ok && (
                        <button
                          type="button"
                          onClick={() => toggleMarkGuessed(q.id)}
                          className={`px-2.5 py-1 border inline-flex items-center gap-1 cursor-pointer ${
                            isGuessed
                              ? 'border-amber-500/60 bg-amber-500/15 text-amber-300'
                              : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                          }`}
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          {isGuessed ? 'Marked as guessed (in queue)' : 'Mark as guessed'}
                        </button>
                      )}
                      {(!ok || isGuessed) && (
                        <select
                          value={rec?.mistakeReason || ''}
                          onChange={(e) =>
                            updateMistakeMeta(q.id, { mistakeReason: e.target.value })
                          }
                          aria-label="Mistake reason"
                          className="px-2.5 py-1 bg-[var(--bg)] border border-[var(--rule)] text-xs text-[var(--ink)]"
                        >
                          <option value="">Tag mistake reason (optional)…</option>
                          {TARA_DRILLS_DATA.mistakeReasons.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    {skillMeta?.lessonId && (
                      <button
                        type="button"
                        onClick={() => {
                          setSession(null);
                          onOpenLesson(skillMeta.lessonId);
                        }}
                        className="text-xs font-medium text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" /> Learn this skill
                      </button>
                    )}
                  </div>

                  {(!ok || isGuessed) && (
                    <input
                      type="text"
                      value={rec?.note || ''}
                      onChange={(e) => updateMistakeMeta(q.id, { note: e.target.value })}
                      placeholder="Optional note on why you missed or guessed this…"
                      className="w-full px-3 py-1.5 bg-[var(--bg)] border border-[var(--rule)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    const q = session.questions[qIdx];
    const pick = answers[q.id];
    const isCommitted = !!committed[q.id];
    const isReused = session.reuseIds.has(q.id);
    const skillMeta = SKILL_MAP.get(q.type);
    const avgPaceCue = TARA_DRILLS_DATA.paceSeconds || 109;
    const expectedPaceSoFar = (qIdx + 1) * avgPaceCue;
    const rec = store.items[q.id];
    const isGuessed = rec?.latestOutcome === 'guessed';

    return (
      <div className="space-y-5">
        <div className="border border-[var(--rule)] bg-[var(--surface)] p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)] flex items-center gap-2">
              <span>
                {session.title} · Q{qIdx + 1}/{session.questions.length}
              </span>
              {isReused && (
                <span className="px-1.5 py-0.5 rounded border border-amber-500/40 bg-amber-500/10 text-amber-300 text-[10px]">
                  Review
                </span>
              )}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">
              {q.moduleTitle} · {skillMeta?.title || q.type} · Diff {q.difficulty}/5 (
              {TARA_DRILLS_DATA.difficultyLabels[String(q.difficulty)] || 'Standard'})
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono-tabular">
            {session.timed ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[var(--rule)] bg-[var(--bg)] text-[var(--ink)]">
                <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
                {fmtTime(secondsLeft)} left
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[var(--rule)] bg-[var(--bg)] text-[var(--text-muted)]">
                <Clock className="w-3.5 h-3.5" />
                {fmtTime(elapsedSec)} · cue ~{fmtTime(expectedPaceSoFar)} ({avgPaceCue}s/Q)
              </span>
            )}
            <button
              type="button"
              onClick={() => submitSession(false)}
              className="px-3.5 py-1.5 bg-[var(--accent)] text-[var(--accent-fg)] font-semibold cursor-pointer"
            >
              Submit Set
            </button>
            <button
              type="button"
              onClick={() => setSession(null)}
              className="px-2.5 py-1.5 border border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)] cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>

        <div className="border border-[var(--rule)] bg-[var(--surface)] p-6 space-y-5">
          <div className="text-[15px] text-[var(--ink)] whitespace-pre-line leading-relaxed">
            {q.stem}
          </div>

          <div className="space-y-2">
            {Object.keys(q.options).map((key) => {
              const isSel = pick === key;
              const isKey = key === q.answer;
              const showReveal = !session.timed && isCommitted;
              let cls = 'border-[var(--rule)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--accent)]';
              if (showReveal) {
                if (isKey) cls = 'border-emerald-500/60 bg-emerald-500/12 text-emerald-100';
                else if (isSel && !isKey) cls = 'border-rose-500/60 bg-rose-500/12 text-rose-100';
              } else if (isSel) {
                cls = 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)]';
              }
              return (
                <button
                  key={key}
                  type="button"
                  disabled={showReveal}
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: key }))}
                  className={`w-full text-left px-4 py-3 border transition-colors flex items-start gap-3 cursor-pointer disabled:cursor-default ${cls}`}
                >
                  <span className="font-mono-tabular text-xs font-bold w-5 shrink-0 mt-0.5">
                    {key}
                  </span>
                  <span className="text-sm leading-relaxed flex-1">{q.options[key]}</span>
                  {showReveal && isKey && <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                  {showReveal && isSel && !isKey && <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>

          {/* Untimed immediate explanation after commit */}
          {!session.timed && isCommitted && (
            <div className="border border-[var(--rule)] bg-[var(--bg)] p-4 space-y-2.5 text-xs">
              <div
                className={
                  pick === q.answer
                    ? 'text-emerald-400 font-semibold'
                    : 'text-rose-400 font-semibold'
                }
              >
                {pick === q.answer
                  ? `Correct (${q.answer})`
                  : `Incorrect — correct answer is ${q.answer}`}
              </div>
              <p className="text-[var(--text-muted)] leading-relaxed whitespace-pre-line">
                {q.explanation}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--rule)]">
                {pick === q.answer ? (
                  <button
                    type="button"
                    onClick={() => toggleMarkGuessed(q.id)}
                    className={`px-2.5 py-1 border inline-flex items-center gap-1 cursor-pointer ${
                      isGuessed
                        ? 'border-amber-500/60 bg-amber-500/15 text-amber-300'
                        : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    {isGuessed ? 'Marked as guessed (queued)' : 'Mark as guessed'}
                  </button>
                ) : (
                  <span className="text-[var(--text-muted)]">Added to Review Queue</span>
                )}
                {skillMeta?.lessonId && (
                  <button
                    type="button"
                    onClick={() => {
                      setSession(null);
                      onOpenLesson(skillMeta.lessonId);
                    }}
                    className="text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Learn this skill
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              disabled={qIdx === 0}
              onClick={() => setQIdx((i) => Math.max(0, i - 1))}
              className="px-3.5 py-2 border border-[var(--rule)] text-xs text-[var(--ink)] disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {!session.timed && !isCommitted && (
                <button
                  type="button"
                  disabled={!pick}
                  onClick={() => handleUntimedCommit(q)}
                  className="px-4 py-2 bg-[var(--accent)] text-[var(--accent-fg)] text-xs font-semibold disabled:opacity-40 cursor-pointer"
                >
                  Check Answer
                </button>
              )}
              {qIdx + 1 < session.questions.length ? (
                <button
                  type="button"
                  onClick={() => setQIdx((i) => Math.min(session.questions.length - 1, i + 1))}
                  className="px-4 py-2 bg-[var(--ink)] text-[var(--bg)] text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => submitSession(false)}
                  className="px-4 py-2 bg-[var(--accent)] text-[var(--accent-fg)] text-xs font-semibold cursor-pointer"
                >
                  Finish &amp; Review
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question palette */}
        <div className="flex flex-wrap gap-1.5">
          {session.questions.map((item, i) => {
            const ans = answers[item.id];
            const isCur = i === qIdx;
            const cls = isCur
              ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)] font-semibold'
              : ans
                ? 'border-[var(--ink)]/40 bg-[var(--surface)] text-[var(--ink)]'
                : 'border-[var(--rule)] bg-[var(--bg)] text-[var(--text-muted)]';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setQIdx(i)}
                className={`w-8 h-8 border text-xs font-mono-tabular cursor-pointer ${cls}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── Skills Practice Hub ──────────────────────────────────────────────── */
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'daily', label: `Daily 5${dailyRecord.completed ? ' ✓' : ''}`, icon: Flame },
          { id: 'custom', label: 'Custom & Skill Sets (205 Qs)', icon: SlidersHorizontal },
          { id: 'queue', label: `Review Queue (${queueQuestions.length})`, icon: AlertTriangle },
          { id: 'stats', label: 'Skill Accuracy & Study Path', icon: BarChart3 },
        ].map((t) => {
          const Icon = t.icon;
          const active = subView === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSubView(t.id as typeof subView)}
              className={`px-3.5 py-2 text-xs font-medium inline-flex items-center gap-1.5 border cursor-pointer transition-colors ${
                active
                  ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                  : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* 1. DAILY 5 */}
      {subView === 'daily' && (
        <div className="grid lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 border border-[var(--rule)] bg-[var(--surface)] p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                  TARA Daily 5 · {today}
                </div>
                <h3 className="font-display text-2xl text-[var(--ink)] mt-1">
                  Today’s Mixed CT &amp; PS Set
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Five distinct questions spanning Critical Thinking and Problem Solving, unseen
                  first, locked for today so reloading keeps the same set. Marked complete when
                  submitted.
                </p>
              </div>
              {dailyRecord.completed && (
                <span className="px-2.5 py-1 border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs font-mono-tabular shrink-0">
                  Completed
                </span>
              )}
            </div>

            <div className="space-y-2">
              {dailyQuestions.map((q, i) => {
                const isReused = dailyRecord.reuseIds.includes(q.id);
                const skillMeta = SKILL_MAP.get(q.type);
                return (
                  <div
                    key={q.id}
                    className="px-3.5 py-2.5 border border-[var(--rule)] bg-[var(--bg)] flex items-center justify-between gap-2 text-xs"
                  >
                    <span className="text-[var(--ink)]">
                      <span className="font-mono-tabular text-[var(--text-muted)] mr-2">
                        #{i + 1}
                      </span>
                      {q.moduleTitle} · {skillMeta?.title || q.type}
                    </span>
                    <span className="font-mono-tabular text-[var(--text-muted)]">
                      {isReused ? 'Review · ' : ''}Diff {q.difficulty}/5
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() =>
                  startDrill({
                    mode: 'daily',
                    title: `TARA Daily 5 (${today})`,
                    questions: dailyQuestions,
                    reuseIds: new Set(dailyRecord.reuseIds),
                    timed: true,
                    totalSeconds: calcTimedSeconds(dailyQuestions.length),
                  })
                }
                className="px-5 py-2.5 bg-[var(--accent)] text-[var(--accent-fg)] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                Start Timed Daily 5 ({fmtTime(calcTimedSeconds(dailyQuestions.length))})
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  startDrill({
                    mode: 'daily',
                    title: `TARA Daily 5 (${today}) · Untimed`,
                    questions: dailyQuestions,
                    reuseIds: new Set(dailyRecord.reuseIds),
                    timed: false,
                    totalSeconds: 0,
                  })
                }
                className="px-4 py-2.5 border border-[var(--rule)] text-xs font-medium text-[var(--ink)] cursor-pointer"
              >
                Untimed Practice
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 border border-[var(--rule)] bg-[var(--surface)] p-6 space-y-4">
            <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Quick Module Drills
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Launch a timed 10-question or full 22-question (40:00) module drill from the 205-item
              TARA bank (80 Critical Thinking, 125 Problem Solving).
            </p>
            <div className="space-y-2.5">
              {TARA_DRILLS_DATA.modules.map((m) => {
                const modQs = TARA_ALL_DRILL_QUESTIONS.filter((q) => q.moduleType === m.type);
                return (
                  <div
                    key={m.type}
                    className="p-3.5 border border-[var(--rule)] bg-[var(--bg)] space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[var(--ink)]">{m.title}</span>
                      <span className="font-mono-tabular text-[var(--text-muted)]">
                        {modQs.length} Qs · {m.skills.length} skills
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          startDrill({
                            mode: 'timed',
                            title: `${m.title} · 10-Q Drill`,
                            questions: selectDiverse(modQs, 10, `${Date.now()}`),
                            reuseIds: new Set(),
                            timed: true,
                            totalSeconds: calcTimedSeconds(10),
                          })
                        }
                        className="px-3 py-1.5 border border-[var(--rule)] hover:border-[var(--accent)] text-xs text-[var(--ink)] cursor-pointer"
                      >
                        10 Qs ({fmtTime(calcTimedSeconds(10))})
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          startDrill({
                            mode: 'timed',
                            title: `${m.title} · 22-Q Timed Module`,
                            questions: selectDiverse(modQs, 22, `${Date.now()}`),
                            reuseIds: new Set(),
                            timed: true,
                            totalSeconds: 2400,
                          })
                        }
                        className="px-3 py-1.5 border border-[var(--rule)] hover:border-[var(--accent)] text-xs text-[var(--ink)] cursor-pointer"
                      >
                        22 Qs (40:00)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. CUSTOM & SKILL SETS */}
      {subView === 'custom' && (
        <div className="border border-[var(--rule)] bg-[var(--surface)] p-6 space-y-5">
          <div>
            <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
              Filtered TARA Practice Builder
            </div>
            <h3 className="font-display text-2xl text-[var(--ink)] mt-1">
              Build a Custom Skill Set
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Filter by module, skill, and difficulty (1–5 editorial estimates). Mixed sets prefer
              method-family diversity and never duplicate questions to fill a quota.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <label className="space-y-1.5">
              <span className="text-[var(--text-muted)] block">Module</span>
              <select
                value={modFilter}
                onChange={(e) => setModFilter(e.target.value as typeof modFilter)}
                className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--rule)] text-[var(--ink)]"
              >
                <option value="all">Both CT &amp; PS (205 Qs)</option>
                <option value="critical-thinking">Critical Thinking (80 Qs)</option>
                <option value="problem-solving">Problem Solving (125 Qs)</option>
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-[var(--text-muted)] block">Skill</span>
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--rule)] text-[var(--ink)]"
              >
                <option value="all">All skills</option>
                {availableSkills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-[var(--text-muted)] block">Difficulty</span>
              <select
                value={diffFilter}
                onChange={(e) => setDiffFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--rule)] text-[var(--ink)]"
              >
                <option value="all">All difficulties (1–5)</option>
                {Object.entries(TARA_DRILLS_DATA.difficultyLabels).map(([k, label]) => (
                  <option key={k} value={k}>
                    {k} — {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-[var(--text-muted)] block">Set Size</span>
              <div className="flex gap-1.5">
                {[5, 10, 22].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setSizeTarget(n)}
                    className={`flex-1 py-2 border font-mono-tabular cursor-pointer ${
                      sizeTarget === n
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                        : 'border-[var(--rule)] bg-[var(--bg)] text-[var(--text-muted)]'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[var(--rule)]">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <label className="inline-flex items-center gap-2 cursor-pointer text-[var(--ink)]">
                <input
                  type="checkbox"
                  checked={customTimed}
                  onChange={(e) => setCustomTimed(e.target.checked)}
                />
                Timed ({actualCustomCount > 0 ? fmtTime(calcTimedSeconds(actualCustomCount)) : '00:00'} — keys hidden until submit)
              </label>
              <span className="font-mono-tabular text-[var(--text-muted)]">
                Matching: <strong className="text-[var(--ink)]">{matchingPool.length}</strong> Qs
                {matchingPool.length < sizeTarget && matchingPool.length > 0
                  ? ` (shortened to ${actualCustomCount})`
                  : ''}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {skillFilter !== 'all' && SKILL_MAP.get(skillFilter)?.lessonId && (
                <button
                  type="button"
                  onClick={() => onOpenLesson(SKILL_MAP.get(skillFilter)!.lessonId)}
                  className="px-3.5 py-2 border border-[var(--rule)] text-xs text-[var(--accent)] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Learn this skill
                </button>
              )}
              <button
                type="button"
                disabled={actualCustomCount === 0}
                onClick={() =>
                  startDrill({
                    mode: customTimed ? 'timed' : 'untimed',
                    title: `${
                      skillFilter !== 'all'
                        ? SKILL_MAP.get(skillFilter)?.title
                        : modFilter === 'all'
                          ? 'Mixed TARA'
                          : modFilter === 'critical-thinking'
                            ? 'Critical Thinking'
                            : 'Problem Solving'
                    } (${actualCustomCount} Qs)`,
                    questions: selectDiverse(matchingPool, actualCustomCount, `${Date.now()}`),
                    reuseIds: new Set(),
                    timed: customTimed,
                    totalSeconds: customTimed ? calcTimedSeconds(actualCustomCount) : 0,
                  })
                }
                className="px-5 py-2 bg-[var(--accent)] text-[var(--accent-fg)] text-xs font-semibold disabled:opacity-40 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Target className="w-3.5 h-3.5" />
                Start {actualCustomCount}-Q {customTimed ? 'Timed' : 'Untimed'} Set
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. REVIEW QUEUE (INCORRECT, UNANSWERED & GUESSED) */}
      {subView === 'queue' && (
        <div className="border border-[var(--rule)] bg-[var(--surface)] p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                Mistake &amp; Guess Review Queue
              </div>
              <h3 className="font-display text-2xl text-[var(--ink)] mt-1">
                {queueQuestions.length} item{queueQuestions.length === 1 ? '' : 's'} queued for retry
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Items answered incorrectly, left blank on timeout, or marked as guessed stay here
                until you answer them correctly without flagging. Clearing a retry never rewrites
                your first-attempt accuracy.
              </p>
            </div>
            {queueQuestions.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  startDrill({
                    mode: 'queue',
                    title: `Review Queue (${Math.min(10, queueQuestions.length)} Qs)`,
                    questions: queueQuestions.slice(0, 10),
                    reuseIds: new Set(queueQuestions.map((q) => q.id)),
                    timed: false,
                    totalSeconds: 0,
                  })
                }
                className="px-4 py-2 bg-[var(--accent)] text-[var(--accent-fg)] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                Retry Queue Now <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {queueQuestions.length === 0 ? (
            <div className="p-5 border border-[var(--rule)] bg-[var(--bg)] text-xs text-[var(--text-muted)]">
              Your review queue is clear. Missed, unanswered, or guessed questions from Daily 5 or
              Custom Sets will appear here automatically.
            </div>
          ) : (
            <div className="divide-y divide-[var(--rule)] border-t border-[var(--rule)]">
              {queueQuestions.map((q) => {
                const rec = store.items[q.id];
                const skillMeta = SKILL_MAP.get(q.type);
                const reasonLabel = TARA_DRILLS_DATA.mistakeReasons.find(
                  (r) => r.id === rec?.mistakeReason,
                )?.label;
                return (
                  <div key={q.id} className="py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="space-y-0.5">
                      <div className="text-[var(--ink)] font-medium">
                        {q.moduleTitle} · {skillMeta?.title || q.type}
                      </div>
                      <div className="text-[var(--text-muted)]">
                        Status: <span className="capitalize">{rec?.latestOutcome}</span>
                        {reasonLabel ? ` · Reason: ${reasonLabel}` : ''}
                        {rec?.note ? ` · Note: "${rec.note}"` : ''}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        startDrill({
                          mode: 'queue',
                          title: `Retry · ${skillMeta?.title || q.type}`,
                          questions: [q],
                          reuseIds: new Set([q.id]),
                          timed: false,
                          totalSeconds: 0,
                        })
                      }
                      className="px-3 py-1.5 border border-[var(--rule)] hover:border-[var(--accent)] text-[var(--ink)] cursor-pointer"
                    >
                      Retry item
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. SKILL ACCURACY & STUDY PATH */}
      {subView === 'stats' && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {(['critical-thinking', 'problem-solving'] as const).map((mType) => {
              const row = stats.byMod[mType];
              const pct = row.firstTotal > 0 ? Math.round((row.firstCorrect / row.firstTotal) * 100) : null;
              return (
                <div key={mType} className="border border-[var(--rule)] bg-[var(--surface)] p-5 space-y-1">
                  <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                    {mType === 'critical-thinking' ? 'Critical Thinking' : 'Problem Solving'} · First-Attempt
                  </div>
                  <div className="font-display text-3xl text-[var(--ink)]">
                    {row.firstTotal > 0 ? `${row.firstCorrect}/${row.firstTotal} (${pct}%)` : 'No attempts yet'}
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    First-attempt drill accuracy only — retries clear your queue without changing
                    these totals. Not an official 1.0–9.0 TARA score prediction.
                  </p>
                </div>
              );
            })}
          </div>

          <div className="border border-[var(--rule)] bg-[var(--surface)] p-5 space-y-3">
            <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
              First-Attempt Accuracy by Skill
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
              {stats.skills.map(([id, s]) => {
                const pct = s.firstTotal > 0 ? Math.round((s.firstCorrect / s.firstTotal) * 100) : null;
                return (
                  <div
                    key={id}
                    className="p-3 border border-[var(--rule)] bg-[var(--bg)] flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-medium text-[var(--ink)]">{s.title}</div>
                      <button
                        type="button"
                        onClick={() => onOpenLesson(s.lessonId)}
                        className="text-[11px] text-[var(--accent)] hover:underline cursor-pointer"
                      >
                        {s.moduleTitle} · Lesson →
                      </button>
                    </div>
                    <div className="font-mono-tabular text-right shrink-0">
                      <div className="text-[var(--ink)] font-semibold">
                        {pct !== null ? `${pct}%` : '—'}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)]">n={s.firstTotal}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border border-[var(--rule)] bg-[var(--surface)] p-5 space-y-3">
            <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
              Recommended TARA Study Path
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-xs">
              {TARA_DRILLS_DATA.studyPath.map((stage, i) => (
                <div key={stage.id} className="p-4 border border-[var(--rule)] bg-[var(--bg)] space-y-2">
                  <div className="font-mono-tabular text-[var(--accent)]">Stage {i + 1}</div>
                  <div className="text-sm font-semibold text-[var(--ink)]">{stage.title}</div>
                  <ul className="space-y-1.5 text-[var(--text-muted)] list-disc pl-4 leading-relaxed">
                    {stage.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
