export interface TmuaTechniqueMeta {
  id: string;
  title: string;
  spec: string;
  idea: string;
}

export const TMUA_TECHNIQUE_META: Record<string, TmuaTechniqueMeta> = {
  // Paper 1 (24 method families)
  'rational-sign': {
    id: 'rational-sign',
    title: 'Rational Sign & Domain Cancellation',
    spec: 'MM1',
    idea: 'Record excluded denominator roots before cancelling common factors, then sign-chart the reduced ratio.',
  },
  'parameter-roots': {
    id: 'parameter-roots',
    title: 'Discriminant & Parameterised Roots',
    spec: 'MM1',
    idea: 'Translate root-count or root-location conditions into discriminant inequalities and vertex bounds.',
  },
  'adjacent-coefficients': {
    id: 'adjacent-coefficients',
    title: 'Binomial & Polynomial Coefficient Ratios',
    spec: 'MM1/MM2',
    idea: 'Compare adjacent terms via nCr ratios to isolate a single parameter without expanding.',
  },
  'linear-remainder': {
    id: 'linear-remainder',
    title: 'Factor & Remainder Theorem Systems',
    spec: 'MM1',
    idea: 'Evaluate P(a) directly to build linear equations in unknown coefficients instead of long-dividing.',
  },
  'absolute-composition': {
    id: 'absolute-composition',
    title: 'Modulus & Composite Function Branches',
    spec: 'MM8',
    idea: 'Split at critical points where inner expressions change sign, checking each branch against its domain.',
  },
  'log-domain': {
    id: 'log-domain',
    title: 'Logarithm Laws & Domain Filtering',
    spec: 'MM5',
    idea: 'Combine logs with matching bases and discard extraneous roots that violate positive-argument domains.',
  },
  'preimage-interval': {
    id: 'preimage-interval',
    title: 'Graph Transformations & Pre-image Intervals',
    spec: 'MM8',
    idea: 'Invert y = a·f(bx + c) + d step-by-step on endpoints to find transformed domains and ranges.',
  },
  'transformed-root-sum': {
    id: 'transformed-root-sum',
    title: 'Symmetry & Transformed Root Sums',
    spec: 'MM8',
    idea: 'Use horizontal scaling/translation symmetry to sum roots without finding individual values.',
  },
  'inscribed-rectangle': {
    id: 'inscribed-rectangle',
    title: 'Curve-Bounded Geometry & Optimisation',
    spec: 'MM6/MM8',
    idea: 'Express area or perimeter as a single-variable function of the corner coordinate and maximise.',
  },
  'split-progression': {
    id: 'split-progression',
    title: 'Interleaved & Split Progressions',
    spec: 'MM2',
    idea: 'Separate odd/even or periodic subsequences into clean AP/GP blocks before summing.',
  },
  'alternate-series': {
    id: 'alternate-series',
    title: 'Alternating & Infinite Geometric Sums',
    spec: 'MM2',
    idea: 'Check |r| < 1 convergence and pair adjacent terms or apply a/(1 − r) with exact fractions.',
  },
  'secant-gap': {
    id: 'secant-gap',
    title: 'Line–Curve Secant Intercepts',
    spec: 'MM3',
    idea: 'Use Vieta root differences √((α+β)² − 4αβ) to find chord horizontal/vertical gaps fast.',
  },
  'chord-length': {
    id: 'chord-length',
    title: 'Circle Chords & Perpendicular Distance',
    spec: 'MM3',
    idea: 'Complete the square for centre/radius, then apply Pythagoras with centre-to-line distance.',
  },
  'crossing-tangents': {
    id: 'crossing-tangents',
    title: 'Tangents, Normals & Intersection Points',
    spec: 'MM6',
    idea: 'Write tangent equations at two points and solve simultaneously using symmetry where possible.',
  },
  'cubic-turning-values': {
    id: 'cubic-turning-values',
    title: 'Cubic Stationary Values & Root Counting',
    spec: 'MM6/MM8',
    idea: 'Locate turning points via f′(x) = 0 and compare local max/min signs to count real intersections.',
  },
  'negative-area': {
    id: 'negative-area',
    title: 'Signed Integrals vs Geometric Area',
    spec: 'MM7',
    idea: 'Find x-intercepts first and split the integral wherever the curve crosses the axis.',
  },
  'ratio-of-areas': {
    id: 'ratio-of-areas',
    title: 'Transformed Integrals & Area Ratios',
    spec: 'MM7',
    idea: 'Use scaling, translation, and reflection properties of ∫f(x)dx to compare regions without grinding algebra.',
  },
  'squared-sine': {
    id: 'squared-sine',
    title: 'Pythagorean Trig Quadratics',
    spec: 'MM4',
    idea: 'Rewrite sin²x = 1 − cos²x (or vice versa) to form a quadratic and count all solutions on the interval.',
  },
  'cosine-endpoint': {
    id: 'cosine-endpoint',
    title: 'Trigonometric Bounds & Interval Endpoints',
    spec: 'MM4',
    idea: 'Check both stationary points and interval endpoints on the unit circle for exact extrema.',
  },
  'conditioned-pair': {
    id: 'conditioned-pair',
    title: 'Conditional Probability & Sample-Space Pruning',
    spec: 'MM8',
    idea: 'Restrict directly to the conditioned event rather than expanding full Bayes trees.',
  },
  'digit-parity': {
    id: 'digit-parity',
    title: 'Combinatorial Counting with Parity Constraints',
    spec: 'MM1',
    idea: 'Fix the constrained last/first digit first, then count remaining slots without double-counting.',
  },
  'exclusive-multiples': {
    id: 'exclusive-multiples',
    title: 'Inclusion–Exclusion on Multiples',
    spec: 'MM1',
    idea: 'Count ⌊N/a⌋ + ⌊N/b⌋ − ⌊N/lcm(a,b)⌋ cleanly while watching strict vs inclusive bounds.',
  },
  'histogram-mean': {
    id: 'histogram-mean',
    title: 'Weighted Means & Frequency Balancing',
    spec: 'MM8',
    idea: 'Use total-sum invariance (Σ f·x) or deviation-from-mean balancing for quick mental arithmetic.',
  },
  'fixed-spread': {
    id: 'fixed-spread',
    title: 'Linear Scaling of Mean & Spread',
    spec: 'MM8',
    idea: 'Shifts change mean/median but not range/SD; scaling multiplies both location and spread.',
  },

  // Paper 2 (22 method families)
  'divisibility-direction': {
    id: 'divisibility-direction',
    title: 'Divisibility Implication Direction',
    spec: 'Arg2',
    idea: 'Test P ⇒ Q and Q ⇒ P separately using the smallest positive witness for each premise.',
  },
  'integer-threshold': {
    id: 'integer-threshold',
    title: 'Boundary & Integer Threshold Conditions',
    spec: 'Arg2',
    idea: 'Check the exact boundary integer and ±1 neighbours to distinguish necessary vs sufficient.',
  },
  'residue-compatibility': {
    id: 'residue-compatibility',
    title: 'Modular Residue Compatibility',
    spec: 'Arg2',
    idea: 'List residue classes modulo lcm(m, n) to verify whether one congruence forces the other.',
  },
  'negated-bound': {
    id: 'negated-bound',
    title: 'Negating Inequalities & Compound Bounds',
    spec: 'Arg1/Arg3',
    idea: 'Flip strict/non-strict inequalities carefully (¬(x < a) is x ≥ a) and apply De Morgan’s laws.',
  },
  'contrapositive-form': {
    id: 'contrapositive-form',
    title: 'Contrapositive vs Converse Equivalence',
    spec: 'Arg2',
    idea: 'Always match P ⇒ Q with ¬Q ⇒ ¬P; reject the converse (Q ⇒ P) and inverse (¬P ⇒ ¬Q).',
  },
  'quantifier-order': {
    id: 'quantifier-order',
    title: 'Quantifier Order & Negation Flipping',
    spec: 'Arg4',
    idea: 'Preserve ∀/∃ dependency order: ∀x ∃y lets y depend on x; ∃y ∀x demands one uniform y.',
  },
  'composed-implications': {
    id: 'composed-implications',
    title: 'Chaining & Reversing Implications',
    spec: 'Arg2',
    idea: 'Build the directed implication graph (including contrapositives) and trace valid paths only.',
  },
  'interval-witness': {
    id: 'interval-witness',
    title: 'Interval Counterexamples',
    spec: 'Prf5',
    idea: 'Pick a value that makes the premise TRUE and conclusion FALSE — check 0, negatives, and endpoints.',
  },
  'square-bound-witness': {
    id: 'square-bound-witness',
    title: 'Sign & Squaring Counterexamples',
    spec: 'Prf5',
    idea: 'Test negative numbers and fractions in (0, 1) where squaring reverses order.',
  },
  'witness-scope': {
    id: 'witness-scope',
    title: 'What a Single Counterexample Refutes',
    spec: 'Prf5',
    idea: 'One witness disproves “for all”, not “for some”; a case where the premise is false proves nothing.',
  },
  'lost-factor': {
    id: 'lost-factor',
    title: 'Proof Error: Hidden Division by Zero',
    spec: 'Err1',
    idea: 'Check every cancellation step for the omitted zero case before accepting a reduced equation.',
  },
  'lost-sign': {
    id: 'lost-sign',
    title: 'Proof Error: Unknown Sign in Inequalities',
    spec: 'Err1',
    idea: 'Multiplying or dividing an inequality by an expression that can be negative invalidates the step.',
  },
  'order-reversal': {
    id: 'order-reversal',
    title: 'Proof Error: One-Way & Circular Steps',
    spec: 'Err2',
    idea: 'Working backwards from the target only proves it if every single step is reversible (⇔).',
  },
  'longest-gap': {
    id: 'longest-gap',
    title: 'Extremal & Pigeonhole Gap Arguments',
    spec: 'Prf1',
    idea: 'Prove both that the bound is guaranteed and construct an explicit worst-case avoiding a tighter bound.',
  },
  'coprime-split': {
    id: 'coprime-split',
    title: 'Coprime Factorisation & Divisibility Cases',
    spec: 'Prf2',
    idea: 'Split divisibility by ab into coprime factors gcd(a, b) = 1; watch out when factors share a prime.',
  },
  'parity-classification': {
    id: 'parity-classification',
    title: 'Exhaustive Odd/Even Parity Cases',
    spec: 'Prf2',
    idea: 'Partition integers into 2k and 2k + 1 and verify the conclusion holds in every case.',
  },
  'pair-forcing': {
    id: 'pair-forcing',
    title: 'Pigeonhole Pair-Forcing Bounds',
    spec: 'Prf1',
    idea: 'Worst-case pick one from each pair, then +1 forces a complete pair.',
  },
  'intersection-bounds': {
    id: 'intersection-bounds',
    title: 'Set Overlap & Min/Max Intersection Bounds',
    spec: 'Prf1',
    idea: 'Apply |A ∩ B| = |A| + |B| − |A ∪ B| with |A ∪ B| ≤ |U| to lock minimum overlap.',
  },
  'residue-exhaustion': {
    id: 'residue-exhaustion',
    title: 'Exhaustive Modular Residue Proofs',
    spec: 'Prf2',
    idea: 'Check all residues 0, 1, …, m − 1 (e.g. squares mod 3 or mod 4) to rule out impossible remainders.',
  },
  'invariant-recurrence': {
    id: 'invariant-recurrence',
    title: 'Invariants & Periodic Recurrences',
    spec: 'Prf1',
    idea: 'Find a quantity preserved at every step (parity, sum, remainder) to rule out unreachable states.',
  },
  'forward-closure': {
    id: 'forward-closure',
    title: 'Closure & Inductive Step Verification',
    spec: 'Prf1',
    idea: 'Check both the base case and whether the rule keeps every generated element inside the claimed set.',
  },
  'irrational-product': {
    id: 'irrational-product',
    title: 'Rational / Irrational Closure & Contradiction',
    spec: 'Prf3',
    idea: 'Assume the opposite is rational and isolate the irrational term; watch the zero-multiplier exception.',
  },
};

