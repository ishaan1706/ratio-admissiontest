import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import {
  ActiveExamConfig,
  LnatPassage,
  LnatQuestion,
  LnatSkill,
  SectionAAttempt,
  SectionBEssayRecord,
} from './types';
import { ALL_QUESTIONS, PASSAGES } from './data/passages';
import { TEST_BY_ID, TestId } from './data/allTests';
import { fetchAttempts, fetchEssays, saveAttempt, saveEssay } from './lib/api';
import { RatioUser, fetchSession, getLocalPro, setLocalPro } from './lib/account';
import { LandingView } from './components/LandingView';
import { Navbar } from './components/Navbar';
import { PracticeHub } from './components/PracticeHub';
import { ExamSimulator } from './components/ExamSimulator';
import { ResultsView } from './components/ResultsView';
import { EssayStudio } from './components/EssayStudio';
import { LnatRevisionLab } from './components/LnatRevisionLab';
import { ProgressView } from './components/ProgressView';
import { AccountModal } from './components/AccountModal';
import { PaywallModal } from './components/PaywallModal';
import { LegalDoc, LegalModal } from './components/LegalModal';
import {
  GenericAttempt,
  OfficialResourcesPanel,
  UniversalTestView,
  loadGenericAttempts,
  saveGenericAttempt,
} from './components/TestWorkspace';

