// Swarms Agentic Framework Service for Healthcare AI
// Multi-agent coordination and swarm intelligence for complex healthcare tasks

export interface HealthcareAgent {
  id: string;
  name: string;
  type: 'diagnostic' | 'treatment' | 'monitoring' | 'research' | 'administrative' | 'emergency' | 'specialist';
  specialty: string[];
  capabilities: string[];
  model: string;
  status: 'active' | 'busy' | 'offline' | 'error';
  currentTask?: string;
  performance: {
    tasksCompleted: number;
    accuracy: number;
    averageResponseTime: number;
    patientSafetyScore: number;
  };
  metadata: {
    version: string;
    lastUpdated: Date;
    complianceLevel: string[];
    medicalLicense?: string;
  };
}

export interface SwarmTask {
  id: string;
  type: 'diagnosis' | 'treatment-planning' | 'patient-monitoring' | 'research-analysis' | 'emergency-response';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  patientContext?: any;
  requiredSpecialties: string[];
  assignedAgents: string[];
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'escalated';
  results?: any;
  consensus?: {
    agreement: number;
    confidence: number;
    recommendations: string[];
  };
  timeline: {
    created: Date;
    started?: Date;
    completed?: Date;
    deadline?: Date;
  };
}

export interface SwarmCoordinationPlan {
  taskId: string;
  coordinationType: 'collaborative' | 'competitive' | 'hierarchical' | 'consensus' | 'emergency';
  agentRoles: { [agentId: string]: string };
  communicationProtocol: string;
  decisionMaking: 'majority-vote' | 'weighted-consensus' | 'expert-override' | 'ai-arbitration';
  qualityAssurance: string[];
}

export class SwarmsService {
  private agents: Map<string, HealthcareAgent> = new Map();
  private activeTasks: Map<string, SwarmTask> = new Map();
  private coordinationPlans: Map<string, SwarmCoordinationPlan> = new Map();
  private communicationChannels: Map<string, any[]> = new Map();

  constructor() {
    this.initializeHealthcareAgents();
  }

