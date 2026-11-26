export type TestId = 'lnat' | 'ucat' | 'tara' | 'esat' | 'sat';

export interface PracticeQuestion {
  id: string;
  section: string;
  passage?: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface OfficialLink {
  label: string;
  url: string;
  note: string;
}

export interface AdmissionsTest {
  id: TestId;
  code: string;
  name: string;
  subject: string;
  universities: string;
  format: string;
  duration: string;
  scoreScale: string;
  officialSite: string;
  officialLinks: OfficialLink[];
  questions: PracticeQuestion[];
  writingPrompts?: string[];
}

export const ADMISSIONS_TESTS: AdmissionsTest[] = [
  {
    id: 'lnat',
    code: 'LNAT',
    name: 'National Admissions Test for Law',
    subject: 'Law',
    universities: 'Oxford, Cambridge, LSE, UCL, KCL, Durham, Bristol',
    format: 'Section A: 42 MCQs (12 passages) · Section B: 1 Essay',
    duration: '135 mins',
    scoreScale: '0–42 (Section A)',
    officialSite: 'https://lnat.ac.uk/',
    officialLinks: [
      { label: 'Official LNAT Website', url: 'https://lnat.ac.uk/', note: 'Registration, test centres, and dates' },
      { label: 'Pearson VUE LNAT Tutorial', url: 'https://lnat.ac.uk/lnat-tutorial', note: 'Exact on-screen exam interface' },
      { label: 'Official Practice Tests', url: 'https://lnat.ac.uk/how-to-prepare/practice-test/', note: 'Free official past passages and simulator' },
      { label: 'Official Sample Essays', url: 'https://lnat.ac.uk/how-to-prepare/sample-essays/', note: 'Annotated Section B scripts' },
    ],
    questions: [],
  },
  {
    id: 'ucat',
    code: 'UCAT',
    name: 'University Clinical Aptitude Test',
    subject: 'Medicine & Dentistry',
    universities: 'Oxford, Cambridge, Imperial, UCL, KCL, Edinburgh + 30 UK medical schools',
    format: 'Verbal Reasoning · Decision Making · Quantitative Reasoning · SJT',
    duration: '120 mins',
    scoreScale: '1200–2700 + SJT Band 1–4',
    officialSite: 'https://www.ucat.ac.uk/',
    officialLinks: [
      { label: 'Official UCAT Portal', url: 'https://www.ucat.ac.uk/', note: 'Booking, bursaries, and test format' },
      { label: 'UCAT Official Practice Tests', url: 'https://www.ucat.ac.uk/prepare/practice-tests/', note: 'Four full official timed mocks' },
      { label: 'UCAT Question Banks', url: 'https://www.ucat.ac.uk/prepare/question-banks/', note: 'Subtest drills in Pearson VUE layout' },
    ],
    questions: [
      {
        id: 'ucat-vr-1',
        section: 'Verbal Reasoning',
        passage:
          'Following the introduction of 20 mph speed limits across 14 Welsh towns, hospital admissions for pedestrian injuries fell by 18% within twelve months. Critics noted that rainfall was unusually high that winter, which historically reduces foot traffic.',
        prompt: 'Which statement is directly supported by the passage?',
        options: [
          '20 mph speed limits were the sole cause of the 18% drop in injuries.',
          'Pedestrian hospital admissions fell after the 20 mph limits were introduced, though critics cited higher rainfall as a possible factor.',
          'Foot traffic decreased by exactly 18% during the winter.',
          'The policy had no measurable impact on driver speeds.',
        ],
        correctIndex: 1,
        explanation:
          'Only B sticks strictly to what is stated: admissions fell by 18% after the change, and critics pointed to unusually high winter rainfall.',
      },
      {
        id: 'ucat-dm-1',
        section: 'Decision Making',
        prompt:
          'All patients on Ward C receive an ECG on admission. Some patients who receive an ECG are referred to Cardiology. No patient on Ward C is under 18. Which conclusion MUST follow?',
        options: [
          'Some patients on Ward C are referred to Cardiology.',
          'No patient under 18 is on Ward C, and every patient on Ward C receives an ECG.',
          'All patients referred to Cardiology are over 18.',
          'Every patient who receives an ECG is on Ward C.',
        ],
        correctIndex: 1,
        explanation:
          'Statements 1 and 3 directly guarantee B. We cannot know whether the “some” referred to Cardiology overlap with Ward C.',
      },
      {
        id: 'ucat-qr-1',
        section: 'Quantitative Reasoning',
        prompt:
          'A clinic sees 240 patients in Week 1. In Week 2, attendance rises by 15%. If 1 in 6 patients in Week 2 require a blood test, how many blood tests are carried out in Week 2?',
        options: ['40', '44', '46', '48'],
        correctIndex: 2,
        explanation: '240 × 1.15 = 276 patients in Week 2. 276 ÷ 6 = 46 blood tests.',
      },
      {
        id: 'ucat-sjt-1',
        section: 'Situational Judgement',
        prompt:
          'You are a medical student on placement. A junior doctor asks you to take blood from a patient unsupervised, even though you have not yet been signed off as competent to do so alone. What is the most appropriate response?',
        options: [
          'Attempt the procedure carefully so you do not slow down the ward.',
          'Politely explain that you are not yet signed off to perform venepuncture unsupervised and ask if they or a nurse can supervise you.',
          'Refuse without explanation and leave the ward.',
          'Ask another unsigned medical student to watch you do it.',
        ],
        correctIndex: 1,
        explanation:
          'Patient safety comes first: being honest about your competence limits while offering a constructive supervised solution is Band 1.',
      },
    ],
  },
  {
    id: 'tara',
    code: 'TARA',
    name: 'Test of Academic Reasoning for Admissions',
    subject: 'Academic Reasoning (Oxford & UCL)',
    universities: 'University of Oxford, UCL (selected courses)',
    format: 'Critical Thinking (22 Qs) · Problem Solving (22 Qs) · Writing Task (1 of 3)',
    duration: '120 mins (3 × 40m)',
    scoreScale: '1.0–9.0 per MCQ module',
    officialSite: 'https://esat-tmua.ac.uk/about-the-tests/tara/',
    officialLinks: [
      { label: 'Official TARA Overview (UAT-UK)', url: 'https://esat-tmua.ac.uk/about-the-tests/tara/', note: 'Modules, scoring, and sitting dates' },
      { label: 'TARA Preparation Materials', url: 'https://esat-tmua.ac.uk/tara-preparation-materials/', note: 'Official specification and Pearson VUE practice tests' },
    ],
    questions: [
      {
        id: 'tara-ct-1',
        section: 'Critical Thinking',
        passage:
          'Universities that dropped compulsory first-year attendance checks saw lecture attendance fall by 22%, yet average exam scores remained unchanged. Therefore, attending lectures contributes nothing to student learning.',
        prompt: 'Which best identifies the flaw in the argument?',
        options: [
          'It ignores that students who skipped lectures may have compensated with recorded lectures or independent study.',
          'It uses a percentage rather than raw student numbers.',
          'It assumes all university subjects use exams.',
          'It fails to survey lecturers about attendance.',
        ],
        correctIndex: 0,
        explanation:
          'Unchanged exam scores do not prove lectures contribute nothing — students may have replaced live attendance with recordings or extra reading.',
      },
      {
        id: 'tara-ct-2',
        section: 'Critical Thinking',
        passage:
          'Every city that has banned cars from its historic centre has seen retail footfall rise within three years. Our town wants to revive its high street, so pedestrianising the centre will guarantee higher shop revenues.',
        prompt: 'Which unstated assumption does the conclusion rely on?',
        options: [
          'Higher footfall translates into higher spending at local shops.',
          'Drivers prefer shopping online.',
          'Pedestrianisation is inexpensive to construct.',
          'Bus routes will remain unchanged.',
        ],
        correctIndex: 0,
        explanation:
          'The premise is about footfall (people walking past), while the conclusion leaps to shop revenues (money spent).',
      },
      {
        id: 'tara-ps-1',
        section: 'Problem Solving',
        prompt:
          'A library charges £0.35 per day for the first 4 days a book is overdue, and £0.60 per day thereafter. Maya returns a book late and pays £4.40. How many days overdue was the book?',
        options: ['7 days', '8 days', '9 days', '10 days'],
        correctIndex: 2,
        explanation: 'First 4 days = 4 × £0.35 = £1.40. Remaining £3.00 ÷ £0.60 = 5 more days. Total = 9 days.',
      },
      {
        id: 'tara-ps-2',
        section: 'Problem Solving',
        prompt:
          'Two trains leave stations 210 km apart at the same time, heading towards each other at 80 km/h and 60 km/h. How long until they meet?',
        options: ['1 hour 15 mins', '1 hour 30 mins', '1 hour 45 mins', '2 hours'],
        correctIndex: 1,
        explanation: 'Combined closing speed = 80 + 60 = 140 km/h. Time = 210 ÷ 140 = 1.5 hours (1 hour 30 mins).',
      },
    ],
    writingPrompts: [
      '“Public funding for universities should prioritise subjects with measurable economic returns.” To what extent do you agree?',
      '“Technological progress solves old inequalities only by creating new ones.” Discuss.',
      'Should democratic governments restrict speech that spreads demonstrably false scientific claims?',
    ],
  },
  {
    id: 'esat',
    code: 'ESAT',
    name: 'Engineering and Science Admissions Test',
    subject: 'Engineering & Natural Sciences',
    universities: 'Cambridge, Imperial College London, UCL',
    format: 'Mathematics 1 (compulsory) + 2 chosen from Maths 2, Physics, Chemistry, Biology',
    duration: '120 mins (3 × 40m)',
    scoreScale: '1.0–9.0 per module',
    officialSite: 'https://esat-tmua.ac.uk/',
    officialLinks: [
      { label: 'Official ESAT Portal (UAT-UK)', url: 'https://esat-tmua.ac.uk/', note: 'Registration, dates, and module requirements' },
      { label: 'ESAT Preparation Materials', url: 'https://esat-tmua.ac.uk/esat-preparation-materials/', note: 'Official specifications and practice papers' },
    ],
    questions: [
      {
        id: 'esat-m1-1',
        section: 'Mathematics 1',
        prompt: 'If 2^(2x) − 5 · 2^x + 4 = 0, what is the sum of all real solutions for x?',
        options: ['1', '2', '3', '4'],
        correctIndex: 1,
        explanation: 'Let u = 2^x. Then (u − 1)(u − 4) = 0, so u = 1 (x = 0) or u = 4 (x = 2). Sum = 0 + 2 = 2.',
      },
      {
        id: 'esat-p-1',
        section: 'Physics',
        prompt:
          'A ball is thrown vertically upwards at 20 m/s (take g = 10 m/s², ignore air resistance). What is the maximum height reached?',
        options: ['10 m', '20 m', '40 m', '200 m'],
        correctIndex: 1,
        explanation: 'Using v² = u² + 2as: 0 = 400 − 20s ⇒ s = 20 m.',
      },
      {
        id: 'esat-c-1',
        section: 'Chemistry',
        prompt:
          'What volume of 0.50 mol/dm³ HCl is required to completely neutralise 25.0 cm³ of 0.20 mol/dm³ Na₂CO₃? (Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂)',
        options: ['10.0 cm³', '20.0 cm³', '25.0 cm³', '50.0 cm³'],
        correctIndex: 1,
        explanation:
          'Moles Na₂CO₃ = 0.025 × 0.20 = 0.005 mol. Moles HCl needed = 2 × 0.005 = 0.010 mol. Volume = 0.010 / 0.50 = 0.020 dm³ = 20.0 cm³.',
      },
      {
        id: 'esat-m2-1',
        section: 'Mathematics 2',
        prompt: 'Find the derivative of f(x) = x² · e^(3x) at x = 0.',
        options: ['0', '1', '3', '6'],
        correctIndex: 0,
        explanation: 'f′(x) = 2x·e^(3x) + 3x²·e^(3x). At x = 0, both terms are 0.',
      },
    ],
  },
  {
    id: 'sat',
    code: 'SAT',
    name: 'Digital SAT',
    subject: 'US & Global Undergraduate',
    universities: 'US Ivy League, MIT, Stanford, and global universities',
    format: 'Reading & Writing (64m, 54 Qs) · Math (70m, 44 Qs)',
    duration: '134 mins',
    scoreScale: '400–1600',
    officialSite: 'https://satsuite.collegeboard.org/sat',
    officialLinks: [
      { label: 'College Board Digital SAT', url: 'https://satsuite.collegeboard.org/sat', note: 'Test dates, registration, and scoring' },
      { label: 'Bluebook Official Practice', url: 'https://satsuite.collegeboard.org/practice/practice-tests/bluebook', note: 'Full-length adaptive digital practice tests' },
      { label: 'Khan Academy Official SAT Prep', url: 'https://www.khanacademy.org/digital-sat', note: 'Free official College Board partner drills' },
    ],
    questions: [
      {
        id: 'sat-rw-1',
        section: 'Reading & Writing',
        passage:
          'Architects restoring the 19th-century conservatory initially feared that replacing its hand-blown glass panes with modern laminated panels would alter the building’s acoustic warmth; _______, acoustic testing revealed that reverberation times changed by less than two percent.',
        prompt: 'Which choice completes the text with the most logical transition?',
        options: ['consequently', 'furthermore', 'however', 'for instance'],
        correctIndex: 2,
        explanation: 'The second clause contrasts with the architects’ initial fear, so “however” is the only logical transition.',
      },
      {
        id: 'sat-rw-2',
        section: 'Reading & Writing',
        passage:
          'Marine biologists tracking coral larvae in Belize observed that larvae settled three times faster on reefs where healthy snapping-shrimp choruses were played through underwater speakers than on silent degraded reefs.',
        prompt: 'Which finding, if true, would most directly support the hypothesis that acoustic cues guide coral recovery?',
        options: [
          'Water temperatures were identical across both the speaker-equipped reefs and the silent reefs.',
          'Snapping shrimp live exclusively in shallow coastal waters.',
          'Coral reefs in Belize are older than reefs in Florida.',
          'Underwater speakers require regular battery replacement.',
        ],
        correctIndex: 0,
        explanation: 'Ruling out temperature differences isolates sound as the variable driving faster settlement.',
      },
      {
        id: 'sat-m-1',
        section: 'Math',
        prompt: 'If 3(2x − 5) = 4x + 7, what is the value of x?',
        options: ['6', '9', '11', '14'],
        correctIndex: 2,
        explanation: '6x − 15 = 4x + 7 ⇒ 2x = 22 ⇒ x = 11.',
      },
      {
        id: 'sat-m-2',
        section: 'Math',
        prompt:
          'A quadratic function f(x) = a(x − 3)² + 5 has a minimum value of 5 and passes through (5, 13). What is the value of a?',
        options: ['1', '2', '3', '4'],
        correctIndex: 1,
        explanation: 'Substitute (5, 13): 13 = a(5 − 3)² + 5 ⇒ 8 = 4a ⇒ a = 2.',
      },
    ],
  },
];

export const TEST_BY_ID: Record<TestId, AdmissionsTest> = ADMISSIONS_TESTS.reduce(
  (acc, t) => {
    acc[t.id] = t;
    return acc;
  },
  {} as Record<TestId, AdmissionsTest>
);
