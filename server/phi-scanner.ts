import { InsertPhiScanResult } from "@shared/schema";

interface PhiFinding {
  file: string;
  line: number;
  column?: number;
  type: string;
  severity: "critical" | "warning" | "info";
  description: string;
  snippet?: string;
  suggestion: string;
  pattern?: string;
}

interface PhiPattern {
  name: string;
  category: string;
  count: number;
  examples: string[];
}

interface EgressRisk {
  endpoint: string;
  method: string;
  file: string;
  line: number;
  riskLevel: "high" | "medium" | "low";
  dataTypes: string[];
  suggestion: string;
}

interface ModelSafetyCheck {
  modelName: string;
  provider: string;
  safetyScore: number;
  checks: {
    name: string;
    passed: boolean;
    details: string;
  }[];
}

interface ScanResult {
  findings: PhiFinding[];
  phiPatterns: PhiPattern[];
  egressRisks: EgressRisk[];
  modelSafetyScore: number;
  modelSafetyChecks?: ModelSafetyCheck[];
  recommendations: string[];
}

const PHI_PATTERNS = {
  ssn: {
    regex: /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g,
    name: "Social Security Number",
    category: "identifier",
    severity: "critical" as const,
    description: "Potential SSN detected",
    suggestion: "Remove or encrypt SSN data. Use tokenization for storage.",
  },
  mrn: {
    regex: /\b(?:MRN|mrn|medical.?record.?number)[:\s#]*[A-Z0-9]{6,15}\b/gi,
    name: "Medical Record Number",
    category: "identifier",
    severity: "critical" as const,
    description: "Medical Record Number pattern detected",
    suggestion: "MRN should be encrypted at rest and in transit. Implement access logging.",
  },
  npi: {
    regex: /\b(?:NPI|npi)[:\s#]*\d{10}\b/gi,
    name: "National Provider Identifier",
    category: "identifier",
    severity: "warning" as const,
    description: "NPI number detected",
    suggestion: "NPI is quasi-public but should still be handled carefully in patient contexts.",
  },
  dea: {
    regex: /\b[A-Z]{2}\d{7}\b/g,
    name: "DEA Number",
    category: "identifier",
    severity: "critical" as const,
    description: "Potential DEA number detected",
    suggestion: "DEA numbers should never be hardcoded. Use secure credential management.",
  },
  phoneNumber: {
    regex: /\b(?:\+1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    name: "Phone Number",
    category: "contact",
    severity: "warning" as const,
    description: "Phone number detected - potential PHI if associated with patient",
    suggestion: "Ensure phone numbers are encrypted when stored with patient data.",
  },
  email: {
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    name: "Email Address",
    category: "contact",
    severity: "warning" as const,
    description: "Email address detected - potential PHI in healthcare context",
    suggestion: "Email addresses should be encrypted when associated with patient records.",
  },
  dateOfBirth: {
    regex: /\b(?:DOB|dob|date.?of.?birth|birth.?date)[:\s]*(?:\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\d{4}[-\/]\d{1,2}[-\/]\d{1,2})\b/gi,
    name: "Date of Birth",
    category: "demographic",
    severity: "critical" as const,
    description: "Date of birth pattern detected",
    suggestion: "DOB is a HIPAA identifier. Must be encrypted and access-logged.",
  },
  address: {
    regex: /\b\d+\s+[A-Za-z]+\s+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct)[\s,]+[A-Za-z]+[\s,]+[A-Z]{2}\s+\d{5}(?:-\d{4})?\b/gi,
    name: "Physical Address",
    category: "demographic",
    severity: "warning" as const,
    description: "Physical address pattern detected",
    suggestion: "Address data should be encrypted when associated with patient records.",
  },
  diagnosis: {
    regex: /\b(?:ICD[-\s]?10|diagnosis|dx)[:\s]*[A-Z]\d{2}(?:\.\d{1,4})?\b/gi,
    name: "ICD-10 Diagnosis Code",
    category: "clinical",
    severity: "critical" as const,
    description: "ICD-10 diagnosis code detected",
    suggestion: "Diagnosis codes are highly sensitive PHI. Implement strict access controls.",
  },
  cptCode: {
    regex: /\b(?:CPT|procedure)[:\s]*\d{5}\b/gi,
    name: "CPT Procedure Code",
    category: "clinical",
    severity: "warning" as const,
    description: "CPT procedure code detected",
    suggestion: "Procedure codes may indicate sensitive conditions. Handle appropriately.",
  },
  medication: {
    regex: /\b(?:RX|prescription|medication|drug)[:\s]*[A-Za-z]+\s+\d+\s*(?:mg|ml|mcg)\b/gi,
    name: "Medication Information",
    category: "clinical",
    severity: "warning" as const,
    description: "Medication prescription pattern detected",
    suggestion: "Medication data is PHI. Ensure proper encryption and access controls.",
  },
  labValue: {
    regex: /\b(?:glucose|hemoglobin|a1c|cholesterol|creatinine|potassium|sodium)[:\s]*\d+(?:\.\d+)?\s*(?:mg\/dL|mmol\/L|mEq\/L|g\/dL|%)\b/gi,
    name: "Lab Value",
    category: "clinical",
    severity: "warning" as const,
    description: "Lab value pattern detected",
    suggestion: "Lab results are clinical PHI. Implement appropriate safeguards.",
  },
  vitalSign: {
    regex: /\b(?:BP|blood.?pressure|heart.?rate|pulse|temp|temperature|respiration)[:\s]*\d+(?:\/\d+)?(?:\s*(?:mmHg|bpm|°F|°C))?\b/gi,
    name: "Vital Sign",
    category: "clinical",
    severity: "info" as const,
    description: "Vital sign measurement detected",
    suggestion: "Vital signs are clinical data. Ensure proper handling in patient context.",
  },
  insuranceId: {
    regex: /\b(?:insurance|member|subscriber|policy)[:\s#]*[A-Z0-9]{8,15}\b/gi,
    name: "Insurance ID",
    category: "financial",
    severity: "warning" as const,
    description: "Insurance/member ID pattern detected",
    suggestion: "Insurance IDs should be encrypted and access-controlled.",
  },
  creditCard: {
    regex: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g,
    name: "Credit Card Number",
    category: "financial",
    severity: "critical" as const,
    description: "Credit card number pattern detected",
    suggestion: "Never store raw credit card numbers. Use PCI-compliant tokenization.",
  },
};

const EGRESS_PATTERNS = {
  fetch: /\bfetch\s*\(\s*[`'"](https?:\/\/[^`'"]+)[`'"]/g,
  axios: /\baxios\s*\.\s*(?:get|post|put|patch|delete)\s*\(\s*[`'"](https?:\/\/[^`'"]+)[`'"]/g,
  xhr: /\bnew\s+XMLHttpRequest\s*\(\)/g,
  httpClient: /\bhttp\s*\.\s*(?:get|post|put|patch|delete)\s*\(\s*[`'"](https?:\/\/[^`'"]+)[`'"]/g,
  sendBeacon: /\bnavigator\.sendBeacon\s*\(\s*[`'"](https?:\/\/[^`'"]+)[`'"]/g,
  websocket: /\bnew\s+WebSocket\s*\(\s*[`'"](wss?:\/\/[^`'"]+)[`'"]/g,
};

const TRUSTED_DOMAINS = [
  "api.openai.com",
  "api.anthropic.com",
  "generativelanguage.googleapis.com",
  "api.stripe.com",
  "api.twilio.com",
  "*.fhir.org",
  "localhost",
  "127.0.0.1",
];

const AI_MODEL_SAFETY_CHECKS = [
  {
    name: "BAA Coverage",
    check: (code: string) => {
      const baaProviders = ["openai", "anthropic", "google", "azure"];
      const usedProviders = baaProviders.filter(p => 
        code.toLowerCase().includes(p)
      );
      return {
        passed: usedProviders.length === 0 || code.includes("BAA") || code.includes("HIPAA"),
        details: usedProviders.length > 0 
          ? `Detected AI providers: ${usedProviders.join(", ")}. Ensure BAA is in place.`
          : "No external AI providers detected.",
      };
    },
  },
  {
    name: "PHI in Prompts",
    check: (code: string) => {
      const promptPatterns = [
        /prompt.*patient/gi,
        /messages.*name.*ssn/gi,
        /content.*diagnosis/gi,
      ];
      const hasPhiInPrompts = promptPatterns.some(p => p.test(code));
      return {
        passed: !hasPhiInPrompts,
        details: hasPhiInPrompts
          ? "Detected potential PHI being sent to AI models. De-identify data before sending."
          : "No obvious PHI in AI prompts detected.",
      };
    },
  },
  {
    name: "Response Logging",
    check: (code: string) => {
      const loggingPatterns = [
        /console\.log.*response/gi,
        /logger.*ai.*response/gi,
        /fs\.write.*response/gi,
      ];
      const hasUnsafeLogging = loggingPatterns.some(p => p.test(code));
      return {
        passed: !hasUnsafeLogging,
        details: hasUnsafeLogging
          ? "AI responses may contain PHI. Ensure logging is compliant."
          : "No unsafe AI response logging detected.",
      };
    },
  },
  {
    name: "Model Context Limits",
    check: (code: string) => {
      const hasMaxTokens = /max_tokens|maxTokens|max_length/i.test(code);
      return {
        passed: hasMaxTokens,
        details: hasMaxTokens
          ? "Token limits configured for AI models."
          : "Consider setting max_tokens to limit response size and costs.",
      };
    },
  },
  {
    name: "Error Handling",
    check: (code: string) => {
      const hasTryCatch = /try\s*\{[\s\S]*?catch/g.test(code);
      const hasErrorHandler = /\.catch\s*\(/g.test(code);
      const passed = hasTryCatch || hasErrorHandler;
      return {
        passed,
        details: passed
          ? "Error handling present for AI calls."
          : "Add error handling for AI API calls to prevent PHI leakage in error messages.",
      };
    },
  },
];

function extractSnippet(content: string, match: RegExpExecArray, contextChars: number = 30): string {
  const start = Math.max(0, match.index - contextChars);
  const end = Math.min(content.length, match.index + match[0].length + contextChars);
  let snippet = content.substring(start, end);
  if (start > 0) snippet = "..." + snippet;
  if (end < content.length) snippet = snippet + "...";
  return snippet.replace(/\n/g, " ").trim();
}

function getLineNumber(content: string, index: number): number {
  return content.substring(0, index).split("\n").length;
}

function isTrustedDomain(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    return TRUSTED_DOMAINS.some(trusted => {
      if (trusted.startsWith("*.")) {
        return hostname.endsWith(trusted.substring(1));
      }
      return hostname === trusted;
    });
  } catch {
    return false;
  }
}

export function scanCodeForPhi(
  files: { path: string; content: string }[]
): ScanResult {
  const findings: PhiFinding[] = [];
  const patternCounts: Record<string, { count: number; examples: string[] }> = {};
  const egressRisks: EgressRisk[] = [];
  let allCode = "";

  for (const file of files) {
    allCode += file.content + "\n";

    for (const [patternKey, patternConfig] of Object.entries(PHI_PATTERNS)) {
      const regex = new RegExp(patternConfig.regex.source, patternConfig.regex.flags);
      let match;
      while ((match = regex.exec(file.content)) !== null) {
        const lineNumber = getLineNumber(file.content, match.index);
        
        if (!patternCounts[patternKey]) {
          patternCounts[patternKey] = { count: 0, examples: [] };
        }
        patternCounts[patternKey].count++;
        if (patternCounts[patternKey].examples.length < 3) {
          patternCounts[patternKey].examples.push(
            match[0].substring(0, 20) + (match[0].length > 20 ? "..." : "")
          );
        }

        findings.push({
          file: file.path,
          line: lineNumber,
          type: patternConfig.name,
          severity: patternConfig.severity,
          description: patternConfig.description,
          snippet: extractSnippet(file.content, match),
          suggestion: patternConfig.suggestion,
          pattern: patternKey,
        });
      }
    }

    for (const [name, regex] of Object.entries(EGRESS_PATTERNS)) {
      const egressRegex = new RegExp(regex.source, regex.flags);
      let match;
      while ((match = egressRegex.exec(file.content)) !== null) {
        const url = match[1] || "unknown";
        const isTrusted = isTrustedDomain(url);
        
        if (!isTrusted && url !== "unknown") {
          const lineNumber = getLineNumber(file.content, match.index);
          const surroundingCode = file.content.substring(
            Math.max(0, match.index - 100),
            Math.min(file.content.length, match.index + match[0].length + 100)
          );
          
          const potentialDataTypes: string[] = [];
          if (/patient|user|name/i.test(surroundingCode)) potentialDataTypes.push("patient_data");
          if (/ssn|social/i.test(surroundingCode)) potentialDataTypes.push("ssn");
          if (/diagnosis|icd|condition/i.test(surroundingCode)) potentialDataTypes.push("diagnosis");
          if (/medication|drug|rx/i.test(surroundingCode)) potentialDataTypes.push("medication");
          if (/lab|result|test/i.test(surroundingCode)) potentialDataTypes.push("lab_results");
          
          egressRisks.push({
            endpoint: url,
            method: name.includes("post") ? "POST" : "GET",
            file: file.path,
            line: lineNumber,
            riskLevel: potentialDataTypes.length > 2 ? "high" : potentialDataTypes.length > 0 ? "medium" : "low",
            dataTypes: potentialDataTypes.length > 0 ? potentialDataTypes : ["unknown"],
            suggestion: `Verify that ${url} has a BAA and is HIPAA compliant before sending PHI.`,
          });
        }
      }
    }
  }

  const modelSafetyChecks: ModelSafetyCheck = {
    modelName: "Project AI Integration",
    provider: "Various",
    safetyScore: 0,
    checks: AI_MODEL_SAFETY_CHECKS.map(check => ({
      name: check.name,
      ...check.check(allCode),
    })),
  };

  const passedChecks = modelSafetyChecks.checks.filter(c => c.passed).length;
  modelSafetyChecks.safetyScore = Math.round((passedChecks / modelSafetyChecks.checks.length) * 100);

  const phiPatterns: PhiPattern[] = Object.entries(patternCounts)
    .filter(([_, data]) => data.count > 0)
    .map(([key, data]) => ({
      name: PHI_PATTERNS[key as keyof typeof PHI_PATTERNS].name,
      category: PHI_PATTERNS[key as keyof typeof PHI_PATTERNS].category,
      count: data.count,
      examples: data.examples,
    }));

  const recommendations: string[] = [];
  
  if (findings.filter(f => f.severity === "critical").length > 0) {
    recommendations.push("URGENT: Critical PHI patterns detected. Review and remediate immediately.");
  }
  
  if (egressRisks.filter(r => r.riskLevel === "high").length > 0) {
    recommendations.push("High-risk external data transmissions detected. Verify BAA coverage.");
  }
  
  if (modelSafetyChecks.safetyScore < 80) {
    recommendations.push("AI model safety score is below threshold. Review AI integration practices.");
  }
  
  if (patternCounts.ssn?.count > 0) {
    recommendations.push("SSN data detected. Implement tokenization and remove from non-production code.");
  }
  
  if (patternCounts.creditCard?.count > 0) {
    recommendations.push("Credit card data detected. Use PCI-compliant payment processors only.");
  }
  
  if (findings.length === 0 && egressRisks.length === 0) {
    recommendations.push("No PHI patterns or egress risks detected. Continue to monitor.");
  }

  return {
    findings,
    phiPatterns,
    egressRisks,
    modelSafetyScore: modelSafetyChecks.safetyScore,
    modelSafetyChecks: [modelSafetyChecks],
    recommendations,
  };
}

export function performStaticAnalysis(
  projectCode: Record<string, string>
): Partial<InsertPhiScanResult> & { scanResult: ScanResult } {
  const startTime = Date.now();
  
  const files = Object.entries(projectCode).map(([path, content]) => ({
    path,
    content: typeof content === "string" ? content : JSON.stringify(content),
  }));
  
  const scanResult = scanCodeForPhi(files);
  
  const criticalIssues = scanResult.findings.filter(f => f.severity === "critical").length;
  const warningIssues = scanResult.findings.filter(f => f.severity === "warning").length;
  const infoIssues = scanResult.findings.filter(f => f.severity === "info").length;
  
  return {
    scanType: "static",
    status: "completed",
    totalFiles: files.length,
    filesScanned: files.length,
    issuesFound: scanResult.findings.length,
    criticalIssues,
    warningIssues,
    infoIssues,
    findings: scanResult.findings,
    phiPatterns: scanResult.phiPatterns,
    egressRisks: scanResult.egressRisks,
    modelSafetyScore: scanResult.modelSafetyScore,
    recommendations: scanResult.recommendations,
    scanDuration: Math.round((Date.now() - startTime) / 1000),
    completedAt: new Date(),
    scanResult,
  };
}

export function performEgressAnalysis(
  projectCode: Record<string, string>
): Partial<InsertPhiScanResult> & { scanResult: ScanResult } {
  const startTime = Date.now();
  
  const files = Object.entries(projectCode).map(([path, content]) => ({
    path,
    content: typeof content === "string" ? content : JSON.stringify(content),
  }));
  
  const scanResult = scanCodeForPhi(files);
  
  const highRiskEgress = scanResult.egressRisks.filter(r => r.riskLevel === "high");
  const mediumRiskEgress = scanResult.egressRisks.filter(r => r.riskLevel === "medium");
  
  return {
    scanType: "egress",
    status: "completed",
    totalFiles: files.length,
    filesScanned: files.length,
    issuesFound: scanResult.egressRisks.length,
    criticalIssues: highRiskEgress.length,
    warningIssues: mediumRiskEgress.length,
    infoIssues: scanResult.egressRisks.length - highRiskEgress.length - mediumRiskEgress.length,
    findings: scanResult.egressRisks.map(risk => ({
      file: risk.file,
      line: risk.line,
      type: "Egress Risk",
      severity: risk.riskLevel === "high" ? "critical" : risk.riskLevel === "medium" ? "warning" : "info",
      description: `Data egress to ${risk.endpoint}`,
      suggestion: risk.suggestion,
    })),
    egressRisks: scanResult.egressRisks,
    modelSafetyScore: scanResult.modelSafetyScore,
    recommendations: [
      ...scanResult.recommendations.filter(r => r.includes("egress") || r.includes("BAA")),
      `${scanResult.egressRisks.length} external endpoints detected. ${highRiskEgress.length} require immediate attention.`,
    ],
    scanDuration: Math.round((Date.now() - startTime) / 1000),
    completedAt: new Date(),
    scanResult,
  };
}

export function gradeModelSafety(
  projectCode: Record<string, string>
): { score: number; checks: { name: string; passed: boolean; details: string }[]; recommendations: string[] } {
  const allCode = Object.values(projectCode).join("\n");
  
  const checks = AI_MODEL_SAFETY_CHECKS.map(check => ({
    name: check.name,
    ...check.check(allCode),
  }));
  
  const passedChecks = checks.filter(c => c.passed).length;
  const score = Math.round((passedChecks / checks.length) * 100);
  
  const recommendations: string[] = [];
  checks.filter(c => !c.passed).forEach(check => {
    recommendations.push(`${check.name}: ${check.details}`);
  });
  
  if (score === 100) {
    recommendations.push("All AI safety checks passed. Continue to monitor.");
  }
  
  return { score, checks, recommendations };
}