  private initializeHealthcareAgents() {
    const healthcareAgents: HealthcareAgent[] = [
      {
        id: 'diagnostic-ai-primary',
        name: 'Primary Diagnostic AI',
        type: 'diagnostic',
        specialty: ['Internal Medicine', 'Family Medicine'],
        capabilities: ['symptom-analysis', 'differential-diagnosis', 'risk-assessment', 'triage'],
        model: 'med-gemma-diagnostic-v2',
        status: 'active',
        performance: {
          tasksCompleted: 1500,
          accuracy: 0.92,
          averageResponseTime: 2.3,
          patientSafetyScore: 0.98
        },
        metadata: {
          version: '2.1.0',
          lastUpdated: new Date(),
          complianceLevel: ['HIPAA', 'FDA AI/ML Guidance'],
          medicalLicense: 'AI-DIAG-001'
        }
      },
      {
        id: 'cardiologist-ai',
        name: 'Cardiology Specialist AI',
        type: 'specialist',
        specialty: ['Cardiology'],
        capabilities: ['ecg-analysis', 'cardiac-imaging', 'risk-stratification', 'intervention-planning'],
        model: 'clinical-bert-cardio',
        status: 'active',
        performance: {
          tasksCompleted: 800,
          accuracy: 0.94,
          averageResponseTime: 3.1,
          patientSafetyScore: 0.99
        },
        metadata: {
          version: '1.5.0',
          lastUpdated: new Date(),
          complianceLevel: ['HIPAA', 'ACC Guidelines'],
          medicalLicense: 'AI-CARD-001'
        }
      },
      {
        id: 'emergency-ai',
        name: 'Emergency Medicine AI',
        type: 'emergency',
        specialty: ['Emergency Medicine', 'Critical Care'],
        capabilities: ['rapid-triage', 'critical-diagnosis', 'protocol-guidance', 'resource-allocation'],
        model: 'emergency-llama-v3',
        status: 'active',
        performance: {
          tasksCompleted: 2200,
          accuracy: 0.89,
          averageResponseTime: 1.8,
          patientSafetyScore: 0.97
        },
        metadata: {
          version: '3.0.0',
          lastUpdated: new Date(),
          complianceLevel: ['HIPAA', 'ACEP Guidelines'],
          medicalLicense: 'AI-EMRG-001'
        }
      },
      {
        id: 'radiologist-ai',
        name: 'Radiology AI Interpreter',
        type: 'diagnostic',
        specialty: ['Radiology', 'Medical Imaging'],
        capabilities: ['image-analysis', 'abnormality-detection', 'report-generation', 'comparison-studies'],
        model: 'radiology-vision-transformer',
        status: 'active',
        performance: {
          tasksCompleted: 5000,
          accuracy: 0.96,
          averageResponseTime: 1.2,
          patientSafetyScore: 0.98
        },
        metadata: {
          version: '2.3.0',
          lastUpdated: new Date(),
          complianceLevel: ['HIPAA', 'ACR Guidelines', 'DICOM'],
          medicalLicense: 'AI-RAD-001'
        }
      },
      {
        id: 'pharmacist-ai',
        name: 'Clinical Pharmacist AI',
        type: 'treatment',
        specialty: ['Clinical Pharmacy'],
        capabilities: ['drug-interaction-check', 'dosage-optimization', 'allergy-screening', 'formulary-guidance'],
        model: 'pharmacy-bert-v2',
        status: 'active',
        performance: {
          tasksCompleted: 3200,
          accuracy: 0.97,
          averageResponseTime: 0.8,
          patientSafetyScore: 0.99
        },
        metadata: {
          version: '1.8.0',
          lastUpdated: new Date(),
          complianceLevel: ['HIPAA', 'ASHP Guidelines'],
          medicalLicense: 'AI-PHARM-001'
        }
      },
      {
        id: 'nursing-ai',
        name: 'Clinical Nursing AI',
        type: 'monitoring',
        specialty: ['Nursing', 'Patient Care'],
        capabilities: ['patient-monitoring', 'care-planning', 'medication-administration', 'patient-education'],
        model: 'nursing-care-llm',
        status: 'active',
        performance: {
          tasksCompleted: 4500,
          accuracy: 0.91,
          averageResponseTime: 2.1,
          patientSafetyScore: 0.98
        },
        metadata: {
          version: '1.4.0',
          lastUpdated: new Date(),
          complianceLevel: ['HIPAA', 'ANA Standards'],
          medicalLicense: 'AI-NURS-001'
        }
      },
      {
        id: 'research-ai',
        name: 'Medical Research AI',
        type: 'research',
        specialty: ['Research', 'Evidence-Based Medicine'],
        capabilities: ['literature-analysis', 'clinical-trial-design', 'data-mining', 'hypothesis-generation'],
        model: 'research-gpt-medical',
        status: 'active',
        performance: {
          tasksCompleted: 1200,
          accuracy: 0.88,
          averageResponseTime: 5.2,
          patientSafetyScore: 0.95
        },
        metadata: {
          version: '1.2.0',
          lastUpdated: new Date(),
          complianceLevel: ['HIPAA', 'NIH Guidelines'],
          medicalLicense: 'AI-RES-001'
        }
      }
    ];

    healthcareAgents.forEach(agent => {
      this.agents.set(agent.id, agent);
    });
  }

  // Create a new swarm task
  async createSwarmTask(
    type: string,
    description: string,
    priority: string,
    requiredSpecialties: string[],
    patientContext?: any,
    deadline?: Date
  ): Promise<string> {
    const taskId = this.generateTaskId();
    
    const task: SwarmTask = {
      id: taskId,
      type: type as any,
      priority: priority as any,
      description,
      patientContext,
      requiredSpecialties,
      assignedAgents: [],
      status: 'pending',
      timeline: {
        created: new Date(),
        deadline
      }
    };

    // Assign appropriate agents
    const assignedAgents = this.assignAgentsToTask(task);
    task.assignedAgents = assignedAgents;

    // Create coordination plan
    const coordinationPlan = this.createCoordinationPlan(task);
    this.coordinationPlans.set(taskId, coordinationPlan);

    this.activeTasks.set(taskId, task);
    
    // Start task execution
    this.executeSwarmTask(taskId);
    
    return taskId;
  }

