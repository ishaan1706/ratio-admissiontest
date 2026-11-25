export type LnatSkill =
  | 'Main Argument'
  | 'Inference'
  | 'Assumption & Flaw'
  | 'Tone & Attitude'
  | 'Structure & Evidence';

export interface QuestionOption {
  letter: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
  explanation: string;
}

export interface LnatQuestion {
  id: string;
  passageId: string;
  stem: string;
  skill: LnatSkill;
  difficulty: 'Standard' | 'Challenging';
  paragraphRef: number; // 1-indexed
  correctLetter: 'A' | 'B' | 'C' | 'D' | 'E';
  rationale: string;
  options: QuestionOption[];
}

export interface LnatPassage {
  id: string;
  title: string;
  domain: string;
  sourceStyle: string;
  wordCount: number;
  freeTier: boolean;
  paragraphs: string[];
  questions: LnatQuestion[];
}

export interface EssayPrompt {
  id: string;
  question: string;
  theme: string;
  planningHints: string[];
  counterArguments: string[];
  modelOutline: {
    thesis: string;
    points: string[];
    counterRebuttal: string;
    sampleOpening: string;
  };
}

export interface EssaySet {
  id: string;
  title: string;
  subtitle: string;
  freeTier: boolean;
  prompts: [EssayPrompt, EssayPrompt, EssayPrompt];
}

export interface SkillStat {
  correct: number;
  total: number;
}

export type ConfidenceLevel = 'sure' | 'unsure' | 'guess';

export interface SectionAAttempt {
  id: string;
  mode: 'diagnostic' | 'mock' | 'drill';
  label: string;
  correct: number;
  total: number;
  projected_42: number;
  duration_seconds: number;
  skill_breakdown: Record<string, SkillStat>;
  answers: Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>;
  confidence?: Record<string, ConfidenceLevel>;
  created_at: string;
}

export interface SectionBEssayRecord {
  id: string;
  prompt_id: string;
  prompt_text: string;
  set_title: string;
  plan_text: string;
  essay_text: string;
  word_count: number;
  duration_seconds: number;
  rubric_scores: Record<string, number>;
  created_at: string;
}

export type AppView =
  | 'home'
  | 'practice'
  | 'exam'
  | 'results'
  | 'essay'
  | 'plan'
  | 'resources'
  | 'tests'
  | 'progress'
  | 'pricing';

export interface ActiveExamConfig {
  mode: 'diagnostic' | 'mock' | 'drill';
  label: string;
  timeLimitSeconds: number;
  passageIds: string[];
  skillFilter?: LnatSkill;
}
