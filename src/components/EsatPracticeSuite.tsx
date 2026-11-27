import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bookmark,
  Calendar,
  Check,
  Clock,
  Eye,
  EyeOff,
  Flame,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import esatPracticeRaw from '../data/packs/esat-practice/esat-practice.json';
import esatMocksRaw from '../data/packs/esat/esat-mocks.json';

export interface EsatPracticeOption {
  label: string;
  text: string;
}

export interface EsatPracticeQuestion {
  id: string;
  number: number;
  topic: string;
  difficulty: number;
  stem: string;
  options: EsatPracticeOption[];
  answer: string;
  explanation: string;
  moduleKey: string;
  moduleName: string;
  setId?: string;
  setTitle?: string;
}

interface RawSet {
  id: string;
  title: string;
  topics: string[];
  suggested_minutes: number;
  question_count: number;
  questions: Omit<EsatPracticeQuestion, 'moduleKey' | 'moduleName' | 'setId' | 'setTitle'>[];
}

interface RawModule {
  module: string;
  key: string;
  sets: RawSet[];
}

interface RawMockModule {
  module: string;
  key: string;
  questions: Omit<EsatPracticeQuestion, 'moduleKey' | 'moduleName'>[];
}

interface RawMock {
  id: string;
  title: string;
  modules: RawMockModule[];
}

export type EsatModuleKey = 'm1' | 'm2' | 'phys' | 'chem' | 'bio';

export const ESAT_MODULES_META: { key: EsatModuleKey; name: string; short: string; required?: boolean }[] = [
  { key: 'm1', name: 'Mathematics 1', short: 'Maths 1', required: true },
  { key: 'm2', name: 'Mathematics 2', short: 'Maths 2' },
  { key: 'phys', name: 'Physics', short: 'Physics' },
  { key: 'chem', name: 'Chemistry', short: 'Chemistry' },
  { key: 'bio', name: 'Biology', short: 'Biology' },
];

const PRACTICE_DATA = esatPracticeRaw as { modules: RawModule[] };
const MOCK_DATA = esatMocksRaw as { mocks: RawMock[] };

export const ALL_PRACTICE_SETS = PRACTICE_DATA.modules.flatMap((m) =>
  m.sets.map((s) => ({
    ...s,
    moduleKey: m.key as EsatModuleKey,
    moduleName: m.module,
    questions: s.questions.map((q) => ({
      ...q,
      moduleKey: m.key,
      moduleName: m.module,
      setId: s.id,
      setTitle: s.title,
    })) as EsatPracticeQuestion[],
  }))
);

export const ALL_PRACTICE_QUESTIONS: EsatPracticeQuestion[] = ALL_PRACTICE_SETS.flatMap(
  (s) => s.questions
);

const ALL_MOCK_QUESTIONS: EsatPracticeQuestion[] = MOCK_DATA.mocks.flatMap((mk) =>
  mk.modules.flatMap((mod) =>
    mod.questions.map((q) => ({
      ...q,
      moduleKey: mod.key,
      moduleName: mod.module,
    }))
  )
);

const ALL_ESAT_POOL: EsatPracticeQuestion[] = [...ALL_PRACTICE_QUESTIONS, ...ALL_MOCK_QUESTIONS];

export interface EsatQuestionRecord {
  attempts: number;
  correctCount: number;
  lastCorrect: boolean;
  inMistakeQueue: boolean;
  totalSeconds: number;
  flags: { tooHard?: boolean; revisit?: boolean };
  lastAnsweredAt: string;
}

const MODULES_STORAGE_KEY = 'ratio_esat_modules_v1';
const HISTORY_STORAGE_KEY = 'ratio_esat_history_v1';
const DAILY_LOG_STORAGE_KEY = 'ratio_esat_daily_completed_v1';

export function loadChosenModules(): { modules: EsatModuleKey[]; configured: boolean } {
  try {
    const raw = localStorage.getItem(MODULES_STORAGE_KEY);
    if (!raw) return { modules: ['m1', 'phys', 'm2'], configured: false };
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length >= 2) {
      const valid = parsed.filter((k): k is EsatModuleKey =>
        ['m1', 'm2', 'phys', 'chem', 'bio'].includes(k)
      );
      if (!valid.includes('m1')) valid.unshift('m1');
      return { modules: valid.slice(0, 3), configured: true };
    }
  } catch {
    // ignore
  }
  return { modules: ['m1', 'phys', 'm2'], configured: false };
}

export function saveChosenModules(modules: EsatModuleKey[]): EsatModuleKey[] {
  const unique: EsatModuleKey[] = (
    ['m1', ...modules.filter((m) => m !== 'm1')] as EsatModuleKey[]
  ).slice(0, 3);
  try {
    localStorage.setItem(MODULES_STORAGE_KEY, JSON.stringify(unique));
  } catch {
    // ignore
  }
  return unique;
}

export function loadEsatHistory(): Record<string, EsatQuestionRecord> {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveEsatHistory(h: Record<string, EsatQuestionRecord>) {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(h));
  } catch {
    // ignore
  }
}

