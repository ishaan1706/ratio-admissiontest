export interface UniBenchmark {
  name: string;
  shortName: string;
  typicalOfferRange: [number, number];
  note: string;
}

export const UNI_BENCHMARKS: UniBenchmark[] = [
  {
    name: 'University of Oxford',
    shortName: 'Oxford',
    typicalOfferRange: [28, 34],
    note: 'Shortlists heavily on Section A + Section B essay + GCSE/predicted grades.'
  },
  {
    name: 'University of Cambridge',
    shortName: 'Cambridge',
    typicalOfferRange: [27, 33],
    note: 'Assesses Section A alongside Section B and college interview performance.'
  },
  {
    name: 'LSE (London School of Economics)',
    shortName: 'LSE',
    typicalOfferRange: [27, 32],
    note: 'Places strong weight on Section A score; does not routinely read Section B.'
  },
  {
    name: 'UCL (University College London)',
    shortName: 'UCL',
    typicalOfferRange: [26, 31],
    note: 'Reviews both Section A score and Section B essay closely.'
  },
  {
    name: "King's College London",
    shortName: 'KCL',
    typicalOfferRange: [25, 30],
    note: 'Uses Section A score as a key filter alongside personal statement.'
  },
  {
    name: 'Durham & Bristol',
    shortName: 'Durham / Bristol',
    typicalOfferRange: [24, 29],
    note: 'Competitive offer-holder averages typically sit above the national mean (~21–22).'
  }
];

export function getProjectedLnatScore(correct: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 42);
}

export function getPercentileBand(score42: number): {
  label: string;
  summary: string;
} {
  if (score42 >= 32) {
    return {
      label: 'Top 5–8% band',
      summary: 'Strong Oxbridge / LSE competitive range.'
    };
  }
  if (score42 >= 28) {
    return {
      label: 'Top 15% band',
      summary: 'Competitive for Oxford, Cambridge, LSE, and UCL.'
    };
  }
  if (score42 >= 24) {
    return {
      label: 'Top 30% band',
      summary: 'Solidly above the national average (~21–22); strong base for KCL, Durham, Bristol.'
    };
  }
  if (score42 >= 19) {
    return {
      label: 'Around national mean',
      summary: 'Close to the typical LNAT applicant average (~21/42). Targeted skill drills can lift this by 5–7 marks.'
    };
  }
  return {
    label: 'Foundation band',
    summary: 'Focus on eliminating extreme distractors and checking exact paragraph evidence before timing up.'
  };
}
