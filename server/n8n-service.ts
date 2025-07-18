// n8n Workflow Automation Service for Healthcare AI
// Enables automated healthcare workflows, data processing, and integration

import fetch from 'node-fetch';

export interface N8nWorkflow {
  id: string;
  name: string;
  description: string;
  category: 'patient-care' | 'data-processing' | 'compliance' | 'integration' | 'monitoring';
  trigger: 'manual' | 'webhook' | 'schedule' | 'event';
  healthcareUseCase: string;
  complianceLevel: string[];
  nodes: N8nNode[];
  active: boolean;
  tags: string[];
  medicalSpecialty: string[];
}

export interface N8nNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: any;
  credentials?: string;
}

export interface HealthcareWorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  workflow: N8nWorkflow;
  requirements: string[];
  benefits: string[];
  complianceNotes: string[];
}

export class N8nService {
  private baseUrl: string;
  private apiKey: string;
  
  constructor() {
    this.baseUrl = process.env.N8N_BASE_URL || 'http://localhost:5678';
    this.apiKey = process.env.N8N_API_KEY || '';
  }

  // Healthcare workflow templates
  private healthcareTemplates: HealthcareWorkflowTemplate[] = [
    {
      id: 'patient-intake-automation',
      name: 'Patient Intake Automation',
      description: 'Automated patient registration, verification, and data processing',
      category: 'patient-care',
      workflow: {
        id: 'patient-intake',
        name: 'Patient Intake Workflow',
        description: 'Automates patient registration and data verification',
        category: 'patient-care',
        trigger: 'webhook',
        healthcareUseCase: 'Streamline patient onboarding with automated verification',
        complianceLevel: ['HIPAA', 'GDPR'],
        nodes: [
          {
            id: 'webhook-trigger',
            name: 'Patient Data Webhook',
            type: 'n8n-nodes-base.webhook',
            typeVersion: 1,
            position: [250, 300],
            parameters: {
              path: 'patient-intake',
              httpMethod: 'POST'
            }
          },
          {
            id: 'data-validation',
            name: 'Validate Patient Data',
            type: 'n8n-nodes-base.function',
            typeVersion: 1,
            position: [450, 300],
            parameters: {
              functionCode: `
                // HIPAA-compliant patient data validation
                const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'contactInfo'];
                const patientData = items[0].json;
                
                // Validate required fields
                const missingFields = requiredFields.filter(field => !patientData[field]);
                if (missingFields.length > 0) {
                  throw new Error(\`Missing required fields: \${missingFields.join(', ')}\`);
                }
                
                // Sanitize and format data
                patientData.firstName = patientData.firstName.trim();
                patientData.lastName = patientData.lastName.trim();
                patientData.mrn = 'MRN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
                
                return [{ json: patientData }];
              `
            }
          },
          {
            id: 'ehr-integration',
            name: 'Create EHR Record',
            type: 'n8n-nodes-base.httpRequest',
            typeVersion: 1,
            position: [650, 300],
            parameters: {
              url: '={{$env.EHR_API_ENDPOINT}}/patients',
              method: 'POST',
              headers: {
                'Authorization': 'Bearer {{$env.EHR_API_TOKEN}}',
                'Content-Type': 'application/json'
              },
              body: '={{JSON.stringify($json)}}'
            }
          }
        ],
        active: true,
        tags: ['healthcare', 'patient-intake', 'automation'],
        medicalSpecialty: ['Administration', 'All Specialties']
      },
      requirements: ['EHR API access', 'HIPAA compliance', 'Data validation'],
      benefits: ['Reduced manual entry', 'Improved accuracy', 'Faster patient onboarding'],
      complianceNotes: ['All patient data encrypted in transit', 'Audit logs maintained', 'Access controls enforced']
    },
    {
      id: 'lab-result-processing',
      name: 'Lab Result Processing & Alerts',
      description: 'Automated processing of lab results with critical value alerts',
      category: 'data-processing',
      workflow: {
        id: 'lab-processing',
        name: 'Lab Result Processing',
        description: 'Process lab results and generate alerts for critical values',
        category: 'data-processing',
        trigger: 'webhook',
        healthcareUseCase: 'Automated lab result processing with immediate alerts for critical values',
        complianceLevel: ['HIPAA', 'CLIA', 'CAP'],
        nodes: [
          {
            id: 'lab-webhook',
            name: 'Lab Results Webhook',
            type: 'n8n-nodes-base.webhook',
            typeVersion: 1,
            position: [200, 300],
            parameters: {
              path: 'lab-results',
              httpMethod: 'POST'
            }
          },
          {
            id: 'parse-hl7',
            name: 'Parse HL7 Message',
            type: 'n8n-nodes-base.function',
            typeVersion: 1,
            position: [400, 300],
            parameters: {
              functionCode: `
                // Parse HL7 lab results message
                const hl7Message = items[0].json.message;
                const segments = hl7Message.split('\\r');
                
                const msh = segments.find(s => s.startsWith('MSH')).split('|');
                const pid = segments.find(s => s.startsWith('PID')).split('|');
                const obx = segments.filter(s => s.startsWith('OBX')).map(s => s.split('|'));
                
                const results = obx.map(obs => ({
                  testName: obs[3],
                  value: obs[5],
                  units: obs[6],
                  referenceRange: obs[7],
                  abnormalFlag: obs[8],
                  status: obs[11]
                }));
                
                return [{
                  json: {
                    patientId: pid[3],
                    patientName: pid[5],
                    results: results,
                    timestamp: new Date().toISOString()
                  }
                }];
              `
            }
          },
          {
            id: 'critical-check',
            name: 'Check Critical Values',
            type: 'n8n-nodes-base.function',
            typeVersion: 1,
            position: [600, 300],
            parameters: {
              functionCode: `
                // Check for critical lab values
                const criticalRanges = {
                  'Glucose': { min: 50, max: 400 },
                  'Potassium': { min: 2.5, max: 6.0 },
                  'Creatinine': { min: 0, max: 5.0 },
                  'Hemoglobin': { min: 7.0, max: 20.0 }
                };
                
                const data = items[0].json;
                const criticalResults = data.results.filter(result => {
                  const range = criticalRanges[result.testName];
                  if (range) {
                    const value = parseFloat(result.value);
                    return value < range.min || value > range.max;
                  }
                  return false;
                });
                
                return [{
                  json: {
                    ...data,
                    criticalResults,
                    hasCritical: criticalResults.length > 0
                  }
                }];
              `
            }
          },
          {
            id: 'alert-notification',
            name: 'Send Critical Alert',
            type: 'n8n-nodes-base.if',
            typeVersion: 1,
            position: [800, 300],
            parameters: {
              conditions: {
                boolean: [{
                  value1: '={{$json.hasCritical}}',
                  operation: 'equal',
                  value2: true
                }]
              }
            }
          }
        ],
        active: true,
        tags: ['laboratory', 'critical-alerts', 'automation'],
        medicalSpecialty: ['Laboratory Medicine', 'All Specialties']
      },
      requirements: ['HL7 integration', 'Critical value thresholds', 'Alert routing'],
      benefits: ['Immediate critical alerts', 'Reduced response time', 'Improved patient safety'],
      complianceNotes: ['HL7 standard compliance', 'Audit trail for all alerts', 'Secure messaging protocols']
    },
    {
      id: 'medication-reconciliation',
      name: 'Medication Reconciliation Workflow',
      description: 'Automated medication reconciliation with drug interaction checking',
      category: 'patient-care',
      workflow: {
        id: 'med-reconciliation',
        name: 'Medication Reconciliation',
        description: 'Reconcile patient medications and check for interactions',
        category: 'patient-care',
        trigger: 'webhook',
        healthcareUseCase: 'Ensure medication safety through automated reconciliation',
        complianceLevel: ['HIPAA', 'FDA', 'Pharmacy Standards'],
        nodes: [
          {
            id: 'med-webhook',
            name: 'Medication Data Webhook',
            type: 'n8n-nodes-base.webhook',
            typeVersion: 1,
            position: [200, 300],
            parameters: {
              path: 'medication-reconciliation',
              httpMethod: 'POST'
            }
          },
          {
            id: 'fetch-current-meds',
            name: 'Fetch Current Medications',
            type: 'n8n-nodes-base.httpRequest',
            typeVersion: 1,
            position: [400, 300],
            parameters: {
              url: '={{$env.EHR_API_ENDPOINT}}/patients/{{$json.patientId}}/medications',
              method: 'GET',
              headers: {
                'Authorization': 'Bearer {{$env.EHR_API_TOKEN}}'
              }
            }
          },
          {
            id: 'interaction-check',
            name: 'Drug Interaction Check',
            type: 'n8n-nodes-base.function',
            typeVersion: 1,
            position: [600, 300],
            parameters: {
              functionCode: `
                // Drug interaction checking logic
                const currentMeds = items[0].json.medications || [];
                const newMeds = items[0].json.newMedications || [];
                const allMeds = [...currentMeds, ...newMeds];
                
                // Simplified interaction checking (integrate with drug database)
                const interactions = [];
                const knownInteractions = {
                  'warfarin': ['aspirin', 'ibuprofen'],
                  'metformin': ['alcohol'],
                  'lisinopril': ['potassium supplements']
                };
                
                allMeds.forEach(med1 => {
                  allMeds.forEach(med2 => {
                    if (med1.name !== med2.name && knownInteractions[med1.name]?.includes(med2.name)) {
                      interactions.push({
                        drug1: med1.name,
                        drug2: med2.name,
                        severity: 'moderate',
                        description: \`Potential interaction between \${med1.name} and \${med2.name}\`
                      });
                    }
                  });
                });
                
                return [{
                  json: {
                    patientId: items[0].json.patientId,
                    medications: allMeds,
                    interactions: interactions,
                    hasInteractions: interactions.length > 0
                  }
                }];
              `
            }
          }
        ],
        active: true,
        tags: ['pharmacy', 'medication-safety', 'interactions'],
        medicalSpecialty: ['Pharmacy', 'Internal Medicine']
      },
      requirements: ['Drug interaction database', 'EHR integration', 'Pharmacy systems'],
      benefits: ['Improved medication safety', 'Reduced adverse events', 'Automated checking'],
      complianceNotes: ['FDA drug interaction guidelines', 'Pharmacy practice standards', 'Patient safety protocols']
    },
    {
      id: 'appointment-optimization',
      name: 'Appointment Scheduling Optimization',
      description: 'AI-powered appointment scheduling with resource optimization',
      category: 'integration',
      workflow: {
        id: 'appointment-optimization',
        name: 'Smart Appointment Scheduling',
        description: 'Optimize appointment scheduling based on provider availability and patient needs',
        category: 'integration',
        trigger: 'webhook',
        healthcareUseCase: 'Maximize clinic efficiency through intelligent scheduling',
        complianceLevel: ['HIPAA', 'Accessibility Standards'],
        nodes: [
          {
            id: 'schedule-webhook',
            name: 'Appointment Request Webhook',
            type: 'n8n-nodes-base.webhook',
            typeVersion: 1,
            position: [200, 300],
            parameters: {
              path: 'appointment-request',
              httpMethod: 'POST'
            }
          },
          {
            id: 'check-availability',
            name: 'Check Provider Availability',
            type: 'n8n-nodes-base.function',
            typeVersion: 1,
            position: [400, 300],
            parameters: {
              functionCode: `
                // Provider availability checking
                const request = items[0].json;
                const preferredDate = new Date(request.preferredDate);
                const specialty = request.specialty;
                
                // Mock availability data (integrate with scheduling system)
                const availableSlots = [
                  { provider: 'Dr. Smith', time: '2024-01-15T09:00:00Z', specialty: 'Cardiology' },
                  { provider: 'Dr. Johnson', time: '2024-01-15T14:00:00Z', specialty: 'Internal Medicine' },
                  { provider: 'Dr. Williams', time: '2024-01-16T10:00:00Z', specialty: 'Cardiology' }
                ];
                
                const matchingSlots = availableSlots.filter(slot => 
                  slot.specialty === specialty &&
                  new Date(slot.time) >= preferredDate
                );
                
                return [{
                  json: {
                    ...request,
                    availableSlots: matchingSlots,
                    recommendedSlot: matchingSlots[0] || null
                  }
                }];
              `
            }
          }
        ],
        active: true,
        tags: ['scheduling', 'optimization', 'resource-management'],
        medicalSpecialty: ['Administration', 'All Specialties']
      },
      requirements: ['Scheduling system integration', 'Provider calendars', 'Patient preferences'],
      benefits: ['Improved resource utilization', 'Reduced wait times', 'Better patient satisfaction'],
      complianceNotes: ['Patient privacy maintained', 'Equal access policies', 'Audit logs for scheduling decisions']
    }
  ];

