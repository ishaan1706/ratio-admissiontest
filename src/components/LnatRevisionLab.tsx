import React, { useState } from 'react';
import { Check, ChevronRight, Eye, EyeOff, RotateCcw } from 'lucide-react';

interface ReadingMethodItem {
  id: string;
  excerpt: string;
  source: string;
  questions: {
    prompt: string;
    answer: string;
  }[];
}

const FOUR_QUESTION_DRILLS: ReadingMethodItem[] = [
  {
    id: 'rm-1',
    source: 'Legal Ethics · Plea Bargaining',
    excerpt:
      'Defenders of plea bargaining emphasise that without discounted sentences for guilty pleas, criminal courts would collapse under an unmanageable backlog. That administrative reality is undeniable. Yet a system that penalises defendants with dramatically harsher sentences merely for exercising their constitutional right to trial does not merely save money; it converts the presumption of innocence into a gamble only the wealthy or reckless can afford.',
    questions: [
      {
        prompt: '1. What is the factual premise vs. the author’s evaluative claim?',
        answer:
          'Fact/concession: guilty-plea discounts relieve court backlogs. Evaluative claim: steep "trial penalties" undermine the presumption of innocence by making trial an unaffordable gamble.'
      },
      {
        prompt: '2. What is the main conclusion?',
        answer:
          'Although plea bargaining eases administrative pressure, large sentencing differentials for going to trial erode the practical meaning of the presumption of innocence.'
      },
      {
        prompt: '3. What unstated assumption does the argument rely on?',
        answer:
          'That innocent or risk-averse defendants will rationally plead guilty when the sentencing gap between plea and conviction at trial is steep enough.'
      },
      {
        prompt: '4. What is the exact tone and counter-argument pivot?',
        answer:
          'Measured but sharply critical ("Yet..."). The author concedes administrative necessity ("undeniable") before pivoting to a principled constitutional objection.'
      }
    ]
  },
  {
    id: 'rm-2',
    source: 'Public Policy · Compulsory Voting',
    excerpt:
      'Compulsory voting is frequently praised for raising turnout above ninety per cent, as though high turnout were self-evidently proof of democratic vitality. Yet forcing reluctant citizens to the polling station on pain of a fine does not manufacture civic engagement; it merely compels people who have neither read a manifesto nor followed a debate to tick a box at random. Democracy is strengthened by informed participation, not by statistical compliance.',
    questions: [
      {
        prompt: '1. What is the factual premise vs. the author’s evaluative claim?',
        answer:
          'Fact: compulsory voting raises turnout above 90%. Evaluative claim: high turnout produced by fines reflects compliance rather than genuine civic engagement.'
      },
      {
        prompt: '2. What is the main conclusion?',
        answer:
          'Compulsory voting does not genuinely strengthen democracy because coerced turnout is not the same as informed participation.'
      },
      {
        prompt: '3. What unstated assumption does the argument rely on?',
        answer:
          'That most citizens who would otherwise abstain will remain uninformed even when legally required to vote (rather than researching candidates because they must vote).'
      },
      {
        prompt: '4. What is the exact tone and counter-argument pivot?',
        answer:
          'Sceptical and incisive ("as though...", "Yet..."). Targets the conflation of raw turnout statistics with democratic health.'
      }
    ]
  },
  {
    id: 'rm-3',
    source: 'Bioethics · Human Challenge Trials',
    excerpt:
      'Deliberately infecting healthy volunteers with a pathogen during a pandemic seems, at first glance, to violate medicine’s oldest maxim: first, do no harm. Yet every Phase I drug trial exposes healthy volunteers to uncertain risk for the sake of others, and we rightly permit firefighters to enter burning buildings when the danger is disclosed and freely accepted. The ethical test is not the absence of risk, but whether consent is genuinely informed and the expected social benefit is proportionate.',
    questions: [
      {
        prompt: '1. What is the factual premise vs. the author’s evaluative claim?',
        answer:
          'Fact/analogy: Phase I trials and firefighting already accept disclosed voluntary risk. Evaluative claim: human challenge trials can be ethical if consent is informed and benefit is proportionate.'
      },
      {
        prompt: '2. What is the main conclusion?',
        answer:
          'Human challenge trials should not be ruled out by a blanket "do no harm" maxim; they should be judged by informed consent and proportionality of benefit.'
      },
      {
        prompt: '3. What unstated assumption does the argument rely on?',
        answer:
          'That volunteers in a pandemic can meaningfully comprehend novel pathogen risks well enough for consent to be genuinely informed.'
      },
      {
        prompt: '4. What is the exact tone and counter-argument pivot?',
        answer:
          'Analytical and persuasive ("seems, at first glance... Yet..."). Uses parity-of-reasoning analogies to dissolve an absolutist objection.'
      }
    ]
  }
];

