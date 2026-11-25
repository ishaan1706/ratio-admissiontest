import React from 'react';
import { BookOpen, PenTool, BarChart3, Scale, Sparkles, Home } from 'lucide-react';
import { AppView } from '../types';

interface NavbarProps {
  view: AppView;
  onNavigate: (view: AppView) => void;
  daysUntilDeadline: number;
}

export const Navbar: React.FC<NavbarProps> = ({ view, onNavigate, daysUntilDeadline }) => {
  const navItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Overview', icon: <Home className="w-4 h-4" /> },
    { id: 'practice', label: 'Section A', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'essay', label: 'Section B', icon: <PenTool className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'pricing', label: 'Pass', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-sm no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-[6px] bg-[var(--accent)] text-[var(--accent-fg)] flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div className="leading-tight">
              <div className="font-serif-editorial text-lg font-semibold tracking-tight text-[var(--text)]">
                Ratio
              </div>
              <div className="text-[11px] text-[var(--text-muted)] -mt-0.5 tracking-wide uppercase">
                LNAT Prep
              </div>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map((item) => {
              const active =
                view === item.id ||
                (item.id === 'practice' && (view === 'exam' || view === 'results'));
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-1.5 rounded-[6px] text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-subtle)]'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text-muted)]">
              <span className="font-mono-tabular font-semibold text-[var(--text)]">
                {daysUntilDeadline}d
              </span>
              <span>to 20 Jan LNAT</span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('practice')}
              className="px-3 py-1.5 rounded-[6px] bg-[var(--primary-action)] hover:bg-[var(--accent-hover)] text-[var(--primary-action-fg)] text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              Free Diagnostic
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--border)] bg-[var(--surface)] px-2 pb-[env(safe-area-inset-bottom)] no-print"
        aria-label="Mobile navigation"
      >
        <div className="grid grid-cols-5 h-14">
          {navItems.map((item) => {
            const active =
              view === item.id ||
              (item.id === 'practice' && (view === 'exam' || view === 'results'));
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium cursor-pointer ${
                  active ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
