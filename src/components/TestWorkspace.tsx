import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  Clock,
  ExternalLink,
  RotateCcw,
  X,
} from 'lucide-react';
import { AdmissionsTest, PracticeQuestion } from '../data/allTests';

export interface GenericAttempt {
  id: string;
  testId: string;
  testCode: string;
  correct: number;
  total: number;
  createdAt: string;
}

const GENERIC_ATTEMPTS_KEY = 'ratio_all_tests_attempts_v1';

export function loadGenericAttempts(): GenericAttempt[] {
  try {
    const raw = localStorage.getItem(GENERIC_ATTEMPTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveGenericAttempt(attempt: GenericAttempt): GenericAttempt[] {
  const next = [attempt, ...loadGenericAttempts()].slice(0, 50);
  try {
    localStorage.setItem(GENERIC_ATTEMPTS_KEY, JSON.stringify(next));
  } catch {
    // ignore storage errors
  }
  return next;
}

interface UniversalTestViewProps {
  test: AdmissionsTest;
  subTab: 'practice' | 'resources' | 'progress';
  attempts: GenericAttempt[];
  onSaveAttempt: (attempt: GenericAttempt) => void;
}

export const UniversalTestView: React.FC<UniversalTestViewProps> = ({
  test,
  subTab,
  attempts,
  onSaveAttempt,
}) => {
  const [drilling, setDrilling] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(8 * 60);

  // TARA writing box state
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [writingDraft, setWritingDraft] = useState('');

  // Reset drill state whenever user switches exam
  useEffect(() => {
    setDrilling(false);
    setFinished(false);
    setQIdx(0);
    setAnswers({});
    setSecondsLeft(8 * 60);
    setSelectedPrompt(0);
    setWritingDraft('');
  }, [test.id]);

  useEffect(() => {
    if (!drilling || finished) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [drilling, finished]);

  const startDrill = () => {
    setAnswers({});
    setQIdx(0);
    setFinished(false);
    setSecondsLeft(Math.max(5, test.questions.length * 2) * 60);
    setDrilling(true);
  };

  const finishDrill = () => {
    const correct = test.questions.filter((q) => answers[q.id] === q.correctIndex).length;
    onSaveAttempt({
      id: `${test.id}-${Date.now()}`,
      testId: test.id,
      testCode: test.code,
      correct,
      total: test.questions.length,
      createdAt: new Date().toISOString(),
    });
    setFinished(true);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
  };

  const testAttempts = attempts.filter((a) => a.testId === test.id);

  if (subTab === 'resources') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-3xl text-[var(--ink)]">{test.code} Official Resources</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Direct links to the official {test.code} portal, past papers, and test specifications.
          </p>
        </div>

        <div className="border-t border-[var(--rule)] divide-y divide-[var(--rule)]">
          {test.officialLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="py-4 flex items-center justify-between gap-4 hover:text-[var(--accent)] transition-colors group"
            >
              <div>
                <div className="text-base font-medium text-[var(--ink)] group-hover:text-[var(--accent)]">
                  {link.label}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">{link.note}</div>
              </div>
              <ExternalLink className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
            </a>
          ))}
        </div>
      </div>
    );
  }

  if (subTab === 'progress') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-3xl text-[var(--ink)]">{test.code} Progress</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Completed {test.code} practice sessions saved in your browser.
          </p>
        </div>

        {testAttempts.length === 0 ? (
          <div className="border border-[var(--rule)] p-8 text-center space-y-3">
            <p className="text-sm text-[var(--text-muted)]">
              No {test.code} sessions completed yet.
            </p>
            <button
              type="button"
              onClick={startDrill}
              className="px-4 py-2 bg-[var(--accent)] text-[var(--accent-fg)] text-xs font-semibold cursor-pointer"
            >
              Start {test.code} Practice
            </button>
          </div>
        ) : (
          <div className="border-t border-[var(--rule)] divide-y divide-[var(--rule)]">
            {testAttempts.map((a) => (
              <div key={a.id} className="py-3.5 flex items-center justify-between text-sm">
                <div className="font-medium text-[var(--ink)]">
                  {a.testCode} Timed Set
                </div>
                <div className="flex items-center gap-6 font-mono-tabular">
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

  // Active timed drill runner
  if (drilling) {
    if (finished) {
      const correct = test.questions.filter((q) => answers[q.id] === q.correctIndex).length;
      return (
        <div className="space-y-8">
          <div className="border border-[var(--rule)] p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
                {test.code} COMPLETE
              </div>
              <div className="font-display text-4xl text-[var(--ink)] mt-1">
                {correct} / {test.questions.length} correct
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={startDrill}
                className="px-4 py-2 border border-[var(--rule)] text-xs font-medium text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retry
              </button>
              <button
                type="button"
                onClick={() => setDrilling(false)}
                className="px-4 py-2 bg-[var(--accent)] text-[var(--accent-fg)] text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {test.questions.map((q, idx) => {
              const picked = answers[q.id];
              const isRight = picked === q.correctIndex;
              return (
                <div key={q.id} className="border border-[var(--rule)] p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono-tabular">
                    <span className="text-[var(--text-muted)]">
                      Q{idx + 1} · {q.section}
                    </span>
                    <span className={isRight ? 'text-[var(--accent)]' : 'text-red-400'}>
                      {isRight ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-[var(--ink)]">{q.prompt}</div>
                  <div className="text-xs text-[var(--accent)]">
                    Answer: {q.options[q.correctIndex]}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{q.explanation}</p>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    const q: PracticeQuestion = test.questions[qIdx];
    const picked = answers[q.id];
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--rule)] pb-3 text-xs font-mono-tabular">
          <span className="text-[var(--text-muted)]">
            {test.code} · Question {qIdx + 1} of {test.questions.length} · {q.section}
          </span>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-[var(--ink)]">
              <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
              {formatTime(secondsLeft)}
            </span>
            <button
              type="button"
              onClick={() => setDrilling(false)}
              className="text-[var(--text-muted)] hover:text-[var(--ink)] cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>

        {q.passage && (
          <p className="font-serif-passage text-base leading-relaxed text-[var(--ink)] border-l-2 border-[var(--accent)] pl-4 py-1">
            {q.passage}
          </p>
        )}

        <div className="text-base font-medium text-[var(--ink)]">{q.prompt}</div>

        <div className="space-y-2.5">
          {q.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const selected = picked === idx;
            return (
              <button
                key={letter}
                type="button"
                onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: idx }))}
                className={`w-full text-left p-3.5 border text-sm flex items-start gap-3 transition-colors cursor-pointer ${
                  selected
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)]'
                    : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)] hover:border-[var(--border-strong)]'
                }`}
              >
                <span className="font-mono-tabular text-xs font-semibold shrink-0">{letter}.</span>
                <span>{opt}</span>
                {selected && <Check className="w-4 h-4 text-[var(--accent)] ml-auto shrink-0" />}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--rule)]">
          <button
            type="button"
            disabled={qIdx === 0}
            onClick={() => setQIdx((i) => Math.max(0, i - 1))}
            className="px-4 py-2 border border-[var(--rule)] text-xs text-[var(--ink)] disabled:opacity-40 cursor-pointer"
          >
            Previous
          </button>

          {qIdx < test.questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setQIdx((i) => i + 1)}
              className="px-5 py-2 bg-[var(--accent)] text-[var(--accent-fg)] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              Next
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={finishDrill}
              className="px-5 py-2 bg-[var(--accent)] text-[var(--accent-fg)] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              Finish &amp; Score
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Clean, simple overview for UCAT / TARA / ESAT / SAT
  const wordCount = writingDraft.trim() ? writingDraft.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-8">
      <div className="border border-[var(--rule)] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
            {test.subject} · {test.duration}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[var(--ink)]">{test.name}</h2>
          <p className="text-sm text-[var(--text-muted)]">{test.format}</p>
        </div>
        <button
          type="button"
          onClick={startDrill}
          className="px-5 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] text-sm font-semibold inline-flex items-center gap-2 shrink-0 cursor-pointer"
        >
          Start Timed Set ({test.questions.length} Qs)
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 text-sm">
        <div className="border border-[var(--rule)] p-4">
          <div className="text-xs text-[var(--text-muted)]">Used by</div>
          <div className="text-[var(--ink)] font-medium mt-1">{test.universities}</div>
        </div>
        <div className="border border-[var(--rule)] p-4">
          <div className="text-xs text-[var(--text-muted)]">Scoring</div>
          <div className="text-[var(--ink)] font-medium mt-1">{test.scoreScale}</div>
        </div>
        <div className="border border-[var(--rule)] p-4">
          <div className="text-xs text-[var(--text-muted)]">Official Site</div>
          <a
            href={test.officialSite}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--accent)] hover:underline font-medium mt-1 inline-flex items-center gap-1"
          >
            Visit {test.code} portal
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* TARA Writing Task */}
      {test.writingPrompts && test.writingPrompts.length > 0 && (
        <div className="border border-[var(--rule)] p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--gold)]">
                TARA WRITING TASK · 40 MINS
              </div>
              <h3 className="font-display text-2xl text-[var(--ink)] mt-0.5">
                Choose 1 of 3 prompts
              </h3>
            </div>
            <span className="font-mono-tabular text-xs text-[var(--text-muted)]">
              {wordCount} words
            </span>
          </div>

          <div className="space-y-2">
            {test.writingPrompts.map((p, idx) => (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPrompt(idx)}
                className={`w-full text-left p-3 border text-sm transition-colors cursor-pointer ${
                  selectedPrompt === idx
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)]'
                    : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                }`}
              >
                <span className="font-mono-tabular text-xs mr-2">{idx + 1}.</span>
                {p}
              </button>
            ))}
          </div>

          <textarea
            value={writingDraft}
            onChange={(e) => setWritingDraft(e.target.value)}
            spellCheck={false}
            rows={8}
            placeholder="Write your timed response here (spellcheck disabled like the live exam)..."
            className="w-full p-4 bg-[var(--surface)] border border-[var(--rule)] text-sm text-[var(--ink)] font-serif-passage leading-relaxed focus:outline-none focus:border-[var(--accent)]"
          />
          {writingDraft && (
            <button
              type="button"
              onClick={() => setWritingDraft('')}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--ink)] inline-flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Clear draft
            </button>
          )}
        </div>
      )}
    </div>
  );
};
