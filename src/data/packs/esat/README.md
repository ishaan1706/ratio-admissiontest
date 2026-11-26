# ESAT content pack for Ratio

Original ESAT (Engineering and Science Admissions Test) practice and revision content, written to the official UAT-UK ESAT Content Specification and module guides. No official questions are reproduced; official material is linked.

| File | Contents |
|---|---|
| esat-mocks.json | 2 full mocks (A and B) × 5 modules × 27 questions = 270 original MCQs, each with topic code, difficulty (1–3), options, answer and worked explanation |
| esat-flashcards.json | 160 recall flashcards across the five modules, tagged by spec topic |
| esat-revision-guide.md | Format, module choice, timing strategy, no-calculator techniques, common traps per module, spec topic checklists, how to use the mocks, all official links and the ENGAA/NSAA past-paper table |
| esat-formula-sheets.md | Formula and fact sheets for Mathematics 1, Mathematics 2, Physics, Chemistry and Biology |
| esat-study-plan.md | 10-week plan, daily habits and mock routine |
| esat-error-log-template.csv | Error log template with one example row |

## esat-mocks.json schema

```
{
  "exam": "ESAT", "version": 1, "notes": str,
  "format": {"questions_per_module": 27, "minutes_per_module": 40, "calculator": false, "negative_marking": false, "score_scale": str},
  "official_links": {name: url},
  "difficulty_scale": str,
  "mocks": [
    {"id": "esat-mock-a", "title": "ESAT Mock A",
     "modules": [
       {"module": "Mathematics 1", "key": "m1", "time_minutes": 40, "question_count": 27,
        "questions": [
          {"id": "esat-a-m1-01", "number": 1, "topic": "M3.8", "difficulty": 1,
           "stem": str, "options": [{"label": "A", "text": str}, ...],
           "answer": "D", "explanation": str}
        ]}
     ]}
  ]
}
```

Module keys: m1 (Mathematics 1), bio (Biology), chem (Chemistry), phys (Physics), m2 (Mathematics 2). Topic codes follow the official specification (M, MM, P, C, B). Stems use "\n\n" between paragraphs and Unicode for maths symbols; no question needs a diagram.

## esat-flashcards.json schema

```
{"exam": "ESAT", "version": 1, "cards": [{"id": str, "module": str, "topic": str, "front": str, "back": str}]}
```

Display suggestion: students pick the modules their courses require (Mathematics 1 plus usually two others), sit each module as a separately timed 40-minute block, and see explanations only after submitting.
