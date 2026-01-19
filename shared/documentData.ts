/**
 * Complete Nations Roof Document Data
 * 
 * This file contains ALL data extracted from the Nations Roof
 * 5-Platform AI Transformation Initiative Executive Report.
 * 
 * Every metric, KPI, friction point, use case, and calculation
 * is captured here for use throughout the application.
 */

// ============================================================================
// COMPANY BASELINE
// ============================================================================

export const COMPANY_BASELINE = {
  annualRevenue: 527000000,
  grossMargin: 0.35,
  grossMarginDollars: 184500000,
  netMargin: 0.07,
  netIncomeDollars: 35600000,
  annualProjects: 2100,
  annualBids: 11700,
  winRate: 0.22,
  avgProjectValue: 250000,
  typicalProjectDuration: "1-2 months",
  currentLeadsPerYear: 2400,
  currentCostPerLead: 350,
};

export const POST_TRANSFORMATION = {
  annualRevenue: 603000000,
  winRate: 0.33,
  netIncome: 147500000,
  netMargin: 0.24,
  projectsAnnually: 3600,
  leadsGenerated: 10000,
  costPerLead: 120,
};

// ============================================================================
// PLATFORM 0: AI MARKET EXPANSION ENGINE
// ============================================================================

export const PLATFORM_0 = {
  name: "AI Market Expansion Engine",
  subtitle: "Autonomous Agent Swarm for Lead Generation",
  annualBenefit: 35000000,
  percentOfTotal: 0.31,
  
  keyMetrics: {
    leadsPerYear: "10,000+",
    cplReduction: "$350 → $120",
    speedToLead: "<2 minutes",
    revenueImpact: "$35M",
  },

  frictionPoints: [
    {
      category: "Speed to Lead",
      issue: "Inbound leads sit in CRM inboxes for hours; conversion drops 80% after 5 minutes",
      businessImpact: "Lost conversions",
      cost: 4200000,
    },
    {
      category: "Manual List Building",
      issue: "SDRs waste 40% of time scraping permit sites and hail maps instead of selling",
      businessImpact: "35% of sales time lost",
      cost: 2400000,
    },
    {
      category: "Knowledge Gaps",
      issue: "Junior reps struggle to answer technical questions (TPO vs EPDM), losing credibility",
      businessImpact: "Poor qualification",
      cost: 1500000,
    },
    {
      category: "Data Silos",
      issue: "Salesforce CRM disconnected from property, weather, permit data",
      businessImpact: "Missed timing",
      cost: 1200000,
    },
    {
      category: "Seasonal Peaks",
      issue: "Storm events create surge demand; can't scale manual outreach",
      businessImpact: "Lost emergency revenue",
      cost: 2800000,
    },
    {
      category: "Customer Experience",
      issue: "Inconsistent follow-up; leads go cold",
      businessImpact: "40% lead leakage",
      cost: 3800000,
    },
  ],

  agents: [
    {
      name: "THE SCOUT",
      subtitle: "Data Agent",
      role: "Continuously monitors new data sources (Hail maps, Permits, Property records). Identifies high-value targets matching ICP.",
      trigger: "Triggers alerts: 'Hail in Dallas—47 properties affected.' Creates CRM leads automatically in Salesforce.",
    },
    {
      name: "THE HUNTER",
      subtitle: "Outbound Agent",
      role: "Takes leads from The Scout. Generates hyper-personalized messages. Executes multi-channel campaigns.",
      trigger: "'Saw your roof age is 20y and recent hail activity...' Campaigns via Email, SMS, LinkedIn—24/7 operation.",
    },
    {
      name: "THE CONCIERGE",
      subtitle: "Inbound Agent",
      role: "Lives on website/SMS. Qualifies inbound traffic 24/7. Answers technical questions (TPO vs EPDM) with RAG knowledge.",
      trigger: "'Do you have a leak?' → 'Let me get a truck rolled.' Instant <2 minute response regardless of time.",
    },
    {
      name: "THE CLOSER",
      subtitle: "Scheduling Agent",
      role: "Accesses human estimator calendars. Negotiates times, sends invites, handles rescheduling autonomously.",
      trigger: "Books meetings directly on calendar. Qualified leads handed off to Platform 1 (Sales Intelligence).",
    },
  ],

  dataSources: [
    {
      source: "Hail & Storm Data",
      provider: "HailTrace / Interactive Hail Maps / AccuWeather",
      useCase: "Emergency Service campaigns immediately after storms",
      cost: 45000,
    },
    {
      source: "Building Permits",
      provider: "ConstructConnect / Dodge Data",
      useCase: "New Roof bids based on active permits and project starts",
      cost: 85000,
    },
    {
      source: "Property Records",
      provider: "CoStar / Reonomy / LoopNet",
      useCase: "Reroof opportunities—property age >15y or ownership changes",
      cost: 120000,
    },
    {
      source: "Contact Enrichment",
      provider: "ZoomInfo / Apollo / Lusha",
      useCase: "Decision-maker identification and contact data",
      cost: 95000,
    },
    {
      source: "Intent Signals",
      provider: "Bombora / TrustRadius",
      useCase: "Identify companies researching roofing services",
      cost: 65000,
    },
  ],

  kpis: [
    {
      metric: "Speed to Lead",
      baseline: "4 hours",
      target: "< 2 minutes",
      industryBenchmark: "5 minutes",
    },
    {
      metric: "Cost Per Lead (CPL)",
      baseline: "$350",
      target: "$120",
      industryBenchmark: "$350",
    },
    {
      metric: "Lead Volume (Leads/Month)",
      baseline: "200 / rep",
      target: "10,000+ total",
      industryBenchmark: "—",
    },
    {
      metric: "Conversion (Lead→Meeting)",
      baseline: "5%",
      target: "12%",
      industryBenchmark: "5.58%",
    },
    {
      metric: "Maintenance Plan Attach Rate",
      baseline: "10%",
      target: "25%",
      industryBenchmark: "—",
    },
    {
      metric: "Sales Cycle Reduction",
      baseline: "Baseline",
      target: "-14 days",
      industryBenchmark: "—",
    },
  ],

  financialBreakdown: {
    revenueGrowth: 30000000,
    revenueGrowthPercent: 0.86,
    costSavings: 2300000,
    costSavingsPercent: 0.07,
    maintenancePlanRevenue: 1500000,
    maintenancePlanPercent: 0.04,
    cashFlowImpact: 700000,
    cashFlowPercent: 0.02,
    riskReduction: 500000,
    riskReductionPercent: 0.01,
  },

  investment: {
    platformInvestment: 1200000,
    annualDataCosts: 410000,
    totalFirstYear: 1610000,
    paybackPeriod: "< 4 Months",
    year1ROI: "2,100%+",
  },

  revenueCalculation: {
    annualLeads: 10000,
    leadToMeetingConversion: 0.12,
    qualifiedMeetings: 1200,
    meetingToCloseRate: 0.20,
    newProjects: 240,
    avgProjectValue: 250000,
    grossRevenuePotential: 60000000,
    netRevenueImpact: 35000000,
    marginUsed: 0.08,
  },
};