  // Assign agents to task based on specialties and availability
  private assignAgentsToTask(task: SwarmTask): string[] {
    const availableAgents = Array.from(this.agents.values()).filter(agent => 
      agent.status === 'active' && 
      agent.specialty.some(spec => task.requiredSpecialties.includes(spec))
    );

    // Sort by performance and relevance
    availableAgents.sort((a, b) => {
      const aRelevance = a.specialty.filter(spec => task.requiredSpecialties.includes(spec)).length;
      const bRelevance = b.specialty.filter(spec => task.requiredSpecialties.includes(spec)).length;
      
      if (aRelevance !== bRelevance) return bRelevance - aRelevance;
      return b.performance.accuracy - a.performance.accuracy;
    });

    // Select top agents based on task priority
    const maxAgents = task.priority === 'critical' ? 5 : task.priority === 'high' ? 3 : 2;
    return availableAgents.slice(0, maxAgents).map(agent => agent.id);
  }

  // Create coordination plan for the task
  private createCoordinationPlan(task: SwarmTask): SwarmCoordinationPlan {
    let coordinationType: 'collaborative' | 'competitive' | 'hierarchical' | 'consensus' | 'emergency';
    let decisionMaking: 'majority-vote' | 'weighted-consensus' | 'expert-override' | 'ai-arbitration';

    switch (task.type) {
      case 'emergency-response':
        coordinationType = 'emergency';
        decisionMaking = 'expert-override';
        break;
      case 'diagnosis':
        coordinationType = 'consensus';
        decisionMaking = 'weighted-consensus';
        break;
      case 'treatment-planning':
        coordinationType = 'collaborative';
        decisionMaking = 'majority-vote';
        break;
      default:
        coordinationType = 'collaborative';
        decisionMaking = 'weighted-consensus';
    }

    const agentRoles: { [agentId: string]: string } = {};
    task.assignedAgents.forEach((agentId, index) => {
      const agent = this.agents.get(agentId)!;
      if (index === 0) {
        agentRoles[agentId] = 'lead';
      } else if (agent.type === 'specialist') {
        agentRoles[agentId] = 'specialist-consultant';
      } else {
        agentRoles[agentId] = 'collaborator';
      }
    });

    return {
      taskId: task.id,
      coordinationType,
      agentRoles,
      communicationProtocol: 'structured-dialogue',
      decisionMaking,
      qualityAssurance: ['peer-review', 'safety-check', 'evidence-validation']
    };
  }

  // Execute swarm task
  private async executeSwarmTask(taskId: string): Promise<void> {
    const task = this.activeTasks.get(taskId);
    const coordinationPlan = this.coordinationPlans.get(taskId);
    
    if (!task || !coordinationPlan) {
      console.error('Task or coordination plan not found');
      return;
    }

    try {
      task.status = 'in-progress';
      task.timeline.started = new Date();

      // Update agent status
      task.assignedAgents.forEach(agentId => {
        const agent = this.agents.get(agentId);
        if (agent) {
          agent.status = 'busy';
          agent.currentTask = taskId;
        }
      });

      // Simulate swarm execution based on coordination type
      const results = await this.simulateSwarmExecution(task, coordinationPlan);
      
      // Generate consensus
      const consensus = this.generateConsensus(task, results);
      
      task.results = results;
      task.consensus = consensus;
      task.status = 'completed';
      task.timeline.completed = new Date();

      // Update agent performance and status
      this.updateAgentPerformance(task);

      console.log(`Swarm task ${taskId} completed successfully`);
    } catch (error) {
      task.status = 'failed';
      console.error(`Swarm task ${taskId} failed:`, error);
      
      // Reset agent status
      task.assignedAgents.forEach(agentId => {
        const agent = this.agents.get(agentId);
        if (agent) {
          agent.status = 'active';
          agent.currentTask = undefined;
        }
      });
    }
  }

