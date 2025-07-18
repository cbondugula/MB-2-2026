import OpenAI from "openai";
import crypto from "crypto";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "placeholder"
});

export interface CodeCompletionRequest {
  code: string;
  cursor: { line: number; column: number };
  filePath: string;
  language: string;
  context?: {
    projectType?: string;
    framework?: string;
    isHealthcare?: boolean;
  };
}

export interface CodeAnalysisRequest {
  code: string;
  filePath: string;
  analysisType: "security" | "hipaa" | "performance" | "quality" | "accessibility";
}

export interface ArchitectureReviewRequest {
  projectStructure: any;
  requirements: string[];
  complianceLevel: "basic" | "hipaa" | "fda" | "soc2";
}

export class AIService {
  private healthcarePatterns = [
    "FHIR resource handling",
    "HL7 message processing", 
    "PHI data encryption",
    "Audit logging patterns",
    "Patient consent management",
    "Healthcare API integration",
    "Medical device connectivity",
    "Clinical decision support",
    "Telemedicine workflows",
    "EHR data synchronization"
  ];

  private hipaaCompliantPatterns = [
    "Always encrypt PHI data at rest and in transit",
    "Implement proper access controls and user authentication",
    "Log all access to PHI with audit trails",
    "Use secure communication protocols (HTTPS/TLS)",
    "Implement data minimization principles",
    "Ensure proper backup and disaster recovery",
    "Regular security assessments and penetration testing",
    "Employee training on HIPAA compliance",
    "Business associate agreements for third parties",
    "Incident response and breach notification procedures"
  ];

  async getCodeCompletion(request: CodeCompletionRequest): Promise<{
    suggestions: Array<{
      text: string;
      type: "completion" | "snippet" | "refactor";
      confidence: number;
      explanation?: string;
      isHealthcareSpecific?: boolean;
    }>;
    analysis?: {
      healthcareRelevance: number;
      complianceIssues: string[];
      suggestions: string[];
    };
  }> {
    if (!process.env.OPENAI_API_KEY) {
      return this.getFallbackCompletion(request);
    }

    try {
      const prompt = this.buildCodeCompletionPrompt(request);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert healthcare software developer with deep knowledge of HIPAA compliance, FHIR standards, HL7 protocols, and medical software architecture. Provide intelligent code completions with healthcare-specific insights."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return this.enhanceWithHealthcareContext(result, request);
    } catch (error) {
      console.error("AI completion error:", error);
      return this.getFallbackCompletion(request);
    }
  }

