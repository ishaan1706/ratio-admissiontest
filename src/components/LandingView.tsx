import React from 'react';
import { ArrowUpRight, Scale } from 'lucide-react';
import { ADMISSIONS_TESTS, TestId } from '../data/allTests';
import { RevealLine, SlidingMarquee } from './ReactBits';

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
    <div className="min-h-screen bg-[#07090F] text-[#F8FAFC] flex flex-col overflow-x-hidden selection:bg-[#10B981]/30">
      {/* Minimal 2-item Header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#07090F]/92 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[6px] bg-[#10B981] text-[#03150E] flex items-center justify-center">
              <Scale className="w-3.5 h-3.5" />
            </div>
            <span className="font-display text-2xl tracking-tight text-white leading-none">
              Ratio
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelectTest('lnat')}
            className="px-4 py-1.5 bg-[#10B981] hover:bg-[#34D399] text-[#03150E] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            Start Practising
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Calm, Uncluttered Hero + Direct 5-Test Picker */}
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16">
          <div className="max-w-2xl">
            <h1 className="font-display text-[3.2rem] sm:text-[4.8rem] leading-[0.95] tracking-[-0.025em] text-white">
              <RevealLine delay={0.02}>Admissions test prep,</RevealLine>
              <RevealLine delay={0.1}>
                <span className="italic text-[#34D399]">stripped back.</span>
              </RevealLine>
            </h1>

            <p className="font-serif-passage text-lg sm:text-xl text-slate-400 mt-5 leading-relaxed">
              Timed practice sets, real exam interfaces, and official guides — all in one place.
              Pick your test to start.
            </p>
          </div>

          {/* Direct 5-Test Selector */}
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-5 border border-white/[0.1] divide-y sm:divide-y-0 sm:divide-x divide-white/[0.1]">
            {ADMISSIONS_TESTS.map((test) => (
              <button
                key={test.id}
                type="button"
                onClick={() => onSelectTest(test.id)}
                className="group text-left p-5 bg-[#0A0E16] hover:bg-[#101724] transition-colors flex flex-col justify-between gap-6 cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl text-white group-hover:text-[#34D399] transition-colors">
                      {test.code}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#34D399] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <div className="text-xs font-medium text-slate-300 mt-2">{test.subject}</div>
                </div>

                <div className="pt-3 border-t border-white/[0.07] font-mono-tabular text-[11px] text-slate-500">
                  {test.duration}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Dual Opposing Sliding Marquee (from recall-politics) */}
        <section className="border-y border-white/[0.08] py-10 space-y-2.5">
          <SlidingMarquee items={MARQUEE_ROW_1} />
          <SlidingMarquee items={MARQUEE_ROW_2} reverse />
        </section>
      </main>

      {/* Clean Single-Line Footer */}
      <footer className="py-7 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Ratio · Admissions Test Studio</span>
          <span>Not affiliated with LNAT, UCAT, UAT-UK, or College Board.</span>
        </div>
      </footer>
    </div>
  );
};
