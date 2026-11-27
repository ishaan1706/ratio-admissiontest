export interface AdaptiveQuestion {
  id: string;
  topic: string;
  difficulty: number;
}

export interface AdaptiveAttempt {
  id: string;
  correct: boolean;
  seconds?: number;
}

export interface AdaptiveOptions {
  runLength?: number;
  seenIds?: string[];
}

export interface LevelAccuracy {
  attempted: number;
  correct: number;
  accuracy: number | null;
}

export interface AdaptiveRunSummary {
  estimatedLevel: number | null;
  accuracyByLevel: Record<number, LevelAccuracy>;
  pace: {
    timedQuestions: number;
    elapsedSeconds: number;
    expectedSeconds: number;
    differenceSeconds: number;
    status: 'ahead' | 'behind' | 'on' | null;
  };
}

const START_LEVEL = 3;
const DEFAULT_RUN_LENGTH = 27;
const PACE_SECONDS = 90;
const HISTORY_WINDOW = 8;

function topicSection(question: AdaptiveQuestion): string {
  return question.topic.split('.')[0];
}

function hasTime(attempt: AdaptiveAttempt): boolean {
  return typeof attempt.seconds === 'number' && Number.isFinite(attempt.seconds) && attempt.seconds >= 0;
}

export function nextQuestion<T extends AdaptiveQuestion>(
  bank: T[],
  history: AdaptiveAttempt[] = [],
  opts: AdaptiveOptions = {},
): T | null {
  const { runLength = DEFAULT_RUN_LENGTH, seenIds = [] } = opts;
  if (history.length >= runLength) return null;

  const byId = new Map(bank.map((question) => [question.id, question]));
  const attempted = new Set<string>();
  const topicRecency = new Map<string, number>();
  let target = START_LEVEL;
  let lastSection: string | undefined;

  for (const [index, attempt] of history.entries()) {
    attempted.add(attempt.id);
    const question = byId.get(attempt.id);
    if (!question) continue;
    lastSection = topicSection(question);
    topicRecency.set(lastSection, index);
    const step = attempt.correct
      ? hasTime(attempt) && (attempt.seconds as number) <= 60
        ? 2
        : 1
      : -1;
    target = Math.min(5, Math.max(1, question.difficulty + step));
  }

  const priorRecency = new Map(seenIds.map((id, index) => [id, index]));
  const unattempted = bank.filter((question) => !attempted.has(question.id));
  if (!unattempted.length) return null;

  const distance = Math.min(...unattempted.map(({ difficulty }) => Math.abs(difficulty - target)));
  let candidates = unattempted.filter(({ difficulty }) => Math.abs(difficulty - target) === distance);
  const unseen = candidates.filter(({ id }) => !priorRecency.has(id));
  if (unseen.length) {
    candidates = unseen;
  } else {
    return candidates.reduce((oldest, candidate) =>
      (priorRecency.get(candidate.id) ?? 0) < (priorRecency.get(oldest.id) ?? 0) ? candidate : oldest,
    );
  }

  const otherTopics = candidates.filter((candidate) => topicSection(candidate) !== lastSection);
  if (otherTopics.length) candidates = otherTopics;
  return candidates.reduce((leastRecent, candidate) => {
    const recent = topicRecency.get(topicSection(candidate)) ?? -1;
    const best = topicRecency.get(topicSection(leastRecent)) ?? -1;
    if (recent !== best) return recent < best ? candidate : leastRecent;
    return candidate.difficulty < leastRecent.difficulty ? candidate : leastRecent;
  });
}

export function runSummary<T extends AdaptiveQuestion>(
  history: AdaptiveAttempt[],
  bank: T[],
): AdaptiveRunSummary {
  const byId = new Map(bank.map((question) => [question.id, question]));
  const accuracyByLevel: Record<number, LevelAccuracy> = Object.fromEntries(
    [1, 2, 3, 4, 5].map((level) => [level, { attempted: 0, correct: 0, accuracy: null }]),
  );
  const levels: number[] = [];
  let timedQuestions = 0;
  let elapsedSeconds = 0;

  for (const attempt of history) {
    const question = byId.get(attempt.id);
    if (!question) continue;
    const { difficulty } = question;
    levels.push(difficulty);
    const level = accuracyByLevel[difficulty];
    if (level) {
      level.attempted++;
      if (attempt.correct) level.correct++;
      level.accuracy = level.correct / level.attempted;
    }
    if (hasTime(attempt)) {
      timedQuestions++;
      elapsedSeconds += attempt.seconds as number;
    }
  }

  const latest = levels.slice(-HISTORY_WINDOW);
  const estimatedLevel = latest.length
    ? latest.reduce((sum, level) => sum + level, 0) / latest.length
    : null;
  const expectedSeconds = timedQuestions * PACE_SECONDS;
  const differenceSeconds = elapsedSeconds - expectedSeconds;
  const status = !timedQuestions
    ? null
    : differenceSeconds > 0
      ? 'behind'
      : differenceSeconds < 0
        ? 'ahead'
        : 'on';

  return {
    estimatedLevel,
    accuracyByLevel,
    pace: { timedQuestions, elapsedSeconds, expectedSeconds, differenceSeconds, status },
  };
}
