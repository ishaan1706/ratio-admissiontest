# TMUA Paper 2: five ways to check a mathematical argument

The letters below describe claims about an agreed domain, such as the integers. A claim may become true or false when the domain changes. Before doing algebra, write down the domain, the assumption, and the exact conclusion.

## Necessary and sufficient conditions

If P ⇒ Q, P is sufficient for Q, and Q is necessary for P. Read “P only if Q” as P ⇒ Q. Read “P if Q” as Q ⇒ P. To show “if and only if” you need both directions.

**Example.** For integer n let P be “24 divides n” and Q be “8 divides n.” If n = 24k, then n = 8(3k), so P is sufficient for Q. The converse fails at n = 16. Hence Q is necessary but not sufficient for P. In a question that asks for P relative to Q, answer in that direction, not the other way round.

## Implications, negation and quantifiers

The only way “if P then Q” can fail is P true and Q false. Its contrapositive “if not Q, then not P” has exactly the same failure case. Its converse “if Q then P” is a different claim.

Negate “every x has property P” as “some x does not have property P.” Negate “some x has property P” as “no x has property P.” Negate a conjunction by negating at least one part, not necessarily both. Keep the boundary: not(x < a) is x ≥ a. Also keep quantifier order: “for every x there exists y” allows y to depend on x; “there exists y for every x” requires one fixed choice.

**Example.** The negation of “for every real t, if t ≥ 3 then t² > 9” is “there is a real t with t ≥ 3 and t² ≤ 9.” The witness is t = 3. The statement “if t² > 9 then t ≥ 3” is its converse, not its negation.

## Counterexamples and witnesses

For a universal conditional, test where the premise changes from false to true, then check where the conclusion might fail. A value outside the domain or failing the premise proves nothing. Try 0, negative values, equality cases, and small residue classes.

**Example.** “If an integer is divisible by 6 and by 8, it is divisible by 48.” The smallest positive candidate satisfying both premises is 24, and it is not divisible by 48. The witness refutes the claim. It does not show that no common multiple is divisible by 48.

## Spotting errors in proofs

At each line ask whether it follows, and whether it is reversible. Dividing by an expression may lose its zero case. Multiplying by an expression of unknown sign is unsafe in an inequality unless you branch on its sign. Squaring can preserve a true equality while admitting extra answers in the reverse direction. Check derived candidates in the starting equation.

**Example.** From √(x + 6) = x we get x² − x − 6 = 0, hence x = 3 or x = −2. Both satisfy the squared relation, but only 3 satisfies the original; the right side had to be nonnegative. “Squaring both sides is invalid” is not the diagnosis. Claiming that the squared equation alone proves both original solutions is.

## Constructing arguments and exhaustive cases

- **Direct proof:** start with the premise and derive the target. To show two consecutive even integers sum to a multiple of 2, write them as 2k and 2k + 2 and factor.
- **Contrapositive:** to prove that an odd product of two integers requires both factors odd, show that if either factor is even, the product is even.
- **Contradiction:** assume the target is false and show this conflicts with an assumption or an established fact. Proving that no integer square leaves remainder 2 modulo 4 can start by assuming one does and checking the even and odd cases.
- **Cases:** choose cases that cover the full domain; show each is valid or impossible. For residues modulo 4, include 0, 1, 2 and 3.
- **Guarantees:** prove both that your bound works and that a smaller bound can fail. For example, four picks from four labelled pairs need not include a complete pair. Five distinct picks must include both members of some pair.

## A no-calculator rehearsal

There are 75 minutes for 20 questions: 3 min 45 sec is an average, not a deadline on each item. Identify the target before computing. Factor before expanding, work modulo small numbers when only a remainder matters, and use exact fractions. If you can eliminate options but cannot finish, flag the item, answer if useful and come back. There is no negative marking. During review, write the failed assumption or the cheaper method in your own words, then retry without the explanation open.
