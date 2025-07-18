// RAG (Retrieval-Augmented Generation) Service for Healthcare AI
// Comprehensive RAG implementation supporting multiple types and medical knowledge bases

export interface RAGDocument {
  id: string;
  title: string;
  content: string;
  type: 'clinical-guideline' | 'medical-literature' | 'drug-information' | 'diagnostic-criteria' | 'treatment-protocol' | 'patient-data';
  source: string;
  specialty: string[];
  tags: string[];
  embedding?: number[];
  metadata: {
    authors?: string[];
    publicationDate?: Date;
    evidenceLevel?: string;
    complianceLevel?: string[];
    language?: string;
    doi?: string;
    pmid?: string;
    lastUpdated?: Date;
  };
  chunks?: RAGChunk[];
}

export interface RAGChunk {
  id: string;
  documentId: string;
  content: string;
  embedding?: number[];
  position: number;
  length: number;
  metadata: any;
}

export interface RAGQuery {
  query: string;
  type?: 'semantic' | 'keyword' | 'hybrid' | 'clinical' | 'drug-lookup' | 'guideline-search';
  specialty?: string;
  documentTypes?: string[];
  limit?: number;
  threshold?: number;
  filters?: {
    language?: string;
    evidenceLevel?: string;
    publicationDateRange?: { start: Date; end: Date };
    complianceRequired?: string[];
  };
}

export interface RAGResult {
  documents: RAGDocument[];
  chunks: RAGChunk[];
  relevanceScores: number[];
  totalResults: number;
  queryTime: number;
  sources: string[];
}

export interface MedicalKnowledgeBase {
  id: string;
  name: string;
  description: string;
  type: 'clinical-guidelines' | 'drug-database' | 'medical-literature' | 'diagnostic-tools' | 'treatment-protocols';
  size: number;
  lastUpdated: Date;
  specialties: string[];
  languages: string[];
  apiEndpoint?: string;
  credentials?: any;
}

export class RAGService {
  private knowledgeBases: Map<string, MedicalKnowledgeBase> = new Map();
  private documents: Map<string, RAGDocument> = new Map();
  private embeddings: Map<string, number[]> = new Map();
  private indexedChunks: RAGChunk[] = [];

  constructor() {
    this.initializeMedicalKnowledgeBases();
    this.loadMedicalDocuments();
  }

  private initializeMedicalKnowledgeBases() {
    const knowledgeBases: MedicalKnowledgeBase[] = [
      {
        id: 'pubmed-central',
        name: 'PubMed Central',
        description: 'Open access biomedical and life sciences literature',
        type: 'medical-literature',
        size: 8000000,
        lastUpdated: new Date(),
        specialties: ['All Medical Specialties'],
        languages: ['en', 'es', 'fr', 'de', 'pt', 'zh', 'ja'],
        apiEndpoint: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/'
      },
      {
        id: 'clinical-guidelines',
        name: 'Clinical Practice Guidelines',
        description: 'Evidence-based clinical practice guidelines from major medical organizations',
        type: 'clinical-guidelines',
        size: 50000,
        lastUpdated: new Date(),
        specialties: ['Cardiology', 'Oncology', 'Neurology', 'Psychiatry', 'Internal Medicine'],
        languages: ['en'],
        apiEndpoint: '/api/clinical-guidelines'
      },
      {
        id: 'rxnorm-drugbank',
        name: 'RxNorm + DrugBank',
        description: 'Comprehensive drug information and interaction database',
        type: 'drug-database',
        size: 200000,
        lastUpdated: new Date(),
        specialties: ['Pharmacy', 'Clinical Pharmacology'],
        languages: ['en'],
        apiEndpoint: '/api/drug-database'
      },
      {
        id: 'who-icd11',
        name: 'WHO ICD-11',
        description: 'International Classification of Diseases 11th Revision',
        type: 'diagnostic-tools',
        size: 100000,
        lastUpdated: new Date(),
        specialties: ['All Medical Specialties'],
        languages: ['en', 'es', 'fr', 'ru', 'ar', 'zh'],
        apiEndpoint: 'https://icd.who.int/browse11'
      },
      {
        id: 'cochrane-library',
        name: 'Cochrane Library',
        description: 'High-quality evidence for healthcare decision-making',
        type: 'medical-literature',
        size: 500000,
        lastUpdated: new Date(),
        specialties: ['Evidence-Based Medicine', 'All Specialties'],
        languages: ['en'],
        apiEndpoint: '/api/cochrane'
      },
      {
        id: 'uptodate-clinical',
        name: 'UpToDate Clinical Database',
        description: 'Point-of-care clinical decision support',
        type: 'treatment-protocols',
        size: 100000,
        lastUpdated: new Date(),
        specialties: ['All Medical Specialties'],
        languages: ['en'],
        apiEndpoint: '/api/uptodate'
      },
      {
        id: 'medical-textbooks',
        name: 'Medical Textbook Collection',
        description: 'Curated collection of authoritative medical textbooks',
        type: 'medical-literature',
        size: 5000,
        lastUpdated: new Date(),
        specialties: ['All Medical Specialties'],
        languages: ['en'],
        apiEndpoint: '/api/medical-textbooks'
      }
    ];

    knowledgeBases.forEach(kb => {
      this.knowledgeBases.set(kb.id, kb);
    });
  }