  // Simulate swarm execution
  private async simulateSwarmExecution(task: SwarmTask, plan: SwarmCoordinationPlan): Promise<any> {
    const agentResults: { [agentId: string]: any } = {};

    // Each agent processes the task based on their specialty
    for (const agentId of task.assignedAgents) {
      const agent = this.agents.get(agentId)!;
      const role = plan.agentRoles[agentId];

      // Simulate agent analysis
      agentResults[agentId] = await this.simulateAgentAnalysis(agent, task, role);
      
      // Add communication delay
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return agentResults;
  }

  // Simulate individual agent analysis
  private async simulateAgentAnalysis(agent: HealthcareAgent, task: SwarmTask, role: string): Promise<any> {
    const baseResult = {
      agentId: agent.id,
      specialty: agent.specialty,
      role,
      timestamp: new Date(),
      confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
      processingTime: Math.random() * 3 + 1 // 1-4 seconds
    };

    switch (task.type) {
      case 'diagnosis':
        return {
          ...baseResult,
          differentialDiagnosis: this.generateDifferentialDiagnosis(agent, task),
          recommendedTests: this.generateTestRecommendations(agent, task),
          urgencyLevel: this.assessUrgency(agent, task),
          riskFactors: this.identifyRiskFactors(agent, task)
        };
      
      case 'treatment-planning':
        return {
          ...baseResult,
          treatmentOptions: this.generateTreatmentOptions(agent, task),
          medicationRecommendations: this.generateMedicationRecommendations(agent, task),
          monitoringPlan: this.generateMonitoringPlan(agent, task),
          patientEducation: this.generatePatientEducation(agent, task)
        };
      
      case 'emergency-response':
        return {
          ...baseResult,
          triageLevel: this.assessTriageLevel(agent, task),
          immediateActions: this.generateImmediateActions(agent, task),
          resourceRequirements: this.assessResourceRequirements(agent, task),
          protocols: this.identifyProtocols(agent, task)
        };
      
      default:
        return {
          ...baseResult,
          analysis: `Analysis from ${agent.name} for ${task.type}`,
          recommendations: ['General recommendation based on specialty']
        };
    }
  }

  // Generate consensus from agent results
  private generateConsensus(task: SwarmTask, agentResults: any): any {
    const results = Object.values(agentResults) as any[];
    const averageConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
    
    // Calculate agreement based on overlap in recommendations
    const agreement = this.calculateAgreement(results);
    
    const consensus = {
      agreement,
      confidence: averageConfidence,
      recommendations: this.synthesizeRecommendations(results),
      minorityOpinions: this.identifyMinorityOpinions(results),
      qualityScore: this.calculateQualityScore(results),
      safetyAssessment: this.performSafetyAssessment(results)
    };

    return consensus;
  }

  private calculateAgreement(results: any[]): number {
    // Simplified agreement calculation
    // In practice, this would use more sophisticated NLP to compare recommendations
    if (results.length <= 1) return 1.0;
    
    let totalAgreement = 0;
    let comparisons = 0;
    
    for (let i = 0; i < results.length; i++) {
      for (let j = i + 1; j < results.length; j++) {
        // Simulate agreement calculation
        const agreement = Math.random() * 0.4 + 0.6; // 0.6-1.0
        totalAgreement += agreement;
        comparisons++;
      }
    }
    
    return comparisons > 0 ? totalAgreement / comparisons : 1.0;
  }

  private synthesizeRecommendations(results: any[]): string[] {
    const allRecommendations = results.flatMap(r => r.recommendedTests || r.treatmentOptions || r.immediateActions || []);
    
    // Group similar recommendations and rank by frequency and confidence
    const recommendationMap = new Map<string, { count: number; confidence: number }>();
    
    allRecommendations.forEach(rec => {
      const existing = recommendationMap.get(rec) || { count: 0, confidence: 0 };
      existing.count++;
      existing.confidence = Math.max(existing.confidence, Math.random() * 0.3 + 0.7);
      recommendationMap.set(rec, existing);
    });
    
    return Array.from(recommendationMap.entries())
      .sort((a, b) => b[1].count - a[1].count || b[1].confidence - a[1].confidence)
      .slice(0, 5)
      .map(([rec]) => rec);
  }

  private identifyMinorityOpinions(results: any[]): string[] {
    // Identify unique or less common recommendations
    const allRecommendations = results.flatMap(r => r.recommendedTests || r.treatmentOptions || r.immediateActions || []);
    const recommendationCounts = new Map<string, number>();
    
    allRecommendations.forEach(rec => {
      recommendationCounts.set(rec, (recommendationCounts.get(rec) || 0) + 1);
    });
    
    return Array.from(recommendationCounts.entries())
      .filter(([, count]) => count === 1)
      .map(([rec]) => rec);
  }

  private calculateQualityScore(results: any[]): number {
    const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
    const avgProcessingTime = results.reduce((sum, r) => sum + r.processingTime, 0) / results.length;
    
    // Quality score based on confidence and processing efficiency
    const timeScore = Math.max(0, 1 - (avgProcessingTime - 2) / 10); // Optimal around 2 seconds
    return (avgConfidence * 0.7) + (timeScore * 0.3);
  }

  private performSafetyAssessment(results: any[]): string {
    const safetyScores = results.map(r => r.confidence * Math.random()); // Simulate safety scoring
    const avgSafetyScore = safetyScores.reduce((sum, score) => sum + score, 0) / safetyScores.length;
    
    if (avgSafetyScore > 0.9) return 'HIGH_SAFETY';
    if (avgSafetyScore > 0.7) return 'MODERATE_SAFETY';
    if (avgSafetyScore > 0.5) return 'LOW_SAFETY';
    return 'SAFETY_CONCERN';
  }

  // Helper methods for generating agent-specific results
  private generateDifferentialDiagnosis(agent: HealthcareAgent, task: SwarmTask): string[] {
    const diagnoses = ['Acute coronary syndrome', 'Pneumonia', 'Pulmonary embolism', 'Gastroesophageal reflux'];
    return diagnoses.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private generateTestRecommendations(agent: HealthcareAgent, task: SwarmTask): string[] {
    const tests = ['ECG', 'Chest X-ray', 'CBC', 'BMP', 'Troponin', 'D-dimer', 'ABG'];
    return tests.slice(0, Math.floor(Math.random() * 4) + 2);
  }

  private assessUrgency(agent: HealthcareAgent, task: SwarmTask): string {
    const levels = ['low', 'medium', 'high', 'critical'];
    return levels[Math.floor(Math.random() * levels.length)];
  }

  private identifyRiskFactors(agent: HealthcareAgent, task: SwarmTask): string[] {
    const factors = ['Hypertension', 'Diabetes', 'Smoking', 'Family history', 'Obesity'];
    return factors.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private generateTreatmentOptions(agent: HealthcareAgent, task: SwarmTask): string[] {
    const treatments = ['Medication therapy', 'Surgical intervention', 'Physical therapy', 'Lifestyle modification'];
    return treatments.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private generateMedicationRecommendations(agent: HealthcareAgent, task: SwarmTask): string[] {
    const medications = ['Aspirin 81mg daily', 'Lisinopril 10mg daily', 'Metformin 500mg BID'];
    return medications.slice(0, Math.floor(Math.random() * 2) + 1);
  }

  private generateMonitoringPlan(agent: HealthcareAgent, task: SwarmTask): string[] {
    const monitoring = ['Daily vital signs', 'Weekly lab work', 'Monthly follow-up'];
    return monitoring.slice(0, Math.floor(Math.random() * 2) + 1);
  }

  private generatePatientEducation(agent: HealthcareAgent, task: SwarmTask): string[] {
    const education = ['Diet modification', 'Exercise program', 'Medication adherence', 'Warning signs'];
    return education.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private assessTriageLevel(agent: HealthcareAgent, task: SwarmTask): string {
    const levels = ['1-Immediate', '2-Emergent', '3-Urgent', '4-Less Urgent', '5-Non-Urgent'];
    return levels[Math.floor(Math.random() * levels.length)];
  }

  private generateImmediateActions(agent: HealthcareAgent, task: SwarmTask): string[] {
    const actions = ['Establish IV access', 'Obtain ECG', 'Administer oxygen', 'Pain management'];
    return actions.slice(0, Math.floor(Math.random() * 3) + 2);
  }

  private assessResourceRequirements(agent: HealthcareAgent, task: SwarmTask): string[] {
    const resources = ['ICU bed', 'Cardiac cath lab', 'Surgery suite', 'Specialist consultation'];
    return resources.slice(0, Math.floor(Math.random() * 2) + 1);
  }

  private identifyProtocols(agent: HealthcareAgent, task: SwarmTask): string[] {
    const protocols = ['ACLS protocol', 'Stroke protocol', 'Sepsis protocol', 'Trauma protocol'];
    return protocols.slice(0, Math.floor(Math.random() * 2) + 1);
  }

  // Update agent performance metrics
  private updateAgentPerformance(task: SwarmTask): void {
    task.assignedAgents.forEach(agentId => {
      const agent = this.agents.get(agentId);
      if (agent) {
        agent.performance.tasksCompleted++;
        agent.status = 'active';
        agent.currentTask = undefined;
        
        // Update accuracy based on task success
        if (task.status === 'completed') {
          agent.performance.accuracy = (agent.performance.accuracy * 0.95) + (0.05 * 0.95);
        } else {
          agent.performance.accuracy = (agent.performance.accuracy * 0.95) + (0.05 * 0.75);
        }
        
        // Update average response time
        const taskDuration = task.timeline.completed 
          ? (task.timeline.completed.getTime() - task.timeline.started!.getTime()) / 1000
          : 0;
        agent.performance.averageResponseTime = (agent.performance.averageResponseTime * 0.9) + (taskDuration * 0.1);
      }
    });
  }

  // Public API methods

  getAvailableAgents(): HealthcareAgent[] {
    return Array.from(this.agents.values());
  }

  getAgentsBySpecialty(specialty: string): HealthcareAgent[] {
    return Array.from(this.agents.values()).filter(agent => 
      agent.specialty.includes(specialty)
    );
  }

  getTaskStatus(taskId: string): SwarmTask | undefined {
    return this.activeTasks.get(taskId);
  }

  getActiveTasks(): SwarmTask[] {
    return Array.from(this.activeTasks.values()).filter(task => 
      task.status === 'in-progress' || task.status === 'pending'
    );
  }

  getTaskHistory(limit: number = 50): SwarmTask[] {
    return Array.from(this.activeTasks.values())
      .sort((a, b) => b.timeline.created.getTime() - a.timeline.created.getTime())
      .slice(0, limit);
  }

  getSwarmMetrics(): any {
    const agents = Array.from(this.agents.values());
    const tasks = Array.from(this.activeTasks.values());
    
    return {
      totalAgents: agents.length,
      activeAgents: agents.filter(a => a.status === 'active').length,
      busyAgents: agents.filter(a => a.status === 'busy').length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      failedTasks: tasks.filter(t => t.status === 'failed').length,
      averageTaskCompletionTime: this.calculateAverageCompletionTime(tasks),
      averageAccuracy: agents.reduce((sum, a) => sum + a.performance.accuracy, 0) / agents.length,
      averagePatientSafetyScore: agents.reduce((sum, a) => sum + a.performance.patientSafetyScore, 0) / agents.length
    };
  }

  private calculateAverageCompletionTime(tasks: SwarmTask[]): number {
    const completedTasks = tasks.filter(t => t.status === 'completed' && t.timeline.completed && t.timeline.started);
    if (completedTasks.length === 0) return 0;
    
    const totalTime = completedTasks.reduce((sum, task) => {
      return sum + (task.timeline.completed!.getTime() - task.timeline.started!.getTime());
    }, 0);
    
    return totalTime / completedTasks.length / 1000; // Convert to seconds
  }

  private generateTaskId(): string {
    return `swarm_task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Cancel task
  async cancelTask(taskId: string): Promise<boolean> {
    const task = this.activeTasks.get(taskId);
    if (!task || task.status === 'completed' || task.status === 'failed') {
      return false;
    }

    task.status = 'failed';
    task.timeline.completed = new Date();

    // Reset agent status
    task.assignedAgents.forEach(agentId => {
      const agent = this.agents.get(agentId);
      if (agent) {
        agent.status = 'active';
        agent.currentTask = undefined;
      }
    });

    return true;
  }

  // Get agent performance
  getAgentPerformance(agentId: string): any {
    const agent = this.agents.get(agentId);
    if (!agent) return null;

    const agentTasks = Array.from(this.activeTasks.values()).filter(task => 
      task.assignedAgents.includes(agentId)
    );

    return {
      agent: agent,
      taskHistory: agentTasks,
      recentPerformance: {
        last30Days: agentTasks.filter(task => 
          task.timeline.created > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length
      }
    };
  }
}

// Export singleton instance
export const swarmsService = new SwarmsService();