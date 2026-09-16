export interface MapleItem {
  id: string;
  name: string;
  type: 'Equip' | 'Use' | 'Etc' | 'Setup';
  icon: string; // identifier for rendering
  color: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  reqLevel: number;
  reqJob: string;
  categoryName: string;
  stats: Record<string, string>;
  description: string;
  realWorldImpact: string;
  flavorText: string;
  count?: number;
}

export const MAPLE_DROPPABLE_ITEMS: MapleItem[] = [
  {
    id: 'credit-risk-scroll',
    name: 'Scroll for Credit Risk Mastery (10%)',
    type: 'Use',
    icon: 'scroll-gold',
    color: '#f59e0b',
    rarity: 'Legendary',
    reqLevel: 99,
    reqJob: 'Senior Software Engineer (RBC)',
    categoryName: 'Ancient Financial Scroll',
    stats: {
      'Client Companies Monitored': '30,000+',
      'Credit Officers Enabled': '400+',
      'Data Ingestion Feeds': '8+ Sources',
      'Quarterly Review Time': '1 Month ➔ 1 Week',
      'Annual Vendor Savings': '$40,000 USD',
    },
    description:
      'An enchanted financial scroll forged in RBC Enterprise Credit Risk. Aggregates live feeds from Moody\'s, S&P, Fitch, Credit Benchmark, and Intrinio to trigger real-time risk alerts for 30,000+ companies.',
    realWorldImpact:
      'Engineered with React, TypeScript, Node.js, and Express, cutting credit review cycles from 1 month to 1 week for 400+ officers.',
    flavorText: 'Legends say success rate is 10%, but Hung landed this deployment with 100% production uptime.',
  },
  {
    id: 'spring-boot-helm',
    name: 'Enchanted Cap of Spring Boot Microservices',
    type: 'Equip',
    icon: 'cap-emerald',
    color: '#10b981',
    rarity: 'Epic',
    reqLevel: 70,
    reqJob: 'Software Engineer (RBC)',
    categoryName: 'Backend Armor (Head)',
    stats: {
      'Automated Test Coverage': '0% ➔ 80%',
      'Defects Defended': '20+ Production Bugs Purged',
      'Testing Stack': 'JUnit 5 & Mockito',
      'Architecture': 'Distributed Java Microservices',
    },
    description:
      'Hardened headwear tuned to withstand heavy batch transactions. Built automated unit and integration testing frameworks that raised test coverage from zero to 80%.',
    realWorldImpact:
      'Developed and maintained distributed Java Spring Boot microservices powering credit rating generation, batch calculations, and client risk assessments.',
    flavorText: 'Imbued with continuous integration blessings. Never lets a null pointer slip past.',
  },
  {
    id: 'oracle-relic-tome',
    name: 'Ancient Tome of Database Migration',
    type: 'Etc',
    icon: 'book-blue',
    color: '#3b82f6',
    rarity: 'Epic',
    reqLevel: 75,
    reqJob: 'Software Engineer (RBC)',
    categoryName: 'Sacred Relic',
    stats: {
      'End-to-End Processing Latency': '-20% Speed Boost',
      'Database Engine': 'MySQL ➔ Oracle',
      'Data Integrity': '100% Zero Data Loss',
      'Query Optimization': 'Execution Plan Tuning',
    },
    description:
      'A sacred grimoire chronicling the heroic migration of enterprise financial schemas from MySQL to Oracle with zero production downtime.',
    realWorldImpact:
      'Redesigned relational schemas, optimized complex query plans, and shaved 20% off end-to-end user flow processing times.',
    flavorText: 'Turning slow table locks into blazing sub-second indexed lookups.',
  },
  {
    id: 'shelter-movers-medal',
    name: 'Volunteer Medal of Shelter Movers',
    type: 'Equip',
    icon: 'medal-maple',
    color: '#ea580c',
    rarity: 'Legendary',
    reqLevel: 50,
    reqJob: 'Full-Stack Lead Engineer',
    categoryName: 'Community Honor Medal',
    stats: {
      'Volunteers Coordinated': '1,000+ Active',
      'Canadian Chapters': '10 Nationwide',
      'Core Stack': 'TypeScript, React, Firestore, Redis',
      'Team Led': '5 Engineers',
    },
    description:
      'Awarded for architecting and shipping the volunteer operations platform for Shelter Movers across 10 chapters in Canada.',
    realWorldImpact:
      'Coordinated architecture across TypeScript, React, Firestore, and Redis to support logistics, volunteer scheduling, and safe moves.',
    flavorText: 'Empowering communities and helping families find safe beginnings.',
  },
  {
    id: 'aibattle-orb',
    name: 'Neural Core of AiBattle.ai',
    type: 'Etc',
    icon: 'orb-purple',
    color: '#8b5cf6',
    rarity: 'Epic',
    reqLevel: 80,
    reqJob: 'AI Systems Engineer',
    categoryName: 'Enchanted Model Matrix',
    stats: {
      'Supported Models': 'OpenAI, Gemini, Claude, Grok',
      'Mode': 'Head-to-Head Arena & Voting',
      'Stack': 'Next.js, TypeScript, Supabase',
    },
    description:
      'A pulsating neural orb that orchestrates live competitive AI prompt battles across leading frontier LLMs.',
    realWorldImpact:
      'Built a live competitive AI content platform with head-to-head voting competitions and a community-sourced content gallery.',
    flavorText: 'Which model answers supreme? Cast your vote in the arena.',
  },
  {
    id: 'crypto-bot-chip',
    name: 'Algorithmic Trading Bot Core',
    type: 'Use',
    icon: 'chip-cyan',
    color: '#06b6d4',
    rarity: 'Rare',
    reqLevel: 85,
    reqJob: 'Systems & Quant Developer',
    categoryName: 'Automated Microchip',
    stats: {
      'Execution Cloud': 'AWS EC2',
      'Intelligence': 'Generative AI Market Predictor',
      'Stack': 'Python, React, Node.js, MongoDB',
    },
    description:
      'Automated trading algorithm relic deployed on AWS EC2 that streams real-time market orderbooks and applies AI-assisted predictive chart patterns.',
    realWorldImpact:
      'Built cryptocurrency trading tools and automated bots handling live WebSocket feeds and order execution.',
    flavorText: 'Runs 24/7/365 without needing a single coffee break.',
  },
  {
    id: 'github-actions-potion',
    name: 'Elixir of 90% Vulnerability Reduction',
    type: 'Use',
    icon: 'potion-red',
    color: '#ef4444',
    rarity: 'Rare',
    reqLevel: 60,
    reqJob: 'DevOps & Security Vanguard',
    categoryName: 'Restorative Security Elixir',
    stats: {
      'Vulnerability Reduction': '90% Purged',
      'Microservices Standardized': '15+ Repositories',
      'Security Suite': 'SonarQube, Snyk, SCA',
      'Pipeline Engine': 'GitHub Actions',
    },
    description:
      'A shimmering ruby potion that purges 90% of security flaws from CI/CD pipelines across enterprise banking microservices.',
    realWorldImpact:
      'Standardized pipelines from Jenkins to GitHub Actions, implementing automated code quality and dependency scanning gates.',
    flavorText: 'Tastes like sweet strawberries and pristine green build checkmarks.',
  },
  {
    id: 'uoft-diploma',
    name: 'University of Toronto B.S. Diploma',
    type: 'Setup',
    icon: 'diploma-blue',
    color: '#1e3a8a',
    rarity: 'Legendary',
    reqLevel: 1,
    reqJob: 'Novice to Architect (Origin)',
    categoryName: 'Academic Foundation',
    stats: {
      'Degree': 'B.S. in Computer Science',
      'Alumni': 'University of Toronto (2016-2021)',
      'Key Disciplines': 'Algorithms, Systems, AI, Web',
    },
    description:
      'The foundational parchment that initiated the adventure. Mastered Distributed Systems, Operating Systems, Algorithm Complexity, and Machine Learning.',
    realWorldImpact:
      'Built a rigorous mathematical and algorithmic foundation that drives high-throughput engineering decisions at RBC.',
    flavorText: 'The place where every adventurer starts before setting sail for Victoria Island.',
  },
];