export interface KevinvariantResource {
  id: string;
  spec: string;
  title: string;
  description: string;
  url: string;
  group: 'hub' | 'knowledge' | 'reasoning';
}

export const KEVINVARIANT_TMUA_RESOURCES: KevinvariantResource[] = [
  {
    id: 'kv-hub',
    spec: 'Sets A–L',
    title: 'Kevinvariant TMUA Hub & Free Mock Sets A–H',
    description:
      'Original TMUA mock papers (Sets A–H free with full PDF solutions and difficulty ratings) plus timed practice tools.',
    url: 'https://kevinvariant08.github.io/tmua.html',
    group: 'hub',
  },
  {
    id: 'kv-plan',
    spec: '8–10 Weeks',
    title: 'Kevinvariant Maths Admissions Roadmap',
    description:
      'Structured 5-stage preparation order for TMUA, ESAT, STEP, and Oxbridge maths interviews.',
    url: 'https://kevinvariant08.github.io/admissions.html#tmua',
    group: 'hub',
  },
  {
    id: 'kv-mm1',
    spec: 'MM1',
    title: 'Quadratics, Polynomials & Inequalities (PDF)',
    description:
      'Indices, surds, discriminant, unknown-sign inequalities, factor/remainder theorems, and root locations.',
    url: 'https://kevinvariant08.github.io/notes/TMUA_Notes_Algebra.pdf',
    group: 'knowledge',
  },
  {
    id: 'kv-mm2',
    spec: 'MM2',
    title: 'Sequences, Series & Binomial Expansion (PDF)',
    description:
      'Recurrences, periodic sequences, AP/GP sums with parameters, sigma notation, telescoping sums, and binomial coefficients.',
    url: 'https://kevinvariant08.github.io/notes/TMUA_Notes_Sequences.pdf',
    group: 'knowledge',
  },
  {
    id: 'kv-mm3',
    spec: 'MM3',
    title: 'Coordinate Geometry & Circles (PDF)',
    description:
      'Point-to-line distance, circle equations, tangents, chords, pairs of circles, reflections, and shortest paths.',
    url: 'https://kevinvariant08.github.io/notes/TMUA_Notes_Coordinates.pdf',
    group: 'knowledge',
  },
  {
    id: 'kv-mm4',
    spec: 'MM4',
    title: 'Trigonometry (PDF)',
    description:
      'Unit circle exact values, identities, interval solution counting, trig ranges, sectors, and 3D problems.',
    url: 'https://kevinvariant08.github.io/notes/TMUA_Notes_Trigonometry.pdf',
    group: 'knowledge',
  },
  {
    id: 'kv-mm5',
    spec: 'MM5',
    title: 'Exponentials & Logarithms (PDF)',
    description:
      'Log laws, change of base, domain checks, no-calculator comparisons, counting digits, and parameterised solutions.',
    url: 'https://kevinvariant08.github.io/notes/TMUA_Notes_Logarithms.pdf',
    group: 'knowledge',
  },
  {
    id: 'kv-mm67',
    spec: 'MM6–MM7',
    title: 'Tangents, Integration & Area (PDF)',
    description:
      'Differentiation, tangents/normals, signed integrals vs area, FTC, transformed integrals, and the inverse-function rectangle.',
    url: 'https://kevinvariant08.github.io/notes/TMUA_Notes_Calculus.pdf',
    group: 'knowledge',
  },
  {
    id: 'kv-mm8',
    spec: 'MM8',
    title: 'Graphs & Sketching (PDF)',
    description:
      'Stationary points, asymptotes, transformations, trig/modulus sketches, cubic tests, and counting intersections.',
    url: 'https://kevinvariant08.github.io/notes/TMUA_Notes_Graphs.pdf',
    group: 'knowledge',
  },
  {
    id: 'kv-arg',
    spec: 'Arg1–Arg4',
    title: 'Logic for Paper 2 (PDF)',
    description:
      'Implication & "only if", converse/contrapositive, necessary & sufficient conditions, quantifier order, and negation.',
    url: 'https://kevinvariant08.github.io/notes/TMUA_Notes_Logic.pdf',
    group: 'reasoning',
  },
  {
    id: 'kv-prf',
    spec: 'Prf1–5 · Err1–2',
    title: 'Proof & Errors in Proofs (PDF)',
    description:
      'Direct proof, cases, contradiction, contrapositive, counterexamples, and classic Paper 2 proof-error traps.',
    url: 'https://kevinvariant08.github.io/notes/TMUA_Notes_Proof.pdf',
    group: 'reasoning',
  },
];

