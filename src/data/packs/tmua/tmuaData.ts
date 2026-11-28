import { TMUA_PACK_MOCKS } from '../tmua-practice';

export interface TmuaQuestion {
  id: string;
  topic: string;
  stem: string;
  options: string[];
  answer: number; // 0-based index
  explanation: string;
}

export interface TmuaPaper {
  id: string;
  paperNumber: 1 | 2;
  title: string;
  minutes: number;
  questions: TmuaQuestion[];
}

export interface TmuaMock {
  id: string;
  title: string;
  papers: [TmuaPaper, TmuaPaper];
}

export interface TmuaFlashcard {
  id: string;
  paper: 'Paper 1' | 'Paper 2';
  front: string;
  back: string;
}

export const TMUA_MOCKS: TmuaMock[] = [
  {
    id: 'tmua-mock-1',
    title: 'TMUA Mock 1',
    papers: [
      {
        id: 'tmua-m1-p1',
        paperNumber: 1,
        title: 'Paper 1 · Applications of Mathematical Knowledge',
        minutes: 75,
        questions: [
          {
            id: 'tmua-m1-p1-q01',
            topic: 'Algebra & Quadratics',
            stem: 'For what range of real values of k does the quadratic equation x² + (k − 2)x + k + 1 = 0 have two distinct real roots?',
            options: [
              'k < 0 or k > 8',
              '0 < k < 8',
              'k < −2 or k > 6',
              'k < 0 or k > 4',
              '−2 < k < 6',
            ],
            answer: 0,
            explanation:
              'Discriminant Δ = (k − 2)² − 4(k + 1) = k² − 4k + 4 − 4k − 4 = k² − 8k = k(k − 8) > 0, which holds when k < 0 or k > 8.',
          },
          {
            id: 'tmua-m1-p1-q02',
            topic: 'Indices & Logarithms',
            stem: 'Solve for real x: log₂(x − 1) + log₂(x + 3) = 5.',
            options: ['x = 5 only', 'x = 5 or x = −7', 'x = 7 only', 'x = 3 only', 'x = 4 only'],
            answer: 0,
            explanation:
              'Combine logs: log₂((x − 1)(x + 3)) = 5 ⇒ x² + 2x − 3 = 32 ⇒ x² + 2x − 35 = 0 ⇒ (x + 7)(x − 5) = 0. Domain requires x > 1, so x = 5 only.',
          },
          {
            id: 'tmua-m1-p1-q03',
            topic: 'Sequences & Series',
            stem: 'The first term of a geometric progression is 12 and its sum to infinity is 18. What is the sum of the first three terms?',
            options: ['52/3', '16', '46/3', '50/3', '56/3'],
            answer: 0,
            explanation:
              'S∞ = a/(1 − r) ⇒ 12/(1 − r) = 18 ⇒ 1 − r = 2/3 ⇒ r = 1/3. First three terms: 12 + 4 + 4/3 = 52/3.',
          },
          {
            id: 'tmua-m1-p1-q04',
            topic: 'Differentiation',
            stem: 'The curve y = x³ − 3px² + 12x + 5 has a single stationary point (a point of inflection with zero gradient). Given p > 0, find p.',
            options: ['1', '2', '√2', '4', '3'],
            answer: 1,
            explanation:
              'dy/dx = 3x² − 6px + 12 = 3(x² − 2px + 4). A single stationary point means Δ = 0 ⇒ (−2p)² − 16 = 0 ⇒ 4p² = 16 ⇒ p = 2 (since p > 0).',
          },
          {
            id: 'tmua-m1-p1-q05',
            topic: 'Integration',
            stem: 'Evaluate ∫₁⁴ (3√x − 2/√x) dx.',
            options: ['10', '12', '14', '16', '8'],
            answer: 0,
            explanation:
              'Antiderivative is 2x^(3/2) − 4x^(1/2). At x = 4: 2(8) − 4(2) = 8. At x = 1: 2 − 4 = −2. Difference: 8 − (−2) = 10.',
          },
          {
            id: 'tmua-m1-p1-q06',
            topic: 'Coordinate Geometry',
            stem: 'A circle has equation x² + y² − 6x + 8y = 0. What is the length of the chord cut off by the y-axis?',
            options: ['6', '8', '10', '4', '12'],
            answer: 1,
            explanation:
              'On the y-axis, x = 0 ⇒ y² + 8y = 0 ⇒ y = 0 or y = −8. The distance between (0, 0) and (0, −8) is 8.',
          },
          {
            id: 'tmua-m1-p1-q07-v2',
            topic: 'Trigonometry',
            stem: 'An acute angle θ satisfies sin θ + cos θ = 7/5. What is sin⁴θ + cos⁴θ?',
            options: ['49/625', '288/625', '313/625', '337/625', '361/625'],
            answer: 3,
            explanation:
              'Squaring the given sum and using sin²θ + cos²θ = 1 gives sin θ cos θ = 12/25. Therefore sin⁴θ + cos⁴θ = 1 − 2(12/25)² = 337/625.',
          },
          {
            id: 'tmua-m1-p1-q08',
            topic: 'Polynomials',
            stem: 'When the polynomial P(x) = x³ + ax² + bx + 6 is divided by (x − 1) the remainder is 12, and when divided by (x + 2) the remainder is −6. Find a + b.',
            options: ['5', '6', '7', '4', '3'],
            answer: 0,
            explanation:
              'By the Remainder Theorem, P(1) = 1 + a + b + 6 = 12 ⇒ a + b = 5. (We do not even need the second condition to find a + b!)',
          },
          {
            id: 'tmua-m1-p1-q09',
            topic: 'Binomial Expansion',
            stem: 'In the expansion of (2 + kx)⁵, the coefficient of x² is equal to the coefficient of x³. Given k ≠ 0, find k.',
            options: ['1', '2', '1/2', '3/2', '4/3'],
            answer: 1,
            explanation:
              'Coeff of x² is C(5,2)·2³·k² = 80k². Coeff of x³ is C(5,3)·2²·k³ = 40k³. Setting 80k² = 40k³ with k ≠ 0 gives k = 2.',
          },
          {
            id: 'tmua-m1-p1-q10',
            topic: 'Surds & Indices',
            stem: 'If 9^x − 4·3^(x+1) + 27 = 0, what is the sum of all real solutions for x?',
            options: ['2', '3', '4', '1', '5'],
            answer: 1,
            explanation:
              'Let u = 3^x > 0. Then u² − 12u + 27 = 0 ⇒ (u − 3)(u − 9) = 0 ⇒ u = 3 or u = 9 ⇒ x = 1 or x = 2. Sum = 3.',
          },
          {
            id: 'tmua-m1-p1-q11',
            topic: 'Graph Transformations',
            stem: 'The curve y = f(x) has a local minimum at (3, −4). Where is the local maximum of y = 2 − 3f(x + 1)?',
            options: ['(2, 14)', '(4, 14)', '(2, −10)', '(4, −10)', '(2, 10)'],
            answer: 0,
            explanation:
              'f(x + 1) shifts left by 1: x = 3 − 1 = 2. Multiplying by −3 flips minimum to maximum and maps −4 to 12; adding 2 gives y = 14. Point: (2, 14).',
          },
          {
            id: 'tmua-m1-p1-q12',
            topic: 'Differentiation',
            stem: 'Find the equation of the tangent to the curve y = x² − 4x + 7 that is parallel to the line y = 2x − 5.',
            options: ['y = 2x − 2', 'y = 2x + 2', 'y = 2x − 4', 'y = 2x − 1', 'y = 2x + 1'],
            answer: 0,
            explanation:
              'dy/dx = 2x − 4 = 2 ⇒ x = 3. At x = 3, y = 9 − 12 + 7 = 4. Tangent: y − 4 = 2(x − 3) ⇒ y = 2x − 2.',
          },
          {
            id: 'tmua-m1-p1-q13',
            topic: 'Sequences & Series',
            stem: 'An arithmetic progression has 5th term 17 and 12th term 45. What is the sum of the first 10 terms?',
            options: ['190', '185', '200', '175', '210'],
            answer: 0,
            explanation:
              '7d = 45 − 17 = 28 ⇒ d = 4. a = 17 − 4(4) = 1. S₁₀ = (10/2)(2·1 + 9·4) = 5 × 38 = 190.',
          },
          {
            id: 'tmua-m1-p1-q14',
            topic: 'Integration & Area',
            stem: 'What is the finite area enclosed between the curve y = 4x − x² and the line y = x?',
            options: ['9/2', '9', '27/4', '9/4', '3'],
            answer: 0,
            explanation:
              'Intersections: 4x − x² = x ⇒ x² − 3x = 0 ⇒ x = 0, 3. Area = ∫₀³ (3x − x²) dx = [3x²/2 − x³/3]₀³ = 27/2 − 9 = 9/2.',
          },
          {
            id: 'tmua-m1-p1-q15',
            topic: 'Trigonometry',
            stem: 'In triangle ABC, AB = 6, AC = 8, and cos A = 1/4. What is the length of BC?',
            options: ['2√19', '2√21', '8', '2√17', '√70'],
            answer: 0,
            explanation:
              'By the Cosine Rule: BC² = 6² + 8² − 2(6)(8)(1/4) = 36 + 64 − 24 = 76 ⇒ BC = √76 = 2√19.',
          },
          {
            id: 'tmua-m1-p1-q16',
            topic: 'Logarithms',
            stem: 'Given that log_a(b) = 3 and log_b(c) = 2 (with a, b, c > 0, a, b ≠ 1), what is the value of log_c(a)?',
            options: ['1/6', '6', '1/5', '2/3', '3/2'],
            answer: 0,
            explanation:
              'b = a³ and c = b² = a⁶, so a = c^(1/6), meaning log_c(a) = 1/6.',
          },
          {
            id: 'tmua-m1-p1-q17',
            topic: 'Coordinate Geometry',
            stem: 'The points A(1, 2), B(5, 4), and C(3, k) form a triangle with a right angle at B. Find k.',
            options: ['8', '6', '0', '−2', '10'],
            answer: 0,
            explanation:
              'Gradient of AB is (4 − 2)/(5 − 1) = 1/2. Perpendicular gradient for BC is −2: (k − 4)/(3 − 5) = −2 ⇒ k − 4 = 4 ⇒ k = 8.',
          },
          {
            id: 'tmua-m1-p1-q18',
            topic: 'Inequalities',
            stem: 'For how many integer values of n does the inequality n² − 7n + 10 < 0 hold?',
            options: ['2', '3', '4', '1', '5'],
            answer: 0,
            explanation:
              '(n − 2)(n − 5) < 0 ⇒ 2 < n < 5. The integer solutions are n = 3 and n = 4 (2 integers).',
          },
          {
            id: 'tmua-m1-p1-q19',
            topic: 'Integration',
            stem: 'Given ∫₀² f(x) dx = 5, what is the value of ∫₀² (3f(x) + 4) dx?',
            options: ['23', '19', '27', '15', '21'],
            answer: 0,
            explanation:
              '∫₀² 3f(x) dx + ∫₀² 4 dx = 3(5) + 4(2) = 15 + 8 = 23.',
          },
          {
            id: 'tmua-m1-p1-q20',
            topic: 'Functions & Extrema',
            stem: 'What is the minimum value of f(x) = 2x² − 12x + 25 for real x?',
            options: ['7', '5', '9', '13', '3'],
            answer: 0,
            explanation:
              'Complete the square: f(x) = 2(x − 3)² + 25 − 18 = 2(x − 3)² + 7. Minimum value is 7 at x = 3.',
          },
        ],
      },
      {
        id: 'tmua-m1-p2',
        paperNumber: 2,
        title: 'Paper 2 · Mathematical Reasoning',
        minutes: 75,
        questions: [
          {
            id: 'tmua-m1-p2-q01',
            topic: 'Necessary & Sufficient',
            stem: 'Let n be an integer. Consider the statement: "n² is divisible by 4" (P) and "n is even" (Q). Which best describes the relationship between P and Q?',
            options: [
              'P is both necessary and sufficient for Q',
              'P is sufficient for Q, but not necessary',
              'P is necessary for Q, but not sufficient',
              'P is neither necessary nor sufficient for Q',
              'P implies not-Q',
            ],
            answer: 0,
            explanation:
              'If n is even (n = 2k), then n² = 4k² is divisible by 4 (Q ⇒ P). Conversely, if n were odd, n² would be odd and not divisible by 4, so P ⇒ Q. Hence P ⇔ Q.',
          },
          {
            id: 'tmua-m1-p2-q02',
            topic: 'Contrapositive',
            stem: 'Which of the following is logically equivalent to the statement: "If a function f is differentiable at x = 0, then f is continuous at x = 0"?',
            options: [
              'If f is not continuous at x = 0, then f is not differentiable at x = 0.',
              'If f is continuous at x = 0, then f is differentiable at x = 0.',
              'If f is not differentiable at x = 0, then f is not continuous at x = 0.',
              'f is differentiable at x = 0 if and only if f is continuous at x = 0.',
              'f is continuous at x = 0 only when f is not differentiable at x = 0.',
            ],
            answer: 0,
            explanation:
              'An implication A ⇒ B is always logically equivalent to its contrapositive (¬B ⇒ ¬A), and not to its converse or inverse.',
          },
          {
            id: 'tmua-m1-p2-q03-v2',
            topic: 'Counterexamples',
            stem: 'A student claims that if 2n + 1 is prime, then 6n + 1 is prime, for every positive integer n. What is the smallest n that refutes the claim?',
            options: ['3', '4', '5', '7', '8'],
            answer: 4,
            explanation:
              'For n = 1, 2, 3, 5, 6 and 7, the outputs 6n + 1 are prime. At n = 4 the output is 25, but the premise fails because 2n + 1 = 9. At n = 8 the premise holds (17 is prime) and the conclusion fails (49 is composite).',
          },
          {
            id: 'tmua-m1-p2-q04',
            topic: 'Quantifiers & Negation',
            stem: 'What is the logical negation of: "For every real number x, there exists a real number y such that x + y > 0"?',
            options: [
              'There exists a real number x such that for every real number y, x + y ≤ 0.',
              'For every real number x, for every real number y, x + y ≤ 0.',
              'There exists a real number x and a real number y such that x + y ≤ 0.',
              'For every real number x, there exists a real number y such that x + y ≤ 0.',
              'There exists a real number y such that for every real number x, x + y < 0.',
            ],
            answer: 0,
            explanation:
              'Negating ∀x ∃y (x + y > 0) flips each quantifier in order and negates the predicate: ∃x ∀y (x + y ≤ 0).',
          },
          {
            id: 'tmua-m1-p2-q05-v2',
            topic: 'Spotting Proof Errors',
            stem: 'A student attempts to prove that 3 divides ab only if 3 divides both a and b, where a and b are integers.\n1. Assume 3 divides ab.\n2. If 3 does not divide a, then a has remainder 1 or 2 modulo 3.\n3. In either case, the only remainder of b giving ab remainder 0 is 0.\n4. This contradicts the assumption that 3 does not divide a.\n5. Therefore 3 must divide a, and by symmetry it must divide b.\nWhich is the first invalid step?',
            options: [
              'Step 1',
              'Step 2',
              'Step 3',
              'Step 4',
              'Step 5',
            ],
            answer: 3,
            explanation:
              'Step 3 correctly shows that 3 divides b under the assumption that 3 does not divide a. There is no contradiction: a = 1 and b = 3 satisfy both facts. The error is the claim of a contradiction at step 4.',
          },
          {
            id: 'tmua-m1-p2-q06',
            topic: 'Necessary & Sufficient',
            stem: 'Let x and y be real numbers. Condition A is "x > 2 and y > 2". Condition B is "x + y > 4". Which statement is true?',
            options: [
              'A is sufficient for B, but not necessary',
              'A is necessary for B, but not sufficient',
              'A is both necessary and sufficient for B',
              'A is neither necessary nor sufficient for B',
              'B implies A',
            ],
            answer: 0,
            explanation:
              'If x > 2 and y > 2 then x + y > 4 (A ⇒ B). However x = 10, y = 0 satisfies B without A, so B does not imply A.',
          },
          {
            id: 'tmua-m1-p2-q07',
            topic: 'Parity & Number Theory',
            stem: 'Let m and n be integers such that 3m + 5n is even. Which of the following MUST be true?',
            options: [
              'm + n is even',
              'm is even',
              'n is even',
              'mn is even',
              'm − n is odd',
            ],
            answer: 0,
            explanation:
              '3m + 5n ≡ m + n (mod 2). So 3m + 5n is even if and only if m + n is even (both odd or both even).',
          },
          {
            id: 'tmua-m1-p2-q08',
            topic: 'Inequalities & Logic',
            stem: 'For real numbers a and b, which of the following is a counterexample to the claim "if a < b then a² < b²"?',
            options: [
              'a = −3, b = 2',
              'a = 2, b = 3',
              'a = 0, b = 1',
              'a = 1, b = −2',
              'a = −1, b = 2',
            ],
            answer: 0,
            explanation:
              'A counterexample must satisfy the hypothesis (a < b) and violate the conclusion (a² ≥ b²). For a = −3, b = 2: −3 < 2 holds, yet (−3)² = 9 ≥ 4 = 2².',
          },
          {
            id: 'tmua-m1-p2-q09-v2',
            topic: 'Truth & Deduction',
            stem: 'Two rules are given for a real-valued function f. Rule A: If x > 0 then f(x) > x. Rule B: If x < 1 then f(x) < 2x. What can be concluded about these rules?',
            options: [
              'Both rules can hold; take f(x) = x.',
              'Both rules can hold; take f(x) = 2x.',
              'Both rules can hold; take f(x) = 3x/2.',
              'The rules conflict at x = 0.',
              'Both rules can hold, but no linear function of the form f(x) = kx works.',
            ],
            answer: 4,
            explanation:
              'Rule A requires k > 1. For Rule B, negative x requires k > 2 whereas x = 0 makes the rule demand f(0) < 0. Thus no f(x) = kx works. The rules are compatible: take f(x) = 2x − 1 for x ≤ 0 and f(x) = 3x/2 for x > 0.',
          },
          {
            id: 'tmua-m1-p2-q10',
            topic: 'Proof by Exhaustion',
            stem: 'For any integer n, what are all possible remainders when n² is divided by 4?',
            options: ['0 or 1 only', '0, 1, or 2', '0, 1, or 3', '1 or 3 only', '0 or 2 only'],
            answer: 0,
            explanation:
              'If n = 2k, n² = 4k² ≡ 0 (mod 4). If n = 2k + 1, n² = 4k(k + 1) + 1 ≡ 1 (mod 4). Thus remainders are 0 or 1 only.',
          },
          {
            id: 'tmua-m1-p2-q11',
            topic: 'Necessary & Sufficient',
            stem: 'Let f(x) be a polynomial. Which condition is sufficient, but NOT necessary, for f(x) = 0 to have at least one real root in the interval (0, 1)?',
            options: [
              'f(0)·f(1) < 0',
              'f(0) + f(1) = 0',
              'f(0) > 0 and f(1) > 0',
              'f′(x) = 0 for some x in (0, 1)',
              'f(0)·f(1) ≤ 0',
            ],
            answer: 0,
            explanation:
              'By the Intermediate Value Theorem, f(0)·f(1) < 0 guarantees a root in (0, 1), but a quadratic like (x − 0.5)² has a root in (0, 1) with f(0)·f(1) > 0.',
          },
          {
            id: 'tmua-m1-p2-q12',
            topic: 'Logical Equivalence',
            stem: 'Which of the following is logically equivalent to "not (P or Q)"?',
            options: [
              '(not P) and (not Q)',
              '(not P) or (not Q)',
              'P implies (not Q)',
              '(not P) implies Q',
              'P and (not Q)',
            ],
            answer: 0,
            explanation: "By De Morgan's Law, ¬(P ∨ Q) ≡ (¬P) ∧ (¬Q).",
          },
          {
            id: 'tmua-m1-p2-q13',
            topic: 'Divisibility',
            stem: 'For every positive integer n, the expression n³ − n is ALWAYS divisible by which largest integer?',
            options: ['6', '2', '3', '12', '4'],
            answer: 0,
            explanation:
              'n³ − n = (n − 1)n(n + 1), the product of three consecutive integers, so it is always divisible by 2 and 3 ⇒ 6. At n = 2, 2³ − 2 = 6, so no integer larger than 6 divides all values.',
          },
          {
            id: 'tmua-m1-p2-q14',
            topic: 'Spotting Proof Errors',
            stem: 'A student writes: "To prove √x = x − 2 has solution x = 1: square both sides to get x = x² − 4x + 4, so x² − 5x + 4 = 0, giving x = 1 or x = 4." What is wrong with concluding x = 1 is a solution?',
            options: [
              'Squaring is a one-way implication (⇒), not an equivalence (⇔), and can introduce extraneous roots.',
              'The quadratic x² − 5x + 4 = 0 was factored incorrectly.',
              '√1 is undefined.',
              'Both x = 1 and x = 4 are invalid.',
              'You cannot square an equation containing a variable.',
            ],
            answer: 0,
            explanation:
              'A = B ⇒ A² = B², not the converse. Plugging x = 1 back gives √1 = 1 ≠ −1 = 1 − 2, so x = 1 is extraneous; only x = 4 works.',
          },
          {
            id: 'tmua-m1-p2-q15',
            topic: 'Quantifiers',
            stem: 'Which statement about real numbers is TRUE?',
            options: [
              '∀x ∈ ℝ, ∃y ∈ ℝ such that y > x',
              '∃y ∈ ℝ such that ∀x ∈ ℝ, y > x',
              '∀x ∈ ℝ, x² > x',
              '∃x ∈ ℝ such that x² + 1 = 0',
              '∀x ∈ ℝ, ∀y ∈ ℝ, (x + y)² = x² + y²',
            ],
            answer: 0,
            explanation:
              'For any real x, choosing y = x + 1 gives y > x. Note how reversing the quantifiers (∃y ∀x, y > x) claims a largest real number exists, which is false.',
          },
          {
            id: 'tmua-m1-p2-q16',
            topic: 'Proof by Contradiction',
            stem: 'To prove by contradiction that "if n² is even, then n is even", what assumption do you start with?',
            options: [
              'n² is even and n is odd',
              'n² is odd and n is even',
              'n² is odd and n is odd',
              'n² is even and n is even',
              'n is not an integer',
            ],
            answer: 0,
            explanation:
              'The negation of (P ⇒ Q) is (P ∧ ¬Q): assume n² is even AND n is odd, then derive a contradiction (an odd number squared is odd).',
          },
          {
            id: 'tmua-m1-p2-q17',
            topic: 'Geometry & Logic',
            stem: 'Consider a quadrilateral Q. Statement S1: "Q is a square." Statement S2: "All four sides of Q are equal." Statement S3: "All four angles of Q are 90°." Which is true?',
            options: [
              'S2 and S3 together are necessary and sufficient for S1',
              'S2 alone is sufficient for S1',
              'S3 alone is sufficient for S1',
              'S2 is not necessary for S1',
              'S1 does not imply S3',
            ],
            answer: 0,
            explanation:
              'A rhombus satisfies S2 without S1; a non-square rectangle satisfies S3 without S1. Together, equal sides and four right angles define a square.',
          },
          {
            id: 'tmua-m1-p2-q18',
            topic: 'Inequalities',
            stem: 'If x > 0, what is the minimum possible value of x + 9/x?',
            options: ['6', '9', '3', '10', '4.5'],
            answer: 0,
            explanation:
              'By AM–GM (or writing (√x − 3/√x)² ≥ 0 ⇒ x − 6 + 9/x ≥ 0), x + 9/x ≥ 6 with equality at x = 3.',
          },
          {
            id: 'tmua-m1-p2-q19',
            topic: 'Sets & Venn Logic',
            stem: 'In a class of 30 students, 18 study Physics and 20 study Further Maths. What is the minimum number of students who study BOTH?',
            options: ['8', '10', '12', '2', '0'],
            answer: 0,
            explanation:
              '|P ∩ F| = |P| + |F| − |P ∪ F| ≥ 18 + 20 − 30 = 8.',
          },
          {
            id: 'tmua-m1-p2-q20',
            topic: 'Functions & Symmetry',
            stem: 'Suppose f is integrable on [−5, 5] and is odd, so f(−x) = −f(x). What MUST be the value of ∫₋₅⁵ f(x) dx?',
            options: ['0', '2f(5)', '10f(0)', 'Cannot be determined without knowing f', '5'],
            answer: 0,
            explanation:
              'For any integrable odd function on a symmetric interval [−a, a], the areas on [−a, 0] and [0, a] cancel exactly, giving 0.',
          },
        ],
      },
    ],
  },
  ...TMUA_PACK_MOCKS,
];

