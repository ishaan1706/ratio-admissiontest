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
            text: 'Judicial review should allow courts to overturn laws when they conclude that Parliament has departed from common-law principles.',
            explanation: 'The passage explicitly distinguishes checking ministers from striking down Acts of Parliament.'
          },
          {
            letter: 'B',
            text: 'Judicial review is defensible because ministers, rather than judges, make all important judgements about policy and interpretation.',
            explanation: 'The author grants that judicial interpretation itself requires evaluative judgement.'
          },
          {
            letter: 'C',
            text: 'Ministers’ power to act should depend on whether Parliament could have described their duties more clearly in advance.',
            explanation: 'The author favours explicit lawmaking but does not make perfectly detailed statutes a condition of executive action.'
          },
          {
            letter: 'D',
            text: 'Judicial review can check executive overreach without displacing Parliament’s final say.',
            explanation: 'Courts enforce limits on ministers; Parliament can respond by legislating more explicitly.'
          },
          {
            letter: 'E',
            text: 'Judicial interpretations should be immune from political criticism if they are intended to protect Parliament’s authority.',
            explanation: 'The author concedes some force to criticism and allows Parliament to disagree openly.'
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
            text: 'To admit a difficulty with judicial interpretation before comparing it with the alternative.',
            explanation: 'The concession sets up the comparison with ministers judging the limits of their own powers.'
          },
          {
            letter: 'B',
            text: 'To shift from defending judicial review in practice to questioning whether it is justified in principle.',
            explanation: 'The author still defends review; the qualification is about what interpretation involves.'
          },
          {
            letter: 'C',
            text: 'To draw a line between review based on legislation and review based on common-law principles.',
            explanation: 'The author does not divide judicial review into two categories or endorse just one.'
          },
          {
            letter: 'D',
            text: 'To explain why Parliament grants ministers broad powers rather than specifying which decisions they may take.',
            explanation: 'Broad wording explains why interpretation involves judgement; the concession does not explain Parliament’s motives.'
          },
          {
            letter: 'E',
            text: 'To establish that judges and ministers face essentially the same difficulty when interpreting a broad statute.',
            explanation: 'The comparison turns on an asymmetry: ministers would judge the limits of their own authority.'
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
            text: 'It makes the history of the people depicted more reliable than surviving accounts of their contemporaries.',
            explanation: 'A statue is evidence of who was honoured, not necessarily reliable evidence of that person’s life.'
          },
          {
            letter: 'B',
            text: 'It preserves the original commemorative purpose while giving people more information about the figure’s life.',
            explanation: 'Preserving evidence of commemoration is distinct from carrying on the act of commemoration.'
          },
          {
            letter: 'C',
            text: 'It allows later generations to judge whether the original sculptors understood the people they depicted.',
            explanation: 'The emphasis is on what earlier communities chose to honour, not what the sculptor knew.'
          },
          {
            letter: 'D',
            text: 'It keeps the evidence of past veneration without leaving that veneration unchallenged.',
            explanation: 'A new setting or a frank plaque lets the object bear witness to past values rather than simply affirming them.'
          },
          {
            letter: 'E',
            text: 'It permits discussion of the figure without requiring anyone to reconsider the role of public monuments.',
            explanation: 'The author invites reconsideration of that role by distinguishing remembrance from honour.'
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
            text: 'Reconsidering who is honoured in public spaces is a legitimate democratic choice.',
            explanation: 'The position of a statue is a civic decision open to later communities.'
          },
          {
            letter: 'B',
            text: 'A monument’s historical importance is best preserved by placing it where its original audience would have seen it.',
            explanation: 'The author gives reasons to preserve such evidence in museums or with altered context.'
          },
          {
            letter: 'C',
            text: 'Moving a statue from a public square is justified only after a community reaches agreement about the figure’s merits.',
            explanation: 'The passage welcomes disagreement in civic debate rather than making consensus a condition.'
          },
          {
            letter: 'D',
            text: 'A public monument should be judged on whether it provides an accurate historical account of the person depicted.',
            explanation: 'The distinction is between honouring a person and preserving evidence, not the biographical accuracy of a sculpture.'
          },
          {
            letter: 'E',
            text: 'An earlier generation’s choice of whom to honour gives its successors a duty to preserve that public honour.',
            explanation: 'Later generations can retain evidence of the choice without continuing the honour.'
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
            text: 'Because it rewards firms for successful trials while leaving them to pay for a larger number of failed trials.',
            explanation: 'Failure explains why firms need an incentive, not why that incentive presents an access paradox.'
          },
          {
            letter: 'B',
            text: 'Because it rewards invention but allows firms to profit from discoveries their own researchers did not make.',
            explanation: 'The paradox is not about ownership of other people’s work.'
          },
          {
            letter: 'C',
            text: 'Because it limits affordable access now to encourage the development of future treatments.',
            explanation: 'The immediate restriction is used in the hope of expanding treatment possibilities later.'
          },
          {
            letter: 'D',
            text: 'Because a temporary monopoly can still leave prices high after other manufacturers enter the market to compete.',
            explanation: 'The paragraph draws no conclusion about prices after competitors enter.'
          },
          {
            letter: 'E',
            text: 'Because limiting protection can reduce prices but leave manufacturers uncertain about whether they will recover their costs.',
            explanation: 'The paradox lies in granting protection at all, not in fixing its duration.'
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
            text: 'A company obtaining protection for a new treatment that performs substantially better than the previous drug.',
            explanation: 'A substantial therapeutic advance is different from a minor change used to prolong protection.'
          },
          {
            letter: 'B',
            text: 'A health ministry authorising a local company to produce a patented medicine during a public emergency.',
            explanation: 'This enables production by a competitor rather than renewing the original holder’s exclusivity.'
          },
          {
            letter: 'C',
            text: 'A manufacturer filing a patent on an experimental compound before any trials establish whether it is effective.',
            explanation: 'This is a first patent on a candidate, not protection extended on an existing product.'
          },
          {
            letter: 'D',
            text: 'A drugmaker offering the same patented medicine at different prices in markets with different income levels.',
            explanation: 'Changing the price does not extend a patent.'
          },
          {
            letter: 'E',
            text: 'A firm prolonging its market protection by patenting an insubstantial change to a tablet coating.',
            explanation: 'The minor modification is used to extend exclusivity.'
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
            text: 'Drivers who are willing to pay a toll may value their time more than people who choose to use a bus.',
            explanation: 'The passage does not estimate different groups’ willingness to pay for time savings.'
          },
          {
            letter: 'B',
            text: 'A shortage of city parking may transfer part of the cost of driving to people who live near busy roads.',
            explanation: 'The cost identified is delay for bus users, not the effect of a parking shortage.'
          },
          {
            letter: 'C',
            text: 'Ticket prices fail to reflect how much public money is spent on getting commuters into the city centre.',
            explanation: 'The example concerns wasted time on congested roads rather than the price of tickets.'
          },
          {
            letter: 'D',
            text: 'Congestion already exacts a cost from lower-income bus passengers even without a toll.',
            explanation: 'Their time is lost under the allegedly free arrangement.'
          },
          {
            letter: 'E',
            text: 'Some workers with access to public transport may prefer to drive because they need to make several stops.',
            explanation: 'The blind spot is an existing burden borne by bus users, not why some workers choose cars.'
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
            text: 'To show that charging drivers is easier when a city already has a good public transport system.',
            explanation: 'The examples describe acceptance after improvements are felt, not a prerequisite for starting.'
          },
          {
            letter: 'B',
            text: 'To illustrate how visible benefits can make a road charge more acceptable.',
            explanation: 'The examples support the case that experience can change perceptions of the policy.'
          },
          {
            letter: 'C',
            text: 'To suggest that cities must remove traffic from their centres before public transport services can begin to improve.',
            explanation: 'The passage does not make total removal of traffic a precondition.'
          },
          {
            letter: 'D',
            text: 'To establish that spending toll revenue on transport is the sole reason public opposition declined in both cities.',
            explanation: 'The examples do not isolate one factor; visible gains include improved air quality.'
          },
          {
            letter: 'E',
            text: 'To argue that policies approved by the public before introduction deliver more durable benefits than trial schemes.',
            explanation: 'The paragraph discusses acceptance after tangible benefits, not a requirement for prior approval.'
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
            text: 'To show that an object’s value can depend on how it came to exist.',
            explanation: 'The letter can have a different meaning despite retaining the same appearance.'
          },
          {
            letter: 'B',
            text: 'To distinguish objects that carry private messages from works that address a general audience.',
            explanation: 'The point transfers from letters to paintings; it is not a distinction between them.'
          },
          {
            letter: 'C',
            text: 'To suggest that a forgery can have value of its own if it conveys the same feeling as the original.',
            explanation: 'The analogy shows why matching the outward effect may not preserve the object’s value.'
          },
          {
            letter: 'D',
            text: 'To show why attachment to an object matters more than the intention behind its creation.',
            explanation: 'The original writer’s intention matters to the attachment in the first place.'
          },
          {
            letter: 'E',
            text: 'To show why deception can be objectionable even when an imitation is hard to tell from the original.',
            explanation: 'The loss at issue is the absence of an authentic act, not merely the wrong of being deceived.'
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
            text: 'The forgery’s technical achievement may seem greater because experts judge it by a different standard from the original.',
            explanation: 'The author\'s contrast concerns when and how the style was made, not how experts score skill.'
          },
          {
            letter: 'B',
            text: 'The forgery cannot keep its initial appearance for as long because it uses materials unknown to the original painter.',
            explanation: 'The author does not explain the distinction through the durability of material.'
          },
          {
            letter: 'C',
            text: 'The original was created to express a specific idea while the forgery was intended to reach a larger audience.',
            explanation: 'The passage does not distinguish the two by audience size.'
          },
          {
            letter: 'D',
            text: 'The original has an ownership record that can be assembled more easily than the record of the forged painting.',
            explanation: 'The argument concerns artistic production rather than methods for establishing provenance.'
          },
          {
            letter: 'E',
            text: 'The forgery imitates a style whose artistic possibilities have already been demonstrated.',
            explanation: 'The forger works backwards from an achievement rather than making that achievement independently.'
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
            text: 'Confidentiality shields officials from public criticism and should give way when a policy proves sufficiently unpopular.',
            explanation: 'Disagreement with a policy is not the test for disclosure.'
          },
          {
            letter: 'B',
            text: 'Confidentiality aids candid governance but cannot justify concealing serious wrongdoing.',
            explanation: 'The value of private deliberation depends on confidentiality serving public integrity.'
          },
          {
            letter: 'C',
            text: 'Confidentiality is justified during deliberations but should end once an institution has reached a decision.',
            explanation: 'The line the author draws concerns misconduct, not the stage of a decision.'
          },
          {
            letter: 'D',
            text: 'Confidentiality should yield when sharing withheld information would make it easier to debate an important policy.',
            explanation: 'Improving debate is a broader goal than exposing concrete wrongdoing.'
          },
          {
            letter: 'E',
            text: 'Confidentiality should bind individual officials, with any exceptions left to the discretion of their own institution.',
            explanation: 'That would not address cases where reporting channels within an institution have been compromised.'
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
            text: 'Because officials who report misconduct to authorised investigators would also be punished for breaching confidentiality.',
            explanation: 'The passage focuses on disclosures that would otherwise be unlawful, not reports already authorised.'
          },
          {
            letter: 'B',
            text: 'Because decision-makers would have to accept an official’s stated motives without testing them against the harm caused.',
            explanation: 'That is closer to the problem the author sees in blanket immunity, not in laws with no defence.'
          },
          {
            letter: 'C',
            text: 'Because courts would be expected to separate harmful leaks from disclosures involving little confidential information.',
            explanation: 'The author wants courts to be able to weigh both the value and harm of disclosures.'
          },
          {
            letter: 'D',
            text: 'Because principled disclosures receive the same treatment as spying.',
            explanation: 'Without a defence, exposing illegality has no distinct legal footing from selling secrets.'
          },
          {
            letter: 'E',
            text: 'Because members of the public would be unable to establish whether civil servants actually have a duty of confidentiality.',
            explanation: 'The author recognises duties of confidentiality; the problem is denying any principled exception.'
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
            text: 'An inspector releases falsified safety sheets after internal and independent reporting channels have both failed.',
            explanation: 'The inspector exhausts the reporting channels and releases the records needed to demonstrate concrete wrongdoing.'
          },
          {
            letter: 'B',
            text: 'An engineer sends a complete personnel archive to a reporter after exhausting internal appeals over falsified safety checks.',
            explanation: 'The release is much broader than needed, even though the concern is genuine.'
          },
          {
            letter: 'C',
            text: 'A clerk publishes a draft policy that clients might dislike after first raising objections with an independent ombudsman.',
            explanation: 'Using proper channels does not turn a policy disagreement into evidence of misconduct.'
          },
          {
            letter: 'D',
            text: 'An auditor who can report to an independent ombudsman sends a reporter an invoice that establishes a fraudulent payment.',
            explanation: 'The release is targeted, but the auditor skips an apparently viable reporting channel.'
          },
          {
            letter: 'E',
            text: 'A contractor gives a bidding rival evidence of altered scores after a regulator has begun investigating the same allegation.',
            explanation: 'The regulator is already acting and no need for this commercial disclosure is shown.'
          }
        ]
      }
    ]
  }
];