// ============================================================================
// PLATFORM 1: AI SALES INTELLIGENCE
// ============================================================================

export const PLATFORM_1 = {
  name: "AI Sales Intelligence",
  subtitle: "Intelligent Bid Selection and Competitive Analysis",
  annualBenefit: 24195000,
  percentOfTotal: 0.22,

  frictionPoints: [
    {
      category: "Knowledge Gaps",
      issue: "No visibility into which bids to pursue vs. walk away from",
      businessImpact: "22% win rate (below potential)",
      cost: 14400000,
    },
    {
      category: "Data Silos",
      issue: "Competitor pricing/strategies unknown",
      businessImpact: "Losing winnable deals",
      cost: 7200000,
    },
    {
      category: "Low-Value Work",
      issue: "Manual competitor research takes 3+ hours per bid",
      businessImpact: "Reduced bid capacity",
      cost: 2100000,
    },
  ],

  useCases: [
    {
      id: 25,
      name: "Bid Assignment AI",
      description: "AI scores opportunities in Salesforce, matches to team strengths, recommends pursue/pass",
      primaryValue: "Optimal bid selection",
    },
    {
      id: 23,
      name: "Competitor Proposal Analysis",
      description: "AI analyzes historical competitor proposals to identify patterns",
      primaryValue: "Competitive intelligence",
    },
    {
      id: 24,
      name: "Competitor Info Scouting",
      description: "AI monitors competitor activities, pricing, market moves",
      primaryValue: "Market intelligence",
    },
  ],

  kpis: [
    {
      useCase: "Bid Assignment",
      metric: "Win Rate",
      baseline: "22%",
      target: "33%",
      improvement: "↑ 50%",
    },
    {
      useCase: "Bid Assignment",
      metric: "Bid evaluation time (hours)",
      baseline: "3.0",
      target: "0.5",
      improvement: "↓ 83%",
    },
    {
      useCase: "Competitor Analysis",
      metric: "Competitive insights/bid",
      baseline: "2",
      target: "8",
      improvement: "↑ 300%",
    },
    {
      useCase: "Competitor Scouting",
      metric: "Market intel updates/week",
      baseline: "1",
      target: "Daily",
      improvement: "↑ 700%",
    },
  ],

  winRateAttribution: {
    totalImprovement: 11, // percentage points
    breakdown: [
      {
        driver: "Bid Assignment AI (strategic selection, team matching)",
        points: 6,
        attribution: 0.55,
      },
      {
        driver: "Competitor Proposal Analysis (pricing, weaknesses)",
        points: 3,
        attribution: 0.27,
      },
      {
        driver: "Competitor Info Scouting (market conditions)",
        points: 1,
        attribution: 0.09,
      },
      {
        driver: "Edge Reviews (Platform 2 contribution)",
        points: 1,
        attribution: 0.09,
      },
    ],
  },

  financialBreakdown: [
    {
      id: 25,
      useCase: "Bid Assignment AI",
      laborSavings: 260000,
      revenueGrowth: 14025000,
      total: 14285000,
      formula: "(Win Rate Improvement × Bids × Avg Value × Margin) + (Hours Saved × Rate)",
      calculation: "(6pts/11pts × 11,700 bids × $250K × 35% × 20.7%) + (4,000 hrs × $65)"
    },
    {
      id: 23,
      useCase: "Competitor Proposal Analysis",
      laborSavings: 280000,
      revenueGrowth: 7012500,
      total: 7292500,
      formula: "(Win Rate Improvement × Bids × Avg Value × Margin) + (Hours Saved × Rate)",
      calculation: "(3pts/11pts × 11,700 bids × $250K × 35% × 20.7%) + (4,308 hrs × $65)"
    },
    {
      id: 24,
      useCase: "Competitor Info Scouting",
      laborSavings: 312000,
      revenueGrowth: 2305500,
      total: 2617500,
      formula: "(Win Rate Improvement × Bids × Avg Value × Margin) + (Hours Saved × Rate)",
      calculation: "(1pt/11pts × 11,700 bids × $250K × 35% × 20.7%) + (4,800 hrs × $65)"
    },
  ],

  agents: [
    {
      name: "Opportunity Scorer",
      responsibility: "Evaluates each bid opportunity across 15+ factors; outputs win probability to Salesforce",
      technology: "XGBoost ML model trained on 5 years of win/loss data",
    },
    {
      name: "Team Matcher",
      responsibility: "Matches opportunity characteristics to team strengths and availability",
      technology: "Constraint optimization, calendar integration",
    },
    {
      name: "Competitor Analyst",
      responsibility: "Analyzes historical proposals; identifies competitor patterns",
      technology: "NLP document analysis, RAG knowledge base",
    },
    {
      name: "Market Monitor",
      responsibility: "Tracks competitor activities, pricing trends, market conditions",
      technology: "Web scrapers, news APIs, sentiment analysis",
    },
    {
      name: "Recommendation Engine",
      responsibility: "Synthesizes all inputs; presents pursue/pass recommendation with rationale",
      technology: "LLM-powered explanation generation",
    },
  ],
};