export const TMUA_FLASHCARDS: TmuaFlashcard[] = [
  {
    id: 'tmua-fc-01',
    paper: 'Paper 2',
    front: 'What is the logical negation of P ⇒ Q ("If P then Q")?',
    back: 'P and (not Q). An implication is ONLY false when the hypothesis holds and the conclusion fails.',
  },
  {
    id: 'tmua-fc-02',
    paper: 'Paper 2',
    front: 'Which statement is always logically equivalent to P ⇒ Q: converse, inverse, or contrapositive?',
    back: 'Contrapositive: (not Q) ⇒ (not P). Converse (Q ⇒ P) and inverse (¬P ⇒ ¬Q) are NOT equivalent to P ⇒ Q.',
  },
  {
    id: 'tmua-fc-03',
    paper: 'Paper 2',
    front: 'How do you remember "P is sufficient for Q" vs "P is necessary for Q"?',
    back: 'Sufficient: P ⇒ Q ("P is enough to force Q"). Necessary: Q ⇒ P ("you cannot have Q without P").',
  },
  {
    id: 'tmua-fc-04',
    paper: 'Paper 2',
    front: 'What is the negation of ∀x ∃y P(x, y)?',
    back: '∃x ∀y (not P(x, y)). Flip every quantifier left-to-right and negate the inner statement.',
  },
  {
    id: 'tmua-fc-05',
    paper: 'Paper 2',
    front: 'De Morgan’s Laws for negating AND / OR?',
    back: '¬(P ∧ Q) ≡ (¬P) ∨ (¬Q) and ¬(P ∨ Q) ≡ (¬P) ∧ (¬Q).',
  },
  {
    id: 'tmua-fc-06',
    paper: 'Paper 2',
    front: 'What are the 3 most common hidden errors in TMUA Paper 2 "spot the error" proofs?',
    back: '1) Dividing by an expression that can equal 0. 2) Squaring both sides and claiming equivalence (⇔). 3) Multiplying an inequality by a negative number without flipping the sign.',
  },
  {
    id: 'tmua-fc-07',
    paper: 'Paper 1',
    front: 'Sum of an infinite geometric series with first term a and common ratio r?',
    back: 'S∞ = a / (1 − r), valid ONLY when |r| < 1.',
  },
  {
    id: 'tmua-fc-08',
    paper: 'Paper 1',
    front: 'Change of base formula for logarithms?',
    back: 'log_a(b) = ln(b) / ln(a) = 1 / log_b(a). Also log_a(b) · log_b(c) = log_a(c).',
  },
  {
    id: 'tmua-fc-09',
    paper: 'Paper 1',
    front: 'How does y = a·f(bx + c) + d transform a point (x₀, y₀) on y = f(x)?',
    back: 'x-coordinate: solve bx + c = x₀ ⇒ x = (x₀ − c)/b. y-coordinate: y = a·y₀ + d.',
  },
  {
    id: 'tmua-fc-10',
    paper: 'Paper 1',
    front: 'Exact values of sin, cos, tan for π/6, π/4, π/3?',
    back: 'sin: 1/2, √2/2, √3/2. cos: √3/2, √2/2, 1/2. tan: 1/√3, 1, √3.',
  },
  {
    id: 'tmua-fc-11',
    paper: 'Paper 1',
    front: 'Condition for a circle (x − a)² + (y − b)² = r² to be tangent to the x-axis?',
    back: '|b| = r (the distance from the centre to the x-axis equals the radius).',
  },
  {
    id: 'tmua-fc-12',
    paper: 'Paper 1',
    front: 'Integral of a symmetric odd function vs even function on [−a, a]?',
    back: 'Odd: ∫₋ₐᵃ f(x) dx = 0. Even: ∫₋ₐᵃ f(x) dx = 2 ∫₀ᵃ f(x) dx.',
  },
];

