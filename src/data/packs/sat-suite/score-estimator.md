# Raw-to-scale illustration (not a predicted SAT score)

An original bank or fixed-route mock has no equating data. Actual Digital SAT scores depend on the adaptive test, item characteristics and which questions are scored; the same number of correct answers need not produce the same score. Read [College Board’s scoring explanation](https://satsuite.collegeboard.org/scores/what-scores-mean/how-scores-calculated) and use [Bluebook](https://satsuite.collegeboard.org/practice/practice-tests/bluebook) for a scored practice result.

Keep Ratio mock result screens **raw only**. For an optional **standalone** illustration, enter raw correct answers on a full-length-format practice (0–54 in R&W and 0–44 in Math). For each section use `200 + 10 × round-half-up(60 × correct / total)`; add the results for the illustrative total. Do not extrapolate a short drill, invent confidence intervals, or use this widget to recommend colleges, predict a real score or mix an illustration with official score history.

Example: 41/54 and 36/44 give approximately 660 + 690 = 1350 on this linear display. Those numbers do not identify a score on any specific SAT form. Always show raw counts, an “illustrative estimate only” label and the limitations alongside the result. For exact executable logic: `python score_estimator.py --rw 41 --math 36`.
