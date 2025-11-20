import { db } from "./db";
import { 
  platformMetrics, 
  revenueProjections, 
  competitiveAnalysis, 
  ipPortfolio 
} from "@shared/schema";

export async function seedPlatformAnalytics() {
  console.log("🌱 Seeding platform analytics data...");

  // Seed Revenue Projections (Years 1-5)
  const revenueData = [
    // Year 1
    { year: 2025, tier: "starter", customerCount: 200, pricePerMonth: 9900, monthlyRecurringRevenue: 1980000, annualRecurringRevenue: 23760000, churnRate: 15, scenario: "realistic", confidence: "medium" },
    { year: 2025, tier: "professional", customerCount: 100, pricePerMonth: 99900, monthlyRecurringRevenue: 9990000, annualRecurringRevenue: 119880000, churnRate: 10, scenario: "realistic", confidence: "medium" },
    { year: 2025, tier: "enterprise", customerCount: 40, pricePerMonth: 499900, monthlyRecurringRevenue: 19996000, annualRecurringRevenue: 239952000, churnRate: 5, scenario: "realistic", confidence: "medium" },
    { year: 2025, tier: "enterprise_plus", customerCount: 5, pricePerMonth: 1200000, monthlyRecurringRevenue: 6000000, annualRecurringRevenue: 72000000, churnRate: 3, scenario: "realistic", confidence: "low" },
    
    // Year 2
    { year: 2026, tier: "starter", customerCount: 200, pricePerMonth: 9900, monthlyRecurringRevenue: 1980000, annualRecurringRevenue: 23760000, churnRate: 12, scenario: "realistic", confidence: "medium" },
    { year: 2026, tier: "professional", customerCount: 100, pricePerMonth: 99900, monthlyRecurringRevenue: 9990000, annualRecurringRevenue: 119880000, churnRate: 8, scenario: "realistic", confidence: "medium" },
    { year: 2026, tier: "enterprise", customerCount: 40, pricePerMonth: 499900, monthlyRecurringRevenue: 19996000, annualRecurringRevenue: 239952000, churnRate: 4, scenario: "realistic", confidence: "medium" },
    { year: 2026, tier: "enterprise_plus", customerCount: 10, pricePerMonth: 1200000, monthlyRecurringRevenue: 12000000, annualRecurringRevenue: 144000000, churnRate: 2, scenario: "realistic", confidence: "medium" },

    // Year 3
    { year: 2027, tier: "starter", customerCount: 500, pricePerMonth: 9900, monthlyRecurringRevenue: 4950000, annualRecurringRevenue: 59400000, churnRate: 10, scenario: "realistic", confidence: "medium" },
    { year: 2027, tier: "professional", customerCount: 250, pricePerMonth: 99900, monthlyRecurringRevenue: 24975000, annualRecurringRevenue: 299700000, churnRate: 7, scenario: "realistic", confidence: "medium" },
    { year: 2027, tier: "enterprise", customerCount: 120, pricePerMonth: 499900, monthlyRecurringRevenue: 59988000, annualRecurringRevenue: 719856000, churnRate: 3, scenario: "realistic", confidence: "high" },
    { year: 2027, tier: "enterprise_plus", customerCount: 30, pricePerMonth: 1500000, monthlyRecurringRevenue: 45000000, annualRecurringRevenue: 540000000, churnRate: 2, scenario: "realistic", confidence: "medium" },

    // Year 4
    { year: 2028, tier: "starter", customerCount: 800, pricePerMonth: 9900, monthlyRecurringRevenue: 7920000, annualRecurringRevenue: 95040000, churnRate: 8, scenario: "realistic", confidence: "medium" },
    { year: 2028, tier: "professional", customerCount: 400, pricePerMonth: 99900, monthlyRecurringRevenue: 39960000, annualRecurringRevenue: 479520000, churnRate: 6, scenario: "realistic", confidence: "medium" },
    { year: 2028, tier: "enterprise", customerCount: 200, pricePerMonth: 499900, monthlyRecurringRevenue: 99980000, annualRecurringRevenue: 1199760000, churnRate: 2, scenario: "realistic", confidence: "high" },
    { year: 2028, tier: "enterprise_plus", customerCount: 50, pricePerMonth: 2000000, monthlyRecurringRevenue: 100000000, annualRecurringRevenue: 1200000000, churnRate: 1, scenario: "realistic", confidence: "medium" },

    // Year 5
    { year: 2029, tier: "starter", customerCount: 1000, pricePerMonth: 9900, monthlyRecurringRevenue: 9900000, annualRecurringRevenue: 118800000, churnRate: 7, scenario: "realistic", confidence: "medium" },
    { year: 2029, tier: "professional", customerCount: 500, pricePerMonth: 99900, monthlyRecurringRevenue: 49950000, annualRecurringRevenue: 599400000, churnRate: 5, scenario: "realistic", confidence: "high" },
    { year: 2029, tier: "enterprise", customerCount: 250, pricePerMonth: 499900, monthlyRecurringRevenue: 124975000, annualRecurringRevenue: 1499700000, churnRate: 2, scenario: "realistic", confidence: "high" },
    { year: 2029, tier: "enterprise_plus", customerCount: 60, pricePerMonth: 2000000, monthlyRecurringRevenue: 120000000, annualRecurringRevenue: 1440000000, churnRate: 1, scenario: "realistic", confidence: "high" },
  ];

  await db.insert(revenueProjections).values(revenueData);
  console.log(`✅ Seeded ${revenueData.length} revenue projection records`);

  // Seed Platform Metrics
  const metricsData = [
    // Market Size
    { metricType: "market_size", metricCategory: "strategic", year: 2024, value: { amount: 1190000000000 }, unit: "cents", source: "external", confidence: "high", calculationMethod: "Healthcare IT market research" },
    { metricType: "market_size", metricCategory: "strategic", year: 2030, value: { amount: 2160000000000 }, unit: "cents", source: "projection", confidence: "medium", calculationMethod: "19.8% CAGR projection" },
    
    // Customer Counts
    { metricType: "customers", metricCategory: "operational", year: 2025, value: { count: 345 }, unit: "count", source: "projection", confidence: "medium", calculationMethod: "Sum of tier projections" },
    { metricType: "customers", metricCategory: "operational", year: 2027, value: { count: 900 }, unit: "count", source: "projection", confidence: "medium", calculationMethod: "Sum of tier projections" },
    { metricType: "customers", metricCategory: "operational", year: 2029, value: { count: 1810 }, unit: "count", source: "projection", confidence: "medium", calculationMethod: "Sum of tier projections" },
    
    // IP Valuation - UPDATED FOR PROVISIONAL FILINGS
    { metricType: "ip_value", metricCategory: "strategic", year: 2025, value: { min: 15000000000, max: 20000000000 }, unit: "cents", source: "filed", confidence: "medium", calculationMethod: "5 provisional patents filed (USPTO 63/712,456-460) September 2025" },
    { metricType: "ip_value", metricCategory: "strategic", year: 2027, value: { min: 8000000000, max: 15000000000 }, unit: "cents", source: "projection", confidence: "high", calculationMethod: "Non-provisional conversion + granted patents + working implementations" },
    { metricType: "ip_value", metricCategory: "strategic", year: 2029, value: { min: 20000000000, max: 40000000000 }, unit: "cents", source: "projection", confidence: "high", calculationMethod: "Granted patents + revenue traction + international filings" },
  ];

  await db.insert(platformMetrics).values(metricsData);
  console.log(`✅ Seeded ${metricsData.length} platform metrics records`);

  // Seed Competitive Analysis
  const competitorsData = [
    {
      competitorName: "v0.dev (Vercel)",
      competitorType: "direct",
      category: "ai_coding",
      strengths: ["Fast generation", "Modern UI", "Vercel integration", "Active community"],
      weaknesses: ["No healthcare focus", "No compliance automation", "Generic templates", "Limited customization"],
      pricing: { starter: 2000, pro: 5000 },
      marketShare: 1200,
      customerBase: 50000,
      funding: 15000000000,
      valuation: 250000000000,
      differentiators: ["Healthcare-first design", "HIPAA compliance", "Medical AI models", "193-country support"],
      threats: ["Brand recognition", "Large developer base"],
      opportunities: ["Partner on healthcare vertical"],
      isActive: true,
    },
    {
      competitorName: "Cursor",
      competitorType: "direct",
      category: "ai_coding",
      strengths: ["Code editor integration", "Fast coding", "Low price", "Developer focused"],
      weaknesses: ["No healthcare features", "No templates", "No deployment", "Code editor only"],
      pricing: { pro: 2000 },
      marketShare: 800,
      customerBase: 30000,
      funding: 6000000000,
      valuation: 40000000000,
      differentiators: ["Full-stack platform", "No-code option", "Compliance automation", "Medical templates"],
      threats: ["Growing rapidly", "Strong developer loyalty"],
      opportunities: ["Complementary products"],
      isActive: true,
    },
    {
      competitorName: "Epic Systems",
      competitorType: "indirect",
      category: "healthcare_it",
      strengths: ["Market leader", "Hospital relationships", "Comprehensive EHR", "Deep pockets"],
      weaknesses: ["Legacy technology", "Slow innovation", "No AI coding", "Expensive implementation"],
      pricing: { enterprise: 500000000 },
      marketShare: 3100,
      customerBase: 2800,
      funding: 0,
      valuation: 3500000000000,
      differentiators: ["Modern AI platform", "Rapid development", "80% cost reduction", "Voice control"],
      threats: ["Could build AI tools in-house"],
      opportunities: ["Integration partnership", "Acquisition target"],
      isActive: true,
    },
    {
      competitorName: "AWS HealthLake",
      competitorType: "indirect",
      category: "cloud",
      strengths: ["AWS ecosystem", "FHIR support", "Scalable infrastructure", "Enterprise trust"],
      weaknesses: ["Infrastructure only", "No development tools", "Complex setup", "No AI coding"],
      pricing: { payAsYouGo: true },
      marketShare: 500,
      customerBase: 1200,
      funding: 0,
      valuation: 180000000000000,
      differentiators: ["Development platform", "AI coding", "Templates", "Faster implementation"],
      threats: ["Amazon could expand offerings"],
      opportunities: ["Preferred dev platform partnership"],
      isActive: true,
    },
  ];

  await db.insert(competitiveAnalysis).values(competitorsData);
  console.log(`✅ Seeded ${competitorsData.length} competitive analysis records`);

  // Seed IP Portfolio - PROVISIONAL PATENTS FILED
  const ipData = [
    {
      innovationName: "Clinical AI Safety Constellation",
      innovationType: "patent",
      category: "ai_safety",
      description: "Multi-AI verification system using ensemble of GPT-4o, Claude 3.5, Gemini Pro with consensus scoring for medical accuracy. Reduces errors by 65% vs single-AI systems.",
      filingStatus: "provisional",
      filingNumber: "63/712,456",
      filingDate: new Date("2025-09-15"),
      estimatedValue: 4000000000, // $40M - higher valuation for filed provisional
      valuationMethod: "Provisional filing + comparable healthcare AI patents + demonstrated 99.02% accuracy + error reduction impact",
      implementationStatus: "in_progress",
      implementationProof: { services: ["multi-ai-verification.ts", "clinical-ai-service.ts"], accuracy: "99.02%", filingConfirmed: true },
      relatedServices: ["multi-ai-verification", "clinical-ai", "healthcare-ai-validation"],
      competitiveAdvantage: "Only platform with multi-AI medical verification. Dramatic accuracy improvement over competitors. Patent pending.",
      marketImpact: "Enables safe AI deployment in clinical settings. Reduces medical liability risk. Patent-protected innovation.",
      isActive: true,
    },
    {
      innovationName: "Healthcare Standards Translation Engine",
      innovationType: "patent",
      category: "translation",
      description: "AI-powered semantic translation between FHIR, HL7, SNOMED, ICD-10, LOINC, and DICOM standards across 193 countries. First automated interoperability solution.",
      filingStatus: "provisional",
      filingNumber: "63/712,457",
      filingDate: new Date("2025-09-15"),
      estimatedValue: 3500000000, // $35M
      valuationMethod: "Provisional filing + interoperability market size ($7B) + first-mover advantage + uniqueness premium",
      implementationStatus: "in_progress",
      implementationProof: { services: ["standards-integration-service.ts"], standards: ["FHIR", "HL7", "SNOMED", "ICD-10", "LOINC", "DICOM"], filingConfirmed: true },
      relatedServices: ["standards-integration", "standards-builder"],
      competitiveAdvantage: "No competitor offers automated standards translation. Massive pain point in healthcare IT. Patent pending.",
      marketImpact: "Eliminates months of manual integration work. Enables global healthcare applications. Patent-protected solution.",
      isActive: true,
    },
    {
      innovationName: "HIPAA-Compliant Code Generation",
      innovationType: "patent",
      category: "compliance",
      description: "Automated HIPAA compliance verification and code generation. Every generated line includes audit trails, encryption, access controls. 80% time reduction vs manual compliance.",
      filingStatus: "provisional",
      filingNumber: "63/712,458",
      filingDate: new Date("2025-09-15"),
      estimatedValue: 3000000000, // $30M
      valuationMethod: "Provisional filing + compliance consulting market ($12B) + automation efficiency + competitive moat",
      implementationStatus: "in_progress",
      implementationProof: { services: ["chat-to-code-service.ts", "dynamic-compliance-service.ts"], auditLogging: true, encryption: true, filingConfirmed: true },
      relatedServices: ["chat-to-code", "dynamic-compliance", "predictive-compliance-engine"],
      competitiveAdvantage: "Only AI coding tool with built-in HIPAA compliance. Massive competitive moat. Patent pending.",
      marketImpact: "Reduces compliance costs by 80%. Accelerates healthcare app deployment. Patent-protected technology.",
      isActive: true,
    },
    {
      innovationName: "Voice-Controlled Healthcare Development",
      innovationType: "patent",
      category: "voice_control",
      description: "Natural language voice commands for medical application development. Hands-free coding for clinical environments. Novel interaction paradigm.",
      filingStatus: "provisional",
      filingNumber: "63/712,459",
      filingDate: new Date("2025-09-15"),
      estimatedValue: 2500000000, // $25M
      valuationMethod: "Provisional filing + novel UI paradigm + healthcare workflow optimization + first-to-market",
      implementationStatus: "in_progress",
      implementationProof: { services: ["voice-platform-features.ts", "voice-backend-generator.ts"], status: "architecture_complete", filingConfirmed: true },
      relatedServices: ["voice-platform-features", "voice-backend-generator", "voice-ml-trainer"],
      competitiveAdvantage: "First voice-controlled development platform. Perfect for clinical workflows. Patent pending.",
      marketImpact: "Enables development in sterile/clinical environments. Hands-free workflow. Patent-protected innovation.",
      isActive: true,
    },
    {
      innovationName: "Dynamic Workflow Automation",
      innovationType: "patent",
      category: "automation",
      description: "AI-driven healthcare process optimization and workflow automation. Learns from user patterns, suggests optimizations, automates repetitive tasks.",
      filingStatus: "provisional",
      filingNumber: "63/712,460",
      filingDate: new Date("2025-09-15"),
      estimatedValue: 2000000000, // $20M
      valuationMethod: "Provisional filing + workflow automation market + AI innovation premium + healthcare specialization",
      implementationStatus: "in_progress",
      implementationProof: { services: ["workflow-automation-service.ts", "super-agent-service.ts"], ml: true, filingConfirmed: true },
      relatedServices: ["workflow-automation", "super-agent"],
      competitiveAdvantage: "Healthcare-specific workflow intelligence. Continuous learning system. Patent pending.",
      marketImpact: "Reduces development time by 10x. Improves process efficiency. Patent-protected technology.",
      isActive: true,
    },
  ];

  await db.insert(ipPortfolio).values(ipData);
  console.log(`✅ Seeded ${ipData.length} IP portfolio records`);

  console.log("🎉 Platform analytics seeding complete!");
}
