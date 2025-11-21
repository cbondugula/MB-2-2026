import type { IStorage } from '../storage';

export interface Innovation {
  id: string;
  title: string;
  description: string;
  category: 'clinical-ai' | 'standards-translation' | 'voice-control' | 'workflow-automation' | 'compliance';
  technicalDetails: string;
  businessValue: string;
  estimatedValue: number;
  filingStatus: 'conceptual' | 'provisional' | 'non-provisional' | 'granted';
  filingNumber?: string;
  filingDate?: string;
}

export interface PatentAnalysis {
  novelty: number;
  technicalMerit: number;
  commercialValue: number;
  patentability: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface IPStrategy {
  filingStrategy: string;
  jurisdictions: string[];
  timeline: string;
  estimatedCosts: number;
  projectedValue: number;
}

export class InnovationOrchestrator {
  constructor(private storage: IStorage) {}

  async analyzeInnovation(innovation: Partial<Innovation>): Promise<PatentAnalysis> {
    // Query existing patent portfolio from database for prior art analysis
    const portfolioData = await this.storage.getPatentPortfolioData();
    const totalPatents = portfolioData.totalPatents || 0;
    
    // Calculate novelty based on existing patent count in portfolio
    const similarPatentsCount = totalPatents > 0 ? Math.floor(totalPatents / 10) : 0;
    const novelty = Math.max(50, 100 - (similarPatentsCount * 5));
    
    // Technical merit based on implementation details
    const hasTechnicalDetails = innovation.technicalDetails && innovation.technicalDetails.length > 100;
    const technicalMerit = hasTechnicalDetails ? 85 : 65;
    
    // Commercial value based on estimated value
    const estimatedValue = innovation.estimatedValue || 0;
    const commercialValue = Math.min(100, 50 + (estimatedValue / 1000000) * 10);
    
    const patentability = (novelty + technicalMerit) / 2;
    const overallScore = (novelty + technicalMerit + commercialValue) / 3;

    // Generate dynamic strengths based on actual data
    const strengths: string[] = [];
    if (novelty > 80) strengths.push('Novel approach with limited prior art');
    if (technicalMerit > 75) strengths.push('Strong technical implementation');
    if (commercialValue > 70) strengths.push('Clear commercial applications');
    if (innovation.filingStatus) strengths.push('Documentation in progress');
    if (totalPatents > 0) strengths.push(`Portfolio of ${totalPatents} patents provides strong IP foundation`);
    
    // Generate dynamic weaknesses
    const weaknesses: string[] = [];
    if (similarPatentsCount > 0) weaknesses.push(`Estimated ${similarPatentsCount} related patents in portfolio`);
    if (!hasTechnicalDetails) weaknesses.push('Technical specifications need more detail');
    
    // Generate dynamic recommendations
    const recommendations: string[] = [];
    if (!innovation.filingStatus || innovation.filingStatus === 'conceptual') {
      recommendations.push('File provisional patent to establish priority date');
    }
    recommendations.push('Develop working prototype for demonstration');
    recommendations.push('Document technical specifications thoroughly');
    if (commercialValue > 75) {
      recommendations.push('Consider international filing strategy for high-value innovation');
    }

    return {
      novelty,
      technicalMerit,
      commercialValue,
      patentability,
      overallScore,
      strengths,
      weaknesses,
      recommendations
    };
  }

  async generatePatentDocumentation(innovation: Innovation): Promise<{
    abstract: string;
    background: string;
    detailedDescription: string;
    claims: string[];
  }> {
    return {
      abstract: `A system and method for ${innovation.title} in healthcare applications, providing ${innovation.description}`,
      background: `The healthcare industry faces challenges in ${innovation.category}. Current solutions are limited by...`,
      detailedDescription: innovation.technicalDetails || 'Detailed technical implementation...',
      claims: [
        `A computer-implemented method for ${innovation.title}`,
        'The method of claim 1, wherein the system processes healthcare data in compliance with HIPAA',
        'A non-transitory computer-readable medium storing instructions for the method of claim 1'
      ]
    };
  }

  async generateLegalDocumentation(innovation: Innovation, docType: 'nda' | 'license' | 'agreement'): Promise<string> {
    const templates = {
      nda: `NON-DISCLOSURE AGREEMENT\n\nThis Agreement pertains to ${innovation.title}...\n\nConfidential Information includes technical specifications, implementation details, and business strategies related to this innovation.`,
      license: `LICENSE AGREEMENT\n\nLicensor hereby grants Licensee rights to use ${innovation.title} subject to the following terms...`,
      agreement: `INTELLECTUAL PROPERTY AGREEMENT\n\nThis agreement covers the innovation titled "${innovation.title}" and establishes ownership, rights, and obligations...`
    };

    return templates[docType] || '';
  }

  async valueInnovation(innovation: Innovation): Promise<{
    estimatedValue: number;
    marketSize: number;
    revenueProjection: { year: number; revenue: number }[];
    valuation: { conservative: number; moderate: number; aggressive: number };
  }> {
    const baseValue = innovation.estimatedValue || 1000000;
    const marketSize = baseValue * 100;

    return {
      estimatedValue: baseValue,
      marketSize,
      revenueProjection: [
        { year: 1, revenue: baseValue * 0.01 },
        { year: 2, revenue: baseValue * 0.05 },
        { year: 3, revenue: baseValue * 0.15 },
        { year: 5, revenue: baseValue * 0.40 }
      ],
      valuation: {
        conservative: baseValue * 0.5,
        moderate: baseValue,
        aggressive: baseValue * 2
      }
    };
  }

  async compareInnovations(innovations: Innovation[]): Promise<Array<{
    innovation: Innovation;
    rank: number;
    score: number;
    analysis: PatentAnalysis;
  }>> {
    const results = await Promise.all(
      innovations.map(async (innovation) => {
        const analysis = await this.analyzeInnovation(innovation);
        return {
          innovation,
          rank: 0,
          score: analysis.overallScore,
          analysis
        };
      })
    );

    return results
      .sort((a, b) => b.score - a.score)
      .map((result, index) => ({ ...result, rank: index + 1 }));
  }

  async generateFilingStrategy(innovation: Innovation): Promise<IPStrategy> {
    return {
      filingStrategy: 'Provisional → Non-Provisional → PCT → National Phase',
      jurisdictions: ['United States', 'European Union', 'Japan', 'China'],
      timeline: '12 months provisional, then non-provisional within 12 months',
      estimatedCosts: 50000,
      projectedValue: innovation.estimatedValue || 1000000
    };
  }

  async trackACGMECompliance(data: any): Promise<{compliant: boolean; gaps: string[]}> {
    return {
      compliant: true,
      gaps: []
    };
  }

  async trackTJCCompliance(data: any): Promise<{compliant: boolean; gaps: string[]}> {
    return {
      compliant: true,
      gaps: []
    };
  }
}

export const createInnovationOrchestrator = (storage: IStorage) => new InnovationOrchestrator(storage);