function loadDailyCompleted(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(DAILY_LOG_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveDailyCompleted(d: Record<string, string[]>) {
  try {
    localStorage.setItem(DAILY_LOG_STORAGE_KEY, JSON.stringify(d));
  } catch {
    // ignore
  }
}

function dateKey(offsetDays = 0): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededShuffle<T>(arr: T[], seedStr: string): T[] {
  const copy = [...arr];
  let s = hashSeed(seedStr);
  for (let i = copy.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function fmtSec(total: number): string {
  const s = Math.max(0, Math.round(total));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

export function buildLeastPractisedModule(
  moduleKey: EsatModuleKey,
  history: Record<string, EsatQuestionRecord>
): { module: string; key: string; time_minutes: number; question_count: number; questions: EsatPracticeQuestion[] } {
  const meta = ESAT_MODULES_META.find((m) => m.key === moduleKey) || ESAT_MODULES_META[0];
  const candidates = ALL_ESAT_POOL.filter((q) => q.moduleKey === moduleKey);
  const ranked = [...candidates].sort((a, b) => {
    const ha = history[a.id]?.attempts || 0;
    const hb = history[b.id]?.attempts || 0;
    if (ha !== hb) return ha - hb;
    // Slight deterministic variety by id hash + current hour
    return hashSeed(a.id + dateKey()) - hashSeed(b.id + dateKey());
  });
  const picked = ranked.slice(0, 27).map((q, idx) => ({ ...q, number: idx + 1 }));
  return {
    module: meta.name,
    key: moduleKey,
    time_minutes: 40,
    question_count: picked.length,
    questions: picked,
  };
}

interface PracticeSessionConfig {
  title: string;
  subtitle: string;
  questions: EsatPracticeQuestion[];
  timed: boolean;
  revealMode: 'immediate' | 'end';
  isDaily?: boolean;
}

interface EsatPracticeSuiteProps {
  chosenModules: EsatModuleKey[];
  configured: boolean;
  onUpdateModules: (mods: EsatModuleKey[]) => void;
  history: Record<string, EsatQuestionRecord>;
  onRecordAnswer: (
    q: EsatPracticeQuestion,
    isCorrect: boolean,
    secondsSpent: number,
    isDaily?: boolean
  ) => void;
  onToggleFlag: (qId: string, flag: 'tooHard' | 'revisit') => void;
  onStartLeastPractisedMock: (moduleKey: EsatModuleKey) => void;
  onSaveAttemptSummary: (title: string, correct: number, total: number) => void;
}

export const EsatPracticeSuite: React.FC<EsatPracticeSuiteProps> = ({
  chosenModules,
  configured,
  onUpdateModules,
  history,
  onRecordAnswer,
  onToggleFlag,
  onStartLeastPractisedMock,
  onSaveAttemptSummary,
}) => {
  const [subView, setSubView] = useState<'daily' | 'sets' | 'custom' | 'review' | 'stats'>('daily');
  const [showModulePicker, setShowModulePicker] = useState(!configured);
  const [draftModules, setDraftModules] = useState<EsatModuleKey[]>(chosenModules);
  const [activeModuleFilter, setActiveModuleFilter] = useState<EsatModuleKey | 'all'>('all');

  // Custom set builder state
  const [customMod, setCustomMod] = useState<EsatModuleKey>('m1');
  const [customTopic, setCustomTopic] = useState<string>('All');
  const [customCount, setCustomCount] = useState<number>(10);
  const [customTimed, setCustomTimed] = useState<boolean>(true);
  const [customReveal, setCustomReveal] = useState<'immediate' | 'end'>('immediate');

  // Daily completion tracker
  const [dailyLog, setDailyLog] = useState<Record<string, string[]>>(() => loadDailyCompleted());

  // Active interactive runner
  const [session, setSession] = useState<PracticeSessionConfig | null>(null);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [skipped, setSkipped] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);

  // Pace timer (90s / question)
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [qElapsed, setQElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hideTimer, setHideTimer] = useState(false);

  const today = dateKey(0);

  // Deterministic Daily 5 questions (unseen first, same 5 all day)
  const dailyQuestions = useMemo(() => {
    const pool = ALL_PRACTICE_QUESTIONS.filter((q) =>
      chosenModules.includes(q.moduleKey as EsatModuleKey)
    );
    const seed = `${today}|${[...chosenModules].sort().join(',')}`;
    const unseen = pool.filter((q) => !history[q.id]?.attempts);
    const seen = pool.filter((q) => (history[q.id]?.attempts || 0) > 0);
    const ordered = [...seededShuffle(unseen, seed + ':u'), ...seededShuffle(seen, seed + ':s')];
    return ordered.slice(0, 5);
  }, [chosenModules, today, history]);

  const todayDoneIds = dailyLog[today] || [];
  const todayDailyDoneCount = dailyQuestions.filter((q) => todayDoneIds.includes(q.id)).length;

  // 28-day calendar + streak
  const calendarDays = useMemo(() => {
    const days: { key: string; label: string; count: number; complete: boolean; isToday: boolean }[] = [];
    for (let i = 27; i >= 0; i--) {
      const k = dateKey(-i);
      const count = (dailyLog[k] || []).length;
      days.push({
        key: k,
        label: k.slice(5),
        count,
        complete: count >= 5,
        isToday: i === 0,
      });
    }
    return days;
  }, [dailyLog]);

  const streak = useMemo(() => {
    let s = 0;
    // If today is complete, count from today; otherwise count up to yesterday
    const startOffset = (dailyLog[today] || []).length >= 5 ? 0 : 1;
    for (let i = startOffset; i < 365; i++) {
      if ((dailyLog[dateKey(-i)] || []).length >= 5) s++;
      else break;
    }
    return s;
  }, [dailyLog, today]);

  // Pace timer tick
  useEffect(() => {
    if (!session || finished || paused || !session.timed) return;
    const id = window.setInterval(() => {
      setTotalElapsed((t) => t + 1);
      setQElapsed((q) => q + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [session, finished, paused]);

  const startSession = (cfg: PracticeSessionConfig) => {
    if (cfg.questions.length === 0) return;
    setSession(cfg);
    setIdx(0);
    setSelected({});
    setSubmitted({});
    setSkipped({});
    setFinished(false);
    setTotalElapsed(0);
    setQElapsed(0);
    setPaused(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitCurrent = () => {
    if (!session) return;
    const q = session.questions[idx];
    const pick = selected[q.id];
    if (!pick || submitted[q.id]) return;

    const isCorrect = pick === q.answer;
    setSubmitted((prev) => ({ ...prev, [q.id]: true }));
    setSkipped((prev) => {
      const next = { ...prev };
      delete next[q.id];
      return next;
    });
    onRecordAnswer(q, isCorrect, Math.max(1, qElapsed), session.isDaily);

    if (session.isDaily) {
      setDailyLog((prev) => {
        const list = prev[today] || [];
        if (list.includes(q.id)) return prev;
        const next = { ...prev, [today]: [...list, q.id] };
        saveDailyCompleted(next);
        return next;
      });
    }

    if (session.revealMode === 'end') {
      if (idx + 1 < session.questions.length) {
        setIdx(idx + 1);
        setQElapsed(0);
      } else {
        finishSession({ ...submitted, [q.id]: true });
      }
    }
  };

  const handleSkipCurrent = () => {
    if (!session) return;
    const q = session.questions[idx];
    if (!submitted[q.id]) {
      setSkipped((prev) => ({ ...prev, [q.id]: true }));
    }
    if (idx + 1 < session.questions.length) {
      setIdx(idx + 1);
      setQElapsed(0);
    }
  };

  const finishSession = (finalSubmitted = submitted) => {
    if (!session) return;
    // In 'end' mode, record any selected-but-unsubmitted answers
    session.questions.forEach((q) => {
      if (selected[q.id] && !finalSubmitted[q.id]) {
        onRecordAnswer(q, selected[q.id] === q.answer, 90, session.isDaily);
      }
    });
    const correct = session.questions.filter((q) => selected[q.id] === q.answer).length;
    onSaveAttemptSummary(session.title, correct, session.questions.length);
    setFinished(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcuts (A-H select, Enter submit/next, Left/Right move)
  useEffect(() => {
    if (!session || finished) return;
    const q = session.questions[idx];
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      const key = e.key.toUpperCase();
      if (/^[A-H]$/.test(key) && !submitted[q.id]) {
        if (q.options.some((o) => o.label === key)) {
          e.preventDefault();
          setSelected((prev) => ({ ...prev, [q.id]: key }));
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (!submitted[q.id] && selected[q.id]) {
          handleSubmitCurrent();
        } else if (submitted[q.id]) {
          if (idx + 1 < session.questions.length) {
            setIdx(idx + 1);
            setQElapsed(0);
          } else {
            finishSession();
          }
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (idx + 1 < session.questions.length) {
          setIdx(idx + 1);
          setQElapsed(0);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (idx > 0) {
          setIdx(idx - 1);
          setQElapsed(0);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Filtered sets & queues for chosen modules
  const chosenSets = useMemo(
    () =>
      ALL_PRACTICE_SETS.filter(
        (s) =>
          chosenModules.includes(s.moduleKey) &&
          (activeModuleFilter === 'all' || s.moduleKey === activeModuleFilter)
      ),
    [chosenModules, activeModuleFilter]
  );

  const mistakeQuestions = useMemo(
    () =>
      ALL_ESAT_POOL.filter(
        (q) =>
          chosenModules.includes(q.moduleKey as EsatModuleKey) &&
          history[q.id]?.inMistakeQueue
      ),
    [chosenModules, history]
  );

  const flaggedTooHard = useMemo(
    () =>
      ALL_ESAT_POOL.filter(
        (q) =>
          chosenModules.includes(q.moduleKey as EsatModuleKey) &&
          history[q.id]?.flags?.tooHard
      ),
    [chosenModules, history]
  );

  const flaggedRevisit = useMemo(
    () =>
      ALL_ESAT_POOL.filter(
        (q) =>
          chosenModules.includes(q.moduleKey as EsatModuleKey) &&
          history[q.id]?.flags?.revisit
      ),
    [chosenModules, history]
  );

  // Topics available for Custom Set builder
  const customTopics = useMemo(() => {
    const ts = new Set<string>();
    ALL_PRACTICE_QUESTIONS.filter((q) => q.moduleKey === customMod).forEach((q) => ts.add(q.topic));
    return ['All', ...Array.from(ts).sort()];
  }, [customMod]);

  const customMatchingPool = useMemo(
    () =>
      ALL_PRACTICE_QUESTIONS.filter(
        (q) => q.moduleKey === customMod && (customTopic === 'All' || q.topic === customTopic)
      ),
    [customMod, customTopic]
  );

  // Per-topic stats for chosen modules
  const topicStats = useMemo(() => {
    const map = new Map<
      string,
      { topic: string; moduleName: string; totalQs: number; answered: number; correct: number; totalSec: number; attempts: number }
    >();
    ALL_PRACTICE_QUESTIONS.filter((q) => chosenModules.includes(q.moduleKey as EsatModuleKey)).forEach((q) => {
      const key = `${q.moduleKey}:${q.topic}`;
      const cur = map.get(key) || {
        topic: q.topic,
        moduleName: q.moduleName,
        totalQs: 0,
        answered: 0,
        correct: 0,
        totalSec: 0,
        attempts: 0,
      };
      cur.totalQs += 1;
      const rec = history[q.id];
      if (rec && rec.attempts > 0) {
        cur.answered += 1;
        cur.attempts += rec.attempts;
        cur.correct += rec.correctCount;
        cur.totalSec += rec.totalSeconds;
      }
      map.set(key, cur);
    });
    return Array.from(map.values()).sort((a, b) => a.topic.localeCompare(b.topic));
  }, [chosenModules, history]);

  // ── ACTIVE QUESTION RUNNER ──
  if (session) {
    const q = session.questions[idx];
    const isSub = !!submitted[q.id];
    const pick = selected[q.id];
    const rec = history[q.id];
    const answeredCount = Object.keys(submitted).length;
    const expectedSec = Math.max(1, answeredCount + (isSub ? 0 : 1)) * 90;
    const paceDelta = totalElapsed - expectedSec; // negative = ahead, positive = behind

    if (finished) {
      const correctCount = session.questions.filter((item) => selected[item.id] === item.answer).length;
      const pct = Math.round((correctCount / session.questions.length) * 100);
      const expectedTotal = session.questions.length * 90;
      const finalDelta = totalElapsed - expectedTotal;
      return (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-emerald-400">
                {session.title} — Complete
              </div>
              <h2 className="font-display text-3xl text-white mt-1">
                {correctCount} / {session.questions.length} ({pct}%)
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                {session.timed
                  ? `Time ${fmtSec(totalElapsed)} vs ${fmtSec(expectedTotal)} ESAT pace (${finalDelta <= 0 ? `${Math.abs(finalDelta)}s ahead` : `${finalDelta}s behind`}). `
                  : 'Untimed session. '}
                Missed questions were added to your Mistake Queue.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => startSession(session)}
                className="px-4 py-2 rounded-lg border border-white/15 hover:border-white/30 text-xs font-medium text-white inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retry
              </button>
              <button
                type="button"
                onClick={() => setSession(null)}
                className="px-4 py-2 rounded-lg bg-[#F4F4F5] hover:bg-white text-[#09090B] text-xs font-semibold cursor-pointer"
              >
                Back to ESAT Practice
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {session.questions.map((item, i) => {
              const userAns = selected[item.id];
              const ok = userAns === item.answer;
              return (
                <div key={item.id} className="rounded-xl border border-white/[0.08] bg-[#111114] p-5 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-mono-tabular text-zinc-400">
                      Q{i + 1} · {item.moduleName} · {item.topic}
                    </span>
                    <span className={ok ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                      {ok ? `Correct (${item.answer})` : `You picked ${userAns || 'Skipped'} · Answer ${item.answer}`}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-200 whitespace-pre-line leading-relaxed">{item.stem}</p>
                  <p className="text-xs text-zinc-400 leading-relaxed pt-2 border-t border-white/[0.06] whitespace-pre-line">
                    <strong className="text-zinc-200">Worked explanation: </strong>
                    {item.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        {/* Top bar with 1:30/Q Pace Timer */}
        <div className="rounded-xl border border-white/[0.08] bg-[#111114] p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-emerald-400">
              {session.title} · Q{idx + 1} / {session.questions.length}
            </div>
            <div className="text-xs text-zinc-400">
              {q.moduleName} · Spec {q.topic} · Difficulty {q.difficulty}/3 · No calculator
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {session.timed && !hideTimer && (
              <>
                <div className="px-3 py-1.5 rounded-lg border border-white/[0.09] bg-[#09090B] text-xs font-mono-tabular text-zinc-200 inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  Q: <span className={qElapsed > 90 ? 'text-amber-400 font-semibold' : 'text-white'}>{fmtSec(qElapsed)}</span>
                  <span className="text-zinc-600">|</span>
                  Total: {fmtSec(totalElapsed)}
                </div>
                <span
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono-tabular font-semibold border ${
                    paceDelta <= -5
                      ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300'
                      : paceDelta >= 10
                        ? 'border-rose-500/35 bg-rose-500/10 text-rose-300'
                        : 'border-white/15 bg-white/[0.04] text-zinc-300'
                  }`}
                >
                  {paceDelta <= -5
                    ? `Ahead of pace (-${Math.abs(paceDelta)}s)`
                    : paceDelta >= 10
                      ? `Behind pace (+${paceDelta}s)`
                      : 'On pace (1:30/Q)'}
                </span>
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  className="p-1.5 rounded-lg border border-white/10 hover:border-white/25 text-zinc-300 cursor-pointer"
                  title={paused ? 'Resume timer' : 'Pause timer'}
                >
                  {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
              </>
            )}
            {session.timed && (
              <button
                type="button"
                onClick={() => setHideTimer((h) => !h)}
                className="px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-white/25 text-[11px] text-zinc-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
              >
                {hideTimer ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {hideTimer ? 'Show timer' : 'Hide timer'}
              </button>
            )}
            <button
              type="button"
              onClick={() => finishSession()}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#09090B] text-xs font-semibold cursor-pointer"
            >
              Finish
            </button>
            <button
              type="button"
              onClick={() => setSession(null)}
              className="px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-white/25 text-xs text-zinc-400 hover:text-white cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-5">
          {/* Question Card */}
          <div className="lg:col-span-9 rounded-2xl border border-white/[0.08] bg-[#111114] p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono-tabular text-zinc-500">
                Keys: A–H select · Enter submit/next · ←/→ navigate
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleFlag(q.id, 'tooHard')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium border inline-flex items-center gap-1 cursor-pointer transition-colors ${
                    rec?.flags?.tooHard
                      ? 'border-rose-500/45 bg-rose-500/15 text-rose-300'
                      : 'border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" /> Too hard
                </button>
                <button
                  type="button"
                  onClick={() => onToggleFlag(q.id, 'revisit')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium border inline-flex items-center gap-1 cursor-pointer transition-colors ${
                    rec?.flags?.revisit
                      ? 'border-amber-500/45 bg-amber-500/15 text-amber-300'
                      : 'border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-3 h-3" /> Revisit
                </button>
              </div>
            </div>

            <div className="text-base text-zinc-100 leading-relaxed whitespace-pre-line">
              {q.stem}
            </div>

            <div className="space-y-2.5">
              {q.options.map((opt) => {
                const isPicked = pick === opt.label;
                const revealNow = isSub && session.revealMode === 'immediate';
                const isAnswer = opt.label === q.answer;
                let style = 'border-white/[0.09] bg-[#09090B] text-zinc-200 hover:border-white/25';
                if (revealNow) {
                  if (isAnswer) style = 'border-emerald-500/60 bg-emerald-500/15 text-white';
                  else if (isPicked) style = 'border-rose-500/60 bg-rose-500/15 text-rose-200';
                  else style = 'border-white/[0.06] bg-[#09090B] text-zinc-500';
                } else if (isPicked) {
                  style = 'border-emerald-500/60 bg-emerald-500/12 text-white';
                }
                return (
                  <button
                    key={opt.label}
                    type="button"
                    disabled={isSub}
                    onClick={() => setSelected((prev) => ({ ...prev, [q.id]: opt.label }))}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors flex items-start gap-3 cursor-pointer disabled:cursor-default ${style}`}
                  >
                    <span className="font-mono-tabular font-semibold text-xs px-2 py-0.5 rounded bg-white/[0.06] shrink-0 mt-0.5">
                      {opt.label}
                    </span>
                    <span className="leading-relaxed">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {isSub && session.revealMode === 'immediate' && (
              <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4 space-y-1.5">
                <div className="text-xs font-semibold text-emerald-300">
                  {pick === q.answer ? `Correct — ${q.answer}` : `Incorrect — Correct answer is ${q.answer}`}
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-line">
                  {q.explanation}
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/[0.07]">
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => {
                  setIdx(idx - 1);
                  setQElapsed(0);
                }}
                className="px-3.5 py-2 rounded-lg border border-white/10 text-xs text-zinc-300 disabled:opacity-40 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous
              </button>

              <div className="flex items-center gap-2">
                {!isSub && (
                  <button
                    type="button"
                    onClick={handleSkipCurrent}
                    className="px-3.5 py-2 rounded-lg border border-white/10 hover:border-white/25 text-xs text-zinc-300 cursor-pointer"
                  >
                    Skip
                  </button>
                )}
                {!isSub ? (
                  <button
                    type="button"
                    disabled={!pick}
                    onClick={handleSubmitCurrent}
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-[#09090B] text-xs font-semibold cursor-pointer"
                  >
                    Submit Answer
                  </button>
                ) : idx + 1 < session.questions.length ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIdx(idx + 1);
                      setQElapsed(0);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#F4F4F5] hover:bg-white text-[#09090B] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    Next Question <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => finishSession()}
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#09090B] text-xs font-semibold cursor-pointer"
                  >
                    View Summary
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Progress Grid */}
          <div className="lg:col-span-3 rounded-2xl border border-white/[0.08] bg-[#111114] p-4 space-y-3 h-fit">
            <div className="text-xs font-semibold text-white">Progress Grid</div>
            <div className="grid grid-cols-5 gap-1.5">
              {session.questions.map((item, i) => {
                const sub = !!submitted[item.id];
                const ok = sub && selected[item.id] === item.answer;
                const wrong = sub && selected[item.id] !== item.answer;
                const sk = !!skipped[item.id] && !sub;
                const cur = i === idx;
                let cls = 'bg-[#09090B] border-white/[0.09] text-zinc-400';
                if (ok) cls = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200';
                else if (wrong) cls = 'bg-rose-500/20 border-rose-500/50 text-rose-200';
                else if (sk) cls = 'bg-amber-500/20 border-amber-500/50 text-amber-200';
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setIdx(i);
                      setQElapsed(0);
                    }}
                    className={`h-8 rounded-md border text-xs font-mono-tabular cursor-pointer ${cls} ${
                      cur ? 'ring-2 ring-white/70' : ''
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <div className="text-[11px] text-zinc-500 space-y-1 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/40 inline-block" /> Correct</div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500/40 inline-block" /> Wrong (→ Mistake Queue)</div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500/40 inline-block" /> Skipped</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN HUB ──
  const toggleDraftModule = (key: EsatModuleKey) => {
    if (key === 'm1') return; // required
    setDraftModules((prev) => {
      if (prev.includes(key)) {
        return prev.length > 2 ? prev.filter((k) => k !== key) : prev;
      }
      if (prev.length >= 3) {
        return ['m1', prev[2], key];
      }
      return [...prev, key];
    });
  };

  return (
    <div className="space-y-6">
      {/* First-use / Settings Module Picker */}
      {showModulePicker ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-[#111114] p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-emerald-400">
                Choose Your ESAT Modules
              </div>
              <h3 className="font-display text-2xl text-white mt-0.5">
                Mathematics 1 + 1 or 2 additional modules
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Daily questions, topic sets, mistake queue, and stats focus strictly on your chosen modules. Changeable anytime.
              </p>
            </div>
            {configured && (
              <button
                type="button"
                onClick={() => setShowModulePicker(false)}
                className="p-1.5 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-5 gap-2.5">
            {ESAT_MODULES_META.map((m) => {
              const active = draftModules.includes(m.key);
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => toggleDraftModule(m.key)}
                  className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    active
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-white'
                      : 'border-white/[0.09] bg-[#09090B] text-zinc-400 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{m.short}</span>
                    {active && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1">
                    {m.required ? 'Required' : active ? 'Selected' : 'Optional'}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-xs text-zinc-400">
              Selected: {draftModules.map((k) => ESAT_MODULES_META.find((m) => m.key === k)?.short).join(' · ')} ({draftModules.length} modules)
            </span>
            <button
              type="button"
              disabled={draftModules.length < 2}
              onClick={() => {
                onUpdateModules(draftModules);
                setShowModulePicker(false);
              }}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-[#09090B] text-xs font-semibold cursor-pointer"
            >
              Save Modules
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.08] bg-[#111114] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-zinc-500">Active modules:</span>
            {chosenModules.map((k) => (
              <span
                key={k}
                className="px-2.5 py-0.5 rounded-full bg-emerald-500/12 border border-emerald-500/30 text-emerald-300 font-medium"
              >
                {ESAT_MODULES_META.find((m) => m.key === k)?.name}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setDraftModules(chosenModules);
              setShowModulePicker(true);
            }}
            className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Settings2 className="w-3.5 h-3.5" /> Change modules
          </button>
        </div>
      )}

      {/* Sub-navigation */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'daily', label: `Daily 5 (${todayDailyDoneCount}/5)`, icon: Flame },
          { id: 'sets', label: `Topic Sets (${chosenSets.length * 10} Qs)`, icon: Target },
          { id: 'custom', label: 'Custom Set', icon: SlidersHorizontal },
          { id: 'review', label: `Mistakes (${mistakeQuestions.length}) & Flags`, icon: Bookmark },
          { id: 'stats', label: 'Stats & Coverage', icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = subView === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubView(tab.id as typeof subView)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 border transition-colors cursor-pointer ${
                active
                  ? 'bg-[#F4F4F5] text-[#09090B] border-transparent font-semibold'
                  : 'border-white/[0.09] bg-[#111114] text-zinc-300 hover:text-white hover:border-white/25'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. DAILY 5 + STREAK + 28-DAY CALENDAR + LEAST-PRACTISED MOCK */}
      {subView === 'daily' && (
        <div className="grid lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#111114] p-6 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-emerald-400">
                  Daily Questions · {today}
                </div>
                <h3 className="font-display text-2xl text-white mt-1">
                  Today’s 5 ESAT Questions
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Drawn from your chosen modules, unseen questions first, locked for today. Target pace: 1:30 per question (7:30 total).
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-mono-tabular font-semibold inline-flex items-center gap-1.5 shrink-0">
                <Flame className="w-3.5 h-3.5" /> {streak}d streak
              </div>
            </div>

            <div className="space-y-2">
              {dailyQuestions.map((q, i) => {
                const done = todayDoneIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    className="px-3.5 py-2.5 rounded-lg border border-white/[0.07] bg-[#09090B] flex items-center justify-between text-xs"
                  >
                    <span className="text-zinc-200">
                      <span className="font-mono-tabular text-zinc-500 mr-2">#{i + 1}</span>
                      {q.moduleName} · Spec {q.topic}
                    </span>
                    <span className={done ? 'text-emerald-400 font-semibold' : 'text-zinc-500'}>
                      {done ? 'Done' : `Diff ${q.difficulty}/3`}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() =>
                startSession({
                  title: `Daily 5 (${today})`,
                  subtitle: 'Seeded daily set at 1:30/Q pace',
                  questions: dailyQuestions,
                  timed: true,
                  revealMode: 'immediate',
                  isDaily: true,
                })
              }
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#09090B] text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              {todayDailyDoneCount >= 5 ? 'Review Today’s 5 Questions' : 'Start Today’s 5 Questions (7:30 pace)'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-5 space-y-5">
            {/* 28-day calendar */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" /> 28-Day Daily Calendar
                </span>
                <span className="text-[11px] font-mono-tabular text-zinc-500">5 Qs = complete</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {calendarDays.map((d) => (
                  <div
                    key={d.key}
                    title={`${d.key}: ${d.count}/5`}
                    className={`h-8 rounded-md border flex items-center justify-center text-[10px] font-mono-tabular ${
                      d.complete
                        ? 'bg-emerald-500/25 border-emerald-500/50 text-emerald-200 font-semibold'
                        : d.count > 0
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                          : 'bg-[#09090B] border-white/[0.06] text-zinc-600'
                    } ${d.isToday ? 'ring-1 ring-white/70' : ''}`}
                  >
                    {d.key.slice(8)}
                  </div>
                ))}
              </div>
            </div>

            {/* Mock from least practised */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <div className="text-xs font-semibold text-white">Generate 27-Q / 40-Min Mock (Least Practised)</div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Builds a full 27-question, 40-minute no-calculator module from the questions you have attempted least.
              </p>
              <div className="flex flex-wrap gap-2">
                {chosenModules.map((k) => {
                  const meta = ESAT_MODULES_META.find((m) => m.key === k)!;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => onStartLeastPractisedMock(k)}
                      className="px-3 py-1.5 rounded-lg border border-white/12 hover:border-emerald-400/50 bg-[#09090B] text-xs font-medium text-white cursor-pointer transition-colors"
                    >
                      {meta.short} (27 Qs) →
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PER-MODULE TOPIC SETS (400 MCQs) */}
      {subView === 'sets' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveModuleFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs border cursor-pointer ${
                activeModuleFilter === 'all'
                  ? 'border-emerald-500/50 bg-emerald-500/12 text-emerald-300 font-semibold'
                  : 'border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              All Chosen Modules
            </button>
            {chosenModules.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setActiveModuleFilter(k)}
                className={`px-3 py-1.5 rounded-lg text-xs border cursor-pointer ${
                  activeModuleFilter === k
                    ? 'border-emerald-500/50 bg-emerald-500/12 text-emerald-300 font-semibold'
                    : 'border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                {ESAT_MODULES_META.find((m) => m.key === k)?.name}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {chosenSets.map((s) => {
              const done = s.questions.filter((q) => (history[q.id]?.attempts || 0) > 0).length;
              const right = s.questions.filter((q) => history[q.id]?.lastCorrect).length;
              return (
                <div
                  key={s.id}
                  className="rounded-xl border border-white/[0.08] bg-[#111114] p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono-tabular">
                      <span className="text-emerald-400 uppercase">{s.moduleName}</span>
                      <span className="text-zinc-500">{s.question_count} Qs · {s.suggested_minutes} min</span>
                    </div>
                    <h4 className="text-base font-semibold text-white">{s.title}</h4>
                    <div className="flex flex-wrap gap-1">
                      {s.topics.slice(0, 6).map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono-tabular text-zinc-400">
                          {t}
                        </span>
                      ))}
                      {s.topics.length > 6 && (
                        <span className="text-[10px] font-mono-tabular text-zinc-500">+{s.topics.length - 6}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                    <span className="text-xs font-mono-tabular text-zinc-400">
                      {done > 0 ? `${done}/${s.question_count} done · ${right} correct` : 'Not started'}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        startSession({
                          title: `${s.moduleName}: ${s.title}`,
                          subtitle: `${s.question_count} Qs · ${s.suggested_minutes} min`,
                          questions: s.questions,
                          timed: true,
                          revealMode: 'immediate',
                        })
                      }
                      className="px-3.5 py-1.5 rounded-lg bg-[#F4F4F5] hover:bg-white text-[#09090B] text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      Practice <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. CUSTOM SET BUILDER */}
      {subView === 'custom' && (
        <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-6 space-y-5 max-w-2xl">
          <div>
            <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-emerald-400">
              Custom Set Builder
            </div>
            <h3 className="font-display text-2xl text-white mt-0.5">
              Build a targeted ESAT drill
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="space-y-1.5 text-xs">
              <span className="text-zinc-400">Module</span>
              <select
                value={customMod}
                onChange={(e) => {
                  setCustomMod(e.target.value as EsatModuleKey);
                  setCustomTopic('All');
                }}
                className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-white/12 text-white text-xs"
              >
                {ESAT_MODULES_META.map((m) => (
                  <option key={m.key} value={m.key}>{m.name}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5 text-xs">
              <span className="text-zinc-400">Spec Topic</span>
              <select
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-white/12 text-white text-xs"
              >
                {customTopics.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5 text-xs">
              <span className="text-zinc-400">Number of Questions (max {customMatchingPool.length})</span>
              <select
                value={customCount}
                onChange={(e) => setCustomCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-white/12 text-white text-xs"
              >
                {[5, 10, 15, 20, 27].map((n) => (
                  <option key={n} value={n}>{n} questions ({fmtSec(n * 90)} ESAT pace)</option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5 text-xs">
              <span className="text-zinc-400">Answer Reveal</span>
              <select
                value={customReveal}
                onChange={(e) => setCustomReveal(e.target.value as 'immediate' | 'end')}
                className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-white/12 text-white text-xs"
              >
                <option value="immediate">Immediately after each question</option>
                <option value="end">At end of set (exam style)</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.07]">
            <label className="inline-flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={customTimed}
                onChange={(e) => setCustomTimed(e.target.checked)}
                className="accent-emerald-500"
              />
              Enable 1:30/Q pace timer (expected {fmtSec(Math.min(customCount, customMatchingPool.length) * 90)})
            </label>

            <button
              type="button"
              disabled={customMatchingPool.length === 0}
              onClick={() => {
                const count = Math.min(customCount, customMatchingPool.length);
                const picked = seededShuffle(customMatchingPool, String(Date.now())).slice(0, count);
                startSession({
                  title: `Custom ${ESAT_MODULES_META.find((m) => m.key === customMod)?.short}${customTopic !== 'All' ? ` (${customTopic})` : ''}`,
                  subtitle: `${count} Qs`,
                  questions: picked,
                  timed: customTimed,
                  revealMode: customReveal,
                });
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-[#09090B] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              Start Custom Set ({Math.min(customCount, customMatchingPool.length)} Qs) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 4. MISTAKE BANK & FLAGGED LIST */}
      {subView === 'review' && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-rose-500/25 bg-[#111114] p-5 flex flex-col justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-rose-400">
                Mistake Queue
              </div>
              <div className="font-display text-3xl text-white mt-1">{mistakeQuestions.length} Qs</div>
              <p className="text-xs text-zinc-400 mt-1">
                Wrong answers stay in this queue until you answer them correctly.
              </p>
            </div>
            <button
              type="button"
              disabled={mistakeQuestions.length === 0}
              onClick={() =>
                startSession({
                  title: 'ESAT Mistake Queue',
                  subtitle: 'Answer correctly to clear from queue',
                  questions: mistakeQuestions,
                  timed: true,
                  revealMode: 'immediate',
                })
              }
              className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-40 text-[#09090B] text-xs font-semibold cursor-pointer"
            >
              Drill Mistake Queue
            </button>
          </div>

          <div className="rounded-2xl border border-amber-500/25 bg-[#111114] p-5 flex flex-col justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-amber-400">
                Flagged: Revisit
              </div>
              <div className="font-display text-3xl text-white mt-1">{flaggedRevisit.length} Qs</div>
              <p className="text-xs text-zinc-400 mt-1">
                Questions you bookmarked to revisit later.
              </p>
            </div>
            <button
              type="button"
              disabled={flaggedRevisit.length === 0}
              onClick={() =>
                startSession({
                  title: 'Flagged: Revisit',
                  subtitle: 'Bookmarked questions',
                  questions: flaggedRevisit,
                  timed: true,
                  revealMode: 'immediate',
                })
              }
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-[#09090B] text-xs font-semibold cursor-pointer"
            >
              Practice Revisit List
            </button>
          </div>

          <div className="rounded-2xl border border-white/[0.1] bg-[#111114] p-5 flex flex-col justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-zinc-400">
                Flagged: Too Hard
              </div>
              <div className="font-display text-3xl text-white mt-1">{flaggedTooHard.length} Qs</div>
              <p className="text-xs text-zinc-400 mt-1">
                Tough questions to return to after reviewing formula sheets.
              </p>
            </div>
            <button
              type="button"
              disabled={flaggedTooHard.length === 0}
              onClick={() =>
                startSession({
                  title: 'Flagged: Too Hard',
                  subtitle: 'Challenging questions',
                  questions: flaggedTooHard,
                  timed: false,
                  revealMode: 'immediate',
                })
              }
              className="w-full py-2.5 rounded-xl bg-[#F4F4F5] hover:bg-white disabled:opacity-40 text-[#09090B] text-xs font-semibold cursor-pointer"
            >
              Review Too-Hard List
            </button>
          </div>
        </div>
      )}

      {/* 5. STATS & COVERAGE GRID */}
      {subView === 'stats' && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-semibold text-white">Spec Topic Coverage Grid</div>
              <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-zinc-800 border border-white/10 inline-block" /> Untouched</span>
                <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500/30 border border-amber-500/50 inline-block" /> Shaky (&lt;5 or &lt;70%)</span>
                <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/30 border border-emerald-500/50 inline-block" /> Solid (≥5 at ≥70%)</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {topicStats.map((t) => {
                const acc = t.attempts > 0 ? Math.round((t.correct / t.attempts) * 100) : 0;
                const avgSec = t.attempts > 0 ? Math.round(t.totalSec / t.attempts) : 0;
                const solid = t.answered >= 5 && acc >= 70;
                const shaky = t.answered > 0 && !solid;
                return (
                  <div
                    key={`${t.moduleName}-${t.topic}`}
                    title={`${t.moduleName} ${t.topic}: ${t.answered}/${t.totalQs} answered, ${acc}% accuracy, avg ${avgSec}s/Q`}
                    className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-mono-tabular ${
                      solid
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                        : shaky
                          ? 'bg-amber-500/18 border-amber-500/45 text-amber-200'
                          : 'bg-[#09090B] border-white/[0.08] text-zinc-500'
                    }`}
                  >
                    {t.topic} {t.answered > 0 ? `· ${acc}%` : ''}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#111114] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/[0.07] text-xs font-semibold text-white">
              Accuracy & Average Pace by Spec Topic
            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.02] text-zinc-400 font-mono-tabular uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-2.5">Topic</th>
                    <th className="px-4 py-2.5">Module</th>
                    <th className="px-4 py-2.5">Answered</th>
                    <th className="px-4 py-2.5">Accuracy</th>
                    <th className="px-4 py-2.5">Avg Time/Q</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {topicStats.map((t) => {
                    const acc = t.attempts > 0 ? Math.round((t.correct / t.attempts) * 100) : null;
                    const avgSec = t.attempts > 0 ? Math.round(t.totalSec / t.attempts) : null;
                    return (
                      <tr key={`${t.moduleName}-${t.topic}`} className="text-zinc-300">
                        <td className="px-4 py-2 font-mono-tabular text-white">{t.topic}</td>
                        <td className="px-4 py-2">{t.moduleName}</td>
                        <td className="px-4 py-2 font-mono-tabular">{t.answered} / {t.totalQs}</td>
                        <td className="px-4 py-2 font-mono-tabular">
                          {acc === null ? '—' : `${acc}%`}
                        </td>
                        <td className="px-4 py-2 font-mono-tabular">
                          {avgSec === null ? '—' : `${avgSec}s`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