const DISTRACTOR_TRAPS = [
  {
    name: 'Extreme Modifier / Scope Shift',
    signal: 'Words like "always", "never", "solely", "all", "proves", "impossible".',
    example:
      'Passage says a policy "often reduces" congestion → Trap option claims it "eliminates" congestion.',
    rule: 'Match the exact strength of the author’s modal verb ("may", "tends to", "rarely").'
  },
  {
    name: 'True Outside the Text',
    signal: 'Sounds sensible from A-Level Politics, Economics, or general knowledge.',
    example:
      'Correct legal principle from UK constitutional law that the passage itself never mentions.',
    rule: 'LNAT tests reading logic, never external knowledge. If you cannot point to the sentence, eliminate it.'
  },
  {
    name: 'Concession Mistaken for Thesis',
    signal: 'Quotes a viewpoint from paragraph 1 before the "Yet / However / Nevertheless" pivot.',
    example:
      'Author opens with "Advocates argue X... Yet X fails because Y" → Trap option picks X as the main argument.',
    rule: 'Track the pivot word. Everything before "Yet" is usually the target, not the author’s conclusion.'
  },
  {
    name: 'Reversed Causality',
    signal: 'Uses the exact vocabulary of the passage, but flips A → B into B → A.',
    example:
      'Passage: "Past policing choices skew arrest data" → Trap: "Arrest algorithms cause police to patrol new areas".',
    rule: 'Draw a quick mental arrow (Cause → Effect) whenever an option recycles passage words.'
  },
  {
    name: 'Detail Disguised as Main Argument',
    signal: '100% factually true according to one paragraph, so it feels safe to pick.',
    example:
      'An illustration or historical example from paragraph 2 offered as "the author’s central argument".',
    rule: 'Ask: would the rest of the passage still make sense if this single sentence were deleted? If yes, it is a detail, not the thesis.'
  }
];

const ESSAY_TIMELINE = [
  { mins: '0–5m', phase: 'Select & Plan', detail: 'Pick the prompt where you have the sharpest counter-argument. Map thesis, 3 distinct points, 1 steelman objection + rebuttal.' },
  { mins: '5–9m', phase: 'Introduction (~70w)', detail: 'Define any ambiguous term, frame the real tension, and state your clear, qualified thesis in the final sentence.' },
  { mins: '9–31m', phase: '3 Body Paragraphs (~360w)', detail: 'One distinct claim per paragraph. Dedicate paragraph 3 (or weave into each) to the strongest counter-argument and a fair rebuttal.' },
  { mins: '31–36m', phase: 'Conclusion (~70w)', detail: 'Synthesise why your principle outweighs the strongest objection without introducing brand-new arguments.' },
  { mins: '36–40m', phase: 'Edit & Trim (500–600w)', detail: 'No spellcheck in Pearson VUE. Cut filler phrases, check clarity, and stay firmly under the 750-word limit.' }
];

