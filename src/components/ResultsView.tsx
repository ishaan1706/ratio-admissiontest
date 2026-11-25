import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Download,
  Flag,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { LnatQuestion, SectionAAttempt } from '../types';
import { PASSAGES } from '../data/passages';
import { getPercentileBand, UNI_BENCHMARKS } from '../data/benchmarks';
import { submitQuestionReport } from '../lib/api';

interface ResultsViewProps {
  attempt: SectionAAttempt;
  questions: LnatQuestion[];
  onBackToPractice: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  attempt,
  questions,
  onBackToPractice,
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedPassage, setExpandedPassage] = useState<Record<string, boolean>>({});
  const [reportingId, setReportingId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Ambiguous distractor');
  const [reportNote, setReportNote] = useState('');
  const [reportedIds, setReportedIds] = useState<Record<string, boolean>>({});

  const accuracyPct = Math.round((attempt.correct / Math.max(1, attempt.total)) * 100);
  const avgSecPerQ = Math.round(attempt.duration_seconds / Math.max(1, attempt.total));
  const band = getPercentileBand(attempt.projected_42);

  const shareText = `Ratio LNAT Diagnostic (${attempt.label})\nProjected Score: ${attempt.projected_42}/42 (${accuracyPct}% · ${attempt.correct}/${attempt.total})\nBand: ${band.label}\nAvg Pace: ${Math.floor(avgSecPerQ / 60)}m ${avgSecPerQ % 60}s per Q (LNAT target: 2m 15s)`;

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // ignore
    }
  };

  const handleDownloadCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Warm paper background
    ctx.fillStyle = '#FAF9F6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Top Oxford navy bar
    ctx.fillStyle = '#1B365D';
    ctx.fillRect(0, 0, canvas.width, 16);

    // Card surface
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = 'rgba(20, 27, 41, 0.14)';
    ctx.lineWidth = 2;
    ctx.fillRect(48, 56, 984, 536);
    ctx.strokeRect(48, 56, 984, 536);

    // Header
    ctx.fillStyle = '#1B365D';
    ctx.font = '600 28px Georgia, serif';
    ctx.fillText('Ratio · LNAT Readiness Card', 90, 120);

    ctx.fillStyle = '#525B6C';
    ctx.font = '500 18px Inter, system-ui, sans-serif';
    ctx.fillText(`${attempt.label}  ·  ${new Date(attempt.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`, 90, 152);

    // Big score
    ctx.fillStyle = '#141B29';
    ctx.font = '700 84px ui-monospace, monospace';
    ctx.fillText(`${attempt.projected_42}`, 90, 275);
    ctx.fillStyle = '#525B6C';
    ctx.font = '500 32px ui-monospace, monospace';
    ctx.fillText('/ 42 projected', 205, 275);

    ctx.fillStyle = '#1E6B4B';
    ctx.font = '600 22px Inter, system-ui, sans-serif';
    ctx.fillText(`${band.label}  ·  ${accuracyPct}% accuracy (${attempt.correct}/${attempt.total})`, 90, 322);

    ctx.fillStyle = '#525B6C';
    ctx.font = '400 18px Inter, system-ui, sans-serif';
    ctx.fillText(`Pace: ${Math.floor(avgSecPerQ / 60)}m ${avgSecPerQ % 60}s per question (real LNAT pace: 2m 15s)`, 90, 356);

    // Divider
    ctx.strokeStyle = 'rgba(20, 27, 41, 0.12)';
    ctx.beginPath();
    ctx.moveTo(90, 392);
    ctx.lineTo(990, 392);
    ctx.stroke();

    // Uni ranges
    ctx.fillStyle = '#141B29';
    ctx.font = '600 18px Inter, system-ui, sans-serif';
    ctx.fillText('Indicative UK Law School Section A Ranges', 90, 432);

    UNI_BENCHMARKS.slice(0, 4).forEach((uni, i) => {
      const x = 90 + i * 228;
      const inRange = attempt.projected_42 >= uni.typicalOfferRange[0];
      ctx.fillStyle = inRange ? '#EBF5F0' : '#F3F1EC';
      ctx.fillRect(x, 452, 210, 82);
      ctx.fillStyle = '#141B29';
      ctx.font = '600 17px Inter, system-ui, sans-serif';
      ctx.fillText(uni.shortName, x + 16, 484);
      ctx.fillStyle = inRange ? '#1E6B4B' : '#525B6C';
      ctx.font = '600 18px ui-monospace, monospace';
      ctx.fillText(`${uni.typicalOfferRange[0]}–${uni.typicalOfferRange[1]}/42`, x + 16, 514);
    });

    ctx.fillStyle = '#525B6C';
    ctx.font = '400 14px Inter, system-ui, sans-serif';
    ctx.fillText('Note: Indicative Section A projection only. Universities also assess Section B essays and UCAS profile.', 90, 568);

    const link = document.createElement('a');
    link.download = `ratio-lnat-score-${attempt.projected_42}-of-42.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleReportSubmit = async (qId: string) => {
    await submitQuestionReport(qId, reportReason, reportNote);
    setReportedIds((prev) => ({ ...prev, [qId]: true }));
    setReportingId(null);
    setReportNote('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-24 md:pb-12">
      {/* Top Shareable Readiness Card */}
      <section className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <div className="h-1.5 bg-[var(--accent)]" />
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
                LNAT Readiness Card · {attempt.label}
              </div>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="font-mono-tabular text-5xl font-semibold text-[var(--text)]">
                  {attempt.projected_42}
                </span>
                <span className="font-mono-tabular text-lg text-[var(--text-muted)]">
                  / 42 projected
                </span>
              </div>
              <p className="text-sm text-[var(--text-muted)] mt-1.5 max-w-xl">
                <strong className="text-[var(--emerald)] font-semibold">{band.label}</strong> —{' '}
                {band.summary}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyShare}
                className="px-3.5 py-2 rounded-[6px] border border-[var(--border-strong)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-xs font-medium text-[var(--text)] inline-flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[var(--emerald)]" /> Copied summary
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy for TSR / WhatsApp
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleDownloadCard}
                className="px-3.5 py-2 rounded-[6px] bg-[var(--primary-action)] hover:bg-[var(--accent-hover)] text-[var(--primary-action-fg)] text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Save PNG Card
              </button>
            </div>
          </div>

          {/* 3 metrics */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 rounded-[8px] bg-[var(--bg)] border border-[var(--border)]">
              <div className="text-xs text-[var(--text-muted)]">Raw Accuracy</div>
              <div className="font-mono-tabular text-xl font-semibold text-[var(--text)] mt-0.5">
                {attempt.correct}/{attempt.total}{' '}
                <span className="text-xs font-normal text-[var(--text-muted)]">
                  ({accuracyPct}%)
                </span>
              </div>
            </div>
            <div className="p-3.5 rounded-[8px] bg-[var(--bg)] border border-[var(--border)]">
              <div className="text-xs text-[var(--text-muted)]">Avg Pace / Q</div>
              <div className="font-mono-tabular text-xl font-semibold text-[var(--text)] mt-0.5">
                {Math.floor(avgSecPerQ / 60)}m {avgSecPerQ % 60}s
              </div>
            </div>
            <div className="p-3.5 rounded-[8px] bg-[var(--bg)] border border-[var(--border)]">
              <div className="text-xs text-[var(--text-muted)]">Target LNAT Pace</div>
              <div className="font-mono-tabular text-xl font-semibold text-[var(--accent)] mt-0.5">
                2m 15s
              </div>
            </div>
          </div>

          {/* University comparison strip */}
          <div className="space-y-2.5 pt-2 border-t border-[var(--border)]">
            <div className="text-xs font-medium text-[var(--text-muted)]">
              How {attempt.projected_42}/42 compares to typical offer-holder ranges
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {UNI_BENCHMARKS.map((uni) => {
                const inRange = attempt.projected_42 >= uni.typicalOfferRange[0];
                const gap = uni.typicalOfferRange[0] - attempt.projected_42;
                return (
                  <div
                    key={uni.shortName}
                    className={`px-3.5 py-2.5 rounded-[8px] border flex items-center justify-between ${
                      inRange
                        ? 'border-[var(--emerald)]/30 bg-[var(--emerald-soft)]'
                        : 'border-[var(--border)] bg-[var(--bg)]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-[var(--text)]">
                        {uni.shortName}
                      </div>
                      <div className="font-mono-tabular text-[11px] text-[var(--text-muted)]">
                        Typical: {uni.typicalOfferRange[0]}–{uni.typicalOfferRange[1]}
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-medium ${
                        inRange ? 'text-[var(--emerald)]' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {inRange ? 'In range' : `${gap} marks away`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Skill Breakdown */}
      <section className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-editorial text-xl font-medium text-[var(--text)]">
            Accuracy by Reasoning Skill
          </h2>
          <button
            type="button"
            onClick={onBackToPractice}
            className="text-xs font-medium text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Practice another set
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(attempt.skill_breakdown).map(([skill, stat]) => {
            const pct = Math.round((stat.correct / Math.max(1, stat.total)) * 100);
            return (
              <div
                key={skill}
                className="p-3.5 rounded-[8px] border border-[var(--border)] bg-[var(--bg)] space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[var(--text)]">{skill}</span>
                  <span className="font-mono-tabular font-semibold text-[var(--text)]">
                    {stat.correct}/{stat.total} ({pct}%)
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      backgroundColor:
                        pct >= 75
                          ? 'var(--emerald)'
                          : pct >= 50
                            ? 'var(--amber)'
                            : 'var(--crimson)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Question-by-Question Editorial Review */}
      <section className="space-y-4">
        <h2 className="font-serif-editorial text-2xl font-medium text-[var(--text)]">
          Question-by-Question Review
        </h2>
        {questions.map((q, idx) => {
          const userAns = attempt.answers[q.id];
          const isCorrect = userAns === q.correctLetter;
          const passage = PASSAGES.find((p) => p.id === q.passageId);
          const showP = Boolean(expandedPassage[q.id]);

          return (
            <div
              key={q.id}
              className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-[var(--emerald)] shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-[var(--crimson)] shrink-0" />
                  )}
                  <span className="font-mono-tabular text-xs font-semibold text-[var(--text)]">
                    Q{idx + 1}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    · {q.skill} · Paragraph {q.paragraphRef}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passage && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedPassage((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                      }
                      className="text-xs font-medium text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      {showP ? 'Hide' : 'Read'} Paragraph {q.paragraphRef}
                      {showP ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setReportingId(reportingId === q.id ? null : q.id)}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--crimson)] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Flag className="w-3 h-3" />
                    {reportedIds[q.id] ? 'Flagged for review' : 'Report flaw'}
                  </button>
                </div>
              </div>

              <p className="text-base font-medium text-[var(--text)]">{q.stem}</p>

              {showP && passage && (
                <div className="p-4 rounded-[8px] bg-[var(--bg)] border border-[var(--border)] font-serif-editorial text-sm leading-relaxed text-[var(--text)]">
                  <div className="font-sans text-[11px] uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    {passage.title} — Paragraph [{q.paragraphRef}]
                  </div>
                  {passage.paragraphs[q.paragraphRef - 1]}
                </div>
              )}

              <div className="p-3.5 rounded-[8px] bg-[var(--accent-soft)] text-sm text-[var(--text)] leading-relaxed">
                <span className="font-semibold text-[var(--accent)]">Editorial Rationale: </span>
                {q.rationale}
              </div>

              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isRight = opt.letter === q.correctLetter;
                  const isUserPick = opt.letter === userAns;
                  return (
                    <div
                      key={opt.letter}
                      className={`p-3 rounded-[8px] border text-sm space-y-1 ${
                        isRight
                          ? 'border-[var(--emerald)]/40 bg-[var(--emerald-soft)]'
                          : isUserPick
                            ? 'border-[var(--crimson)]/40 bg-[var(--crimson-soft)]'
                            : 'border-[var(--border)] bg-[var(--bg)]/60'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="font-mono-tabular text-xs font-bold mt-0.5">
                          {opt.letter}.
                        </span>
                        <div className="flex-1">
                          <div className="text-[var(--text)] font-medium">
                            {opt.text}
                            {isRight && (
                              <span className="ml-2 text-[11px] font-semibold text-[var(--emerald)]">
                                Correct
                              </span>
                            )}
                            {isUserPick && !isRight && (
                              <span className="ml-2 text-[11px] font-semibold text-[var(--crimson)]">
                                Your answer
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[var(--text-muted)] mt-1">
                            {opt.explanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Editorial flaw reporting inline drawer */}
              {reportingId === q.id && (
                <div className="p-4 rounded-[8px] border border-[var(--border-strong)] bg-[var(--bg)] space-y-3">
                  <div className="text-xs font-semibold text-[var(--text)]">
                    Flag this question for editorial review
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Ambiguous distractor',
                      'Answer key dispute',
                      'Wording feels unnatural',
                      'Paragraph reference mismatch',
                    ].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setReportReason(r)}
                        className={`px-2.5 py-1 rounded text-xs border cursor-pointer ${
                          reportReason === r
                            ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-medium'
                            : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={reportNote}
                    onChange={(e) => setReportNote(e.target.value)}
                    placeholder="Optional note (e.g. Option B also seems supported by para 2)..."
                    className="w-full px-3 py-2 rounded-[6px] border border-[var(--border-strong)] bg-[var(--surface)] text-xs text-[var(--text)]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setReportingId(null)}
                      className="px-3 py-1.5 rounded text-xs text-[var(--text-muted)] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReportSubmit(q.id)}
                      className="px-3 py-1.5 rounded bg-[var(--accent)] text-white text-xs font-medium cursor-pointer"
                    >
                      Submit report
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
};