export const TMUA_FIVE_STAGE_PLAN: Array<{
  stage: string;
  weeks: string;
  title: string;
  body: string;
}> = [
  {
    stage: '01',
    weeks: 'Week 1',
    title: 'Know the test',
    body: 'Read the UAT-UK specification and Paper 2 Logic Primer, then sit one untimed mixed set to benchmark Paper 1 vs Paper 2.',
  },
  {
    stage: '02',
    weeks: 'Weeks 1–3',
    title: 'Build the technique toolkit',
    body: 'Drill weak methods in the 46-family Technique Index and run Daily 5 for mixed no-calculator retrieval.',
  },
  {
    stage: '03',
    weeks: 'Weeks 3–7',
    title: 'Timed papers in order',
    body: 'Sit 75-minute papers in the UAT-UK screen (Ratio Mocks 1–3 + official past papers), flagging slow items and returning later.',
  },
  {
    stage: '04',
    weeks: 'Throughout',
    title: '1 / 3 / 7-day mistake review',
    body: 'Tag every miss and lucky guess. Clear each item across the 1-day, 3-day, and 7-day spaced-repetition ladder without the key.',
  },
  {
    stage: '05',
    weeks: 'Final fortnight',
    title: 'Back-to-back full sittings',
    body: 'Sit Paper 1 and Paper 2 back to back (150 mins total). Never leave an answer blank — there is no negative marking.',
  },
];

