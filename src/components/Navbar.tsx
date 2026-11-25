import React from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  ChevronDown,
  Compass,
  Moon,
  PenTool,
  Scale,
  Search,
  Sun,
} from 'lucide-react';
import { AppView } from '../types';

interface NavbarProps {
  view: AppView;
  onNavigate: (view: AppView) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenPalette: () => void;
  onStartDiagnostic: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  view,
  onNavigate,
  theme,
  onToggleTheme,
  onOpenPalette,
  onStartDiagnostic,
}) => {
  // Streamlined 4-tab LNAT navigation — clear, uncluttered, focused
  const navItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'practice', label: 'Section A', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'essay', label: 'Section B', icon: <PenTool className="w-4 h-4" /> },
    { id: 'resources', label: 'Official', icon: <Compass className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[var(--rule)] bg-[var(--bg)]/90 backdrop-blur-xl text-[var(--text)] no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-4">
          {/* Left: Brand (returns to Welcome page) + clean LNAT track pill */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('welcome')}
              className="flex items-center gap-2 text-left cursor-pointer group"
              title="Back to Welcome page"
            >
              <div className="w-7 h-7 rounded-lg bg-[var(--accent)] text-[var(--accent-fg)] flex items-center justify-center shrink-0">
                <Scale className="w-3.5 h-3.5" />
              </div>
              <span className="font-display text-2xl tracking-tight text-[var(--ink)] leading-none">
                Ratio
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('tests')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                view === 'tests'
                  ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                  : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
              }`}
              title="LNAT active · preview upcoming UK admissions tests"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              <span>LNAT</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>
          </div>

          {/* Center: 4 crystal-clear LNAT tabs */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl border border-[var(--rule)] bg-[var(--surface)]" aria-label="Main navigation">
            {navItems.map((item) => {
              const active =
                view === item.id ||
                (item.id === 'practice' && (view === 'exam' || view === 'results')) ||
                (item.id === 'progress' && view === 'plan');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-[var(--accent)] text-[var(--accent-fg)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Compact utility buttons + Diagnostic CTA (no countdown) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenPalette}
              className="w-8 h-8 rounded-lg border border-[var(--rule)] hover:border-[var(--border-strong)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
              aria-label="Quick jump (Ctrl+K)"
              title="Quick jump (⌘K / Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              className="w-8 h-8 rounded-lg border border-[var(--rule)] hover:border-[var(--border-strong)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={onStartDiagnostic}
              className="px-3.5 py-1.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] text-xs font-semibold inline-flex items-center gap-1 whitespace-nowrap transition-colors cursor-pointer"
            >
              Diagnostic
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--rule)] bg-[var(--bg)]/95 backdrop-blur-lg px-2 py-1.5 flex items-center justify-around no-print"
        aria-label="Mobile navigation"
      >
        {navItems.map((item) => {
          const active =
            view === item.id ||
            (item.id === 'practice' && (view === 'exam' || view === 'results'));
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-semibold cursor-pointer ${
                active ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
