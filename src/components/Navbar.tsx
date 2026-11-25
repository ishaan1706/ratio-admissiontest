import React from 'react';
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CalendarClock,
  Compass,
  Home,
  Layers,
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
  daysUntilDeadline: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenPalette: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  view,
  onNavigate,
  theme,
  onToggleTheme,
  onOpenPalette,
}) => {
  const navItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Studio', icon: <Home className="w-4 h-4" /> },
    { id: 'practice', label: 'Section A', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'essay', label: 'Section B', icon: <PenTool className="w-4 h-4" /> },
    { id: 'plan', label: 'Study Plan', icon: <CalendarClock className="w-4 h-4" /> },
    { id: 'resources', label: 'Official', icon: <Compass className="w-4 h-4" /> },
    { id: 'tests', label: 'All Tests', icon: <Layers className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-left cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-[6px] bg-[var(--ink)] text-[var(--paper)] flex items-center justify-center shrink-0">
                <Scale className="w-3.5 h-3.5" />
              </div>
              <span className="font-display text-2xl tracking-tight text-[var(--ink)] leading-none">
                Ratio
              </span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('tests')}
              className="hidden xl:inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)] hover:text-[var(--ink)] pl-3 border-l border-[var(--rule)] whitespace-nowrap cursor-pointer"
              title="Explore UK admissions tests"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--emerald)]" />
              LNAT · +3
            </button>
          </div>

          {/* Editorial Hairline Nav */}
          <nav className="hidden lg:flex items-center gap-5 shrink-0" aria-label="Main navigation">
            {navItems.map((item) => {
              const active =
                view === item.id ||
                (item.id === 'practice' && (view === 'exam' || view === 'results'));
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`text-[11px] font-semibold uppercase tracking-[0.12em] whitespace-nowrap transition-colors cursor-pointer py-1 ${
                    active
                      ? 'text-[var(--ink)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {item.label}
                  {active && <span className="text-[var(--accent)] ml-1">↗</span>}
                </button>
              );
            })}
          </nav>

          {/* Tools */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenPalette}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--rule)] hover:border-[var(--ink)] text-xs text-[var(--text-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer whitespace-nowrap"
              title="Quick jump (Ctrl+K / ⌘K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Jump</span>
              <kbd className="font-mono-tabular text-[10px] px-1.5 py-0.5 rounded border border-[var(--rule)]">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              className="w-8 h-8 rounded-full border border-[var(--rule)] hover:border-[var(--ink)] flex items-center justify-center text-[var(--ink)] transition-colors cursor-pointer"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} studio theme`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('practice')}
              className="px-4 py-1.5 rounded-full bg-[var(--ink)] hover:bg-[var(--accent)] text-[var(--paper)] hover:text-white text-xs font-semibold inline-flex items-center gap-1 whitespace-nowrap transition-colors cursor-pointer"
            >
              Diagnostic
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--rule)] bg-[var(--paper)] px-1 py-1.5 flex items-center justify-around no-print"
        aria-label="Mobile navigation"
      >
        {navItems.slice(0, 5).map((item) => {
          const active =
            view === item.id ||
            (item.id === 'practice' && (view === 'exam' || view === 'results'));
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] cursor-pointer ${
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
