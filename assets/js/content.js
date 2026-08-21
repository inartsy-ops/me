/* ============================================================================
 *  content.js — THE ONLY FILE YOU NEED TO EDIT.
 *
 *  Everything on the site is driven from this object. Change the text here,
 *  drop your PDF at assets/resume.pdf, and you're done.
 *  No build step. No dependencies. Just save and refresh.
 * ==========================================================================*/

window.SITE = {
  /* ---------------------------------------------------------------------
   *  1. IDENTITY  — shows in the header, hero, browser tab, and link previews
   * -------------------------------------------------------------------*/
  person: {
    name: 'Lavina Choudhary',
    initials: 'LC',
    role: 'I build the AI products and programs that decide who pharma field teams see, what they say, and when they get there.',
    tagline: 'I repeatedly take complex, emerging AI capabilities and turn them into scalable, measurable business products people can actually use.',
    location: '', // hidden while it's blank — the separator dot hides with it
    status: 'Open to conversations',
    // One string per paragraph. Add or remove entries freely.
    summary: [
      'I lead AI and platform products at Novartis, where I own Next Best Action, Dynamic targeting, and Decision-engine capabilities inside Field Insights & Analytics — the products that tell a field team who to see, what to plan and what to say.',
      'Before that came a decade of building GenAI, marketing strategy, and automation platforms at Amazon (6 years), Dun & Bradstreet (4), and GroupM (1), turning the Salesforce and CDP data underneath into audience targeting, activation, and identity resolution that drove $30M+ in revenue, grew reach 50%, and earned a US patent.',
      'Below you\'ll find my résumé, a few AI products I\'ve built, and the fastest ways to reach me.',
    ],
  },

  /* ---------------------------------------------------------------------
   *  2. RÉSUMÉ  — put your PDF at the path below
   * -------------------------------------------------------------------*/
  resume: {
    file: 'assets/resume.pdf',
    downloadAs: 'Lavina-Choudhary-CV.pdf',
    updated: 'August 2026',
    highlights: [
      { value: '10+', label: 'Years in AI, product & data science' },
      { value: '$50M+', label: 'Revenue enabled across products, programs, and platforms' },
      { value: '1', label: 'US Patent — AI/ML web-tracking classifier' },
    ],
  },

  /* ---------------------------------------------------------------------
   *  3. CONTACT & PROFILES  — delete any line you don't want shown
   * -------------------------------------------------------------------*/
  contact: {
    email: 'lavina.choudhary@novartis.com',
    // An "Email" link is added automatically from the address above — no need
    // to list it here. The patent now lives on its own card in Selected work.
    links: [
      { label: 'Call', href: 'tel:+13476986310' },
      { label: 'LinkedIn', href: '' }, // add your LinkedIn URL to show this
    ],
  },

  /* ---------------------------------------------------------------------
   *  4. FOCUS AREAS  — the "what I actually do" cards
   * -------------------------------------------------------------------*/
  focus: [
    {
      title: 'AI Strategy & Platforms',
      body: 'Enterprise AI transformation roadmaps and platform architecture — evaluating and shaping partnerships with Snowflake, Palantir, Databricks, and AWS to scale AI across the business.',
    },
    {
      title: 'Decision Engines & NBA',
      body: 'Next Best Action, customer targeting, call planning, and field-orchestration products that turn signals into a concrete, explainable action at the point of engagement.',
    },
    {
      title: 'GenAI & Data Science',
      body: 'Predictive models, ML-driven automation, and applied GenAI on AWS Bedrock — from risk reduction to process efficiency to real-time reporting on model performance.',
    },
    {
      title: 'Programmatic & CDP',
      body: 'Audience targeting, probabilistic identity, and CDP-ready customer intelligence — built on some of the largest deterministic commercial datasets in market.',
    },
  ],

  /* ---------------------------------------------------------------------
   *  5. SELECTED WORK  — the project gallery
   *
   *  Each card opens in a lightbox. Three supported sources, in order of
   *  precedence:
   *
   *    demo:  'assets/demos/thing.html'                 <- live HTML build
   *    embed: 'https://www.youtube.com/embed/VIDEO_ID'  <- YouTube / Vimeo
   *    video: 'assets/video/demo.mp4'                   <- local file
   *
   *  A demo is a self-contained HTML file dropped in assets/demos/. It runs
   *  for real inside the panel, and the card says "Open demo" not "Play".
   * -------------------------------------------------------------------*/
  work: [
    {
      title: 'Customer Targeting Agent',
      kind: 'AI product demo',
      year: '2026',
      duration: 'Live demo',
      blurb:
        'The upstream question the other two depend on: which HCPs are worth a rep\'s time at all. Six vendor and internal feeds land in a weighted Rx model — Rx volume and decile, engagement, specialty-pharmacy volume, EMR signal, formulary access, congress activity — which scores every prescriber and sorts them into T1/T2/T3 tiers. Every score opens up into its own component breakdown, so a field lead can see exactly what earned a tier, and the list exports straight to CSV.',
      tags: ['Targeting', 'Rx Model', 'Segmentation', 'Explainability'],
      poster: '',
      demo: 'assets/demos/customer-targeting-agent.html',
      video: '',
      embed: '',
      links: [
        { label: 'Open full screen', href: 'assets/demos/customer-targeting-agent.html' },
        { label: 'View build conversation', href: 'https://claude.ai/chat/45a377dd-8723-4397-ba2d-dbaf117e8ec5' },
      ],
    },
    {
      title: 'Call Plan Agent',
      kind: 'AI product demo',
      year: '2026',
      duration: 'Live demo',
      blurb:
        'An AI call-planning tool for oncology field reps. It pulls each HCP\u2019s profile and Rx signals, then generates a tailored call plan — objective, opener, talking points, objection handling, and next best action — grounded only in approved messaging. This is the working prototype behind the Decision-Engine and Next Best Action capabilities I lead at Novartis.',
      tags: ['AI Product', 'Field Orchestration', 'Novartis'],
      poster: '',
      // demo: a self-contained HTML build. It runs live inside the lightbox,
      // so the card reads "Open demo" instead of "Play".
      demo: 'assets/demos/call-plan-agent.html',
      video: '',
      embed: '',
      links: [
        { label: 'Open full screen', href: 'assets/demos/call-plan-agent.html' },
        { label: 'View build conversation', href: 'https://claude.ai/chat/45a377dd-8723-4397-ba2d-dbaf117e8ec5' },
      ],
    },
    {
      title: 'NBA Decision Engine',
      kind: 'AI product demo',
      year: '2026',
      duration: 'Live demo',
      blurb:
        'The full Next Best Action pipeline, end to end: ingest 15 Rx, specialty-pharmacy, EMR, congress and CRM sources; run the Rx, Rep Affinity and Propensity models in parallel; blend them into one composite score; clear every recommendation through an MLR/legal gate; then push the approved actions into Veeva as rep tasks. This is the decision-engine architecture behind the Field Orchestration capability I own at Novartis.',
      tags: ['Decision Engine', 'NBA', 'MLR Governance', 'Veeva CRM'],
      poster: '',
      demo: 'assets/demos/nba-decision-engine.html',
      video: '',
      embed: '',
      links: [
        { label: 'Open full screen', href: 'assets/demos/nba-decision-engine.html' },
        { label: 'View build conversation', href: 'https://claude.ai/chat/45a377dd-8723-4397-ba2d-dbaf117e8ec5' },
      ],
    },
    {
      title: 'Medical Inquiry Agent',
      kind: 'Recorded walkthrough',
      year: '2026',
      duration: '2:31',
      // TODO: replace this blurb with your own description of the demo.
      blurb:
        'A recorded walkthrough of an AI agent for handling inbound medical information requests — routing each inquiry, grounding the answer in approved medical content, and keeping the response inside the boundary between medical and commercial.',
      tags: ['Medical Affairs', 'GenAI', 'Compliance'],
      poster: '',
      video: 'assets/video/medical-inquiry-agent.mp4',
      embed: '',
      links: [],
    },
    {
      title: 'Healthcare AI Agent',
      kind: 'Recorded walkthrough',
      year: '2026',
      duration: '2:34',
      // TODO: replace this blurb with your own description of the demo.
      blurb:
        'A recorded walkthrough of an AI agent built for a healthcare workflow — showing how the agent takes in context, reasons over it, and returns an action a real user can act on.',
      tags: ['Healthcare AI', 'Agents', 'GenAI'],
      poster: '',
      video: 'assets/video/healthcare-ai-agent.mp4',
      embed: '',
      links: [],
    },
    {
      // Title, year and runtime read from the YouTube record. Blurb is mine —
      // swap in your own framing of what you owned on this product.
      title: 'Introducing D&B Connect for Salesforce',
      kind: 'Product video',
      year: '2022',
      duration: '2:25',
      blurb:
        'The CDP work I led as product manager at Dun & Bradstreet — connecting commercial data into Salesforce so sales and marketing teams work from one clean, enriched customer record.',
      tags: ['CDP', 'Salesforce', 'Product Management', 'Dun & Bradstreet'],
      // YouTube has no maxres/hq720 still for this video, and hqdefault is 4:3
      // with black bars baked in — so this is that frame cropped back to 16:9.
      poster: 'assets/img/dnb-connect-salesforce.jpg',
      // Opens on YouTube rather than embedding, matching the other D&B card.
      external: 'https://youtu.be/l0jkYBSWz9o',
      embed: '',
      video: '',
      links: [],
    },
    {
      // Playback on other websites is disabled by the video owner, so this
      // one CANNOT be embedded (YouTube returns "Error 153"). The card opens
      // YouTube in a new tab instead; the thumbnail still comes from the id.
      title: 'D&B Connect Demo',
      kind: 'Product demo',
      year: '2021',
      duration: '11:16',
      blurb:
        'The full walkthrough of D&B Connect — data onboarding, match and enrichment, and the governed customer record that sales and marketing teams build segments from.',
      tags: ['CDP', 'Data Quality', 'Product Management', 'Dun & Bradstreet'],
      poster: '',
      external: 'https://youtu.be/HnSEv4TjvvI',
      embed: '',
      video: '',
      links: [],
    },
    {
      title: 'US Patent — ML Classifier for Identifying ISPs',
      kind: 'Patent · In force',
      year: '2020',
      duration: 'US 2020/219862',
      blurb:
        'Named inventor on an in-force US patent assigned to Dun & Bradstreet: a method for identifying and classifying visitor information from website tracking to separate Internet Service Provider traffic from genuine business visitors. The classifier is trained on firmographically-enriched visitor intelligence — the work behind the probabilistic identity and audience-targeting platform I led there.',
      tags: ['Patent', 'Machine Learning', 'Dun & Bradstreet'],
      // The record image doubles as the card thumbnail and the lightbox view.
      poster: 'assets/img/patent-ml-classifier.png',
      image: 'assets/img/patent-ml-classifier.png',
      video: '',
      embed: '',
      links: [
        { label: 'Read the patent', href: 'https://patents.justia.com/patent/20200342337#claims' },
      ],
    },
  ],

  /* ---------------------------------------------------------------------
   *  6. EXPERIENCE  — the timeline
   * -------------------------------------------------------------------*/
  experience: [
    {
      company: 'Novartis',
      role: 'Associate Director, Product Management — AI & Platform Products',
      period: 'Aug 2025 — Present',
      location: 'USA',
      points: [
        'Lead enterprise AI transformation strategy, roadmap, and strategic priorities, aligning AI investments with business objectives and long-term transformation goals.',
        'Own AI-powered Next Best Action, Customer Targeting, Call Planning, and Decision-Engine (Field Orchestration) capabilities within Field Insights & Analytics (FIA) to enable data-driven, intelligent customer engagement.',
        'Lead enterprise technology evaluations, architecture, and strategic engagements with Snowflake, Palantir, Databricks, and AWS to shape scalable enterprise AI platforms.',
        'Partner and lead geographically distributed teams across the U.S. (Legal, Governance, Compliance, DDIT, P&O, AI SMEs) and Hyderabad, mentoring AI Product Managers and building organizational AI product capabilities.',
        'Drive AI open-source rapid prototyping, experimentation, and emerging-technology evaluation to validate new capabilities and inform enterprise AI platform strategy.',
        'Serve as a key strategic partner defining, executing, and rolling out the long-term strategy for HCP and patient-facing APIs in collaboration with cross-functional teams.',
        'Define the vision, roadmap, and data strategy for products and applications, partnering across teams to solve user and business needs.',
        'Led rollout of Veeva CRM decision-engine features, translating NBA and dynamic targeting logic into scalable product capability that improved data-driven HCP engagement.',
      ],
      tags: ['AI Strategy', 'Decision Engines', 'Veeva CRM', 'Platform Architecture', 'API Strategy', 'Innovation'],
    },
    {
      company: 'Amazon',
      role: 'AD, Business Intelligence — Healthcare, Ads (GenAI, Data Science)',
      period: 'Aug 2022 — Aug 2025',
      location: 'New York',
      points: [
        'Defined KPIs, customer use cases, and full user-flow impact across Amazon platforms via PRDs.',
        'SME for the audience-targeting product; drove roadmap execution with business, tech, and design teams.',
        'Built predictive models for feature recommendations, reducing risk exposure by 3%.',
        'Led AI/ML-driven process automation, lifting efficiency and accuracy 4% across the line of business.',
        'Delivered ETL pipelines and real-time reporting using AWS Bedrock, Claude, SageMaker, and AgentCore.',
      ],
      tags: ['GenAI', 'AWS Bedrock', 'ETL', 'Predictive Modeling'],
    },
    {
      company: 'Amazon',
      role: 'Business Intelligence Manager — Advertising',
      period: 'Aug 2020 — Aug 2022',
      location: 'New York',
      points: [
        'Led cross-org teams to build product performance data, A/B testing, and tracking metrics for data-driven prioritization.',
        'Partnered with Engineering, Product, and Data Science on GTM strategy and hypothesis-testing experiments.',
        'Leveraged retail shopping data across Amazon Advertising to drive adoption of new services.',
      ],
      tags: ['A/B Testing', 'GTM Strategy', 'Advertising'],
    },
    {
      company: 'Dun & Bradstreet',
      role: 'Digital Product Manager — AI, Product, Data Science',
      period: 'Jan 2017 — Aug 2020',
      location: 'New York',
      points: [
        'Managed partners to optimize data onboarding onto top AI programmatic environments, driving $5M+ in revenue.',
        'Defined strategy and led a global team building proprietary probabilistic algorithms, growing cross-device audience reach 50%.',
        'Led CDP build-out and drove project delivery via SDLC, JIRA, and Agile/Scrum.',
        'Aggregated and transformed Salesforce data into CDP-ready customer intelligence for segmentation and activation.',
      ],
      tags: ['CDP', 'Programmatic', 'Probabilistic ID', 'Agile'],
    },
    {
      company: 'GroupM · MediaCom',
      role: 'Senior Data Scientist — AI/ML Media for Bayer, Pfizer',
      period: 'Apr 2016 — Aug 2017',
      location: 'New York',
      points: [
        'Led cross-org teams building a machine-learning system for automated, personalized analysis.',
        'Built Market Mix Models for B2B2C, quantifying short- and long-term marketing, pricing, and competitive impact on ROI.',
      ],
      tags: ['Market Mix Models', 'Pharma', 'ML'],
    },
  ],

  /* ---------------------------------------------------------------------
   *  7. SKILLS  — grouped. Add or remove groups freely.
   * -------------------------------------------------------------------*/
  skills: [
    { group: 'Product & Strategy', items: ['AI Product Strategy', 'Roadmapping', 'PRDs', 'GTM Strategy', 'Agile/Scrum'] },
    { group: 'AI & Data Platforms', items: ['AWS Bedrock', 'SageMaker', 'AgentCore', 'Snowflake', 'Databricks', 'Palantir'] },
    { group: 'Data & Analytics', items: ['Predictive Modeling', 'ETL Pipelines', 'Tableau', 'CDP', 'Probabilistic Identity'] },
    { group: 'Leadership', items: ['Cross-functional Leadership', 'Distributed Teams', 'Mentoring', 'Stakeholder Management'] },
  ],

  /* ---------------------------------------------------------------------
   *  8. EDUCATION & RECOGNITION
   * -------------------------------------------------------------------*/
  education: [
    {
      title: 'M.S., Information Systems & Business Intelligence & Analytics',
      org: 'Stevens Institute of Technology, Hoboken NJ',
      period: '',
      note: '',
    },
    {
      title: 'MBA, Finance & Marketing',
      org: 'BIMM Pune, India',
      period: '',
      note: '',
    },
  ],

  /* ---------------------------------------------------------------------
   *  8b. CERTIFICATIONS  — its own section. Set to [] to hide it entirely.
   * -------------------------------------------------------------------*/
  certifications: [
    {
      title: 'AWS Solutions Architect',
      org: 'Amazon Web Services (AWS)',
      period: 'Mar 2020',
      note: 'Credential ID AWS01317867',
    },
    {
      title: 'Business Intelligence and Analytics',
      org: 'Stevens Institute of Technology',
      period: 'May 2016',
      note: 'Skills: Machine Learning',
    },
    {
      title: 'Claude Code in Action',
      org: 'Anthropic',
      period: 'Ongoing',
      note: '',
      link: 'https://anthropic.skilljar.com/claude-code-in-action',
    },
  ],

  /* ---------------------------------------------------------------------
   *  9. PASSPHRASE GATE
   *
   *  A speed bump for casual visitors — NOT security. This is a static site,
   *  so the check runs in the browser and every file under assets/ (the CV
   *  PDF included) stays reachable by direct URL either way. Anyone who opens
   *  devtools is past it in seconds. Don't rely on it for anything private.
   *
   *  Current passphrase: hello
   *
   *  To set a new one, run this in Terminal and paste the result into hash:
   *
   *    node -e "console.log(require('crypto').createHash('sha256')
   *      .update('lc-cv:' + 'YOUR-NEW-PASSPHRASE').digest('hex'))"
   *
   *  Set enabled: false to open the site to everyone.
   * -------------------------------------------------------------------*/
  gate: {
    enabled: true,
    salt: 'lc-cv:',
    hash: 'f838cd25ee7340c29a9aef530e772897e741742a97d57473a3cb8041a1fc107a',
    note: 'This CV is shared by invitation. Enter the passphrase to continue.',
  },

  /* ---------------------------------------------------------------------
   *  10. SITE META
   * -------------------------------------------------------------------*/
  meta: {
    siteUrl: 'https://lavinac.github.io/cv/', // update once you've created the repo — see README
    ogImage: 'assets/img/og.png',
    accent: '#2f6f74', // teal — ties to the AI/decision-engine work
  },
};
