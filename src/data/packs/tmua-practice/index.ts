import rawDrills from './tmua_drills.json';
import rawMocks from './tmua_mocks.json';
import primerMarkdown from './tmua_logic_primer.md?raw';
import type { TmuaMock, TmuaPaper } from '../tmua/tmuaData';
import type { TmuaDrillPack, TmuaDrillQuestion } from './tmua_practice.mjs';

export const TMUA_DRILL_PACK = rawDrills as unknown as TmuaDrillPack;
export const TMUA_LOGIC_PRIMER_MD = primerMarkdown;

export const TMUA_PRIMER_SECTIONS: Record<string, { heading: string; title: string }> = {
  conditions: {
    heading: 'Necessary and sufficient conditions',
    title: 'Necessary & sufficient conditions',
  },
  logic: {
    heading: 'Implications, negation and quantifiers',
    title: 'Implications, negation & quantifiers',
  },
  counterexamples: {
    heading: 'Counterexamples and witnesses',
    title: 'Counterexamples & witnesses',
  },
  'proof-errors': {
    heading: 'Spotting errors in proofs',
    title: 'Spotting errors in proofs',
  },
  'proof-strategies': {
    heading: 'Constructing arguments and exhaustive cases',
    title: 'Constructing arguments & cases',
  },
};

interface RawMockPaper {
  id: string;
  paperNumber: number;
  title: string;
  minutes: number;
  questions: Array<{
    id: string;
    topic: string;
    type?: string;
    difficulty?: number;
    family?: string;
    tags?: string[];
    stem: string;
    options: string[];
    answer: number;
    explanation: string;
  }>;
}

interface RawMockRoot {
  mocks: Array<{
    id: string;
    title: string;
    papers: RawMockPaper[];
  }>;
}

function adaptPackMocks(root: RawMockRoot): TmuaMock[] {
  return root.mocks.map((m) => {
    const p1 = m.papers.find((p) => p.paperNumber === 1);
    const p2 = m.papers.find((p) => p.paperNumber === 2);
    if (!p1 || !p2 || m.papers.length !== 2) {
      throw new Error(`Invalid TMUA pack mock "${m.id}": expected Paper 1 and Paper 2`);
    }
    const toPaper = (p: RawMockPaper, num: 1 | 2): TmuaPaper => ({
      id: p.id,
      paperNumber: num,
      title: p.title,
      minutes: p.minutes,
      questions: p.questions.map((q) => ({
        id: q.id,
        topic: q.topic,
        stem: q.stem,
        options: q.options.slice(),
        answer: q.answer,
        explanation: q.explanation,
      })),
    });
    return {
      id: m.id,
      title: m.title,
      papers: [toPaper(p1, 1), toPaper(p2, 2)],
    };
  });
}

export const TMUA_PACK_MOCKS: TmuaMock[] = adaptPackMocks(rawMocks as unknown as RawMockRoot);

export const TMUA_PACK_MOCK_QUESTIONS: TmuaDrillQuestion[] = (
  rawMocks as unknown as RawMockRoot
).mocks.flatMap((m) =>
  m.papers.flatMap((p) =>
    p.questions.map((q) => ({
      id: q.id,
      topic: q.topic,
      type: q.type ?? (p.paperNumber === 1 ? 'algebra' : 'logic'),
      difficulty: ((q.difficulty ?? 3) as 1 | 2 | 3 | 4 | 5),
      family: q.family ?? 'mock',
      tags: q.tags ?? [`paper-${p.paperNumber}`],
      stem: q.stem,
      options: q.options.slice(),
      answer: q.answer,
      explanation: q.explanation,
    }))
  )
);