// Spaced-repetition 1 / 3 / 7-day mastery state (stored locally alongside history)
export const TMUA_SRS_KEY = 'ratio_tmua_srs_v1';

export interface TmuaSrsEntry {
  stage: 0 | 1 | 2 | 3; // 0 = 1d, 1 = 3d, 2 = 7d, 3 = mastered
  dueAt: string; // ISO timestamp
  lastReviewedAt: string;
}

export type TmuaSrsMap = Record<string, TmuaSrsEntry>;

const SRS_INTERVAL_DAYS = [1, 3, 7] as const;

export function loadTmuaSrs(): TmuaSrsMap {
  try {
    const raw = window.localStorage.getItem(TMUA_SRS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as TmuaSrsMap) : {};
  } catch {
    return {};
  }
}

export function saveTmuaSrs(map: TmuaSrsMap): void {
  try {
    window.localStorage.setItem(TMUA_SRS_KEY, JSON.stringify(map));
  } catch {
    // ignore storage errors
  }
}

export function scheduleSrsMiss(map: TmuaSrsMap, qid: string, nowIso: string): TmuaSrsMap {
  const dueMs = Date.parse(nowIso) + SRS_INTERVAL_DAYS[0] * 86400_000;
  return {
    ...map,
    [qid]: {
      stage: 0,
      dueAt: new Date(dueMs).toISOString(),
      lastReviewedAt: nowIso,
    },
  };
}

