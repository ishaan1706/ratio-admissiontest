import React from 'react';
import { ArrowRight, BarChart3, BookOpen, PenTool } from 'lucide-react';
import { AppView, SectionAAttempt, SectionBEssayRecord, SkillStat } from '../types';

interface ProgressViewProps {
  attempts: SectionAAttempt[];
  essays: SectionBEssayRecord[];
  onInspectAttempt: (attempt: SectionAAttempt) => void;
  onNavigate: (view: AppView) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  attempts,
  essays,
  onInspectAttempt,
  onNavigate,
}) => {
  const aggregateSkills: Record<string, SkillStat> = {};
  let totalCorrect = 0;
  let totalQuestions = 0;
  let totalSeconds = 0;

  for (const att of attempts) {
    totalCorrect += att.correct;
    totalQuestions += att.total;
    totalSeconds += att.duration_seconds;
    for (const [skill, stat] of Object.entries(att.skill_breakdown)) {
      if (!aggregateSkills[skill]) {
        aggregateSkills[skill] = { correct: 0, total: 0 };
      }
      aggregateSkills[skill].correct += stat.correct;
      aggregateSkills[skill].total += stat.total;
    }
  }

  const avgProjected =
    attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.projected_42, 0) / attempts.length)
      : null;

  const avgPaceSec = totalQuestions > 0 ? Math.round(totalSeconds / totalQuestions) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-24 md:pb-12">
      <div>
        <h1 className="font-serif-editorial text-3xl font-medium text-[var(--text)]">
          Progress &amp; Skill Profile
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Saved automatically across sessions so you can track projected LNAT scores and spot which
          question types cost you marks.
        </p>
      </div>

      {attempts.length === 0 && essays.length === 0 ? (
        <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-8 text-center space-y-4">
          <BarChart3 className="w-8 h-8 text-[var(--accent)] mx-auto" />
          <div className="space-y-1">
            <h2 className="font-semibold text-[var(--text)]">No attempts recorded yet</h2>
            <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
              Complete the 15-minute Free Diagnostic or write a timed Section B essay to unlock
              your skill profile and pace tracker.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('practice')}
              className="px-4 py-2 rounded-[6px] bg-[var(--primary-action)] text-white text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" /> Go to Section A
            </button>
            <button
              type="button"
              onClick={() => onNavigate('essay')}
              className="px-4 py-2 rounded-[6px] border border-[var(--border-strong)] text-xs font-medium text-[var(--text)] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <PenTool className="w-3.5 h-3.5" /> Go to Section B
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-[10px] border border-[var(--border)] bg-[var(--surface)]">
              <div className="text-xs text-[var(--text-muted)]">Avg Projected Score</div>
              <div className="font-mono-tabular text-2xl font-semibold text-[var(--text)] mt-1">
                {avgProjected !== null ? `${avgProjected}/42` : '—'}
              </div>
            </div>
            <div className="p-4 rounded-[10px] border border-[var(--border)] bg-[var(--surface)]">
              <div className="text-xs text-[var(--text-muted)]">Cumulative Accuracy</div>
              <div className="font-mono-tabular text-2xl font-semibold text-[var(--text)] mt-1">
                {totalQuestions > 0 ? `${Math.round((totalCorrect / totalQuestions) * 100)}%` : '—'}
              </div>
            </div>
            <div className="p-4 rounded-[10px] border border-[var(--border)] bg-[var(--surface)]">
              <div className="text-xs text-[var(--text-muted)]">Avg Pace / Question</div>
              <div className="font-mono-tabular text-2xl font-semibold text-[var(--text)] mt-1">
                {avgPaceSec !== null
                  ? `${Math.floor(avgPaceSec / 60)}m ${avgPaceSec % 60}s`
                  : '—'}
              </div>
            </div>
            <div className="p-4 rounded-[10px] border border-[var(--border)] bg-[var(--surface)]">
              <div className="text-xs text-[var(--text-muted)]">Section B Essays</div>
              <div className="font-mono-tabular text-2xl font-semibold text-[var(--text)] mt-1">
                {essays.length}
              </div>
            </div>
          </div>

          {Object.keys(aggregateSkills).length > 0 && (
            <section className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 space-y-4">
              <h2 className="font-serif-editorial text-xl font-medium text-[var(--text)]">
                Cumulative Accuracy by Skill
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {Object.entries(aggregateSkills).map(([skill, stat]) => {
                  const pct = Math.round((stat.correct / Math.max(1, stat.total)) * 100);
                  return (
                    <div
                      key={skill}
                      className="p-3.5 rounded-[8px] border border-[var(--border)] bg-[var(--bg)] space-y-2"
                    >
                      <div className="text-xs font-medium text-[var(--text)]">{skill}</div>
                      <div className="font-mono-tabular text-lg font-semibold text-[var(--text)]">
                        {pct}%{' '}
                        <span className="text-xs font-normal text-[var(--text-muted)]">
                          ({stat.correct}/{stat.total})
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
          )}

          {attempts.length > 0 && (
            <section className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--border)]">
                <h2 className="font-serif-editorial text-xl font-medium text-[var(--text)]">
                  Section A Attempt History
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--bg)] text-left text-xs text-[var(--text-muted)]">
                      <th className="py-2.5 px-5 font-medium">Session</th>
                      <th className="py-2.5 px-5 font-medium">Date</th>
                      <th className="py-2.5 px-5 font-medium text-right">Raw</th>
                      <th className="py-2.5 px-5 font-medium text-right">Projected / 42</th>
                      <th className="py-2.5 px-5 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {attempts.map((a) => (
                      <tr key={a.id} className="hover:bg-[var(--bg)]/60">
                        <td className="py-3 px-5 font-medium text-[var(--text)]">{a.label}</td>
                        <td className="py-3 px-5 text-xs text-[var(--text-muted)]">
                          {new Date(a.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3 px-5 font-mono-tabular text-right text-[var(--text)]">
                          {a.correct}/{a.total}
                        </td>
                        <td className="py-3 px-5 font-mono-tabular text-right font-semibold text-[var(--accent)]">
                          {a.projected_42}/42
                        </td>
                        <td className="py-3 px-5 text-right">
                          <button
                            type="button"
                            onClick={() => onInspectAttempt(a)}
                            className="text-xs font-medium text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                          >
                            Review <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};
