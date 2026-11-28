export interface TmuaSkill {
  id: string;
  title: string;
  lessonId: string | null;
}

export interface TmuaDrillQuestion {
  id: string;
  topic: string;
  type: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  family: string;
  tags: string[];
  stem: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface TmuaDrillModule {
  type: 'paper-1' | 'paper-2';
  paperNumber: 1 | 2;
  title: string;
  skills: TmuaSkill[];
  questions: TmuaDrillQuestion[];
}

export interface TmuaMistakeReason {
  id: string;
  label: string;
}

export interface TmuaStudyStage {
  id: string;
  title: string;
  steps: string[];
}

export interface TmuaResourceLink {
  id: string;
  title: string;
  url: string;
  category: 'official' | 'official-legacy' | 'university' | 'third-party';
  description: string;
}

export interface TmuaDrillPack {
  schemaVersion: 1;
  exam: 'TMUA';
  title: string;
  paceSeconds: number;
  dailyQuestionCount: number;
  difficultyLabels: Record<string, string>;
  mistakeReasons: TmuaMistakeReason[];
  studyPath: TmuaStudyStage[];
  resourceLinks: TmuaResourceLink[];
  modules: TmuaDrillModule[];
}

export interface TmuaHistoryOutcome {
  status: 'correct' | 'wrong' | 'unanswered';
  selected: number | null;
  guessed: boolean;
  assisted: boolean;
  at: string;
  reason: string | null;
  note: string;
}

export interface TmuaDrillHistory {
  version: 1;
  first: Record<string, TmuaHistoryOutcome>;
  latest: Record<string, TmuaHistoryOutcome>;
  queue: Record<string, TmuaHistoryOutcome>;
}

export interface TmuaDailyState {
  day: string;
  ids: string[];
  complete: boolean;
}

export interface TmuaSkillStat {
  correct: number;
  secure: number;
  total: number;
}

export function localDay(now?: Date): string;
export function practiceSeconds(count: number): number;
export function readHistory(raw: string): TmuaDrillHistory;
export function recordResult(
  history: TmuaDrillHistory,
  question: { id: string; options: string[]; answer: number },
  entry: {
    selected: number | null | undefined;
    guessed?: boolean;
    assisted?: boolean;
    at: string;
    reason?: string | null;
    note?: string;
  }
): TmuaDrillHistory;
export function listReview<T extends { id: string }>(questions: T[], history: TmuaDrillHistory): T[];
export function firstAttemptStats(
  questions: Array<{ id: string; type: string }>,
  history: TmuaDrillHistory
): Record<string, TmuaSkillStat>;
export function bankQuestions(pack: TmuaDrillPack): TmuaDrillQuestion[];
export function selectQuestions(
  pack: TmuaDrillPack,
  history: TmuaDrillHistory,
  options?: {
    count?: number;
    paper?: 1 | 2;
    skill?: string;
    difficulty?: number | null;
    seed?: string;
    adaptive?: boolean;
  }
): TmuaDrillQuestion[];
export function dailyFive(
  pack: TmuaDrillPack,
  history: TmuaDrillHistory,
  day: string,
  saved?: Partial<TmuaDailyState> | null
): TmuaDailyState;