// ============================================================================
// PLATFORM 2: AI ESTIMATION SUITE
// ============================================================================

export const PLATFORM_2 = {
  name: "AI Estimation Suite",
  subtitle: "Automated Proposal Creation and Specification Analysis",
  annualBenefit: 23210000,
  percentOfTotal: 0.21,

  frictionPoints: [
    {
      category: "Low-Value Repetitive Work",
      issue: "NR Bid Sheet and proposal creation takes 2.5 hours each",
      businessImpact: "14,000 hours/year",
      cost: 6700000,
    },
    {
      category: "Knowledge Gaps",
      issue: "Edge Estimate difficult to use with steep learning curve; creates estimates from hand-drawn Takeoffs",
      businessImpact: "Bottleneck on experts",
      cost: 5100000,
    },
  ],

  useCases: [
    {
      id: 5,
      name: "Proposal Creation",
      description: "AI automates NR Bid Sheet and proposal generation from Edge Estimate data",
    },
    {
      id: 1,
      name: "Specification Reviews",
      description: "AI analyzes specifications to extract requirements and identify materials",
    },
    {
      id: 2,
      name: "Edge Estimate Reviews",
      description: "AI validates Edge estimates and addresses steep learning curve",
    },
    {
      id: 11,
      name: "Compare Quotes/Specs",
      description: "AI matches vendor quotes to specification requirements",
    },
    {
      id: 4,
      name: "Proposal Evaluation",
      description: "AI evaluates proposals for completeness and accuracy",
    },
    {
      id: 3,
      name: "Technical Questions",
      description: "AI answers estimator technical questions",
    },
  ],

  kpis: [
    {
      useCase: "Proposal Creation",
      metric: "Creation time (hours)",
      baseline: "2.5",
      target: "0.33",
      improvement: "↓ 87%",
    },
    {
      useCase: "Specification Reviews",
      metric: "Review time (hours)",
      baseline: "3.0",
      target: "0.5",
      improvement: "↓ 83%",
    },
    {
      useCase: "Edge Reviews",
      metric: "Estimate error rate",
      baseline: "8%",
      target: "2%",
      improvement: "↓ 75%",
    },
    {
      useCase: "Quote/Spec Match",
      metric: "Spec-quote match rate",
      baseline: "85%",
      target: "98%",
      improvement: "↑ 15%",
    },
    {
      useCase: "Technical QA",
      metric: "QA time (hours)",
      baseline: "4.0",
      target: "0.25",
      improvement: "↓ 94%",
    },
  ],

  financialBreakdown: [
    {
      id: 5,
      useCase: "Proposal Creation",
      laborSavings: 1336000,
      revenueGrowth: 4585000,
      riskMitigation: 0,
      cashFlow: 800000,
      total: 6721000,
      formula: "(Hours Saved × Rate) + (Faster Turnaround × Win Rate Lift × Value) + Cash Flow",
      calculation: "(11,700 bids × 2.17 hrs × $52.60) + (5% lift × $91.7M) + $800K"
    },
    {
      id: 1,
      useCase: "Specification Reviews",
      laborSavings: 660000,
      revenueGrowth: 3780000,
      riskMitigation: 700000,
      cashFlow: 0,
      total: 5140000,
      formula: "(Hours Saved × Rate) + (Error Reduction × Projects × Avg Cost) + Risk Avoided",
      calculation: "(11,700 × 2.5 hrs × $22.56) + (3% × 2,100 × $60K) + $700K"
    },
    {
      id: 2,
      useCase: "Edge Estimate Reviews",
      laborSavings: 308000,
      revenueGrowth: 4095000,
      riskMitigation: 0,
      cashFlow: 0,
      total: 4403000,
      formula: "(Hours Saved × Rate) + (Error Rate Reduction × Projects × Margin Impact)",
      calculation: "(11,700 × 0.5 hrs × $52.60) + (6% × 2,100 × $250K × 13%)"
    },
    {
      id: 11,
      useCase: "Compare Quotes/Specs",
      laborSavings: 330000,
      revenueGrowth: 0,
      riskMitigation: 3240000,
      cashFlow: 0,
      total: 3570000,
      formula: "(Hours Saved × Rate) + (Spec Compliance Improvement × Projects × Penalty Avoided)",
      calculation: "(11,700 × 0.5 hrs × $56.41) + (13% × 2,100 × $11,868)"
    },
    {
      id: 4,
      useCase: "Proposal Evaluation",
      laborSavings: 225000,
      revenueGrowth: 1838000,
      riskMitigation: 0,
      cashFlow: 0,
      total: 2063000,
      formula: "(Hours Saved × Rate) + (Quality Improvement × Win Rate Lift × Value)",
      calculation: "(11,700 × 0.5 hrs × $38.46) + (2% lift × $91.7M)"
    },
    {
      id: 3,
      useCase: "Technical Questions",
      laborSavings: 858000,
      revenueGrowth: 455000,
      riskMitigation: 0,
      cashFlow: 0,
      total: 1313000,
      formula: "(Hours Saved × Rate) + (Faster Response × Conversion Lift × Value)",
      calculation: "(11,700 × 3.75 hrs × $19.55) + (0.5% lift × $91.7M)"
    },
  ],

  agents: [
    {
      name: "Spec Analyzer",
      responsibility: "Extracts requirements from specs; identifies materials, systems, compliance",
      technology: "NLP, PDF parsing, RAG with spec database",
    },
    {
      name: "Proposal Generator",
      responsibility: "Creates NR Bid Sheet and proposals from Edge data; handles regional labor rates",
      technology: "Template engine, LLM for narrative",
    },
    {
      name: "Estimate Validator",
      responsibility: "Validates Edge estimates against historical projects and Takeoff details",
      technology: "Statistical analysis, ML anomaly detection",
    },
    {
      name: "Quote Matcher",
      responsibility: "Matches vendor quotes to spec requirements; ensures compliance",
      technology: "NLP matching, structured extraction",
    },
    {
      name: "Technical Assistant",
      responsibility: "Answers estimator questions; addresses Edge learning curve",
      technology: "RAG, LLM chat, citation generation",
    },
    {
      name: "Pricing Oracle",
      responsibility: "Provides historical pricing context; regional rate adjustments",
      technology: "Historical DB, regression analysis",
    },
  ],
};

