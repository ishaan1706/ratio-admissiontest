import React from 'react';
import { X } from 'lucide-react';

export type LegalDoc = 'terms' | 'privacy' | 'refunds' | null;

interface LegalModalProps {
  doc: LegalDoc;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ doc, onClose }) => {
  if (!doc) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[82vh] overflow-y-auto rounded-2xl border border-white/12 bg-[#111114] text-[#F4F4F5] p-6 sm:p-8 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="font-display text-2xl text-white">
            {doc === 'terms'
              ? 'Terms of Service'
              : doc === 'privacy'
              ? 'Privacy Policy (UK GDPR)'
              : '14-Day Refund Policy'}
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

        {doc === 'terms' && (
          <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
            <p>
              <strong>Independent Study Platform.</strong> Ratio is an independent admissions test
              preparation platform. Ratio is not affiliated with, endorsed by, or sponsored by the
              LNAT Consortium, Pearson VUE, UCAT Consortium, UAT-UK (TARA / ESAT), or the College
              Board (SAT). All trademarks belong to their respective owners.
            </p>
            <p>
              <strong>Original Content &amp; External Official Links.</strong> Practice mocks,
              drills, explanations, and flashcards inside Ratio are original Ratio materials.
              Official past papers, specifications, and simulators open directly on each exam
              board&apos;s official website.
            </p>
            <p>
              <strong>Personal Use Licence.</strong> Your Ratio account and Pro pass are for
              individual study use only and may not be redistributed, scraped, or resold.
            </p>
            <p>
              <strong>Score Estimates.</strong> Raw practice scores and optional Band/scale
              references are study indicators only and do not guarantee official test outcomes or
              university offers.
            </p>
          </div>
        )}

        {doc === 'privacy' && (
          <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
            <p>
              <strong>Data We Collect.</strong> If you study without an account, your mock scores
              and essays stay exclusively in your browser&apos;s local storage. If you create an
              account, we store your name, email address, securely hashed password (scrypt), plan
              status, and synced study progress.
            </p>
            <p>
              <strong>Payments.</strong> Card details are processed directly by our payment
              processor (Stripe) and never touch Ratio servers.
            </p>
            <p>
              <strong>Your UK GDPR Rights.</strong> You can export your study data at any time from
              the Account menu or request full account deletion by emailing{' '}
              <span className="text-emerald-400">support@ratioprep.com</span>.
            </p>
            <p>
              <strong>Cookies.</strong> Ratio uses only a strictly necessary HttpOnly session cookie
              when you sign in — no third-party ad trackers.
            </p>
          </div>
        )}

        {doc === 'refunds' && (
          <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
            <p>
              <strong>14-Day Money-Back Guarantee.</strong> If Ratio Pro isn&apos;t helping your
              preparation, email{' '}
              <span className="text-emerald-400">support@ratioprep.com</span> within 14 days of
              purchase with your account email for a full refund — no awkward hoops.
            </p>
            <p>
              <strong>One-Off Passes (No Renewals).</strong> Both the £24 Single Test Pass (valid
              until that test&apos;s exam season ends) and the £39 All Tests Bundle are single
              one-off payments — there are no recurring subscriptions or automatic charges.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
