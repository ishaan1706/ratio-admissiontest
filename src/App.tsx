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
import { TEST_BY_ID, TestId } from './data/allTests';
import { fetchAttempts, fetchEssays, saveAttempt, saveEssay } from './lib/api';
import { LandingView } from './components/LandingView';
import { Navbar } from './components/Navbar';
import { PracticeHub } from './components/PracticeHub';
import { ExamSimulator } from './components/ExamSimulator';
import { ResultsView } from './components/ResultsView';
import { EssayStudio } from './components/EssayStudio';
import { LnatRevisionLab } from './components/LnatRevisionLab';
import { ProgressView } from './components/ProgressView';
import {
  GenericAttempt,
  OfficialResourcesPanel,
  UniversalTestView,
  loadGenericAttempts,
  saveGenericAttempt,
} from './components/TestWorkspace';

function getInitialTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem('ratio_studio_theme_v2');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // ignore storage errors
  }
  return 'dark';
}

type SubTab = 'practice' | 'resources' | 'progress';

export const App: React.FC = () => {
  const [onWelcome, setOnWelcome] = useState(true);
  const [activeTest, setActiveTest] = useState<TestId>('lnat');
  const [subTab, setSubTab] = useState<SubTab>('practice');
  const [lnatSection, setLnatSection] = useState<'A' | 'B' | 'lab'>('A');

  const [theme, setTheme] = useState<'light' | 'dark'>(() => getInitialTheme());
  const [activeExam, setActiveExam] = useState<ActiveExamConfig | null>(null);
  const [lastAttempt, setLastAttempt] = useState<SectionAAttempt | null>(null);
  const [lastQuestions, setLastQuestions] = useState<LnatQuestion[]>([]);
  const [attempts, setAttempts] = useState<SectionAAttempt[]>([]);
  const [essays, setEssays] = useState<SectionBEssayRecord[]>([]);
  const [genericAttempts, setGenericAttempts] = useState<GenericAttempt[]>(() =>
    loadGenericAttempts()
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('ratio_studio_theme_v2', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    fetchAttempts().then(setAttempts);
    fetchEssays().then(setEssays);
  }, []);

  const handleSelectTest = (testId: TestId) => {
    setActiveTest(testId);
    setOnWelcome(false);
    setActiveExam(null);
    setLastAttempt(null);
    setSubTab('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartExam = (config: ActiveExamConfig) => {
    setActiveTest('lnat');
    setOnWelcome(false);
    setActiveExam(config);
    setLastAttempt(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartDiagnostic = () => {
    handleStartExam({
      mode: 'diagnostic',
      label: 'LNAT Diagnostic (8 Qs)',
      timeLimitSeconds: 15 * 60,
      passageIds: PASSAGES.slice(0, 2).map((p) => p.id),
    });
  };

  const handleStartHalfMock = () => {
    handleStartExam({
      mode: 'mock',
      label: '6-Passage Half-Mock (22 Qs)',
      timeLimitSeconds: 48 * 60,
      passageIds: PASSAGES.slice(0, 6).map((p) => p.id),
    });
  };

  const handleStartFullMock = () => {
    handleStartExam({
      mode: 'mock',
      label: 'Full 12-Passage LNAT Mock (42 Qs)',
      timeLimitSeconds: 95 * 60,
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
    setActiveExam(null);
    setLastAttempt(attempt);
    setLastQuestions(questions);
    setAttempts((prev) => [attempt, ...prev]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await saveAttempt(attempt);
  };

  const handleInspectAttempt = (attempt: SectionAAttempt) => {
    const answeredIds = new Set(Object.keys(attempt.answers));
    const matched = ALL_QUESTIONS.filter((q) => answeredIds.has(q.id));
    setLastAttempt(attempt);
    setLastQuestions(matched.length > 0 ? matched : ALL_QUESTIONS.slice(0, attempt.total));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveEssay = async (record: SectionBEssayRecord) => {
    setEssays((prev) => [record, ...prev]);
    await saveEssay(record);
  };

  const handleSaveGenericAttempt = (attempt: GenericAttempt) => {
    setGenericAttempts(saveGenericAttempt(attempt));
  };

  const handleLegacyNavigate = (next: AppView) => {
    if (next === 'welcome') {
      setOnWelcome(true);
      return;
    }
    if (next === 'essay') {
      setActiveTest('lnat');
      setSubTab('practice');
      setLnatSection('B');
      return;
    }
    if (next === 'resources') {
      setSubTab('resources');
      return;
    }
    if (next === 'progress') {
      setSubTab('progress');
      return;
    }
    setSubTab('practice');
    setLnatSection('A');
  };

  if (onWelcome) {
    return <LandingView onSelectTest={handleSelectTest} />;
  }

  // Full-screen Pearson VUE simulator for LNAT Section A
  if (activeExam) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <ExamSimulator
          config={activeExam}
          onExit={() => setActiveExam(null)}
          onComplete={handleCompleteExam}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <Navbar
        activeTest={activeTest}
        onSelectTest={handleSelectTest}
        onGoHome={() => setOnWelcome(true)}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
      />

      {/* Simple 3-tab sub-bar */}
      <div className="border-b border-[var(--rule)] bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {(['practice', 'resources', 'progress'] as SubTab[]).map((tab) => {
              const active = subTab === tab && !lastAttempt;
              const label =
                tab === 'practice' ? 'Practice' : tab === 'resources' ? 'Official' : 'Progress';
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setLastAttempt(null);
                    setSubTab(tab);
                  }}
                  className={`py-3 text-xs font-semibold uppercase tracking-[0.1em] border-b-2 transition-colors cursor-pointer ${
                    active
                      ? 'border-[var(--accent)] text-[var(--ink)]'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {activeTest === 'lnat' && subTab === 'practice' && !lastAttempt && (
            <div className="flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setLnatSection('A')}
                className={`px-2.5 py-1 border cursor-pointer transition-colors ${
                  lnatSection === 'A'
                    ? 'border-[var(--accent)] text-[var(--accent)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--ink)]'
                }`}
              >
                Section A
              </button>
              <button
                type="button"
                onClick={() => setLnatSection('B')}
                className={`px-2.5 py-1 border cursor-pointer transition-colors ${
                  lnatSection === 'B'
                    ? 'border-[var(--accent)] text-[var(--accent)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--ink)]'
                }`}
              >
                Section B
              </button>
              <button
                type="button"
                onClick={() => setLnatSection('lab')}
                className={`px-2.5 py-1 border cursor-pointer transition-colors ${
                  lnatSection === 'lab'
                    ? 'border-[var(--accent)] text-[var(--accent)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--ink)]'
                }`}
              >
                Revision Lab
              </button>
            </div>
          )}
        </div>
      </div>

      <main className="flex-1">
        {lastAttempt ? (
          <ResultsView
            attempt={lastAttempt}
            questions={lastQuestions}
            onBackToPractice={() => setLastAttempt(null)}
          />
        ) : activeTest === 'lnat' ? (
          <>
            {subTab === 'practice' && lnatSection === 'A' && (
              <PracticeHub
                attempts={attempts}
                onStartDiagnostic={handleStartDiagnostic}
                onStartHalfMock={handleStartHalfMock}
                onStartFullMock={handleStartFullMock}
                onStartPassage={handleStartPassage}
                onStartSkill={handleStartSkill}
              />
            )}
            {subTab === 'practice' && lnatSection === 'B' && (
              <EssayStudio savedEssays={essays} onSaveEssay={handleSaveEssay} />
            )}
            {subTab === 'practice' && lnatSection === 'lab' && <LnatRevisionLab />}
            {subTab === 'resources' && (
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                <OfficialResourcesPanel test={TEST_BY_ID.lnat} />
              </div>
            )}
            {subTab === 'progress' && (
              <ProgressView
                attempts={attempts}
                essays={essays}
                onInspectAttempt={handleInspectAttempt}
                onNavigate={handleLegacyNavigate}
              />
            )}
          </>
        ) : (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
            <UniversalTestView
              test={TEST_BY_ID[activeTest]}
              subTab={subTab}
              attempts={genericAttempts}
              onSaveAttempt={handleSaveGenericAttempt}
            />
          </div>
        )}
      </main>

      <footer className="border-t border-[var(--rule)] py-5 text-xs text-[var(--text-muted)] no-print">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <span>Ratio · LNAT, UCAT, TARA, ESAT &amp; SAT</span>
          <span>Not affiliated with LNAT, UCAT, UAT-UK, or College Board.</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
