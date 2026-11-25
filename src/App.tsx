import React, { useEffect, useState } from 'react';
import {
  ActiveExamConfig,
  AppView,
  LnatPassage,
  LnatQuestion,
  LnatSkill,
  SectionAAttempt,
  SectionBEssayRecord,
} from './types';
import { ALL_QUESTIONS, PASSAGES } from './data/passages';
import { fetchAttempts, fetchEssays, saveAttempt, saveEssay } from './lib/api';
import { LandingView } from './components/LandingView';
import { Navbar } from './components/Navbar';
import { PracticeHub } from './components/PracticeHub';
import { ExamSimulator } from './components/ExamSimulator';
import { ResultsView } from './components/ResultsView';
import { EssayStudio } from './components/EssayStudio';
import { StudyPlanView } from './components/StudyPlanView';
import { OfficialResourcesView } from './components/OfficialResourcesView';
import { AllTestsView } from './components/AllTestsView';
import { ProgressView } from './components/ProgressView';
import { PricingView } from './components/PricingView';
import { CommandPalette } from './components/CommandPalette';

function getInitialTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem('ratio_studio_theme_v2');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // ignore storage errors
  }
  return 'dark';
}

export const App: React.FC = () => {
  const [view, setView] = useState<AppView>('welcome');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getInitialTheme());
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeExam, setActiveExam] = useState<ActiveExamConfig | null>(null);
  const [lastAttempt, setLastAttempt] = useState<SectionAAttempt | null>(null);
  const [lastQuestions, setLastQuestions] = useState<LnatQuestion[]>([]);
  const [attempts, setAttempts] = useState<SectionAAttempt[]>([]);
  const [essays, setEssays] = useState<SectionBEssayRecord[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('ratio_studio_theme_v2', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    fetchAttempts().then(setAttempts);
    fetchEssays().then(setEssays);
  }, []);

  const handleNavigate = (next: AppView) => {
    setView(next === 'home' ? 'practice' : next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const handleStartHalfMock = () => {
    handleStartExam({
      mode: 'mock',
      label: '6-Passage Half-Mock (22 Qs)',
      timeLimitSeconds: 48 * 60,
      passageIds: PASSAGES.map((p) => p.id),
    });
  };

  const handleStartPassage = (passage: LnatPassage) => {
    handleStartExam({
      mode: 'drill',
      label: passage.title,
      timeLimitSeconds: Math.max(8, passage.questions.length * 2 + 2) * 60,
      passageIds: [passage.id],
    });
  };

  const handleStartSkill = (skill: LnatSkill) => {
    const relevantIds = PASSAGES.filter((p) => p.questions.some((q) => q.skill === skill)).map(
      (p) => p.id
    );
    const count = ALL_QUESTIONS.filter((q) => q.skill === skill).length;
    handleStartExam({
      mode: 'drill',
      label: `Skill Drill: ${skill}`,
      timeLimitSeconds: Math.max(10, Math.round(count * 2.5)) * 60,
      passageIds: relevantIds,
      skillFilter: skill,
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

  if (view === 'welcome') {
    return (
      <LandingView
        onEnterApp={(target = 'practice') => handleNavigate(target)}
        onStartDiagnostic={handleStartDiagnostic}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      {view !== 'exam' && (
        <Navbar
          view={view}
          onNavigate={handleNavigate}
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          onOpenPalette={() => setPaletteOpen(true)}
          onStartDiagnostic={handleStartDiagnostic}
        />
      )}

      <main className="flex-1">
        {(view === 'practice' || view === 'home') && (
          <PracticeHub
            attempts={attempts}
            onStartDiagnostic={handleStartDiagnostic}
            onStartHalfMock={handleStartHalfMock}
            onStartPassage={handleStartPassage}
            onStartSkill={handleStartSkill}
          />
        )}
        {view === 'exam' && activeExam && (
          <ExamSimulator
            config={activeExam}
            onExit={() => handleNavigate('practice')}
            onComplete={handleCompleteExam}
          />
        )}
        {view === 'results' && lastAttempt && (
          <ResultsView
            attempt={lastAttempt}
            questions={lastQuestions}
            onBackToPractice={() => handleNavigate('practice')}
          />
        )}
        {view === 'essay' && (
          <EssayStudio savedEssays={essays} onSaveEssay={handleSaveEssay} />
        )}
        {view === 'plan' && (
          <StudyPlanView
            attempts={attempts}
            essays={essays}
            onStartDiagnostic={handleStartDiagnostic}
            onStartPassage={handleStartPassage}
            onStartSkill={handleStartSkill}
            onNavigate={handleNavigate}
          />
        )}
        {view === 'resources' && (
          <OfficialResourcesView onStartDiagnostic={handleStartDiagnostic} />
        )}
        {view === 'tests' && <AllTestsView onNavigate={handleNavigate} />}
        {view === 'progress' && (
          <ProgressView
            attempts={attempts}
            essays={essays}
            onInspectAttempt={handleInspectAttempt}
            onNavigate={handleNavigate}
          />
        )}
        {view === 'pricing' && <PricingView onStartDiagnostic={handleStartDiagnostic} />}
      </main>

      {view !== 'exam' && (
        <footer className="border-t border-[var(--rule)] py-6 text-xs text-[var(--text-muted)] no-print mb-14 md:mb-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <strong className="text-[var(--ink)] mr-2">Ratio</strong>
              Independent LNAT &amp; UK Admissions Studio. Not affiliated with LNAT Consortium,
              Pearson VUE, UCAT, or UAT-UK.
            </div>
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => handleNavigate('welcome')}
                className="hover:text-[var(--ink)] cursor-pointer"
              >
                Welcome
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('plan')}
                className="hover:text-[var(--ink)] cursor-pointer"
              >
                Study Plan
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('tests')}
                className="hover:text-[var(--ink)] cursor-pointer"
              >
                All Tests
              </button>
            </div>
          </div>
        </footer>
      )}

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={handleNavigate}
        onStartDiagnostic={handleStartDiagnostic}
        onStartPassage={handleStartPassage}
        onStartSkill={handleStartSkill}
      />
    </div>
  );
};

export default App;
