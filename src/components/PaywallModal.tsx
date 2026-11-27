import React, { useState } from 'react';
import { Check, KeyRound, ShieldCheck, Sparkles, X } from 'lucide-react';
import { ADMISSIONS_TESTS, TestId } from '../data/allTests';
import { redeemAccessCode, setLocalPro, startStripeCheckout } from '../lib/account';

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  isPro: boolean;
  stripeConfigured: boolean;
  onProChange: (pro: boolean) => void;
  reason?: string | null;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  open,
  onClose,
  isPro,
  stripeConfigured,
  onProChange,
  reason,
}) => {
  const [selectedTest, setSelectedTest] = useState<TestId>('lnat');
  const [busyTier, setBusyTier] = useState<'single' | 'bundle' | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [showCodeBox, setShowCodeBox] = useState(false);

  if (!open) return null;

  const handleCheckout = async (tier: 'single' | 'bundle') => {
    setNotice(null);
    setBusyTier(tier);
    const res = await startStripeCheckout(tier, tier === 'single' ? selectedTest : 'all');
    setBusyTier(null);
    if (res.url) {
      window.location.href = res.url;
      return;
    }
    if (res.setupRequired) {
      setNotice(
        'Stripe keys are not connected yet. Add STRIPE_SECRET_KEY, STRIPE_PRICE_SINGLE & STRIPE_PRICE_BUNDLE in .env to take live payments — or unlock Pro now with an access code below.'
      );
      setShowCodeBox(true);
    } else {
      setNotice(res.error || 'Could not start checkout.');
    }
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError(null);
    const res = await redeemAccessCode(code);
    if (!res.ok) {
      setCodeError(res.error || 'Invalid access code.');
      return;
    }
    onProChange(true);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-white/12 bg-[#111114] text-[#F4F4F5] p-6 sm:p-8 shadow-2xl space-y-6 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono-tabular uppercase tracking-wider text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" /> Ratio Pro · No Subscriptions
            </div>
            <h3 className="font-display text-3xl sm:text-4xl text-white mt-1">
              Pay once for one test, or unlock all six.
            </h3>
            {reason && <p className="text-xs text-amber-300 mt-1.5">{reason}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Single Test Pass (£24) */}
          <div className="rounded-xl border border-white/10 bg-[#09090B] p-5 flex flex-col justify-between gap-5">
            <div>
              <div className="text-xs font-mono-tabular uppercase tracking-wider text-zinc-400">
                Single Test Pass · One-Off
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-display text-4xl text-white">£24</span>
                <span className="text-xs text-zinc-400">valid until exam season ends</span>
              </div>
              <p className="text-xs text-zinc-400 mt-2">
                Full access to one admissions test through the end of its exam season. No recurring
                bills.
              </p>

              <div className="mt-4">
                <label className="block text-[11px] font-mono-tabular uppercase tracking-wider text-zinc-500 mb-1.5">
                  Choose your test
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {ADMISSIONS_TESTS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTest(t.id)}
                      className={`py-1.5 rounded-lg text-xs font-mono-tabular font-semibold border cursor-pointer transition-colors ${
                        selectedTest === t.id
                          ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                          : 'border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {t.code}
                    </button>
                  ))}
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-xs text-zinc-300">
                {[
                  `All full-length ${selectedTest.toUpperCase()} mocks & timed drills`,
                  'Every worked explanation & revision guide',
                  'Flashcards, cloud sync & progress backup',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              disabled={busyTier !== null}
              onClick={() => handleCheckout('single')}
              className="w-full py-2.5 rounded-xl border border-white/15 hover:border-white/35 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              {busyTier === 'single'
                ? 'Opening Checkout…'
                : `Get ${selectedTest.toUpperCase()} Pass (£24 once)`}
            </button>
          </div>

          {/* All Tests Bundle (£39) */}
          <div className="rounded-xl border border-emerald-500/40 bg-gradient-to-b from-emerald-500/10 to-[#09090B] p-5 flex flex-col justify-between gap-5 relative">
            <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-emerald-500 text-[#09090B] text-[10px] font-mono-tabular font-bold uppercase tracking-wider">
              Best Value
            </span>
            <div>
              <div className="text-xs font-mono-tabular uppercase tracking-wider text-emerald-400">
                All Tests Bundle · One-Off
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-display text-4xl text-white">£39</span>
                <span className="text-xs text-zinc-400">all 6 tests · full cycle</span>
              </div>
              <p className="text-xs text-zinc-300 mt-2">
                Sitting more than one exam? Unlock LNAT, UCAT, TARA, ESAT, TMUA &amp; SAT together
                for £15 more.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-zinc-200">
                {[
                  'All 6 admissions tests unlocked (1,080+ original Qs)',
                  'Every full-length mock, timed drill & flashcard deck',
                  'Zero subscriptions or automatic renewals',
                  '14-day no-questions-asked refund guarantee',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              disabled={busyTier !== null}
              onClick={() => handleCheckout('bundle')}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#09090B] text-xs font-semibold transition-colors cursor-pointer"
            >
              {busyTier === 'bundle' ? 'Opening Checkout…' : 'Get All Tests Bundle (£39 once)'}
            </button>
          </div>
        </div>

        {notice && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-200 leading-relaxed">
            {notice}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>14-day refund guarantee · Secure one-off checkout</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowCodeBox((v) => !v)}
              className="inline-flex items-center gap-1 text-zinc-300 hover:text-white cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" /> Have an access code?
            </button>
            {!stripeConfigured && (
              <button
                type="button"
                onClick={() => {
                  const next = !isPro;
                  setLocalPro(next);
                  onProChange(next);
                  onClose();
                }}
                className="text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
              >
                {isPro ? 'Preview as Free' : 'Preview as Pro'}
              </button>
            )}
          </div>
        </div>

        {showCodeBox && (
          <form onSubmit={handleRedeem} className="flex flex-col sm:flex-row gap-2 pt-1">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter access code (e.g. RATIO-FOUNDER)"
              className="flex-1 px-3.5 py-2 rounded-xl bg-[#09090B] border border-white/10 focus:border-emerald-500 outline-none text-xs text-white font-mono-tabular uppercase"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-white text-[#09090B] text-xs font-semibold cursor-pointer"
            >
              Unlock Pro
            </button>
            {codeError && <div className="text-xs text-red-400 self-center">{codeError}</div>}
          </form>
        )}
      </div>
    </div>
  );
};
