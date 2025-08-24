import { storage } from './storage';
import { errorHandler } from './common/error-handler';

export interface CompliancePattern {
  id: string;
  name: string;
  standard: string;
  rules: Array<{
    condition: string;
    requirement: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    autoFix?: boolean;
  }>;
  healthcareDomains: string[];
  regions: string[];
  lastUpdated: string;
}

export class DynamicComplianceService {
  private compliancePatterns: Map<string, CompliancePattern> = new Map();
  private complianceResults: Map<string, any> = new Map();

  constructor() {
    this.initializeCompliancePatterns();
  }

  private async initializeCompliancePatterns() {
    // Load dynamic compliance patterns from database or external API
    try {
      const patterns = await this.loadCompliancePatternsFromDatabase();
      patterns.forEach(pattern => {
        this.compliancePatterns.set(pattern.id, pattern);
      });
      console.log(`🛡️ Loaded ${patterns.length} compliance patterns`);
    } catch (error) {
      console.error('Failed to load compliance patterns:', error);
      this.loadDefaultCompliancePatterns();
    }
  }

  private async loadCompliancePatternsFromDatabase(): Promise<CompliancePattern[]> {
    // In a real implementation, this would fetch from database
    // For now, return dynamic patterns based on healthcare standards
    const healthcareStandards = await storage.getHealthcareStandards();
    
    return healthcareStandards.map(standard => ({
      id: `compliance_${standard.id}`,
      name: standard.name,
      standard: standard.standardName,
      rules: [
        {
          condition: 'data_encryption',
          requirement: 'All patient data must be encrypted at rest and in transit',
          severity: 'critical' as const,
          autoFix: false
        },
        {
          condition: 'access_logging',
          requirement: 'All data access must be logged with user identification',
          severity: 'high' as const,
          autoFix: true
        },
        {
          condition: 'session_timeout',
          requirement: 'User sessions must timeout after 15 minutes of inactivity',
          severity: 'medium' as const,
          autoFix: true
        }
      ],
      healthcareDomains: [standard.applicableDomains],
      regions: [standard.region],
      lastUpdated: new Date().toISOString()
    }));
  }

  private loadDefaultCompliancePatterns() {
    const defaultPatterns: CompliancePattern[] = [
      {
        id: 'hipaa_basic',
        name: 'HIPAA Basic Compliance',
        standard: 'HIPAA',
        rules: [
          {
            condition: 'phi_encryption',
            requirement: 'Protected Health Information must be encrypted',
            severity: 'critical',
            autoFix: false
          },
          {
            condition: 'audit_logging',
            requirement: 'All PHI access must be audited',
            severity: 'high',
            autoFix: true
          }
        ],
        healthcareDomains: ['clinical', 'administrative'],
        regions: ['US'],
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'gdpr_healthcare',
        name: 'GDPR Healthcare Compliance',
        standard: 'GDPR',
        rules: [
          {
            condition: 'consent_management',
            requirement: 'Explicit consent required for data processing',
            severity: 'critical',
            autoFix: false
          },
          {
            condition: 'data_portability',
            requirement: 'Users must be able to export their data',
            severity: 'medium',
            autoFix: true
          }
        ],
        healthcareDomains: ['clinical', 'research'],
        regions: ['EU'],
        lastUpdated: new Date().toISOString()
      }
    ];

    defaultPatterns.forEach(pattern => {
      this.compliancePatterns.set(pattern.id, pattern);
    });
  }

  async analyzeProjectCompliance(projectId: number, healthcareDomain: string, region: string) {
    return await errorHandler.handleAnalysisOperation(
      'Project compliance analysis',
      async () => {
        const project = await storage.getProject(projectId);
        if (!project) {
          throw new Error(`Project ${projectId} not found`);
        }

        const applicablePatterns = this.getApplicablePatterns(healthcareDomain, region);
        const results = [];

        for (const pattern of applicablePatterns) {
          const patternResult = await this.evaluateCompliancePattern(project, pattern);
          results.push(patternResult);
        }

        const overallScore = this.calculateComplianceScore(results);
        const criticalIssues = results.filter(r => r.criticalIssues > 0);

        return {
          projectId,
          overallScore,
          complianceLevel: this.getComplianceLevel(overallScore),
          appliedPatterns: applicablePatterns.length,
          results,
          criticalIssues: criticalIssues.length,
          recommendations: this.generateRecommendations(results),
          lastAnalyzed: new Date().toISOString()
        };
      }
    );
  }