export function advanceSrsCleanRetry(map: TmuaSrsMap, qid: string, nowIso: string): TmuaSrsMap {
  const prev = map[qid];
  const nextStage = Math.min(3, (prev?.stage ?? 0) + 1) as 0 | 1 | 2 | 3;
  const intervalDays =
    nextStage === 0 ? 1 : nextStage === 1 ? 3 : nextStage === 2 ? 7 : 0;
  const dueMs = Date.parse(nowIso) + intervalDays * 86400_000;
  return {
    ...map,
    [qid]: {
      stage: nextStage,
      dueAt: new Date(dueMs).toISOString(),
      lastReviewedAt: nowIso,
    },
  };
}

export function srsStageLabel(stage: 0 | 1 | 2 | 3): string {
  if (stage === 0) return '1-day review';
  if (stage === 1) return '3-day review';
  if (stage === 2) return '7-day review';
  return 'Mastered';
}

/* ── Confidence Calibration (Guess 30% / Unsure 60% / Sure 90%) ─────────── */
export const TMUA_CONF_KEY = 'ratio_tmua_conf_v1';

export type TmuaConfidenceLevel = 0.3 | 0.6 | 0.9;

export interface TmuaConfidenceRecord {
  qid: string;
  topic: string;
  paper: 1 | 2;
  conf: TmuaConfidenceLevel;
  correct: boolean;
  at: string;
}