  async analyzeCode(request: CodeAnalysisRequest): Promise<{
    score: number;
    findings: Array<{
      type: "error" | "warning" | "info" | "suggestion";
      message: string;
      line?: number;
      column?: number;
      severity: "high" | "medium" | "low";
      category: string;
      fix?: string;
    }>;
    recommendations: string[];
    complianceStatus?: {
      hipaa: number;
      accessibility: number;
      security: number;
    };
  }> {
    if (!process.env.OPENAI_API_KEY) {
      return this.getFallbackAnalysis(request);
    }

    try {
      const prompt = this.buildAnalysisPrompt(request);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system", 
            content: `You are a healthcare software security expert specializing in ${request.analysisType} analysis. Provide detailed code analysis with specific recommendations for healthcare applications.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return this.enhanceAnalysisWithCompliance(result, request);
    } catch (error) {
      console.error("AI analysis error:", error);
      return this.getFallbackAnalysis(request);
    }
  }

  async reviewArchitecture(request: ArchitectureReviewRequest): Promise<{
    overallScore: number;
    recommendations: Array<{
      category: string;
      priority: "high" | "medium" | "low";
      title: string;
      description: string;
      implementation?: string;
    }>;
    complianceGaps: string[];
    securityAssessment: {
      score: number;
      vulnerabilities: string[];
      mitigations: string[];
    };
    scalabilityAnalysis: {
      score: number;
      bottlenecks: string[];
      optimizations: string[];
    };
  }> {
    if (!process.env.OPENAI_API_KEY) {
      return this.getFallbackArchitectureReview(request);
    }

    try {
      const prompt = this.buildArchitecturePrompt(request);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a senior healthcare software architect with expertise in HIPAA-compliant system design, scalable healthcare infrastructure, and medical software architecture patterns."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("AI architecture review error:", error);
      return this.getFallbackArchitectureReview(request);
    }
  }

  private buildCodeCompletionPrompt(request: CodeCompletionRequest): string {
    return `
Analyze this healthcare application code and provide intelligent completions:

File: ${request.filePath}
Language: ${request.language}
Context: ${JSON.stringify(request.context)}

Code:
${request.code}

Cursor position: Line ${request.cursor.line}, Column ${request.cursor.column}

Please provide:
1. Smart code completions based on context
2. Healthcare-specific suggestions (FHIR, HL7, PHI handling)
3. HIPAA compliance recommendations
4. Security best practices for medical data

Respond in JSON format:
{
  "suggestions": [
    {
      "text": "completion code",
      "type": "completion|snippet|refactor", 
      "confidence": 95,
      "explanation": "Why this suggestion",
      "isHealthcareSpecific": true
    }
  ],
  "analysis": {
    "healthcareRelevance": 85,
    "complianceIssues": ["issue1", "issue2"],
    "suggestions": ["suggestion1", "suggestion2"]
  }
}
`;
  }

  private buildAnalysisPrompt(request: CodeAnalysisRequest): string {
    const analysisRules = {
      hipaa: this.hipaaCompliantPatterns,
      security: ["SQL injection prevention", "XSS protection", "CSRF tokens", "Input validation"],
      performance: ["Database optimization", "Caching strategies", "Memory management"],
      quality: ["Code maintainability", "Testing coverage", "Documentation"],
      accessibility: ["ARIA labels", "Keyboard navigation", "Screen reader support"]
    };

    return `
Perform ${request.analysisType} analysis on this healthcare application code:

File: ${request.filePath}
Analysis Type: ${request.analysisType}

Rules to check:
${JSON.stringify(analysisRules[request.analysisType] || [])}

Code:
${request.code}

Provide detailed analysis in JSON format:
{
  "score": 85,
  "findings": [
    {
      "type": "error|warning|info|suggestion",
      "message": "Detailed finding description",
      "line": 42,
      "column": 10,
      "severity": "high|medium|low",
      "category": "security|compliance|performance|quality",
      "fix": "Specific fix recommendation"
    }
  ],
  "recommendations": ["recommendation1", "recommendation2"],
  "complianceStatus": {
    "hipaa": 90,
    "accessibility": 85,
    "security": 95
  }
}
`;
  }

  private buildArchitecturePrompt(request: ArchitectureReviewRequest): string {
    return `
Review this healthcare application architecture for ${request.complianceLevel} compliance:

Project Structure:
${JSON.stringify(request.projectStructure, null, 2)}

Requirements:
${request.requirements.join('\n')}

Compliance Level: ${request.complianceLevel}

Provide comprehensive architecture review in JSON format:
{
  "overallScore": 85,
  "recommendations": [
    {
      "category": "security|performance|compliance|scalability",
      "priority": "high|medium|low",
      "title": "Recommendation title",
      "description": "Detailed description",
      "implementation": "How to implement"
    }
  ],
  "complianceGaps": ["gap1", "gap2"],
  "securityAssessment": {
    "score": 90,
    "vulnerabilities": ["vuln1", "vuln2"],
    "mitigations": ["mitigation1", "mitigation2"]
  },
  "scalabilityAnalysis": {
    "score": 85,
    "bottlenecks": ["bottleneck1", "bottleneck2"],
    "optimizations": ["optimization1", "optimization2"]
  }
}
`;
  }

  private getFallbackCompletion(request: CodeCompletionRequest) {
    return {
      suggestions: [
        {
          text: "// AI completion requires OpenAI API key",
          type: "completion" as const,
          confidence: 50,
          explanation: "Please configure OpenAI API key for intelligent completions"
        }
      ],
      analysis: {
        healthcareRelevance: 0,
        complianceIssues: ["API key not configured"],
        suggestions: ["Configure OpenAI API key for AI assistance"]
      }
    };
  }

  private getFallbackAnalysis(request: CodeAnalysisRequest) {
    return {
      score: 60,
      findings: [
        {
          type: "info" as const,
          message: "AI analysis requires OpenAI API key configuration",
          severity: "low" as const,
          category: "configuration"
        }
      ],
      recommendations: ["Configure OpenAI API key for detailed analysis"],
      complianceStatus: {
        hipaa: 50,
        accessibility: 50,
        security: 50
      }
    };
  }

  private getFallbackArchitectureReview(request: ArchitectureReviewRequest) {
    return {
      overallScore: 60,
      recommendations: [
        {
          category: "configuration",
          priority: "medium" as const,
          title: "Configure AI Analysis",
          description: "Set up OpenAI API key for comprehensive architecture review",
          implementation: "Add OPENAI_API_KEY to environment variables"
        }
      ],
      complianceGaps: ["AI analysis not available"],
      securityAssessment: {
        score: 50,
        vulnerabilities: ["Configuration incomplete"],
        mitigations: ["Configure AI service"]
      },
      scalabilityAnalysis: {
        score: 50,
        bottlenecks: ["Analysis not available"],
        optimizations: ["Configure AI service"]
      }
    };
  }

  private enhanceWithHealthcareContext(result: any, request: CodeCompletionRequest) {
    // Add healthcare-specific enhancements
    if (request.context?.isHealthcare) {
      result.suggestions?.forEach((suggestion: any) => {
        if (this.containsHealthcareKeywords(suggestion.text)) {
          suggestion.isHealthcareSpecific = true;
          suggestion.confidence = Math.min(100, suggestion.confidence + 10);
        }
      });
    }
    return result;
  }

  private enhanceAnalysisWithCompliance(result: any, request: CodeAnalysisRequest) {
    // Add compliance-specific enhancements
    if (request.analysisType === "hipaa") {
      result.complianceStatus = result.complianceStatus || {};
      result.complianceStatus.hipaa = result.score;
    }
    return result;
  }

  private containsHealthcareKeywords(text: string): boolean {
    const keywords = ["fhir", "hl7", "phi", "hipaa", "patient", "medical", "health", "clinical"];
    return keywords.some(keyword => text.toLowerCase().includes(keyword));
  }

  calculateCodeHash(code: string): string {
    return crypto.createHash('sha256').update(code).digest('hex');
  }
}

export const aiService = new AIService();