const TaraWorkspace = lazy(() =>
  import('./components/TaraWorkspace').then((m) => ({ default: m.TaraWorkspace }))
);
const EsatWorkspace = lazy(() =>
  import('./components/EsatWorkspace').then((m) => ({ default: m.EsatWorkspace }))
);
const SatWorkspace = lazy(() =>
  import('./components/SatWorkspace').then((m) => ({ default: m.SatWorkspace }))
);
const TmuaWorkspace = lazy(() =>
  import('./components/TmuaWorkspace').then((m) => ({ default: m.TmuaWorkspace }))
);
const UcatWorkspace = lazy(() =>
  import('./components/UcatWorkspace').then((m) => ({ default: m.UcatWorkspace }))
);

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

  // Commercial state: Account, Pro entitlement, Stripe readiness, Legal modals
  const [user, setUser] = useState<RatioUser | null>(null);
  const [isPro, setIsPro] = useState<boolean>(() => getLocalPro());
  const [stripeConfigured, setStripeConfigured] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [pricingReason, setPricingReason] = useState<string | null>(null);
  const [legalDoc, setLegalDoc] = useState<LegalDoc>(null);

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
    fetchSession().then(({ user: u, stripeConfigured: sc }) => {
      setUser(u);
      setStripeConfigured(sc);
      if (u?.plan === 'pro') {
        setIsPro(true);
        setLocalPro(true);
      }
    });
  }, []);

  const openPricing = (reason?: string) => {
    setPricingReason(reason || null);
    setPricingOpen(true);
  };

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

  const handleSaveEssay = async (record: SectionBEssayRecord) => {
    setEssays((prev) => [record, ...prev]);
    await saveEssay(record);
  };

  const handleSaveGenericAttempt = (attempt: GenericAttempt) => {
    saveGenericAttempt(attempt);
    setGenericAttempts(loadGenericAttempts());
  };

  const modals = (
    <>
      <AccountModal
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        user={user}
        isPro={isPro}
        onAuthChange={(u) => {
          setUser(u);
          if (u?.plan === 'pro') setIsPro(true);
        }}
        onOpenUpgrade={() => openPricing()}
      />
      <PaywallModal
        open={pricingOpen}
        onClose={() => setPricingOpen(false)}
        isPro={isPro}
        stripeConfigured={stripeConfigured}
        onProChange={(pro) => setIsPro(pro)}
        reason={pricingReason}
      />
      <LegalModal doc={legalDoc} onClose={() => setLegalDoc(null)} />
    </>
  );

  if (onWelcome) {
    return (
      <>
        <LandingView
          onSelectTest={handleSelectTest}
          user={user}
          isPro={isPro}
          onOpenAccount={() => setAccountOpen(true)}
          onOpenPricing={openPricing}
          onOpenLegal={setLegalDoc}
        />
        {modals}
      </>
    );
  }

  const workspaceFallback = (
    <div className="py-16 text-center text-xs font-mono-tabular text-[var(--text-muted)]">
      Loading exam studio…
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      {!activeExam && (
        <Navbar
          activeTest={activeTest}
          onSelectTest={handleSelectTest}
          onGoHome={() => {
            setOnWelcome(true);
            setLastAttempt(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          user={user}
          isPro={isPro}
          onOpenAccount={() => setAccountOpen(true)}
          onOpenPricing={() => openPricing()}
        />
      )}

      {/* Clean 3-tab subbar inside every test */}
      {!activeExam && !lastAttempt && (
        <div className="border-b border-[var(--rule)] bg-[var(--bg)] no-print">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              {(
                [
                  ['practice', 'Practice'],
                  ['resources', 'Official'],
                  ['progress', 'Progress'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSubTab(id)}
                  className={`py-3 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                    subTab === id
                      ? 'border-[var(--accent)] text-[var(--ink)]'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {!isPro && (
              <button
                type="button"
                onClick={() => openPricing()}
                className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono-tabular text-[var(--accent)] hover:underline cursor-pointer"
              >
                <Sparkles className="w-3 h-3" /> Single Test £24 · All 6 Tests £39
              </button>
            )}
          </div>
        </div>
      )}

      <main className="flex-1">
        {activeExam ? (
          <ExamSimulator
            config={activeExam}
            onExit={() => setActiveExam(null)}
            onComplete={handleCompleteExam}
          />
        ) : lastAttempt ? (
          <ResultsView
            attempt={lastAttempt}
            questions={lastQuestions}
            onBackToPractice={() => setLastAttempt(null)}
          />
        ) : activeTest === 'lnat' ? (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
            {subTab === 'practice' && (
              <div className="space-y-8">
                <div className="flex items-center gap-2 border-b border-[var(--rule)] pb-4">
                  <button
                    type="button"
                    onClick={() => setLnatSection('A')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                      lnatSection === 'A'
                        ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]'
                        : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    Section A · Multiple Choice
                  </button>
                  <button
                    type="button"
                    onClick={() => setLnatSection('B')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                      lnatSection === 'B'
                        ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]'
                        : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    Section B · Essay (40 min)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLnatSection('lab')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                      lnatSection === 'lab'
                        ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]'
                        : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    Revision Lab
                  </button>
                </div>

                {lnatSection === 'A' ? (
                  <PracticeHub
                    attempts={attempts}
                    onStartDiagnostic={handleStartDiagnostic}
                    onStartHalfMock={handleStartHalfMock}
                    onStartFullMock={handleStartFullMock}
                    onStartPassage={handleStartPassage}
                    onStartSkill={handleStartSkill}
                  />
                ) : lnatSection === 'B' ? (
                  <EssayStudio onSaveEssay={handleSaveEssay} savedEssays={essays} />
                ) : (
                  <LnatRevisionLab />
                )}
              </div>
            )}

            {subTab === 'resources' && <OfficialResourcesPanel test={TEST_BY_ID.lnat} />}

            {subTab === 'progress' && (
              <ProgressView
                attempts={attempts}
                essays={essays}
                onInspectAttempt={(attempt) => {
                  const answeredIds = new Set(Object.keys(attempt.answers));
                  const qs = ALL_QUESTIONS.filter((q) => answeredIds.has(q.id));
                  setLastAttempt(attempt);
                  setLastQuestions(qs.length > 0 ? qs : ALL_QUESTIONS.slice(0, attempt.total));
                }}
                onNavigate={(view) => {
                  if (view === 'essay') {
                    setLnatSection('B');
                    setSubTab('practice');
                  } else if (view === 'resources') {
                    setSubTab('resources');
                  } else {
                    setLnatSection('A');
                    setSubTab('practice');
                  }
                }}
              />
            )}
          </div>
        ) : activeTest === 'ucat' ? (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
            <Suspense fallback={workspaceFallback}>
              <UcatWorkspace
                test={TEST_BY_ID.ucat}
                subTab={subTab}
                attempts={genericAttempts}
                onSaveAttempt={handleSaveGenericAttempt}
              />
            </Suspense>
          </div>
        ) : activeTest === 'tara' ? (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
            <Suspense fallback={workspaceFallback}>
              <TaraWorkspace
                test={TEST_BY_ID.tara}
                subTab={subTab}
                attempts={genericAttempts}
                onSaveAttempt={handleSaveGenericAttempt}
              />
            </Suspense>
          </div>
        ) : activeTest === 'esat' ? (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
            <Suspense fallback={workspaceFallback}>
              <EsatWorkspace
                test={TEST_BY_ID.esat}
                subTab={subTab}
                attempts={genericAttempts}
                onSaveAttempt={handleSaveGenericAttempt}
              />
            </Suspense>
          </div>
        ) : activeTest === 'tmua' ? (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
            <Suspense fallback={workspaceFallback}>
              <TmuaWorkspace
                test={TEST_BY_ID.tmua}
                subTab={subTab}
                attempts={genericAttempts}
                onSaveAttempt={handleSaveGenericAttempt}
              />
            </Suspense>
          </div>
        ) : activeTest === 'sat' ? (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
            <Suspense fallback={workspaceFallback}>
              <SatWorkspace
                test={TEST_BY_ID.sat}
                subTab={subTab}
                attempts={genericAttempts}
                onSaveAttempt={handleSaveGenericAttempt}
              />
            </Suspense>
          </div>
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

      {!activeExam && (
        <footer className="border-t border-[var(--rule)] py-6 px-4 sm:px-6 text-xs text-[var(--text-muted)] no-print">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4">
              <span>Ratio · Admissions Test Studio</span>
              <button
                type="button"
                onClick={() => setLegalDoc('terms')}
                className="hover:text-[var(--ink)] cursor-pointer"
              >
                Terms
              </button>
              <button
                type="button"
                onClick={() => setLegalDoc('privacy')}
                className="hover:text-[var(--ink)] cursor-pointer"
              >
                Privacy
              </button>
              <button
                type="button"
                onClick={() => setLegalDoc('refunds')}
                className="hover:text-[var(--ink)] cursor-pointer"
              >
                Refunds
              </button>
            </div>
            <span>Not affiliated with LNAT, UCAT, UAT-UK, or College Board.</span>
          </div>
        </footer>
      )}

      {modals}
    </div>
  );
};

export default App;
