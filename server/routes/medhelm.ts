import type { Express } from "express";
import { medHELMService } from "../medhelm-service";

export function registerMedHELMRoutes(app: Express) {
  // MedHELM Model Recommendation API
  app.post("/api/medhelm/recommend-model", async (req, res) => {
    try {
      const { medicalTask, specialty } = req.body;
      const result = await medHELMService.recommendModelForTask(medicalTask, specialty);
      res.json(result);
    } catch (error) {
      console.error('MedHELM model recommendation error:', error);
      res.status(500).json({ error: 'Model recommendation failed' });
    }
  });

  // Clinical Task Analysis API (with MedHELM-recommended model)
  app.post("/api/medhelm/clinical-analysis", async (req, res) => {
    try {
      const { patientData } = req.body;
      const result = await medHELMService.analyzeClinicalTask(patientData);
      res.json(result);
    } catch (error) {
      console.error('Clinical analysis API error:', error);
      res.status(500).json({ error: 'Clinical analysis failed' });
    }
  });

  // AI Response Quality Evaluation API
  app.post("/api/medhelm/evaluate-response", async (req, res) => {
    try {
      const { medicalContent, taskType } = req.body;
      const result = await medHELMService.evaluateResponseQuality(medicalContent, taskType);
      res.json(result);
    } catch (error) {
      console.error('Response evaluation API error:', error);
      res.status(500).json({ error: 'Response evaluation failed' });
    }
  });

  // Medical Knowledge Query API (with MedHELM model selection)
  app.post("/api/medhelm/knowledge-query", async (req, res) => {
    try {
      const { query } = req.body;
      const result = await medHELMService.queryMedicalKnowledge(query);
      res.json(result);
    } catch (error) {
      console.error('Medical knowledge query API error:', error);
      res.status(500).json({ error: 'Medical knowledge query failed' });
    }
  });

  // Medical NLP Processing API
  app.post("/api/medhelm/nlp", async (req, res) => {
    try {
      const { task } = req.body;
      const result = await medHELMService.processMedicalText(task);
      res.json(result);
    } catch (error) {
      console.error('Medical NLP API error:', error);
      res.status(500).json({ error: 'Medical NLP processing failed' });
    }
  });

  // Patient Care Optimization API
  app.post("/api/medhelm/optimize-care", async (req, res) => {
    try {
      const { patientProfile } = req.body;
      const result = await medHELMService.optimizePatientCare(patientProfile);
      res.json(result);
    } catch (error) {
      console.error('Patient care optimization API error:', error);
      res.status(500).json({ error: 'Patient care optimization failed' });
    }
  });

  // Medical Education API
  app.post("/api/medhelm/education", async (req, res) => {
    try {
      const { topic } = req.body;
      const result = await medHELMService.provideMedicalEducation(topic);
      res.json(result);
    } catch (error) {
      console.error('Medical education API error:', error);
      res.status(500).json({ error: 'Medical education content generation failed' });
    }
  });

  // MedHELM Service Health Check
  app.get("/api/medhelm/health", async (req, res) => {
    try {
      const result = await medHELMService.getServiceHealth();
      res.json(result);
    } catch (error) {
      console.error('MedHELM health check error:', error);
      res.status(500).json({ error: 'MedHELM health check failed' });
    }
  });

  // Demo endpoints for testing MedHELM capabilities
  app.get("/api/medhelm/demo/clinical-case", async (req, res) => {
    try {
      // Demo clinical case for testing
      const demoCase = {
        symptoms: ['chest pain', 'shortness of breath', 'fatigue'],
        medicalHistory: ['hypertension', 'diabetes mellitus type 2'],
        currentMedications: ['metformin 500mg bid', 'lisinopril 10mg daily'],
        vitalSigns: {
          bp_systolic: 150,
          bp_diastolic: 90,
          heart_rate: 95,
          temperature: 98.6,
          respiratory_rate: 18,
          oxygen_saturation: 96
        },
        labResults: {
          glucose: 180,
          hba1c: 8.2,
          creatinine: 1.1,
          troponin: 0.02
        }
      };

      const result = await medHELMService.provideClinicalDecisionSupport(demoCase);
      res.json({
        demo: true,
        sampleCase: demoCase,
        medHELMResponse: result
      });
    } catch (error) {
      console.error('Demo clinical case error:', error);
      res.status(500).json({ error: 'Demo clinical case failed' });
    }
  });

  app.get("/api/medhelm/demo/knowledge-query", async (req, res) => {
    try {
      // Demo knowledge query
      const demoQuery = {
        condition: 'Type 2 Diabetes Mellitus',
        specialty: 'Endocrinology',
        evidenceLevel: 'systematic_review' as const
      };

      const result = await medHELMService.retrieveMedicalKnowledge(demoQuery);
      res.json({
        demo: true,
        sampleQuery: demoQuery,
        medHELMResponse: result
      });
    } catch (error) {
      console.error('Demo knowledge query error:', error);
      res.status(500).json({ error: 'Demo knowledge query failed' });
    }
  });
}