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

export interface TmuaSpecTopicNote {
  id: string;
  spec: string;
  paper: 'Paper 1 & 2' | 'Paper 2';
  title: string;
  coreFormulas: string[];
  keyMethods: string[];
  watchOut: string;
}

export const TMUA_SPEC_TOPIC_NOTES: TmuaSpecTopicNote[] = [
  {
    id: 'spec-mm1',
    spec: 'MM1',
    paper: 'Paper 1 & 2',
    title: 'Algebra, Quadratics, Polynomials & Inequalities',
    coreFormulas: [
      'Quadratic discriminant Δ = b² − 4ac; Vieta: α + β = −b/a, αβ = c/a',
      'Factor Theorem: (x − a) divides P(x) ⇔ P(a) = 0; Remainder Theorem: P(a) is remainder on ÷ (x − a)',
      'Difference of squares & cubes: a³ ± b³ = (a ± b)(a² ∓ ab + b²)',
    ],
    keyMethods: [
      'Use sign charts after factoring rather than multiplying by expressions of unknown sign.',
      'Rewrite symmetric root expressions (α² + β², α³ + β³) directly via α + β and αβ.',
    ],
    watchOut: 'Never cancel a variable factor without recording the case where that factor equals zero.',
  },
  {
    id: 'spec-mm2',
    spec: 'MM2',
    paper: 'Paper 1 & 2',
    title: 'Sequences, Series & Binomial Expansion',
    coreFormulas: [
      'AP: uₙ = a + (n − 1)d, Sₙ = (n/2)(2a + (n − 1)d)',
      'GP: uₙ = arⁿ⁻¹, Sₙ = a(1 − rⁿ)/(1 − r), S∞ = a/(1 − r) for |r| < 1',
      '(a + b)ⁿ = Σ C(n, k) aⁿ⁻ᵏ bᵏ; adjacent ratio C(n, k+1)/C(n, k) = (n − k)/(k + 1)',
    ],
    keyMethods: [
      'Compute the first 4–6 terms of any recurrence immediately to spot periodicity or invariants.',
      'Split interleaved odd/even subsequences into separate AP/GP blocks before summing.',
    ],
    watchOut: 'Always verify |r| < 1 (strictly, including r ≠ −1) before applying S∞, and check term count b − a + 1.',
  },
  {
    id: 'spec-mm3',
    spec: 'MM3',
    paper: 'Paper 1 & 2',
    title: 'Coordinate Geometry & Circles',
    coreFormulas: [
      'Circle (x − a)² + (y − b)² = r²; perpendicular gradients m₁m₂ = −1',
      'Distance from (x₀, y₀) to Ax + By + C = 0 is |Ax₀ + By₀ + C| / √(A² + B²)',
      'Chord half-length = √(r² − d²) where d is centre-to-line distance',
    ],
    keyMethods: [
      'Complete the square immediately to read off centre and radius before drawing a quick sketch.',
      'Use Vieta root gap |α − β| = √((α + β)² − 4αβ) for secant intersection distances.',
    ],
    watchOut: 'Check whether a line actually intersects the circle (d ≤ r) before counting chords or tangents.',
  },
  {
    id: 'spec-mm4',
    spec: 'MM4',
    paper: 'Paper 1 & 2',
    title: 'Trigonometry & Exact Values',
    coreFormulas: [
      'sin²θ + cos²θ = 1; tan θ = sin θ / cos θ; 1 + tan²θ = sec²θ',
      'Exact values at 0, π/6, π/4, π/3, π/2; Cosine rule c² = a² + b² − 2ab cos C',
      'Sector arc length = rθ, sector area = ½r²θ (θ in radians)',
    ],
    keyMethods: [
      'Convert mixed sin/cos equations into a single quadratic via sin²θ = 1 − cos²θ.',
      'Sketch the unit circle or wave on the exact scaled interval to count every solution.',
    ],
    watchOut: 'Include or exclude interval endpoints (0, 2π) strictly as stated, and check extraneous roots if you squared.',
  },
  {
    id: 'spec-mm5',
    spec: 'MM5',
    paper: 'Paper 1 & 2',
    title: 'Exponentials & Logarithms',
    coreFormulas: [
      'logₐ(xy) = logₐx + logₐy; logₐ(xᵏ) = k logₐx; change of base logₐb = log_c(b) / log_c(a)',
      'a^(logₐx) = x for x > 0; logₐ(b) · log_b(a) = 1',
      'Domain: argument > 0, base > 0, base ≠ 1',
    ],
    keyMethods: [
      'Substitute u = aˣ (u > 0) to turn exponential equations into quadratics in u.',
      'Compare large powers without a calculator by taking logs or matching common prime bases.',
    ],
    watchOut: 'Filter out negative or zero roots that violate log domain, and flip inequalities when base 0 < a < 1.',
  },
  {
    id: 'spec-mm67',
    spec: 'MM6–MM7',
    paper: 'Paper 1 & 2',
    title: 'Differentiation, Integration & Area',
    coreFormulas: [
      'd/dx(xⁿ) = nxⁿ⁻¹; ∫xⁿ dx = xⁿ⁺¹/(n + 1) + C (n ≠ −1)',
      'Stationary points at f′(x) = 0; local max f″ < 0, local min f″ > 0',
      '∫_a^b f(x) dx = F(b) − F(a); ∫_a^b f(x + c) dx = ∫_{a+c}^{b+c} f(u) du',
    ],
    keyMethods: [
      'Use symmetry (odd integrals vanish on [−a, a], even integrals double [0, a]) before expanding.',
      'For area between curves or under an axis, find all intersection roots inside [a, b] first.',
    ],
    watchOut: 'Never equate a signed definite integral to geometric area when f(x) changes sign on the interval.',
  },
  {
    id: 'spec-mm8',
    spec: 'MM8',
    paper: 'Paper 1 & 2',
    title: 'Graphs, Transformations & Data',
    coreFormulas: [
      'y = f(x + a): left by a; y = f(ax): horizontal scale 1/a; y = af(x): vertical scale a',
      'Cubic root count: compare product f(x_max)·f(x_min) against 0',
      'Linear data transform Y = aX + b: mean → aμ + b, SD → |a|σ',
    ],
    keyMethods: [
      'Count real roots of f(x) = g(x) by sketching both curves and tracking turning points & asymptotes.',
      'Check a single test point (x₀, y₀) to confirm the direction of combined transformations.',
    ],
    watchOut: 'Order matters when combining horizontal shifts and stretches: f(2x + 4) = f(2(x + 2)).',
  },
  {
    id: 'spec-arg',
    spec: 'Arg1–Arg4',
    paper: 'Paper 2',
    title: 'Mathematical Logic, Conditions & Quantifiers',
    coreFormulas: [
      'P ⇒ Q ≡ ¬Q ⇒ ¬P (contrapositive); NOT equivalent to Q ⇒ P (converse)',
      '¬(P ⇒ Q) ≡ P ∧ ¬Q; De Morgan: ¬(P ∧ Q) ≡ ¬P ∨ ¬Q',
      '¬(∀x, P(x)) ≡ ∃x, ¬P(x); ¬(∃x, P(x)) ≡ ∀x, ¬P(x)',
    ],
    keyMethods: [
      'Test P ⇒ Q ("P is sufficient for Q") and Q ⇒ P ("P is necessary for Q") as two separate checks.',
      'Read "P only if Q" strictly as P ⇒ Q, and "P if Q" as Q ⇒ P.',
    ],
    watchOut: 'Quantifier order is not symmetric: ∀x ∃y lets y depend on x; ∃y ∀x requires one fixed y for all x.',
  },
  {
    id: 'spec-prf',
    spec: 'Prf1–5 · Err1–2',
    paper: 'Paper 2',
    title: 'Proof Strategies, Counterexamples & Error Spotting',
    coreFormulas: [
      'Disproving ∀x (P(x) ⇒ Q(x)) requires ONE witness with P(x) TRUE and Q(x) FALSE',
      'Exhaustive cases: partition by parity (2k, 2k+1) or small moduli (mod 3, mod 4)',
      'Valid backward derivation requires every line to be bidirectional (⇔)',
    ],
    keyMethods: [
      'When hunting counterexamples, test 0, 1, −1, fractions in (0, 1), negatives, and boundary integers first.',
      'In proof-error questions, check every line for hidden division by zero, squaring, or sign assumptions.',
    ],
    watchOut: 'An example where the premise P is false is vacuous and never refutes P ⇒ Q.',
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


