export type SkillTag =
  | 'Inference'
  | 'Assumption'
  | 'Main Argument'
  | 'Tone & Attitude'
  | 'Evidence & Structure';

export type ConfidenceLevel = 'sure' | 'unsure' | 'guess';

export interface QuestionOption {
  letter: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
  rationale: string;
}

export interface LnatQuestion {
  id: string;
  passageId: string;
  prompt: string;
  skill: SkillTag;
  options: QuestionOption[];
  correctLetter: 'A' | 'B' | 'C' | 'D' | 'E';
  explanation: string;
}

export interface LnatPassage {
  id: string;
  title: string;
  domain: string;
  sourceStyle: string;
  difficulty: 'Standard' | 'Challenging' | 'Stretch';
  readingMinutes: number;
  paragraphs: string[];
  questions: LnatQuestion[];
}

export interface EssayPrompt {
  id: string;
  category: string;
  question: string;
  admissionsHint: string;
  counterArgumentSeed: string;
  modelOutline: {
    thesis: string;
    arguments: string[];
    counterAndRebuttal: string;
    conclusion: string;
  };
}

export interface EssaySet {
  id: string;
  title: string;
  description: string;
  prompts: [EssayPrompt, EssayPrompt, EssayPrompt];
}

export interface SectionAAttempt {
  id: string;
  mode: 'diagnostic' | 'passage' | 'skill' | 'half-mock';
  label: string;
  score: number;
  total: number;
  projected42: number;
  durationSec: number;
  answers: Record<string, string>;
  flagged: string[];
  confidence?: Record<string, ConfidenceLevel>;
  skillBreakdown: Record<string, { correct: number; total: number }>;
  createdAt: string;
}

export interface SectionBEssayRecord {
  id: string;
  setId: string;
  promptId: string;
  promptText: string;
  planText: string;
  essayText: string;
  wordCount: number;
  durationSec: number;
  selfScores: {
    thesis: number;
    argumentation: number;
    counterargument: number;
    precision: number;
  };
  createdAt: string;
}

export interface ExamConfig {
  mode: 'diagnostic' | 'passage' | 'skill' | 'half-mock';
  label: string;
  timeLimitSec: number;
  passages: LnatPassage[];
  questionIds?: string[];
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
