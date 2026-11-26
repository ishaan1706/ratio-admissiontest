import React, { useEffect, useState } from 'react';
import { Calculator, Check, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { TestId } from '../data/allTests';

/* ── Shared compact On-Screen UCAT Basic Calculator ───────────────────────── */
export const UcatBasicCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);

  const pressDigit = (d: string) => {
    if (fresh) {
      setDisplay(d === '.' ? '0.' : d);
      setFresh(false);
    } else {
      if (d === '.' && display.includes('.')) return;
      setDisplay(display === '0' && d !== '.' ? d : display + d);
    }
  };

  const compute = (a: number, b: number, operator: string) => {
    if (operator === '+') return a + b;
    if (operator === '-') return a - b;
    if (operator === '×') return a * b;
    if (operator === '÷') return b === 0 ? 0 : a / b;
    return b;
  };

  const pressOp = (nextOp: string) => {
    const val = parseFloat(display);
    if (acc === null) {
      setAcc(val);
    } else if (op && !fresh) {
      const res = compute(acc, val, op);
      setAcc(res);
      setDisplay(String(Number(res.toPrecision(10))));
    }
    setOp(nextOp);
    setFresh(true);
  };

  const pressEq = () => {
    if (acc === null || !op) return;
    const res = compute(acc, parseFloat(display), op);
    setDisplay(String(Number(res.toPrecision(10))));
    setAcc(null);
    setOp(null);
    setFresh(true);
  };

  const pressClear = () => {
    setDisplay('0');
    setAcc(null);
    setOp(null);
    setFresh(true);
  };

  const pressSqrt = () => {
    const val = parseFloat(display);
    if (val < 0) return;
    setDisplay(String(Number(Math.sqrt(val).toPrecision(10))));
    setFresh(true);
  };

  const buttons = [
    ['C', '√', '÷', '×'],
    ['7', '8', '9', '-'],
    ['4', '5', '6', '+'],
    ['1', '2', '3', '='],
    ['0', '.', '±', '%'],
  ];

  const handleBtn = (b: string) => {
    if (b === 'C') return pressClear();
    if (b === '√') return pressSqrt();
    if (b === '=') return pressEq();
    if (b === '±') {
      setDisplay(String(-parseFloat(display)));
      return;
    }
    if (b === '%') {
      setDisplay(String(parseFloat(display) / 100));
      setFresh(true);
      return;
    }
    if (['+', '-', '×', '÷'].includes(b)) return pressOp(b);
    pressDigit(b);
  };

  return (
    <div className="border border-[var(--rule)] bg-[var(--surface)] p-4 w-full max-w-[260px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono-tabular uppercase tracking-wider text-[var(--text-muted)] inline-flex items-center gap-1">
          <Calculator className="w-3 h-3 text-[var(--accent)]" />
          UCAT Basic Calc
        </span>
        <span className="text-[10px] font-mono-tabular text-[var(--text-muted)]">
          {op ?? ''}
        </span>
      </div>
      <div className="bg-[var(--bg)] border border-[var(--rule)] px-3 py-2 text-right font-mono-tabular text-lg text-[var(--ink)] mb-2.5 truncate">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {buttons.flat().map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => handleBtn(b)}
            className={`py-2 text-xs font-mono-tabular border cursor-pointer transition-colors ${
              b === '='
                ? 'bg-[var(--accent)] text-[var(--accent-fg)] border-[var(--accent)] font-semibold'
                : ['+', '-', '×', '÷', 'C'].includes(b)
                ? 'border-[var(--rule)] text-[var(--ink)] hover:border-[var(--accent)]'
                : 'border-[var(--rule)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--border-strong)]'
            }`}
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ── UCAT Revision Tools ──────────────────────────────────────────────────── */
const UcatRevisionTools: React.FC = () => {
  const [vr, setVr] = useState(30);
  const [dm, setDm] = useState(24);
  const [qr, setQr] = useState(26);
  const [cardIdx, setCardIdx] = useState(0);
  const [showBack, setShowBack] = useState(false);

  const scaleSubtest = (raw: number, max: number) =>
    Math.round(300 + Math.min(1, Math.max(0, raw / max)) * 600);
  const vrScaled = scaleSubtest(vr, 44);
  const dmScaled = scaleSubtest(dm, 35);
  const qrScaled = scaleSubtest(qr, 36);
  const total = vrScaled + dmScaled + qrScaled;
  const decile =
    total >= 2160
      ? 'Top 10% (9th decile)'
      : total >= 2040
      ? 'Top 20% (8th decile)'
      : total >= 1950
      ? 'Top 30% (7th decile)'
      : total >= 1860
      ? 'Above average (5th–6th decile)'
      : 'Below cohort median (~1860)';

  const MENTAL_CARDS = [
    { q: 'Percentage change formula', a: '((New − Old) / Old) × 100. Always divide by the ORIGINAL value.' },
    { q: 'Reverse percentage (after +15% rise, price is £230)', a: 'Divide by 1.15 → £230 / 1.15 = £200.' },
    { q: 'Compound growth over 3 years at 10%', a: 'Multiply by 1.1³ = 1.331 (+33.1%, NOT +30%).' },
    { q: 'Average speed for two equal distances at 40 mph & 60 mph', a: 'Harmonic mean: (2 × 40 × 60) / (40 + 60) = 48 mph (NOT 50 mph!).' },
    { q: 'UCAT Triage Rule when stuck > 45s', a: 'Guess, Flag, Move On. Every question is worth 1 mark — never sacrifice 3 easy questions for 1 hard table.' }
  ];

  const card = MENTAL_CARDS[cardIdx];

  return (
    <div className="space-y-10">
      {/* 2026 Score & Decile Estimator */}
      <section className="space-y-4">
        <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
          01 · 2026 UCAT Score &amp; Decile Estimator (900–2700)
        </div>
        <div className="grid md:grid-cols-12 gap-6 border border-[var(--rule)] bg-[var(--surface)] p-5">
          <div className="md:col-span-7 space-y-4">
            {[
              { label: 'Verbal Reasoning (44 Qs · 22m)', val: vr, max: 44, scaled: vrScaled, set: setVr },
              { label: 'Decision Making (35 Qs · 37m)', val: dm, max: 35, scaled: dmScaled, set: setDm },
              { label: 'Quantitative Reasoning (36 Qs · 26m)', val: qr, max: 36, scaled: qrScaled, set: setQr },
            ].map((s) => (
              <div key={s.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--ink)]">{s.label}</span>
                  <span className="font-mono-tabular text-[var(--accent)]">
                    {s.val}/{s.max} → {s.scaled}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={s.max}
                  value={s.val}
                  onChange={(e) => s.set(Number(e.target.value))}
                  className="w-full accent-[var(--accent)]"
                />
              </div>
            ))}
          </div>
          <div className="md:col-span-5 md:border-l border-[var(--rule)] md:pl-6 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--text-muted)]">
                Estimated 2026 Cognitive Total
              </div>
              <div className="font-mono-tabular text-4xl font-semibold text-[var(--ink)] mt-1">
                {total} <span className="text-base text-[var(--text-muted)]">/ 2700</span>
              </div>
              <div className="text-xs text-[var(--accent)] mt-1.5">{decile}</div>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-4 leading-relaxed">
              Abstract Reasoning was removed from UCAT from 2025 onward. Most UK medical schools
              screen on cognitive total (900–2700) plus SJT Band 1–2.
            </p>
          </div>
        </div>
      </section>

      {/* Pacing Table + On-Screen Calculator */}
      <section className="grid md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-7 space-y-3">
          <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--text-muted)]">
            02 · Official Subtest Pacing Targets
          </div>
          <div className="border-t border-[var(--rule)] divide-y divide-[var(--rule)] text-xs">
            {[
              { sub: 'Verbal Reasoning', qs: '44 Qs', time: '22 min', pace: '30.0s / Q', tip: 'Scan keywords first; never bring outside medical facts.' },
              { sub: 'Decision Making', qs: '35 Qs', time: '37 min', pace: '63.4s / Q', tip: 'Draw quick Venn / syllogism arrows on whiteboard.' },
              { sub: 'Quantitative Reasoning', qs: '36 Qs', time: '26 min', pace: '43.3s / Q', tip: 'Practice with the basic on-screen calculator, not a scientific one.' },
              { sub: 'Situational Judgement', qs: '69 Qs', time: '26 min', pace: '22.6s / Q', tip: 'Patient safety > honesty > teamwork > escalate appropriately.' },
            ].map((r) => (
              <div key={r.sub} className="py-3 grid grid-cols-12 gap-2">
                <div className="col-span-4 font-medium text-[var(--ink)]">{r.sub}</div>
                <div className="col-span-3 font-mono-tabular text-[var(--accent)]">{r.pace}</div>
                <div className="col-span-5 text-[var(--text-muted)]">{r.tip}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-5 flex flex-col items-start md:items-end gap-2">
          <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--text-muted)]">
            03 · Practice Calculator
          </div>
          <UcatBasicCalculator />
        </div>
      </section>

      {/* Mental Maths Flashcard */}
      <section className="space-y-3">
        <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--text-muted)]">
          04 · High-Yield QR Mental Maths Flashcards ({cardIdx + 1}/{MENTAL_CARDS.length})
        </div>
        <div className="border border-[var(--rule)] bg-[var(--surface)] p-5 space-y-3">
          <div className="text-sm font-medium text-[var(--ink)]">{card.q}</div>
          {showBack ? (
            <div className="text-sm text-[var(--accent)] pt-2 border-t border-[var(--rule)]">
              {card.a}
            </div>
          ) : null}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setShowBack((s) => !s)}
              className="text-xs font-mono-tabular text-[var(--ink)] border border-[var(--rule)] px-3 py-1.5 cursor-pointer hover:border-[var(--accent)] inline-flex items-center gap-1.5"
            >
              {showBack ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showBack ? 'Hide answer' : 'Reveal answer'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowBack(false);
                setCardIdx((i) => (i + 1) % MENTAL_CARDS.length);
              }}
              className="text-xs font-medium text-[var(--accent)] cursor-pointer hover:underline"
            >
              Next card →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ── TARA Revision Tools ──────────────────────────────────────────────────── */
