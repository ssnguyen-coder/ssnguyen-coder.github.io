import React, { useEffect, useState } from 'react';
import { X, Printer, Copy, Check, ExternalLink } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const textResume = `
HUNG NGUYEN
nguyendev98@gmail.com | +1(437) 435-6927 | Toronto, Canada | linkedin.com/in/nguyensdev

EDUCATION
Bachelor of Science, Computer Science
University of Toronto | 2016 – 2021 | Toronto, Canada
Relevant courses: Data Structure and Algorithms; Engineering Large Software Systems; Artificial Intelligence; Web development

PROFESSIONAL EXPERIENCE
Senior Software Engineer | RBC | 01/2024 – present | Toronto, Canada
• Led end-to-end development of a credit risk monitoring platform using React, TypeScript, Node.js, and Express, aggregating data from 8+ financial sources to generate daily risk events for 30,000+ client companies.
• Designed and optimized backend services and data ingestion workflows for multi-source financial data, enabling scalable risk analysis and improving decision-making efficiency for 400+ credit officers.
• Developed credit rating approval workflows with rule-based validations, external benchmark comparisons, and industry financial benchmarking, reducing quarterly review cycles from 1 month to 1 week.
• Integrated third-party financial data providers (Moody’s, S&P, Fitch, Credit Benchmark, Intrinio) and consolidated redundant vendors through cross-functional collaboration, reducing annual costs by $40,000.
• Standardized and migrated CI/CD pipelines from Jenkins to GitHub Actions across 15+ applications/microservices, integrating SonarQube, Snyk, and SCA tools to enforce code quality gates and reduce security vulnerabilities by 90%.

Software Engineer | RBC | 05/2021 – 01/2024 | Toronto, Canada
• Developed and maintained distributed Java Spring Boot microservices powering a credit risk platform, handling client data updates, credit rating generation and assessments, and batch processing of large-scale financial data.
• Migrated production database from MySQL to Oracle, redesigning schemas and optimizing queries to cut end-to-end user flow processing time by 20%, while ensuring data integrity and minimal service disruption.
• Built automated testing frameworks using JUnit and Mockito, increasing code coverage from 0% to 80% and improving production reliability.

Software Engineer Co-op | RBC | 09/2020 – 01/2021 | Toronto, Canada
• Developed a Python Flask web application for the RBC Amplify program to calculate tax savings and recommend optimal stocks for tax-loss harvesting.
• Diagnosed and resolved 20+ production defects across 5 Java microservices: API failures, data-processing errors, and business-logic bugs.

PROJECTS
Shelter Movers | TypeScript, React, Firestore, Redis, Node.js
• Built and deployed a volunteer management platform (TypeScript, React, Firestore, Node.js) with a team of 5 engineers, coordinating 1,000+ volunteers across 10 Canadian chapters from initial build to production MVP.

AiBattle.ai | Next.js, TypeScript, Supabase
• Built a live competitive AI content platform supporting multiple LLM providers (OpenAI, Gemini, Claude, Grok), with head-to-head voting competitions and a community-sourced content gallery.

Crypto Trading Bots & Prediction Tools | React, Node.js, Python, MongoDB, AWS EC2
• Developed cryptocurrency trading tools integrating generative AI APIs for market prediction and chart analysis; deployed automated trading bots that handle live market data and execution.

SKILLS
Languages: Java, Python, JavaScript, TypeScript, SQL, Bash
Frameworks & Libraries: Spring Boot, React, Next.js, Node.js, Express, Flask, JUnit, Mockito, REST APIs
Databases: Oracle, MySQL, MongoDB, Redis, Firestore, NoSQL
DevOps & Tools: Docker, Kubernetes, Azure, AWS (EC2, DynamoDB, S3), Git, GitHub Actions, Jenkins, SonarQube, Snyk, Nexus IQ, HashiCorp Vault, Postman, Jira, Linux/Unix, CI/CD, Agile/Scrum
    `.trim();

    navigator.clipboard.writeText(textResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Action Bar (hidden when printing) */}
        <div className="p-4 sm:px-6 bg-[#faf7f2] border-b border-amber-900/10 flex items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
            <span>Hung Nguyen — Executive Engineering Resume</span>
            <span className="text-stone-400">•</span>
            <span className="text-amber-800 font-mono text-[11px]">Official PDF Printout</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 transition-colors shadow-2xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Plaintext'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg transition-colors ml-1 cursor-pointer"
              aria-label="Close resume"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Sheet (Faithful recreation of Hung Nguyen's Resume) */}
        <div className="p-8 sm:p-12 overflow-y-auto bg-white text-stone-900 font-sans space-y-6 print:p-0">
          {/* Header */}
          <div className="border-b-2 border-stone-800 pb-4 text-center space-y-1.5">
            <h1 className="text-3xl font-extrabold text-stone-950 tracking-tight font-serif">
              Hung Nguyen
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-stone-700 font-mono">
              <a href={`mailto:${PERSONAL_INFO.email}`} className="hover:underline">
                {PERSONAL_INFO.email}
              </a>
              <span>•</span>
              <span>{PERSONAL_INFO.phone}</span>
              <span>•</span>
              <span>{PERSONAL_INFO.location}</span>
              <span>•</span>
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-stone-800"
              >
                linkedin.com/in/nguyensdev
              </a>
            </div>
          </div>

          {/* EDUCATION */}
          <div className="space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-950 border-b border-stone-300 pb-0.5 font-mono">
              EDUCATION
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs sm:text-sm">
              <div className="font-bold text-stone-900">
                Bachelor of Science, Computer Science
              </div>
              <div className="text-xs font-mono text-stone-600">
                2016 – 2021 | Toronto, Canada
              </div>
            </div>
            <div className="text-xs text-stone-700 italic">
              University of Toronto
            </div>
            <div className="text-xs text-stone-600">
              <span className="font-semibold text-stone-800">Relevant courses: </span>
              Data Structure and Algorithms; Engineering Large Software Systems; Artificial Intelligence; Web development
            </div>
          </div>

          {/* PROFESSIONAL EXPERIENCE */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-950 border-b border-stone-300 pb-0.5 font-mono">
              PROFESSIONAL EXPERIENCE
            </h2>

            {/* Senior Software Engineer at RBC */}
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                <div className="font-bold text-stone-900">
                  Senior Software Engineer <span className="font-normal text-stone-600">| RBC</span>
                </div>
                <div className="text-xs font-mono text-stone-600">
                  01/2024 – present | Toronto, Canada
                </div>
              </div>
              <ul className="space-y-1 text-xs text-stone-700 list-disc list-inside leading-relaxed">
                <li>
                  Led end-to-end development of a <strong className="text-stone-900">credit risk monitoring platform</strong> using React, TypeScript, Node.js, and Express, aggregating data from 8+ financial sources to generate daily risk events for <strong className="text-stone-900">30,000+ client companies</strong>.
                </li>
                <li>
                  Designed and optimized backend services and data ingestion workflows for multi-source financial data, enabling scalable risk analysis and improving decision-making efficiency for <strong className="text-stone-900">400+ credit officers</strong>.
                </li>
                <li>
                  Developed credit rating approval workflows with rule-based validations, external benchmark comparisons, and industry financial benchmarking, reducing quarterly review cycles from <strong className="text-stone-900">1 month to 1 week</strong>.
                </li>
                <li>
                  Integrated third-party financial data providers (Moody’s, S&P, Fitch, Credit Benchmark, Intrinio) and consolidated redundant vendors through cross-functional collaboration, reducing annual costs by <strong className="text-stone-900">$40,000</strong>.
                </li>
                <li>
                  Standardized and migrated CI/CD pipelines from Jenkins to GitHub Actions across 15+ applications/microservices, integrating SonarQube, Snyk, and SCA tools to enforce code quality gates and reduce security vulnerabilities by <strong className="text-stone-900">90%</strong>.
                </li>
              </ul>
            </div>

            {/* Software Engineer at RBC */}
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                <div className="font-bold text-stone-900">
                  Software Engineer <span className="font-normal text-stone-600">| RBC</span>
                </div>
                <div className="text-xs font-mono text-stone-600">
                  05/2021 – 01/2024 | Toronto, Canada
                </div>
              </div>
              <ul className="space-y-1 text-xs text-stone-700 list-disc list-inside leading-relaxed">
                <li>
                  Developed and maintained distributed <strong className="text-stone-900">Java Spring Boot microservices</strong> powering a credit risk platform, handling client data updates, credit rating generation and assessments, and batch processing of large-scale financial data.
                </li>
                <li>
                  Migrated production database from MySQL to Oracle, redesigning schemas and optimizing queries to cut end-to-end user flow processing time by <strong className="text-stone-900">20%</strong>, while ensuring data integrity and minimal service disruption.
                </li>
                <li>
                  Built automated testing frameworks using JUnit and Mockito, increasing code coverage from <strong className="text-stone-900">0% to 80%</strong> and improving production reliability.
                </li>
              </ul>
            </div>

            {/* Software Engineer Co-op at RBC */}
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                <div className="font-bold text-stone-900">
                  Software Engineer Co-op <span className="font-normal text-stone-600">| RBC</span>
                </div>
                <div className="text-xs font-mono text-stone-600">
                  09/2020 – 01/2021 | Toronto, Canada
                </div>
              </div>
              <ul className="space-y-1 text-xs text-stone-700 list-disc list-inside leading-relaxed">
                <li>
                  Developed a Python Flask web application for the RBC Amplify program to calculate tax savings and recommend optimal stocks for tax-loss harvesting.
                </li>
                <li>
                  Diagnosed and resolved <strong className="text-stone-900">20+ production defects</strong> across 5 Java microservices: API failures, data-processing errors, and business-logic bugs.
                </li>
              </ul>
            </div>
          </div>

          {/* PROJECTS */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-950 border-b border-stone-300 pb-0.5 font-mono">
              PROJECTS
            </h2>

            <div className="space-y-1 text-xs sm:text-sm">
              <div className="font-bold text-stone-900">
                Shelter Movers <span className="font-normal text-stone-600 font-mono text-xs">| TypeScript, React, Firestore, Redis, Node.js</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                • Built and deployed a volunteer management platform (TypeScript, React, Firestore, Node.js) with a team of 5 engineers, coordinating 1,000+ volunteers across 10 Canadian chapters from initial build to production MVP.
              </p>
            </div>

            <div className="space-y-1 text-xs sm:text-sm">
              <div className="font-bold text-stone-900">
                AiBattle.ai <span className="font-normal text-stone-600 font-mono text-xs">| Next.js, TypeScript, Supabase</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                • Built a live competitive AI content platform supporting multiple LLM providers (OpenAI, Gemini, Claude, Grok), with head-to-head voting competitions and a community-sourced content gallery.
              </p>
            </div>

            <div className="space-y-1 text-xs sm:text-sm">
              <div className="font-bold text-stone-900">
                Crypto Trading Bots & Prediction Tools <span className="font-normal text-stone-600 font-mono text-xs">| React, Node.js, Python, MongoDB, AWS EC2</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                • Developed cryptocurrency trading tools integrating generative AI APIs for market prediction and chart analysis; deployed automated trading bots that handle live market data and execution.
              </p>
            </div>
          </div>

          {/* SKILLS */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-950 border-b border-stone-300 pb-0.5 font-mono">
              SKILLS
            </h2>
            <div className="text-xs space-y-1 text-stone-800 leading-relaxed">
              <div>
                <span className="font-bold">Languages: </span>
                Java, Python, JavaScript, TypeScript, SQL, Bash
              </div>
              <div>
                <span className="font-bold">Frameworks & Libraries: </span>
                Spring Boot, React, Next.js, Node.js, Express, Flask, JUnit, Mockito, REST APIs
              </div>
              <div>
                <span className="font-bold">Databases: </span>
                Oracle, MySQL, MongoDB, Redis, Firestore, NoSQL
              </div>
              <div>
                <span className="font-bold">DevOps & Tools: </span>
                Docker, Kubernetes, Azure, AWS (EC2, DynamoDB, S3), Git, GitHub Actions, Jenkins, SonarQube, Snyk, Nexus IQ, HashiCorp Vault, Postman, Jira, Linux/Unix, CI/CD, Agile/Scrum
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