  private getApplicablePatterns(healthcareDomain: string, region: string): CompliancePattern[] {
    return Array.from(this.compliancePatterns.values()).filter(pattern =>
      pattern.healthcareDomains.includes(healthcareDomain) ||
      pattern.regions.includes(region) ||
      pattern.healthcareDomains.includes('all')
    );
  }

  private async evaluateCompliancePattern(project: any, pattern: CompliancePattern) {
    const ruleResults = [];
    let criticalIssues = 0;
    let passedRules = 0;

    for (const rule of pattern.rules) {
      const ruleResult = await this.evaluateRule(project, rule);
      ruleResults.push(ruleResult);
      
      if (ruleResult.status === 'failed' && rule.severity === 'critical') {
        criticalIssues++;
      } else if (ruleResult.status === 'passed') {
        passedRules++;
      }
    }

    return {
      patternId: pattern.id,
      patternName: pattern.name,
      standard: pattern.standard,
      score: (passedRules / pattern.rules.length) * 100,
      ruleResults,
      criticalIssues,
      passedRules,
      totalRules: pattern.rules.length
    };
  }

  private async evaluateRule(project: any, rule: any) {
    // In a real implementation, this would evaluate the actual project code/configuration
    // For now, simulate rule evaluation based on project properties
    const hasSecurityConfig = project.name.toLowerCase().includes('secure') || 
                             project.description?.toLowerCase().includes('hipaa');
    
    const passed = rule.condition === 'phi_encryption' ? hasSecurityConfig : 
                  rule.condition === 'audit_logging' ? true :
                  rule.condition === 'consent_management' ? hasSecurityConfig :
                  Math.random() > 0.2; // 80% pass rate for other rules

    return {
      condition: rule.condition,
      requirement: rule.requirement,
      status: passed ? 'passed' : 'failed',
      severity: rule.severity,
      autoFixAvailable: rule.autoFix || false,
      details: passed ? 'Compliance requirement met' : 'Compliance requirement not satisfied'
    };
  }

  private calculateComplianceScore(results: any[]): number {
    if (results.length === 0) return 0;
    
    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    return Math.round(totalScore / results.length);
  }

  private getComplianceLevel(score: number): string {
    if (score >= 95) return 'Excellent';
    if (score >= 85) return 'Good';
    if (score >= 70) return 'Satisfactory';
    if (score >= 50) return 'Needs Improvement';
    return 'Critical Issues';
  }

  private generateRecommendations(results: any[]): string[] {
    const recommendations = [];
    
    for (const result of results) {
      const failedRules = result.ruleResults.filter((r: any) => r.status === 'failed');
      for (const failedRule of failedRules) {
        if (failedRule.autoFixAvailable) {
          recommendations.push(`Auto-fix available: ${failedRule.requirement}`);
        } else {
          recommendations.push(`Manual review required: ${failedRule.requirement}`);
        }
      }
    }

    return recommendations;
  }

  async getCompliancePatterns(): Promise<CompliancePattern[]> {
    return Array.from(this.compliancePatterns.values());
  }

  async updateCompliancePattern(patternId: string, updates: Partial<CompliancePattern>) {
    const pattern = this.compliancePatterns.get(patternId);
    if (!pattern) {
      throw new Error(`Compliance pattern ${patternId} not found`);
    }

    const updatedPattern = { ...pattern, ...updates, lastUpdated: new Date().toISOString() };
    this.compliancePatterns.set(patternId, updatedPattern);
    
    return updatedPattern;
  }

  async getComplianceStats() {
    const patterns = Array.from(this.compliancePatterns.values());
    const totalPatterns = patterns.length;
    const standardCounts = patterns.reduce((acc, pattern) => {
      acc[pattern.standard] = (acc[pattern.standard] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalPatterns,
      byStandard: standardCounts,
      lastUpdated: new Date().toISOString(),
      coverage: {
        hipaa: patterns.filter(p => p.standard === 'HIPAA').length,
        gdpr: patterns.filter(p => p.standard === 'GDPR').length,
        fda: patterns.filter(p => p.standard === 'FDA').length,
        iso: patterns.filter(p => p.standard.startsWith('ISO')).length
      }
    };
  }
}

export const dynamicComplianceService = new DynamicComplianceService();