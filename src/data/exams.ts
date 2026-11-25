export interface ExamTrack {
  id: 'lnat' | 'tsa' | 'ucat' | 'tmua';
  code: string;
  name: string;
  field: string;
  status: 'live' | 'preview';
  universities: string[];
  formatSummary: string;
  duration: string;
  keyDeadline: string;
  officialUrl: string;
  accentColor: string;
  description: string;
  sampleQuestion?: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const EXAM_TRACKS: ExamTrack[] = [
  {
    id: 'lnat',
    code: 'LNAT',
    name: 'National Admissions Test for Law',
    field: 'Law (LLB / BA Jurisprudence)',
    status: 'live',
    universities: ['Oxford', 'Cambridge', 'LSE', 'UCL', 'KCL', 'Durham', 'Bristol', 'Glasgow'],
    formatSummary: 'Section A: 42 MCQs (12 passages) · Section B: 1 of 3 Essays',
    duration: '135 mins (95m + 40m)',
    keyDeadline: '20 Jan (Oct 15 for Oxbridge)',
    officialUrl: 'https://lnat.ac.uk/',
    accentColor: '#2563EB',
    description:
      'Tests critical reading, logical inference, assumption spotting, and concise argumentative writing—no prior legal knowledge required.',
  },
  {
    id: 'tsa',
    code: 'TSA',
    name: 'Thinking Skills Assessment',
    field: 'PPE, E&M, Experimental Psychology',
    status: 'preview',
    universities: ['Oxford (PPE, E&M, Psych, Human Sciences)', 'UCL (ESPS)'],
    formatSummary: 'Section 1: 50 MCQs (Problem Solving + Critical Thinking) · Section 2: 30m Essay',
    duration: '120 mins (90m + 30m)',
    keyDeadline: 'Late October',
    officialUrl: 'https://www.ox.ac.uk/admissions/undergraduate/applying-to-oxford/guide/admissions-tests/tsa',
    accentColor: '#D97706',
    description:
      'Shares LNAT’s core critical-reasoning DNA (flaws, assumptions, parallel reasoning) alongside numerical problem solving.',
    sampleQuestion: {
      prompt:
        '“Cities that expand urban cycle lanes report a 14% drop in commuter car journeys within two years. Therefore, replacing bus lanes with cycle lanes is the fastest way to cut urban carbon emissions.” Which best identifies the flaw in this argument?',
      options: [
        'It assumes all commuters own bicycles.',
        'It ignores that replacing bus lanes could shift public-transit passengers back into cars.',
        'It relies on data from only two years rather than a decade.',
        'It fails to mention electric vehicles.',
      ],
      correctIndex: 1,
      explanation:
        'The premise only shows expanding cycle lanes reduces car trips; concluding we should replace bus lanes overlooks the emissions cost of degrading bus transit.',
    },
  },
  {
    id: 'ucat',
    code: 'UCAT',
    name: 'University Clinical Aptitude Test',
    field: 'Medicine & Dentistry',
    status: 'preview',
    universities: ['Oxford', 'Cambridge', 'Imperial', 'UCL', 'KCL', 'Edinburgh', 'Manchester + 30 more'],
    formatSummary: '4 timed subtests: Verbal Reasoning, Decision Making, Quantitative Reasoning, SJT',
    duration: '120 mins',
    keyDeadline: 'July – September',
    officialUrl: 'https://www.ucat.ac.uk/',
    accentColor: '#059669',
    description:
      'High-speed computer-based aptitude test requiring rapid verbal triage, probabilistic reasoning, and clinical ethics judgement.',
    sampleQuestion: {
      prompt:
        'A hospital ward has 60 beds. Currently 85% are occupied. If 9 patients are discharged and 6 new patients are admitted, what percentage of beds are occupied?',
      options: ['75%', '80%', '82%', '84%'],
      correctIndex: 1,
      explanation:
        '85% of 60 = 51 occupied beds. 51 - 9 + 6 = 48 beds occupied. 48 / 60 = 80%.',
    },
  },
  {
    id: 'tmua',
    code: 'TMUA / ESAT',
    name: 'Maths, CS & Engineering Admissions Tests',
    field: 'Mathematics, Computer Science, Economics, Engineering',
    status: 'preview',
    universities: ['Cambridge', 'Imperial', 'LSE', 'Warwick', 'Durham', 'UCL'],
    formatSummary: 'Multiple-choice mathematical reasoning, logic, proof, and physics/chemistry modules',
    duration: '150 mins (TMUA) / 120 mins (ESAT)',
    keyDeadline: 'October & January sittings',
    officialUrl: 'https://esat-tmua.ac.uk/',
    accentColor: '#7C3AED',
    description:
      'Assesses formal mathematical logic, proof structure, and multi-step problem solving beyond A-Level routine drills.',
    sampleQuestion: {
      prompt:
        'Which statement is the exact logical negation of: “Every law applicant who sits the LNAT submits an essay”?',
      options: [
        'No law applicant who sits the LNAT submits an essay.',
        'At least one law applicant who sits the LNAT does not submit an essay.',
        'Every law applicant who submits an essay sits the LNAT.',
        'Some people who submit essays are not law applicants.',
      ],
      correctIndex: 1,
      explanation:
        'The negation of a universal statement (∀x, P(x) → Q(x)) is an existential counter-example (∃x, P(x) ∧ ¬Q(x)).',
    },
  },
];

export interface OfficialLnatResource {
  title: string;
  category: 'Simulator' | 'Past Papers' | 'Essays' | 'Reading Habit';
  description: string;
  url: string;
  badge: string;
}

export const OFFICIAL_LNAT_RESOURCES: OfficialLnatResource[] = [
  {
    title: 'Official LNAT Onscreen Tutorial',
    category: 'Simulator',
    description:
      'Walk through the exact Pearson VUE test-centre interface, flagging controls, Review screen, and 2026 “Pause the Clock” rest-break functionality.',
    url: 'https://lnat.ac.uk/lnat-tutorial',
    badge: 'Start here',
  },
  {
    title: 'Official LNAT Onscreen Sample Test',
    category: 'Simulator',
    description:
      'Full interactive onscreen simulation published by the LNAT Consortium—the gold standard for verifying what test-day screens look like.',
    url: 'https://lnat.ac.uk/lnat-Sample-Test',
    badge: 'Pearson VUE',
  },
  {
    title: 'Practice Test Papers 1 & 2 + Official Commentary',
    category: 'Past Papers',
    description:
      'Downloadable PDF/RTF practice papers alongside the official marking scheme and question-by-question commentary from LNAT.',
    url: 'https://lnat.ac.uk/how-to-prepare/practice-test/',
    badge: 'PDF + Marking',
  },
  {
    title: 'Official Sample Essays & Prompts',
    category: 'Essays',
    description:
      'Official Section B prompt list (judges, arts funding, compulsory voting, liberty vs. security) with sample answers and the 500–600 word target guidance.',
    url: 'https://lnat.ac.uk/how-to-prepare/sample-essays/',
    badge: 'Section B',
  },
  {
    title: 'LNAT Preparation & Daily Reading Guide',
    category: 'Reading Habit',
    description:
      'Why LNAT advises daily critical reading of quality newspapers over rote coaching—and the four analytical questions to ask every editorial.',
    url: 'https://lnat.ac.uk/how-to-prepare/',
    badge: 'Official Advice',
  },
];

export const OFFICIAL_FOUR_QUESTIONS = [
  {
    step: '01',
    question: 'What issues are being raised?',
    tip: 'Separate the surface topic (e.g. algorithms) from the contested normative claim (e.g. uniformity vs. contestable fairness).',
  },
  {
    step: '02',
    question: 'What assumptions are being made?',
    tip: 'Spot the unstated bridge between premise and conclusion—LNAT distractors often exploit hidden assumptions.',
  },
  {
    step: '03',
    question: 'What evidence supports which conclusion?',
    tip: 'Distinguish what the author endorses from what they merely attribute to critics or proponents.',
  },
  {
    step: '04',
    question: 'How would you frame a counterargument?',
    tip: 'Steelman the strongest objection to the passage—this directly trains both Section A tone questions and Section B essays.',
  },
];
