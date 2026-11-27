# College Board alignment — Ratio Digital SAT v3

Ratio uses College Board’s public **specifications**, not its questions, answer choices, passages, images, scoring algorithm, or content exports. Practice items in this pack are original and not endorsed or calibrated by College Board.

## Official blueprint and v3 implementation

| Official source | What it specifies and what Ratio does |
|---|---|
| [Assessment Framework](https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf), sections 2–4, tables A34–A38; [Specifications Overview](https://satsuite.collegeboard.org/media/pdf/digital-sat-test-spec-overview.pdf), tables 1–3 | Adopt the four domains in each section, skill taxonomy, counts and format below. The approximate weights are per **scored section**, not per lesson and not out of all 54/44 delivered questions. |
| [Test structure](https://satsuite.collegeboard.org/sat/whats-on-the-test/structure); [R&W specs](https://satsuite.collegeboard.org/k12-educators/about/alignment/reading); [Math specs](https://satsuite.collegeboard.org/k12-educators/about/alignment/math) | R&W M1 and the chosen M2 each deliver 27 items (25 operational + 2 pretest), each 32 minutes. Math M1 and chosen M2 each deliver 22 (20 + 2), each 35 minutes. Ten minutes between sections at standard time; 134 minutes of work, 98 delivered, 90 operational. v3 matches those counts. |
| [R&W content](https://satsuite.collegeboard.org/sat/whats-on-the-test/reading-writing); [Math overview](https://satsuite.collegeboard.org/sat/whats-on-the-test/math/overview) | R&W is four-choice only, one question per short passage, pair, or notes set. v3 validates 25–150 ordinary words across its stimulus (an approximation to the framework's convention); it uses original narration, reports, notes and tables. Math mixes four-choice and SPR; v3 has 5–6 SPR and 6–8 contextual items per 22-item module. This pack uses table stimuli rather than bar/line figures and is not exhaustive of the permitted graphics. |
| [How scores are calculated](https://satsuite.collegeboard.org/scores/what-scores-mean/how-scores-calculated) | Each section’s M1 is mixed; the next module is selected separately by that section's performance and also contains mixed difficulty. Scores use performance across both modules and item characteristics; there is no raw-to-scaled table for Ratio. v3 uses explicit, **editorial** raw thresholds and excludes two embedded practice-pretest items per module from its practice raw score; both routes contain mixed difficulty. Never label it official adaptive scoring. |
| [Bluebook full-length practice](https://satsuite.collegeboard.org/practice/practice-tests/bluebook); [How to use Bluebook and review in My Practice](https://satsuite.collegeboard.org/practice/bluebook) | Keep the official scored rehearsal and answer review external. A learner takes a fresh official test, opens their results in My Practice, then targets the matching skill in Ratio. No invented per-skill Bluebook test IDs or question deep links. |
| [Student Question Bank](https://satsuite.collegeboard.org/practice/student-question-bank); [Educator Question Bank](https://satsuitequestionbank.collegeboard.org/); [College Board guide to practice resources](https://satsuite.collegeboard.org/media/pdf/educator-guide-building-students-skills-sat-practice.pdf) | Open the official site with SAT → section → domain → skill navigation instructions; use the site's own difficulty and practice-test exclusion filters when available. No official bank content was imported. |
| [Official SAT Prep on Khan Academy](https://satsuite.collegeboard.org/practice/khan-academy) | Link each skill to the relevant Digital SAT unit. The resources map distinguishes those skill-learning units from full lengths in Bluebook. |
| [Skills Insight](https://satsuite.collegeboard.org/skills-insight); [Skills Insight guide](https://satsuite.collegeboard.org/media/pdf/skills-insight-digital-sat-suite.pdf), tables 3 and 5–14 | Use section-specific bands as a study-planning reference. v3's `practiceBand` is an editorial challenge tag inspired by those descriptors. Never infer a student's official band or estimated score from success rates on Ratio items. |
| [Bluebook Math directions and reference sheet](https://satsuite.collegeboard.org/media/pdf/english-sat-test-directions-bb.pdf); [SAT calculator policy](https://satsuite.collegeboard.org/sat/what-to-bring-do/calculator-policy); [SAT weekend student guide](https://satsuite.collegeboard.org/media/pdf/sat-student-guide.pdf) | Bluebook supplies common formulas and scientific/graphing Desmos throughout Math. Use the live policy for personal calculators (including the non-CAS requirement). For SPR, teach one valid numeric entry, 5 characters positive or 6 including the minus sign, without units, commas, percent signs or mixed numbers. Follow Bluebook directions for rounding/truncation; v3 uses exact fitting answer keys. |
| [What to bring and do](https://satsuite.collegeboard.org/sat/what-to-bring-do); [What to expect](https://satsuite.collegeboard.org/sat/what-to-bring-do/what-to-expect) | Link test-day rules, exam setup, device, admission ticket and identification rather than hard-coding changing test-day logistics. Approved accommodations can change timing; v3 uses standard time. |

## Domain distribution and existing lessons

Every label in the last column is both a Ratio lesson heading and a bank join key; the v2 headings need no rename. College Board sometimes varies capitalization, spells out numbers or writes “and”/hyphens differently across publications. “Command of Evidence” is one official category with two testing points; Ratio keeps both qualified labels for stable links. The [per-skill map](official-resources-map.md) gives all 30 exact keys, official filter selections and original learning progressions.

| Section / official domain | CB approximate share / scored questions | v3 bank | v3 operational questions per complete path | Existing Ratio lessons → published skills |
|---|---|---:|---:|---|
| R&W / Information and Ideas | 26% / 12–14 | 57 of 220 | 12 | Central Ideas and Details; Command of Evidence: Textual; Command of Evidence: Quantitative; Inferences |
| R&W / Craft and Structure | 28% / 13–15 | 62 of 220 | 14 | Words in Context; Text Structure and Purpose; Cross-Text Connections |
| R&W / Expression of Ideas | 20% / 8–12 | 44 of 220 | 10 | Rhetorical Synthesis; Transitions |
| R&W / Standard English Conventions | 26% / 11–15 | 57 of 220 | 14 | Boundaries; Form, Structure, and Sense |
| Math / Algebra | 35% / 13–15 | 63 of 180 | 14 | Linear equations in one variable; Linear equations in two variables; Linear functions; Systems of two linear equations in two variables; Linear inequalities in one or two variables |
| Math / Advanced Math | 35% / 13–15 | 63 of 180 | 14 | Equivalent expressions; Nonlinear equations in one variable and systems of equations in two variables; Nonlinear functions |
| Math / Problem-Solving and Data Analysis | 15% / 5–7 | 27 of 180 | 6 | Ratios, rates, proportional relationships, and units; Percentages; Probability and conditional probability; One-variable data: Distributions and measures of center and spread; Two-variable data: Models and scatterplots; Inference from sample statistics and margin of error; Evaluating statistical claims: Observational studies and experiments |
| Math / Geometry and Trigonometry | 15% / 5–7 | 27 of 180 | 6 | Area and volume; Lines, angles, and triangles; Right triangles and trigonometry; Circles |

## Score bands and use

These are **official section-scale ranges**, not a scale for each skill separately. The progression column is a Ratio-written orientation informed by the cumulative Skills Insight descriptions, not a quotation or a promise about what any particular student can do.

| Band | R&W score | Math score | Practice progression, in our words |
|---:|---:|---:|---|
| 1 | 200–360 | 200–360 | Find directly stated meaning and basic sentence structure; perform a well-signposted computation or one-step solve. |
| 2 | 370–410 | 370–410 | Follow nearby clues to meaning and basic contrasts; read simple coordinate or data features and apply familiar formulas. |
| 3 | 420–480 | 420–460 | Link a claim to evidence in a short passage and handle common punctuation; model a simple constraint or translate a rate with context. |
| 4 | 490–540 | 470–540 | Distinguish main purpose from details and use targeted notes; interpret parts of a contextual model and connect a representation to its features. |
| 5 | 550–600 | 550–600 | Reconcile competing details and select more precise evidence; construct models, choose useful algebraic forms and interpret more layered information. |
| 6 | 610–670 | 610–670 | Recognize qualifications in denser texts, subtle relationships and embedded clause structure; translate complex representations and reason about more than one condition. |
| 7 | 680–800 | 680–800 | Evaluate nuanced claims across evidence sources and resolve tightly competing options; exploit structure in unfamiliar multistep problems and justify constraints. |

## Correcting v2

- **Unchanged:** v2 uses the right numbers/times for the four modules, the right domain/skill taxonomy, and the same standard break. The v2 bank was intentionally equal per skill, so its domain proportions are not SAT proportions; v3 adds a separately weighted bank. When combining all inventory for a mock-length bank sprint, sample by the published domain weights; don’t assert that the combined inventory is itself weighted.
- **Format and scoring:** label the first two Ratio mocks “fixed-route practice” because they only have a harder M2. In v3, lock each completed module and choose M2 only after M1. Use both modules’ operational raw data for feedback and remove the older “only the harder module matters” framing. Report the two mock types explicitly and keep Bluebook as the official scored practice.
- **Revision guide:** use the included complete, targeted replacement to explain pretest counts, mixed M2 difficulty, operational weights, and the both-modules scoring principle. It also notes that the midpoint of a parabola's real x-intercepts is the vertex’s x-coordinate, not the vertex point.
- **Grading:** the current SAT component parses SPR via floating-point tolerance, not the official input format. v3 keeps exact fitting entries and does not change grading code. App integration should match equivalent, valid forms and implement any desired College Board rounding/truncation rules deliberately, instead of using new approximate keys or implying perfect Bluebook equivalence.