export const TMUA_CONFIDENCE_BANDS: Array<{
  p: TmuaConfidenceLevel;
  label: string;
  pct: string;
}> = [
  { p: 0.3, label: 'Guess', pct: '30%' },
  { p: 0.6, label: 'Unsure', pct: '60%' },
  { p: 0.9, label: 'Sure', pct: '90%' },
];

export function loadTmuaConfidenceLog(): TmuaConfidenceRecord[] {
  try {
    const raw = window.localStorage.getItem(TMUA_CONF_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as TmuaConfidenceRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveTmuaConfidenceLog(log: TmuaConfidenceRecord[]): void {
  try {
    window.localStorage.setItem(TMUA_CONF_KEY, JSON.stringify(log.slice(-500)));
  } catch {
    // ignore storage errors
  }
}

export function computeConfidenceSummary(log: TmuaConfidenceRecord[]) {
  if (log.length === 0) {
    return {
      total: 0,
      brier: null as number | null,
      bands: TMUA_CONFIDENCE_BANDS.map((b) => ({ ...b, n: 0, right: 0, acc: null as number | null })),
      verdicts: [] as Array<{ topic: string; n: number; saidPct: number; accPct: number; status: 'over' | 'under' | 'calibrated' }>,
    };
  }
  let brierSum = 0;
  const byTopic = new Map<string, { n: number; said: number; right: number }>();
  for (const r of log) {
    const y = r.correct ? 1 : 0;
    brierSum += (r.conf - y) * (r.conf - y);
    const cur = byTopic.get(r.topic) ?? { n: 0, said: 0, right: 0 };
    cur.n += 1;
    cur.said += r.conf;
    cur.right += y;
    byTopic.set(r.topic, cur);
  }
  const bands = TMUA_CONFIDENCE_BANDS.map((b) => {
    const subset = log.filter((r) => Math.abs(r.conf - b.p) < 1e-6);
    const right = subset.filter((r) => r.correct).length;
    return {
      ...b,
      n: subset.length,
      right,
      acc: subset.length > 0 ? Math.round((right / subset.length) * 100) : null,
    };
  });
  const verdicts = Array.from(byTopic.entries())
    .filter(([, s]) => s.n >= 3)
    .map(([topic, s]) => {
      const said = s.said / s.n;
      const acc = s.right / s.n;
      const gap = said - acc;
      const status: 'over' | 'under' | 'calibrated' =
        gap >= 0.15 ? 'over' : gap <= -0.15 ? 'under' : 'calibrated';
      return {
        topic,
        n: s.n,
        saidPct: Math.round(said * 100),
        accPct: Math.round(acc * 100),
        status,
      };
    })
    .sort((a, b) => Math.abs(b.saidPct - b.accPct) - Math.abs(a.saidPct - a.accPct));
  return {
    total: log.length,
    brier: brierSum / log.length,
    bands,
    verdicts,
  };
}

/* ── Original TMUA High-Frequency Trap Taxonomy (Paper 1 & Paper 2) ─────── */
export interface TmuaTrapItem {
  id: string;
  paper: 1 | 2;
  name: string;
  check: string;
}

export const TMUA_TRAP_TAXONOMY: TmuaTrapItem[] = [
  { id: 'div-zero', paper: 1, name: 'Dividing by a factor that could be zero', check: 'Always test the cancelled factor = 0 as a separate root before reducing.' },
  { id: 'ineq-sign', paper: 1, name: 'Multiplying an inequality by an unknown sign', check: 'Multiply by the square of the denominator or split into positive/negative cases.' },
  { id: 'extraneous-square', paper: 1, name: 'Keeping extraneous roots after squaring', check: 'Substitute every candidate root back into the original unsquared equation.' },
  { id: 'log-domain', paper: 1, name: 'Ignoring log / square-root domain restrictions', check: 'Verify every argument is strictly positive (and base > 0, base ≠ 1).' },
  { id: 'signed-area', paper: 1, name: 'Treating a signed integral as geometric area', check: 'Find x-intercepts inside [a, b] and integrate above/below the axis separately.' },
  { id: 'endpoint-max', paper: 1, name: 'Checking stationary points without endpoints', check: 'Compare f(a) and f(b) against local turning points on every closed interval.' },
  { id: 'trig-interval', paper: 1, name: 'Dropping solutions across the full trig interval', check: 'Count solutions on the unit circle after scaling the angle (e.g. 2x or 3x).' },
  { id: 'transform-dir', paper: 1, name: 'Reversing graph translation / stretch direction', check: 'Test one known point (x, y) under f(ax + b) to confirm left/right shift.' },
  { id: 'tangency-root', paper: 1, name: 'Miscounting a repeated root at tangency', check: 'Distinguish number of distinct real roots from algebraic multiplicity.' },
  { id: 'series-count', paper: 1, name: 'Off-by-one term count in sequences & sums', check: 'Check n = 1 and n = 2 directly; terms from r = a to b total b − a + 1.' },
  { id: 'nec-vs-suff', paper: 2, name: 'Swapping necessary and sufficient', check: 'Test P ⇒ Q (P sufficient for Q) and Q ⇒ P (P necessary for Q) independently.' },
  { id: 'converse-contra', paper: 2, name: 'Confusing converse with contrapositive', check: 'P ⇒ Q is equivalent to ¬Q ⇒ ¬P, never to Q ⇒ P or ¬P ⇒ ¬Q.' },
  { id: 'imp-negation', paper: 2, name: 'Negating "if P then Q" as another implication', check: '¬(P ⇒ Q) is "P and not Q" — a single witness where P holds and Q fails.' },
  { id: 'quant-order', paper: 2, name: 'Flipping ∀ and ∃ quantifier order', check: 'Check whether the second variable may depend on the first (∀x ∃y) or must be fixed (∃y ∀x).' },
  { id: 'quant-neg', paper: 2, name: 'Forgetting to swap ∀ ↔ ∃ when negating', check: 'Negate from the outside in: ¬(∀x P(x)) ≡ ∃x ¬P(x).' },
  { id: 'backward-proof', paper: 2, name: 'Treating one-way backward algebra as a proof', check: 'Starting from the conclusion proves nothing unless every line is reversible (⇔).' },
  { id: 'vacuous-witness', paper: 2, name: 'Testing a case where the premise is false', check: 'A value that falsifies the premise P cannot refute P ⇒ Q.' },
  { id: 'generalise-small', paper: 2, name: 'Generalising from two or three small cases', check: 'Look for boundary integers, 0, negatives, fractions in (0, 1), or non-coprime factors.' },
];

/* ── Kevinvariant Direct Free TMUA Mock Sets A–D & Tools (Outbound Only) ── */
export interface KevinvariantMockSetLink {
  set: string;
  difficulty: string;
  note: string;
  links: Array<{ label: string; url: string }>;
}

export const KEVINVARIANT_FREE_MOCK_SETS: KevinvariantMockSetLink[] = [
  {
    set: 'Set A (Free · Entry)',
    difficulty: 'Unrated · Gentlest entry',
    note: 'Questions and full worked solutions combined in one PDF per paper.',
    links: [
      { label: 'Paper 1 + Solutions', url: 'https://kevinvariant08.github.io/hu_mock_a_p1_with_solutions.pdf' },
      { label: 'Paper 2 + Solutions', url: 'https://kevinvariant08.github.io/hu_mock_a_p2_with_solutions.pdf' },
    ],
  },
  {
    set: 'Set D (Free · Core)',
    difficulty: 'Paper 1: 6.3 · Paper 2: 6.2',
    note: 'Gentlest rated free set — recommended straight after Set A.',
    links: [
      { label: 'P1 Paper', url: 'https://kevinvariant08.github.io/HU_Collection_TMUA_SetD_Paper1.pdf' },
      { label: 'P1 Solutions', url: 'https://kevinvariant08.github.io/HU_Collection_TMUA_SetD_Paper1_Solutions.pdf' },
      { label: 'P2 Paper', url: 'https://kevinvariant08.github.io/HU_Collection_TMUA_SetD_Paper2.pdf' },
      { label: 'P2 Solutions', url: 'https://kevinvariant08.github.io/HU_Collection_TMUA_SetD_Paper2_Solutions.pdf' },
    ],
  },
  {
    set: 'Set C (Free · Stretch)',
    difficulty: 'Paper 1: 7.1 · Paper 2: 6.9',
    note: 'Pitched above the 2025 TMUA.',
    links: [
      { label: 'P1 Paper', url: 'https://kevinvariant08.github.io/HU_Collection_TMUA_SetC_Paper1.pdf' },
      { label: 'P1 Solutions', url: 'https://kevinvariant08.github.io/HU_Collection_TMUA_SetC_Paper1_Solutions.pdf' },
      { label: 'P2 Paper', url: 'https://kevinvariant08.github.io/HU_Collection_TMUA_SetC_Paper2.pdf' },
      { label: 'P2 Solutions', url: 'https://kevinvariant08.github.io/HU_Collection_TMUA_SetC_Paper2_Solutions.pdf' },
    ],
  },
  {
    set: 'Set B (Free · Challenge)',
    difficulty: 'Paper 1: 7.3 · Paper 2: 7.5',
    note: 'No routine questions in either paper.',
    links: [
      { label: 'P1 Paper', url: 'https://kevinvariant08.github.io/HU_Collection_TMUA_SetB_Paper1.pdf' },
      { label: 'P1 Solutions', url: 'https://kevinvariant08.github.io/HU_Collection_TMUA_SetB_Paper1_Solutions.pdf' },
      { label: 'P2 Paper', url: 'https://kevinvariant08.github.io/HU_Collection_TMUA_SetB_Paper2.pdf' },
      { label: 'P2 Solutions', url: 'https://kevinvariant08.github.io/HU_Collection_TMUA_SetB_Paper2_Solutions.pdf' },
    ],
  },
  {
    set: 'Sets E–H & Interactive Tools (Free on Site)',
    difficulty: '6.1 to 8.0 · IRT Smart Practice',
    note: 'Free Sets E–H, IRT adaptive Smart Practice, Timed Drill, and Binomial Coefficients handout.',
    links: [
      { label: 'Sets E–H Hub', url: 'https://kevinvariant08.github.io/tmua.html#sets' },
      { label: 'Smart Practice (IRT)', url: 'https://kevinvariant08.github.io/smart.html' },
      { label: 'Timed Drill', url: 'https://kevinvariant08.github.io/drill.html' },
      { label: 'Binomial Coeffs PDF', url: 'https://kevinvariant08.github.io/HU_Collection_Binomial_Coefficients.pdf' },
    ],
  },
];