const TaraRevisionTools: React.FC = () => {
  const [ctRaw, setCtRaw] = useState(14);
  const [psRaw, setPsRaw] = useState(14);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toUatScale = (raw: number) =>
    Number((1.0 + (Math.min(22, Math.max(0, raw)) / 22) * 8.0).toFixed(1));

  const CT_TYPES = [
    { name: 'Identifying the Main Conclusion', signal: 'Look for "therefore", "thus", "so", "should", "must" — test with the "Because Test".', trap: 'Picking an intermediate conclusion that itself supports a broader final claim.' },
    { name: 'Identifying a Flaw', signal: 'Correlation → causation, straw man, false dichotomy, hasty generalisation, confusing necessary vs sufficient.', trap: 'Attacking the truth of a premise instead of the logical leap from premise to conclusion.' },
    { name: 'Identifying an Assumption', signal: 'Find the missing bridge connecting a new concept in the conclusion to the premises.', trap: 'Use the Negation Test: if negating the option destroys the argument, it is a required assumption.' },
    { name: 'Strengthening / Weakening', signal: 'Introduces a new external fact that makes the conclusion more or less likely.', trap: 'Choosing an option that merely restates a premise or is out of scope.' },
    { name: 'Matching Arguments (Parallel Reasoning)', signal: 'Abstract the structure into letters (If A → B; not B; therefore not A).', trap: 'Being seduced by an option on the same topic that uses a different logical structure.' },
    { name: 'Applying a Principle', signal: 'Extract the general moral/policy rule underlying the passage’s recommendation.', trap: 'Picking a principle that is narrower than the passage’s conclusion.' },
    { name: 'Drawing a Conclusion', signal: 'What MUST follow from the given facts — nothing stronger.', trap: 'Extrapolating beyond the stated numbers or qualifiers ("some" ≠ "most").' },
  ];

  return (
    <div className="space-y-10">
      {/* UAT-UK 1.0–9.0 Score Estimator */}
      <section className="space-y-4">
        <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
          01 · TARA UAT-UK Score Estimator (1.0–9.0 Scale)
        </div>
        <div className="grid sm:grid-cols-2 gap-6 border border-[var(--rule)] bg-[var(--surface)] p-5">
          {[
            { label: 'Paper 1 · Critical Thinking (22 Qs · 40m)', val: ctRaw, set: setCtRaw },
            { label: 'Paper 2 · Problem Solving (22 Qs · 40m)', val: psRaw, set: setPsRaw },
          ].map((p) => (
            <div key={p.label} className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--ink)]">{p.label}</span>
                <span className="font-mono-tabular text-[var(--accent)]">
                  {p.val}/22 → {toUatScale(p.val)} / 9.0
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={22}
                value={p.val}
                onChange={(e) => p.set(Number(e.target.value))}
                className="w-full accent-[var(--accent)]"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 7 Official Critical Thinking Question Types */}
      <section className="space-y-3">
        <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--text-muted)]">
          02 · All 7 Official UAT-UK Critical Thinking Question Types
        </div>
        <div className="border-t border-[var(--rule)] divide-y divide-[var(--rule)]">
          {CT_TYPES.map((t, idx) => {
            const open = openIdx === idx;
            return (
              <div key={t.name} className="py-3.5">
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : idx)}
                  className="w-full flex items-center justify-between text-left cursor-pointer group"
                >
                  <span className="text-sm font-medium text-[var(--ink)] group-hover:text-[var(--accent)]">
                    0{idx + 1} · {t.name}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">{open ? '−' : '+'}</span>
                </button>
                {open && (
                  <div className="mt-2.5 pl-6 space-y-1.5 text-xs leading-relaxed">
                    <div className="text-[var(--text)]">
                      <span className="font-medium text-[var(--ink)]">Method: </span>
                      {t.signal}
                    </div>
                    <div className="text-[var(--text-muted)]">
                      <span className="font-medium text-[var(--accent)]">Common trap: </span>
                      {t.trap}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

/* ── ESAT Revision Tools ──────────────────────────────────────────────────── */
const ESAT_SPEC_KEY = 'ratio_esat_spec_v1';

const ESAT_FLASHCARDS = [
  { mod: 'Maths 1', q: 'Quadratic discriminant conditions', a: 'b² − 4ac > 0 (2 distinct real roots), = 0 (1 repeated root), < 0 (no real roots).' },
  { mod: 'Maths 1', q: 'Sum of geometric series (finite & infinite)', a: 'Sₙ = a(1 − rⁿ)/(1 − r); S∞ = a/(1 − r) for |r| < 1.' },
  { mod: 'Maths 1', q: 'Exact trig values: sin 30°, cos 30°, sin 45°, tan 60°', a: 'sin 30° = 1/2, cos 30° = √3/2, sin 45° = √2/2, tan 60° = √3.' },
  { mod: 'Maths 2', q: 'Derivative of ln(x), e^(kx), sin(kx), cos(kx)', a: '1/x, k·e^(kx), k·cos(kx), −k·sin(kx).' },
  { mod: 'Physics', q: 'SUVAT equations (no formula sheet!)', a: 'v = u + at; s = ut + ½at²; v² = u² + 2as; s = ½(u + v)t.' },
  { mod: 'Physics', q: 'Electrical power & resistance in parallel', a: 'P = IV = I²R = V²/R; 1/R_total = 1/R₁ + 1/R₂.' },
  { mod: 'Physics', q: 'Wave speed & photon energy', a: 'v = fλ; E = hf = hc/λ.' },
  { mod: 'Chemistry', q: 'Ideal gas equation & molar volume at r.t.p.', a: 'pV = nRT (p in Pa, V in m³, T in K); 1 mol gas ≈ 24 dm³ at r.t.p.' },
  { mod: 'Chemistry', q: 'Enthalpy of reaction from bond enthalpies', a: 'ΔH = Σ(bonds broken) − Σ(bonds formed).' },
];

const ESAT_SPEC_TOPICS = [
  'M1 · Surds, indices & algebraic manipulation',
  'M1 · Quadratics, inequalities & coordinate geometry',
  'M1 · Trigonometry, sine/cosine rules & radians',
  'M1 · Sequences, series & basic calculus',
  'M2 · Logarithms, exponentials & binomial expansion',
  'M2 · Vectors, kinematics & integration',
  'Physics · Mechanics, momentum & energy',
  'Physics · Electricity, circuits & internal resistance',
  'Physics · Waves, optics & nuclear decay',
  'Chemistry · Moles, titrations & energetics',
  'Chemistry · Kinetics, equilibria & organic mechanisms',
  'Biology · Cell division, genetics, enzymes & homeostasis',
];

const EsatRevisionTools: React.FC = () => {
  const [cardIdx, setCardIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(ESAT_SPEC_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(ESAT_SPEC_KEY, JSON.stringify(checked));
    } catch {
      // ignore
    }
  }, [checked]);

  const card = ESAT_FLASHCARDS[cardIdx];
  const doneCount = ESAT_SPEC_TOPICS.filter((t) => checked[t]).length;

  return (
    <div className="space-y-10">
      {/* No-Formula-Sheet Memorisation Deck */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
            01 · No-Formula-Sheet Memorisation Deck ({cardIdx + 1}/{ESAT_FLASHCARDS.length})
          </div>
          <span className="text-[11px] font-mono-tabular text-[var(--text-muted)]">
            No calculator · No formula booklet in ESAT
          </span>
        </div>
        <div className="border border-[var(--rule)] bg-[var(--surface)] p-5 space-y-3">
          <div className="text-[10px] font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
            {card.mod}
          </div>
          <div className="text-base font-medium text-[var(--ink)]">{card.q}</div>
          {revealed && (
            <div className="text-sm font-mono-tabular text-[var(--accent)] pt-3 border-t border-[var(--rule)]">
              {card.a}
            </div>
          )}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setRevealed((r) => !r)}
              className="text-xs font-mono-tabular border border-[var(--rule)] px-3 py-1.5 text-[var(--ink)] hover:border-[var(--accent)] cursor-pointer inline-flex items-center gap-1.5"
            >
              {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {revealed ? 'Hide formula' : 'Check formula'}
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setRevealed(false);
                  setCardIdx((i) => (i - 1 + ESAT_FLASHCARDS.length) % ESAT_FLASHCARDS.length);
                }}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--ink)] cursor-pointer"
              >
                ← Prev
              </button>
              <button
                type="button"
                onClick={() => {
                  setRevealed(false);
                  setCardIdx((i) => (i + 1) % ESAT_FLASHCARDS.length);
                }}
                className="text-xs font-medium text-[var(--accent)] hover:underline cursor-pointer"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Official Content Specification Checklist */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--text-muted)]">
            02 · ESAT Specification Mastery Checklist ({doneCount}/{ESAT_SPEC_TOPICS.length})
          </div>
          {doneCount > 0 && (
            <button
              type="button"
              onClick={() => setChecked({})}
              className="text-[11px] font-mono-tabular text-[var(--text-muted)] hover:text-[var(--ink)] inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {ESAT_SPEC_TOPICS.map((topic) => {
            const isDone = !!checked[topic];
            return (
              <button
                key={topic}
                type="button"
                onClick={() => setChecked((prev) => ({ ...prev, [topic]: !prev[topic] }))}
                className={`p-3 border text-left text-xs flex items-center gap-2.5 cursor-pointer transition-colors ${
                  isDone
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)]'
                    : 'border-[var(--rule)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--ink)]'
                }`}
              >
                <span
                  className={`w-4 h-4 border flex items-center justify-center shrink-0 ${
                    isDone ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]' : 'border-[var(--rule)]'
                  }`}
                >
                  {isDone && <Check className="w-3 h-3" />}
                </span>
                <span>{topic}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

/* ── Digital SAT Revision Tools ───────────────────────────────────────────── */
const SatRevisionTools: React.FC = () => {
  const [rwRaw, setRwRaw] = useState(44);
  const [mathRaw, setMathRaw] = useState(36);

  const rwScore = Math.round((200 + (rwRaw / 54) * 600) / 10) * 10;
  const mathScore = Math.round((200 + (mathRaw / 44) * 600) / 10) * 10;

  return (
    <div className="space-y-10">
      {/* 400–1600 Estimator */}
      <section className="space-y-4">
        <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
          01 · Digital SAT Score Estimator (400–1600)
        </div>
        <div className="grid md:grid-cols-12 gap-6 border border-[var(--rule)] bg-[var(--surface)] p-5">
          <div className="md:col-span-7 space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--ink)]">Reading &amp; Writing (54 Qs · 2 adaptive modules)</span>
                <span className="font-mono-tabular text-[var(--accent)]">{rwRaw}/54 → {rwScore}</span>
              </div>
              <input
                type="range"
                min={0}
                max={54}
                value={rwRaw}
                onChange={(e) => setRwRaw(Number(e.target.value))}
                className="w-full accent-[var(--accent)]"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--ink)]">Math (44 Qs · 2 adaptive modules)</span>
                <span className="font-mono-tabular text-[var(--accent)]">{mathRaw}/44 → {mathScore}</span>
              </div>
              <input
                type="range"
                min={0}
                max={44}
                value={mathRaw}
                onChange={(e) => setMathRaw(Number(e.target.value))}
                className="w-full accent-[var(--accent)]"
              />
            </div>
          </div>
          <div className="md:col-span-5 md:border-l border-[var(--rule)] md:pl-6 flex flex-col justify-center">
            <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--text-muted)]">
              Estimated Composite
            </div>
            <div className="font-mono-tabular text-4xl font-semibold text-[var(--ink)] mt-1">
              {rwScore + mathScore} <span className="text-base text-[var(--text-muted)]">/ 1600</span>
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              R&amp;W {rwScore} · Math {mathScore}
            </div>
          </div>
        </div>
      </section>

      {/* Official Bluebook Reference Sheet + Desmos Moves */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="border border-[var(--rule)] bg-[var(--surface)] p-5 space-y-3">
          <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
            02 · Official Bluebook Math Reference Sheet
          </div>
          <ul className="space-y-2 text-xs font-mono-tabular text-[var(--text)]">
            <li>Circle: A = πr² · C = 2πr · 360° = 2π rad</li>
            <li>Triangle: A = ½bh · Pythagoras: a² + b² = c²</li>
            <li>30°–60°–90°: sides x : x√3 : 2x</li>
            <li>45°–45°–90°: sides s : s : s√2</li>
            <li>Rectangular Prism: V = lwh · Cylinder: V = πr²h</li>
            <li>Sphere: V = (4/3)πr³ · Cone: V = (1/3)πr²h · Pyramid: V = (1/3)lwh</li>
          </ul>
        </div>
        <div className="border border-[var(--rule)] bg-[var(--surface)] p-5 space-y-3">
          <div className="text-xs font-mono-tabular uppercase tracking-wider text-[var(--accent)]">
            03 · High-Yield Rules &amp; Desmos Power Moves
          </div>
          <ul className="space-y-2 text-xs text-[var(--text)] leading-relaxed">
            <li><strong className="text-[var(--ink)]">Semicolon = Period:</strong> Both sides must be full independent clauses.</li>
            <li><strong className="text-[var(--ink)]">Colon rule:</strong> Left side MUST be a complete sentence; right side explains or lists.</li>
            <li><strong className="text-[var(--ink)]">Desmos Regression:</strong> Type a table of points then <code className="font-mono-tabular text-[var(--accent)]">y1 ~ mx1 + b</code> to solve line/quadratic constants in 5s.</li>
            <li><strong className="text-[var(--ink)]">Desmos Sliders:</strong> Type equations with constant <code className="font-mono-tabular text-[var(--accent)]">k</code> and drag the slider to match tangent/no-solution conditions.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export const ExamRevisionTools: React.FC<{ testId: TestId }> = ({ testId }) => {
  if (testId === 'ucat') return <UcatRevisionTools />;
  if (testId === 'tara') return <TaraRevisionTools />;
  if (testId === 'esat') return <EsatRevisionTools />;
  if (testId === 'sat') return <SatRevisionTools />;
  return null;
};
