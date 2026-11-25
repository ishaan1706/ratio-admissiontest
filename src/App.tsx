import React, { useEffect, useMemo, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
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
import { PASSAGES } from './data/passages';
import { fetchAttempts, fetchEssays, saveAttempt, saveEssay } from './lib/api';
import {
  AppView,
  ExamConfig,
  LnatPassage,
  SectionAAttempt,
  SectionBEssayRecord,
  SkillTag,
} from './types';

function computeDaysUntilJan20(): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  let target = new Date(currentYear, 0, 20);
  if (now > target) {
    target = new Date(currentYear + 1, 0, 20);
  }
  return Math.max(1, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

function getInitialTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem('ratio_studio_theme_v1');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // ignore storage errors
  }
  return 'light';
}

export function App() {
  const [view, setView] = useState<AppView>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getInitialTheme());
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [attempts, setAttempts] = useState<SectionAAttempt[]>([]);
  const [essays, setEssays] = useState<SectionBEssayRecord[]>([]);
  const [activeExam, setActiveExam] = useState<ExamConfig | null>(null);
  const [latestAttempt, setLatestAttempt] = useState<SectionAAttempt | null>(null);
  const [latestExamPassages, setLatestExamPassages] = useState<LnatPassage[]>(PASSAGES);

  const daysUntilDeadline = useMemo(() => computeDaysUntilJan20(), []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('ratio_studio_theme_v1', theme);
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

  const handleStartDiagnostic = () => {
    const diagPassages = PASSAGES.slice(0, 2);
    setActiveExam({
      mode: 'diagnostic',
      label: '15-Minute Free Diagnostic',
      timeLimitSec: 15 * 60,
      passages: diagPassages,
    });
    setView('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartHalfMock = () => {
    setActiveExam({
      mode: 'half-mock',
      label: '6-Passage Half-Mock (22 Qs)',
      timeLimitSec: 48 * 60,
      passages: PASSAGES,
    });
    setView('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartPassage = (passage: LnatPassage) => {
    setActiveExam({
      mode: 'passage',
      label: passage.title,
      timeLimitSec: Math.max(8, passage.questions.length * 2 + 2) * 60,
      passages: [passage],
    });
    setView('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartSkill = (skill: SkillTag) => {
    const relevantPassages = PASSAGES.filter((p) => p.questions.some((q) => q.skill === skill));
    const questionIds = relevantPassages
      .flatMap((p) => p.questions)
      .filter((q) => q.skill === skill)
      .map((q) => q.id);

    setActiveExam({
      mode: 'skill',
      label: `Skill Drill: ${skill}`,
      timeLimitSec: Math.max(10, questionIds.length * 2.5) * 60,
      passages: relevantPassages,
      questionIds,
    });
    setView('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteExam = async (attempt: SectionAAttempt) => {
    await saveAttempt(attempt);
    setAttempts((prev) => [attempt, ...prev]);
    setLatestAttempt(attempt);
    if (activeExam) {
      setLatestExamPassages(activeExam.passages);
    }
    setView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveEssay = async (record: SectionBEssayRecord) => {
    await saveEssay(record);
    setEssays((prev) => [record, ...prev]);
  };

  const handleNavigate = (next: AppView) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)]">
      {view !== 'exam' && (
        <Navbar
          view={view}
          onNavigate={handleNavigate}
          daysUntilDeadline={daysUntilDeadline}
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          onOpenPalette={() => setPaletteOpen(true)}
        />
      )}

      <main className="flex-1">
        {view === 'home' && (
          <HomeView
            onStartDiagnostic={handleStartDiagnostic}
            onStartHalfMock={handleStartHalfMock}
            onNavigate={handleNavigate}
            attempts={attempts}
            essays={essays}
            daysUntilDeadline={daysUntilDeadline}
          />
        )}

        {view === 'practice' && (
          <PracticeHub
            onStartDiagnostic={handleStartDiagnostic}
            onStartHalfMock={handleStartHalfMock}
            onStartPassage={handleStartPassage}
            onStartSkill={handleStartSkill}
            attempts={attempts}
          />
        )}

        {view === 'exam' && activeExam && (
          <ExamSimulator
            config={activeExam}
            onComplete={handleCompleteExam}
            onExit={() => handleNavigate('practice')}
          />
        )}

        {view === 'results' && latestAttempt && (
          <ResultsView
            attempt={latestAttempt}
            passages={latestExamPassages}
            questionIds={activeExam?.questionIds}
            onRetake={() => {
              if (activeExam) setView('exam');
              else handleStartDiagnostic();
            }}
            onPracticeMore={() => handleNavigate('practice')}
            onGoEssay={() => handleNavigate('essay')}
          />
        )}

        {view === 'essay' && <EssayStudio essays={essays} onSaveEssay={handleSaveEssay} />}

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
            onStartDiagnostic={handleStartDiagnostic}
            onStartSkill={handleStartSkill}
            onGoEssay={() => handleNavigate('essay')}
          />
        )}

        {view === 'pricing' && <PricingView onStartDiagnostic={handleStartDiagnostic} />}
      </main>

      {view !== 'exam' && (
        <footer className="border-t border-[var(--rule)] py-7 text-xs text-[var(--text-muted)] no-print mb-14 lg:mb-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
            <div className="font-serif-passage text-sm">
              <strong className="font-sans text-xs uppercase tracking-[0.12em] text-[var(--ink)] mr-2">
                Ratio
              </strong>
              Independent UK Admissions Studio. Not affiliated with LNAT Consortium, Pearson VUE,
              UCAT, or UAT-UK.
            </div>
            <div className="flex items-center gap-5 uppercase tracking-[0.1em] text-[10px] font-semibold">
              <button
                type="button"
                onClick={() => handleNavigate('plan')}
                className="hover:text-[var(--ink)] cursor-pointer"
              >
                Study Plan
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('resources')}
                className="hover:text-[var(--ink)] cursor-pointer"
              >
                Official Guide
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('tests')}
                className="hover:text-[var(--ink)] cursor-pointer"
              >
                All Tests
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('pricing')}
                className="hover:text-[var(--ink)] cursor-pointer"
              >
                Season Pass
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
}

export default App;
