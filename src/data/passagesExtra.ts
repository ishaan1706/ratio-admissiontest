import { LnatPassage } from '../types';

export const EXTRA_PASSAGES: LnatPassage[] = [
  {
    id: 'p7-judicial-review',
    title: 'The Unwritten Guardrail',
    domain: 'Constitutional Law',
    sourceStyle: 'Editorial essay · Public law',
    wordCount: 430,
    freeTier: true,
    paragraphs: [
      'Whenever British judges quash a ministerial decision, a familiar chorus accuses them of encroaching upon democracy. Parliament is elected; judges are not. From that premise, critics leap smoothly to the conclusion that any court which frustrates a government policy is substituting its own political preferences for the will of the voters. The slogan is neat, which is precisely why it obscures how judicial review actually works.',
      'In the United Kingdom, courts do not strike down Acts of Parliament. When judges intervene in judicial review, they ordinarily enforce limits that Parliament itself laid down in statute—asking whether a minister acted outside the powers granted, ignored mandatory evidence, or denied an affected citizen a fair hearing. Far from defying the legislature, a court that checks an overreaching executive is acting as Parliament’s most reliable enforcer.',
      'Critics counter that modern judges have stretched common-law principles—such as proportionality and legitimate expectation—well beyond what MPs ever consciously enacted. There is some force to that observation. Statutory wording is often broad, and interpreting what counts as an “unreasonable” exercise of power inevitably involves evaluative judgement. Yet the alternative to judicial interpretation is not pure democratic clarity; it is allowing ministers to be the sole judges of the boundaries of their own authority.',
      'A mature constitutional settlement therefore depends less on silencing the bench than on keeping the dialogue honest. If Parliament dislikes a judicial interpretation, it remains free to pass clearer, more explicit legislation—and to face the political cost of doing so openly. What undermines democracy is not a court insisting that power be exercised lawfully, but an executive that prefers vague powers precisely so it can act without spelling out the consequences in advance.'
    ],
    questions: [
      {
        id: 'p7-q1',
        passageId: 'p7-judicial-review',
        stem: 'Which of the following best summarises the author’s central argument?',
        skill: 'Main Argument',
        difficulty: 'Standard',
        paragraphRef: 4,
        correctLetter: 'D',
        rationale:
          'The author argues that judicial review generally upholds rather than defeats parliamentary authority by checking executive overreach, and that if Parliament disagrees it can legislate explicitly.',
        options: [
          {
            letter: 'A',
            text: 'British courts should be granted the power to strike down Acts of Parliament that violate common-law principles.',
            explanation: 'Contradicts paragraph 2 and 4, which affirm that Parliament remains free to override judicial interpretations through explicit legislation.'
          },
          {
            letter: 'B',
            text: 'Judges never exercise evaluative judgement when reviewing ministerial decisions.',
            explanation: 'Directly refuted by paragraph 3, which concedes that interpreting broad statutory wording "inevitably involves evaluative judgement".'
          },
          {
            letter: 'C',
            text: 'Ministers should be prevented from proposing broadly worded statutes to Parliament.',
            explanation: 'Too narrow and prescriptive; the passage critiques vague executive powers but does not propose banning broad statutes.'
          },
          {
            letter: 'D',
            text: 'Judicial review typically reinforces democratic accountability by policing executive limits, while leaving Parliament free to legislate clearly if it disagrees.',
            explanation: 'Captures the core thesis across paragraphs 2–4: judicial review checks ministers on Parliament’s behalf, and Parliament retains the final word through explicit legislation.'
          },
          {
            letter: 'E',
            text: 'Public criticism of the judiciary is unjustified because voters rarely understand constitutional law.',
            explanation: 'Unsupported: the author never blames voters’ ignorance, and in fact concedes "some force" to one criticism in paragraph 3.'
          }
        ]
      },
      {
        id: 'p7-q2',
        passageId: 'p7-judicial-review',
        stem: 'What is the logical function of the concession "There is some force to that observation" in paragraph 3?',
        skill: 'Structure & Evidence',
        difficulty: 'Challenging',
        paragraphRef: 3,
        correctLetter: 'A',
        rationale:
          'By acknowledging that judicial interpretation involves evaluative judgement, the author pre-empts the strongest objection before showing that the alternative (executive self-policing) is worse.',
        options: [
          {
            letter: 'A',
            text: 'To acknowledge a legitimate complexity in judicial interpretation before arguing that executive self-policing would be a worse alternative.',
            explanation: 'Matches the exact pivot in paragraph 3: conceding evaluative judgement, then contrasting it with letting ministers judge their own boundaries.'
          },
          {
            letter: 'B',
            text: 'To abandon the claim made in paragraph 2 that courts enforce parliamentary limits.',
            explanation: 'Overstates the concession; the author qualifies rather than abandons the earlier claim.'
          },
          {
            letter: 'C',
            text: 'To prove that common-law principles such as proportionality have no statutory basis.',
            explanation: 'The author notes critics make this charge, rather than trying to prove it as an end in itself.'
          },
          {
            letter: 'D',
            text: 'To show that MPs intentionally write vague laws to shift blame onto judges.',
            explanation: 'Goes beyond paragraph 3; paragraph 4 mentions executives preferring vague powers, not MPs shifting blame onto judges.'
          },
          {
            letter: 'E',
            text: 'To suggest that judicial review should be restricted solely to procedural hearings.',
            explanation: 'Nowhere does the author propose restricting judicial review to procedural hearings.'
          }
        ]
      },
      {
        id: 'p7-q3',
        passageId: 'p7-judicial-review',
        stem: 'Which unstated assumption underpins the critics’ argument as presented in paragraph 1?',
        skill: 'Assumption & Flaw',
        difficulty: 'Standard',
        paragraphRef: 1,
        correctLetter: 'C',
        rationale:
          'Critics move directly from "a court frustrates a government policy" to "the court is overriding the will of the voters", which assumes government policy is identical to the democratic mandate of Parliament/voters.',
        options: [
          {
            letter: 'A',
            text: 'Judges are appointed directly by the Prime Minister.',
            explanation: 'Irrelevant to the leap described in paragraph 1.'
          },
          {
            letter: 'B',
            text: 'Parliamentary statutes are always more detailed than judicial rulings.',
            explanation: 'Not needed for the critics’ premise-to-conclusion leap.'
          },
          {
            letter: 'C',
            text: 'A ministerial policy decision automatically represents the lawful will of the electorate.',
            explanation: 'Required for the critics’ leap: if a minister’s action were outside statutory authority, blocking it would not defy voters’ elected legislature.'
          },
          {
            letter: 'D',
            text: 'All citizens have equal access to bring judicial review claims.',
            explanation: 'Access to justice is not part of the paragraph 1 argument.'
          },
          {
            letter: 'E',
            text: 'Elected legislatures never pass laws that restrict executive discretion.',
            explanation: 'Too sweeping; critics simply equate government policy with voters’ will rather than denying Parliament ever limits ministers.'
          }
        ]
      },
      {
        id: 'p7-q4',
        passageId: 'p7-judicial-review',
        stem: 'What can most reliably be inferred from paragraph 4 about why an executive might favour vague statutory powers?',
        skill: 'Inference',
        difficulty: 'Standard',
        paragraphRef: 4,
        correctLetter: 'E',
        rationale:
          'Paragraph 4 contrasts passing explicit legislation ("face the political cost of doing so openly") with preferring vague powers "so it can act without spelling out the consequences in advance".',
        options: [
          {
            letter: 'A',
            text: 'Vague powers are faster for parliamentary counsel to draft during emergencies.',
            explanation: 'Emergencies and drafting speed are never mentioned.'
          },
          {
            letter: 'B',
            text: 'Vague powers prevent courts from hearing judicial review applications altogether.',
            explanation: 'False: paragraph 3 shows vague powers still invite judicial interpretation.'
          },
          {
            letter: 'C',
            text: 'Ministers rarely know what policies they intend to pursue until after an election.',
            explanation: 'Unsupported speculation not grounded in the text.'
          },
          {
            letter: 'D',
            text: 'Explicit legislation is automatically struck down by international courts.',
            explanation: 'Outside the passage completely.'
          },
          {
            letter: 'E',
            text: 'Spelling out controversial consequences explicitly in Parliament carries a political cost the government may wish to avoid.',
            explanation: 'Follows directly from the contrast in paragraph 4 between facing political cost openly and acting under vague powers.'
          }
        ]
      }
    ]
  },
  {
    id: 'p8-historical-monuments',
    title: 'Bronze, Context, and the Civic Square',
    domain: 'History & Public Ethics',
    sourceStyle: 'Cultural commentary',
    wordCount: 410,
    freeTier: true,
    paragraphs: [
      'Debates over the removal of statues depicting tainted historical figures routinely stall on a false opposition: either we preserve every plinth untouched, or we are accused of “erasing history”. Both postures flatter bronze with far more scholarly authority than it deserves. A statue in a civic square is not a footnote in a monograph; it is an act of public honour paid for in prominent real estate.',
      'Historians do not learn about the slave trade or imperial administration by gazing up at an idealized figure on horseback. They consult archives, letters, ledgers, and court records. Removing a monument from a central thoroughfare does not delete a single sentence from a library. What it alters is the civic statement a city chooses to endorse in the present—who is literally elevated above the crowd as an exemplar of public virtue.',
      'Yet the opposite instinct—to topple every flawed figure as swiftly as moral consensus shifts—carries its own poverty. Few historical actors survive modern scrutiny unscathed, and a city that periodically purges its streets risks mistaking moral tidiness for historical maturity. In many cases, relocation to a museum or the addition of frank contextual plaques achieves something richer than silent erasure: it preserves the physical evidence that earlier generations chose to venerate men whose fortunes rested on cruelty.',
      'The real question, then, is neither whether history should be forgotten nor whether the past must be eternally forgiven. It is whether a living democracy has the right to curate its own shared spaces. Generations before us put up statues to express their values; there is nothing uniquely destructive about our generation deciding, through open civic debate, which of those honours still belong in the centre of town.'
    ],
    questions: [
      {
        id: 'p8-q1',
        passageId: 'p8-historical-monuments',
        stem: 'Why does the author compare a statue to "a footnote in a monograph" in paragraph 1?',
        skill: 'Tone & Attitude',
        difficulty: 'Standard',
        paragraphRef: 1,
        correctLetter: 'B',
        rationale:
          'The contrast highlights that statues are instruments of civic veneration rather than neutral historical scholarship, undercutting the claim that removing them "erases history".',
        options: [
          {
            letter: 'A',
            text: 'To argue that academic historians should have sole legal authority over city planning.',
            explanation: 'Unsupported: paragraph 4 calls for "open civic debate", not exclusive authority for historians.'
          },
          {
            letter: 'B',
            text: 'To distinguish public commemoration from genuine historical record-keeping.',
            explanation: 'Directly matches the contrast between scholarly sources (archives, monographs) and acts of public honour.'
          },
          {
            letter: 'C',
            text: 'To suggest that statues are more accurate than written archives.',
            explanation: 'Reverses the author’s point entirely.'
          },
          {
            letter: 'D',
            text: 'To mock citizens who care about architecture in public squares.',
            explanation: 'The tone is analytical, not mocking of architectural interest.'
          },
          {
            letter: 'E',
            text: 'To claim that plaques provide more detail than history books.',
            explanation: 'Never claimed in the passage.'
          }
        ]
      },
      {
        id: 'p8-q2',
        passageId: 'p8-historical-monuments',
        stem: 'According to paragraph 3, what is the specific merit of relocating a statue to a museum or adding frank contextual plaques?',
        skill: 'Inference',
        difficulty: 'Standard',
        paragraphRef: 3,
        correctLetter: 'D',
        rationale:
          'Paragraph 3 states that relocation or contextual plaques preserve evidence of how earlier generations chose to honour people whose wealth came from cruelty.',
        options: [
          {
            letter: 'A',
            text: 'It guarantees that moral consensus will never shift again in the future.',
            explanation: 'Absurd and unsupported.'
          },
          {
            letter: 'B',
            text: 'It costs significantly less than maintaining monuments in central squares.',
            explanation: 'Financial maintenance costs are not discussed.'
          },
          {
            letter: 'C',
            text: 'It rehabilitates the reputation of historical figures who have been unfairly judged.',
            explanation: 'Contradicts the text, which refers to "men whose fortunes rested on cruelty".'
          },
          {
            letter: 'D',
            text: 'It retains tangible proof of what past societies chose to venerate without continuing to endorse those figures in civic centres.',
            explanation: 'Accurately synthesises paragraph 3’s point about preserving physical evidence of past veneration.'
          },
          {
            letter: 'E',
            text: 'It prevents open civic debate from becoming politically divisive.',
            explanation: 'Paragraph 4 welcomes open civic debate rather than seeking to avoid it.'
          }
        ]
      },
      {
        id: 'p8-q3',
        passageId: 'p8-historical-monuments',
        stem: 'Which of the following would the author most likely agree with?',
        skill: 'Main Argument',
        difficulty: 'Challenging',
        paragraphRef: 4,
        correctLetter: 'A',
        rationale:
          'Paragraph 4 argues that just as earlier generations used statues to express their values, present citizens have a democratic right to reconsider which honours stay in civic centres.',
        options: [
          {
            letter: 'A',
            text: 'Re-evaluating which statues occupy prominent public spaces is a normal exercise of democratic self-determination.',
            explanation: 'Matches paragraph 4 directly: curating shared spaces through open civic debate is a legitimate right of a living democracy.'
          },
          {
            letter: 'B',
            text: 'Every statue of a figure with moral failings should be destroyed immediately.',
            explanation: 'Contradicts paragraph 3’s warning against purging every flawed figure.'
          },
          {
            letter: 'C',
            text: 'Public monuments should never be erected for living or dead political figures.',
            explanation: 'Goes beyond the passage; the author objects to treating past honours as permanent, not to all monuments.'
          },
          {
            letter: 'D',
            text: 'Removing a statue from a town square inevitably weakens public knowledge of archives.',
            explanation: 'Contradicts paragraph 2.'
          },
          {
            letter: 'E',
            text: 'Earlier generations had no moral right to place monuments in city centres.',
            explanation: 'Not stated; the author simply observes they expressed their values and our generation may express ours.'
          }
        ]
      }
    ]
  },
  {
    id: 'p9-pharmaceutical-patents',
    title: 'Monopolies in the Medicine Cabinet',
    domain: 'Intellectual Property & Global Health',
    sourceStyle: 'Policy analysis',
    wordCount: 440,
    freeTier: true,
    paragraphs: [
      'Few legal inventions are more paradoxical than the pharmaceutical patent. To encourage companies to spend hundreds of millions developing a new drug—most candidates failing in clinical trials—the state grants the successful inventor a temporary legal monopoly. During that window, competitors are barred from selling cheap generic copies, allowing the patent holder to charge far above the marginal cost of pressing a pill. The bargain is brutal in the short term so that medicine might exist at all in the long term.',
      'Critics of the system point out, accurately, that the bargain no longer operates as cleanly as textbooks suggest. A substantial share of foundational biomedical research is funded not by private firms but by public universities and state grants, with pharmaceutical companies entering later to run trials and register patents. Moreover, firms routinely extend monopolies well past twenty years through “evergreening”—patenting minor tweaks to dosage, coating, or delivery devices rather than genuine therapeutic breakthroughs.',
      'The tempting remedy is to abolish drug patents altogether or routinely override them through compulsory licensing. Yet sweeping abolition ignores a stubborn financing problem: even if basic biology is publicly funded, taking a molecule through Phase III clinical trials and global regulatory approval remains extraordinarily expensive and risky. Unless governments are prepared to replace private capital with vastly larger public drug-development prizes—and absorb the political blame for expensive failures—eliminating exclusivity outright would shrink the pipeline of new therapies.',
      'Reform should therefore target the abuse of exclusivity rather than its core premise. Stricter patentability standards that refuse secondary patents for trivial modifications, transparent accounting of public research subsidies, and tiered pricing obligations in low-income countries would preserve the incentive for genuine innovation while ending the windfalls built on legal gamesmanship.'
    ],
    questions: [
      {
        id: 'p9-q1',
        passageId: 'p9-pharmaceutical-patents',
        stem: 'Why does the author describe the pharmaceutical patent as "paradoxical" in paragraph 1?',
        skill: 'Inference',
        difficulty: 'Standard',
        paragraphRef: 1,
        correctLetter: 'C',
        rationale:
          'It intentionally creates a temporary monopoly that keeps prices high in the short run in order to finance the creation of life-saving medicines over the long run.',
        options: [
          {
            letter: 'A',
            text: 'Because most clinical trials succeed even though firms claim they are risky.',
            explanation: 'Contradicts paragraph 1, which notes "most candidates failing in clinical trials".'
          },
          {
            letter: 'B',
            text: 'Because generic manufacturers spend more on research than patent holders.',
            explanation: 'Not stated in the text.'
          },
          {
            letter: 'C',
            text: 'Because it deliberately restricts affordable access in the short term in order to incentivise the creation of new drugs over the long term.',
            explanation: 'Captures the exact tension explained in the final sentence of paragraph 1.'
          },
          {
            letter: 'D',
            text: 'Because governments outlaw monopolies in every industry except healthcare.',
            explanation: 'Unsupported generalisation.'
          },
          {
            letter: 'E',
            text: 'Because patents expire before drugs receive regulatory approval.',
            explanation: 'Not mentioned; paragraph 2 discusses extending patents past twenty years.'
          }
        ]
      },
      {
        id: 'p9-q2',
        passageId: 'p9-pharmaceutical-patents',
        stem: 'Which of the following is an example of "evergreening" as defined in paragraph 2?',
        skill: 'Inference',
        difficulty: 'Standard',
        paragraphRef: 2,
        correctLetter: 'E',
        rationale:
          'Evergreening is extending a monopoly beyond 20 years by patenting minor modifications (dosage, coating, delivery) rather than genuine therapeutic advances.',
        options: [
          {
            letter: 'A',
            text: 'A university licensing an early-stage discovery to a biotech start-up.',
            explanation: 'This describes public-to-private transfer, not evergreening.'
          },
          {
            letter: 'B',
            text: 'A government issuing a compulsory licence during a pandemic.',
            explanation: 'Compulsory licensing overrides a patent; it does not extend it.'
          },
          {
            letter: 'C',
            text: 'A firm abandoning a drug candidate after Phase III trials fail.',
            explanation: 'Describes R&D risk, not patent extension.'
          },
          {
            letter: 'D',
            text: 'A company selling a patented antibiotic at lower prices in low-income countries.',
            explanation: 'That is tiered pricing, endorsed in paragraph 4.'
          },
          {
            letter: 'E',
            text: 'A manufacturer securing a fresh patent for a slightly altered tablet coating on an expiring blockbuster drug.',
            explanation: 'Matches paragraph 2’s exact definition of evergreening.'
          }
        ]
      },
      {
        id: 'p9-q3',
        passageId: 'p9-pharmaceutical-patents',
        stem: 'According to paragraph 3, what condition would have to be met for abolishing drug patents not to shrink the pipeline of new therapies?',
        skill: 'Assumption & Flaw',
        difficulty: 'Challenging',
        paragraphRef: 3,
        correctLetter: 'A',
        rationale:
          'Paragraph 3 explicitly states that unless governments replace private capital with much larger public funding/prizes and accept political blame for failed trials, abolition would shrink the pipeline.',
        options: [
          {
            letter: 'A',
            text: 'Governments would need to fund expensive late-stage development themselves and tolerate the political fallout of costly failures.',
            explanation: 'Directly mirrors the "Unless governments are prepared to..." clause in paragraph 3.'
          },
          {
            letter: 'B',
            text: 'Universities would need to stop accepting private pharmaceutical grants.',
            explanation: 'Not mentioned in paragraph 3.'
          },
          {
            letter: 'C',
            text: 'Regulatory agencies would need to eliminate Phase III clinical trials.',
            explanation: 'Not suggested anywhere.'
          },
          {
            letter: 'D',
            text: 'Generic manufacturers would need to merge into a single state-owned enterprise.',
            explanation: 'Unsupported.'
          },
          {
            letter: 'E',
            text: 'Patent terms would need to be lengthened from twenty years to forty years.',
            explanation: 'Contradicts abolishing patents.'
          }
        ]
      },
      {
        id: 'p9-q4',
        passageId: 'p9-pharmaceutical-patents',
        stem: 'Which best describes the author’s overall tone towards the current pharmaceutical patent system?',
        skill: 'Tone & Attitude',
        difficulty: 'Standard',
        paragraphRef: 4,
        correctLetter: 'B',
        rationale:
          'The author defends the core economic rationale of exclusivity while sharply criticising abuses like evergreening and advocating targeted reform.',
        options: [
          {
            letter: 'A',
            text: 'Uncritically supportive of pharmaceutical firms.',
            explanation: 'Ignores the sharp critique of evergreening and "legal gamesmanship".'
          },
          {
            letter: 'B',
            text: 'Pragmatically reformist, distinguishing genuine innovation incentives from strategic abuse.',
            explanation: 'Matches the balanced structure: defending late-stage financing incentives while targeting secondary patent abuse.'
          },
          {
            letter: 'C',
            text: 'Hostile to all forms of intellectual property law.',
            explanation: 'Contradicts paragraph 4, which preserves the core premise of exclusivity.'
          },
          {
            letter: 'D',
            text: 'Pessimistic that any regulatory reform can ever succeed.',
            explanation: 'The author proposes concrete reforms in paragraph 4 without pessimism.'
          },
          {
            letter: 'E',
            text: 'Indifferent to the affordability of medicines in poorer countries.',
            explanation: 'Contradicts paragraph 4’s call for tiered pricing obligations in low-income countries.'
          }
        ]
      }
    ]
  },
  {
    id: 'p10-urban-congestion',
    title: 'The Price of an Empty Lane',
    domain: 'Economics & Public Policy',
    sourceStyle: 'Policy essay',
    wordCount: 395,
    freeTier: true,
    paragraphs: [
      'When cities propose charging drivers to enter congested centres at peak hours, the objection arrives before the ink dries: road pricing is regressive, a “tax on working people” that hands clear streets to the wealthy. The criticism sounds egalitarian, yet it rests on a quiet blind spot about who actually bears the cost of gridlock today.',
      'In most major cities, the majority of low-income commuters do not drive alone into the central business district at 8:30 a.m.; they ride buses and commuter trains. Every single-occupancy car idling at a junction slows the bus behind it—delaying fifty passengers so that one driver can preserve the illusion that road space is “free”. Congestion is already a tax; it is simply collected in wasted hours and diesel fumes rather than pounds, and its heaviest burden falls on shift workers with the least flexible schedules.',
      'That does not make every congestion charge automatically fair. A poorly designed toll that siphons revenue into general budgets while leaving outer-suburban rail unreliable genuinely punishes tradespeople and care workers who have no viable transit alternative. Public consent depends on a visible bargain: ring-fencing toll revenue to expand frequent bus lanes, subsidise off-peak fares, and exempt disabled drivers and emergency vehicles.',
      'Cities that have honoured that bargain—Stockholm and London among them—discovered a striking political pattern. Road pricing is fiercely unpopular in the abstract, when drivers imagine only the fee, and broadly accepted once commuters experience faster buses and cleaner air. The lesson for policymakers is not to abandon pricing, but to stop defending it as a punishment and start delivering it as an investment.'
    ],
    questions: [
      {
        id: 'p10-q1',
        passageId: 'p10-urban-congestion',
        stem: 'What is the "quiet blind spot" referred to in paragraph 1?',
        skill: 'Inference',
        difficulty: 'Standard',
        paragraphRef: 2,
        correctLetter: 'D',
        rationale:
          'Opponents focus only on the monetary toll paid by drivers and overlook that unpriced gridlock already imposes heavy time and pollution costs on lower-income bus commuters.',
        options: [
          {
            letter: 'A',
            text: 'Wealthy drivers actually spend more time in traffic than bus passengers.',
            explanation: 'Not stated in the passage.'
          },
          {
            letter: 'B',
            text: 'Most city centres lack enough parking spaces for commuters.',
            explanation: 'Parking is never mentioned.'
          },
          {
            letter: 'C',
            text: 'Road tolls are cheaper to administer electronically than fuel taxes.',
            explanation: 'Administration costs are not discussed.'
          },
          {
            letter: 'D',
            text: 'Unpriced traffic congestion already imposes severe, inequitable costs on lower-income public-transport riders.',
            explanation: 'Matches paragraph 2 directly: congestion is already a tax paid in wasted hours and fumes, hitting shift workers on buses hardest.'
          },
          {
            letter: 'E',
            text: 'Tradespeople and care workers prefer driving even when trains are faster.',
            explanation: 'Contradicts paragraph 3, which notes they may lack a viable transit alternative.'
          }
        ]
      },
      {
        id: 'p10-q2',
        passageId: 'p10-urban-congestion',
        stem: 'Why does the author cite Stockholm and London in paragraph 4?',
        skill: 'Structure & Evidence',
        difficulty: 'Standard',
        paragraphRef: 4,
        correctLetter: 'B',
        rationale:
          'They serve as real-world evidence that public opposition to road pricing softens once residents see the tangible benefits of ring-fenced transit improvements.',
        options: [
          {
            letter: 'A',
            text: 'To show that European cities have fewer cars per household than American cities.',
            explanation: 'No US comparison is made.'
          },
          {
            letter: 'B',
            text: 'To provide empirical examples of road pricing winning public acceptance once tangible transit and air-quality gains materialise.',
            explanation: 'Matches paragraph 4’s exact claim about the political pattern observed in Stockholm and London.'
          },
          {
            letter: 'C',
            text: 'To prove that congestion charges completely eliminate private car ownership.',
            explanation: 'Too extreme and unsupported.'
          },
          {
            letter: 'D',
            text: 'To argue that general taxation is superior to ring-fenced revenue.',
            explanation: 'Directly contradicts paragraph 3.'
          },
          {
            letter: 'E',
            text: 'To demonstrate that referendums are unnecessary for transport policy.',
            explanation: 'Referendums are not mentioned.'
          }
        ]
      },
      {
        id: 'p10-q3',
        passageId: 'p10-urban-congestion',
        stem: 'Which policy would the author be MOST likely to criticise?',
        skill: 'Main Argument',
        difficulty: 'Standard',
        paragraphRef: 3,
        correctLetter: 'C',
        rationale:
          'Paragraph 3 explicitly warns against tolls that divert funds into general budgets without improving public transport or granting necessary exemptions.',
        options: [
          {
            letter: 'A',
            text: 'Using peak-hour toll revenue exclusively to fund dedicated bus lanes and cheaper commuter passes.',
            explanation: 'The author endorses this in paragraph 3.'
          },
          {
            letter: 'B',
            text: 'Exempting disabled drivers and emergency vehicles from a city-centre road charge.',
            explanation: 'Explicitly endorsed in paragraph 3.'
          },
          {
            letter: 'C',
            text: 'Introducing a peak-hour driving fee to plug an unrelated municipal budget deficit while cutting suburban bus routes.',
            explanation: 'Violates the exact "visible bargain" required in paragraph 3.'
          },
          {
            letter: 'D',
            text: 'Running a six-month congestion-charge trial alongside expanded bus frequencies.',
            explanation: 'Consistent with paragraph 4’s insight that experiencing benefits builds consent.'
          },
          {
            letter: 'E',
            text: 'Charging higher fees during rush hour than at midnight.',
            explanation: 'Consistent with targeting congested peak hours.'
          }
        ]
      }
    ]
  },
  {
    id: 'p11-art-forgery',
    title: 'What We Pay For When We Look',
    domain: 'Aesthetics & Philosophy',
    sourceStyle: 'Philosophical essay',
    wordCount: 400,
    freeTier: true,
    paragraphs: [
      'Suppose a master forger paints a canvas indistinguishable to the naked eye from a lost Vermeer. Until a chemical pigment test exposes the deception, critics praise its luminous restraint and museum visitors stand before it in hushed awe. The moment the laboratory report arrives, however, the painting is whisked into storage and its market value collapses. To the strict empiricist, this looks absurd: not a single brushstroke changed, so how could the work’s aesthetic value evaporate overnight?',
      'The puzzle dissolves once we notice that looking at art is never a purely optical transaction. We do not value a painting merely as a pattern of coloured pixels hitting the retina, any more than we value a love letter solely for the elegance of its handwriting. Part of what moves us in an original Vermeer is the human achievement it embodies—a seventeenth-century painter solving problems of light and composition without knowing how modern eyes would later canonise him.',
      'A forgery parasites on that history. Even when technically dazzling, it is an act of mimicry rather than invention: the forger works backwards from an already-celebrated style, guided by our hindsight. Knowing that a canvas is a fake therefore alters what we are actually perceiving, because aesthetic judgement legitimately encompasses how a work came into being, not just its surface appearance.',
      'Critics who dismiss the premium on authenticity as mere snobbery miss this distinction. Market prices certainly reflect status and scarcity, and art auctions can be absurd. Yet the ordinary museum-goer’s disappointment on discovering a forgery is neither snobbish nor irrational. We go to galleries hoping to encounter a genuine trace of another mind at work; discovering a clever imitation feels less like finding a bargain and more like learning a friend’s confession was copied from a script.'
    ],
    questions: [
      {
        id: 'p11-q1',
        passageId: 'p11-art-forgery',
        stem: 'What is the purpose of the love-letter analogy in paragraph 2?',
        skill: 'Structure & Evidence',
        difficulty: 'Standard',
        paragraphRef: 2,
        correctLetter: 'A',
        rationale:
          'Just as a love letter’s value depends on its genuine origin and intent rather than handwriting alone, a painting’s value depends on the authentic human achievement behind its visual surface.',
        options: [
          {
            letter: 'A',
            text: 'To illustrate that the value of an artefact legitimately depends on its origin and authorship, not merely its surface appearance.',
            explanation: 'Matches paragraph 2’s argument against reducing art to "a pattern of coloured pixels".'
          },
          {
            letter: 'B',
            text: 'To prove that calligraphy is an inferior art form to oil painting.',
            explanation: 'Misreads the analogy completely.'
          },
          {
            letter: 'C',
            text: 'To argue that art galleries should display personal letters alongside paintings.',
            explanation: 'Literal misreading of an analogy.'
          },
          {
            letter: 'D',
            text: 'To show that aesthetic judgements are entirely emotional and never rational.',
            explanation: 'Contradicts paragraph 4, which calls the disappointment "neither snobbish nor irrational".'
          },
          {
            letter: 'E',
            text: 'To suggest that forged paintings have no technical skill.',
            explanation: 'Contradicts paragraph 3, which concedes a forgery can be "technically dazzling".'
          }
        ]
      },
      {
        id: 'p11-q2',
        passageId: 'p11-art-forgery',
        stem: 'According to paragraph 3, what fundamentally separates a master forgery from an original Vermeer?',
        skill: 'Inference',
        difficulty: 'Standard',
        paragraphRef: 3,
        correctLetter: 'E',
        rationale:
          'Paragraph 3 contrasts genuine invention in historical context with retrospective mimicry guided by hindsight.',
        options: [
          {
            letter: 'A',
            text: 'A forgery always contains visible technical flaws that trained critics can spot immediately.',
            explanation: 'Contradicts paragraph 1, where critics praise the forgery until a chemical test exposes it.'
          },
          {
            letter: 'B',
            text: 'Forgers use cheaper canvases that decay faster than seventeenth-century linen.',
            explanation: 'Not mentioned.'
          },
          {
            letter: 'C',
            text: 'Original paintings are always intended for public museums rather than private sale.',
            explanation: 'Not stated.'
          },
          {
            letter: 'D',
            text: 'Forgeries are illegal whereas copying old masters in art school is legal.',
            explanation: 'Legality is not the philosophical distinction drawn in paragraph 3.'
          },
          {
            letter: 'E',
            text: 'The forgery imitates an already-validated style using hindsight, rather than constituting original artistic invention.',
            explanation: 'Directly reflects paragraph 3 ("an act of mimicry rather than invention: the forger works backwards... guided by our hindsight").'
          }
        ]
      },
      {
        id: 'p11-q3',
        passageId: 'p11-art-forgery',
        stem: 'How does the author respond in paragraph 4 to the charge that caring about authenticity is "mere snobbery"?',
        skill: 'Main Argument',
        difficulty: 'Challenging',
        paragraphRef: 4,
        correctLetter: 'C',
        rationale:
          'The author concedes that auction prices can reflect status and scarcity, but maintains that a viewer’s disappointment at deception is a rational response to losing an authentic human encounter.',
        options: [
          {
            letter: 'A',
            text: 'By denying that scarcity or status ever influence art-market prices.',
            explanation: 'Contradicts paragraph 4, which explicitly concedes "Market prices certainly reflect status and scarcity".'
          },
          {
            letter: 'B',
            text: 'By arguing that museums should keep forgeries on display without labelling them.',
            explanation: 'Not suggested anywhere.'
          },
          {
            letter: 'C',
            text: 'By conceding that the art market has snobbish elements while defending the ordinary viewer’s desire for genuine human authorship.',
            explanation: 'Accurately captures both the concession and the rebuttal in paragraph 4.'
          },
          {
            letter: 'D',
            text: 'By claiming that only professional art historians are qualified to feel disappointed by a fake.',
            explanation: 'Contradicts the focus on "the ordinary museum-goer".'
          },
          {
            letter: 'E',
            text: 'By asserting that a painting’s monetary price is the best measure of its artistic merit.',
            explanation: 'Contradicts the statement that "art auctions can be absurd".'
          }
        ]
      }
    ]
  },
  {
    id: 'p12-whistleblowing',
    title: 'Loyalty’s Outer Boundary',
    domain: 'Public Law & Ethics',
    sourceStyle: 'Editorial essay · Governance',
    wordCount: 415,
    freeTier: true,
    paragraphs: [
      'Every functioning institution relies on a measure of internal confidentiality. Civil servants cannot give candid advice to ministers if every draft memorandum is leaked to the press before dinner; doctors and regulators cannot investigate sensitive errors if internal files become instant ammunition in partisan battles. Defenders of strict secrecy laws are therefore right to insist that organisations cannot run on permanent guerrilla leaks.',
      'Yet confidentiality is a means to public integrity, not an end in itself. When internal reporting channels are captured by the very officials responsible for wrongdoing—or when an agency conceals unlawful surveillance, falsified safety data, or systemic abuse—demanding silent obedience ceases to protect the public interest and begins to shield misconduct from it. At that point, the whistleblower is not betraying the institution’s mission; the institution’s leadership already has.',
      'The difficulty lies in writing law that distinguishes principled public-interest disclosure from self-serving or reckless leaking. Blanket immunity for anyone who claims good motives would invite chaos and endanger genuine national-security sources. Equally, laws that offer no public-interest defence at all—treating an official who exposes illegality identically to a spy selling secrets to a foreign power—erase the most important moral line in public life.',
      'A defensible framework therefore insists on proportionality and sequence. Officials should ordinarily be required to exhaust safe internal or independent ombudsman channels first, and to disclose no more than is necessary to expose the concrete wrong. Where those channels fail or are compromised, however, courts must be permitted to weigh the gravity of the misconduct revealed against the harm of the breach. Secrecy that cannot survive that balancing test rarely deserves the law’s protection.'
    ],
    questions: [
      {
        id: 'p12-q1',
        passageId: 'p12-whistleblowing',
        stem: 'Which of the following best describes the author’s position on institutional confidentiality?',
        skill: 'Main Argument',
        difficulty: 'Standard',
        paragraphRef: 2,
        correctLetter: 'B',
        rationale:
          'Confidentiality is necessary for candid governance, but it is instrumental ("a means to public integrity") and must yield when used to conceal serious wrongdoing.',
        options: [
          {
            letter: 'A',
            text: 'Internal confidentiality is an outdated norm that should be abolished in democratic governments.',
            explanation: 'Contradicts paragraph 1, which defends the necessity of candid internal advice.'
          },
          {
            letter: 'B',
            text: 'Confidentiality is valuable for effective governance, but loses its moral authority when it is used to conceal serious institutional misconduct.',
            explanation: 'Captures paragraphs 1 and 2 accurately.'
          },
          {
            letter: 'C',
            text: 'Civil servants should always leak draft memoranda whenever they disagree with a minister’s policy.',
            explanation: 'Explicitly rejected in paragraphs 1 and 3.'
          },
          {
            letter: 'D',
            text: 'Only national-security agencies require legal protection for confidential documents.',
            explanation: 'Paragraph 1 also cites civil servants, doctors, and regulators.'
          },
          {
            letter: 'E',
            text: 'Internal ombudsman channels are always too compromised to be worth using.',
            explanation: 'Contradicts paragraph 4, which says officials should ordinarily exhaust internal or ombudsman channels first.'
          }
        ]
      },
      {
        id: 'p12-q2',
        passageId: 'p12-whistleblowing',
        stem: 'Why does the author criticise laws that contain no public-interest defence in paragraph 3?',
        skill: 'Assumption & Flaw',
        difficulty: 'Standard',
        paragraphRef: 3,
        correctLetter: 'D',
        rationale:
          'Such laws fail to make a crucial moral distinction, lumping together someone exposing illegality with an espionage agent selling secrets.',
        options: [
          {
            letter: 'A',
            text: 'Because they encourage journalists to publish unverified rumours.',
            explanation: 'Journalists’ verification practices are not discussed.'
          },
          {
            letter: 'B',
            text: 'Because they grant blanket immunity to reckless leakers.',
            explanation: 'Confuses the two extremes contrasted in paragraph 3.'
          },
          {
            letter: 'C',
            text: 'Because they are too expensive for courts to enforce.',
            explanation: 'Enforcement costs are not mentioned.'
          },
          {
            letter: 'D',
            text: 'Because they treat principled exposure of illegality as legally indistinguishable from treasonous espionage.',
            explanation: 'Directly mirrors paragraph 3 ("treating an official who exposes illegality identically to a spy selling secrets").'
          },
          {
            letter: 'E',
            text: 'Because they violate the confidentiality of medical records.',
            explanation: 'Not claimed in paragraph 3.'
          }
        ]
      },
      {
        id: 'p12-q3',
        passageId: 'p12-whistleblowing',
        stem: 'Under the framework proposed in paragraph 4, which disclosure would have the STRONGEST claim to legal protection?',
        skill: 'Inference',
        difficulty: 'Challenging',
        paragraphRef: 4,
        correctLetter: 'A',
        rationale:
          'Paragraph 4 requires exhausting internal/ombudsman channels first (unless compromised) and disclosing only what is necessary to expose concrete misconduct.',
        options: [
          {
            letter: 'A',
            text: 'An inspector who reports falsified safety data to an independent regulator, receives no action because the regulator is implicated, and then releases only the falsified test sheets to the press.',
            explanation: 'Satisfies both sequence (exhausting channels / compromised oversight) and proportionality (releasing only what is necessary to expose the concrete wrong).'
          },
          {
            letter: 'B',
            text: 'A civil servant who immediately uploads an entire department’s email archive online to protest an unpopular tax policy.',
            explanation: 'Fails both sequence and proportionality, and concerns policy disagreement rather than concrete misconduct.'
          },
          {
            letter: 'C',
            text: 'An intelligence analyst who publishes the identities of undercover informants to prove a broad point about foreign policy.',
            explanation: 'Explicitly rejected in paragraph 3 ("endanger genuine national-security sources").'
          },
          {
            letter: 'D',
            text: 'A junior clerk who leaks a minister’s private draft speech before checking whether any law has been broken.',
            explanation: 'Fails concrete wrongdoing and sequence.'
          },
          {
            letter: 'E',
            text: 'A contractor who sells confidential tender documents to a rival firm because they suspect favouritism.',
            explanation: 'Self-serving commercial leak, not principled public-interest disclosure.'
          }
        ]
      }
    ]
  }
];
