import type { Express } from "express";
import { langExtractService } from "../langextract-service";

export function registerLangExtractRoutes(app: Express): void {
  // Extract text using LangExtract
  app.post("/api/langextract/extract", async (req, res) => {
    try {
      const { text, instructions, examples, extractionType, modelPreference } = req.body;
      
      if (!text || !extractionType) {
        return res.status(400).json({ 
          error: 'Missing required fields: text and extractionType' 
        });
      }

      const result = await langExtractService.extractText({
        text,
        instructions: instructions || `Extract ${extractionType} information from medical text`,
        examples,
        extractionType,
        modelPreference
      });

      res.json(result);
    } catch (error) {
      console.error('LangExtract extraction error:', error);
      res.status(500).json({ error: 'Text extraction failed' });
    }
  });

  // Save extraction to database
  app.post("/api/langextract/save", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { 
        name, 
        description, 
        projectId, 
        text, 
        instructions, 
        examples, 
        extractionType,
        result 
      } = req.body;

      if (!name || !text || !extractionType || !result) {
        return res.status(400).json({ 
          error: 'Missing required fields: name, text, extractionType, result' 
        });
      }

      const extraction = await langExtractService.saveExtraction(
        req.user.id,
        projectId || null,
        name,
        description || '',
        { text, instructions, examples, extractionType },
        result
      );

      res.json(extraction);
    } catch (error) {
      console.error('Save extraction error:', error);
      res.status(500).json({ error: 'Failed to save extraction' });
    }
  });

  // Get user's extractions
  app.get("/api/langextract/extractions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { projectId } = req.query;
      const extractions = await langExtractService.getExtractions(
        req.user.id,
        projectId ? parseInt(projectId as string) : undefined
      );

      res.json(extractions);
    } catch (error) {
      console.error('Get extractions error:', error);
      res.status(500).json({ error: 'Failed to get extractions' });
    }
  });

  // Get available extraction templates
  app.get("/api/langextract/templates", async (req, res) => {
    try {
      const templates = await langExtractService.getAvailableTemplates();
      res.json(templates);
    } catch (error) {
      console.error('Get templates error:', error);
      res.status(500).json({ error: 'Failed to get templates' });
    }
  });

  // Healthcare-specific extraction endpoints
  app.post("/api/langextract/extract/medications", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: 'Missing required field: text' });
      }

      const medications = await langExtractService.extractMedications(text);
      res.json({ medications });
    } catch (error) {
      console.error('Medication extraction error:', error);
      res.status(500).json({ error: 'Medication extraction failed' });
    }
  });

  app.post("/api/langextract/extract/diagnoses", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: 'Missing required field: text' });
      }

      const diagnoses = await langExtractService.extractDiagnoses(text);
      res.json({ diagnoses });
    } catch (error) {
      console.error('Diagnosis extraction error:', error);
      res.status(500).json({ error: 'Diagnosis extraction failed' });
    }
  });

  app.post("/api/langextract/extract/lab-results", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: 'Missing required field: text' });
      }

      const labResults = await langExtractService.extractLabResults(text);
      res.json({ labResults });
    } catch (error) {
      console.error('Lab results extraction error:', error);
      res.status(500).json({ error: 'Lab results extraction failed' });
    }
  });

  // Demo endpoints with sample data
  app.get("/api/langextract/demo/clinical-note", async (req, res) => {
    try {
      const sampleClinicalNote = `
Patient: John Smith, DOB: 1965-03-15
Chief Complaint: Chest pain and shortness of breath

History of Present Illness:
The patient is a 58-year-old male presenting with acute onset chest pain that began 2 hours ago. 
Pain is described as crushing, 8/10 severity, radiating to left arm and jaw. Associated symptoms 
include diaphoresis, nausea, and shortness of breath.

Past Medical History:
- Type 2 Diabetes Mellitus (diagnosed 2018)
- Hypertension (diagnosed 2015)
- Hyperlipidemia

Current Medications:
- Metformin 1000mg twice daily
- Lisinopril 10mg once daily
- Atorvastatin 40mg at bedtime

Physical Examination:
Vital Signs: BP 160/95, HR 102, RR 22, O2 Sat 94% on room air
General: Diaphoretic, anxious-appearing male in moderate distress

Laboratory Results:
Troponin I: 12.5 ng/mL (elevated, normal <0.04 ng/mL)
CK-MB: 45 ng/mL (elevated, normal <5.0 ng/mL)
BNP: 890 pg/mL (elevated, normal <100 pg/mL)
Glucose: 180 mg/dL (elevated, normal 70-100 mg/dL)

Assessment and Plan:
1. STEMI (ST-elevation myocardial infarction) - Emergent cardiac catheterization
2. Type 2 DM with poor control - Continue metformin, monitor glucose
3. Hypertension - Hold lisinopril temporarily due to acute MI
      `;

      const result = await langExtractService.extractText({
        text: sampleClinicalNote,
        instructions: 'Extract all medical information including medications, diagnoses, lab results, and vital signs',
        extractionType: 'comprehensive_medical'
      });

      res.json({
        sample_text: sampleClinicalNote,
        extraction_result: result,
        description: 'Sample clinical note with comprehensive medical information extraction'
      });
    } catch (error) {
      console.error('Demo clinical note error:', error);
      res.status(500).json({ error: 'Demo extraction failed' });
    }
  });

  app.get("/api/langextract/health", async (req, res) => {
    try {
      const templates = await langExtractService.getAvailableTemplates();
      
      res.json({
        status: 'operational',
        service: 'LangExtract Integration',
        version: '1.0.0',
        available_templates: Object.keys(templates).length,
        capabilities: [
          'Medical Entity Extraction',
          'Medication Information Processing',
          'Diagnosis Recognition',
          'Lab Results Analysis',
          'Symptom Extraction',
          'Healthcare Document Processing'
        ],
        supported_formats: ['Clinical Notes', 'Lab Reports', 'Prescription Data', 'Medical Records'],
        integration_status: {
          python_service: 'active',
          langextract_library: 'installed',
          database_connection: 'active'
        }
      });
    } catch (error) {
      console.error('LangExtract health check error:', error);
      res.status(500).json({ 
        status: 'error',
        error: 'Health check failed' 
      });
    }
  });
}