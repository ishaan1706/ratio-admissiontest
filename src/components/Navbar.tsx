import React from 'react';
import { motion } from 'motion/react';
import { Moon, Scale, Sun } from 'lucide-react';
import { ADMISSIONS_TESTS, TestId } from '../data/allTests';

interface NavbarProps {
  activeTest: TestId;
  onSelectTest: (testId: TestId) => void;
  onGoHome: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTest,
  onSelectTest,
  onGoHome,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--rule)] bg-[var(--bg)]/94 backdrop-blur-md text-[var(--text)] no-print">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand -> Welcome */}
        <button
          type="button"
          onClick={onGoHome}
          className="flex items-center gap-2 text-left cursor-pointer shrink-0"
          title="Back to Welcome"
        >
          <div className="w-7 h-7 rounded-[6px] bg-[var(--accent)] text-[var(--accent-fg)] flex items-center justify-center">
            <Scale className="w-3.5 h-3.5" />
          </div>
          <span className="font-display text-2xl tracking-tight text-[var(--ink)] leading-none">
            Ratio
          </span>
        </button>

        {/* Clean 5-Test Switcher with spring sliding highlight */}
        <nav
          className="flex items-center gap-0.5 p-1 border border-[var(--rule)] bg-[var(--surface)] overflow-x-auto"
          aria-label="Admissions tests"
        >
          {ADMISSIONS_TESTS.map((test) => {
            const active = activeTest === test.id;
            return (
              <button
                key={test.id}
                type="button"
                onClick={() => onSelectTest(test.id)}
                className={`relative px-3 py-1 text-xs font-mono-tabular font-semibold tracking-wide transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'text-[var(--accent-fg)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--ink)]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="ratio-active-test"
                    transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                    className="absolute inset-0 bg-[var(--accent)]"
                  />
                )}
                <span className="relative z-10">{test.code}</span>
              </button>
            );
          })}
        </nav>

        {/* Theme toggle only */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="w-8 h-8 border border-[var(--rule)] hover:border-[var(--border-strong)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer shrink-0"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};
