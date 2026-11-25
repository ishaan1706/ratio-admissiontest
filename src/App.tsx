import React, { useEffect, useMemo, useState } from 'react';
import {
  ActiveExamConfig,
  AppView,
  LnatQuestion,
  SectionAAttempt,
  SectionBEssayRecord,
} from './types';
import { ALL_QUESTIONS, PASSAGES } from './data/passages';
import { fetchAttempts, fetchEssays, saveAttempt, saveEssay } from './lib/api';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { PracticeHub } from './components/PracticeHub';
import { ExamSimulator } from './components/ExamSimulator';
import { ResultsView } from './components/ResultsView';
import { EssayStudio } from './components/EssayStudio';
import { OfficialResourcesView } from './components/OfficialResourcesView';
import { AllTestsView } from './components/AllTestsView';
import { ProgressView } from './components/ProgressView';
import { PricingView } from './components/PricingView';

function getDaysUntilNextJan20(): number {
  const now = new Date();
  let targetYear = now.getFullYear();
  const targetThisYear = new Date(targetYear, 0, 20);
  if (now > targetThisYear) {
    targetYear += 1;
  }
  const target = new Date(targetYear, 0, 20);
  const diffMs = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [activeExam, setActiveExam] = useState<ActiveExamConfig | null>(null);
  const [lastAttempt, setLastAttempt] = useState<SectionAAttempt | null>(null);
  const [lastQuestions, setLastQuestions] = useState<LnatQuestion[]>([]);
  const [attempts, setAttempts] = useState<SectionAAttempt[]>([]);
  const [essays, setEssays] = useState<SectionBEssayRecord[]>([]);

  const daysUntilDeadline = useMemo(() => getDaysUntilNextJan20(), []);

  useEffect(() => {
    fetchAttempts().then(setAttempts);
    fetchEssays().then(setEssays);
  }, []);

  const handleStartExam = (config: ActiveExamConfig) => {
    setActiveExam(config);
    setView('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartDiagnostic = () => {
    handleStartExam({
      mode: 'diagnostic',
      label: 'Free LNAT Diagnostic',
      timeLimitSeconds: 15 * 60,
      passageIds: PASSAGES.filter((p) => p.freeTier).map((p) => p.id),
    });
  };

  const handleCompleteExam = async (attempt: SectionAAttempt, questions: LnatQuestion[]) => {
    setLastAttempt(attempt);
    setLastQuestions(questions);
    setAttempts((prev) => [attempt, ...prev]);
    setView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await saveAttempt(attempt);
  };

  const handleInspectAttempt = (attempt: SectionAAttempt) => {
    const answeredIds = new Set(Object.keys(attempt.answers));
    const matched = ALL_QUESTIONS.filter((q) => answeredIds.has(q.id));
    setLastAttempt(attempt);
    setLastQuestions(matched.length > 0 ? matched : ALL_QUESTIONS.slice(0, attempt.total));
    setView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveEssay = async (record: SectionBEssayRecord) => {
    setEssays((prev) => [record, ...prev]);
    await saveEssay(record);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <Navbar view={view} onNavigate={setView} daysUntilDeadline={daysUntilDeadline} />

      <main className="flex-1">
        {view === 'home' && (
          <HomeView
            attempts={attempts}
            essays={essays}
            onStartDiagnostic={handleStartDiagnostic}
            onNavigate={setView}
          />
        )}
        {view === 'practice' && <PracticeHub onStartExam={handleStartExam} />}
        {view === 'exam' && activeExam && (
          <ExamSimulator
            config={activeExam}
            onExit={() => setView('practice')}
            onComplete={handleCompleteExam}
          />
        )}
        {view === 'results' && lastAttempt && (
          <ResultsView
            attempt={lastAttempt}
            questions={lastQuestions}
            onBackToPractice={() => setView('practice')}
          />
        )}
        {view === 'essay' && (
          <EssayStudio savedEssays={essays} onSaveEssay={handleSaveEssay} />
        )}
        {view === 'resources' && (
          <OfficialResourcesView onStartDiagnostic={handleStartDiagnostic} />
        )}
        {view === 'tests' && <AllTestsView onNavigate={setView} />}
        {view === 'progress' && (
          <ProgressView
            attempts={attempts}
            essays={essays}
            onInspectAttempt={handleInspectAttempt}
            onNavigate={setView}
          />
        )}
        {view === 'pricing' && <PricingView onStartDiagnostic={handleStartDiagnostic} />}
      </main>

      {view !== 'exam' && (
        <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-5 px-4 sm:px-6 text-xs text-[var(--text-muted)] no-print mb-14 lg:mb-0">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              Ratio Admissions Prep · Independent study platform (not affiliated with LNAT
              Consortium, Pearson VUE, UCAT, or UAT-UK).
            </div>
            <a
              href="https://app.devin.ai/sessions/24c709ca71aa4f26ba09586a8fcd2554"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--accent)] underline underline-offset-2"
            >
              Request changes
            </a>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
