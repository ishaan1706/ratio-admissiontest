import React, { useEffect, useMemo, useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  Lightbulb,
  Play,
  RotateCcw,
  Save,
  Sparkles,
  Activity,
} from 'lucide-react';
import { ESSAY_RUBRIC, ESSAY_SETS } from '../data/essays';
import { EssayPrompt, EssaySet, SectionBEssayRecord } from '../types';

interface EssayStudioProps {
  savedEssays: SectionBEssayRecord[];
  onSaveEssay: (record: SectionBEssayRecord) => Promise<void>;
}

function formatTimer(seconds: number): string {
  const s = Math.max(0, seconds);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${String(m).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
}

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

const COUNTER_MARKERS =
  /\b(however|nevertheless|nonetheless|admittedly|critics|opponents|conversely|on the other hand|yet|although|while some argue|objection)\b/i;

export const EssayStudio: React.FC<EssayStudioProps> = ({ savedEssays, onSaveEssay }) => {
  const [selectedSet, setSelectedSet] = useState<EssaySet>(ESSAY_SETS[0]);
  const [activePrompt, setActivePrompt] = useState<EssayPrompt | null>(null);
  const [planText, setPlanText] = useState('');
  const [essayText, setEssayText] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(40 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [spellcheckOff, setSpellcheckOff] = useState(true);
  const [showHints, setShowHints] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rubricScores, setRubricScores] = useState<Record<string, number>>({
    directness: 4,
    coherence: 4,
    counter: 3,
    clarity: 4,
    evidence: 3,
  });
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (!timerRunning || submitted) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerRunning, submitted]);

  const wordCount = countWords(essayText);

  const telemetry = useMemo(() => {
    const paragraphs = essayText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    const hasCounter = COUNTER_MARKERS.test(essayText);
    const inSweetSpot = wordCount >= 500 && wordCount <= 650;
    const overMax = wordCount > 750;
    return {
      paragraphCount: paragraphs.length,
      hasCounter,
      inSweetSpot,
      overMax,
      progressPct: Math.min(100, Math.round((wordCount / 600) * 100)),
    };
  }, [essayText, wordCount]);

  const startPrompt = (prompt: EssayPrompt) => {
    setActivePrompt(prompt);
    setPlanText('');
    setEssayText('');
    setSecondsLeft(40 * 60);
    setTimerRunning(true);
    setShowHints(false);
    setSubmitted(false);
    setSavedNotice(false);
  };

  const handleFinishAndReview = () => {
    if (!activePrompt) return;
    setTimerRunning(false);
    setSubmitted(true);
  };

  const handleSaveRecord = async () => {
    if (!activePrompt) return;
    const record: SectionBEssayRecord = {
      id: `essay-${Date.now()}`,
      prompt_id: activePrompt.id,
      prompt_text: activePrompt.question,
      set_title: selectedSet.title,
      plan_text: planText,
      essay_text: essayText,
      word_count: wordCount,
      duration_seconds: Math.max(1, 40 * 60 - secondsLeft),
      rubric_scores: rubricScores,
      created_at: new Date().toISOString(),
    };
    await onSaveEssay(record);
    setSavedNotice(true);
  };

  if (!activePrompt) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-24 lg:pb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-4xl text-[var(--text)]">
              Section B · 40-Minute Essay Studio
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Pick 1 of 3 prompts (official LNAT format), write with spellcheck off and live
              argument telemetry (500–600 word official sweet spot, 750 max), then compare with a
              top-band model outline.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] bg-[var(--emerald-soft)] text-[var(--emerald)] text-xs font-medium shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            All 3 paper sets unlocked
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {ESSAY_SETS.map((set) => {
            const active = set.id === selectedSet.id;
            return (
              <button
                key={set.id}
                type="button"
                onClick={() => setSelectedSet(set)}
                className={`px-4 py-2 rounded-[8px] text-xs font-semibold border transition-colors cursor-pointer ${
                  active
                    ? 'border-[#0F172A] bg-[#0F172A] text-white'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--border-strong)]'
                }`}
              >
                {set.title}
              </button>
            );
          })}
        </div>

        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 space-y-5">
          <div className="border-b border-[var(--border)] pb-3.5">
            <h2 className="font-display text-2xl text-[var(--text)]">{selectedSet.title}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{selectedSet.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {selectedSet.prompts.map((prompt, i) => (
              <div
                key={prompt.id}
                className="p-5 rounded-[10px] border border-[var(--border)] bg-[var(--bg)] flex flex-col justify-between gap-5"
              >
                <div className="space-y-2.5">
                  <div className="text-[11px] font-mono-tabular uppercase tracking-wide text-[var(--accent)] font-semibold">
                    Option {i + 1} · {prompt.theme}
                  </div>
                  <p className="font-serif-editorial text-lg text-[var(--text)] leading-snug">
                    {prompt.question}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => startPrompt(prompt)}
                  className="w-full py-2.5 px-3 rounded-[8px] bg-[var(--primary-action)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" /> Start 40-min essay
                </button>
              </div>
            ))}
          </div>
        </div>

        {savedEssays.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-semibold text-base text-[var(--text)]">Recent Saved Essays</h2>
            <div className="divide-y divide-[var(--border)] rounded-[12px] border border-[var(--border)] bg-[var(--surface)]">
              {savedEssays.slice(0, 5).map((e) => {
                const avgRubric =
                  Object.values(e.rubric_scores).reduce((a, b) => a + b, 0) /
                  Math.max(1, Object.values(e.rubric_scores).length);
                return (
                  <div
                    key={e.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium text-[var(--text)]">{e.prompt_text}</div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {e.set_title} ·{' '}
                        {new Date(e.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono-tabular shrink-0">
                      <span className="px-2 py-1 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]">
                        {e.word_count} words
                      </span>
                      <span className="px-2 py-1 rounded bg-[var(--accent-soft)] text-[var(--accent)] font-semibold">
                        Rubric {avgRubric.toFixed(1)}/5
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5 pb-24 lg:pb-12">
      {/* Top toolbar */}
      <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActivePrompt(null)}
            className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Change prompt
          </button>
          <span className="text-xs text-[var(--border-strong)]">|</span>
          <span className="text-xs font-semibold text-[var(--accent)]">{activePrompt.theme}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSpellcheckOff((v) => !v)}
            className="px-2.5 py-1 rounded-[7px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text-muted)] hover:text-[var(--text)] inline-flex items-center gap-1.5 cursor-pointer"
          >
            {spellcheckOff ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            Spellcheck: {spellcheckOff ? 'Off (Exam)' : 'On'}
          </button>

          <div
            className={`px-2.5 py-1 rounded-[7px] font-mono-tabular text-xs font-semibold border inline-flex items-center gap-1.5 ${
              secondsLeft <= 300
                ? 'border-[var(--crimson)] bg-[var(--crimson-soft)] text-[var(--crimson)]'
                : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text)]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            {formatTimer(secondsLeft)}
          </div>

          {!submitted && (
            <button
              type="button"
              onClick={handleFinishAndReview}
              className="px-3.5 py-1.5 rounded-[7px] bg-[var(--primary-action)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold cursor-pointer"
            >
              Finish &amp; Self-Assess
            </button>
          )}
        </div>
      </div>

      {/* Prompt banner */}
      <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl sm:text-3xl text-[var(--text)] leading-snug">
            {activePrompt.question}
          </h2>
          <button
            type="button"
            onClick={() => setShowHints((v) => !v)}
            className="px-3 py-1.5 rounded-[7px] border border-[var(--border)] bg-[var(--bg)] text-xs font-semibold text-[var(--accent)] inline-flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            {showHints ? 'Hide hints' : 'Tutor hints'}
          </button>
        </div>

        {showHints && (
          <div className="p-4 rounded-[9px] bg-[var(--bg)] border border-[var(--border)] space-y-2 text-xs text-[var(--text)]">
            <div className="font-semibold text-[var(--accent)]">Admissions Tutor Angles:</div>
            <ul className="list-disc pl-4 space-y-1 text-[var(--text-muted)]">
              {activePrompt.planningHints.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
            <div className="font-semibold text-[var(--text)] pt-1">Key Tensions to Address:</div>
            <ul className="list-disc pl-4 space-y-1 text-[var(--text-muted)]">
              {activePrompt.counterArguments.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Main Writing Workspace with Live Telemetry */}
      <div className="grid lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4 space-y-4">
          {/* Live Argument Telemetry */}
          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--text)]">
              <span className="inline-flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[var(--accent)]" />
                Live Essay Telemetry
              </span>
              <span
                className={`font-mono-tabular ${
                  telemetry.overMax
                    ? 'text-[var(--crimson)]'
                    : telemetry.inSweetSpot
                      ? 'text-[var(--emerald)]'
                      : 'text-[var(--text-muted)]'
                }`}
              >
                {wordCount} / 600w
              </span>
            </div>
            <div className="h-2 rounded-full bg-[var(--bg)] overflow-hidden border border-[var(--border)]">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${telemetry.progressPct}%`,
                  backgroundColor: telemetry.overMax
                    ? 'var(--crimson)'
                    : telemetry.inSweetSpot
                      ? 'var(--emerald)'
                      : 'var(--accent)',
                }}
              />
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Paragraph structure</span>
                <span className="font-mono-tabular font-semibold text-[var(--text)]">
                  {telemetry.paragraphCount} {telemetry.paragraphCount === 1 ? 'para' : 'paras'}{' '}
                  (aim 4–5)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Counter-argument pivot</span>
                <span
                  className={`font-medium ${
                    telemetry.hasCounter ? 'text-[var(--emerald)]' : 'text-[var(--text-muted)]'
                  }`}
                >
                  {telemetry.hasCounter ? 'Detected' : 'Not yet'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Official LNAT cap</span>
                <span
                  className={`font-mono-tabular font-medium ${
                    telemetry.overMax ? 'text-[var(--crimson)]' : 'text-[var(--emerald)]'
                  }`}
                >
                  {telemetry.overMax ? 'Over 750 max' : 'Within 750 max'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text)] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[var(--accent)]" />
              5-Minute Plan Scratchpad
            </label>
            <textarea
              value={planText}
              onChange={(e) => setPlanText(e.target.value)}
              disabled={submitted}
              rows={11}
              placeholder={
                'Thesis:\n\nPoint 1:\n\nPoint 2:\n\nStrongest Counter-Argument + Rebuttal:\n\nConclusion:'
              }
              className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-3.5 text-sm text-[var(--text)] leading-relaxed focus:outline-none focus:border-[var(--accent)] resize-y"
            />
          </div>
        </div>

        <div className="lg:col-span-8 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-[var(--text)]">Essay Response</label>
            <span className="text-[var(--text-muted)]">
              Official LNAT guidance: 500–600 words ideal · 750 max
            </span>
          </div>
          <textarea
            value={essayText}
            onChange={(e) => setEssayText(e.target.value)}
            disabled={submitted}
            spellCheck={!spellcheckOff}
            rows={19}
            placeholder="Write a clear, economical argument directly answering the question. Open with a sharp thesis, develop two distinct points, steelman and rebut the strongest counter-argument, and close cleanly..."
            className="w-full rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 font-serif-editorial text-base text-[var(--text)] leading-[1.78] focus:outline-none focus:border-[var(--accent)] resize-y"
          />
        </div>
      </div>

      {/* Post-submission Rubric & Model Breakdown */}
      {submitted && (
        <div className="grid lg:grid-cols-2 gap-5 pt-2">
          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl text-[var(--text)]">
                Admissions Tutor Self-Assessment
              </h3>
              <span className="font-mono-tabular text-xs font-bold text-[var(--accent)]">
                {(
                  Object.values(rubricScores).reduce((a, b) => a + b, 0) / ESSAY_RUBRIC.length
                ).toFixed(1)}{' '}
                / 5.0
              </span>
            </div>

            <div className="space-y-3.5">
              {ESSAY_RUBRIC.map((item) => (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[var(--text)]">{item.label}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          type="button"
                          onClick={() =>
                            setRubricScores((prev) => ({ ...prev, [item.id]: score }))
                          }
                          className={`w-6 h-6 rounded font-mono-tabular text-xs font-semibold cursor-pointer ${
                            rubricScores[item.id] === score
                              ? 'bg-[var(--accent)] text-white'
                              : 'bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)]'
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">{item.hint}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSaveRecord}
              className="w-full py-2.5 rounded-[8px] bg-[var(--primary-action)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {savedNotice ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Saved to Progress Log
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Essay &amp; Rubric Score
                </>
              )}
            </button>
          </div>

          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 space-y-4">
            <h3 className="font-display text-2xl text-[var(--text)]">Top-Band Model Breakdown</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
                  Core Thesis
                </div>
                <p className="text-[var(--text)] mt-1 leading-relaxed">
                  {activePrompt.modelOutline.thesis}
                </p>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
                  Argument Spine
                </div>
                <ul className="list-disc pl-4 mt-1 space-y-1 text-xs text-[var(--text-muted)] leading-relaxed">
                  {activePrompt.modelOutline.points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
                  Counter-Argument &amp; Rebuttal
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                  {activePrompt.modelOutline.counterRebuttal}
                </p>
              </div>
              <div className="p-3.5 rounded-[9px] bg-[var(--bg)] border border-[var(--border)]">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-1">
                  Sample First-Class Opening Paragraph
                </div>
                <p className="font-serif-editorial text-sm text-[var(--text)] leading-relaxed italic">
                  “{activePrompt.modelOutline.sampleOpening}”
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