  private loadMedicalDocuments() {
    // Load sample medical documents for demonstration
    const sampleDocuments: RAGDocument[] = [
      {
        id: 'cardiology-guideline-1',
        title: 'AHA/ACC Guidelines for Management of Acute Coronary Syndromes',
        content: `Acute coronary syndromes (ACS) encompass ST-elevation myocardial infarction (STEMI), non-ST-elevation myocardial infarction (NSTEMI), and unstable angina. Early diagnosis and treatment are critical for optimal outcomes. Initial evaluation should include: 1) 12-lead ECG within 10 minutes of presentation, 2) Cardiac biomarkers (troponin), 3) Complete clinical assessment including vital signs and physical examination. For STEMI patients, primary percutaneous coronary intervention (PCI) is preferred when available within 90 minutes of first medical contact. Fibrinolytic therapy should be considered when PCI is not available within 120 minutes. Dual antiplatelet therapy with aspirin and P2Y12 inhibitor is recommended for all ACS patients unless contraindicated.`,
        type: 'clinical-guideline',
        source: 'American Heart Association',
        specialty: ['Cardiology', 'Emergency Medicine'],
        tags: ['ACS', 'STEMI', 'NSTEMI', 'PCI', 'antiplatelet'],
        metadata: {
          authors: ['AHA/ACC Task Force'],
          publicationDate: new Date('2023-01-01'),
          evidenceLevel: 'Class I',
          complianceLevel: ['Evidence-Based Medicine'],
          language: 'en'
        }
      },
      {
        id: 'diabetes-management-1',
        title: 'ADA Standards of Medical Care in Diabetes 2024',
        content: `Type 2 diabetes management requires a comprehensive approach including lifestyle modifications, pharmacological interventions, and regular monitoring. First-line therapy is metformin unless contraindicated. Target HbA1c is generally <7% for most adults, with individualization based on patient factors. Blood pressure targets are <130/80 mmHg for most patients with diabetes. Lipid management includes statin therapy for primary prevention in patients aged 40-75 years with diabetes. Annual screening for diabetic complications includes: 1) Diabetic retinopathy screening, 2) Nephropathy assessment with urine albumin and eGFR, 3) Foot examination for neuropathy and vascular disease, 4) Cardiovascular risk assessment.`,
        type: 'clinical-guideline',
        source: 'American Diabetes Association',
        specialty: ['Endocrinology', 'Primary Care'],
        tags: ['diabetes', 'HbA1c', 'metformin', 'complications'],
        metadata: {
          authors: ['ADA Professional Practice Committee'],
          publicationDate: new Date('2024-01-01'),
          evidenceLevel: 'Grade A',
          complianceLevel: ['Evidence-Based Medicine'],
          language: 'en'
        }
      },
      {
        id: 'drug-interaction-warfarin',
        title: 'Warfarin Drug Interactions and Clinical Management',
        content: `Warfarin is a vitamin K antagonist with narrow therapeutic index and numerous drug interactions. Major interactions include: 1) Antibiotics (quinolones, macrolides, metronidazole) - increase INR, 2) Antifungals (fluconazole, miconazole) - increase INR, 3) NSAIDs - increase bleeding risk, 4) Amiodarone - significantly increases INR. Foods high in vitamin K (leafy greens) can decrease warfarin effectiveness. Regular INR monitoring is essential, typically every 4-6 weeks when stable. Target INR ranges: 2.0-3.0 for most indications, 2.5-3.5 for mechanical heart valves. When starting interacting medications, increase INR monitoring frequency and consider dose adjustments.`,
        type: 'drug-information',
        source: 'Clinical Pharmacology Database',
        specialty: ['Pharmacy', 'Cardiology', 'Hematology'],
        tags: ['warfarin', 'drug interactions', 'INR', 'anticoagulation'],
        metadata: {
          publicationDate: new Date('2023-06-01'),
          evidenceLevel: 'Expert Consensus',
          complianceLevel: ['FDA Guidelines'],
          language: 'en'
        }
      },
      {
        id: 'depression-dsm5',
        title: 'DSM-5 Diagnostic Criteria for Major Depressive Disorder',
        content: `Major Depressive Disorder requires five or more symptoms during a 2-week period, with at least one symptom being depressed mood or loss of interest/pleasure: 1) Depressed mood most of the day, 2) Diminished interest or pleasure in activities, 3) Significant weight loss or gain, 4) Insomnia or hypersomnia, 5) Psychomotor agitation or retardation, 6) Fatigue or loss of energy, 7) Feelings of worthlessness or excessive guilt, 8) Diminished concentration, 9) Recurrent thoughts of death or suicidal ideation. Symptoms must cause clinically significant distress or impairment and not be attributable to substance use or medical condition. Severity specifiers include mild, moderate, severe without psychotic features, severe with psychotic features.`,
        type: 'diagnostic-criteria',
        source: 'American Psychiatric Association',
        specialty: ['Psychiatry', 'Primary Care', 'Psychology'],
        tags: ['depression', 'MDD', 'DSM-5', 'diagnosis'],
        metadata: {
          authors: ['American Psychiatric Association'],
          publicationDate: new Date('2022-03-01'),
          evidenceLevel: 'Expert Consensus',
          complianceLevel: ['DSM-5'],
          language: 'en'
        }
      }
    ];

    sampleDocuments.forEach(doc => {
      this.documents.set(doc.id, doc);
      // Generate chunks for each document
      doc.chunks = this.chunkDocument(doc);
      this.indexedChunks.push(...doc.chunks);
    });
  }

