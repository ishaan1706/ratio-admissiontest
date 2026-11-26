import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ADMISSIONS_TESTS, TestId } from '../data/allTests';
import { SlidingMarquee, SplitText, SpotlightTile } from './ReactBits';

interface LandingViewProps {
  onSelectTest: (testId: TestId) => void;
}

const MARQUEE_ROW_1 = [
  { label: 'LNAT', tag: 'Law' },
  { label: 'UCAT', tag: 'Medicine' },
  { label: 'TARA', tag: 'Oxford & UCL' },
  { label: 'ESAT', tag: 'Engineering & Science' },
  { label: 'SAT', tag: 'US & Global' },
  { label: 'Critical Thinking', tag: 'LNAT · TARA' },
  { label: 'Verbal Reasoning', tag: 'UCAT' },
  { label: 'Problem Solving', tag: 'TARA · ESAT' },
  { label: 'Digital Math', tag: 'SAT · ESAT' },
  { label: 'Timed Essays', tag: 'LNAT · TARA' },
];

const MARQUEE_ROW_2 = [
  { label: 'Oxford', tag: 'LNAT · TARA · UCAT' },
  { label: 'Cambridge', tag: 'LNAT · ESAT · UCAT' },
  { label: 'Imperial', tag: 'ESAT · UCAT' },
  { label: 'UCL', tag: 'LNAT · TARA · ESAT' },
  { label: 'LSE', tag: 'LNAT' },
  { label: "King's College London", tag: 'LNAT · UCAT' },
  { label: 'Durham & Bristol', tag: 'LNAT' },
  { label: 'Ivy League & MIT', tag: 'SAT' },
];

export const LandingView: React.FC<LandingViewProps> = ({ onSelectTest }) => {
  return (
    <div className="min-h-screen bg-[#09090B] text-[#F4F4F5] flex flex-col overflow-x-hidden selection:bg-[#10B981]/25">
      {/* Minimal Header — Wordmark only + single action (no AI icon-in-box badge) */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#09090B]/92 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span className="font-display text-2xl tracking-tight text-white leading-none">
            Ratio
          </span>

          <button
            type="button"
            onClick={() => onSelectTest('lnat')}
            className="px-4 py-1.5 bg-[#F4F4F5] hover:bg-white text-[#09090B] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            Open Studio
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Calm Hero + Tactile React Bits SpotlightTile 5-Test Picker */}
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16">
          <div className="max-w-2xl">
            <h1 className="font-display text-[3.2rem] sm:text-[4.8rem] leading-[0.95] tracking-[-0.025em] text-white">
              <SplitText text="Admissions test prep," />
              <br />
              <SplitText
                text="without the noise."
                delayOffset={0.14}
                className="italic text-[#34D399]"
              />
            </h1>

            <p className="font-serif-passage text-lg sm:text-xl text-zinc-400 mt-5 leading-relaxed">
              Timed practice sets, real exam interfaces, and verified official resources for LNAT,
              UCAT, TARA, ESAT, and SAT.
            </p>
          </div>

          {/* Direct 5-Test Selector with React Bits Spotlight hover */}
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-5 border border-white/[0.09] divide-y sm:divide-y-0 sm:divide-x divide-white/[0.09]">
            {ADMISSIONS_TESTS.map((test) => (
              <SpotlightTile
                key={test.id}
                onClick={() => onSelectTest(test.id)}
                className="p-5 bg-[#111114] hover:bg-[#16161A] gap-6"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl text-white group-hover:text-[#34D399] transition-colors">
                      {test.code}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <div className="text-xs font-medium text-zinc-300 mt-2">{test.subject}</div>
                  <div className="text-[11px] text-zinc-500 mt-1">
                    {test.officialLinks.length} official resources
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.07] font-mono-tabular text-[11px] text-zinc-500">
                  {test.duration}
                </div>
              </SpotlightTile>
            ))}
          </div>
        </section>

        {/* Dual Opposing Sliding Marquee */}
        <section className="border-y border-white/[0.08] py-10 space-y-2.5">
          <SlidingMarquee items={MARQUEE_ROW_1} />
          <SlidingMarquee items={MARQUEE_ROW_2} reverse />
        </section>
      </main>

      {/* Clean Single-Line Footer */}
      <footer className="py-7 px-4 sm:px-6 text-xs text-zinc-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Ratio · Admissions Test Studio</span>
          <span>Not affiliated with LNAT, UCAT, UAT-UK, or College Board.</span>
        </div>
      </footer>
    </div>
  );
};
