# Ratio UCAT UK import — schema v1

Import the three UTF-8 JSON files. The Markdown guide duplicates the revision content for human readers; it is not required for the app. All practice items are original Ratio content, not UCAT Consortium questions. Do not display a band or an official scaled score for a Ratio raw result.

## Practice

- `ucat-mocks.json`: root `{schemaVersion, exam, cycle, original, scoring, mocks[]}`.
- `ucat-drills.json`: same metadata, with `drills[]`. A mock is `{id, title, sections[]}`; a drill is `{id, title, section}`.
- A section is `{code, questionCount, instructionSeconds, testSeconds, extraTime25Seconds, groups[]}`. Codes: `VR`, `DM`, `QR`, `SJT`. The +25% value replaces the standard **question** timer, not the instruction timer. Drills have no timed instructions and use a rounded, prorated section time. Start each section and its instructions separately.
- A group is `{id, title?, stimulus?, chart?, venn?, questions[]}`. Shared text and data remain available for every question in that group. DM groups contain one item. `chart` is `{type, title, labels: string[], series: {name, values: number[]}[]}`, with `type` of `table`, `bar` or `line`. Each series aligns one-to-one with `labels`; show a data table as the accessible fallback. Optional `venn` is `{sets:["A","B","C"], regions:{A,B,C,AB,AC,BC,ABC,none}}`; each key is an **exclusive** region. The question stem also supplies the relevant counts for fallback.
- A question is `{id, format, stem, options: string[], answer, explanation, statements?, maxMarks?}`. Answers are **zero-based indexes**. Hide answers and explanations until review.

| Format | Input/answer | Practice scoring |
|---|---|---|
| `single-choice` | One index; four options in VR/DM, five in QR | 1 if exact, otherwise 0 |
| `true-false-cant-tell` | One index in True/False/Can't Tell order | 1 if exact, otherwise 0 |
| `yes-no-5` | Five indexes in statement order; 0 = Yes, 1 = No | 2 for all five correct, 1 for four correct, else 0 |
| `appropriateness`, `importance` | One index on a four-point scale, ordered highest to lowest | 1 if exact, 0.5 if one position away, else 0 |
| `most-least` | Two distinct indexes in order **[most, least]** | 0.5 per correctly matched role |

The last two rules are Ratio practice approximations of SJT partial credit, not an official rubric or Band lookup. Log blanks separately; they do not earn marks. A question count is not a maximum mark count: each DM five-statement item has two available marks.

## Revision

`ucat-revision.json` contains:

- `overview` (numeric format/score facts plus `markdown`), `studyPath` (`stepsMarkdown`, `plans` indexed by `"4"`, `"6"` and `"8"`, each with `{week, task}[]`), `strategies` (Markdown indexed by code), and the three cheat-sheet/framework Markdown fields.
- `timeline` (cycle note, time zone, dated milestones and countdown policy), `scores` (2026 data and nine decile rows), `logistics` (fees and checklist), `scoreLog` (columns and Markdown), and `flashcards[]` of `{id, section, front, back}`.
- `resourceGroups[]` of `{title, links: {label, url, embedUrl?, openInNewTab?, desktopOnly?, progressSaved?}[]}`. Link out to desktop Pearson launches in a new tab; only the specified Canva decks have an optional embed URL. No official question content is imported.

Dates and fees describe the 2026 cycle. Recheck Feb–Mar 2027; don't show a countdown to an expired or unpublished test window. Historical data is not a projection for the next admissions cycle.

## Verification

`validate.py` reads the three JSON files, the Markdown mirror and `arithmetic-audit.json` from the same directory. The audit file is for offline verification only; do not import it into Ratio.