  // Chunk documents for better retrieval
  private chunkDocument(document: RAGDocument): RAGChunk[] {
    const chunks: RAGChunk[] = [];
    const chunkSize = 500; // characters
    const overlap = 50; // character overlap between chunks

    let position = 0;
    let chunkIndex = 0;

    while (position < document.content.length) {
      const endPosition = Math.min(position + chunkSize, document.content.length);
      const content = document.content.substring(position, endPosition);

      chunks.push({
        id: `${document.id}_chunk_${chunkIndex}`,
        documentId: document.id,
        content,
        position,
        length: content.length,
        metadata: {
          chunkIndex,
          documentTitle: document.title,
          documentType: document.type,
          specialty: document.specialty
        }
      });

      position = endPosition - overlap;
      chunkIndex++;
    }

    return chunks;
  }

  // Perform RAG query
  async performRAGQuery(query: RAGQuery): Promise<RAGResult> {
    const startTime = Date.now();
    
    try {
      let results: RAGResult;

      switch (query.type) {
        case 'semantic':
          results = await this.semanticSearch(query);
          break;
        case 'keyword':
          results = this.keywordSearch(query);
          break;
        case 'hybrid':
          results = await this.hybridSearch(query);
          break;
        case 'clinical':
          results = await this.clinicalSearch(query);
          break;
        case 'drug-lookup':
          results = await this.drugLookup(query);
          break;
        case 'guideline-search':
          results = this.guidelineSearch(query);
          break;
        default:
          results = await this.hybridSearch(query);
      }

      results.queryTime = Date.now() - startTime;
      return results;
    } catch (error) {
      console.error('RAG query failed:', error);
      return {
        documents: [],
        chunks: [],
        relevanceScores: [],
        totalResults: 0,
        queryTime: Date.now() - startTime,
        sources: []
      };
    }
  }

