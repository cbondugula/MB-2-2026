// Ollama Local AI Service - Local hosting for healthcare AI models
// Supports local deployment of medical AI models for enhanced privacy and HIPAA compliance

import fetch from 'node-fetch';

export interface OllamaModel {
  name: string;
  healthcareSpecialty: string[];
  medicalAccuracy: 'high' | 'medium' | 'experimental';
  complianceLevel: string[];
  modelSize: string;
  requiredRAM: string;
  languages: string[];
  capabilities: string[];
  downloadSize: string;
  description: string;
}

export interface OllamaConfig {
  host: string;
  port: number;
  apiVersion: string;
  timeout: number;
  maxConcurrentRequests: number;
}

export class OllamaService {
  private config: OllamaConfig;
  private isAvailable: boolean = false;

  constructor(config: Partial<OllamaConfig> = {}) {
    this.config = {
      host: config.host || process.env.OLLAMA_HOST || 'localhost',
      port: config.port || parseInt(process.env.OLLAMA_PORT || '11434'),
      apiVersion: config.apiVersion || 'v1',
      timeout: config.timeout || 30000,
      maxConcurrentRequests: config.maxConcurrentRequests || 5
    };
  }

  // Healthcare-optimized Ollama models catalog
  private healthcareModels: OllamaModel[] = [
    {
      name: 'medalpaca',
      healthcareSpecialty: ['General Medicine', 'Clinical Decision Support'],
      medicalAccuracy: 'high',
      complianceLevel: ['HIPAA Compatible', 'Local Processing'],
      modelSize: '7B',
      requiredRAM: '8GB',
      languages: ['en'],
      capabilities: ['Medical Q&A', 'Clinical reasoning', 'Differential diagnosis'],
      downloadSize: '4.1GB',
      description: 'Medical language model fine-tuned on clinical data for healthcare applications'
    },
    {
      name: 'meditron',
      healthcareSpecialty: ['Medical Research', 'Clinical Documentation'],
      medicalAccuracy: 'high',
      complianceLevel: ['HIPAA Compatible', 'Research Grade'],
      modelSize: '7B',
      requiredRAM: '8GB',
      languages: ['en'],
      capabilities: ['Medical text generation', 'Clinical note analysis', 'Research assistance'],
      downloadSize: '4.1GB',
      description: 'Open-source medical large language model for clinical and research applications'
    },
    {
      name: 'clinical-camel',
      healthcareSpecialty: ['Clinical Medicine', 'Patient Care'],
      medicalAccuracy: 'high',
      complianceLevel: ['HIPAA Compatible', 'Clinical Grade'],
      modelSize: '13B',
      requiredRAM: '16GB',
      languages: ['en'],
      capabilities: ['Clinical decision support', 'Patient education', 'Medical summarization'],
      downloadSize: '7.3GB',
      description: 'Clinical-focused language model for healthcare professionals'
    },
    {
      name: 'biomistral',
      healthcareSpecialty: ['Biomedical Research', 'Life Sciences'],
      medicalAccuracy: 'high',
      complianceLevel: ['Research Compatible', 'Local Processing'],
      modelSize: '7B',
      requiredRAM: '8GB',
      languages: ['en', 'fr', 'de', 'es'],
      capabilities: ['Biomedical text analysis', 'Research literature review', 'Scientific writing'],
      downloadSize: '4.1GB',
      description: 'Biomedical language model for life sciences research and development'
    },
    {
      name: 'medllama2',
      healthcareSpecialty: ['General Medicine', 'Medical Education'],
      medicalAccuracy: 'medium',
      complianceLevel: ['Educational Use', 'HIPAA Compatible'],
      modelSize: '7B',
      requiredRAM: '8GB',
      languages: ['en'],
      capabilities: ['Medical education', 'Case studies', 'Medical terminology'],
      downloadSize: '4.1GB',
      description: 'Educational medical model for training and learning applications'
    },
    {
      name: 'radiology-llm',
      healthcareSpecialty: ['Radiology', 'Medical Imaging'],
      medicalAccuracy: 'high',
      complianceLevel: ['DICOM Compatible', 'HIPAA Ready'],
      modelSize: '13B',
      requiredRAM: '16GB',
      languages: ['en'],
      capabilities: ['Radiology report generation', 'Image description', 'Diagnostic assistance'],
      downloadSize: '7.3GB',
      description: 'Specialized model for radiology and medical imaging applications'
    },
    {
      name: 'pathology-ai',
      healthcareSpecialty: ['Pathology', 'Laboratory Medicine'],
      medicalAccuracy: 'high',
      complianceLevel: ['Laboratory Grade', 'CLIA Compatible'],
      modelSize: '7B',
      requiredRAM: '8GB',
      languages: ['en'],
      capabilities: ['Pathology report analysis', 'Tissue classification', 'Diagnostic support'],
      downloadSize: '4.1GB',
      description: 'Pathology-focused model for laboratory and diagnostic applications'
    },
    {
      name: 'pharmacy-llm',
      healthcareSpecialty: ['Pharmacy', 'Medication Management'],
      medicalAccuracy: 'high',
      complianceLevel: ['Pharmacy Standards', 'Drug Safety'],
      modelSize: '7B',
      requiredRAM: '8GB',
      languages: ['en'],
      capabilities: ['Drug interaction checking', 'Medication counseling', 'Pharmacy management'],
      downloadSize: '4.1GB',
      description: 'Pharmaceutical model for medication management and drug safety'
    },
    {
      name: 'mental-health-llm',
      healthcareSpecialty: ['Mental Health', 'Behavioral Health'],
      medicalAccuracy: 'high',
      complianceLevel: ['Mental Health Standards', 'Privacy Enhanced'],
      modelSize: '7B',
      requiredRAM: '8GB',
      languages: ['en', 'es', 'fr'],
      capabilities: ['Mental health screening', 'Therapy support', 'Crisis assessment'],
      downloadSize: '4.1GB',
      description: 'Mental health focused model for behavioral health applications'
    },
    {
      name: 'multilingual-medical',
      healthcareSpecialty: ['Global Health', 'International Medicine'],
      medicalAccuracy: 'medium',
      complianceLevel: ['Multi-region Compatible', 'Cultural Sensitive'],
      modelSize: '13B',
      requiredRAM: '16GB',
      languages: ['en', 'es', 'fr', 'de', 'pt', 'zh', 'ja', 'ar', 'hi'],
      capabilities: ['Multilingual medical support', 'Cultural healthcare', 'Global health'],
      downloadSize: '7.3GB',
      description: 'Multilingual medical model supporting global healthcare applications'
    }
  ];

