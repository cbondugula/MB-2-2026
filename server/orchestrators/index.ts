import type { IStorage } from '../storage';
import { createAIOrchestrator, AIOrchestrator } from './ai-orchestrator';
import { createComplianceOrchestrator, ComplianceOrchestrator } from './compliance-orchestrator';
import { createInnovationOrchestrator, InnovationOrchestrator } from './innovation-orchestrator';
import { createAnalyticsOrchestrator, AnalyticsOrchestrator } from './analytics-orchestrator';
import { createSupportOrchestrator, SupportOrchestrator } from './support-orchestrator';
import { createDeveloperToolsOrchestrator, DeveloperToolsOrchestrator } from './developer-tools-orchestrator';
import { createVoiceOrchestrator, VoiceOrchestrator } from './voice-orchestrator';

export interface Orchestrators {
  ai: AIOrchestrator;
  compliance: ComplianceOrchestrator;
  innovation: InnovationOrchestrator;
  analytics: AnalyticsOrchestrator;
  support: SupportOrchestrator;
  developerTools: DeveloperToolsOrchestrator;
  voice: VoiceOrchestrator;
}

export function createOrchestrators(storage: IStorage): Orchestrators {
  return {
    ai: createAIOrchestrator(storage),
    compliance: createComplianceOrchestrator(storage),
    innovation: createInnovationOrchestrator(storage),
    analytics: createAnalyticsOrchestrator(storage),
    support: createSupportOrchestrator(storage),
    developerTools: createDeveloperToolsOrchestrator(storage),
    voice: createVoiceOrchestrator(storage)
  };
}

export * from './ai-orchestrator';
export * from './compliance-orchestrator';
export * from './innovation-orchestrator';
export * from './analytics-orchestrator';
export * from './support-orchestrator';
export * from './developer-tools-orchestrator';
export * from './voice-orchestrator';
