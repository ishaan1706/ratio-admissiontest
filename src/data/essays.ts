import { EssaySet } from '../types';

export const ESSAY_SETS: EssaySet[] = [
  {
    id: 'set-1',
    title: 'Paper Set I · Liberty, Media & The State',
    subtitle: 'Choose 1 of 3 prompts · 40 minutes · Target 500–750 words',
    freeTier: true,
    prompts: [
      {
        id: 'e1-1',
        theme: 'Criminal Justice & Ethics',
        question: 'Should juries be abolished in favour of trials by professional judges?',
        planningHints: [
          'Define what juries are meant to achieve: democratic legitimacy, community standards, and a check on state power.',
          'Weigh the strongest critique: unreasoned verdicts, susceptibility to media bias, and difficulty with complex fraud/technical trials.',
          'Consider a nuanced thesis: preserve juries for serious criminal trials while allowing judge-only trials in narrowly defined complex cases.'
        ],
        counterArguments: [
          'Professional judges give written, appealable reasons; juries do not.',
          'Judges can become case-hardened or drawn from a narrow social background.'
        ],
        modelOutline: {
          thesis:
            'While professional judges excel at reasoned legal analysis, abolishing juries wholesale would sacrifice a vital democratic check on state power; reform should instead target specific weaknesses such as ultra-complex financial trials.',
          points: [
            'Juries inject lay common sense and democratic legitimacy into the state’s most coercive act: depriving a citizen of liberty.',
            'Judges are not immune to bias; case-hardening and institutional homogeneity carry their own risks.',
            'Where juries genuinely struggle—long, document-heavy fraud trials—narrow statutory exceptions (as in Northern Ireland’s Diplock history or Section 43 proposals) are preferable to abolition.'
          ],
          counterRebuttal:
            'Critics rightly note that juries deliver unreasoned verdicts, making error harder to detect on appeal. Yet this can be mitigated through structured "route to verdict" directions from the trial judge without discarding lay participation.',
          sampleOpening:
            'A criminal trial is not merely a technical exercise in fact-finding; it is the moment at which the state asks permission to punish one of its own citizens. Proposals to replace juries with professional judges rest on an understandable desire for consistency and written reasons, yet they mistake administrative efficiency for democratic legitimacy.'
        }
      },
      {
        id: 'e1-2',
        theme: 'Technology & Regulation',
        question: 'Should social media platforms be held legally liable as publishers for content posted by their users?',
        planningHints: [
          'Clarify the legal distinction between a passive conduit (like a telephone network) and an editorial publisher (like a newspaper).',
          'Focus on algorithmic amplification: once a platform actively ranks and promotes outrage for profit, does it forfeit "neutral conduit" status?',
          'Address the practical risk: strict publisher liability could force automated over-censorship of lawful political speech.'
        ],
        counterArguments: [
          'Billions of daily posts make pre-publication human editorial review impossible.',
          'Without liability, platforms profit from viral defamation and harm while externalising the cost.'
        ],
        modelOutline: {
          thesis:
            'Social media platforms should not bear full traditional publisher liability for every user post, as that would incentivise automated censorship; however, they should face strict statutory duty-of-care liability whenever their own recommendation algorithms amplify unlawful content.',
          points: [
            'Traditional publisher liability assumes editorial pre-selection, which does not map cleanly onto open, real-time user forums.',
            'Yet modern platforms are not passive pipes: engagement-optimising feeds make editorial-like choices about what millions see.',
            'A tiered framework—immunity for chronological hosting, liability for algorithmic promotion and failure to remove flagged illegality—aligns incentives without chilling speech.'
          ],
          counterRebuttal:
            'Free-speech advocates warn that even tiered liability pushes risk-averse platforms to delete controversial political debate. Narrowing liability to clearly defined unlawful categories (defamation, incitement, fraud) and requiring transparent appeals limits that overreach.',
          sampleOpening:
            'When early internet statutes shielded online platforms from publisher liability, they imagined digital noticeboards rather than algorithmic broadcasters. Today’s largest social networks do not merely host speech; they curate, rank, and monetise attention at a scale no newspaper editor ever commanded.'
        }
      },
      {
        id: 'e1-3',
        theme: 'Education & Society',
        question: '“Private schools entrench social inequality and should lose their charitable status.” Discuss.',
        planningHints: [
          'Distinguish between abolishing private schools (a liberty question) and removing tax/charitable subsidies (a public-finance question).',
          'Evaluate the public-benefit argument: do bursaries and shared facilities justify tax exemptions?',
          'Consider knock-on effects: if fees rise and pupils move to the state sector, does the state save or lose money net?'
        ],
        counterArguments: [
          'Parents who pay private fees also pay taxes funding state schools their children do not use.',
          'Charitable status implies genuine public benefit, not subsidising exclusive social networks.'
        ],
        modelOutline: {
          thesis:
            'Removing charitable tax reliefs from fee-charging private schools is justified on grounds of fiscal fairness and the proper definition of charity, even if it will not by itself dismantle Britain’s deeper educational inequalities.',
          points: [
            'Charitable status exists to subsidise organisations whose primary benefit flows to the public, not to those able to pay £20,000–£45,000 in annual fees.',
            'Targeted bursaries, while valuable, typically cover a small minority of pupils and cannot retrospectively justify blanket relief.',
            'Even after removing tax advantages, policy must focus on raising state-school funding and tackling catchment-area house-price sorting.'
          ],
          counterRebuttal:
            'Opponents argue that private-school parents already relieve pressure on the state budget. Yet taxpayers without children—or those who buy private healthcare—receive no equivalent tax rebate for opting out of universal public services.',
          sampleOpening:
            'Debates over private education in Britain often slide too quickly into a clash between parental liberty and egalitarian coercion. Stripping fee-paying schools of charitable tax exemptions, however, is a far narrower proposition: it asks not whether parents may buy private schooling, but whether the public purse should subsidise them for doing so.'
        }
      }
    ]
  },
  {
    id: 'set-2',
    title: 'Paper Set II · Rights, Science & Democracy',
    subtitle: 'Choose 1 of 3 prompts · 40 minutes · Target 500–750 words',
    freeTier: true,
    prompts: [
      {
        id: 'e2-1',
        theme: 'Democracy & Representation',
        question: 'Should the voting age in national elections be lowered to sixteen?',
        planningHints: [
          'Test the consistency of age thresholds: sixteen-year-olds can pay income tax, work full-time, and consent to medical treatment, yet cannot buy alcohol or serve on juries.',
          'Address the maturity / political knowledge objection—and note that we do not apply knowledge tests to adults.',
          'Consider evidence from Scotland and Austria on early habit-formation in turnout.'
        ],
        counterArguments: [
          'Most 16-year-olds still live at home and may echo parental views rather than voting independently.',
          'Enfranchising 16-year-olds while they are still in school builds lifelong voting habits.'
        ],
        modelOutline: {
          thesis:
            'Lowering the voting age to sixteen is justified both by democratic fairness—since sixteen-year-olds are directly subject to laws and taxation—and by empirical evidence that early enfranchisement strengthens lifelong civic participation.',
          points: [
            'The "maturity" objection fails a consistency test: democracies rightly refuse to test adult voters for political literacy or independence.',
            'Sixteen-year-olds bear real stakes in long-term policies (climate, education, housing) that outlast older cohorts.',
            'Experience in Scottish and Austrian elections suggests 16–17-year-olds turn out at higher rates than 18–21-year-olds who have just left home.'
          ],
          counterRebuttal:
            'Critics note that the law still treats 16-year-olds as minors in areas like alcohol or jury service. Yet age thresholds already vary by activity according to the specific risk involved; casting a single secret ballot carries none of the irreversible personal harms that justify restrictions on alcohol or military combat.',
          sampleOpening:
            'Age limits in a democracy are always approximations, yet some approximations age worse than others. When sixteen-year-olds may leave school, enter employment, and pay income tax, excluding them from the franchise requires a stronger justification than habit alone.'
        }
      },
      {
        id: 'e2-2',
        theme: 'Medical Ethics',
        question: 'Should organ donation operate on an opt-out rather than an opt-in basis?',
        planningHints: [
          'Contrast bodily autonomy and informed consent against the concrete moral urgency of saving lives on transplant waiting lists.',
          'Examine the role of "default bias" (nudge theory): is using inertia to harvest organs ethically legitimate?',
          'Discuss the practical reality of family vetoes in countries like England and Wales that have already adopted deemed consent.'
        ],
        counterArguments: [
          'Presumed consent is a contradiction in terms: silence is not consent.',
          'Most surveys show a large majority support organ donation in principle but never get around to registering.'
        ],
        modelOutline: {
          thesis:
            'A "soft" opt-out system—paired with effortless opting out, public awareness campaigns, and family consultation—strikes the right balance between respecting bodily autonomy and preventing avoidable deaths.',
          points: [
            'The gap between public support for donation (~80%) and active registration (~40%) shows that opt-in defaults frustrate, rather than express, most citizens’ actual preferences.',
            'Providing simple, free, and widely publicised opt-out mechanisms preserves genuine choice for those with religious or personal objections.',
            'Policy alone is not a panacea: investment in specialist transplant nurses and ICU infrastructure matters as much as the legal default.'
          ],
          counterRebuttal:
            'Philosophers warn that "deemed consent" stretches the concept of consent beyond recognition. That critique is sharpest against hard opt-out systems; a soft opt-out system framed honestly as a default social norm—with family override—avoids pretending that inertia equals explicit enthusiasm.',
          sampleOpening:
            'Every year, hundreds of patients die on transplant waiting lists despite overwhelming public approval for organ donation. The ethical question behind opt-out legislation is whether the state may harness human inertia to save lives without trespassing on bodily sovereignty.'
        }
      },
      {
        id: 'e2-3',
        theme: 'Law & Protest',
        question: 'Is civil disobedience ever morally justified in a functioning democracy?',
        planningHints: [
          'Define civil disobedience carefully (public, non-violent, conscientious breach of law, accepting legal consequences—Rawls/MLK).',
          'Address the democratic objection: if citizens have the vote and free speech, why should anyone bypass the majority?',
          'Identify conditions where disobedience is justified: entrenched minority rights violations, urgent irreversible harm (e.g. climate), or exhausted lawful channels.'
        ],
        counterArguments: [
          'If every passionate minority breaks laws it dislikes, the rule of law collapses.',
          'Democracies are imperfect; majorities can ignore urgent harms or marginalised groups for decades.'
        ],
        modelOutline: {
          thesis:
            'Civil disobedience remains morally justified even in a functioning democracy, provided it is non-violent, proportionate, undertaken after lawful channels fail, and aimed at appealing to the public conscience rather than coercing it.',
          points: [
            'Electoral cycles and majoritarian inertia mean that even fair democracies can perpetuate grave injustices or delay action on irreversible harms.',
            'True civil disobedience respects the rule of law at a deeper level by acting openly and accepting legal sanction, distinguishing itself from ordinary lawbreaking.',
            'Strict boundaries are essential: violent coercion or prolonged disruption targeting vulnerable bystanders undermines both moral authority and public persuasion.'
          ],
          counterRebuttal:
            'Critics argue that permitting disobedience invites chaos because every group believes its cause is urgent. Yet moral justification is not legal immunity: the state may still prosecute proportionate offences while society judges whether the protester’s appeal was warranted.',
          sampleOpening:
            'In an authoritarian state, defying an unjust law requires little philosophical defence. In a democracy—where citizens possess the ballot, a free press, and an independent judiciary—the moral case for breaking the law is far harder, yet not impossible, to sustain.'
        }
      }
    ]
  },
  {
    id: 'set-3',
    title: 'Paper Set III · Global Justice & Culture',
    subtitle: 'Choose 1 of 3 prompts · 40 minutes · Target 500–750 words',
    freeTier: false,
    prompts: [
      {
        id: 'e3-1',
        theme: 'Cultural Heritage & Law',
        question: 'Should Western museums return artefacts acquired during the colonial era to their countries of origin?',
        planningHints: [
          'Avoid treating all artefacts identically: distinguish looted/sacred objects (e.g. Benin Bronzes) from items acquired through legitimate trade.',
          'Test the "universal museum" argument (global accessibility, conservation) against the claim of cultural sovereignty and historic injustice.',
          'Consider constructive middle grounds: legal transfer of title paired with rotating international loans.'
        ],
        counterArguments: [
          'Encyclopaedic museums allow millions from around the world to see human heritage side by side.',
          'Conservation arguments can sound paternalistic when source countries have built world-class museums.'
        ],
        modelOutline: {
          thesis:
            'Western museums have a compelling moral duty to return artefacts acquired through colonial looting or coercion, while addressing legitimate concerns about global access through collaborative loan agreements rather than continued unilateral possession.',
          points: [
            'Provenance matters: objects taken during punitive military expeditions cannot be defended on the same footing as lawful diplomatic gifts.',
            'The "universal museum" ideal rings hollow when universality is geographically concentrated in former imperial capitals.',
            'Transferring legal ownership while negotiating shared exhibitions respects both restorative justice and international scholarship.'
          ],
          counterRebuttal:
            'Defenders of retention argue that returning objects risks political instability or poorer conservation in some jurisdictions. While genuine physical-preservation risks can justify staged transfers or joint curation, they cannot permanently extinguish a rightful claim of ownership.',
          sampleOpening:
            'Arguments over colonial-era museum collections often pit the language of universal human heritage against the language of theft. Yet the two principles only collide if we assume that sharing culture with the world requires keeping what was never freely given.'
        }
      },
      {
        id: 'e3-2',
        theme: 'Economics & Ethics',
        question: 'Should there be a legal cap on the salaries of chief executives?',
        planningHints: [
          'Examine the moral case (soaring CEO-to-worker ratios, perceived unfairness) alongside the economic case (talent mobility, unintended circumvention via shares/perks).',
          'Distinguish private-sector autonomy from public-interest governance (shareholder votes, tax policy).',
          'Compare a rigid salary cap against alternative tools: progressive taxation, worker representation on remuneration boards, and pay-ratio transparency.'
        ],
        counterArguments: [
          'Hard caps are easily evaded through stock options, offshore packages, or relocation.',
          'Sky-high executive pay often reflects boardroom capture rather than genuine market performance.'
        ],
        modelOutline: {
          thesis:
            'While runaway executive pay reflects genuine failures in corporate governance, a rigid legal salary cap is a blunt and easily evaded instrument; progressive taxation and stronger shareholder-and-worker oversight offer more effective remedies.',
          points: [
            'Empirical evidence suggests executive compensation often tracks market luck and insular remuneration committees rather than individual value created.',
            'Nevertheless, statutory caps invite creative circumvention through equity grants, deferred bonuses, and corporate relocations.',
            'Reforming governance—binding shareholder votes, employee board representation, and higher top marginal tax rates—addresses inequality without distorting specific contracts.'
          ],
          counterRebuttal:
            'Supporters of a cap argue that tax rates alone fail to curb the symbolic excess of 100:1 pay ratios. Yet tying corporate tax deductions to reasonable pay ratios achieves a similar normative signal without the rigidity of an outright prohibition.',
          sampleOpening:
            'When the chief executive of a FTSE 100 company earns more in three days than their median employee earns in a year, public scepticism towards executive pay is hardly surprising. The harder question is whether a statutory ceiling on salaries would cure that excess or merely disguise it.'
        }
      },
      {
        id: 'e3-3',
        theme: 'AI & Employment',
        question: 'Should governments tax companies that replace human workers with artificial intelligence?',
        planningHints: [
          'Evaluate the goal: slowing displacement to buy time for retraining, and funding social safety nets as payroll tax bases shrink.',
          'Consider the economic trade-off: taxing productivity-enhancing automation may penalise competitiveness and raise consumer prices.',
          'Compare an "AI/robot tax" against broader capital-gains or corporate-profit taxation.'
        ],
        counterArguments: [
          'Defining what counts as "replacing a human with AI" is a bureaucratic minefield.',
          'Taxing labour (via payroll taxes) more heavily than capital/automation currently subsidises job displacement.'
        ],
        modelOutline: {
          thesis:
            'Rather than imposing a narrowly targeted "AI replacement tax"—which is nearly impossible to define cleanly—governments should rebalance the tax system so that corporate profits and capital are not taxed more lightly than human labour.',
          points: [
            'Current tax codes often favour automation by levying payroll and National Insurance taxes on human workers while offering capital allowances on software and machinery.',
            'A specific tax on "AI displacement" would struggle to separate tools that augment workers from tools that replace them, inviting litigation and gaming.',
            'Neutralising the tax bias against labour—and investing revenues in adult retraining—captures the gains of automation without penalising innovation.'
          ],
          counterRebuttal:
            'Proponents of an explicit AI tax argue that abrupt job losses require a dedicated friction mechanism to slow adoption. Yet deliberately hobbling productivity risks driving firms to competing jurisdictions; managing transition through retraining and broader profit taxation is more durable.',
          sampleOpening:
            'Every wave of technological change tempts policymakers to protect workers by taxing the new machine. Yet the real flaw in how modern economies handle artificial intelligence is not that automation goes untaxed, but that human labour is taxed more heavily than the capital replacing it.'
        }
      }
    ]
  }
];

export const ESSAY_RUBRIC = [
  {
    id: 'directness',
    label: 'Directness & Thesis',
    hint: 'Did you answer the exact question asked with a clear, defensible position from paragraph one?'
  },
  {
    id: 'coherence',
    label: 'Logical Structure',
    hint: 'Does each paragraph advance a distinct point rather than drifting or repeating itself?'
  },
  {
    id: 'counter',
    label: 'Counter-Argument Depth',
    hint: 'Did you steelman the strongest objection to your view and rebut it fairly?'
  },
  {
    id: 'clarity',
    label: 'Precision & Style',
    hint: 'Is your prose crisp, free of filler, and precise in defining key terms?'
  },
  {
    id: 'evidence',
    label: 'Examples & Nuance',
    hint: 'Did you ground abstract claims with concrete real-world examples or legal/ethical distinctions?'
  }
];