// ============================================================================
// PLATFORM 3: AI PROJECT MANAGEMENT
// ============================================================================

export const PLATFORM_3 = {
  name: "AI Project Management",
  subtitle: "Seamless Project Delivery and Customer Experience",
  annualBenefit: 21585000,
  percentOfTotal: 0.19,

  frictionPoints: [
    {
      category: "Delays and Handoffs",
      issue: "Projects delayed average 12 days; schedule creation takes 10 hours",
      businessImpact: "LD penalties, overhead",
      cost: 9800000,
    },
    {
      category: "Rework and Errors",
      issue: "Actuals vs estimates not tracked until project end",
      businessImpact: "Surprise overruns",
      cost: 2900000,
    },
    {
      category: "Low-Value Work",
      issue: "Daily/weekly reports for customers and field crews consume PM time",
      businessImpact: "Reduced PM capacity",
      cost: 1800000,
    },
    {
      category: "Knowledge Gaps",
      issue: "Project Portfolio assembly manual; Pre-Con Packets created manually",
      businessImpact: "Inconsistent delivery",
      cost: 1500000,
    },
    {
      category: "Customer Experience",
      issue: "Customers like Walmart require Service Channel geofencing compliance",
      businessImpact: "SLA/KPI penalties",
      cost: 800000,
    },
  ],

  useCases: [
    {
      id: 18,
      name: "Schedule Generation",
      description: "AI optimizes schedules considering resources, weather, ADP/Service Channel",
    },
    {
      id: 10,
      name: "BU Actual vs Estimate",
      description: "AI tracks actuals in real-time from Viewpoint; alerts on variances",
    },
    {
      id: 15,
      name: "RFI Response Generation",
      description: "AI drafts RFI responses using project context and knowledge base",
    },
    {
      id: 17,
      name: "Project Closeout Docs",
      description: "AI assembles closeout packages; ensures completeness",
    },
    {
      id: 19,
      name: "Daily/Weekly Reports",
      description: "AI generates reports for customers and field crews automatically",
    },
    {
      id: "NEW",
      name: "Pre-Con Packet Assembly",
      description: "AI creates Scope of Work (drawings, sketches, steps) and Schedule of Work",
    },
    {
      id: "NEW2",
      name: "Project Portfolio",
      description: "AI assembles complete Project Portfolio for customer and Nations Roof team",
    },
  ],

  kpis: [
    {
      useCase: "Schedule Gen",
      metric: "Creation time (hours)",
      baseline: "10",
      target: "2.5",
      improvement: "↓ 75%",
    },
    {
      useCase: "Schedule Gen",
      metric: "Project delay (days)",
      baseline: "12",
      target: "3",
      improvement: "↓ 75%",
    },
    {
      useCase: "BU Analysis",
      metric: "Variance detection (days)",
      baseline: "30",
      target: "1",
      improvement: "↓ 97%",
    },
    {
      useCase: "Closeout Docs",
      metric: "Assembly time (hours)",
      baseline: "2",
      target: "0.5",
      improvement: "↓ 75%",
    },
    {
      useCase: "Daily/Weekly Reports",
      metric: "Report creation (minutes)",
      baseline: "45",
      target: "5",
      improvement: "↓ 89%",
    },
  ],

  financialBreakdown: [
    {
      id: 18,
      useCase: "Schedule Generation",
      laborSavings: 94000,
      costReduction: 9450000,
      revenueGrowth: 0,
      cashFlow: 0,
      total: 9544000,
      formula: "(Hours Saved × Rate) + (Days Saved × Projects × Daily Overhead)",
      calculation: "(2,100 × 7.5 hrs × $5.97) + (9 days × 2,100 × $500)"
    },
    {
      id: 10,
      useCase: "BU Actual vs Estimate",
      laborSavings: 107000,
      costReduction: 2025000,
      revenueGrowth: 735000,
      cashFlow: 0,
      total: 2867000,
      formula: "(Hours Saved × Rate) + (Variance Detection × Projects × Savings) + Revenue",
      calculation: "(2,100 × 1 hr × $50.95) + (5% × 2,100 × $19,286) + $735K"
    },
    {
      id: 15,
      useCase: "RFI Response",
      laborSavings: 284000,
      costReduction: 1563000,
      revenueGrowth: 0,
      cashFlow: 0,
      total: 1847000,
      formula: "(Hours Saved × Rate) + (Faster Response × Delay Avoided × Cost)",
      calculation: "(2,100 × 2 hrs × $67.62) + (3 days × 2,100 × $248)"
    },
    {
      id: 17,
      useCase: "Project Closeout",
      laborSavings: 202000,
      costReduction: 150000,
      revenueGrowth: 0,
      cashFlow: 445000,
      total: 797000,
      formula: "(Hours Saved × Rate) + Rework Avoided + (Faster Payment × Value)",
      calculation: "(2,100 × 1.5 hrs × $64.13) + $150K + $445K cash flow"
    },
    {
      id: 19,
      useCase: "Daily/Weekly Reports",
      laborSavings: 580000,
      costReduction: 0,
      revenueGrowth: 0,
      cashFlow: 0,
      total: 580000,
      formula: "Hours Saved × Rate × Reports per Project",
      calculation: "2,100 projects × 40 min/report × 10 reports × $41.43/hr"
    },
    {
      id: "NEW",
      useCase: "Pre-Con Packets + Portfolio",
      laborSavings: 700000,
      costReduction: 0,
      revenueGrowth: 2000000,
      cashFlow: 750000,
      total: 3450000,
      formula: "(Hours Saved × Rate) + (Customer Satisfaction × Repeat Business) + Cash Flow",
      calculation: "(2,100 × 5 hrs × $66.67) + (2% lift × $100M) + $750K"
    },
  ],

  agents: [
    {
      name: "Schedule Optimizer",
      responsibility: "Creates optimized schedules; integrates with ADP/Service Channel for geofencing",
      technology: "Constraint optimization, weather API, resource DB",
    },
    {
      name: "Cost Monitor",
      responsibility: "Tracks actuals vs estimates in real-time from Viewpoint; alerts on variances",
      technology: "Viewpoint ERP integration, anomaly detection",
    },
    {
      name: "RFI Responder",
      responsibility: "Drafts RFI responses using project context and technical knowledge base",
      technology: "RAG, project document index, LLM",
    },
    {
      name: "Report Generator",
      responsibility: "Creates daily/weekly reports for customers and field crews",
      technology: "Data aggregation, LLM narrative, Teams",
    },
    {
      name: "Pre-Con Assembler",
      responsibility: "Creates Scope of Work and Schedule of Work for Pre-Con Packets",
      technology: "Template engine, Edge integration",
    },
    {
      name: "Portfolio Builder",
      responsibility: "Assembles complete Project Portfolio for customer and internal team",
      technology: "Document management, formatting engine",
    },
    {
      name: "Closeout Assembler",
      responsibility: "Gathers all required closeout documents; ensures completeness",
      technology: "Document management, checklist automation",
    },
  ],
};