  // Semantic search using embeddings
  private async semanticSearch(query: RAGQuery): Promise<RAGResult> {
    // In production, this would use actual embedding models like sentence-transformers
    // For now, we'll simulate semantic search with keyword matching and relevance scoring
    
    const queryTerms = query.query.toLowerCase().split(/\s+/);
    const relevantChunks: { chunk: RAGChunk; score: number }[] = [];

    this.indexedChunks.forEach(chunk => {
      let score = 0;
      const chunkContent = chunk.content.toLowerCase();
      
      // Calculate relevance score based on term frequency and position
      queryTerms.forEach(term => {
        const matches = (chunkContent.match(new RegExp(term, 'g')) || []).length;
        score += matches * 1.0;
        
        // Boost score if term appears early in chunk
        if (chunkContent.indexOf(term) < 100) {
          score += 0.5;
        }
      });

      // Apply filters
      if (query.specialty) {
        const document = this.documents.get(chunk.documentId);
        if (document && !document.specialty.includes(query.specialty)) {
          score *= 0.5;
        }
      }

      if (query.documentTypes && query.documentTypes.length > 0) {
        const document = this.documents.get(chunk.documentId);
        if (document && !query.documentTypes.includes(document.type)) {
          score *= 0.3;
        }
      }

      if (score > (query.threshold || 0.1)) {
        relevantChunks.push({ chunk, score });
      }
    });

    // Sort by relevance score
    relevantChunks.sort((a, b) => b.score - a.score);

    // Limit results
    const limit = query.limit || 10;
    const topChunks = relevantChunks.slice(0, limit);

    // Get unique documents
    const documentIds = new Set(topChunks.map(r => r.chunk.documentId));
    const documents = Array.from(documentIds).map(id => this.documents.get(id)!).filter(Boolean);

    return {
      documents,
      chunks: topChunks.map(r => r.chunk),
      relevanceScores: topChunks.map(r => r.score),
      totalResults: relevantChunks.length,
      queryTime: 0,
      sources: documents.map(d => d.source)
    };
  }

  // Keyword search
  private keywordSearch(query: RAGQuery): RAGResult {
    const queryTerms = query.query.toLowerCase().split(/\s+/);
    const relevantDocuments: { document: RAGDocument; score: number }[] = [];

    this.documents.forEach(document => {
      let score = 0;
      const content = document.content.toLowerCase();
      const title = document.title.toLowerCase();

      queryTerms.forEach(term => {
        // Title matches get higher score
        const titleMatches = (title.match(new RegExp(term, 'g')) || []).length;
        score += titleMatches * 3.0;

        // Content matches
        const contentMatches = (content.match(new RegExp(term, 'g')) || []).length;
        score += contentMatches * 1.0;

        // Tag matches
        document.tags.forEach(tag => {
          if (tag.toLowerCase().includes(term)) {
            score += 2.0;
          }
        });
      });

      if (score > 0) {
        relevantDocuments.push({ document, score });
      }
    });

    relevantDocuments.sort((a, b) => b.score - a.score);
    const limit = query.limit || 10;
    const topDocuments = relevantDocuments.slice(0, limit).map(r => r.document);

    return {
      documents: topDocuments,
      chunks: [],
      relevanceScores: relevantDocuments.slice(0, limit).map(r => r.score),
      totalResults: relevantDocuments.length,
      queryTime: 0,
      sources: topDocuments.map(d => d.source)
    };
  }

