export interface Project {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  longDescription: string;
  category: 'fullstack' | 'cloud' | 'devtools' | 'all';
  featured: boolean;
  tags: string[];
  metrics: { label: string; value: string }[];
  githubUrl: string;
  liveDemoUrl?: string;
  questRank: string; // e.g. 'Rank S Bounty'
  expReward: string;
  architectureHighlights: string[];
  keyFeatures: string[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  type: string;
  questName: string;
  questRank: string;
  questStatus: 'Active' | 'Completed';
  expEarned: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface SkillCategory {
  title: string;
  iconName: string;
  flavor: string;
  skills: { name: string; level: number; highlighted?: boolean; tag?: string }[];
}

export const PERSONAL_INFO = {
  name: 'Hung Nguyen',
  role: 'Senior Software Engineer',
  company: 'RBC (Royal Bank of Canada)',
  tagline: 'Senior Software Engineer crafting resilient distributed systems, credit risk engines, and modern full-stack platforms.',
  location: 'Toronto, Canada',
  realm: 'Toronto Realm (Scania)',
  email: 'nguyendev98@gmail.com',
  phone: '+1(437) 435-6927',
  linkedin: 'https://linkedin.com/in/nguyensdev',
  github: 'https://github.com/nguyensdev',
  character: {
    title: '4th Job Master • Platform Architect',
    level: 99,
    exp: '99.9%',
    guild: 'RBC Credit Risk Core',
    jobClass: 'Senior Software Engineer',
    fame: 1337,
    mesos: '$40,000 saved/yr',
  },
  stats: {
    hp: '30,000+', // Clients monitored
    hpLabel: 'Clients Monitored',
    mp: '400+', // Credit officers
    mpLabel: 'Credit Officers Supported',
    str: 'Java / Oracle',
    strLabel: 'Heavy Enterprise Core',
    dex: 'React / Node.js',
    dexLabel: 'Agile Full-Stack Velocity',
    int: 'Risk Engines',
    intLabel: 'Distributed System Architecture',
    luk: 'Generative AI',
    lukLabel: 'LLMs & Algorithmic Automation'
  },
  bio: [
    "Hello traveler! I'm Hung Nguyen, a Senior Software Engineer based in Toronto, Canada. Currently, I lead and architect critical credit risk monitoring platforms and distributed services at RBC.",
    "With a Bachelor of Science in Computer Science from the University of Toronto, I specialize in building high-throughput financial data pipelines, migrating mission-critical databases, and creating delightful web applications using TypeScript, React, Java Spring Boot, Node.js, and cloud ecosystems.",
    "When I'm not optimizing sub-millisecond database queries or hard-gating CI/CD security pipelines, I love exploring emerging AI models, tinkering with crypto algorithmic bots, and enjoying relaxing fantasy game soundscapes."
  ],
  education: {
    degree: 'Bachelor of Science, Computer Science',
    school: 'University of Toronto',
    period: '2016 – 2021',
    location: 'Toronto, Canada',
    details: 'Relevant coursework: Data Structure and Algorithms, Engineering Large Software Systems, Artificial Intelligence, Web Development.'
  },
  impactHighlights: [
    { label: 'Client Monitoring Scale', value: '30,000+', desc: 'Daily risk event generation across 8+ financial sources' },
    { label: 'Decision Cycle Cut', value: '1mo ➔ 1wk', desc: 'Rule-based approval workflows & benchmark analytics' },
    { label: 'Annual Vendor Cost Cut', value: '$40,000', desc: 'Cross-functional financial provider consolidation' },
    { label: 'Security Vulnerability Cut', value: '90%', desc: 'SonarQube & Snyk quality gates across 15+ services' }
  ]
};

export const PROJECTS: Project[] = [
  {
    id: 'shelter-movers',
    title: 'Shelter Movers',
    subtitle: 'Volunteer Management & Safe Move Coordination Platform',
    tagline: 'Coordinating 1,000+ volunteers across 10 Canadian chapters with real-time dispatch',
    description: 'Built and deployed a production volunteer management platform with a team of 5 engineers, coordinating 1,000+ volunteers across 10 Canadian chapters from initial build to production MVP.',
    longDescription: 'Shelter Movers provides moving and storage services at no cost to women and children fleeing abuse. This application was architected from zero to a production MVP to solve real-world scheduling, chapter dispatch, volunteer background verification, and rapid route coordination across 10 metropolitan chapters in Canada.',
    category: 'fullstack',
    featured: true,
    questRank: 'Rank S Community Bounty',
    expReward: '+150,000 EXP',
    tags: ['TypeScript', 'React', 'Firestore', 'Redis', 'Node.js', 'Tailwind CSS'],
    metrics: [
      { label: 'Volunteers Coordinated', value: '1,000+' },
      { label: 'Active Chapters', value: '10 Across Canada' },
      { label: 'Team Size', value: '5 Engineers' }
    ],
    githubUrl: 'https://github.com/nguyensdev/shelter-movers-platform',
    liveDemoUrl: 'https://sheltermovers.com',
    architectureHighlights: [
      'Real-time volunteer state synchronization backed by Google Cloud Firestore and Redis pub/sub',
      'Role-based security access rules ensuring strict confidentiality of move locations and personal privacy',
      'Automated volunteer shift notification pipelines and availability matching algorithms'
    ],
    keyFeatures: [
      'Multi-chapter administrative dashboard with real-time shift status',
      'Mobile-responsive intake and dispatch workflows for field volunteers',
      'Instant SMS and email alert integration for critical emergency schedule changes',
      'Comprehensive reporting export engine for nonprofit grants and board metrics'
    ]
  },
  {
    id: 'aibattle',
    title: 'AiBattle.ai',
    subtitle: 'Live Competitive Multi-LLM Content Arena & Blind Voting Platform',
    tagline: 'Head-to-head model battles featuring OpenAI, Gemini, Claude, and Grok',
    description: 'Built a live competitive AI content platform supporting multiple LLM providers (OpenAI, Gemini, Claude, Grok), with head-to-head voting competitions and a community-sourced content gallery.',
    longDescription: 'AiBattle.ai pits leading frontier generative language models against each other in real-time blind prompt duels. Users submit custom creative prompts or coding tasks, and models generate completions anonymously. The community votes blindly to produce dynamic, crowdsourced ELO leaderboards and showcases best-in-class responses.',
    category: 'fullstack',
    featured: true,
    questRank: 'Rank S Arena Expedition',
    expReward: '+180,000 EXP',
    tags: ['Next.js', 'TypeScript', 'Supabase', 'OpenAI API', 'Gemini API', 'Claude API', 'Tailwind CSS'],
    metrics: [
      { label: 'Supported Providers', value: 'OpenAI, Gemini, Claude, Grok' },
      { label: 'Voting Engine', value: 'Blind A/B ELO System' },
      { label: 'Database', value: 'Supabase PostgreSQL' }
    ],
    githubUrl: 'https://github.com/nguyensdev/aibattle-arena',
    liveDemoUrl: 'https://aibattle.ai',
    architectureHighlights: [
      'Parallel streaming response orchestrator handling concurrent generation across 4 distinct AI API providers',
      'Anti-bias blind randomization protocol preventing voters from knowing provider identities until voting',
      'Supabase Row-Level Security (RLS) and cached ELO ranking calculations with sub-50ms query responses'
    ],
    keyFeatures: [
      'Interactive side-by-side prompt execution with real-time markdown and syntax highlighting',
      'Community content gallery with trending upvotes, category filters, and prompt sharing',
      'Dynamic LLM Leaderboard updating after every verified community vote duel',
      'Configurable temperature and system prompt customizer for deep prompt engineering tests'
    ]
  },
  {
    id: 'crypto-bots',
    title: 'Crypto Trading Bots & Prediction Tools',
    subtitle: 'Automated Market Execution & Generative AI Chart Analysis System',
    tagline: 'Algorithmic trading engines integrating live market feeds and AI predictive sentiment',
    description: 'Developed cryptocurrency trading tools integrating generative AI APIs for market prediction and chart analysis; deployed automated trading bots that handle live market data and execution.',
    longDescription: 'A modular algorithmic trading and financial telemetry suite designed to ingest high-frequency crypto market feeds, calculate technical momentum indicators (RSI, MACD, Bollinger Bands), and synthesize generative AI market sentiment to automate disciplined trade execution on AWS EC2 instances.',
    category: 'cloud',
    featured: true,
    questRank: 'Rank A Market Alchemy',
    expReward: '+120,000 EXP',
    tags: ['React', 'Node.js', 'Python', 'MongoDB', 'AWS EC2', 'WebSockets', 'Chart.js'],
    metrics: [
      { label: 'Runtime Infrastructure', value: 'AWS EC2 24/7' },
      { label: 'Data Ingestion', value: 'Live WebSockets' },
      { label: 'AI Synthesis', value: 'Market Sentiment + Technicals' }
    ],
    githubUrl: 'https://github.com/nguyensdev/crypto-algo-trading-engine',
    architectureHighlights: [
      'Resilient WebSocket pipeline consuming live tick-by-tick order books with automated reconnect exponential backoff',
      'Containerized Python algorithmic engine executing risk-adjusted trade orders with stop-loss and trailing take-profit',
      'Generative AI context builder translating raw multi-timeframe price action into concise summary insights'
    ],
    keyFeatures: [
      'Real-time React dashboard with live candlestick charting and indicator overlays',
      'Automated execution engine with paper trading simulation and live exchange connectors',
      'Granular backtesting runner evaluating strategies across historical market regimes',
      'Telegram and Discord alert webhooks triggering on critical volatility events'
    ]
  }
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'rbc-senior',
    role: 'Senior Software Engineer',
    company: 'RBC (Royal Bank of Canada)',
    period: '01/2024 – Present',
    location: 'Toronto, Canada',
    type: 'Full-time',
    questName: 'Raid: Credit Risk Monitoring Citadel',
    questRank: 'Lv. 99 Master Quest',
    questStatus: 'Active',
    expEarned: 'Current Raid In-Progress',
    description: 'Spearheading the end-to-end architecture and development of RBC’s enterprise credit risk monitoring platform, scaling financial data pipelines for over 30,000 client companies and 400+ credit officers.',
    achievements: [
      'Led end-to-end development of a credit risk monitoring platform using React, TypeScript, Node.js, and Express, aggregating data from 8+ financial sources to generate daily risk events for 30,000+ client companies.',
      'Designed and optimized backend services and data ingestion workflows for multi-source financial data, enabling scalable risk analysis and improving decision-making efficiency for 400+ credit officers.',
      'Developed credit rating approval workflows with rule-based validations, external benchmark comparisons, and industry financial benchmarking, reducing quarterly review cycles from 1 month to 1 week.',
      'Integrated third-party financial data providers (Moody’s, S&P, Fitch, Credit Benchmark, Intrinio) and consolidated redundant vendors through cross-functional collaboration, reducing annual costs by $40,000.',
      'Standardized and migrated CI/CD pipelines from Jenkins to GitHub Actions across 15+ applications/microservices, integrating SonarQube, Snyk, and SCA tools to enforce code quality gates and reduce security vulnerabilities by 90%.'
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'GitHub Actions', 'SonarQube', 'Snyk', 'Financial APIs', 'Jenkins', 'Agile']
  },
  {
    id: 'rbc-se',
    role: 'Software Engineer',
    company: 'RBC (Royal Bank of Canada)',
    period: '05/2021 – 01/2024',
    location: 'Toronto, Canada',
    type: 'Full-time',
    questName: 'Quest: Distributed Spring Boot Microservices & Database Migration',
    questRank: 'Lv. 75 Epic Quest',
    questStatus: 'Completed',
    expEarned: '+350,000 EXP',
    description: 'Engineered high-throughput Java Spring Boot microservices powering credit risk calculations, executing a seamless production database migration from MySQL to Oracle.',
    achievements: [
      'Developed and maintained distributed Java Spring Boot microservices powering a credit risk platform, handling client data updates, credit rating generation and assessments, and batch processing of large-scale financial data.',
      'Migrated production database from MySQL to Oracle, redesigning schemas and optimizing queries to cut end-to-end user flow processing time by 20%, while ensuring data integrity and minimal service disruption.',
      'Built automated testing frameworks using JUnit and Mockito, increasing code coverage from 0% to 80% and improving production reliability.'
    ],
    technologies: ['Java', 'Spring Boot', 'Oracle Database', 'MySQL', 'JUnit', 'Mockito', 'REST APIs', 'Microservices', 'Git']
  },
  {
    id: 'rbc-coop',
    role: 'Software Engineer Co-op',
    company: 'RBC (Royal Bank of Canada)',
    period: '09/2020 – 01/2021',
    location: 'Toronto, Canada',
    type: 'Internship / Co-op',
    questName: 'Trial: RBC Amplify Tax-Loss Harvesting & Production Bug Slayer',
    questRank: 'Lv. 40 Adventurer Trial',
    questStatus: 'Completed',
    expEarned: '+120,000 EXP',
    description: 'Engineered tax optimization algorithms for the competitive RBC Amplify innovation program and eradicated critical production defects across distributed banking microservices.',
    achievements: [
      'Developed a Python Flask web application for the RBC Amplify program to calculate tax savings and recommend optimal stocks for tax-loss harvesting.',
      'Diagnosed and resolved 20+ production defects across 5 Java microservices: API failures, data-processing errors, and business-logic bugs.'
    ],
    technologies: ['Python', 'Flask', 'Java', 'REST APIs', 'Microservices', 'Algorithms', 'Debugging']
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Languages & Core Spells',
    iconName: 'Wand2',
    flavor: 'Primary spellbook for constructing distributed logic and type-safe systems',
    skills: [
      { name: 'Java', level: 95, highlighted: true, tag: 'Production Core' },
      { name: 'TypeScript', level: 96, highlighted: true, tag: 'Daily Primary' },
      { name: 'JavaScript (ES6+)', level: 95, highlighted: true },
      { name: 'Python', level: 90, highlighted: true, tag: 'AI & Scripting' },
      { name: 'SQL', level: 92, highlighted: true, tag: 'Complex Querying' },
      { name: 'Bash / Shell', level: 88 }
    ]
  },
  {
    title: 'Frameworks & Enchanted Armor',
    iconName: 'Shield',
    flavor: 'Battle-tested web architectures, microservices, and testing suites',
    skills: [
      { name: 'Spring Boot', level: 94, highlighted: true, tag: 'Enterprise Microservices' },
      { name: 'React', level: 96, highlighted: true, tag: 'Modern UI' },
      { name: 'Next.js', level: 92, highlighted: true },
      { name: 'Node.js & Express', level: 95, highlighted: true, tag: 'API Gateway' },
      { name: 'REST APIs', level: 98, highlighted: true },
      { name: 'Flask', level: 86 },
      { name: 'JUnit & Mockito', level: 92, highlighted: true, tag: '80% Test Coverage' }
    ]
  },
  {
    title: 'Databases & Ancient Tomes',
    iconName: 'Database',
    flavor: 'High-availability relational schemas, key-value caches, and cloud datastores',
    skills: [
      { name: 'Oracle Database', level: 94, highlighted: true, tag: 'Production Migration' },
      { name: 'MySQL', level: 92, highlighted: true },
      { name: 'MongoDB', level: 88 },
      { name: 'Redis', level: 90, highlighted: true, tag: 'Caching & Queues' },
      { name: 'Firestore (NoSQL)', level: 89 }
    ]
  },
  {
    title: 'DevOps, Cloud & Travel Portals',
    iconName: 'Cloud',
    flavor: 'Automated CI/CD security pipelines, containers, and resilient cloud orchestration',
    skills: [
      { name: 'Docker', level: 92, highlighted: true },
      { name: 'Kubernetes', level: 85 },
      { name: 'GitHub Actions', level: 95, highlighted: true, tag: 'Standardized 15+ Pipelines' },
      { name: 'AWS (EC2, DynamoDB, S3)', level: 90, highlighted: true },
      { name: 'Azure', level: 84 },
      { name: 'SonarQube & Snyk', level: 94, highlighted: true, tag: 'Security Gatekeeping' },
      { name: 'Jenkins', level: 88 },
      { name: 'HashiCorp Vault', level: 85 },
      { name: 'Nexus IQ', level: 86 },
      { name: 'Postman & Jira', level: 92 },
      { name: 'Linux/Unix & CI/CD', level: 94, highlighted: true }
    ]
  }
];

// Backwards compatibility helper for existing references
export const SKILL_GROUPS = SKILL_CATEGORIES.map(c => ({
  category: c.title,
  description: c.flavor,
  skills: c.skills.map(s => ({
    name: s.name,
    level: s.level,
    category: c.title,
    highlighted: s.highlighted
  }))
}));
