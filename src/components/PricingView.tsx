import React, { useState } from 'react';
import { Check, CreditCard, ShieldCheck, X } from 'lucide-react';

interface PricingViewProps {
  onStartDiagnostic: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onStartDiagnostic }) => {
  const [checkoutPlan, setCheckoutPlan] = useState<'season' | 'monthly' | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-24 md:pb-12">
      <div className="max-w-2xl space-y-2">
        <h1 className="font-serif-editorial text-3xl sm:text-4xl font-medium text-[var(--text)]">
          Simple pricing for one LNAT cycle.
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          Most UK applicants sit the LNAT once before the 20 January UCAS deadline. Start with the
          free diagnostic—upgrade only if you want full timed mocks and the complete essay library.
        </p>
      </div>

      <div className="p-4 rounded-[8px] border border-[var(--emerald)]/30 bg-[var(--emerald-soft)] text-xs text-[var(--text)] flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-[var(--emerald)] shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">Live Preview Mode:</strong> All passages, skill
          drills, and Section B essay sets are currently unlocked so you can test the full product
          before connecting Stripe Checkout.
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Free */}
        <div className="p-6 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Free Diagnostic
              </div>
              <div className="font-mono-tabular text-3xl font-semibold text-[var(--text)] mt-1">
                £0
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">No account required</p>
            </div>
            <ul className="space-y-2 text-xs text-[var(--text)]">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[var(--emerald)] shrink-0" />
                15-minute Diagnostic Mini-Mock (3 passages)
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[var(--emerald)] shrink-0" />
                Projected score out of 42 + PNG readiness card
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[var(--emerald)] shrink-0" />
                Full per-distractor rationales
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[var(--emerald)] shrink-0" />
                2 Section B essay sets + admissions rubric
              </li>
            </ul>
          </div>
          <button
            type="button"
            onClick={onStartDiagnostic}
            className="w-full py-2.5 rounded-[8px] border border-[var(--border-strong)] hover:bg-[var(--surface-subtle)] text-xs font-medium text-[var(--text)] cursor-pointer"
          >
            Take free diagnostic
          </button>
        </div>

        {/* Season Pass */}
        <div className="p-6 rounded-[10px] border-2 border-[var(--accent)] bg-[var(--surface)] flex flex-col justify-between gap-6 relative">
          <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[var(--accent)] text-[var(--accent-fg)] text-[11px] font-medium">
            Best value
          </span>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
                2026/27 Season Pass
              </div>
              <div className="font-mono-tabular text-3xl font-semibold text-[var(--text)] mt-1">
                £29
                <span className="text-xs font-sans font-normal text-[var(--text-muted)] ml-1">
                  one-off
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Access through 20 January · no renewal
              </p>
            </div>
            <ul className="space-y-2 text-xs text-[var(--text)]">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[var(--emerald)] shrink-0" />
                Full curated Section A passage bank + timed mocks
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[var(--emerald)] shrink-0" />
                Unlimited reasoning skill drills &amp; pace analytics
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[var(--emerald)] shrink-0" />
                All Section B essay sets + top-band model outlines
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[var(--emerald)] shrink-0" />
                Priority editorial review on any flagged question
              </li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => setCheckoutPlan('season')}
            className="w-full py-2.5 rounded-[8px] bg-[var(--primary-action)] hover:bg-[var(--accent-hover)] text-[var(--primary-action-fg)] text-xs font-medium cursor-pointer"
          >
            Preview £29 Checkout
          </button>
        </div>

        {/* Monthly */}
        <div className="p-6 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Monthly Cram
              </div>
              <div className="font-mono-tabular text-3xl font-semibold text-[var(--text)] mt-1">
                £14.99
                <span className="text-xs font-sans font-normal text-[var(--text-muted)] ml-1">
                  / month
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">Cancel any time in one click</p>
            </div>
            <ul className="space-y-2 text-xs text-[var(--text)]">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[var(--emerald)] shrink-0" />
                Everything in Season Pass
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[var(--emerald)] shrink-0" />
                Ideal for final 2–4 weeks before test day
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[var(--emerald)] shrink-0" />
                Saved essays &amp; attempt history retained
              </li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => setCheckoutPlan('monthly')}
            className="w-full py-2.5 rounded-[8px] border border-[var(--border-strong)] hover:bg-[var(--surface-subtle)] text-xs font-medium text-[var(--text)] cursor-pointer"
          >
            Preview £14.99/mo Checkout
          </button>
        </div>
      </div>

      {/* Stripe Checkout Preview Modal */}
      {checkoutPlan && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[10px] bg-[var(--surface)] border border-[var(--border)] p-6 space-y-4 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[var(--accent)]" />
                <h3 className="font-semibold text-[var(--text)]">Stripe Checkout Preview</h3>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutPlan(null)}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Selected:{' '}
              <strong className="text-[var(--text)]">
                {checkoutPlan === 'season'
                  ? '2026/27 LNAT Season Pass (£29 one-off)'
                  : 'Monthly Cram (£14.99/mo)'}
              </strong>
              .
            </p>
            <div className="p-3.5 rounded-[8px] bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text-muted)] space-y-1.5">
              <div className="font-semibold text-[var(--text)]">Ready to wire up Stripe:</div>
              <p>
                Payments are disabled in this live preview. When you are ready to launch publicly,
                connect a Stripe Checkout Price ID and webhook to gate the Season Pass passages.
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setCheckoutPlan(null)}
                className="px-4 py-2 rounded-[6px] bg-[var(--primary-action)] text-white text-xs font-medium cursor-pointer"
              >
                Close preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
