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
  category: 'Practice Tests' | 'Past Papers' | 'Guide' | 'Spec' | 'Portal';
  note: string;
}

export interface PastPaperRow {
  year: string;
  items: { label: string; url: string }[];
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
  officialAdvice: string[];
  officialLinks: OfficialLink[];
  pastPapersTitle?: string;
  pastPapers?: PastPaperRow[];
  questions: PracticeQuestion[];
  writingPrompts?: string[];
}

export const ADMISSIONS_TESTS: AdmissionsTest[] = [
  {
    id: 'lnat',
    code: 'LNAT',
    name: 'National Admissions Test for Law',
    subject: 'Law',
    universities: 'Oxford, Cambridge, LSE, UCL, KCL, Durham, Bristol, Glasgow, SOAS, SUSS, IE',
    format: 'Section A: 42 MCQs (12 passages, 95m) · Section B: 1 of 3 Essays (40m)',
    duration: '135 mins',
    scoreScale: '0–42 (Section A) · Essay sent to universities',
    officialSite: 'https://lnat.ac.uk/',
    officialAdvice: [
      'Section A: 95 min, 42 MCQs across 12 passages (no negative marking). Once Section B begins you cannot return to Section A.',
      'Section B: 40 min, 1 of 3 prompts. Aim for 500–600 words (recommended max 750 words); defend a clear position with plain, economical prose.',
      'Fee: £75 UK/EU (£120 outside EU); full £75 bursary available for eligible UK/EU candidates. Sat once per admissions cycle.',
      'Read daily quality newspapers (Economist, FT, Guardian, Times, NYT) and test assumptions, evidence, and counter-arguments.',
    ],
    officialLinks: [
      {
        label: 'Official On-Screen Sample Test Simulator',
        url: 'https://lnat.ac.uk/lnat-Sample-Test',
        category: 'Practice Tests',
        note: 'Unlimited attempts mirroring the Pearson VUE test centre interface',
      },
      {
        label: 'Pearson VUE Online Tutorial (2026 Controls)',
        url: 'https://lnat.ac.uk/lnat-tutorial',
        category: 'Guide',
        note: 'Walkthrough of on-screen highlighting, flagging, and Pause the Clock controls',
      },
      {
        label: 'Official Practice Tests Hub',
        url: 'https://lnat.ac.uk/how-to-prepare/practice-test/',
        category: 'Practice Tests',
        note: 'Official PDF and RTF practice papers plus simulator links',
      },
      {
        label: 'Your Guide to Preparing for the LNAT (PDF)',
        url: 'https://lnat.ac.uk/wp-content/uploads/2014/05/Your-Guide-To-Preparing-For-The-LNAT.pdf',
        category: 'Guide',
        note: 'Official LNAT Consortium preparation handbook with worked MCQ rationales',
      },
      {
        label: 'Official Sample Essays & Examiner Scripts',
        url: 'https://lnat.ac.uk/how-to-prepare/sample-essays/',
        category: 'Guide',
        note: '9 official prompts plus annotated sample answers (arts, species, political correctness)',
      },
      {
        label: 'Official Hints & Tips',
        url: 'https://lnat.ac.uk/how-to-prepare/hints-and-tips/',
        category: 'Guide',
        note: 'MCQ and essay strategy direct from LNAT Consortium',
      },
      {
        label: 'Test Format & Results',
        url: 'https://lnat.ac.uk/what-is-lnat/test-format/',
        category: 'Spec',
        note: 'Exact timing, scoring, and mid-Feb / mid-Aug score release schedule',
      },
      {
        label: '2026–27 Dates, Deadlines & Registration',
        url: 'https://lnat.ac.uk/registration/dates-and-deadlines/',
        category: 'Portal',
        note: 'Oxbridge (15 Oct), KCL/LSE/UCL (31 Dec), Bristol/Durham (13 Jan), others (25 Jan)',
      },
      {
        label: 'Bursary & Access Arrangements',
        url: 'https://lnat.ac.uk/registration/bursary/',
        category: 'Portal',
        note: '£75 fee waiver and up to 25% extra time / rest-break applications',
      },
      {
        label: 'On Test Day & ID Rules',
        url: 'https://lnat.ac.uk/on-test-day/',
        category: 'Portal',
        note: 'What to bring and Pearson VUE centre check-in requirements',
      },
    ],
    pastPapersTitle: 'Official LNAT Downloadable Papers & Sample Answers (PDF)',
    pastPapers: [
      {
        year: 'Papers',
        items: [
          { label: 'Practice Paper 1', url: 'https://lnat.ac.uk/wp-content/uploads/2014/05/Practice-Test-2010-paper-1.pdf' },
          { label: 'Practice Paper 2', url: 'https://lnat.ac.uk/wp-content/uploads/2014/05/Practice-Test-2010-paper-2.pdf' },
          { label: 'Mark Scheme', url: 'https://lnat.ac.uk/wp-content/uploads/2014/05/Practice-Tests-2010-mark-scheme.pdf' },
          { label: 'Examiner Commentary', url: 'https://lnat.ac.uk/wp-content/uploads/2014/05/Practice-Tests-2010-Commentary.pdf' },
        ],
      },
      {
        year: 'Essays',
        items: [
          { label: 'Arts Funding Sample', url: 'https://lnat.ac.uk/wp-content/uploads/2014/04/sample_arts.pdf' },
          { label: 'Species Extinction Sample', url: 'https://lnat.ac.uk/wp-content/uploads/2014/04/sample_species.pdf' },
          { label: 'Political Correctness Sample', url: 'https://lnat.ac.uk/wp-content/uploads/2014/04/sample_political.pdf' },
        ],
      },
    ],
    questions: [],
  },
  {
    id: 'ucat',
    code: 'UCAT',
    name: 'University Clinical Aptitude Test',
    subject: 'Medicine & Dentistry',
    universities: 'Oxford, Cambridge, Imperial, UCL, KCL, Edinburgh + 30 UK medical schools',
    format: 'VR (44 Qs, 22m) · DM (35 Qs, 37m) · QR (36 Qs, 26m) · SJT (69 Qs, 26m)',
    duration: '120 mins',
    scoreScale: '900–2700 (300–900 × 3) + SJT Band 1–4',
    officialSite: 'https://www.ucat.ac.uk/',
    officialAdvice: [
      'Official 5-step path: (1) Prep checklist → (2) Tour Tutorial → (3) Question Tutorials → (4) Official Question Banks → (5) Timed Mocks A–D in the final week.',
      'No negative marking; 2026 mean total was 1918 (8th decile 2140, 9th decile 2250). Fee: £70 UK (£115 outside UK); UK bursary available.',
      'Pearson VUE practice tests are desktop-only and do not save scores — log your mock scores in Ratio to track progress.',
    ],
    officialLinks: [
      {
        label: 'Official Pearson VUE Tour Tutorial',
        url: 'https://www.ucat.ac.uk/umbraco/surface/pearsonpracticetest/launch/UK_Tour_Tutorial',
        category: 'Practice Tests',
        note: 'Learn the on-screen calculator, flagging, and Alt+letter keyboard shortcuts',
      },
      {
        label: 'Official Practice Tests & Question Banks',
        url: 'https://www.ucat.ac.uk/prepare/practice-tests/',
        category: 'Practice Tests',
        note: '4 full mocks (A–D, standard / 25% extra / untimed) + all 4 subtest banks',
      },
      {
        label: 'Official Question Tutorials (Strategy Decks)',
        url: 'https://www.ucat.ac.uk/prepare/question-tutorials/',
        category: 'Guide',
        note: 'Worked examples for VR, DM, QR, and SJT direct from UCAT Consortium',
      },
      {
        label: 'Official Preparation Checklist (PDF)',
        url: 'https://www.ucat.ac.uk/media/1711/prep-plan-5.pdf',
        category: 'Guide',
        note: 'UCAT’s 5-step study roadmap',
      },
      {
        label: 'Test Format & Scoring',
        url: 'https://www.ucat.ac.uk/about-ucat/test-format-and-scoring/',
        category: 'Spec',
        note: 'Subtest timings, partial marking on DM/SJT, and 900–2700 scaling',
      },
      {
        label: 'Official Test Statistics & Decile Lookup',
        url: 'https://www.ucat.ac.uk/results/test-statistics/',
        category: 'Spec',
        note: '2026 deciles (mean 1918, 9th decile 2250) and percentile tool',
      },
      {
        label: 'How Universities Use the UCAT',
        url: 'https://www.ucat.ac.uk/results/how-universities-use-the-ucat/',
        category: 'Portal',
        note: 'Thresholds, subtest cut-offs, and weighting by UK medical school',
      },
      {
        label: 'Advice from Top-3% Past Candidates',
        url: 'https://www.ucat.ac.uk/candidate-advice/advice-from-past-candidates/',
        category: 'Guide',
        note: 'Strategies from high scorers who relied solely on free official materials',
      },
      {
        label: 'UCAT Essentials, Dates, Booking & Bursaries',
        url: 'https://www.ucat.ac.uk/about-ucat/ucat-essentials/',
        category: 'Portal',
        note: 'Registration, test dates, access arrangements, and test-day ID rules',
      },
    ],
    pastPapersTitle: 'Direct Pearson VUE Official Mock Launchers (Desktop)',
    pastPapers: [
      {
        year: 'Mocks',
        items: [
          { label: 'Practice Test A', url: 'https://www.ucat.ac.uk/umbraco/surface/pearsonpracticetest/launch/UK_PT_A' },
          { label: 'Practice Test B', url: 'https://www.ucat.ac.uk/umbraco/surface/pearsonpracticetest/launch/UK_PT_B' },
          { label: 'Practice Test C', url: 'https://www.ucat.ac.uk/umbraco/surface/pearsonpracticetest/launch/UK_PT_C' },
          { label: 'Practice Test D', url: 'https://www.ucat.ac.uk/umbraco/surface/pearsonpracticetest/launch/UK_PT_D' },
        ],
      },
      {
        year: 'Banks',
        items: [
          { label: 'VR Bank 1', url: 'https://www.ucat.ac.uk/umbraco/surface/pearsonpracticetest/launch/UK_QB_VR_1' },
          { label: 'DM Bank 1', url: 'https://www.ucat.ac.uk/umbraco/surface/pearsonpracticetest/launch/UK_QB_DM_1' },
          { label: 'QR Bank 1', url: 'https://www.ucat.ac.uk/umbraco/surface/pearsonpracticetest/launch/UK_QB_QR_1' },
          { label: 'SJT Bank 1', url: 'https://www.ucat.ac.uk/umbraco/surface/pearsonpracticetest/launch/UK_QB_SJT_1' },
        ],
      },
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
    subject: 'Academic Reasoning',
    universities: 'Oxford (PPE, E&M, Psych, History & Politics) · UCL (CS, Mech Eng, Robotics)',
    format: 'Critical Thinking (22 Qs, 40m) · Problem Solving (22 Qs, 40m) · Writing Task (40m, max 750w)',
    duration: '120 mins',
    scoreScale: '1.0–9.0 per MCQ module · Writing sent to universities',
    officialSite: 'https://esat-tmua.ac.uk/about-the-tests/tara/',
    officialAdvice: [
      'Three separately timed 40-minute modules (no time carry-over, no going back, no calculator or dictionary, no negative marking).',
      '2027 entry sittings: 12–16 Oct 2026 (all Oxford applicants) and 4–8 Jan 2027 (UCL). Fee: £78 UK/Ireland (£133 elsewhere); UK bursaries available.',
      'UAT-UK provides official Pearson VUE Specimen & Sample tests plus historic TSA Section 1 and BMAT Section 1 papers for extra CT/PS practice.',
    ],
    officialLinks: [
      {
        label: 'Official TARA Overview (UAT-UK)',
        url: 'https://esat-tmua.ac.uk/about-the-tests/tara/',
        category: 'Portal',
        note: 'Format, sitting dates, fees, and scoring',
      },
      {
        label: 'TARA Content Specification (PDF)',
        url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2026/06/08142350/TARA_Content_Specification.pdf',
        category: 'Spec',
        note: 'Full syllabus for Critical Thinking, Problem Solving, and Writing Task',
      },
      {
        label: 'TARA Question Guide (PDF)',
        url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2026/06/08142344/TARA_Question_Guide.pdf',
        category: 'Guide',
        note: 'Worked examples of all 7 CT types, 3 PS types, and Writing Task rubric',
      },
      {
        label: 'Pearson VUE UAT-UK Portal',
        url: 'https://www.pearsonvue.com/us/en/uatuk.html',
        category: 'Practice Tests',
        note: 'Booking and official online specimen/sample test player',
      },
      {
        label: 'TARA Preparation Materials (Full TSA & BMAT Archive)',
        url: 'https://esat-tmua.ac.uk/tara-preparation-materials/',
        category: 'Past Papers',
        note: 'Full 2008–2023 TSA S1 and 2003–2023 BMAT S1 past papers on UAT-UK',
      },
      {
        label: '2027 Entry Course List (PDF)',
        url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2026/04/01172717/Course_List_2027_Entry_Final.pdf',
        category: 'Spec',
        note: 'Exact Oxford and UCL courses requiring TARA',
      },
      {
        label: 'Test Admission & ID Policy 2027 (PDF)',
        url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2026/04/01120017/UAT-UK-Test-Admission-and-ID-Policy-2027-Entry.pdf',
        category: 'Portal',
        note: 'Official Pearson VUE test-day ID rules',
      },
    ],
    pastPapersTitle: 'Official Pearson VUE TARA Tests & Recent TSA / BMAT Papers',
    pastPapers: [
      {
        year: 'Pearson',
        items: [
          { label: 'CT Specimen', url: 'https://www.pearsonvue.com/us/en/redirects/uatuk/tara-ct-s.html' },
          { label: 'CT Sample', url: 'https://www.pearsonvue.com/us/en/redirects/uatuk/tara-ct-p.html' },
          { label: 'PS Specimen', url: 'https://www.pearsonvue.com/us/en/redirects/uatuk/tara-ps-s.html' },
          { label: 'PS Sample', url: 'https://www.pearsonvue.com/us/en/redirects/uatuk/tara-ps-p.html' },
          { label: 'Writing Specimen', url: 'https://www.pearsonvue.com/us/en/redirects/uatuk/tara-wt-s.html' },
          { label: 'Writing Sample', url: 'https://www.pearsonvue.com/us/en/redirects/uatuk/tara-wt-p.html' },
        ],
      },
      {
        year: '2023',
        items: [
          { label: 'TSA S1 Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2026/06/01154243/TSA-2023-Section-1-Question-Paper.pdf' },
          { label: 'TSA S1 Key', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2026/06/01154237/TSA-2023-Section-1-Answer-Key.pdf' },
          { label: 'BMAT S1 Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2025/08/06104326/BMAT-2023-Section-1-Question-Paper.pdf' },
          { label: 'BMAT S1 Key', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2025/08/06104323/BMAT-2023-Section-1-Answer-Key.pdf' },
        ],
      },
      {
        year: '2022',
        items: [
          { label: 'TSA S1 Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2026/06/01154234/TSA-2022-Section-1-Question-Paper.pdf' },
          { label: 'TSA S1 Key', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2026/06/01154228/TSA-2022-Section-1-Answer-Key.pdf' },
          { label: 'BMAT S1 Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2025/08/06104321/BMAT-2022-Section-1-Question-Paper.pdf' },
          { label: 'BMAT S1 Key', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2025/08/06104317/BMAT-2022-Section-1-Answer-Key.pdf' },
        ],
      },
      {
        year: '2021',
        items: [
          { label: 'TSA S1 Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2026/06/01154225/TSA-2021-Section-1-Question-Paper.pdf' },
          { label: 'TSA S1 Key', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2026/06/01154220/TSA-2021-Section-1-Answer-Key.pdf' },
          { label: 'BMAT S1 Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2025/08/06104316/BMAT-2021-Section-1-Question-Paper.pdf' },
          { label: 'BMAT S1 Key', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2025/08/06104313/BMAT-2021-Section-1-Answer-Key.pdf' },
        ],
      },
      {
        year: '2020',
        items: [
          { label: 'TSA S1 Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2026/06/01154218/TSA-2020-Section-1-Question-Paper.pdf' },
          { label: 'TSA Explained', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2026/06/01154212/TSA-2020-Section-1-Explained-Answers.pdf' },
          { label: 'BMAT S1 Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2025/08/06104312/BMAT-2020-Section-1-Question-Paper.pdf' },
          { label: 'BMAT S1 Key', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2025/08/06104308/BMAT-2020-Section-1-Answer-Key.pdf' },
        ],
      },
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
    subject: 'Engineering & Science',
    universities: 'Cambridge, Imperial College London, UCL',
    format: 'Mathematics 1 (compulsory, 27 Qs, 40m) + 2 chosen from Maths 2, Physics, Chemistry, Biology (27 Qs, 40m each)',
    duration: '120 mins',
    scoreScale: '1.0–9.0 per module (median 4.5, 90th pct 7.0)',
    officialSite: 'https://esat-tmua.ac.uk/about-the-tests/esat-test/',
    officialAdvice: [
      'Each module has 27 multiple-choice questions in 40 minutes, with no calculator, no dictionary, and no negative marking.',
      'Score scale is 1.0–9.0 per module (cohort median 4.5, 90th percentile 7.0). Fee: £78 UK/Ireland (£133 elsewhere); UK bursaries available.',
      '2027 entry sittings: 12–16 Oct 2026 (required for Oxford/Cambridge) and 4–8 Jan 2027. One sitting per cycle.',
      'UAT-UK provides every preparation guide, Pearson VUE specimen/practice test, and annotated ENGAA/NSAA past paper free of charge.',
    ],
    officialLinks: [
      {
        label: 'Official ESAT Overview (UAT-UK)',
        url: 'https://esat-tmua.ac.uk/about-the-tests/esat-test/',
        category: 'Portal',
        note: 'Sitting dates, required modules by course, and registration',
      },
      {
        label: 'Register & Pearson VUE Specimen / Practice Tests',
        url: 'https://www.pearsonvue.com/us/en/uatuk.html',
        category: 'Practice Tests',
        note: 'Official Pearson VUE booking portal and timed on-screen sample tests',
      },
      {
        label: 'ESAT Preparation Materials Hub',
        url: 'https://esat-tmua.ac.uk/esat-preparation-materials/',
        category: 'Guide',
        note: 'All official ESAT subject guides and historic paper links',
      },
      {
        label: 'ESAT Content Specification (PDF)',
        url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/03165424/ESAT_Content_Specification.pdf',
        category: 'Spec',
        note: 'Full syllabus for Maths 1, Maths 2, Physics, Chemistry, and Biology',
      },
      {
        label: 'ESAT Guide — Mathematics 1 (PDF)',
        url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2026/06/30103534/ESAT_Guide_Mathematics_1.pdf',
        category: 'Guide',
        note: 'Official compulsory Mathematics 1 study notes',
      },
      {
        label: 'ESAT Guide — Mathematics 2 (PDF)',
        url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2026/06/30103537/Notes_on_Mathematics_-for_TMUA_and_ESAT_M2.pdf',
        category: 'Guide',
        note: 'Official Notes on Mathematics for TMUA and ESAT M2',
      },
      {
        label: 'ESAT Guide — Physics (PDF)',
        url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2026/06/30103558/ESAT_Guide_Physics.pdf',
        category: 'Guide',
        note: 'Official Physics module guide',
      },
      {
        label: 'ESAT Guide — Chemistry (PDF)',
        url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2025/06/25103142/ESAT_GUIDE_Chemistry_June2025.pdf',
        category: 'Guide',
        note: 'Official Chemistry module guide',
      },
      {
        label: 'ESAT Guide — Biology (PDF)',
        url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2025/07/06120052/ESAT_Guide_Biology_June_2025.pdf',
        category: 'Guide',
        note: 'Official Biology module guide',
      },
      {
        label: 'Course List 2027 Entry (PDF)',
        url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2026/04/01172717/Course_List_2027_Entry_Final.pdf',
        category: 'Spec',
        note: 'Which university courses require ESAT and which modules they mandate',
      },
      {
        label: 'Candidate Handbook 2027 Entry (PDF)',
        url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2026/06/26111813/Candidate-Handbook-2027-Entry.pdf',
        category: 'Guide',
        note: 'Complete official candidate rules and procedures',
      },
      {
        label: 'Key Dates, Scoring, Bursaries & Access Arrangements',
        url: 'https://esat-tmua.ac.uk/deadlines/',
        category: 'Portal',
        note: 'Booking deadlines (Oct 2026 & Jan 2027), bursaries, and test-day ID rules',
      },
    ],
    pastPapersTitle: 'Official ENGAA & NSAA Section 1 Archive (2016–2023)',
    pastPapers: [
      {
        year: '2023',
        items: [
          { label: 'ENGAA Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07115605/ENGAA_2023_S1_QuestionPaper.pdf' },
          { label: 'ENGAA Key', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07115610/ENGAA_2023_S1_AnswerKey.pdf' },
          { label: 'NSAA Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07120523/NSAA_2023_S1_QuestionPaper.pdf' },
          { label: 'NSAA Key', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07120531/NSAA_2023_S1_AnswerKey.pdf' },
        ],
      },
      {
        year: '2022',
        items: [
          { label: 'ENGAA Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07115611/ENGAA_2022_S1_QuestionPaper.pdf' },
          { label: 'ENGAA Key', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07115612/ENGAA_2022_S1_AnswerKey.pdf' },
          { label: 'NSAA Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07120525/NSAA_2022_S1_QuestionPaper.pdf' },
          { label: 'NSAA Key', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07120531/NSAA_2022_S1_AnswerKey.pdf' },
        ],
      },
      {
        year: '2021',
        items: [
          { label: 'ENGAA Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07115611/ENGAA_2021_S1_QuestionPaper.pdf' },
          { label: 'ENGAA Key', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07115613/ENGAA_2021_S1_AnswerKey.pdf' },
          { label: 'NSAA Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07120532/NSAA_2021_S1_QuestionPaper.pdf' },
          { label: 'NSAA Key', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07120532/NSAA_2021_S1_AnswerKey.pdf' },
        ],
      },
      {
        year: '2020',
        items: [
          { label: 'ENGAA Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07115613/ENGAA_2020_S1_QuestionPaper.pdf' },
          { label: 'ENGAA Key', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07115614/ENGAA_2020_S1_AnswerKey.pdf' },
          { label: 'NSAA Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07120533/NSAA_2020_S1_QuestionPaper.pdf' },
          { label: 'NSAA Key', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07120535/NSAA_2020_S1_AnswerKey.pdf' },
        ],
      },
      {
        year: '2019',
        items: [
          { label: 'ENGAA Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07115511/ENGAA_2019_S1_QuestionPaper.pdf' },
          { label: 'ENGAA Key', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07115515/ENGAA_2019_S1_AnswerKey.pdf' },
          { label: 'NSAA Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07120534/NSAA_2019_S1_QuestionPaper.pdf' },
          { label: 'NSAA Key', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07120535/NSAA_2019_S1_AnswerKey.pdf' },
        ],
      },
      {
        year: '2018',
        items: [
          { label: 'ENGAA Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07113017/ENGAA_2018_S1_QuestionPaper.pdf' },
          { label: 'ENGAA Key', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07113023/ENGAA_2018_S1_AnswerKey.pdf' },
          { label: 'NSAA Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07120537/NSAA_2018_S1_QuestionPaper.pdf' },
          { label: 'NSAA Key', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07120537/NSAA_2018_S1_AnswerKey.pdf' },
        ],
      },
      {
        year: '2017',
        items: [
          { label: 'ENGAA Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07112231/ENGAA_2017_S1_QuestionPaper.pdf' },
          { label: 'ENGAA Key', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07112228/ENGAA_2017_S1_AnswerKey.pdf' },
          { label: 'NSAA Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07120538/NSAA_2017_S1_QuestionPaper.pdf' },
          { label: 'NSAA Key', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07120538/NSAA_2017_S1_AnswerKey.pdf' },
        ],
      },
      {
        year: '2016',
        items: [
          { label: 'ENGAA Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07112055/ENGAA_2016_S1_QuestionPaper.pdf' },
          { label: 'ENGAA Key', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07112109/ENGAA_2016_S1_AnswerKey.pdf' },
          { label: 'NSAA Paper', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07120539/NSAA_2016_S1_QuestionPaper.pdf' },
          { label: 'NSAA Key', url: 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/07120540/NSAA_2016_S1_AnswerKey.pdf' },
        ],
      },
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
    universities: 'Ivy League, MIT, Stanford, and global universities',
    format: 'Reading & Writing (54 Qs, 64m, 2 adaptive modules) · Math (44 Qs, 70m, 2 adaptive modules)',
    duration: '134 mins',
    scoreScale: '400–1600 (adaptive)',
    officialSite: 'https://satsuite.collegeboard.org/sat',
    officialAdvice: [
      'Take full-length adaptive practice tests in College Board’s free Bluebook app — module 2 difficulty adapts to your module 1 performance.',
      'Drill specific domains and skills in the official Student Question Bank and Khan Academy partner course.',
      'Review Bluebook results in My Practice to unlock explanations and tailored follow-up practice.',
    ],
    officialLinks: [
      {
        label: 'Bluebook Full-Length Adaptive Practice Tests',
        url: 'https://satsuite.collegeboard.org/practice/practice-tests/bluebook',
        category: 'Practice Tests',
        note: 'Free timed, scored adaptive full-length tests + interface preview',
      },
      {
        label: 'Download Bluebook App',
        url: 'https://bluebook.collegeboard.org/students/download-bluebook',
        category: 'Practice Tests',
        note: 'Official College Board testing app for desktop and tablet',
      },
      {
        label: 'Official Student Question Bank',
        url: 'https://satsuite.collegeboard.org/practice/student-question-bank',
        category: 'Practice Tests',
        note: 'Filter official questions by section, domain, skill, and difficulty',
      },
      {
        label: 'Official SAT Prep on Khan Academy',
        url: 'https://satsuite.collegeboard.org/practice/khan-academy',
        category: 'Guide',
        note: 'Free official College Board partner lessons and worked examples',
      },
      {
        label: 'My Practice (Score Review & Explanations)',
        url: 'https://satsuite.collegeboard.org/practice/my-practice-101',
        category: 'Portal',
        note: 'Review Bluebook answers, rationales, and tailored practice sets',
      },
      {
        label: 'Digital SAT Sample Questions & Explanations (PDF)',
        url: 'https://satsuite.collegeboard.org/media/pdf/digital-sat-sample-questions.pdf',
        category: 'Past Papers',
        note: 'Public, no-sign-in official sample pack for Reading & Writing and Math',
      },
      {
        label: 'Printable Full-Length Practice Tests (PDF)',
        url: 'https://satsuite.collegeboard.org/practice/practice-tests/paper',
        category: 'Past Papers',
        note: 'Non-adaptive PDF practice tests, scoring guides, and explanations',
      },
      {
        label: 'Question of the Day & Prep Hub',
        url: 'https://qotd.collegeboard.org/',
        category: 'Practice Tests',
        note: 'Daily official question from College Board',
      },
      {
        label: 'How the SAT Is Structured & Scored',
        url: 'https://satsuite.collegeboard.org/sat/whats-on-the-test/structure',
        category: 'Spec',
        note: '2h 14m total, adaptive modules, and 400–1600 scoring breakdown',
      },
      {
        label: 'Registration, Dates, Test Centers & International Rules',
        url: 'https://satsuite.collegeboard.org/sat/registration',
        category: 'Portal',
        note: 'Booking, international fees, calculator policy (built-in Desmos), and accommodations',
      },
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
