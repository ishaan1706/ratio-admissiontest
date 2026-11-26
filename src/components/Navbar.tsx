import React from 'react';
import { motion } from 'motion/react';
import { Moon, Sparkles, Sun, User } from 'lucide-react';
import { ADMISSIONS_TESTS, TestId } from '../data/allTests';
import { RatioUser } from '../lib/account';

interface NavbarProps {
  activeTest: TestId;
  onSelectTest: (testId: TestId) => void;
  onGoHome: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  user: RatioUser | null;
  isPro: boolean;
  onOpenAccount: () => void;
  onOpenPricing: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTest,
  onSelectTest,
  onGoHome,
  theme,
  onToggleTheme,
  user,
  isPro,
  onOpenAccount,
  onOpenPricing,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--rule)] bg-[var(--bg)]/92 backdrop-blur-xl text-[var(--text)] no-print">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onGoHome}
          className="font-display text-2xl tracking-tight text-[var(--ink)] leading-none cursor-pointer shrink-0"
          title="Back to Welcome"
        >
          Ratio
        </button>

        {/* Spring-animated 5-Test Switcher */}
        <nav
          className="flex items-center gap-0.5 p-1 rounded-xl border border-[var(--rule)] bg-[var(--surface)] overflow-x-auto"
          aria-label="Admissions tests"
        >
          {ADMISSIONS_TESTS.map((test) => {
            const active = activeTest === test.id;
            return (
              <button
                key={test.id}
                type="button"
                onClick={() => onSelectTest(test.id)}
                className={`relative px-3 py-1 rounded-lg text-xs font-mono-tabular font-semibold tracking-wide transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'text-[var(--accent-fg)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--ink)]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="ratio-active-test"
                    transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                    className="absolute inset-0 rounded-lg bg-[var(--ink)]"
                  />
                )}
                <span className="relative z-10">{test.code}</span>
              </button>
            );
          })}
        </nav>

        {/* Commercial Actions: Pro/Upgrade + Account + Theme */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenPricing}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              isPro
                ? 'border border-emerald-500/35 bg-emerald-500/10 text-emerald-400'
                : 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)]'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            {isPro ? 'PRO' : 'Upgrade'}
          </button>

          <button
            type="button"
            onClick={onOpenAccount}
            className="px-2.5 h-8 rounded-lg border border-[var(--rule)] hover:border-[var(--border-strong)] inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
            title={user ? `Signed in as ${user.email}` : 'Sign in or create account'}
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden md:inline max-w-[84px] truncate">
              {user ? user.name : 'Sign in'}
            </span>
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
        </div>
      </div>
    </header>
  );
};