export const TMUA_LOGIC_GUIDE = `# TMUA Paper 2 — Logic, Proof & Reasoning Cheat Sheet

## 1. Necessary vs Sufficient ("Only If" Trap)
- **P ⇒ Q** means: "If P, then Q", "**P is sufficient for Q**", "**Q is necessary for P**", and "**P only if Q**".
- **Q ⇒ P** means: "**P if Q**", "Q is sufficient for P", "P is necessary for Q".
- **P ⇔ Q** means: "P **if and only if** Q" (both necessary and sufficient).

## 2. Converse, Inverse, Contrapositive
Given **P ⇒ Q**:
- **Contrapositive** (¬Q ⇒ ¬P): **ALWAYS logically equivalent** to P ⇒ Q.
- **Converse** (Q ⇒ P): NOT equivalent.
- **Inverse** (¬P ⇒ ¬Q): equivalent to the converse, NOT the original.

## 3. Quantifiers & Counterexamples
- To **disprove** "For all x, P(x)", you only need **one counterexample** x where P(x) is false.
- To **disprove** "If A(x) then B(x)", your counterexample MUST make **A(x) true AND B(x) false**.
- Negation flips quantifiers in order: ¬(∀x ∃y P) ≡ ∃x ∀y (¬P).

## 4. Classic TMUA Paper 2 Proof-Error Traps
1. **Hidden division by zero:** Cancelling (x − 2) or (a − b) without checking whether it can be 0.
2. **One-way squaring:** A = B ⇒ A² = B², which can create fake roots (always check back in the original equation).
3. **Inequality sign flips:** Multiplying or dividing by an unknown x when x might be negative.
4. **Circular reasoning:** Assuming the conclusion in Step 1 and working backwards without checking reversibility (⇔).
5. **Logarithm domain drops:** Writing log(x²) = 2 log(x) without checking x > 0.
`;