// ============================================================================
// PLATFORM 4: AI KNOWLEDGE MANAGEMENT (FOUNDATION)
// ============================================================================

export const PLATFORM_4 = {
  name: "AI Knowledge Management",
  subtitle: "Foundation Layer with RBAC and Data Classification",
  annualBenefit: 7900000,
  percentOfTotal: 0.07,

  foundationResponsibilities: [
    "Real-time knowledge access across Nations Roof's organization",
    "Role-Based Access Control (RBAC) ensuring appropriate access by role",
    "Data Classification to protect sensitive information and maintain compliance",
    "Unified search and retrieval across all project documentation",
  ],

  frictionPoints: [
    {
      category: "Low-Value Repetitive Work",
      issue: "Submittal assembly: Assembly Letter, Warranty, Technical Info, Code Requirements (manual download)",
      businessImpact: "Hours of assembly",
      cost: 6500000,
    },
    {
      category: "Data Silos",
      issue: "Spec requirements not linked to Edge items systematically",
      businessImpact: "Manual lookup errors",
      cost: 1400000,
    },
  ],

  useCases: [
    {
      id: 16,
      name: "Submittal Package Assembly",
      description: "AI gathers required docs: Assembly Letter, Manufacturer Warranty, Technical Info, Code Requirements; automates downloads from manufacturer websites",
    },
    {
      id: 9,
      name: "Spec-to-Edge Mapping",
      description: "AI links specification requirements to Edge line items automatically",
    },
  ],

  kpis: [
    {
      useCase: "Submittal Assembly",
      metric: "Assembly time (hours)",
      baseline: "13.5",
      target: "2.0",
      improvement: "↓ 85%",
    },
    {
      useCase: "Submittal Assembly",
      metric: "Completeness rate",
      baseline: "88%",
      target: "99%",
      improvement: "↑ 13%",
    },
    {
      useCase: "Spec-to-Edge Mapping",
      metric: "Mapping accuracy",
      baseline: "75%",
      target: "95%",
      improvement: "↑ 27%",
    },
  ],

  financialBreakdown: [
    {
      id: 16,
      useCase: "Submittal Package Assembly",
      laborSavings: 3250000,
      revenueGrowth: 3250000,
      total: 6500000,
      formula: "(Hours Saved × Rate) + (Completeness Improvement × Rework Avoided)",
      calculation: "(2,100 × 11.5 hrs × $134.57) + (11% × 2,100 × $14,069)"
    },
    {
      id: 9,
      useCase: "Spec-to-Edge Mapping",
      laborSavings: 720000,
      revenueGrowth: 680000,
      total: 1400000,
      formula: "(Hours Saved × Rate) + (Accuracy Improvement × Error Cost Avoided)",
      calculation: "(2,100 × 4 hrs × $85.71) + (20% × 2,100 × $1,619)"
    },
  ],

  agents: [
    {
      name: "Document Gatherer",
      responsibility: "Identifies required submittal docs; auto-downloads from manufacturer websites",
      technology: "Web automation, manufacturer portal APIs",
    },
    {
      name: "Package Assembler",
      responsibility: "Compiles Assembly Letter, Warranty, Technical Info, Code Requirements",
      technology: "PDF assembly, TOC generation, formatting",
    },
    {
      name: "Completeness Validator",
      responsibility: "Checks packages against spec requirements; flags missing items",
      technology: "NLP extraction, requirement matching",
    },
    {
      name: "Spec Mapper",
      responsibility: "Links specification sections to Edge line items automatically",
      technology: "NLP, knowledge graph, Edge API integration",
    },
    {
      name: "Knowledge Indexer",
      responsibility: "Maintains searchable index with RBAC and data classification",
      technology: "Vector DB, semantic search, access control",
    },
    {
      name: "RBAC Manager",
      responsibility: "Enforces role-based access; manages data classification labels",
      technology: "IAM integration, classification engine",
    },
  ],
};