export const LnatRevisionLab: React.FC = () => {
  const [drillIdx, setDrillIdx] = useState(0);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [flippedTrap, setFlippedTrap] = useState<number | null>(0);

  const drill = FOUR_QUESTION_DRILLS[drillIdx];
  const allRevealed = drill.questions.every((_, i) => revealed[i]);

  const toggleReveal = (i: number) => {
    setRevealed((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const handleSelectDrill = (idx: number) => {
    setDrillIdx(idx);
    setRevealed({});
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 pb-24 space-y-14">
      <div className="border-b border-[var(--rule)] pb-6">
        <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
          LNAT REVISION LAB
        </div>
        <h2 className="font-display text-3xl sm:text-4xl text-[var(--ink)] mt-1">
          Official 4-Question Method &amp; Distractor Field Guide
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-1 max-w-2xl">
          Built directly from official LNAT guidance: separate facts from opinion, isolate the
          conclusion, expose unstated assumptions, and spot the five recurring MCQ traps.
        </p>
      </div>

      {/* 1. Interactive 4-Question Reading Method Drill */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--text-muted)]">
              01 · Active Reading Drill
            </div>
            <h3 className="font-display text-2xl text-[var(--ink)] mt-0.5">
              Deconstruct an LNAT Paragraph
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            {FOUR_QUESTION_DRILLS.map((d, idx) => (
              <button
                key={d.id}
                type="button"
                onClick={() => handleSelectDrill(idx)}
                className={`px-3 py-1.5 text-xs font-mono-tabular border cursor-pointer transition-colors ${
                  idx === drillIdx
                    ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
                    : 'border-[var(--rule)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                }`}
              >
                Excerpt {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-[var(--rule)] bg-[var(--surface)] p-6 space-y-4">
          <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
            {drill.source}
          </div>
          <p className="font-serif-passage text-base sm:text-lg text-[var(--ink)] leading-relaxed">
            “{drill.excerpt}”
          </p>
        </div>

        <div className="border-t border-[var(--rule)] divide-y divide-[var(--rule)]">
          {drill.questions.map((q, i) => {
            const open = !!revealed[i];
            return (
              <div key={q.prompt} className="py-4">
                <button
                  type="button"
                  onClick={() => toggleReveal(i)}
                  className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
                >
                  <span className="text-sm font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                    {q.prompt}
                  </span>
                  <span className="text-xs font-mono-tabular text-[var(--text-muted)] inline-flex items-center gap-1 shrink-0">
                    {open ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {open ? 'Hide' : 'Check'}
                  </span>
                </button>
                {open && (
                  <p className="text-sm text-[var(--text)] mt-2.5 pl-4 border-l-2 border-[var(--accent)] leading-relaxed">
                    {q.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              setRevealed(
                allRevealed
                  ? {}
                  : Object.fromEntries(drill.questions.map((_, i) => [i, true]))
              )
            }
            className="text-xs font-mono-tabular text-[var(--text-muted)] hover:text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {allRevealed ? 'Reset answers' : 'Reveal all 4 answers'}
          </button>
          <button
            type="button"
            onClick={() => handleSelectDrill((drillIdx + 1) % FOUR_QUESTION_DRILLS.length)}
            className="text-xs font-medium text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            Next excerpt <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 2. Five Recurring LNAT Distractor Traps */}
      <section className="space-y-4">
        <div>
          <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--text-muted)]">
            02 · Section A Trap Recognition
          </div>
          <h3 className="font-display text-2xl text-[var(--ink)] mt-0.5">
            Five Classic LNAT Distractor Patterns
          </h3>
        </div>
        <div className="border-t border-[var(--rule)] divide-y divide-[var(--rule)]">
          {DISTRACTOR_TRAPS.map((trap, i) => {
            const isOpen = flippedTrap === i;
            return (
              <div key={trap.name} className="py-4">
                <button
                  type="button"
                  onClick={() => setFlippedTrap(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-mono-tabular text-[var(--text-muted)]">
                      0{i + 1}
                    </span>
                    <span className="text-base font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                      {trap.name}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="mt-3 pl-7 space-y-2 text-sm">
                    <div className="text-[var(--text-muted)]">
                      <span className="text-[var(--ink)] font-medium">Signal: </span>
                      {trap.signal}
                    </div>
                    <div className="text-[var(--text-muted)]">
                      <span className="text-[var(--ink)] font-medium">Example: </span>
                      {trap.example}
                    </div>
                    <div className="text-[var(--accent)] flex items-start gap-2 pt-1">
                      <Check className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{trap.rule}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Section B 40-Minute Pacing Blueprint */}
      <section className="space-y-4">
        <div>
          <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--text-muted)]">
            03 · Section B Essay Blueprint
          </div>
          <h3 className="font-display text-2xl text-[var(--ink)] mt-0.5">
            40-Minute Timing Plan (500–600w Target · 750w Cap)
          </h3>
        </div>
        <div className="border-t border-[var(--rule)] divide-y divide-[var(--rule)]">
          {ESSAY_TIMELINE.map((step) => (
            <div key={step.mins} className="py-3.5 grid sm:grid-cols-12 gap-2 sm:gap-4 items-baseline">
              <div className="sm:col-span-2 text-xs font-mono-tabular text-[var(--accent)]">
                {step.mins}
              </div>
              <div className="sm:col-span-3 text-sm font-medium text-[var(--ink)]">
                {step.phase}
              </div>
              <div className="sm:col-span-7 text-sm text-[var(--text-muted)] leading-relaxed">
                {step.detail}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