  // Hybrid search combining semantic and keyword
  private async hybridSearch(query: RAGQuery): Promise<RAGResult> {
    const semanticResults = await this.semanticSearch(query);
    const keywordResults = this.keywordSearch(query);

    // Combine and deduplicate results
    const combinedDocuments = new Map<string, RAGDocument>();
    const combinedScores = new Map<string, number>();

    // Add semantic results with weight
    semanticResults.documents.forEach((doc, index) => {
      combinedDocuments.set(doc.id, doc);
      combinedScores.set(doc.id, (combinedScores.get(doc.id) || 0) + semanticResults.relevanceScores[index] * 0.7);
    });

    // Add keyword results with weight
    keywordResults.documents.forEach((doc, index) => {
      combinedDocuments.set(doc.id, doc);
      combinedScores.set(doc.id, (combinedScores.get(doc.id) || 0) + keywordResults.relevanceScores[index] * 0.3);
    });

    // Sort by combined score
    const sortedResults = Array.from(combinedDocuments.entries())
      .map(([id, doc]) => ({ document: doc, score: combinedScores.get(id)! }))
      .sort((a, b) => b.score - a.score);

    const limit = query.limit || 10;
    const finalResults = sortedResults.slice(0, limit);

    return {
      documents: finalResults.map(r => r.document),
      chunks: semanticResults.chunks,
      relevanceScores: finalResults.map(r => r.score),
      totalResults: sortedResults.length,
      queryTime: 0,
      sources: Array.from(new Set([...semanticResults.sources, ...keywordResults.sources]))
    };
  }

  // Clinical-specific search
  private async clinicalSearch(query: RAGQuery): Promise<RAGResult> {
    // Enhance query with clinical context
    const clinicalQuery = {
      ...query,
      documentTypes: ['clinical-guideline', 'diagnostic-criteria', 'treatment-protocol'],
      query: query.query + ' clinical practice evidence-based'
    };

    const results = await this.hybridSearch(clinicalQuery);
    
    // Re-rank based on evidence level
    results.documents = results.documents.sort((a, b) => {
      const aLevel = this.getEvidenceLevelScore(a.metadata.evidenceLevel);
      const bLevel = this.getEvidenceLevelScore(b.metadata.evidenceLevel);
      return bLevel - aLevel;
    });

    return results;
  }

  // Drug-specific lookup
  private async drugLookup(query: RAGQuery): Promise<RAGResult> {
    const drugQuery = {
      ...query,
      documentTypes: ['drug-information'],
      query: query.query + ' medication drug interaction dosage contraindication'
    };

    return this.hybridSearch(drugQuery);
  }

  // Guideline-specific search
  private guidelineSearch(query: RAGQuery): RAGResult {
    const guidelines = Array.from(this.documents.values()).filter(doc => 
      doc.type === 'clinical-guideline'
    );

    const queryTerms = query.query.toLowerCase().split(/\s+/);
    const relevantGuidelines: { document: RAGDocument; score: number }[] = [];

    guidelines.forEach(guideline => {
      let score = 0;
      const content = guideline.content.toLowerCase();
      const title = guideline.title.toLowerCase();

      queryTerms.forEach(term => {
        score += (title.match(new RegExp(term, 'g')) || []).length * 3.0;
        score += (content.match(new RegExp(term, 'g')) || []).length * 1.0;
      });

      if (score > 0) {
        relevantGuidelines.push({ document: guideline, score });
      }
    });

    relevantGuidelines.sort((a, b) => b.score - a.score);
    const limit = query.limit || 10;

    return {
      documents: relevantGuidelines.slice(0, limit).map(r => r.document),
      chunks: [],
      relevanceScores: relevantGuidelines.slice(0, limit).map(r => r.score),
      totalResults: relevantGuidelines.length,
      queryTime: 0,
      sources: relevantGuidelines.slice(0, limit).map(r => r.document.source)
    };
  }

