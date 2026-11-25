import React from 'react';
import {
  BookOpen,
  PenTool,
  BarChart3,
  Scale,
  Compass,
  Layers,
  Home,
  ArrowUpRight,
} from 'lucide-react';
import { AppView } from '../types';

interface NavbarProps {
  view: AppView;
  onNavigate: (view: AppView) => void;
  daysUntilDeadline: number;
}

export const Navbar: React.FC<NavbarProps> = ({ view, onNavigate, daysUntilDeadline }) => {
  const navItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Studio', icon: <Home className="w-4 h-4" /> },
    { id: 'practice', label: 'Section A', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'essay', label: 'Section B', icon: <PenTool className="w-4 h-4" /> },
    { id: 'resources', label: 'Official Guide', icon: <Compass className="w-4 h-4" /> },
    { id: 'tests', label: 'All Tests', icon: <Layers className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0F172A] text-white no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-left cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-[8px] bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                <Scale className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="font-display text-xl tracking-tight text-white">Ratio</div>
                <div className="text-[9px] text-slate-400 -mt-1 tracking-widest uppercase">
                  Admissions
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('tests')}
              className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/8 hover:bg-white/14 border border-white/12 text-[11px] font-medium text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
              title="Switch or explore UK admissions tests"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>LNAT · +3 tests</span>
            </button>
          </div>

          <nav className="hidden lg:flex items-center gap-0.5 shrink-0" aria-label="Main navigation">
            {navItems.map((item) => {
              const active =
                view === item.id ||
                (item.id === 'practice' && (view === 'exam' || view === 'results'));
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`px-2.5 py-1.5 rounded-[7px] text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-white/14 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-white/8'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/12 bg-white/5 text-[11px] text-slate-300 whitespace-nowrap">
              <span className="font-mono-tabular font-semibold text-amber-300">
                {daysUntilDeadline}d
              </span>
              <span>to 20 Jan</span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('pricing')}
              className="hidden sm:inline-flex text-xs font-medium text-slate-300 hover:text-white px-2 py-1 whitespace-nowrap cursor-pointer"
            >
              Pass
            </button>
            <button
              type="button"
              onClick={() => onNavigate('practice')}
              className="px-3.5 py-1.5 rounded-[7px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold inline-flex items-center gap-1 whitespace-nowrap transition-colors cursor-pointer"
            >
              Diagnostic
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md px-1 pb-[env(safe-area-inset-bottom)] no-print"
        aria-label="Mobile navigation"
      >
        <div className="grid grid-cols-5 h-14">
          {navItems.slice(0, 5).map((item) => {
            const active =
              view === item.id ||
              (item.id === 'practice' && (view === 'exam' || view === 'results'));
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium cursor-pointer ${
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
