import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ExternalLink, Sparkles, XCircle } from 'lucide-react';
import { EXAM_TRACKS } from '../data/exams';
import { AppView } from '../types';

interface AllTestsViewProps {
  onNavigate: (view: AppView) => void;
}

export const AllTestsView: React.FC<AllTestsViewProps> = ({ onNavigate }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [votedTracks, setVotedTracks] = useState<Record<string, boolean>>({});

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-24 lg:pb-14">
      <div className="max-w-2xl space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
          <Sparkles className="w-3.5 h-3.5" />
          Multi-Test UK Admissions Architecture
        </div>
        <h1 className="font-display text-4xl text-[var(--text)]">
          UK University Admissions Tests
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          Ratio is built on a shared critical-reasoning and exam-simulator engine. LNAT is fully
          live today; try an interactive sample question from TSA, UCAT, or TMUA/ESAT below and
          vote for which full track we ship next.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {EXAM_TRACKS.map((track) => {
          const picked = selectedAnswers[track.id];
          const answered = picked !== undefined;
          const voted = Boolean(votedTracks[track.id]);

          return (
            <div
              key={track.id}
              className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-1.5" style={{ backgroundColor: track.accentColor }} />
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono-tabular text-xs font-bold px-2.5 py-0.5 rounded text-white"
                          style={{ backgroundColor: track.accentColor }}
                        >
                          {track.code}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            track.status === 'live'
                              ? 'bg-[var(--emerald-soft)] text-[var(--emerald)]'
                              : 'bg-[var(--bg)] text-[var(--text-muted)] border border-[var(--border)]'
                          }`}
                        >
                          {track.status === 'live' ? 'Full Track Live' : 'Interactive Preview'}
                        </span>
                      </div>
                      <h2 className="font-display text-2xl text-[var(--text)] mt-2">
                        {track.name}
                      </h2>
                      <p className="text-xs font-medium text-[var(--text-muted)]">{track.field}</p>
                    </div>
                    <a
                      href={track.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] inline-flex items-center gap-1 shrink-0"
                    >
                      Official <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {track.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 rounded-[8px] bg-[var(--bg)] border border-[var(--border)]">
                      <div className="text-[11px] text-[var(--text-muted)]">Duration</div>
                      <div className="font-mono-tabular font-semibold text-[var(--text)] mt-0.5">
                        {track.duration}
                      </div>
                    </div>
                    <div className="p-3 rounded-[8px] bg-[var(--bg)] border border-[var(--border)]">
                      <div className="text-[11px] text-[var(--text-muted)]">Key Window</div>
                      <div className="font-semibold text-[var(--text)] mt-0.5">
                        {track.keyDeadline}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-[var(--text-muted)]">
                    <strong className="text-[var(--text)]">Universities:</strong>{' '}
                    {track.universities.join(' · ')}
                  </div>

                  {track.sampleQuestion && (
                    <div className="p-4 rounded-[10px] bg-[var(--bg)] border border-[var(--border)] space-y-2.5">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        Live {track.code} Taste-Test
                      </div>
                      <p className="text-xs font-medium text-[var(--text)] leading-relaxed">
                        {track.sampleQuestion.prompt}
                      </p>
                      <div className="space-y-1.5">
                        {track.sampleQuestion.options.map((opt, idx) => {
                          const isRight = idx === track.sampleQuestion!.correctIndex;
                          const isPicked = picked === idx;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() =>
                                setSelectedAnswers((prev) => ({ ...prev, [track.id]: idx }))
                              }
                              className={`w-full text-left px-3 py-2 rounded-[7px] border text-xs transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                                answered && isRight
                                  ? 'border-[var(--emerald)] bg-[var(--emerald-soft)] text-[var(--text)] font-medium'
                                  : isPicked && !isRight
                                    ? 'border-[var(--crimson)] bg-[var(--crimson-soft)] text-[var(--text)]'
                                    : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] text-[var(--text)]'
                              }`}
                            >
                              <span>{opt}</span>
                              {answered && isRight && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--emerald)] shrink-0" />
                              )}
                              {isPicked && !isRight && (
                                <XCircle className="w-3.5 h-3.5 text-[var(--crimson)] shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {answered && (
                        <p className="text-[11px] text-[var(--text-muted)] pt-1 leading-relaxed">
                          <strong className="text-[var(--text)]">Explanation: </strong>
                          {track.sampleQuestion.explanation}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg)]/50">
                {track.status === 'live' ? (
                  <button
                    type="button"
                    onClick={() => onNavigate('practice')}
                    className="w-full py-2.5 rounded-[8px] bg-[var(--primary-action)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Open LNAT Simulator &amp; Essay Studio <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setVotedTracks((prev) => ({ ...prev, [track.id]: true }))}
                    className={`w-full py-2.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer ${
                      voted
                        ? 'bg-[var(--emerald-soft)] text-[var(--emerald)] border border-[var(--emerald)]/30'
                        : 'border border-[var(--border-strong)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--text)]'
                    }`}
                  >
                    {voted
                      ? `Voted! ${track.code} full bank queued next`
                      : `Vote to build full ${track.code} bank next`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