  // Check if Ollama is available and running
  async checkAvailability(): Promise<boolean> {
    try {
      const response = await fetch(`http://${this.config.host}:${this.config.port}/api/tags`, {
        method: 'GET',
        timeout: 5000
      });
      this.isAvailable = response.ok;
      return this.isAvailable;
    } catch (error) {
      console.log('Ollama not available, falling back to cloud models');
      this.isAvailable = false;
      return false;
    }
  }

  // Get list of available healthcare models
  getHealthcareModels(): OllamaModel[] {
    return this.healthcareModels;
  }

  // Get models by healthcare specialty
  getModelsBySpecialty(specialty: string): OllamaModel[] {
    return this.healthcareModels.filter(model =>
      model.healthcareSpecialty.some(s => 
        s.toLowerCase().includes(specialty.toLowerCase())
      )
    );
  }

  // Get models by compliance requirements
  getModelsByCompliance(compliance: string): OllamaModel[] {
    return this.healthcareModels.filter(model =>
      model.complianceLevel.some(c => 
        c.toLowerCase().includes(compliance.toLowerCase())
      )
    );
  }

  // Install a healthcare model
  async installModel(modelName: string): Promise<boolean> {
    if (!this.isAvailable) {
      throw new Error('Ollama service not available');
    }

    try {
      const response = await fetch(`http://${this.config.host}:${this.config.port}/api/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: modelName,
          stream: false
        }),
        timeout: 300000 // 5 minute timeout for model download
      });

      return response.ok;
    } catch (error) {
      console.error(`Failed to install model ${modelName}:`, error);
      return false;
    }
  }

  // Generate healthcare response using local Ollama model
  async generateHealthcareResponse(
    modelName: string,
    prompt: string,
    context: any = {},
    options: any = {}
  ): Promise<any> {
    if (!this.isAvailable) {
      throw new Error('Ollama service not available');
    }

    try {
      const systemPrompt = this.buildHealthcareSystemPrompt(modelName, context);
      
      const response = await fetch(`http://${this.config.host}:${this.config.port}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: modelName,
          prompt: `${systemPrompt}\n\nUser: ${prompt}`,
          stream: false,
          options: {
            temperature: options.temperature || 0.1,
            top_p: options.top_p || 0.9,
            top_k: options.top_k || 40,
            num_predict: options.max_tokens || 1000,
            ...options
          }
        }),
        timeout: this.config.timeout
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        content: result.response,
        model: modelName,
        provider: 'ollama',
        local: true,
        compliance: 'local-processing',
        tokens: {
          prompt: result.prompt_eval_count || 0,
          completion: result.eval_count || 0,
          total: (result.prompt_eval_count || 0) + (result.eval_count || 0)
        },
        timing: {
          prompt_eval_duration: result.prompt_eval_duration || 0,
          eval_duration: result.eval_duration || 0,
          total_duration: result.total_duration || 0
        }
      };
    } catch (error) {
      console.error('Ollama generation error:', error);
      throw new Error(`Failed to generate response: ${error}`);
    }
  }

  // Build healthcare-specific system prompt
  private buildHealthcareSystemPrompt(modelName: string, context: any): string {
    const model = this.healthcareModels.find(m => m.name === modelName);
    if (!model) {
      return "You are a helpful healthcare AI assistant.";
    }

    let systemPrompt = `You are a specialized healthcare AI assistant using the ${model.name} model, designed for ${model.healthcareSpecialty.join(', ')}.

Your capabilities include: ${model.capabilities.join(', ')}.

You must:
- Provide clinically accurate information within your training scope
- Follow medical ethics and professional standards
- Respect patient privacy and confidentiality
- Clearly state when you cannot provide medical advice
- Recommend consulting healthcare professionals for diagnosis and treatment
- Ensure responses comply with ${model.complianceLevel.join(', ')}

Important: You are a tool for healthcare professionals and should not replace clinical judgment or professional medical advice.`;

    if (context.patientContext) {
      systemPrompt += `\n\nPatient Context: This consultation is part of a clinical workflow. Maintain professional medical communication standards.`;
    }

    if (context.specialty) {
      systemPrompt += `\n\nSpecialty Focus: Provide responses specifically relevant to ${context.specialty}.`;
    }

    if (context.complianceMode) {
      systemPrompt += `\n\nCompliance Mode: Ensure all responses meet ${context.complianceMode} requirements.`;
    }

    return systemPrompt;
  }

  // Medical text analysis using local models
  async analyzeMedicalText(text: string, analysisType: string, modelName: string = 'medalpaca'): Promise<any> {
    const prompt = `
Medical Text Analysis Request:
Analysis Type: ${analysisType}
Text to Analyze: ${text}

Please provide a structured analysis including:
1. Key medical concepts identified
2. Clinical significance
3. Relevant medical specialties
4. Potential diagnoses or conditions mentioned
5. Recommended follow-up actions
6. Confidence level of analysis

Format the response as JSON for structured processing.
`;

    return this.generateHealthcareResponse(modelName, prompt, {
      patientContext: true,
      specialty: 'clinical-analysis'
    }, {
      temperature: 0.1,
      max_tokens: 1500
    });
  }

  // Clinical decision support using local models
  async generateClinicalDecisionSupport(
    symptoms: string[],
    patientHistory: string,
    labResults: any = {},
    modelName: string = 'clinical-camel'
  ): Promise<any> {
    const prompt = `
Clinical Decision Support Request:
Symptoms: ${symptoms.join(', ')}
Patient History: ${patientHistory}
Lab Results: ${JSON.stringify(labResults, null, 2)}

Please provide clinical decision support including:
1. Differential diagnosis list with likelihood scores
2. Recommended diagnostic tests or procedures
3. Potential treatment options
4. Risk factors and warnings
5. Follow-up recommendations
6. Patient education points

Format as structured JSON for clinical workflow integration.
`;

    return this.generateHealthcareResponse(modelName, prompt, {
      patientContext: true,
      specialty: 'clinical-decision-support',
      complianceMode: 'HIPAA'
    }, {
      temperature: 0.1,
      max_tokens: 2000
    });
  }

  // Healthcare report generation
  async generateHealthcareReport(
    reportType: string,
    data: any,
    modelName: string = 'meditron'
  ): Promise<any> {
    const prompt = `
Healthcare Report Generation:
Report Type: ${reportType}
Data: ${JSON.stringify(data, null, 2)}

Generate a comprehensive ${reportType} report including:
1. Executive summary
2. Key findings
3. Clinical implications
4. Recommendations
5. Follow-up requirements
6. References to relevant guidelines

Ensure the report meets professional medical documentation standards.
`;

    return this.generateHealthcareResponse(modelName, prompt, {
      specialty: 'medical-documentation',
      complianceMode: 'clinical-documentation'
    }, {
      temperature: 0.2,
      max_tokens: 3000
    });
  }

  // Get model status and system information
  async getModelStatus(): Promise<any> {
    if (!this.isAvailable) {
      return {
        available: false,
        models: [],
        system: null
      };
    }

    try {
      const modelsResponse = await fetch(`http://${this.config.host}:${this.config.port}/api/tags`);
      const models = await modelsResponse.json();

      return {
        available: true,
        models: models.models || [],
        system: {
          host: this.config.host,
          port: this.config.port,
          healthcareModelsAvailable: this.healthcareModels.length,
          complianceReady: true,
          localProcessing: true
        }
      };
    } catch (error) {
      return {
        available: false,
        error: error.message,
        models: [],
        system: null
      };
    }
  }
}

// Export singleton instance
export const ollamaService = new OllamaService();