// ============================================================================
// CONSOLIDATED TOTALS
// ============================================================================

export const CONSOLIDATED_TOTALS = {
  grandTotal: 111890000,
  
  byPlatform: [
    { platform: "P0: Market Expansion", amount: 35000000, percent: 0.31 },
    { platform: "P1: Sales Intel", amount: 24195000, percent: 0.22 },
    { platform: "P2: Estimation", amount: 23210000, percent: 0.21 },
    { platform: "P3: Project Mgmt", amount: 21585000, percent: 0.19 },
    { platform: "P4: Knowledge", amount: 7900000, percent: 0.07 },
  ],

  byBenefitType: [
    { type: "Revenue Growth", amount: 76200000, percent: 0.68 },
    { type: "Cost Reduction", amount: 28600000, percent: 0.26 },
    { type: "Risk Mitigation", amount: 4400000, percent: 0.04 },
    { type: "Cash Flow", amount: 2700000, percent: 0.02 },
  ],

  detailedBreakdown: {
    platform0: {
      revenue: 31500000,
      costReduction: 2300000,
      riskMitigation: 500000,
      cashFlow: 700000,
      total: 35000000,
    },
    platform1: {
      revenue: 23300000,
      costReduction: 900000,
      riskMitigation: 0,
      cashFlow: 0,
      total: 24200000,
    },
    platform2: {
      revenue: 14800000,
      costReduction: 3700000,
      riskMitigation: 3900000,
      cashFlow: 800000,
      total: 23200000,
    },
    platform3: {
      revenue: 2700000,
      costReduction: 17700000,
      riskMitigation: 0,
      cashFlow: 1200000,
      total: 21600000,
    },
    platform4: {
      revenue: 3900000,
      costReduction: 4000000,
      riskMitigation: 0,
      cashFlow: 0,
      total: 7900000,
    },
  },
};

