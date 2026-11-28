import { LnatPassage } from '../types';
import { EXTRA_PASSAGES, FULL_MOCK_PASSAGES } from './passagesExtra';

const CORE_PASSAGES: LnatPassage[] = [
  {
    id: 'p1-algorithmic-sentencing',
    title: 'The Illusion of Mechanical Mercy',
    domain: 'Law & Technology',
    sourceStyle: 'Editorial essay · Legal philosophy',
    wordCount: 445,
    freeTier: true,
    paragraphs: [
      'Advocates of algorithmic risk-assessment in criminal sentencing rarely claim that machines possess moral wisdom. Their case is more modest, and therefore more seductive: human judges are demonstrably inconsistent. A defendant sentenced after a judge’s lunch break, or before a local court in an election year, may receive a materially harsher term than an identical offender tried elsewhere. If statistical models can strip out such caprice, so the argument runs, justice becomes more uniform, and uniformity is the bedrock of the rule of law.',
      'Yet uniformity is not the same thing as fairness, and the attempt to purchase the former by outsourcing judgement to historical data carries a quiet cost. Risk-scoring tools do not observe crime; they observe arrests, charges, and convictions—each of which is the product of prior policing choices. When an algorithm assigns a higher recidivism score to a postcode that has long been heavily patrolled, it does not eliminate human bias. It launders it, converting a contestable pattern of enforcement into a neutral-looking decimal.',
      'Defenders of these systems reply that judges are never bound by a score; the figure is merely advisory. In practice, however, advisory numbers exert a peculiar gravitational pull. A sentencing judge who departs downwards from a high-risk rating must articulate reasons that will survive appellate scrutiny and, in high-profile cases, tabloid outrage. A judge who defers to the model faces no such friction. Over time, the path of least institutional resistance quietly turns advice into orthodoxy.',
      'None of this means that judicial intuition should be romanticised. Unchecked discretion has its own ugly history, and sentencing guidelines—written in plain prose, debated in Parliament, and open to public challenge—have done much to curb arbitrary disparities. The crucial distinction is not between fallible humans and flawless code, but between rules whose moral trade-offs are visible and systems whose assumptions are buried behind proprietary weights. Justice requires not merely that like cases be treated alike, but that the person losing their liberty can understand, and contest, the reasons why.'
    ],
    questions: [
      {
        id: 'p1-q1',
        passageId: 'p1-algorithmic-sentencing',
        stem: 'Which of the following best expresses the author’s main argument?',
        skill: 'Main Argument',
        difficulty: 'Standard',
        paragraphRef: 4,
        correctLetter: 'C',
        rationale:
          'Paragraph 4 distils the central thesis: consistency is valuable, but opaque algorithmic scoring hides moral trade-offs and undermines contestability, whereas public sentencing guidelines curb discretion transparently.',
        options: [
          {
            letter: 'A',
            text: 'Human judges are inherently fairer than statistical models and should retain unrestricted sentencing discretion.',
            explanation: 'Contradicts paragraph 4, which explicitly warns against romanticising judicial intuition or "unchecked discretion".'
          },
          {
            letter: 'B',
            text: 'Algorithmic risk tools fail primarily because they are less consistent than individual judges.',
            explanation: 'Misstates the critique: the author grants that models may increase uniformity, but argues uniformity is not fairness.'
          },
          {
            letter: 'C',
            text: 'While sentencing consistency matters, opaque risk-scoring models embed past biases and undermine the public accountability justice requires.',
            explanation: 'Captures both the concession (consistency matters, guidelines help) and the core objection (laundered bias + lack of transparent contestability).'
          },
          {
            letter: 'D',
            text: 'Parliament should ban all statistical evidence from criminal courts to preserve the rule of law.',
            explanation: 'Too extreme: the passage critiques proprietary risk-scoring algorithms in sentencing, not all statistical evidence in courts.'
          },
          {
            letter: 'E',
            text: 'Risk-assessment software would be acceptable in sentencing if judges were legally required to treat scores as advisory.',
            explanation: 'Directly refuted by paragraph 3, which argues that even formally advisory scores become de facto orthodoxy.'
          }
        ]
      },
      {
        id: 'p1-q2',
        passageId: 'p1-algorithmic-sentencing',
        stem: 'In paragraph 2, why does the author say an algorithm "launders" human bias?',
        skill: 'Tone & Attitude',
        difficulty: 'Standard',
        paragraphRef: 2,
        correctLetter: 'B',
        rationale:
          'The metaphor of laundering highlights how historical policing disparities are disguised as objective, mathematical outputs ("a neutral-looking decimal").',
        options: [
          {
            letter: 'A',
            text: 'To suggest that the training data blur the distinction between different categories of criminal offences.',
            explanation: 'The distortion concerns whose behaviour is captured, not how offences are named.'
          },
          {
            letter: 'B',
            text: 'To show how existing policing disparities are made to look objective.',
            explanation: 'A mathematical score gives the appearance of neutrality to patterns inherited from policing.'
          },
          {
            letter: 'C',
            text: 'To suggest that earlier discrepancies in arrests can be filtered out by converting records to probabilities.',
            explanation: 'The scoring process obscures inherited disparities rather than removing them.'
          },
          {
            letter: 'D',
            text: 'To show that an apparently impartial score can lead police departments to abandon their past patrol practices.',
            explanation: 'The paragraph explains what the model inherits from previous policing, not how departments respond to it.'
          },
          {
            letter: 'E',
            text: 'To argue that predictions replace a defendant’s personal record with information about sentencing decisions in similar cases.',
            explanation: 'The author’s point is that supposedly neutral predictions can reproduce unequal patterns already in the data.'
          }
        ]
      },
      {
        id: 'p1-q3',
        passageId: 'p1-algorithmic-sentencing',
        stem: 'What does paragraph 3 imply about the claim that risk scores are "merely advisory"?',
        skill: 'Inference',
        difficulty: 'Challenging',
        paragraphRef: 3,
        correctLetter: 'D',
        rationale:
          'Paragraph 3 explains that institutional and media pressures make it much harder for a judge to override a high-risk score than to follow it, so formal discretion erodes in practice.',
        options: [
          {
            letter: 'A',
            text: 'Appellate courts routinely overturn sentences whenever a judge disagrees with a risk score.',
            explanation: 'Too strong: the author says departing downwards requires articulating reasons that survive scrutiny, not that reversals are routine.'
          },
          {
            letter: 'B',
            text: 'Judges generally lack the technical training needed to understand probabilistic scores.',
            explanation: 'Plausible in the real world, but not the mechanism cited in paragraph 3 (which focuses on institutional friction and public scrutiny).'
          },
          {
            letter: 'C',
            text: 'Tabloid newspapers are the main cause of harsh sentencing across the criminal justice system.',
            explanation: 'Overstates a single example ("in high-profile cases, tabloid outrage").'
          },
          {
            letter: 'D',
            text: 'Institutional incentives discourage judges from overriding high-risk ratings, turning optional guidance into a default norm.',
            explanation: 'Accurately synthesises "path of least institutional resistance quietly turns advice into orthodoxy".'
          },
          {
            letter: 'E',
            text: 'Judges are equally reluctant to depart upwards from a low-risk score as to depart downwards from a high-risk score.',
            explanation: 'Not supported: paragraph 3 specifically describes the asymmetric friction of departing downwards from a high-risk rating.'
          }
        ]
      },
      {
        id: 'p1-q4',
        passageId: 'p1-algorithmic-sentencing',
        stem: 'Which of the following plays the same structural role in paragraph 4 as sentencing guidelines do for the author’s argument?',
        skill: 'Structure & Evidence',
        difficulty: 'Challenging',
        paragraphRef: 4,
        correctLetter: 'A',
        rationale:
          'Sentencing guidelines serve as a constructive counter-example showing that consistency can be achieved through transparent, publicly contestable rules rather than opaque algorithms.',
        options: [
          {
            letter: 'A',
            text: 'A concrete alternative demonstrating that reducing arbitrariness does not require opaque automation.',
            explanation: 'Precisely describes the role of sentencing guidelines in paragraph 4: they refute the false dilemma between unchecked intuition and proprietary code.'
          },
          {
            letter: 'B',
            text: 'A concession that parliamentary legislation is slower to adapt than private software.',
            explanation: 'The speed of legislation is never mentioned or conceded.'
          },
          {
            letter: 'C',
            text: 'Evidence that disparities in sentencing have already been eliminated in the United Kingdom.',
            explanation: 'Too strong: the text says guidelines "have done much to curb arbitrary disparities", not eliminated them.'
          },
          {
            letter: 'D',
            text: 'An illustration of how judicial intuition remains superior to written rules.',
            explanation: 'Contradicts the passage: written guidelines are praised specifically for curbing unchecked intuition.'
          },
          {
            letter: 'E',
            text: 'A historical footnote explaining why risk-scoring software was first invented.',
            explanation: 'Guidelines are introduced to draw a normative contrast, not to explain the origin of risk software.'
          }
        ]
      }
    ]
  },
  {
    id: 'p2-compulsory-voting',
    title: 'The Quiet Coercion of the Ballot Box',
    domain: 'Politics & Constitutional Theory',
    sourceStyle: 'Comment piece · Political theory',
    wordCount: 430,
    freeTier: true,
    paragraphs: [
      'Whenever turnout in a British general election dips below sixty per cent, a familiar remedy is dusted off: make voting compulsory, as in Australia. Proponents point to an undeniable result. Where non-voting incurs a modest fine, turnout reliably clears ninety per cent, and parties can no longer afford to design their manifestos exclusively for older, wealthier demographics who reliably turn up at polling stations. In theory, a full electorate produces a more representative parliament.',
      'Yet the Australian comparison is less decisive than its admirers suppose. High turnout measures attendance, not engagement. A citizen fined into visiting a polling booth on a rainy Thursday is no more likely to have scrutinised competing fiscal plans than one who stayed at home; indeed, Australian elections feature a measurable phenomenon known as "donkey voting", in which reluctant voters simply number candidates sequentially down the ballot paper. Inflating the denominator of votes cast with indifferent or arbitrary choices does not obviously sharpen democratic accountability.',
      'There is a deeper objection of principle. In a liberal democracy, the right to vote is not merely a civic chore comparable to jury service or paying taxes; it is a form of political expression. Meaningful expression includes the freedom to withhold endorsement—whether out of conscientious objection to every candidate on offer or out of principled scepticism towards the electoral system itself. Adding a "none of the above" box only partially meets this objection, because it still compels the citizen to participate in a ritual whose legitimacy they may wish to decline.',
      'Low turnout is undeniably a symptom of political alienation, particularly among younger and lower-income voters. Treating the symptom by fining the alienated, however, confuses legitimacy with compliance. If parties wish to earn the attention of non-voters, the remedy lies in making political choices feel consequential—through fairer electoral mechanics, credible local power, and civic education—not in marching reluctant citizens to the urn under threat of a penalty notice.'
    ],
    questions: [
      {
        id: 'p2-q1',
        passageId: 'p2-compulsory-voting',
        stem: 'Which assumption underlies the proponents’ argument summarised in paragraph 1?',
        skill: 'Assumption & Flaw',
        difficulty: 'Standard',
        paragraphRef: 1,
        correctLetter: 'E',
        rationale:
          'Paragraph 1 states that because non-voting is fined, turnout rises and parties cannot focus only on older/wealthier voters, producing a more representative parliament. This assumes that higher turnout translates into parties responding substantively to previously non-voting groups.',
        options: [
          {
            letter: 'A',
            text: 'Older and wealthier citizens’ influence depends chiefly on political donations rather than on votes.',
            explanation: 'That would make it harder to conclude that raising turnout would shift attention.'
          },
          {
            letter: 'B',
            text: 'Compulsory voting can be justified in Britain on the same grounds as a duty to sit on a jury.',
            explanation: 'The argument here is about representation, not a comparison of civic duties.'
          },
          {
            letter: 'C',
            text: 'Most citizens who abstain would choose to submit a valid ballot without any threat of a fine.',
            explanation: 'This would undermine the apparent need for a legal requirement rather than explain its effect on parties.'
          },
          {
            letter: 'D',
            text: 'A high turnout is enough to establish the legal validity of a British election.',
            explanation: 'The desired change is in whose interests parties represent, not in the legal standing of an election.'
          },
          {
            letter: 'E',
            text: 'Parties will respond to newly participating voters by better representing their interests.',
            explanation: 'The argument depends on increased participation changing what parties do.'
          }
        ]
      },
      {
        id: 'p2-q2',
        passageId: 'p2-compulsory-voting',
        stem: 'Why does the author mention "donkey voting" in paragraph 2?',
        skill: 'Structure & Evidence',
        difficulty: 'Standard',
        paragraphRef: 2,
        correctLetter: 'A',
        rationale:
          'Donkey voting illustrates that legally compelled turnout can generate arbitrary ballots rather than informed democratic engagement.',
        options: [
          {
            letter: 'A',
            text: 'To illustrate that legally enforced turnout does not guarantee informed or deliberate political choices.',
            explanation: 'Directly supports the claim that "high turnout measures attendance, not engagement".'
          },
          {
            letter: 'B',
            text: 'To argue that Australia’s preferential ballot system is too complex for ordinary voters.',
            explanation: 'The passage attributes donkey voting to reluctant voters, not ballot complexity.'
          },
          {
            letter: 'C',
            text: 'To prove that compulsory voting systematically favours incumbent governments.',
            explanation: 'Incumbency advantage is not mentioned; donkey voting follows ballot order.'
          },
          {
            letter: 'D',
            text: 'To suggest that British voters would refuse to pay fines for non-voting.',
            explanation: 'Not discussed in paragraph 2.'
          },
          {
            letter: 'E',
            text: 'To show that voluntary voting eliminates uninformed ballot casting.',
            explanation: 'Overstates the author’s claim: voluntary voting is not claimed to eliminate uninformed voting.'
          }
        ]
      },
      {
        id: 'p2-q3',
        passageId: 'p2-compulsory-voting',
        stem: 'According to paragraph 3, why is adding a "none of the above" option insufficient to resolve the author’s objection of principle?',
        skill: 'Inference',
        difficulty: 'Challenging',
        paragraphRef: 3,
        correctLetter: 'C',
        rationale:
          'Paragraph 3 argues that even with a "none of the above" box, the state still forces citizens to take part in an electoral ritual whose legitimacy they may wish to reject altogether.',
        options: [
          {
            letter: 'A',
            text: 'Most alienated voters would still prefer to spoil their ballots informally.',
            explanation: 'Spoiled ballots are not mentioned in the passage.'
          },
          {
            letter: 'B',
            text: 'It would make election results too difficult to count when turnout exceeds ninety per cent.',
            explanation: 'Administrative difficulty is never raised.'
          },
          {
            letter: 'C',
            text: 'It still forces citizens to take part in an electoral process they may regard as illegitimate.',
            explanation: 'Directly paraphrases the final clause of paragraph 3.'
          },
          {
            letter: 'D',
            text: 'It equates political expression with mandatory civic duties like jury service.',
            explanation: 'Confuses the opening distinction of paragraph 3 with the critique of the "none of the above" box.'
          },
          {
            letter: 'E',
            text: 'It fails to address the practical problem of sequential "donkey voting".',
            explanation: 'That is a paragraph 2 point, not the principled objection in paragraph 3.'
          }
        ]
      },
      {
        id: 'p2-q4',
        passageId: 'p2-compulsory-voting',
        stem: 'Which phrase best captures the author’s attitude towards low voter turnout?',
        skill: 'Tone & Attitude',
        difficulty: 'Standard',
        paragraphRef: 4,
        correctLetter: 'D',
        rationale:
          'In paragraph 4, the author calls low turnout "undeniably a symptom of political alienation" that deserves institutional reform, while rejecting compulsion as a misguided fix.',
        options: [
          {
            letter: 'A',
            text: 'Dismissive, viewing non-voting as a harmless sign of public contentment.',
            explanation: 'Contradicts paragraph 4, which calls low turnout a symptom of alienation.'
          },
          {
            letter: 'B',
            text: 'Fatalistic, suggesting that younger and lower-income voters cannot be re-engaged.',
            explanation: 'Incorrect: the author proposes concrete reforms (electoral mechanics, local power, civic education).'
          },
          {
            letter: 'C',
            text: 'Alarmist, warning that low turnout threatens the immediate collapse of Parliament.',
            explanation: 'Far more extreme than the measured tone of the passage.'
          },
          {
            letter: 'D',
            text: 'Concerned about its underlying causes, yet sceptical of coercive remedies.',
            explanation: 'Accurately reflects both the diagnosis ("symptom of political alienation") and the rejection of fines.'
          },
          {
            letter: 'E',
            text: 'Indifferent, arguing that turnout figures have no bearing on democratic health.',
            explanation: 'Contradicts the explicit acknowledgment in paragraph 4 that alienation is a real problem.'
          }
        ]
      }
    ]
  },
  {
    id: 'p3-right-to-be-forgotten',
    title: 'Memory, Mercy, and the Permanent Archive',
    domain: 'Media Law & Privacy',
    sourceStyle: 'Feature essay · Jurisprudence',
    wordCount: 440,
    freeTier: true,
    paragraphs: [
      'For most of human history, forgetting was the default condition of social life. A minor fraud reported in a provincial newspaper in 1978 faded within months into dusty microfiche, accessible only to a determined researcher. The search engine inverted that architecture. Today, a youthful indiscretion or a spent conviction sits permanently beside a person’s name, surfaced in milliseconds for every prospective employer, landlord, or acquaintance. Europe’s "right to be forgotten"—more precisely, the right to have outdated or irrelevant links delisted from name-based searches—was crafted to restore a measure of friction to digital memory.',
      'Critics, especially in the United States, have tended to cast delisting as a polite euphemism for censorship. History, they argue, belongs to the public; allowing individuals to edit what appears when their names are typed invites the powerful to scrub embarrassing truths from view. That anxiety is not fanciful. Politicians, financiers, and litigants have all attempted to use privacy law to bury legitimate journalism. Yet treating every delisting request as an assault on the historical record misses a crucial technical point: delisting does not delete the underlying newspaper article. The archive remains intact; only its effortless prominence under a personal name search is curtailed.',
      'Even so, the European model suffers from a structural flaw that its defenders rarely confront. Because courts could never adjudicate millions of individual requests, the initial balancing act between privacy and public interest has been delegated to private search companies. When a corporation decides whether a ten-year-old regulatory fine remains "relevant", it is exercising a quasi-judicial function behind closed doors, with neither adversarial argument nor published precedent. Commercial platforms have an obvious incentive to avoid regulatory penalties by granting borderline requests quietly, rather than fighting costly appeals on behalf of the public’s right to know.',
      'A durable settlement cannot rest on choosing blindly between total permanence and private erasure. Society genuinely needs mechanisms for rehabilitation—a principle the common law has long recognised in statutes governing spent convictions. Equally, the boundary between private rehabilitation and public accountability is too consequential to be policed by corporate compliance departments. If digital forgetting is to earn public trust, it must be governed by transparent, independent guidelines—and subject to open review—rather than the risk calculations of Silicon Valley.'
    ],
    questions: [
      {
        id: 'p3-q1',
        passageId: 'p3-right-to-be-forgotten',
        stem: 'According to paragraph 2, what do American critics of the "right to be forgotten" overlook?',
        skill: 'Inference',
        difficulty: 'Standard',
        paragraphRef: 2,
        correctLetter: 'B',
        rationale:
          'Paragraph 2 explicitly notes that critics miss "a crucial technical point": delisting removes a link from name-based searches without erasing the original article from the archive.',
        options: [
          {
            letter: 'A',
            text: 'Politicians and financiers rarely succeed when they file privacy complaints.',
            explanation: 'Not stated; the author only says they have attempted to use privacy law, without giving success rates.'
          },
          {
            letter: 'B',
            text: 'Delisting reduces the search visibility of an article without removing the article itself from the public archive.',
            explanation: 'Matches paragraph 2 verbatim in substance.'
          },
          {
            letter: 'C',
            text: 'United States privacy statutes already provide stronger protections for spent convictions than European law.',
            explanation: 'Nowhere in the passage is US privacy law compared favourably to European law.'
          },
          {
            letter: 'D',
            text: 'Newspaper archives from before the internet era were never accessible to researchers.',
            explanation: 'Contradicts paragraph 1 ("accessible only to a determined researcher").'
          },
          {
            letter: 'E',
            text: 'Most delisting requests come from journalists rather than private citizens.',
            explanation: 'Unsupported and contradicts the context of paragraph 2.'
          }
        ]
      },
      {
        id: 'p3-q2',
        passageId: 'p3-right-to-be-forgotten',
        stem: 'What is the "structural flaw" in the European model identified in paragraph 3?',
        skill: 'Main Argument',
        difficulty: 'Standard',
        paragraphRef: 3,
        correctLetter: 'D',
        rationale:
          'Paragraph 3 critiques delegating quasi-judicial privacy-versus-public-interest decisions to private search firms operating opaquely with an incentive to grant borderline requests to avoid fines.',
        options: [
          {
            letter: 'A',
            text: 'European courts take too long to hear appeals from newspaper publishers.',
            explanation: 'The issue is that courts cannot handle the volume at all, so initial decisions are outsourced to private firms.'
          },
          {
            letter: 'B',
            text: 'Search engines systematically reject valid privacy claims in order to maximise advertising revenue.',
            explanation: 'Reverses the incentive described in paragraph 3: platforms have an incentive to grant borderline requests quietly to avoid regulatory penalties.'
          },
          {
            letter: 'C',
            text: 'The law fails to distinguish between criminal convictions and civil regulatory fines.',
            explanation: 'Not argued; a regulatory fine is simply used as an example of a borderline case.'
          },
          {
            letter: 'D',
            text: 'Private corporations make opaque, quasi-judicial decisions about public interest under incentives skewed towards over-removal.',
            explanation: 'Captures both the opaque delegation and the skewed compliance incentive.'
          },
          {
            letter: 'E',
            text: 'Delisting orders apply only within Europe and can be bypassed by users elsewhere.',
            explanation: 'Territorial jurisdiction is not mentioned in the passage.'
          }
        ]
      },
      {
        id: 'p3-q3',
        passageId: 'p3-right-to-be-forgotten',
        stem: 'Why does the author refer to "statutes governing spent convictions" in paragraph 4?',
        skill: 'Structure & Evidence',
        difficulty: 'Challenging',
        paragraphRef: 4,
        correctLetter: 'A',
        rationale:
          'Spent-conviction statutes show that rehabilitation—limiting the permanent social stigma of past mistakes—is already an established legal principle, not an alien invention of digital privacy law.',
        options: [
          {
            letter: 'A',
            text: 'To show that the principle of rehabilitation already has a legal precedent.',
            explanation: 'The example shows that limiting the enduring consequences of a conviction is not a new principle.'
          },
          {
            letter: 'B',
            text: 'To identify the limits the author thinks should govern which kinds of online records can be delisted.',
            explanation: 'The analogy supports the principle, not restricting delisting to conviction records.'
          },
          {
            letter: 'C',
            text: 'To explain how another area of law already prevents older newspaper articles from appearing in internet searches.',
            explanation: 'Spent-conviction rules illustrate rehabilitation, not a working model for internet search.'
          },
          {
            letter: 'D',
            text: 'To suggest that search companies are applying criminal record legislation to the wrong classes of applicants.',
            explanation: 'The problem with companies is how decisions are made, not their application of spent-conviction law.'
          },
          {
            letter: 'E',
            text: 'To distinguish the value of a fair hearing in privacy disputes from the fairness of earlier criminal proceedings.',
            explanation: 'The historical example concerns the effects of a conviction over time, not whether the original hearing was fair.'
          }
        ]
      }
    ]
  },
  {
    id: 'p4-carbon-tariffs',
    title: 'Green Borders, Uneven Costs',
    domain: 'Economics & International Trade',
    sourceStyle: 'Policy analysis · Trade & climate',
    wordCount: 435,
    freeTier: false,
    paragraphs: [
      'When the European Union introduced its Carbon Border Adjustment Mechanism, requiring importers of steel, cement, and fertiliser to pay a levy reflecting the emissions embedded in their goods, the logic appeared unassailable. If domestic manufacturers must pay steep carbon prices while foreign rivals pollute freely, heavy industry will simply migrate offshore—a phenomenon economists call "carbon leakage". Global emissions remain unchanged, while European workers lose their jobs. A border tariff levels the playing field and nudges trading partners to adopt carbon pricing of their own.',
      'From the vantage point of emerging economies, however, the policy looks less like a climate catalyst and more like green protectionism. Industrialising nations such as India and South Africa point out that Western economies built their wealth during two centuries of unconstrained coal combustion. Imposing a uniform carbon price at the border treats a country with per-capita emissions of two tonnes as though it bore the same historical responsibility as one that emitted ten times as much. Under the United Nations framework’s principle of "common but differentiated responsibilities", poorer nations were promised financial and technological support to decarbonise—not trade penalties when they lack the capital to do so overnight.',
      'Supporters of border levies counter that climate physics is indifferent to historical grievances: a tonne of carbon emitted in Gujarat warms the atmosphere just as effectively as a tonne emitted in Germany. That is true as a matter of atmospheric chemistry, yet misleading as a matter of diplomacy. International climate cooperation depends on trust. If developing states conclude that environmental rules are being written unilaterally in Brussels and Washington to shield domestic industries, the political backlash may stall broader agreements on deforestation, methane, and clean-energy finance.',
      'Border adjustments need not be abandoned altogether, for carbon leakage is a real risk. Still, their legitimacy hinges on where the revenue goes. If the proceeds of carbon tariffs are absorbed into the general treasuries of rich importing blocs, the charge of protectionism will stick. Recycling those revenues directly into concessional green-transition funds for affected exporting countries would address both halves of the dilemma: preserving the price signal against dirty production while honouring the equity bargain that makes global climate action politically sustainable.'
    ],
    questions: [
      {
        id: 'p4-q1',
        passageId: 'p4-carbon-tariffs',
        stem: 'Which of the following best describes the author’s response to the argument that "climate physics is indifferent to historical grievances" (paragraph 3)?',
        skill: 'Tone & Attitude',
        difficulty: 'Standard',
        paragraphRef: 3,
        correctLetter: 'C',
        rationale:
          'The author concedes the scientific truth of the point ("true as a matter of atmospheric chemistry") but argues it is politically short-sighted because eroding trust can derail broader climate cooperation.',
        options: [
          {
            letter: 'A',
            text: 'The author rejects the scientific premise that emissions from different regions have equal warming effects.',
            explanation: 'Directly contradicted by "That is true as a matter of atmospheric chemistry".'
          },
          {
            letter: 'B',
            text: 'The author agrees completely and concludes that historical responsibility should no longer guide climate talks.',
            explanation: 'Ignores the "yet misleading as a matter of diplomacy" pivot.'
          },
          {
            letter: 'C',
            text: 'The author accepts its scientific accuracy while warning that ignoring equity undermines the diplomatic cooperation climate policy needs.',
            explanation: 'Accurately captures both the concession and the diplomatic critique.'
          },
          {
            letter: 'D',
            text: 'The author dismisses it as a pretext invented by European steel manufacturers to protect profits.',
            explanation: 'Too cynical; the author acknowledges carbon leakage as a real risk in paragraph 4.'
          },
          {
            letter: 'E',
            text: 'The author argues that methane and deforestation are scientifically more urgent than industrial steel emissions.',
            explanation: 'Not claimed; methane and deforestation are cited as areas where diplomatic cooperation could stall.'
          }
        ]
      },
      {
        id: 'p4-q2',
        passageId: 'p4-carbon-tariffs',
        stem: 'What is the primary purpose of paragraph 4 within the passage as a whole?',
        skill: 'Structure & Evidence',
        difficulty: 'Standard',
        paragraphRef: 4,
        correctLetter: 'E',
        rationale:
          'Paragraph 4 proposes a synthesis—retaining border levies to prevent carbon leakage while recycling their revenue to exporting countries—to reconcile climate effectiveness with diplomatic equity.',
        options: [
          {
            letter: 'A',
            text: 'To urge the European Union to repeal its Carbon Border Adjustment Mechanism immediately.',
            explanation: 'Contradicts "Border adjustments need not be abandoned altogether".'
          },
          {
            letter: 'B',
            text: 'To show that carbon leakage is largely a theoretical concern unsupported by economic evidence.',
            explanation: 'Contradicts "for carbon leakage is a real risk".'
          },
          {
            letter: 'C',
            text: 'To argue that rich countries should replace carbon tariffs with voluntary corporate pledges.',
            explanation: 'Voluntary pledges are never mentioned.'
          },
          {
            letter: 'D',
            text: 'To demonstrate that India and South Africa have already adopted equivalent carbon taxes.',
            explanation: 'Nowhere stated in the passage.'
          },
          {
            letter: 'E',
            text: 'To propose a revenue-recycling compromise that preserves the climate incentive while addressing fairness concerns.',
            explanation: 'Precisely summarises the constructive solution of paragraph 4.'
          }
        ]
      },
      {
        id: 'p4-q3',
        passageId: 'p4-carbon-tariffs',
        stem: 'Which of the following can most safely be inferred from paragraph 2?',
        skill: 'Inference',
        difficulty: 'Challenging',
        paragraphRef: 2,
        correctLetter: 'A',
        rationale:
          'Paragraph 2 notes that poorer nations were promised financial and technological support under the UN principle rather than trade penalties when they lack capital—implying emerging economies view border tariffs as inconsistent with prior international commitments.',
        options: [
          {
            letter: 'A',
            text: 'Emerging economies see unilateral carbon tariffs as inconsistent with earlier climate equity commitments.',
            explanation: 'They read the tariffs against the earlier recognition that obligations and historical responsibility differ.'
          },
          {
            letter: 'B',
            text: 'India and South Africa object mainly because the tariffs are calculated using national emissions rather than individual products.',
            explanation: 'The paragraph describes a broader dispute about responsibility, not this objection to the calculation.'
          },
          {
            letter: 'C',
            text: 'Emerging economies would accept a uniform tariff if the United Nations rather than Europe collected it.',
            explanation: 'The passage gives no reason to expect agreement simply because the collector changes.'
          },
          {
            letter: 'D',
            text: 'Emerging economies consider assistance unnecessary as long as Europeans reduce their own industrial emissions first.',
            explanation: 'The paragraph does not treat support as unnecessary; it highlights an obligation to provide it.'
          },
          {
            letter: 'E',
            text: 'Earlier climate negotiations settled how much each country must pay when its exports generate carbon emissions.',
            explanation: 'The principle of differentiated responsibility did not settle the operation or legitimacy of these tariffs.'
          }
        ]
      }
    ]
  },
  {
    id: 'p5-campus-neutrality',
    title: 'When Universities Speak as One',
    domain: 'Ethics & Higher Education',
    sourceStyle: 'Argumentative essay · Public philosophy',
    wordCount: 450,
    freeTier: false,
    paragraphs: [
      'Over the past decade, British and American universities have acquired a habit of issuing official statements on geopolitical crises, Supreme Court rulings, and domestic social movements. The impulse is understandable: vice-chancellors face urgent petitions from students and staff demanding to know "where the institution stands", and silence is routinely interpreted as callousness or complicity. Yet a growing number of scholars argue that universities should return to the 1967 Kalven Report principle of institutional neutrality—speaking collectively only when a political matter directly affects the university’s core mission of teaching and research.',
      'The case for neutrality is often misunderstood as a call for moral indifference. In truth, it rests on a sharper claim about what a university is for. A university is not a campaigning charity or a political party; it is a forum whose legitimacy depends on allowing individual academics and students to argue fiercely over contested questions. The moment a vice-chancellor proclaims an official institutional orthodoxy on a disputed war or policy, dissenting scholars are subtly recategorised—no longer participants in an open inquiry, but embarrassments to the corporate brand. Even if no formal sanction follows, the chilling effect on junior researchers without tenure is real.',
      'Sceptics reply that pure neutrality is a mirage. Universities already take non-neutral stances every day through their endowment investments, their partnerships with defence contractors, and the donors whose names they carve onto lecture theatres. Refusing to comment on a crisis while profiting from it, they contend, is itself a political choice. There is force in this critique: an institution that claims neutrality must be scrupulous about avoiding hypocrisy in its financial governance. Still, the fact that an institution’s investments raise ethical questions does not prove that its administrators should issue weekly moral communiqués on every global conflict.',
      'Indeed, once a university abandons restraint, it traps itself in an impossible calculus of selective outrage. Every statement invites the question of why another atrocity went unmentioned, turning university leadership into a permanent arbiter of which tragedies merit official grief. By stepping back from corporate pronouncements—while fiercely protecting the right of its members to protest, publish, and disagree—a university does not retreat from the moral world. It preserves the rare institutional space in which moral arguments can actually be tested.'
    ],
    questions: [
      {
        id: 'p5-q1',
        passageId: 'p5-campus-neutrality',
        stem: 'According to paragraph 2, how can an official university statement chill academic freedom even without formal disciplinary penalties?',
        skill: 'Inference',
        difficulty: 'Standard',
        paragraphRef: 2,
        correctLetter: 'B',
        rationale:
          'Paragraph 2 explains that once leadership adopts an official stance, dissenters are cast as liabilities to the institutional brand—an informal pressure felt acutely by junior researchers lacking tenure.',
        options: [
          {
            letter: 'A',
            text: 'By legally prohibiting students from organising protests on campus grounds.',
            explanation: 'No legal prohibition on protests is mentioned in paragraph 2.'
          },
          {
            letter: 'B',
            text: 'By signalling an institutional orthodoxy that makes dissenting junior scholars feel professionally exposed.',
            explanation: 'Directly captures "embarrassments to the corporate brand" and the chilling effect on non-tenured researchers.'
          },
          {
            letter: 'C',
            text: 'By forcing external donors to withdraw funding from controversial research departments.',
            explanation: 'Donor reactions are not part of paragraph 2’s mechanism.'
          },
          {
            letter: 'D',
            text: 'By preventing vice-chancellors from participating in public policy debates as private citizens.',
            explanation: 'Not discussed in the passage.'
          },
          {
            letter: 'E',
            text: 'By replacing peer-reviewed journals with administrative newsletters.',
            explanation: 'Unsupported exaggeration.'
          }
        ]
      },
      {
        id: 'p5-q2',
        passageId: 'p5-campus-neutrality',
        stem: 'How does the author handle the sceptics’ objection about endowment investments in paragraph 3?',
        skill: 'Structure & Evidence',
        difficulty: 'Challenging',
        paragraphRef: 3,
        correctLetter: 'D',
        rationale:
          'The author grants that financial governance raises legitimate ethical concerns ("There is force in this critique") but separates financial scrupulousness from issuing public moral statements.',
        options: [
          {
            letter: 'A',
            text: 'By treating investment choices as the trustees’ private business rather than a question of institutional ethics.',
            explanation: 'The author accepts that these choices raise ethical questions.'
          },
          {
            letter: 'B',
            text: 'By accepting that a university’s investments amount to a political position it should publicly announce.',
            explanation: 'The author distinguishes financial decisions from statements on outside events.'
          },
          {
            letter: 'C',
            text: 'By giving investment policy priority over public statements whenever both options are available.',
            explanation: 'The point is that they serve different purposes, not that they are interchangeable options.'
          },
          {
            letter: 'D',
            text: 'By distinguishing ethical management of investments from issuing statements about world events.',
            explanation: 'The objection matters for institutional conduct but does not establish a reason to issue statements.'
          },
          {
            letter: 'E',
            text: 'By making an exception for disputes in which the university’s investments give it a direct stake.',
            explanation: 'The author does not offer that exception in response to the objection.'
          }
        ]
      },
      {
        id: 'p5-q3',
        passageId: 'p5-campus-neutrality',
        stem: 'What is the "impossible calculus of selective outrage" described in paragraph 4?',
        skill: 'Main Argument',
        difficulty: 'Standard',
        paragraphRef: 4,
        correctLetter: 'A',
        rationale:
          'Once a university comments on some crises, every omission looks like a deliberate value judgement about which tragedies matter, forcing administrators into an untenable ranking of global suffering.',
        options: [
          {
            letter: 'A',
            text: 'Commenting on some crises makes silence on others look like a judgement about their importance.',
            explanation: 'Once speaking is an option, omissions can be read as deliberate choices.'
          },
          {
            letter: 'B',
            text: 'Universities cannot speak on global crises until students and staff reach agreement on their significance.',
            explanation: 'The problem is how selective statements are read, not how agreement is secured.'
          },
          {
            letter: 'C',
            text: 'A university that comments on events abroad will be expected to defend its stance in its teaching.',
            explanation: 'The dilemma concerns which events to address, not what to teach.'
          },
          {
            letter: 'D',
            text: 'University leaders must reach the same moral judgement about each crisis on which they speak.',
            explanation: 'The difficulty arises before leaders decide what to say: they must decide whether to speak.'
          },
          {
            letter: 'E',
            text: 'Universities must weigh the risk to their reputation against their obligation to comment on events abroad.',
            explanation: 'The author does not assume an obligation to comment.'
          }
        ]
      },
      {
        id: 'p5-q4',
        passageId: 'p5-campus-neutrality',
        stem: 'Which of the following would the author be most likely to support under the Kalven Report principle?',
        skill: 'Assumption & Flaw',
        difficulty: 'Challenging',
        paragraphRef: 1,
        correctLetter: 'E',
        rationale:
          'Paragraph 1 specifies that under institutional neutrality, a university speaks collectively "only when a political matter directly affects the university’s core mission of teaching and research". Visa rules restricting international students and visiting scholars directly affect that core mission.',
        options: [
          {
            letter: 'A',
            text: 'A university statement condemning a foreign government’s domestic tax reform.',
            explanation: 'Unrelated to the university’s core mission of teaching and research.'
          },
          {
            letter: 'B',
            text: 'A ban prohibiting professors from signing open letters in national newspapers.',
            explanation: 'Contradicts paragraph 4, which insists on fiercely protecting members’ right to protest and publish.'
          },
          {
            letter: 'C',
            text: 'An official university endorsement of a political party during a general election.',
            explanation: 'Directly violates institutional neutrality.'
          },
          {
            letter: 'D',
            text: 'A refusal by a university to disclose any information about its endowment holdings.',
            explanation: 'Contradicts paragraph 3’s call to be "scrupulous about avoiding hypocrisy in its financial governance".'
          },
          {
            letter: 'E',
            text: 'A collective university objection to legislation that restricts academic visas and research funding.',
            explanation: 'Directly affects the university’s core mission of teaching and research, matching the Kalven exception in paragraph 1.'
          }
        ]
      }
    ]
  },
  {
    id: 'p6-gene-editing-consent',
    title: 'Editing Tomorrow’s Citizens',
    domain: 'Bioethics & Philosophy',
    sourceStyle: 'Philosophical essay · Bioethics',
    wordCount: 430,
    freeTier: false,
    paragraphs: [
      'Few developments in modern biology have provoked more unease than heritable human genome editing—altering the DNA of an embryo so that the change is passed on to future generations. Unlike somatic gene therapy, which treats a consenting patient’s own cells without affecting their descendants, germline editing redraws a biological inheritance for people who do not yet exist. Critics therefore reach instinctively for the language of consent: no future child can agree to have their genome rewritten, and making irreversible choices on their behalf violates their autonomy.',
      'Yet the consent objection, taken on its own, proves both too much and too little. Every prospective parent makes profound, irreversible choices for an unconsenting future child—from the country in which they will be raised to the decision to bring them into existence at all. Moreover, if a genetic intervention could reliably prevent a devastating, fatal condition such as Tay-Sachs disease, it is strained to call that intervention a violation of the child’s autonomy. Few moral philosophers think we wrong a future person by sparing them brief, agonising suffering, even though we could not ask their permission beforehand.',
      'The stronger case for caution lies not in the impossibility of consent, but in the asymmetry between preventing harm and engineering advantage. Medicine has a relatively clear, widely shared understanding of severe genetic disease; it has no comparable consensus on what counts as an "improvement" in temperament, cognition, or physique. Once germline tools move beyond rare monogenic disorders into enhancement, parental ambition begins to replace medical necessity, and traits that reflect passing social fashions risk being etched permanently into human biology. Worse, because safe access to such technologies would almost certainly be expensive, genetic enhancement threatens to convert economic inequality into biological stratification.',
      'A sensible regulatory boundary therefore resists both extremes: it neither treats every heritable edit as a metaphysical taboo nor opens the door to a consumer market in designer traits. Strict international moratoria remain justified today primarily because the science is still unsafe and off-target mutations are poorly understood. If clinical safety is eventually established, the proper question will not be whether future children consented, but whether society can hold a firm, enforceable line between curing severe suffering and commercialising human design.'
    ],
    questions: [
      {
        id: 'p6-q1',
        passageId: 'p6-gene-editing-consent',
        stem: 'Why does the author claim in paragraph 2 that the consent objection "proves both too much and too little"?',
        skill: 'Assumption & Flaw',
        difficulty: 'Challenging',
        paragraphRef: 2,
        correctLetter: 'C',
        rationale:
          'It proves "too much" because parents routinely make irreversible decisions for unconsenting future children (like where to raise them), and "too little" because preventing a fatal disease like Tay-Sachs does not plausibly wrong the child despite the absence of consent.',
        options: [
          {
            letter: 'A',
            text: 'Because it applies to decisions that affect descendants but overlooks the difference between reversible and irreversible choices.',
            explanation: 'The examples already include ordinary choices with irreversible consequences.'
          },
          {
            letter: 'B',
            text: 'Because it treats prevention and enhancement alike although parents may have different motives for pursuing them.',
            explanation: 'The passage tests lack of consent as an objection in itself, rather than examining parents’ motives.'
          },
          {
            letter: 'C',
            text: 'Because it condemns ordinary parenting choices but cannot explain why preventing fatal disease wrongs the child.',
            explanation: 'The first consequence is too sweeping; the second exposes what the objection fails to establish.'
          },
          {
            letter: 'D',
            text: 'Because it assumes parents have less authority over treatment decisions than over decisions about where to live.',
            explanation: 'The comparison does not rank parental authority; it shows that consent is absent in both cases.'
          },
          {
            letter: 'E',
            text: 'Because it demands consent from the future child without considering whether someone else could provide it instead.',
            explanation: 'Whether somebody could give consent on the child’s behalf is not part of the argument.'
          }
        ]
      },
      {
        id: 'p6-q2',
        passageId: 'p6-gene-editing-consent',
        stem: 'What is the primary reason the author supports strict international moratoria on heritable gene editing at present?',
        skill: 'Inference',
        difficulty: 'Standard',
        paragraphRef: 4,
        correctLetter: 'A',
        rationale:
          'Paragraph 4 explicitly states: "Strict international moratoria remain justified today primarily because the science is still unsafe and off-target mutations are poorly understood."',
        options: [
          {
            letter: 'A',
            text: 'Current techniques remain clinically unsafe and carry poorly understood mutation risks.',
            explanation: 'Directly stated in paragraph 4.'
          },
          {
            letter: 'B',
            text: 'Altering human DNA is inherently immoral regardless of medical benefit.',
            explanation: 'Explicitly rejected in paragraph 4 ("neither treats every heritable edit as a metaphysical taboo").'
          },
          {
            letter: 'C',
            text: 'Consumer clinics are already selling cognitive enhancements to wealthy parents.',
            explanation: 'Presented as a future risk ("Once germline tools move beyond..."), not an existing commercial reality.'
          },
          {
            letter: 'D',
            text: 'Future generations cannot sign informed-consent forms before birth.',
            explanation: 'The author explicitly criticises relying on the consent objection in paragraphs 2 and 4.'
          },
          {
            letter: 'E',
            text: 'Somatic gene therapy can already cure every rare monogenic disorder.',
            explanation: 'Not claimed anywhere in the passage.'
          }
        ]
      },
      {
        id: 'p6-q3',
        passageId: 'p6-gene-editing-consent',
        stem: 'Which of the following best summarises the concern raised in paragraph 3?',
        skill: 'Main Argument',
        difficulty: 'Standard',
        paragraphRef: 3,
        correctLetter: 'D',
        rationale:
          'Paragraph 3 argues that unlike curing severe disease, genetic "enhancement" lacks medical consensus, reflects passing social fashions, and risks turning wealth gaps into inherited biological divides.',
        options: [
          {
            letter: 'A',
            text: 'Scientists are unable to distinguish monogenic diseases from environmental illnesses.',
            explanation: 'Contradicts paragraph 3, which says medicine has a relatively clear understanding of severe genetic disease.'
          },
          {
            letter: 'B',
            text: 'Governments should subsidise cosmetic gene editing so that low-income families can access it.',
            explanation: 'Not proposed; the author advocates holding a line against commercialising human design.'
          },
          {
            letter: 'C',
            text: 'Parental ambition is the primary reason severe genetic diseases have not been eradicated.',
            explanation: 'Misreads the role of parental ambition in paragraph 3.'
          },
          {
            letter: 'D',
            text: 'Moving from disease prevention to non-medical enhancement invites subjective preferences and risks entrenching inequality biologically.',
            explanation: 'Synthesises both key points of paragraph 3 accurately.'
          },
          {
            letter: 'E',
            text: 'Curing rare genetic disorders will inevitably reduce human biological diversity.',
            explanation: 'Biological diversity is not mentioned in the passage.'
          }
        ]
      },
      {
        id: 'p6-q4',
        passageId: 'p6-gene-editing-consent',
        stem: 'Which word best describes the author’s overall tone in the passage?',
        skill: 'Tone & Attitude',
        difficulty: 'Standard',
        paragraphRef: 4,
        correctLetter: 'B',
        rationale:
          'The author carefully weighs competing arguments, rejects both absolute prohibition and unregulated enhancement, and argues for principled, evidence-sensitive boundaries.',
        options: [
          {
            letter: 'A',
            text: 'Enthusiastic and techno-optimistic.',
            explanation: 'Ignores the serious warnings about safety, social fashion, and biological stratification.'
          },
          {
            letter: 'B',
            text: 'Measured and analytically discriminating.',
            explanation: 'Matches the careful distinctions between consent vs. harm, therapy vs. enhancement, and current safety vs. future governance.'
          },
          {
            letter: 'C',
            text: 'Indignant and morally absolutist.',
            explanation: 'Contradicts the explicit rejection of treating edits as a "metaphysical taboo".'
          },
          {
            letter: 'D',
            text: 'Sarcastic and dismissive of bioethicists.',
            explanation: 'There is no sarcasm; the author engages respectfully with philosophical objections.'
          },
          {
            letter: 'E',
            text: 'Uncertain and unwilling to reach a conclusion.',
            explanation: 'The author reaches a clear regulatory conclusion in paragraph 4.'
          }
        ]
      }
    ]
  }
];

export { FULL_MOCK_PASSAGES };

export const PASSAGES: LnatPassage[] = [...CORE_PASSAGES, ...EXTRA_PASSAGES, ...FULL_MOCK_PASSAGES];

export const ALL_QUESTIONS = PASSAGES.flatMap((p) => p.questions);