export const FULL_MOCK_PASSAGES: LnatPassage[] = [
  {
    id: 'p13-field-guide',
    title: 'The Unfinished Field Guide',
    domain: 'Natural History',
    sourceStyle: 'Book review · Natural history',
    wordCount: 465,
    freeTier: false,
    paragraphs: [
      'I read Mara Pell’s Field Guide to Ordinary Weather on a train that spent twenty minutes standing in a cutting. The window afforded a view of a brick wall, three pale weeds and a puddle the colour of tea. At the beginning of the delay I was annoyed that there was nothing to look at. By the end I had watched a patch of the wall dry in a pattern that made the mortar visible before the bricks. Had I been reading a more exciting book, I might have missed this.',
      'Pell advertises the guide as a book without a key. She means that it cannot be used to look up a cloud by working through questions about its shape. What she provides instead are accounts of looking, many of them unsuccessful. There is a striking account of two neighbours who independently keep records of the first frost, only to discover after a decade that one has been noting frost on a car roof and the other frost on the ground. They have not, as the shorter chapter might have had it, achieved agreement. They have found out why they disagree.',
      'The illustrations complicate the experiment. A drawing of a garden at dusk shows the same patch of grass four times; the difference between the third and fourth drawings struck me only when I stopped comparing them and looked at each in turn. But the index is a nuisance of another kind. To find the passage about frost again, I had to remember that the neighbours kept their notes on envelopes. The passage is listed under stationery. A device that trains one sort of attention can unnecessarily tax another. The trouble is not that stationery is an inherently frivolous subject. Knowing what people write on might matter to a historian of the practice. To a reader returning to this particular story, though, that detail is among the easiest to forget. There is a similar problem with the discussion of where mist collects: I found it under thresholds, which made it look like an essay on doors. Pell’s admirable refusal to tell me what to see does not require her to leave me guessing where she put it.',
      'I would not give this book to anyone who needed to decide whether it was safe to put out in a small boat. Nor would I leave it in the waiting room of a station where the trains run on time. It asks for more than a gap between diversions, but considerably less than the reverence with which it has already been received. I would give it to someone who has begun to say that the view from their kitchen window never changes. I would recommend keeping the receipt, in case they would rather have a new window.'
    ],
    questions: [
      {
        id: 'p13-q1',
        passageId: 'p13-field-guide',
        stem: 'In context, what does Pell mean by a book “without a key”?',
        skill: 'Inference',
        difficulty: 'Standard',
        paragraphRef: 2,
        correctLetter: 'B',
        rationale: 'The book lacks the identification procedure a reader could ordinarily expect from a field guide.',
        options: [
          { letter: 'A', text: 'A book that gives cloud names but omits the names of their discoverers.', explanation: 'The omitted device sorts cloud types; it is not a list of people.' },
          { letter: 'B', text: 'A guide that does not lead the reader through diagnostic choices.', explanation: 'Pell contrasts a procedure based on identifying features with accounts of the act of looking.' },
          { letter: 'C', text: 'A book whose observations must be checked against a separate guide.', explanation: 'No accompanying work is needed to read the observations.' },
          { letter: 'D', text: 'A guide that orders its material by the date on which it was collected.', explanation: 'The expression refers to a method of identification, not to chronological order.' },
          { letter: 'E', text: 'A book whose index lists settings instead of weather phenomena.', explanation: 'The index causes a separate problem later in the review.' }
        ]
      },
      {
        id: 'p13-q2',
        passageId: 'p13-field-guide',
        stem: 'What does the example of the neighbours contribute to the review?',
        skill: 'Structure & Evidence',
        difficulty: 'Challenging',
        paragraphRef: 2,
        correctLetter: 'E',
        rationale: 'The neighbours discover that their apparent factual disagreement arose because they were recording different things.',
        options: [
          { letter: 'A', text: 'It suggests that independent records become reliable once they span several years.', explanation: 'The passage of time did not reconcile the different practices.' },
          { letter: 'B', text: 'It gives a case in which combining records yields a more precise frost date.', explanation: 'The neighbours have no common event for which to calculate a date.' },
          { letter: 'C', text: 'It shows that the effects of frost are easier to detect on metal than on soil.', explanation: 'The comparison does not establish which location detects frost more easily.' },
          { letter: 'D', text: 'It illustrates a disagreement that persists because neither witness will share their records.', explanation: 'They compare their methods and discover the source of the discrepancy.' },
          { letter: 'E', text: 'It shows what observers can learn without arriving at a common answer.', explanation: 'They learn how their observations differ rather than settling on one date.' }
        ]
      },
      {
        id: 'p13-q3',
        passageId: 'p13-field-guide',
        stem: 'How does the last sentence qualify the recommendation?',
        skill: 'Tone & Attitude',
        difficulty: 'Standard',
        paragraphRef: 4,
        correctLetter: 'C',
        rationale: 'The receipt is a dry concession that a book about noticing change will not suit every frustrated observer.',
        options: [
          { letter: 'A', text: 'It implies that the people most in need of the book will not be able to afford it.', explanation: 'The receipt makes a return possible; it is not evidence about the price.' },
          { letter: 'B', text: 'It suggests that an unchanging view can erode the neighbourly habits the book describes.', explanation: 'The joke is directed at the potential reader’s preference, not at the neighbours’ habits.' },
          { letter: 'C', text: 'It allows that some recipients may prefer a practical change to a change in attention.', explanation: 'Buying a window is humorously offered as an alternative to seeing an existing view differently.' },
          { letter: 'D', text: 'It blames the publisher for presenting a demanding work as a suitable gift for casual readers.', explanation: 'The reviewer, not the publisher, makes the gift recommendation.' },
          { letter: 'E', text: 'It leaves the reader to decide whether Pell misrepresents the view from her own kitchen.', explanation: 'The window is the recipient’s; it does not put Pell’s testimony in doubt.' }
        ]
      },
      {
        id: 'p13-q4',
        passageId: 'p13-field-guide',
        stem: 'Which judgement best fits the review as a whole?',
        skill: 'Main Argument',
        difficulty: 'Challenging',
        paragraphRef: 3,
        correctLetter: 'D',
        rationale: 'The guide changes how one observes familiar things, although some of its design impedes ordinary use.',
        options: [
          { letter: 'A', text: 'Pell’s attention to small changes is admirable, but her anecdotes are less revealing than her identification advice.', explanation: 'Pell does not provide that sort of advice.' },
          { letter: 'B', text: 'Pell has made a useful reference work whose most imaginative material lies mainly in the drawings.', explanation: 'The reviewer finds the book awkward as a reference and values the written observations too.' },
          { letter: 'C', text: 'The departure from ordinary field guides works because train delays create an ideal setting for study.', explanation: 'The opening delay illustrates the book’s effect; it is not a condition of the book’s usefulness.' },
          { letter: 'D', text: 'The book rewards attentive looking without making all its inconveniences worthwhile.', explanation: 'The drawings are productively difficult; the index is difficult in a less rewarding way.' },
          { letter: 'E', text: 'The book invites readers to distrust trained observers and depend instead on familiar personal experience.', explanation: 'Discovering how observers collected their evidence is different from dismissing their expertise.' }
        ]
      }
    ]
  },
  {
    id: 'p14-clock-room',
    title: 'The Clock Room at Senn',
    domain: 'Transport History',
    sourceStyle: 'Historical narrative · Fictional archive',
    wordCount: 387,
    freeTier: false,
    paragraphs: [
      'When the new station opened at Senn in 1878, the platform clock and the town clock disagreed by seven minutes. This was neither scandal nor malfunction. The town clock had been set at noon by an observer in the square; the railway’s clock had been set by a signal from the terminus two counties away. The railway’s printed schedules used the terminus time. Travellers who purchased a timetable were accordingly advised to note which clock it was meant to accompany.',
      'This distinction became troublesome in the laundry behind the station. Its owner, Lida Verne, paid an extra penny to anyone who delivered the sheets for the first train. She opened the laundry by the town clock, whereas the porter who signed her delivery slips left by the railway clock. Her workers would sometimes lose the penny even though, by the clock they could see from the laundry yard, they had begun work as early as their neighbours. At a town meeting, a clerk proposed moving the opening bell seven minutes earlier. Verne objected that a bell loud enough to summon her workers would wake half the street.',
      'The railway offered another solution. It paid for a dial to be mounted outside the laundry and sent the station fitter to connect it to the platform clock. Within a month the workers were receiving their pennies regularly. Letters to the council continued nevertheless. The complainants were now shopkeepers whose apprentices pointed to the laundry clock when they arrived late, and to the town clock when they wanted to close. In the council papers the complaint takes up two pages; the workers’ pennies are not mentioned at all.',
      'Four years later the council reset the town clock without ceremony. A ledger of repairs records a charge for a ladder and new screws. What it does not record is any agreement on which account of noon was more accurate. The decision is often presented in anniversary histories as the moment Senn acquired a shared sense of time. That verdict seems a little quick. The people of Senn could already agree, to within a very few seconds, about what time the sun crossed the square. The ladder was purchased when it mattered more that the shop, the laundry and the railway could agree about what time an apprentice was due to arrive.'
    ],
    questions: [
      {
        id: 'p14-q1',
        passageId: 'p14-clock-room',
        stem: 'Why could a laundry worker be surprised to lose the extra penny?',
        skill: 'Inference',
        difficulty: 'Standard',
        paragraphRef: 2,
        correctLetter: 'E',
        rationale: 'The clock normally available to the worker was not the one governing the porter’s departure.',
        options: [
          { letter: 'A', text: 'The owner could not hear the town bell from where she counted deliveries.', explanation: 'The mismatch stems from the times used, not the owner’s ability to hear a bell.' },
          { letter: 'B', text: 'The clerk expected workers to change their start time before the opening bell was altered.', explanation: 'His proposal comes after the problem and is not implemented.' },
          { letter: 'C', text: 'The porter sometimes left, by the platform clock, ahead of the scheduled departure.', explanation: 'The porter follows railway time; no unscheduled early departure is reported.' },
          { letter: 'D', text: 'The delivery slips omitted how much pay was due for bringing the sheets.', explanation: 'The surprise concerns missing the train deadline, not reading the amount.' },
          { letter: 'E', text: 'The visible clock and the porter’s clock did not give the same time.', explanation: 'Starting promptly by one clock did not guarantee arriving in time by the other.' }
        ]
      },
      {
        id: 'p14-q2',
        passageId: 'p14-clock-room',
        stem: 'Which later finding would most weaken the narrator’s account of why the council reset the clock?',
        skill: 'Assumption & Flaw',
        difficulty: 'Challenging',
        paragraphRef: 4,
        correctLetter: 'A',
        rationale: 'If a documented defect independently triggered the reset, the evidence would favour a mechanical explanation over coordination.',
        options: [
          { letter: 'A', text: 'Repair instructions show that the faulty clock was reset to any available reference as part of an unrelated overhaul.', explanation: 'An independent mechanical cause would weaken the claim about aligning work times.' },
          { letter: 'B', text: 'Several railway workers kept their watches set to the terminus time before the town clock was reset.', explanation: 'That freedom is consistent with the inconvenience of multiple local standards.' },
          { letter: 'C', text: 'One shopkeeper complained that the railway dial on the laundry wall could not be read at night.', explanation: 'This introduces another difficulty without showing why the town clock was reset.' },
          { letter: 'D', text: 'The council bought new screws from a shop whose apprentices had been named in the complaints.', explanation: 'The supplier does not tell us what prompted the work.' },
          { letter: 'E', text: 'Other towns on the same route reset their clocks in response to complaints about closing times.', explanation: 'A similar decision for similar reasons supports the narrator’s interpretation.' }
        ]
      },
      {
        id: 'p14-q3',
        passageId: 'p14-clock-room',
        stem: 'Which interpretation of Senn’s history would the narrator be most likely to reject?',
        skill: 'Main Argument',
        difficulty: 'Challenging',
        paragraphRef: 4,
        correctLetter: 'B',
        rationale: 'The last paragraph explicitly distinguishes pre-existing agreement about the sun from later agreement about schedules.',
        options: [
          { letter: 'A', text: 'The public record of a reform may give more attention to one trade than to another.', explanation: 'The recorded complaints foreground shopkeepers and omit the workers’ pennies.' },
          { letter: 'B', text: 'Before the clocks matched, residents had no basis for agreeing on a local noon.', explanation: 'They could already agree when the sun crossed the square.' },
          { letter: 'C', text: 'Different clocks became troublesome as work came to depend on more than one schedule.', explanation: 'The laundry episode illustrates this exactly.' },
          { letter: 'D', text: 'The change to the town clock solved coordination problems without settling a question about accuracy.', explanation: 'The ledger records no resolution of that dispute.' },
          { letter: 'E', text: 'A mundane entry in a repair ledger may record a consequential change in working life.', explanation: 'The passage uses the ladder and screws in just this way.' }
        ]
      }
    ]
  },
  {
    id: 'p15-reading-the-foam',
    title: 'Reading the Foam',
    domain: 'Coastal Science',
    sourceStyle: 'Popular-science explainer · Field observation',
    wordCount: 539,
    freeTier: false,
    paragraphs: [
      'Stand on the same headland on two mornings after a storm. If pale foam extends almost to the horizon on the first and lies in a narrow ribbon along the beach on the second, has something in the water changed? It may have. But the visible boundary of a foam patch is not a reliable map of where the material that makes the foam entered the sea.',
      'Imagine shaking two jars, one containing plain water and the other water to which you have added a little washing-up liquid. The plain water makes bubbles too; they soon break. In the other jar a persistent foam forms because certain molecules gather where the air meets the water. The headland is an open-air version of the experiment with an inconveniently complicated shaker. Breaking waves supply air and agitation. Decaying seaweed and other living material can supply the molecules. An industrial discharge can supply them as well. Appearance alone does not distinguish these sources.',
      'Now imagine walking inland while watching fallen leaves move down a street. They repeatedly collect against the same kerb, although none of the trees is rooted there. A ribbon of foam can behave like those leaves. Wind and surface currents move the bubbles and may concentrate them where flows meet; the original ingredients could have been released across an area much larger than the final patch. This is why someone who begins at the thickest part of the ribbon and looks directly shoreward for a pipe may be looking in precisely the wrong direction. There is a further complication: the path taken by the bubbles need not be the path travelled by the dissolved material before those bubbles formed. Imagine a leaf that falls into a drain, travels beneath the pavement, then emerges at a grating and blows against the kerb. Someone who tracks it from the grating learns something useful without learning where the tree stood. A photograph from the headland similarly records the visible end of a sequence, not every stage of it.',
      'A field team could sample on both sides of the ribbon and test whether the water there contains identifiable compounds at different concentrations. It could use floating markers to track where surface water came from. Neither technique by itself would settle a difficult case. A compound that occurs in seaweed and a cleaning product does not identify the source; a marker that travels from a harbour through the patch does not establish what the harbour released. But together the techniques can turn a guess into a claim that could be tested. A useful test would specify where the signature ought to appear if the claim were right, then look for it in comparable places where it is not expected. Finding the same signature everywhere would call for a broader explanation. Finding it only in the patch would still leave the question of how long it had been travelling.',
      'The next morning the foam may vanish. This is good news if it was blocking the view of the tideline. It is not by itself good news about the quality of the water. Perhaps the wind fell; a sea without its shaker may be just as rich in the ingredients as it was the day before.'
    ],
    questions: [
      {
        id: 'p15-q1',
        passageId: 'p15-reading-the-foam',
        stem: 'Why does the writer introduce leaves collecting by a kerb?',
        skill: 'Structure & Evidence',
        difficulty: 'Standard',
        paragraphRef: 3,
        correctLetter: 'C',
        rationale: 'The leaves make visible the distinction between where material originates and where transport concentrates it.',
        options: [
          { letter: 'A', text: 'To explain why foam tends to form more easily in sheltered places.', explanation: 'The example explains where foam collects, not what conditions create it.' },
          { letter: 'B', text: 'To show that waves and wind can break down visible material at different rates.', explanation: 'The contrast concerns transport rather than breakdown.' },
          { letter: 'C', text: 'To separate the place of accumulation from the place of origin.', explanation: 'The kerb gathers leaves despite being some distance from their trees.' },
          { letter: 'D', text: 'To illustrate how an obstruction can produce the molecules needed for bubbles.', explanation: 'The kerb catches leaves but supplies none.' },
          { letter: 'E', text: 'To clarify why organic ingredients are more likely than pollutants to drift.', explanation: 'Leaf movement is an analogy for all the foam under discussion, not just naturally sourced foam.' }
        ]
      },
      {
        id: 'p15-q2',
        passageId: 'p15-reading-the-foam',
        stem: 'Which result would most strengthen the claim that a particular harbour discharge produced the foam?',
        skill: 'Assumption & Flaw',
        difficulty: 'Challenging',
        paragraphRef: 4,
        correctLetter: 'D',
        rationale: 'The strongest evidence both identifies a specific contribution and provides a plausible route to the patch.',
        options: [
          { letter: 'A', text: 'The foam contains a compound found in both harbour effluent and stranded seaweed.', explanation: 'A shared compound cannot discriminate between the proposed sources.' },
          { letter: 'B', text: 'Markers released in the harbour drift through the patch on mornings when local boats are working.', explanation: 'This demonstrates a route, not what was carried along it.' },
          { letter: 'C', text: 'The thickest foam usually forms near the harbour when winds are unusually strong.', explanation: 'Wind can concentrate foam independently of where its ingredients originated.' },
          { letter: 'D', text: 'A tracer unique to the discharge is found in the foam along a marker-confirmed path from the harbour.', explanation: 'Both the distinguishing chemical signature and the transport evidence point to the same source.' },
          { letter: 'E', text: 'Breaking waves reliably create new bubbles along the edge of the harbour entrance.', explanation: 'This identifies a possible means of agitation, not the origin of the stabilising ingredients.' }
        ]
      },
      {
        id: 'p15-q3',
        passageId: 'p15-reading-the-foam',
        stem: 'All of the following are consistent with the passage EXCEPT which one?',
        skill: 'Inference',
        difficulty: 'Standard',
        paragraphRef: 5,
        correctLetter: 'E',
        rationale: 'A loss of agitation may make foam disappear without removing its ingredients.',
        options: [
          { letter: 'A', text: 'Several sources can contribute chemically similar ingredients to a patch of foam.', explanation: 'The text says one compound can occur in both seaweed and a cleaning product.' },
          { letter: 'B', text: 'Foam can accumulate away from the place where its ingredients entered the water.', explanation: 'The leaves at the kerb demonstrate this possibility.' },
          { letter: 'C', text: 'Rougher conditions can make a change at the surface visible without a new discharge.', explanation: 'The strength of the shaker can change even if the ingredients do not.' },
          { letter: 'D', text: 'Finding a route from a harbour to a foam patch leaves a question about what the harbour released.', explanation: 'The writer distinguishes marker evidence from chemical evidence.' },
          { letter: 'E', text: 'The disappearance of foam shows that its ingredients have left the water.', explanation: 'The last paragraph directly separates disappearance of foam from loss of ingredients.' }
        ]
      },
      {
        id: 'p15-q4',
        passageId: 'p15-reading-the-foam',
        stem: 'Which example most closely parallels the error of looking for a pipe directly inland from the foam’s thickest point?',
        skill: 'Assumption & Flaw',
        difficulty: 'Challenging',
        paragraphRef: 3,
        correctLetter: 'B',
        rationale: 'The error treats the place where transported material accumulated as evidence for the nearest origin.',
        options: [
          { letter: 'A', text: 'A curator dates a letter from its paper and checks the estimate against the surviving postmark.', explanation: 'The curator tests a hypothesis with independent evidence.' },
          { letter: 'B', text: 'A groundskeeper assumes the tree nearest a heap left by the wind must have dropped the leaves in it.', explanation: 'The groundskeeper ignores the processes that could concentrate material from elsewhere.' },
          { letter: 'C', text: 'A cyclist decides to repair a tyre after finding a small nail still embedded beside the puncture.', explanation: 'The nail links the damage to a possible cause rather than merely sharing a location after transport.' },
          { letter: 'D', text: 'A shopkeeper sees umbrellas on sale at two stores and concludes that both have the same supplier.', explanation: 'The problem is insufficiently distinctive evidence, not confusing a destination with a point of origin.' },
          { letter: 'E', text: 'A painter mistakes a stain on glass for a reflection from the opposite side of the street.', explanation: 'This confuses two visual phenomena, not the location of a source and the point of deposition.' }
        ]
      }
    ]
  },
  {
    id: 'p16-spare-key',
    title: 'A Key for Tuesdays',
    domain: 'Family & Memory',
    sourceStyle: 'Memoir · Braided recollection',
    wordCount: 387,
    freeTier: false,
    paragraphs: [
      'The first thing I bought with my father’s housekeeping money was a yellow bowl. I had been sent to replace a white bowl that I had dropped, and the yellow one was no cheaper and did not fit in the cupboard. He used it every Tuesday for the bread he made on his day off. I took this for forgiveness. It was probably easier than returning the bowl.',
      'When he stopped making bread, we kept meeting on Tuesdays. I would bring a loaf and he would complain about the thickness of the slices. One week he was asleep when I arrived and his neighbour let me sit on the step in her coat. On my way home I had a spare key cut. I put it on the table the following week and said it would save trouble. He slid it back to my side. I took the gesture to mean I could keep it.',
      'Much later, sorting papers, I found a small square of cardboard to which he had taped a key. On it he had written my name and, underneath, Tuesday. It was not the key I had cut: that was still on my ring. This one had the blue paint he put on everything that belonged to his front door. I tried it even though there was nobody left to hear me turn the lock.',
      'My brother says the two keys amount to the same thing. We both had the means to let ourselves in, and on the day the pipes froze that was all either of us needed. I keep thinking instead of the Tuesday when my father slid the key across the table. There was a question I did not have to ask if I allowed the movement of his hand to answer it. The cardboard square suggests he had been considering an answer of his own.',
      'The locksmith has since changed the cylinder. I threw out three keys in the course of that morning, each after trying it on the old lock while it was still in the door. I kept the one with the blue paint. I have nowhere to use it and no plans to have it mounted or framed. It is in a yellow bowl, which turned out to fit in the cupboard when I moved the shelf.'
    ],
    questions: [
      {
        id: 'p16-q1',
        passageId: 'p16-spare-key',
        stem: 'What is the “question” the narrator did not have to ask?',
        skill: 'Inference',
        difficulty: 'Standard',
        paragraphRef: 4,
        correctLetter: 'D',
        rationale: 'The narrator could treat the returned key as permission rather than asking whether the father actually wanted independent entry.',
        options: [
          { letter: 'A', text: 'Whether the neighbour could lend the narrator a coat again if the father was asleep.', explanation: 'The coat explains the wait, not the meaning of the returned key.' },
          { letter: 'B', text: 'Whether the narrator’s copy would actually operate the door lock.', explanation: 'The movement of the father’s hand cannot demonstrate whether a key works.' },
          { letter: 'C', text: 'Whether the narrator’s brother should also have a key to the house.', explanation: 'The brother appears later and no gesture addresses his access.' },
          { letter: 'D', text: 'Whether the father wanted the narrator to let themself in.', explanation: 'The narrator could infer permission from the gesture without asking for it.' },
          { letter: 'E', text: 'Whether the father knew a less expensive way of getting a key cut.', explanation: 'The key had already been cut; the cost is not the issue.' }
        ]
      },
      {
        id: 'p16-q2',
        passageId: 'p16-spare-key',
        stem: 'What difference between the keys matters most to the narrator?',
        skill: 'Inference',
        difficulty: 'Challenging',
        paragraphRef: 4,
        correctLetter: 'C',
        rationale: 'One key originated in the narrator’s arrangements; the other is evidence of the father preparing a gesture of his own.',
        options: [
          { letter: 'A', text: 'The key the narrator cut had no practical value when the pipes froze.', explanation: 'The brother’s point is precisely that practical access did matter then.' },
          { letter: 'B', text: 'The key with blue paint could be trusted to work when a duplicate might fail.', explanation: 'The narrator tries the key but does not give mechanical reliability as a reason for keeping it.' },
          { letter: 'C', text: 'The keys offer similar access but embody decisions made by different people.', explanation: 'The taped and labelled key bears evidence of the father’s own consideration.' },
          { letter: 'D', text: 'The unpainted key implied a standing invitation while the painted one limited entry to emergencies.', explanation: 'The label says Tuesday; nothing says emergencies only.' },
          { letter: 'E', text: 'The key on the cardboard was a replacement for the key the narrator had lost.', explanation: 'The narrator’s own key was still on their ring.' }
        ]
      },
      {
        id: 'p16-q3',
        passageId: 'p16-spare-key',
        stem: 'What does the return to the bowl in the ending chiefly accomplish?',
        skill: 'Structure & Evidence',
        difficulty: 'Challenging',
        paragraphRef: 5,
        correctLetter: 'A',
        rationale: 'The object the narrator once interpreted as a sign of forgiveness now holds another object whose significance exceeds its practical use.',
        options: [
          { letter: 'A', text: 'It lets an ordinary object connect two occasions on which the narrator tries to read the father’s intentions.', explanation: 'The early interpretation of the bowl and the later interpretation of the key give the object this double role.' },
          { letter: 'B', text: 'It demonstrates that moving the shelf was the practical repair the father had wanted to make all along.', explanation: 'There is no evidence that the father meant to rearrange the cupboard.' },
          { letter: 'C', text: 'It shifts the story’s emphasis from the relationship to the problem of disposing of the father’s belongings.', explanation: 'Keeping the key matters because of the relationship, not because the passage changes its subject.' },
          { letter: 'D', text: 'It confirms that the father chose bread-making to excuse the narrator’s original mistake.', explanation: 'The opening explicitly leaves that explanation uncertain.' },
          { letter: 'E', text: 'It shows the narrator has come to accept the brother’s view that memories should depend on an object’s everyday utility.', explanation: 'The narrator keeps a key with no use.' }
        ]
      }
    ]
  },
  {
    id: 'p17-quiet-office',
    title: 'A Modest Improvement in Quiet',
    domain: 'Public Administration',
    sourceStyle: 'Satirical column · Institutional report',
    wordCount: 390,
    freeTier: false,
    paragraphs: [
      'Residents of Ordel will be relieved to learn that the Office for Street Quiet recorded a substantial fall in complaints this spring. In March it took the public telephone off the hook for one afternoon while the carpet was being cleaned. The next day, which happened to be the day of the report, the Office observed a steep decline in the number of residents who had managed to complain. No change that inexpensive has ever produced such an immediate effect on the town’s published state of mind.',
      'The Office might at this point have succumbed to the temptation to do nothing further. Instead it set about finding out which streets had improved most. A trial was arranged in which two residents called from an address near the sawmill and two from the terrace behind the bakery. The sawmill callers were kept on hold for the duration of a short recording explaining the benefits of the town’s new quiet-hours policy. The callers behind the bakery got straight through. The Office therefore plans to put a special emphasis on the bakery district, where concerns are evidently easier to establish.',
      'A resident who attempted to report a midnight delivery in person was directed to a chart in the entrance. He asked whether the chart included complaints about the sounds made by vehicles. The attendant explained that it included complaints about anything, as long as they arrived by telephone. Asked if he could use the Office telephone, the resident was told there was no facility for making a complaint from the street it was about unless he was actually standing in that street. He went back. The Office did not hear from him again, a sequence of events that is expected to count in favour of the new policy.',
      'Next month the Office will install a glass roof over the entrance. Under the present roof it cannot tell whether the queue has reached the pavement, and a queue on the pavement would be inconvenient to overlook in person. The new roof will turn out not to be transparent after all: a manufacturer has agreed to print a copy of the chart on it at no charge. Should the residents find there is nowhere left to make themselves heard, the Office hopes they will stand beneath the chart and appreciate the distance they have come.'
    ],
    questions: [
      {
        id: 'p17-q1',
        passageId: 'p17-quiet-office',
        stem: 'Why is “the town’s published state of mind” a comic description?',
        skill: 'Tone & Attitude',
        difficulty: 'Standard',
        paragraphRef: 1,
        correctLetter: 'E',
        rationale: 'The phrase attributes a change in how residents feel to a change in what the Office can record.',
        options: [
          { letter: 'A', text: 'It treats frustrated callers as though their opinions had become a local newspaper’s official policy.', explanation: 'No newspaper is involved.' },
          { letter: 'B', text: 'It uses a solemn phrase for an unexpectedly loud event in the Office itself.', explanation: 'The event changes record-taking, not the level of noise inside the Office.' },
          { letter: 'C', text: 'It suggests that residents objected to the report before the Office released it.', explanation: 'The order of objection and publication is not what makes the phrase comic.' },
          { letter: 'D', text: 'It implies that the town had formally agreed to measure residents’ satisfaction through periodic votes.', explanation: 'Nothing describes a vote.' },
          { letter: 'E', text: 'It makes a decline in recorded calls sound like a change in public feeling.', explanation: 'The discrepancy between the number and the condition it supposedly represents drives the joke.' }
        ]
      },
      {
        id: 'p17-q2',
        passageId: 'p17-quiet-office',
        stem: 'What is the central flaw in the Office’s comparison of the two districts?',
        skill: 'Assumption & Flaw',
        difficulty: 'Challenging',
        paragraphRef: 2,
        correctLetter: 'B',
        rationale: 'The means of reporting were deliberately made unequal, so the counts cannot stand in for noise or concern.',
        options: [
          { letter: 'A', text: 'The Office assigned residents from each street rather than asking them to judge the other street’s noise.', explanation: 'Cross-district judgement is not needed to compare the ability to report.' },
          { letter: 'B', text: 'It treats reports made under different access conditions as comparable evidence of concern.', explanation: 'Holding some callers in a queue introduces a difference unrelated to what bothers them.' },
          { letter: 'C', text: 'It assumes that people living near a bakery are more tolerant of deliveries than people living near a sawmill.', explanation: 'The recorded effect is the relative ease of registering concern, not tolerance of specific sounds.' },
          { letter: 'D', text: 'It counts multiple attempts from the same caller as separate complaints.', explanation: 'The trial does not describe repeated calls.' },
          { letter: 'E', text: 'It confuses the time at which the calls were placed with the time at which the sounds originally occurred.', explanation: 'The callers’ wait, not the events’ timing, exposes the mismatch.' }
        ]
      },
      {
        id: 'p17-q3',
        passageId: 'p17-quiet-office',
        stem: 'What does “a sequence of events” refer to most directly?',
        skill: 'Inference',
        difficulty: 'Standard',
        paragraphRef: 3,
        correctLetter: 'D',
        rationale: 'A resident tries in person, is sent back to the street he was reporting and is not heard from again.',
        options: [
          { letter: 'A', text: 'The introduction of the quiet-hours policy followed by the sawmill callers waiting on hold.', explanation: 'That belongs to the trial in the previous paragraph.' },
          { letter: 'B', text: 'The cleaning of the Office carpet followed by the first reduction in telephone reports.', explanation: 'That is the initial incident, not the immediately preceding account.' },
          { letter: 'C', text: 'The delivery at midnight followed by a record of its noise on the chart.', explanation: 'The resident’s report is never recorded in the chart.' },
          { letter: 'D', text: 'The resident’s attempt to complain, his departure and the lack of a subsequent report.', explanation: 'That is the chain the Office can misread as a policy success.' },
          { letter: 'E', text: 'The Office’s decision to build a new roof followed by the offer of printing from a manufacturer.', explanation: 'Those events are introduced only in the next paragraph.' }
        ]
      },
      {
        id: 'p17-q4',
        passageId: 'p17-quiet-office',
        stem: 'Which proposed “improvement” most closely extends the satire’s target?',
        skill: 'Main Argument',
        difficulty: 'Challenging',
        paragraphRef: 1,
        correctLetter: 'C',
        rationale: 'The column ridicules practices that make performance look better by suppressing the evidence that would measure it.',
        options: [
          { letter: 'A', text: 'A complaints desk issues a summary showing which reports it was unable to verify.', explanation: 'This could make uncertainty more visible rather than suppress reports.' },
          { letter: 'B', text: 'A library moves noisy events away from its reading room and compares sound readings before and after.', explanation: 'An independent measure could establish an actual improvement.' },
          { letter: 'C', text: 'A clinic shortens its reported waiting list by requiring patients to reapply before it counts them.', explanation: 'It can make the measure improve without changing the underlying need.' },
          { letter: 'D', text: 'A station closes its ticket queue for a drill and notes the closure beside its delay figures.', explanation: 'The note makes the measurement condition visible.' },
          { letter: 'E', text: 'A council compares people’s reports about traffic with observations at times they identify as troublesome.', explanation: 'This tests complaints against other evidence rather than creating a barrier to reporting.' }
        ]
      }
    ]
  },
  {
    id: 'p18-lantern-path',
    title: 'The Lantern Path Decision',
    domain: 'Public Law',
    sourceStyle: 'Case report · Fictional appellate judgment',
    wordCount: 400,
    freeTier: false,
    paragraphs: [
      'Until the lamps were removed, the shortest walk from Baret station to the hospital was along Lantern Path. A deed permitted residents of three adjoining streets to use the path “while maintained for pedestrian passage”. The hospital owned the land and had kept the surface and lighting in repair for forty years. It removed the lamps when a contractor priced their replacement and put up a notice stating that it no longer maintained the path. The next morning it locked the gates. The residents applied for an order reopening them.',
      'At the first hearing the hospital argued that the notice was enough. Maintenance, it said, was its own voluntary act. Once it stopped doing the act, the permission ended. The residents argued that a paved route did not cease to be maintained merely because its owner said so. It still had the level surface the hospital had put down, and it could be used during daylight. The first judge ordered that the path be accessible from sunrise to sunset. Neither side was content, and both appealed.',
      'The appellate court agreed that the deed should not be read as a perpetual obligation to undertake work. If storm damage left the path unusable and the owner chose not to restore it, the court would not order reconstruction under this deed. But the hospital’s reading would let an owner withdraw permission whenever it wished by performing a token act of neglect. The words described a condition of the path, the court said, rather than a new decision for the owner to make each morning. They did not make an otherwise safe path unmaintained at the instant a notice went up.',
      'The court then declined to confirm the daylight order. It found that the first judge had inferred safety from the existence of paving without hearing evidence about conditions along the whole path. A section crossed by delivery vehicles could be unsafe even under a clear sky. Whether that was in fact so was a matter for witnesses. The court sent the case back to determine when, if at all, the path remained safe for pedestrian use, and directed that the gates remain as they were until the hearing. Thus the hospital lost on the meaning of the deed and retained its locked gates for the time being. The residents won on the meaning of the deed and still had to catch the bus.'
    ],
    questions: [
      {
        id: 'p18-q1',
        passageId: 'p18-lantern-path',
        stem: 'What is the role of the example of storm damage in the appellate court’s reasoning?',
        skill: 'Structure & Evidence',
        difficulty: 'Standard',
        paragraphRef: 3,
        correctLetter: 'B',
        rationale: 'It marks a limit: the deed can preserve access to a usable path without obliging the owner to restore an unusable one.',
        options: [
          { letter: 'A', text: 'It identifies the original reason the hospital removed lighting from the path.', explanation: 'The stated reason was the replacement estimate, not a storm.' },
          { letter: 'B', text: 'It distinguishes an access condition from a duty to reconstruct the path.', explanation: 'The court can reject the hospital’s interpretation without imposing indefinite repair duties.' },
          { letter: 'C', text: 'It shows that a hospital must prove that circumstances outside its control caused any defect.', explanation: 'The example illustrates one case rather than imposing that general burden.' },
          { letter: 'D', text: 'It explains why the residents should first have asked for repairs instead of seeking to reopen the gates.', explanation: 'The court uses the example to interpret the deed, not to prescribe a different claim.' },
          { letter: 'E', text: 'It establishes that losing the lamps has the same practical effect as losing the paving.', explanation: 'The safety implications of removing the lamps remain to be determined.' }
        ]
      },
      {
        id: 'p18-q2',
        passageId: 'p18-lantern-path',
        stem: 'Which finding at the new hearing would most support retaining the locked gates under the appellate court’s interpretation?',
        skill: 'Assumption & Flaw',
        difficulty: 'Challenging',
        paragraphRef: 4,
        correctLetter: 'E',
        rationale: 'If the route is unsafe even in daylight, the residents cannot rely on those hours as a safe period of access.',
        options: [
          { letter: 'A', text: 'Replacement lamps would cost more than the hospital expected when it signed the deed.', explanation: 'Cost does not establish that the route is unsafe now.' },
          { letter: 'B', text: 'The posted notice was legible from all three adjoining streets on the day it was issued.', explanation: 'Notice alone does not settle the condition of the path.' },
          { letter: 'C', text: 'Residents could get to the hospital faster by walking than by taking the current bus.', explanation: 'Convenience does not establish safety.' },
          { letter: 'D', text: 'The former lamps sometimes failed shortly before sunrise without residents lodging complaints.', explanation: 'An absence of complaints about earlier lighting failures does not establish present conditions.' },
          { letter: 'E', text: 'An unprotected crossing makes the route unsafe whenever pedestrians could use it.', explanation: 'This directly addresses the remaining factual condition, including the daylight hours.' }
        ]
      },
      {
        id: 'p18-q3',
        passageId: 'p18-lantern-path',
        stem: 'Which result did the residents obtain from the appellate court?',
        skill: 'Inference',
        difficulty: 'Challenging',
        paragraphRef: 4,
        correctLetter: 'A',
        rationale: 'They defeated the legal argument that the owner could end access simply by declaring an end to maintenance, but did not obtain immediate access.',
        options: [
          { letter: 'A', text: 'A ruling on the deed in their favour, without an immediate order opening the path.', explanation: 'The court rejected the hospital’s reading but left the gates in their existing state pending the hearing.' },
          { letter: 'B', text: 'A binding finding that the path was safe during daylight, but not after sunset.', explanation: 'The court declined to confirm the daylight ruling.' },
          { letter: 'C', text: 'An order requiring replacement lamps before the path reopened to the public.', explanation: 'The court did not impose a repair requirement.' },
          { letter: 'D', text: 'Recognition of a right to use the path regardless of the state of repair.', explanation: 'The condition of the path is central to the appellate interpretation.' },
          { letter: 'E', text: 'A declaration that the hospital could close the path only if a storm put it beyond repair.', explanation: 'The storm is an illustration, not a complete definition of when access can end.' }
        ]
      }
    ]
  },
  {
    id: 'p19-market-letters',
    title: 'What the Market Bell Says',
    domain: 'Civic Life',
    sourceStyle: 'Correspondence · Letter and reply',
    wordCount: 397,
    freeTier: false,
    paragraphs: [
      'To the editor: Last Friday I was asked by the market steward to stop weighing pears when the closing bell sounded. I had not taken anyone’s money, although a customer was holding out a bag. The steward explained that the bell did not tell us when to stop making sales; it told us when to stop anything from which a sale might follow. I asked if I could answer the customer’s question about whether the pears would ripen indoors. The steward, who had been friendly until then, began to wind up the cable for my scales.',
      'I have read the minutes in which the council agreed to a closing bell. The concern there was that delivery vans could not cross the square while stallholders and customers remained in their way. I do not dispute that concern. But my stall stands on the stone steps, above the part of the square the vans use. A rule devised to let vehicles through has acquired the power to decide when a conversation may start. If the council wants the steps empty at four, it can say so in the minutes, preferably before it rents them to me. — Nell Adair, stallholder',
      'Reply from the market steward: Ms Adair is right about the vans. She omits that the council tried clearing one part of the square at a time the previous winter. People waiting at stalls moved into the lanes we were trying to clear because they could not tell which queues were about to close. The bell gave us a single instruction we could explain above the sound of engines. I am not in a position to decide whose conversation is going to turn into a queue.',
      'I should not have started on the cable while Ms Adair was speaking. I should have asked whether her customer could stand beside her, on the steps, while the vans passed. That would have been manageable on Friday. If we permit that every week, however, we will need a way of indicating which stalls can keep serving after the bell. Ms Adair thinks this is a question for the council. On that point I am happy to agree, provided the council lends us someone to stand in the square and explain whatever we decide. People hear a bell from the street around the corner. They do not generally hear minutes. — Ivo Marsh, market steward'
    ],
    questions: [
      {
        id: 'p19-q1',
        passageId: 'p19-market-letters',
        stem: 'Which proposition do Adair and Marsh both accept?',
        skill: 'Main Argument',
        difficulty: 'Standard',
        paragraphRef: 3,
        correctLetter: 'C',
        rationale: 'Both writers acknowledge the need to allow delivery vehicles through; they disagree about the scope and implementation of the rule.',
        options: [
          { letter: 'A', text: 'The council tried separate closing times mainly because it wanted to extend trading on the steps.', explanation: 'Adair does not discuss the previous trial, and Marsh describes its effects, not that motive.' },
          { letter: 'B', text: 'The market should clear the steps in the same way it clears the vehicle lanes.', explanation: 'Adair disputes that the vehicle concern extends to her stall.' },
          { letter: 'C', text: 'The market needs a way to let the delivery vans cross the square.', explanation: 'Adair accepts the concern in the minutes; Marsh begins by agreeing about the vans.' },
          { letter: 'D', text: 'The closing bell should give each stallholder discretion to decide when a queue is manageable.', explanation: 'Marsh wants an intelligible policy, not individual discretion as a standing rule.' },
          { letter: 'E', text: 'Any conversation that might lead to a sale should end at the same time.', explanation: 'The letter challenges this application of the bell.' }
        ]
      },
      {
        id: 'p19-q2',
        passageId: 'p19-market-letters',
        stem: 'What is Marsh doing with the observation that people do not “hear minutes”?',
        skill: 'Tone & Attitude',
        difficulty: 'Challenging',
        paragraphRef: 4,
        correctLetter: 'E',
        rationale: 'Marsh contrasts writing a rule with communicating it to the people who must act on it.',
        options: [
          { letter: 'A', text: 'Complaining that stallholders and customers have been formally barred from council meetings.', explanation: 'The point is about reaching people in the market, not admission to meetings.' },
          { letter: 'B', text: 'Suggesting that Adair has cited an unreliable record of why the bell was adopted.', explanation: 'Marsh agrees with her account of the recorded concern.' },
          { letter: 'C', text: 'Treating the need to clear the square as too urgent for a recorded decision.', explanation: 'He agrees the council should decide, but raises what comes afterwards.' },
          { letter: 'D', text: 'Arguing that the earlier trial of phased closing failed because the council kept no minutes.', explanation: 'He ascribes the trial’s problem to people’s uncertainty over which queues were closing.' },
          { letter: 'E', text: 'Pointing out that a decision on paper does not give people a clear signal on the ground.', explanation: 'Minutes record policy; the bell can reach people who need to respond immediately.' }
        ]
      },
      {
        id: 'p19-q3',
        passageId: 'p19-market-letters',
        stem: 'Which proposal would best meet the main practical concerns raised in both letters?',
        skill: 'Assumption & Flaw',
        difficulty: 'Challenging',
        paragraphRef: 4,
        correctLetter: 'B',
        rationale: 'The strongest compromise allows service where it does not obstruct the vehicles and communicates the distinction clearly.',
        options: [
          { letter: 'A', text: 'End sales at the bell but permit stallholders throughout the square to finish conversations that have already started.', explanation: 'Marsh argues that the steward cannot reliably separate harmless conversations from potential queues.' },
          { letter: 'B', text: 'Mark the steps as a late-service zone and use staffed signs to direct customers clear of the van lanes.', explanation: 'This preserves trading on the steps while making the exception intelligible and keeping the lanes clear.' },
          { letter: 'C', text: 'Use two different bells in quick succession but leave individual stallholders to explain the distinction.', explanation: 'The added signal may not resolve where customers can safely queue.' },
          { letter: 'D', text: 'Let individual stallholders extend service when they judge that no vehicles are approaching the square.', explanation: 'That would place the clearance decision back on people who cannot necessarily see the whole square.' },
          { letter: 'E', text: 'Publish an explanation of the closing rule in the minutes and require all stalls to stop at the bell.', explanation: 'That documents the reasons without addressing Adair’s case for a limited exception.' }
        ]
      },
      {
        id: 'p19-q4',
        passageId: 'p19-market-letters',
        stem: 'Which statement about the unnamed customer is best supported?',
        skill: 'Inference',
        difficulty: 'Standard',
        paragraphRef: 1,
        correctLetter: 'D',
        rationale: 'The customer was poised to engage with the stall, but Adair explicitly says she had taken no money.',
        options: [
          { letter: 'A', text: 'The customer left the queue because they could not distinguish the bell from an engine.', explanation: 'The letters do not describe the customer’s departure or hearing.' },
          { letter: 'B', text: 'The customer had already bought pears and was waiting for them to be weighed.', explanation: 'No money had been taken; neither letter establishes a completed sale.' },
          { letter: 'C', text: 'The customer was standing in the part of the square used by vans.', explanation: 'Marsh proposes a location but does not establish where the customer was standing.' },
          { letter: 'D', text: 'The customer was interested in the pears, but the letters do not establish a completed purchase.', explanation: 'The bag and ripening question show interest; Adair’s account stops short of a sale.' },
          { letter: 'E', text: 'The customer returned the next week to check whether trading could continue on the steps.', explanation: 'No later visit appears in either letter.' }
        ]
      }
    ]
  },
  {
    id: 'p20-seats',
    title: 'The Borrowed Seats of Tavik',
    domain: 'Social Customs',
    sourceStyle: 'Travel ethnography · Field notebook',
    wordCount: 378,
    freeTier: false,
    paragraphs: [
      'On my first visit to Tavik I counted seventeen seats at the afternoon ferry landing. Twelve were stools, four were crates, and one was the step below the ticket window. When an elderly woman approached, I stood up and pointed to the crate on which I had been sitting. She took it, carried it to the wall and sat on the step. The man behind me laughed, though not unkindly. I thought the incident was evidence that travellers should leave small courtesies to those who know how to perform them.',
      'A week later I helped a porter carry water from a tap beyond the ticket window. We needed the step clear that day to pass the full buckets up to the waiting room. Without interrupting their conversations, the people at the landing shifted two stools into the sun and brought a crate out of a doorway. The woman I had seen on my first afternoon arrived after this rearrangement and sat on one of the stools. It occurred to me that I might have been looking for a rule about who ought to sit where, when the seats were being used to keep routes open.',
      'Then I saw a man return a stool to the doorway of the rope shop, although it was not in anyone’s way. The shopkeeper would be coming down, he said, and wanted to see the water from there. I asked him if the stool belonged to her. He looked puzzled and said the shopkeeper had put it there yesterday. I had wanted to know whether she had bought it. He seemed to think that the placement was enough of an answer.',
      'I went back the following spring. The rope shop had closed, and a notice in its window offered the building for rent. The stool was at the other end of the landing. Tourists sat on it until the ferryman needed to draw in the gangway; then somebody moved it. I wrote in my notebook that the landing had no fixed seats. Three lines down I wrote that when I found the former shopkeeper on the morning ferry, she was sitting on the left bench, where the sun reaches first. Both seemed worth writing down. Neither struck me, by then, as a rule.'
    ],
    questions: [
      {
        id: 'p20-q1',
        passageId: 'p20-seats',
        stem: 'What does the man’s answer about the stool suggest he considers sufficient to explain returning it?',
        skill: 'Inference',
        difficulty: 'Challenging',
        paragraphRef: 3,
        correctLetter: 'A',
        rationale: 'He answers the question about belonging with the shopkeeper’s recent use, not her legal title.',
        options: [
          { letter: 'A', text: 'The shopkeeper put it there for a purpose she was likely to have again.', explanation: 'Her placing it and anticipated wish to see the water make the return intelligible.' },
          { letter: 'B', text: 'The stool had been purchased with money from the rope shop rather than from the ferry.', explanation: 'His answer gives no acquisition history.' },
          { letter: 'C', text: 'The rope shopkeeper had directed him to keep the doorway clear of other people’s property.', explanation: 'No instruction is reported; he moves a stool into the doorway area.' },
          { letter: 'D', text: 'Only the rope shopkeeper could tell whether the stool was needed to keep a route open.', explanation: 'His reason is her view of the water rather than her special knowledge of routes.' },
          { letter: 'E', text: 'A seat placed by a trader has the same status as one provided by the ferryman.', explanation: 'The answer does not compare two statuses.' }
        ]
      },
      {
        id: 'p20-q2',
        passageId: 'p20-seats',
        stem: 'Which observation first gives the narrator a reason to reconsider the idea that seating is governed by courtesy towards particular people?',
        skill: 'Structure & Evidence',
        difficulty: 'Standard',
        paragraphRef: 2,
        correctLetter: 'D',
        rationale: 'At the bucket delivery the group rearranges furniture without needing to identify or defer to individual seat users.',
        options: [
          { letter: 'A', text: 'The man laughs after the narrator points to the vacant crate.', explanation: 'His laughter suggests a mistake but supplies no alternative account of the arrangement.' },
          { letter: 'B', text: 'The ferry landing contains more stools than crates.', explanation: 'The inventory alone cannot explain what governs movement.' },
          { letter: 'C', text: 'The former shopkeeper chooses a sunny bench on the ferry.', explanation: 'This is a later observation about a particular preference.' },
          { letter: 'D', text: 'People move several seats to make room for buckets, and the woman sits somewhere different.', explanation: 'The changed route and changed seat suggest practical coordination rather than a fixed order of deference.' },
          { letter: 'E', text: 'Tourists sit on a stool after the rope shop has closed.', explanation: 'The spring visit is later than the observation that first changes the narrator’s interpretation.' }
        ]
      },
      {
        id: 'p20-q3',
        passageId: 'p20-seats',
        stem: 'What does the ending imply about the two entries in the notebook?',
        skill: 'Main Argument',
        difficulty: 'Challenging',
        paragraphRef: 4,
        correctLetter: 'C',
        rationale: 'A description of movable common seating can coexist with an observation about what one person likes, without either being a universal rule.',
        options: [
          { letter: 'A', text: 'The entries conflict because the narrator forgot the ferry itself has fixed benches.', explanation: 'The difference between a movable stool and a fixed bench is not the point of the pairing.' },
          { letter: 'B', text: 'The former shopkeeper’s seat shows that the narrator’s first interpretation about formal courtesy was right.', explanation: 'Her choice of sun does not establish a rule of deference.' },
          { letter: 'C', text: 'An adaptable arrangement and an individual preference can coexist without either being a rule.', explanation: 'Both observations are worth preserving without turning them into general laws.' },
          { letter: 'D', text: 'Ordinary habits can be observed reliably only after the observer returns in a different season.', explanation: 'The return adds evidence but the text makes no general claim about seasonal observation.' },
          { letter: 'E', text: 'Removing the stool from the shop doorway ended the former owner’s claim to a seat in public.', explanation: 'Her preference on the ferry tells us nothing about a claim to a public seat.' }
        ]
      }
    ]
  },
  {
    id: 'p21-missing-scene',
    title: 'The Scene the Film Refuses',
    domain: 'Arts & Interpretation',
    sourceStyle: 'Film criticism · Close reading',
    wordCount: 559,
    freeTier: false,
    paragraphs: [
      'In the first scene of A Bed by the Window, a woman called Tess tells her brother that their mother spent her last night looking out at the road. In the next scene he tells a nurse that their mother spent it looking at the wall. No flashback comes to our aid. The camera stays with the nurse as she puts her cup down on its saucer and asks whether either of them would like more tea. She does not invite a correction, and neither child offers one.',
      'An ordinary mystery could make fine use of this arrangement. Each recollection might be a clue, and we would be entitled to expect a scene that put the bed back in the right place. I waited for that scene the first time I saw the film. On a second viewing, I noticed that Tess speaks about the road just before explaining why she kept the curtains open, and her brother mentions the wall shortly before admitting why he did not come sooner. Each description helps the speaker tell the story they can bear to tell about their own conduct. The editing makes the connection without having either character announce it. Tess smooths the curtain she is talking about; her brother looks at the nurse, not at the door through which he might have entered the room. The familiar promise of a mystery is that attention to such details will eventually be rewarded with knowledge of an event. Here the details pay off sooner, and in a different currency. They tell us what the speakers are trying to do now. They cannot, by themselves, tell us what their mother saw.',
      'The director, Emil Nares, does not allow this insight to settle the matter. In the third act Tess visits an exhibition of photographs of the street on which they grew up. The labels identify the houses by number. The camera lingers on a baker checking the label beneath his former shop, insisting quietly that it is wrong. Tess asks the attendant to fetch a notebook. A wrong label is a small injury, but neither Tess nor the film behaves as if a person’s stake in a memory makes factual accuracy irrelevant. The scene also refuses the obvious little victory in which an institution is made to admit its mistake. We do not hear the attendant read back the corrected number. Instead we watch the baker straighten the photograph on its hook. He is taking trouble over a display he has just accused of getting something wrong. The film has not exchanged accuracy for sympathy; it makes us sit through the awkwardness of granting both.',
      'I have heard the ending described as generous because it lets both children be right. I would call it more severe. One of them might be mistaken, or both might be. The director keeps us from correcting either of them at the point where correction would be easiest for us and least useful to them. The last shot returns to the nurse’s cup, now standing by the sink with the tea still in it. It would be a neat joke to call this a clue that the nurse never drank the tea. The point is that we can see exactly what is in the cup, and nothing at all that will tell us where to put the bed.'
    ],
    questions: [
      {
        id: 'p21-q1',
        passageId: 'p21-missing-scene',
        stem: 'What is the chief function of the exhibition episode in the critic’s argument?',
        skill: 'Structure & Evidence',
        difficulty: 'Challenging',
        paragraphRef: 3,
        correctLetter: 'E',
        rationale: 'It checks an overgeneralisation: motives can shape recollection without making accuracy dispensable.',
        options: [
          { letter: 'A', text: 'It gives an independent clue that allows viewers to resolve the disagreement about the room.', explanation: 'The scene never puts the bed in a determinate position.' },
          { letter: 'B', text: 'It shows that Tess has started to doubt her memory of the street as well as of the room.', explanation: 'The contested label concerns the baker’s former shop; the text reports no doubt by Tess about her own account.' },
          { letter: 'C', text: 'It explains why the director gives each character a different account of the street they remember.', explanation: 'The scene does not provide competing recollections from the two children about the street.' },
          { letter: 'D', text: 'It supports the idea that verified facts matter in museums but not in personal accounts.', explanation: 'The critic uses the museum example to resist dismissing accuracy generally.' },
          { letter: 'E', text: 'It challenges the idea that caring personally about a memory makes its accuracy unimportant.', explanation: 'Tess and the film treat a potentially wrong label as worth addressing.' }
        ]
      },
      {
        id: 'p21-q2',
        passageId: 'p21-missing-scene',
        stem: 'Which of the following is NOT part of the critic’s account of the ending?',
        skill: 'Inference',
        difficulty: 'Standard',
        paragraphRef: 4,
        correctLetter: 'C',
        rationale: 'The ending offers a visible detail, not a solution that reconciles or vindicates the two accounts.',
        options: [
          { letter: 'A', text: 'The last shot contains something the viewer can confidently describe.', explanation: 'The viewer can see what is in the cup.' },
          { letter: 'B', text: 'The ending leaves room for one or both recollections to be mistaken.', explanation: 'The critic states both possibilities.' },
          { letter: 'C', text: 'The ending gives a different factual basis on which both recollections can be accepted as accurate.', explanation: 'The critic rejects precisely this reading.' },
          { letter: 'D', text: 'The film denies viewers the chance to settle the disagreement through a final revelation.', explanation: 'The cup supplies nothing to locate the bed.' },
          { letter: 'E', text: 'Correcting the children at the point the viewer expects would not necessarily help them.', explanation: 'The critic says that is where correction would be least useful to them.' }
        ]
      },
      {
        id: 'p21-q3',
        passageId: 'p21-missing-scene',
        stem: 'Why does the critic call the ending “more severe” rather than “generous”?',
        skill: 'Tone & Attitude',
        difficulty: 'Challenging',
        paragraphRef: 4,
        correctLetter: 'B',
        rationale: 'The film refuses both the viewer’s power to settle the matter and an easy assurance that nobody was wrong.',
        options: [
          { letter: 'A', text: 'The film implies the nurse deliberately refuses tea to force the siblings to confront each other.', explanation: 'The nurse does not invite a correction, and the cup does not prove any such motive.' },
          { letter: 'B', text: 'The film withholds a verdict without relieving either child of the possibility of being wrong.', explanation: 'The absence of a deciding scene does not mean the accounts are equally true.' },
          { letter: 'C', text: 'The film makes the children’s motives harder to discern by revisiting the inaccurate exhibition label.', explanation: 'The label complicates the critic’s conclusion; the motives emerge earlier.' },
          { letter: 'D', text: 'The film gives spectators enough evidence to solve the mystery but denies the children access to it.', explanation: 'The spectators never receive the promised revelation either.' },
          { letter: 'E', text: 'The film ends the conversation before the children realise the nurse knows what really happened.', explanation: 'The account never establishes that the nurse knows the answer.' }
        ]
      },
      {
        id: 'p21-q4',
        passageId: 'p21-missing-scene',
        stem: 'Which situation best parallels the critic’s second-viewing interpretation of the siblings’ recollections?',
        skill: 'Assumption & Flaw',
        difficulty: 'Challenging',
        paragraphRef: 2,
        correctLetter: 'A',
        rationale: 'The critic notices first how each recollection helps its speaker explain their own choices, not which recollection fits the facts.',
        options: [
          { letter: 'A', text: 'Two former colleagues describe the same meeting differently, each account helping explain why its speaker did not intervene.', explanation: 'Both descriptions do work in the speaker’s story about their own actions.' },
          { letter: 'B', text: 'Two researchers repeat the same experiment and settle a measurement dispute by consulting a recording.', explanation: 'Independent confirmation resolves a disagreement; it does not explain how narratives justify conduct.' },
          { letter: 'C', text: 'A judge hears conflicting statements and discards both because the witnesses disagree about the date.', explanation: 'This passes a verdict on evidential value rather than asking what a speaker’s account enables them to say.' },
          { letter: 'D', text: 'A designer prepares two models of one room to compare where a window admits more light.', explanation: 'The variation is a design test, not competing recollections related to personal choices.' },
          { letter: 'E', text: 'Two siblings adopt different accounts of an event because each has read a different version of the family diary.', explanation: 'This explains the accounts by their sources, not by their role in the speakers’ stories.' }
        ]
      }
    ]
  },
  {
    id: 'p22-repair-desk',
    title: 'A Shorter Wait at the Repair Desk',
    domain: 'Public Services',
    sourceStyle: 'Data report · Before-and-after comparison',
    wordCount: 395,
    freeTier: false,
    paragraphs: [
      'Between January and June, the town of Fenward tested a Saturday desk for booking repairs to council homes. Some tenants had previously reported faults on a weekday telephone line, while others had used an online form. The Saturday desk was a third route into the same scheduling system. Its staff could enter a job but could not allocate a technician. The pilot was intended to make it easier to report faults, not to make technicians travel faster.',
      'The council’s opening statement says the median time from report to first visit fell from eight days to six. The figures include all three routes. In the three months before the desk opened, the system received 600 reports, 390 of which were classed as routine. In the three months afterwards it received 750, of which 570 were routine. The classification determines which scheduling list a job enters. A branch dealing with serious faults had previously spent two days a week serving a neighbouring town; that arrangement ended when the pilot began.',
      'Once the figures are separated on the council’s own classification, the patterns diverge. The median for serious faults fell from four days to three. For routine work it fell from ten days to seven. But the public figures do not group jobs by the month in which they were reported. Jobs still waiting when the figures were extracted are counted among reports and not among visits. Those jobs may eventually supply some of the longest waits. The report also does not show how long a tenant knew about a fault before reporting it.',
      'The desk logged 120 reports under its own code. An observer spent two Saturdays there and noted that many people came with photographs of faults they said they had tried to describe by telephone. One tenant submitted a report on their neighbour’s behalf. The observer did not count how many of those faults would otherwise have been reported or how much earlier they would have entered the system if the desk had been open all week.',
      'The housing committee has recommended keeping the desk open while it collects more information. Finding a route into the system matters even if nobody can show that the route shortens the time spent inside it. The next account of the trial will be more useful if it says which of those two propositions it is trying to establish.'
    ],
    questions: [
      {
        id: 'p22-q1',
        passageId: 'p22-repair-desk',
        stem: 'Which of the following is NOT established by the figures given?',
        skill: 'Inference',
        difficulty: 'Standard',
        paragraphRef: 3,
        correctLetter: 'D',
        rationale: 'The report begins at the time of reporting, not discovery of a fault; it cannot measure the change in the complete interval.',
        options: [
          { letter: 'A', text: 'The total number of reports rose by 150 after the desk opened.', explanation: 'The comparison is 750 minus 600.' },
          { letter: 'B', text: 'Routine reports formed a greater proportion of reports after the desk opened.', explanation: 'The proportions are 570 out of 750 and 390 out of 600.' },
          { letter: 'C', text: 'The desk logged fewer reports than the overall net increase in reports.', explanation: 'It logged 120, compared with a net increase of 150.' },
          { letter: 'D', text: 'The typical interval from a tenant first noticing a fault to a visit fell by two days.', explanation: 'The figures omit the time between noticing and reporting.' },
          { letter: 'E', text: 'The published median fell within each of the two classifications.', explanation: 'Routine and serious visit medians both fell in the published comparison.' }
        ]
      },
      {
        id: 'p22-q2',
        passageId: 'p22-repair-desk',
        stem: 'Why might omitting jobs still waiting for a visit distort the reported medians?',
        skill: 'Assumption & Flaw',
        difficulty: 'Challenging',
        paragraphRef: 3,
        correctLetter: 'E',
        rationale: 'A visit-based calculation can underrepresent lengthy waits, particularly towards the end of the measured period.',
        options: [
          { letter: 'A', text: 'The longer a repair takes to carry out, the more often it will be counted as a visit.', explanation: 'The metric ends at the first visit rather than repair completion.' },
          { letter: 'B', text: 'A fault reported twice is classified as both serious and routine until a technician arrives.', explanation: 'The text describes no such rule.' },
          { letter: 'C', text: 'The extracted figures stop recording jobs once a tenant can describe a fault accurately.', explanation: 'The distinction is whether a first visit has occurred.' },
          { letter: 'D', text: 'The median must use the total number of reports, even if some reports are outside the measured period.', explanation: 'The problem is missing wait durations, not a prescribed denominator.' },
          { letter: 'E', text: 'Some waits excluded from the calculation will outlast many of those already recorded.', explanation: 'Recent unresolved cases can become long waits without appearing in the published visit figures.' }
        ]
      },
      {
        id: 'p22-q3',
        passageId: 'p22-repair-desk',
        stem: 'Which follow-up result would best support the idea that the desk improved access, even if scheduling did not speed up?',
        skill: 'Assumption & Flaw',
        difficulty: 'Challenging',
        paragraphRef: 5,
        correctLetter: 'C',
        rationale: 'Evidence that the desk admitted previously unreported cases directly tests access, independently of the scheduling interval.',
        options: [
          { letter: 'A', text: 'Technicians completed more Saturday visits than in the previous year when the desk was closed.', explanation: 'This would say more about the supply of visits than about entry into the reporting system.' },
          { letter: 'B', text: 'The report-to-visit median fell again as more technicians became available for routine work.', explanation: 'More resources could improve scheduling without improving access to reporting.' },
          { letter: 'C', text: 'Tracking found that otherwise unreported faults reached the system through the desk, while post-report waits stayed comparable.', explanation: 'This measures who gained entry without relying on a faster scheduling result.' },
          { letter: 'D', text: 'More desk users than telephone users could recall the staff member who took their report.', explanation: 'This says little about whether they could have reported through another route.' },
          { letter: 'E', text: 'The online form received approximately the same number of reports as it had before the pilot.', explanation: 'Unchanged online volume does not identify what would have happened to the specific desk cases.' }
        ]
      }
    ]
  },
  {
    id: 'p23-reading-room',
    title: 'Two Plans for the Same Room',
    domain: 'Libraries & Public Space',
    sourceStyle: 'Debate transcript · Moderated exchange',
    wordCount: 434,
    freeTier: false,
    paragraphs: [
      'Chair: The west room of the library has one door to the hall, six tables and no way to divide the space without blocking the windows. We are deciding whether it should remain a silent room in the afternoons. I have asked two users to tell us not what quiet is worth in general, but what their own plans would change.',
      'Asha Bell: I revise at the long table because I cannot get two quiet hours at home. I do not need all six tables. I need to know, before I take a bus across town, that somebody will not start explaining fractions at the next table. In the hall I can put in earplugs, but I cannot tell whether the people on either side of me will be holding a meeting or just waiting for one to start. The west room lets me stop listening out for what might happen.',
      'Jon Fell: I tutor a pair of pupils who wait here after school. We can put our names down for a table in the hall, but the hall is where the chess club and the knitting group meet without booking. We were moved twice last Tuesday. I would keep the west room silent on three afternoons and offer bookable tables on two. The room would not become a place where anybody had to take their chances: the timetable would tell each of us whether a journey was worth making.',
      'Asha: On which afternoons? The bus I can take is the same bus the pupils can take. Two afternoons given to tutoring are not two afternoons on which I can simply choose to revise somewhere else. My proposal is to give the hall’s regular groups fixed bookings. If they know where they can go, a tutoring table there could become dependable without taking away the quiet tables here.',
      'Jon: That would work if the hall groups could all find a slot when their members can come. Some of them stay precisely because they can arrive a little late and pull up a chair. A timetable can tell us who has a place. It cannot promise that those who end up with a place are the people for whom it was hardest to find one.',
      'Chair: I was hoping to record which of you put a higher price on silence. You have made that fairly difficult. You both want to be able to tell somebody, at home, that the library will have a place for them before they put their shoes on. I think our next question is who can come at a different time.'
    ],
    questions: [
      {
        id: 'p23-q1',
        passageId: 'p23-reading-room',
        stem: 'What concern does the chair identify as shared by Bell and Fell?',
        skill: 'Main Argument',
        difficulty: 'Standard',
        paragraphRef: 6,
        correctLetter: 'B',
        rationale: 'Both speakers want to know before leaving home that a suitable space will be available upon arrival.',
        options: [
          { letter: 'A', text: 'They both want to assess how much each activity benefits from a silent environment.', explanation: 'Fell wants dependable space for tutoring, which need not be silent.' },
          { letter: 'B', text: 'They both want users to know before travelling whether they will find an appropriate place.', explanation: 'Bell wants predictable silence; Fell wants predictable access to a tutoring table.' },
          { letter: 'C', text: 'They both think the hall can accommodate all its current activities if regular groups book in advance.', explanation: 'Fell explicitly doubts whether fixed bookings can meet those groups’ needs.' },
          { letter: 'D', text: 'They both hope to reduce demand by directing some pupils to libraries closer to school.', explanation: 'Neither proposes shifting users to another library.' },
          { letter: 'E', text: 'They both take the capacity of the west room to be the only constraint on change.', explanation: 'The chair ends by pointing to differences in when people can come.' }
        ]
      },
      {
        id: 'p23-q2',
        passageId: 'p23-reading-room',
        stem: 'In Bell’s words, what does the phrase “stop listening out for what might happen” convey?',
        skill: 'Inference',
        difficulty: 'Challenging',
        paragraphRef: 2,
        correctLetter: 'D',
        rationale: 'Predictable quiet removes the need to stay alert to potential interruptions, not merely to block noises that already exist.',
        options: [
          { letter: 'A', text: 'Bell wants to avoid knowing what the groups in the hall are discussing.', explanation: 'The focus is uncertainty over whether interruptions will occur, not their content.' },
          { letter: 'B', text: 'Bell expects people in a shared room to lower their voices after meetings begin.', explanation: 'Bell does not expect the hall to change its practices.' },
          { letter: 'C', text: 'Bell keeps listening in case a vacant table becomes available in the west room.', explanation: 'Bell refers to being in the room, not waiting for a place.' },
          { letter: 'D', text: 'Bell values not having to anticipate a possible interruption.', explanation: 'The silent room offers reassurance before any particular sound occurs.' },
          { letter: 'E', text: 'Bell needs silence in order to hear other pupils moving along the hall.', explanation: 'Silence is valuable for concentration, not for monitoring different sounds.' }
        ]
      },
      {
        id: 'p23-q3',
        passageId: 'p23-reading-room',
        stem: 'Which finding would most directly weaken Fell’s objection to giving the hall groups fixed bookings?',
        skill: 'Assumption & Flaw',
        difficulty: 'Challenging',
        paragraphRef: 5,
        correctLetter: 'A',
        rationale: 'The objection rests on loss of flexibility making participation harder for members; the finding directly bears on that uncertainty.',
        options: [
          { letter: 'A', text: 'A trial found that regular groups kept their attendance with reserved slots that let members arrive at different times.', explanation: 'This tests both the availability of workable slots and the value of being able to arrive late.' },
          { letter: 'B', text: 'The west room’s six tables are occupied shortly before the library closes on weekdays.', explanation: 'This says little about the hall groups’ ability to use a booking.' },
          { letter: 'C', text: 'Several pupils in the hall find that wearing earplugs helps them concentrate on silent tasks.', explanation: 'Fell is discussing tutoring and groups’ access, not individual revision strategies.' },
          { letter: 'D', text: 'A third group would apply for a booking in the hall if one were offered.', explanation: 'Greater demand would not allay his concern about accommodating existing groups.' },
          { letter: 'E', text: 'More users say they prefer a fixed starting time for events held in the west room.', explanation: 'Users of a different room do not establish whether the hall groups can be accommodated.' }
        ]
      },
      {
        id: 'p23-q4',
        passageId: 'p23-reading-room',
        stem: 'How does the chair’s final contribution change the question for the hearing?',
        skill: 'Structure & Evidence',
        difficulty: 'Challenging',
        paragraphRef: 6,
        correctLetter: 'E',
        rationale: 'The chair turns from comparing abstract valuations of silence to finding out who can adapt to a changed schedule.',
        options: [
          { letter: 'A', text: 'It replaces a discussion about how many tables each activity requires with a proposal to dismantle the partition.', explanation: 'There is no installed partition or proposal to dismantle one.' },
          { letter: 'B', text: 'It uses a shared desire for advance notice to decide which activity should have first claim to the room.', explanation: 'Identifying the common concern does not settle priority.' },
          { letter: 'C', text: 'It determines that access to buses should be the only consideration in assigning rooms.', explanation: 'The final question is availability at different times, not a single test based on bus access.' },
          { letter: 'D', text: 'It rules out a fixed timetable because both speakers think it would stop informal groups forming.', explanation: 'The chair does not reject timetabling; both speakers contemplate booking arrangements.' },
          { letter: 'E', text: 'It moves from ranking preferences about silence to comparing users’ ability to adjust their schedules.', explanation: 'The suggested next question asks who can visit at another time.' }
        ]
      }
    ]
  },
  {
    id: 'p24-counter-a',
    title: 'Notes from Counter A',
    domain: 'Work & Automation',
    sourceStyle: 'Observational vignette · Implied viewpoint',
    wordCount: 390,
    freeTier: false,
    paragraphs: [
      'At nine on Monday the permit office removed the last sound from its ticket machine. It had made a small mechanical cough whenever it issued a ticket, and a contractor had been called back twice to suppress it. When the third visit was complete, customers pressed the button and bent towards the slot to see whether anything had happened. A man in work boots pressed it three times. He kept the tickets together in the way a person keeps the pieces of a receipt they may be asked to reassemble.',
      'At Counter A, the clerk had a screen that showed the number to call next. She also kept an exercise book open at her elbow. At the top of a page she wrote 046, then 048, then the words back shortly. When the screen said 047, she looked up and saw the man in work boots. She asked him for the tickets he was holding, wrote his name beside 046 and waved forward the two people who had arrived immediately after him. The screen continued to show 047 until a supervisor tapped an icon labelled Missed.',
      'At eleven the supervisor asked the clerk why she did not close the book now that the new screen was working. She put a ruler across the page to keep it open and showed him the note beside back shortly. A boy had gone outside to fetch his grandmother, who could not stand in the queue. The clerk had marked the spot where the boy would have been called so that she could bring him and his grandmother forward when they came back. She had started doing this before there was a screen. The supervisor said the new system could count how many tickets had been missed. She asked whether it could say which people were expected back. He leaned over to look at the book.',
      'On Friday the office circulated a note saying that the number of missed tickets had fallen. The contractor’s name appeared in the note. The clerk had been issued a small tray in which to put the tickets people did not need, and she dropped these into a sack at four each afternoon. She did not put the exercise book in the sack. The tray, which had rubber feet, made no sound when she pushed it under the counter.'
    ],
    questions: [
      {
        id: 'p24-q1',
        passageId: 'p24-counter-a',
        stem: 'Which inference about the supervisor is best supported?',
        skill: 'Inference',
        difficulty: 'Challenging',
        paragraphRef: 3,
        correctLetter: 'C',
        rationale: 'The supervisor can track the machine’s administrative category, but on hearing the clerk’s question turns to the separate record for detail.',
        options: [
          { letter: 'A', text: 'He decides to add a function to the screen for recording customers’ expected returns.', explanation: 'He looks at the book, but no change to the software is proposed.' },
          { letter: 'B', text: 'He assumes from the start that several missed tickets can belong to a single customer.', explanation: 'He taps Missed; the text does not reveal any such prior assumption.' },
          { letter: 'C', text: 'He turns to the clerk’s record for a distinction the screen’s count does not supply.', explanation: 'His turn towards the exercise book follows her question about distinguishing people expected back.' },
          { letter: 'D', text: 'He thinks the boy and grandmother should wait again to avoid disadvantaging customers who stayed in line.', explanation: 'He expresses no opinion on what priority they should receive.' },
          { letter: 'E', text: 'He instructs the clerk to collect unused tickets so the contractor can check the machine’s accuracy.', explanation: 'A tray appears later, but neither an instruction nor that purpose is established.' }
        ]
      },
      {
        id: 'p24-q2',
        passageId: 'p24-counter-a',
        stem: 'What is the effect of ending with the soundless tray?',
        skill: 'Tone & Attitude',
        difficulty: 'Challenging',
        paragraphRef: 4,
        correctLetter: 'E',
        rationale: 'It recalls the attention paid to silencing the machine while leaving the clerk’s practical contribution in the background.',
        options: [
          { letter: 'A', text: 'It suggests the office restored the sound so customers would know they had received a ticket.', explanation: 'The ending reports no restoration.' },
          { letter: 'B', text: 'It supplies evidence that customers objected more strongly to the tray than to the ticket machine.', explanation: 'No such objections are reported.' },
          { letter: 'C', text: 'It shows that the clerk accepted the supervisor’s request and stopped using the exercise book.', explanation: 'The passage makes a point of the separate decision not to discard it.' },
          { letter: 'D', text: 'It shifts attention from service at the counter to whether furnishings meet a stated noise limit.', explanation: 'No limit is given; silence is a recurring detail with a larger point.' },
          { letter: 'E', text: 'It returns to an overt concern of the new system while leaving the clerk’s uncredited work quietly in view.', explanation: 'The note names the contractor, but the final action preserves the clerk’s record.' }
        ]
      },
      {
        id: 'p24-q3',
        passageId: 'p24-counter-a',
        stem: 'Which view is most strongly implied by the details the narrator chooses to include?',
        skill: 'Main Argument',
        difficulty: 'Challenging',
        paragraphRef: 3,
        correctLetter: 'B',
        rationale: 'The vignette juxtaposes technical measures and quiet equipment with the clerk’s decisions about how to handle particular people fairly.',
        options: [
          { letter: 'A', text: 'A queue is fairer when customers can no longer hear where others are getting their tickets.', explanation: 'The absence of sound confuses a customer and has no stated fairness benefit.' },
          { letter: 'B', text: 'A formal queue can appear to improve while depending on informal judgement it does not record.', explanation: 'The screen tracks misses, but the book preserves facts about circumstances and expected returns.' },
          { letter: 'C', text: 'A fall in missed tickets shows that the office solved the main difficulty posed by the screen.', explanation: 'The figure does not describe which people were served or why.' },
          { letter: 'D', text: 'The fairest way to allocate permits is to preserve the exact order in which the machine issues tickets.', explanation: 'Unused tickets and expected returns show why strict number order is insufficient.' },
          { letter: 'E', text: 'An office should measure more activity through a supervisor rather than through individual clerks.', explanation: 'The vignette notices what the clerk understands that the supervisor’s screen cannot supply.' }
        ]
      }
    ]
  }
];