// ============================================================================
// COMPETITIVE LANDSCAPE
// ============================================================================

export const COMPETITIVE_LANDSCAPE = {
  competitors: [
    {
      name: "Nations Roof",
      primaryStrategy: "AI Ecosystem (5 Platforms)",
      leadGeneration: "Autonomous Swarm",
      aiMaturity: "HIGH",
      revenue: "$527M",
    },
    {
      name: "Centimark",
      primaryStrategy: "National Footprint",
      leadGeneration: "Digital / Salesforce",
      aiMaturity: "Medium",
      revenue: "~$1B+ (Est.)",
    },
    {
      name: "Tecta America",
      primaryStrategy: "Tech Stack (ERP/Ops)",
      leadGeneration: "Acquisitions",
      aiMaturity: "Medium",
      revenue: "~$824M",
    },
    {
      name: "Baker Roofing",
      primaryStrategy: "Asset Mgmt / IoT",
      leadGeneration: "Preventative Prog.",
      aiMaturity: "Low/Medium",
      revenue: "~$250M+",
    },
  ],
};

// ============================================================================
// TECHNOLOGY INTEGRATION
// ============================================================================

export const TECHNOLOGY_INTEGRATION = [
  {
    function: "CRM",
    currentSystem: "Salesforce",
    integration: "P0 syncs leads, P1 enriches opportunities, all platforms share customer context",
  },
  {
    function: "Estimating",
    currentSystem: "Edge Estimate",
    integration: "P2 automates takeoff-to-proposal workflow, addresses steep learning curve",
  },
  {
    function: "ERP",
    currentSystem: "Viewpoint",
    integration: "P3 integrates for real-time actuals vs. estimates, project financials",
  },
  {
    function: "Collaboration",
    currentSystem: "Microsoft Office & Teams",
    integration: "All platforms leverage Teams for notifications, Office for document generation",
  },
  {
    function: "Analytics",
    currentSystem: "Power BI (considering Tableau)",
    integration: "P4 feeds unified data lake for cross-platform analytics and dashboards",
  },
  {
    function: "HR/Time Tracking",
    currentSystem: "ADP + Service Channel",
    integration: "P3 coordinates with geofencing for crew attendance tracking (Walmart, etc.)",
  },
];
