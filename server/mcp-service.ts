// MCP (Model Context Protocol) Service for Healthcare AI
// Enables standardized context sharing between AI models and healthcare systems

export interface MCPContext {
  id: string;
  type: 'medical-history' | 'clinical-notes' | 'lab-results' | 'imaging' | 'medications' | 'allergies';
  content: any;
  timestamp: Date;
  source: string;
  confidence: number;
  metadata: {
    patientId?: string;
    providerId?: string;
    encounterType?: string;
    specialty?: string;
    urgency?: 'low' | 'medium' | 'high' | 'critical';
    complianceLevel?: string[];
  };
}

export interface MCPMessage {
  id: string;
  type: 'context-request' | 'context-response' | 'context-update' | 'context-sync';
  sender: string;
  recipient: string;
  payload: MCPContext[];
  timestamp: Date;
  encryption: boolean;
  signature?: string;
}

export interface MCPProvider {
  id: string;
  name: string;
  type: 'ehr-system' | 'lab-system' | 'imaging-system' | 'pharmacy-system' | 'ai-model';
  endpoint: string;
  capabilities: string[];
  supportedContextTypes: string[];
  compliance: string[];
  version: string;
}

export class MCPService {
  private providers: Map<string, MCPProvider> = new Map();
  private contextCache: Map<string, MCPContext[]> = new Map();
  private messageQueue: MCPMessage[] = [];

  constructor() {
    this.initializeHealthcareProviders();
  }

  private initializeHealthcareProviders() {
    // Register healthcare system providers
    const healthcareProviders: MCPProvider[] = [
      {
        id: 'epic-ehr',
        name: 'Epic EHR System',
        type: 'ehr-system',
        endpoint: '/api/mcp/epic',
        capabilities: ['patient-data', 'clinical-notes', 'medication-list', 'allergy-list'],
        supportedContextTypes: ['medical-history', 'clinical-notes', 'medications', 'allergies'],
        compliance: ['HIPAA', 'FHIR R4', 'HL7'],
        version: '1.0'
      },
      {
        id: 'cerner-ehr',
        name: 'Cerner EHR System',
        type: 'ehr-system',
        endpoint: '/api/mcp/cerner',
        capabilities: ['patient-data', 'clinical-notes', 'medication-list', 'lab-results'],
        supportedContextTypes: ['medical-history', 'clinical-notes', 'medications', 'lab-results'],
        compliance: ['HIPAA', 'FHIR R4', 'HL7'],
        version: '1.0'
      },
      {
        id: 'lab-system',
        name: 'Laboratory Information System',
        type: 'lab-system',
        endpoint: '/api/mcp/lab',
        capabilities: ['lab-results', 'critical-values', 'trending'],
        supportedContextTypes: ['lab-results'],
        compliance: ['HIPAA', 'CLIA', 'HL7'],
        version: '1.0'
      },
      {
        id: 'pacs-imaging',
        name: 'PACS Imaging System',
        type: 'imaging-system',
        endpoint: '/api/mcp/pacs',
        capabilities: ['imaging-reports', 'dicom-data', 'comparative-studies'],
        supportedContextTypes: ['imaging'],
        compliance: ['HIPAA', 'DICOM', 'IHE'],
        version: '1.0'
      },
      {
        id: 'pharmacy-system',
        name: 'Pharmacy Management System',
        type: 'pharmacy-system',
        endpoint: '/api/mcp/pharmacy',
        capabilities: ['medication-history', 'drug-interactions', 'formulary-check'],
        supportedContextTypes: ['medications'],
        compliance: ['HIPAA', 'NCPDP'],
        version: '1.0'
      },
      {
        id: 'med-gemma-ai',
        name: 'Med-Gemma AI Model',
        type: 'ai-model',
        endpoint: '/api/mcp/med-gemma',
        capabilities: ['clinical-reasoning', 'diagnosis-support', 'treatment-recommendations'],
        supportedContextTypes: ['medical-history', 'clinical-notes', 'lab-results', 'imaging'],
        compliance: ['HIPAA', 'Medical AI Standards'],
        version: '1.0'
      },
      {
        id: 'clinical-bert',
        name: 'ClinicalBERT Model',
        type: 'ai-model',
        endpoint: '/api/mcp/clinical-bert',
        capabilities: ['text-analysis', 'entity-extraction', 'clinical-coding'],
        supportedContextTypes: ['clinical-notes'],
        compliance: ['HIPAA', 'Medical NLP Standards'],
        version: '1.0'
      }
    ];

    healthcareProviders.forEach(provider => {
      this.providers.set(provider.id, provider);
    });
  }

