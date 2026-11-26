import React, { useState } from 'react';
import { Download, LogOut, ShieldCheck, X } from 'lucide-react';
import {
  RatioUser,
  exportAllProgressJson,
  loginAccount,
  logoutAccount,
  registerAccount,
} from '../lib/account';

interface AccountModalProps {
  open: boolean;
  onClose: () => void;
  user: RatioUser | null;
  isPro: boolean;
  onAuthChange: (user: RatioUser | null) => void;
  onOpenUpgrade: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  open,
  onClose,
  user,
  isPro,
  onAuthChange,
  onOpenUpgrade,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res =
      tab === 'register'
        ? await registerAccount(name, email, password)
        : await loginAccount(email, password);
    setBusy(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    if (res.user) {
      onAuthChange(res.user);
      onClose();
    }
  };

  const handleLogout = async () => {
    await logoutAccount();
    onAuthChange(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111114] text-[#F4F4F5] p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl text-white">
            {user ? 'Your Ratio Account' : tab === 'register' ? 'Create free account' : 'Sign in'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {user ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white">{user.name}</div>
                <div className="text-xs text-zinc-400">{user.email}</div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono-tabular font-semibold ${
                  isPro
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/5 text-zinc-300 border border-white/10'
                }`}
              >
                {isPro ? 'RATIO PRO' : 'FREE PLAN'}
              </span>
            </div>

            {!isPro && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenUpgrade();
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#09090B] text-xs font-semibold transition-colors cursor-pointer"
              >
                Upgrade to Ratio Pro — All 5 Exams
              </button>
            )}

            <button
              type="button"
              onClick={exportAllProgressJson}
              className="w-full py-2.5 rounded-xl border border-white/10 hover:border-white/25 text-xs text-zinc-200 inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export Progress Backup (.json)
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl border border-white/10 hover:border-red-400/40 text-xs text-zinc-400 hover:text-red-300 inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 p-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setError(null);
                }}
                className={`py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  tab === 'register' ? 'bg-white text-[#09090B]' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Create account
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setError(null);
                }}
                className={`py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  tab === 'login' ? 'bg-white text-[#09090B]' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign in
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {tab === 'register' && (
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">First name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-white/10 focus:border-emerald-500 outline-none text-sm text-white"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@school.ac.uk"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-white/10 focus:border-emerald-500 outline-none text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-white/10 focus:border-emerald-500 outline-none text-sm text-white"
                />
              </div>

              {error && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-[#09090B] text-sm font-semibold transition-colors cursor-pointer"
              >
                {busy
                  ? 'Please wait…'
                  : tab === 'register'
                  ? 'Create free account'
                  : 'Sign in'}
              </button>
            </form>

            <div className="flex items-center gap-2 text-[11px] text-zinc-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Saves your mock history, flashcards, and Pro access across devices.</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