  private getEvidenceLevelScore(evidenceLevel?: string): number {
    const scores: { [key: string]: number } = {
      'Class I': 10,
      'Grade A': 9,
      'Level 1': 8,
      'Class II': 7,
      'Grade B': 6,
      'Level 2': 5,
      'Class III': 4,
      'Grade C': 3,
      'Expert Consensus': 2,
      'Opinion': 1
    };
    
    return scores[evidenceLevel || ''] || 0;
  }

  // Add document to RAG database
  async addDocument(document: RAGDocument): Promise<void> {
    document.chunks = this.chunkDocument(document);
    this.documents.set(document.id, document);
    this.indexedChunks.push(...document.chunks);
  }

  // Update document
  async updateDocument(documentId: string, updates: Partial<RAGDocument>): Promise<boolean> {
    const document = this.documents.get(documentId);
    if (!document) return false;

    // Remove old chunks
    this.indexedChunks = this.indexedChunks.filter(chunk => chunk.documentId !== documentId);

    // Update document
    const updatedDocument = { ...document, ...updates };
    updatedDocument.chunks = this.chunkDocument(updatedDocument);
    
    this.documents.set(documentId, updatedDocument);
    this.indexedChunks.push(...updatedDocument.chunks);

    return true;
  }

  // Delete document
  async deleteDocument(documentId: string): Promise<boolean> {
    if (!this.documents.has(documentId)) return false;

    this.documents.delete(documentId);
    this.indexedChunks = this.indexedChunks.filter(chunk => chunk.documentId !== documentId);
    
    return true;
  }

  // Get knowledge bases
  getKnowledgeBases(): MedicalKnowledgeBase[] {
    return Array.from(this.knowledgeBases.values());
  }

  // Get documents by type
  getDocumentsByType(type: string): RAGDocument[] {
    return Array.from(this.documents.values()).filter(doc => doc.type === type);
  }

  // Get documents by specialty
  getDocumentsBySpecialty(specialty: string): RAGDocument[] {
    return Array.from(this.documents.values()).filter(doc => 
      doc.specialty.includes(specialty)
    );
  }

  // Get RAG statistics
  getStatistics(): any {
    const totalDocuments = this.documents.size;
    const totalChunks = this.indexedChunks.length;
    const documentTypes = new Set(Array.from(this.documents.values()).map(d => d.type));
    const specialties = new Set(Array.from(this.documents.values()).flatMap(d => d.specialty));

    return {
      totalDocuments,
      totalChunks,
      documentTypes: Array.from(documentTypes),
      specialties: Array.from(specialties),
      knowledgeBases: this.knowledgeBases.size,
      avgChunksPerDocument: totalDocuments > 0 ? Math.round(totalChunks / totalDocuments) : 0
    };
  }

  // Generate context for AI models
  async generateContextForAI(query: string, specialty?: string): Promise<string> {
    const ragQuery: RAGQuery = {
      query,
      type: 'clinical',
      specialty,
      limit: 5,
      threshold: 0.3
    };

    const results = await this.performRAGQuery(ragQuery);
    
    if (results.documents.length === 0) {
      return `No relevant medical literature found for query: "${query}"`;
    }

    const contextParts = [
      `Based on current medical literature and clinical guidelines:`,
      ''
    ];

    results.documents.forEach((doc, index) => {
      contextParts.push(
        `${index + 1}. ${doc.title} (${doc.source})`,
        `   Evidence Level: ${doc.metadata.evidenceLevel || 'Not specified'}`,
        `   Key Information: ${doc.content.substring(0, 300)}...`,
        ''
      );
    });

    contextParts.push(
      'Sources:',
      ...results.sources.map((source, index) => `${index + 1}. ${source}`)
    );

    return contextParts.join('\n');
  }
}

// Export singleton instance
export const ragService = new RAGService();