  // Register a new MCP provider
  registerProvider(provider: MCPProvider): void {
    this.providers.set(provider.id, provider);
  }

  // Get available providers
  getProviders(): MCPProvider[] {
    return Array.from(this.providers.values());
  }

  // Get providers by type
  getProvidersByType(type: string): MCPProvider[] {
    return Array.from(this.providers.values()).filter(p => p.type === type);
  }

  // Request context from provider
  async requestContext(
    providerId: string,
    contextTypes: string[],
    filters: any = {}
  ): Promise<MCPContext[]> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`);
    }

    // Check if provider supports requested context types
    const unsupported = contextTypes.filter(type => 
      !provider.supportedContextTypes.includes(type)
    );
    if (unsupported.length > 0) {
      throw new Error(`Provider ${providerId} does not support context types: ${unsupported.join(', ')}`);
    }

    const message: MCPMessage = {
      id: this.generateMessageId(),
      type: 'context-request',
      sender: 'mcp-service',
      recipient: providerId,
      payload: [],
      timestamp: new Date(),
      encryption: true
    };

    // Simulate context retrieval based on provider type
    const contexts = await this.simulateContextRetrieval(provider, contextTypes, filters);
    
    // Cache the contexts
    this.contextCache.set(`${providerId}-${contextTypes.join('-')}`, contexts);

    return contexts;
  }

  // Sync context between providers
  async syncContext(
    sourceProviderId: string,
    targetProviderId: string,
    contextTypes: string[]
  ): Promise<boolean> {
    try {
      const sourceContexts = await this.requestContext(sourceProviderId, contextTypes);
      const syncMessage: MCPMessage = {
        id: this.generateMessageId(),
        type: 'context-sync',
        sender: sourceProviderId,
        recipient: targetProviderId,
        payload: sourceContexts,
        timestamp: new Date(),
        encryption: true
      };

      // Process sync message
      await this.processMessage(syncMessage);
      return true;
    } catch (error) {
      console.error('Context sync failed:', error);
      return false;
    }
  }

  // Update context in provider
  async updateContext(
    providerId: string,
    contexts: MCPContext[]
  ): Promise<boolean> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`);
    }

    const message: MCPMessage = {
      id: this.generateMessageId(),
      type: 'context-update',
      sender: 'mcp-service',
      recipient: providerId,
      payload: contexts,
      timestamp: new Date(),
      encryption: true
    };

    return await this.processMessage(message);
  }

  // Process MCP message
  private async processMessage(message: MCPMessage): Promise<boolean> {
    try {
      this.messageQueue.push(message);
      
      // Route message based on type and recipient
      const provider = this.providers.get(message.recipient);
      if (!provider) {
        throw new Error(`Recipient provider ${message.recipient} not found`);
      }

      // Simulate message processing
      switch (message.type) {
        case 'context-request':
          // Handle context request
          break;
        case 'context-response':
          // Handle context response
          break;
        case 'context-update':
          // Handle context update
          break;
        case 'context-sync':
          // Handle context synchronization
          break;
      }

      return true;
    } catch (error) {
      console.error('Message processing failed:', error);
      return false;
    }
  }

  // Simulate context retrieval for different provider types
  private async simulateContextRetrieval(
    provider: MCPProvider,
    contextTypes: string[],
    filters: any
  ): Promise<MCPContext[]> {
    const contexts: MCPContext[] = [];

    for (const contextType of contextTypes) {
      switch (provider.type) {
        case 'ehr-system':
          contexts.push(...this.generateEHRContexts(contextType, filters));
          break;
        case 'lab-system':
          contexts.push(...this.generateLabContexts(contextType, filters));
          break;
        case 'imaging-system':
          contexts.push(...this.generateImagingContexts(contextType, filters));
          break;
        case 'pharmacy-system':
          contexts.push(...this.generatePharmacyContexts(contextType, filters));
          break;
        case 'ai-model':
          contexts.push(...this.generateAIModelContexts(contextType, filters));
          break;
      }
    }

    return contexts;
  }

  private generateEHRContexts(contextType: string, filters: any): MCPContext[] {
    const contexts: MCPContext[] = [];

    switch (contextType) {
      case 'medical-history':
        contexts.push({
          id: this.generateContextId(),
          type: 'medical-history',
          content: {
            conditions: ['Hypertension', 'Type 2 Diabetes', 'Hyperlipidemia'],
            surgeries: ['Appendectomy (2015)', 'Cholecystectomy (2020)'],
            familyHistory: ['Father: CAD', 'Mother: Breast Cancer']
          },
          timestamp: new Date(),
          source: 'epic-ehr',
          confidence: 0.95,
          metadata: {
            patientId: filters.patientId,
            complianceLevel: ['HIPAA', 'FHIR R4']
          }
        });
        break;
      case 'clinical-notes':
        contexts.push({
          id: this.generateContextId(),
          type: 'clinical-notes',
          content: {
            chiefComplaint: 'Chest pain and shortness of breath',
            assessment: 'Rule out acute coronary syndrome',
            plan: 'EKG, cardiac enzymes, chest X-ray'
          },
          timestamp: new Date(),
          source: 'epic-ehr',
          confidence: 0.90,
          metadata: {
            patientId: filters.patientId,
            encounterType: 'emergency',
            specialty: 'cardiology',
            urgency: 'high'
          }
        });
        break;
    }

    return contexts;
  }

  private generateLabContexts(contextType: string, filters: any): MCPContext[] {
    if (contextType !== 'lab-results') return [];

    return [{
      id: this.generateContextId(),
      type: 'lab-results',
      content: {
        tests: [
          { name: 'Troponin I', value: 0.05, units: 'ng/mL', reference: '<0.04', flag: 'H' },
          { name: 'CK-MB', value: 3.2, units: 'ng/mL', reference: '0.0-3.6', flag: 'N' },
          { name: 'BNP', value: 150, units: 'pg/mL', reference: '<100', flag: 'H' }
        ],
        collectionTime: new Date().toISOString(),
        resultTime: new Date().toISOString()
      },
      timestamp: new Date(),
      source: 'lab-system',
      confidence: 0.98,
      metadata: {
        patientId: filters.patientId,
        urgency: 'high',
        complianceLevel: ['HIPAA', 'CLIA']
      }
    }];
  }

  private generateImagingContexts(contextType: string, filters: any): MCPContext[] {
    if (contextType !== 'imaging') return [];

    return [{
      id: this.generateContextId(),
      type: 'imaging',
      content: {
        studyType: 'Chest CT with contrast',
        findings: 'No acute pulmonary embolism. Mild coronary calcifications.',
        impression: 'Negative for PE. Atherosclerotic disease present.',
        radiologist: 'Dr. Radiologist'
      },
      timestamp: new Date(),
      source: 'pacs-imaging',
      confidence: 0.92,
      metadata: {
        patientId: filters.patientId,
        complianceLevel: ['HIPAA', 'DICOM']
      }
    }];
  }

  private generatePharmacyContexts(contextType: string, filters: any): MCPContext[] {
    if (contextType !== 'medications') return [];

    return [{
      id: this.generateContextId(),
      type: 'medications',
      content: {
        currentMedications: [
          { name: 'Lisinopril', dose: '10mg', frequency: 'daily', indication: 'hypertension' },
          { name: 'Metformin', dose: '500mg', frequency: 'twice daily', indication: 'diabetes' }
        ],
        allergies: ['Penicillin', 'Sulfa drugs'],
        interactions: []
      },
      timestamp: new Date(),
      source: 'pharmacy-system',
      confidence: 0.96,
      metadata: {
        patientId: filters.patientId,
        complianceLevel: ['HIPAA', 'NCPDP']
      }
    }];
  }

  private generateAIModelContexts(contextType: string, filters: any): MCPContext[] {
    return [{
      id: this.generateContextId(),
      type: contextType as any,
      content: {
        analysis: 'AI-generated clinical insights based on available data',
        recommendations: ['Consider cardiac catheterization', 'Monitor troponin levels'],
        confidence: 0.85
      },
      timestamp: new Date(),
      source: 'med-gemma-ai',
      confidence: 0.85,
      metadata: {
        patientId: filters.patientId,
        complianceLevel: ['HIPAA', 'Medical AI Standards']
      }
    }];
  }

  // Get aggregated context for a patient
  async getPatientContext(patientId: string): Promise<MCPContext[]> {
    const allContexts: MCPContext[] = [];
    
    // Request context from all relevant providers
    for (const provider of this.providers.values()) {
      if (provider.type !== 'ai-model') {
        try {
          const contexts = await this.requestContext(
            provider.id,
            provider.supportedContextTypes,
            { patientId }
          );
          allContexts.push(...contexts);
        } catch (error) {
          console.error(`Failed to get context from ${provider.id}:`, error);
        }
      }
    }

    return allContexts;
  }

  // Transform context for AI model consumption
  transformContextForAI(contexts: MCPContext[], targetFormat: string = 'clinical-summary'): any {
    switch (targetFormat) {
      case 'clinical-summary':
        return {
          patientSummary: this.createClinicalSummary(contexts),
          medicalHistory: contexts.filter(c => c.type === 'medical-history'),
          currentMedications: contexts.filter(c => c.type === 'medications'),
          recentLabs: contexts.filter(c => c.type === 'lab-results'),
          recentImaging: contexts.filter(c => c.type === 'imaging'),
          clinicalNotes: contexts.filter(c => c.type === 'clinical-notes')
        };
      case 'fhir-bundle':
        return this.createFHIRBundle(contexts);
      case 'hl7-message':
        return this.createHL7Message(contexts);
      default:
        return contexts;
    }
  }

  private createClinicalSummary(contexts: MCPContext[]): string {
    const summary = [];
    
    const medicalHistory = contexts.find(c => c.type === 'medical-history');
    if (medicalHistory) {
      summary.push(`Medical History: ${medicalHistory.content.conditions?.join(', ') || 'None documented'}`);
    }

    const medications = contexts.find(c => c.type === 'medications');
    if (medications) {
      const meds = medications.content.currentMedications?.map((m: any) => `${m.name} ${m.dose} ${m.frequency}`).join(', ');
      summary.push(`Current Medications: ${meds || 'None documented'}`);
    }

    const recentNotes = contexts.filter(c => c.type === 'clinical-notes').slice(0, 3);
    if (recentNotes.length > 0) {
      summary.push('Recent Clinical Notes:');
      recentNotes.forEach(note => {
        summary.push(`- ${note.content.chiefComplaint || 'No chief complaint'}`);
      });
    }

    return summary.join('\n');
  }

  private createFHIRBundle(contexts: MCPContext[]): any {
    // Create FHIR R4 Bundle from contexts
    return {
      resourceType: 'Bundle',
      id: this.generateContextId(),
      type: 'collection',
      entry: contexts.map(context => ({
        resource: this.convertContextToFHIR(context)
      }))
    };
  }

  private createHL7Message(contexts: MCPContext[]): string {
    // Create HL7 v2 message from contexts
    const segments = [
      'MSH|^~\\&|MCP|SYSTEM|AI|MODEL|' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + '||ADT^A08|' + this.generateMessageId() + '|P|2.5'
    ];

    contexts.forEach(context => {
      if (context.type === 'lab-results') {
        segments.push(`OBX|1|NM|${context.content.tests?.[0]?.name}||${context.content.tests?.[0]?.value}|${context.content.tests?.[0]?.units}|${context.content.tests?.[0]?.reference}|${context.content.tests?.[0]?.flag}|||F`);
      }
    });

    return segments.join('\r');
  }

  private convertContextToFHIR(context: MCPContext): any {
    switch (context.type) {
      case 'medical-history':
        return {
          resourceType: 'Condition',
          id: context.id,
          subject: { reference: `Patient/${context.metadata.patientId}` },
          code: { text: context.content.conditions?.[0] || 'Unknown condition' }
        };
      case 'medications':
        return {
          resourceType: 'MedicationStatement',
          id: context.id,
          subject: { reference: `Patient/${context.metadata.patientId}` },
          medicationCodeableConcept: { text: context.content.currentMedications?.[0]?.name || 'Unknown medication' }
        };
      default:
        return {
          resourceType: 'Basic',
          id: context.id,
          subject: { reference: `Patient/${context.metadata.patientId}` }
        };
    }
  }

  private generateMessageId(): string {
    return `mcp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateContextId(): string {
    return `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get MCP service status
  getStatus(): any {
    return {
      providers: this.providers.size,
      cachedContexts: this.contextCache.size,
      queuedMessages: this.messageQueue.length,
      supportedTypes: Array.from(new Set(
        Array.from(this.providers.values()).flatMap(p => p.supportedContextTypes)
      ))
    };
  }

  // Clear context cache
  clearCache(): void {
    this.contextCache.clear();
  }

  // Get message queue
  getMessageQueue(): MCPMessage[] {
    return [...this.messageQueue];
  }
}

// Export singleton instance
export const mcpService = new MCPService();