  // Check n8n availability
  async checkAvailability(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows`, {
        headers: {
          'X-N8N-API-KEY': this.apiKey
        }
      });
      return response.ok;
    } catch (error) {
      console.log('n8n not available');
      return false;
    }
  }

  // Get healthcare workflow templates
  getHealthcareTemplates(): HealthcareWorkflowTemplate[] {
    return this.healthcareTemplates;
  }

  // Create workflow from template
  async createWorkflowFromTemplate(templateId: string, customization: any = {}): Promise<string | null> {
    const template = this.healthcareTemplates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    try {
      const workflow = {
        ...template.workflow,
        name: customization.name || template.workflow.name,
        ...customization
      };

      const response = await fetch(`${this.baseUrl}/api/v1/workflows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': this.apiKey
        },
        body: JSON.stringify(workflow)
      });

      if (response.ok) {
        const result = await response.json();
        return result.id;
      } else {
        throw new Error(`Failed to create workflow: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error creating workflow:', error);
      return null;
    }
  }

  // Execute workflow
  async executeWorkflow(workflowId: string, data: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows/${workflowId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': this.apiKey
        },
        body: JSON.stringify({ data })
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Workflow execution failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error executing workflow:', error);
      throw error;
    }
  }

  // Get workflow execution history
  async getExecutionHistory(workflowId: string, limit: number = 20): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/executions?workflowId=${workflowId}&limit=${limit}`, {
        headers: {
          'X-N8N-API-KEY': this.apiKey
        }
      });

      if (response.ok) {
        const result = await response.json();
        return result.data || [];
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching execution history:', error);
      return [];
    }
  }

  // Generate custom healthcare workflow
  async generateCustomWorkflow(
    name: string,
    description: string,
    category: string,
    requirements: string[],
    useCase: string
  ): Promise<N8nWorkflow> {
    // Generate workflow based on requirements
    const nodes: N8nNode[] = [
      {
        id: 'trigger',
        name: 'Workflow Trigger',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1,
        position: [200, 300],
        parameters: {
          path: name.toLowerCase().replace(/\s+/g, '-'),
          httpMethod: 'POST'
        }
      }
    ];

    // Add nodes based on requirements
    if (requirements.includes('data-validation')) {
      nodes.push({
        id: 'validation',
        name: 'Data Validation',
        type: 'n8n-nodes-base.function',
        typeVersion: 1,
        position: [400, 300],
        parameters: {
          functionCode: `
            // Healthcare data validation
            const data = items[0].json;
            // Add validation logic here
            return [{ json: data }];
          `
        }
      });
    }

    if (requirements.includes('ehr-integration')) {
      nodes.push({
        id: 'ehr-update',
        name: 'Update EHR',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 1,
        position: [600, 300],
        parameters: {
          url: '={{$env.EHR_API_ENDPOINT}}',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer {{$env.EHR_API_TOKEN}}',
            'Content-Type': 'application/json'
          }
        }
      });
    }

    return {
      id: `custom-${Date.now()}`,
      name,
      description,
      category: category as any,
      trigger: 'webhook',
      healthcareUseCase: useCase,
      complianceLevel: ['HIPAA'],
      nodes,
      active: false,
      tags: ['custom', 'healthcare'],
      medicalSpecialty: ['General']
    };
  }

  // Healthcare-specific node types
  getHealthcareNodeTypes(): any[] {
    return [
      {
        name: 'HL7 Parser',
        type: 'healthcare.hl7Parser',
        description: 'Parse HL7 healthcare messages',
        category: 'Healthcare Data'
      },
      {
        name: 'FHIR Client',
        type: 'healthcare.fhirClient',
        description: 'Connect to FHIR-compliant systems',
        category: 'Healthcare Integration'
      },
      {
        name: 'Drug Interaction Checker',
        type: 'healthcare.drugChecker',
        description: 'Check for drug interactions',
        category: 'Clinical Decision Support'
      },
      {
        name: 'HIPAA Validator',
        type: 'healthcare.hipaaValidator',
        description: 'Validate HIPAA compliance',
        category: 'Compliance'
      },
      {
        name: 'Medical NLP',
        type: 'healthcare.medicalNLP',
        description: 'Extract medical entities from text',
        category: 'AI/ML'
      }
    ];
  }

  // Monitor workflow performance
  async getWorkflowMetrics(workflowId: string): Promise<any> {
    try {
      const executions = await this.getExecutionHistory(workflowId, 100);
      
      const successful = executions.filter(e => e.finished && !e.stoppedAt);
      const failed = executions.filter(e => e.stoppedAt);
      
      const avgExecutionTime = successful.length > 0 
        ? successful.reduce((sum, e) => sum + (new Date(e.finishedAt).getTime() - new Date(e.startedAt).getTime()), 0) / successful.length
        : 0;

      return {
        totalExecutions: executions.length,
        successfulExecutions: successful.length,
        failedExecutions: failed.length,
        successRate: executions.length > 0 ? (successful.length / executions.length) * 100 : 0,
        averageExecutionTime: Math.round(avgExecutionTime / 1000), // in seconds
        lastExecution: executions[0]?.startedAt || null
      };
    } catch (error) {
      console.error('Error getting workflow metrics:', error);
      return {
        totalExecutions: 0,
        successfulExecutions: 0,
        failedExecutions: 0,
        successRate: 0,
        averageExecutionTime: 0,
        lastExecution: null
      };
    }
  }
}

// Export singleton instance
export const n8nService = new N8nService();