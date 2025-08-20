import type { Express } from "express";
import { medHELMService } from "../medhelm-service";

export function registerMedHELMRoutes(app: Express) {
  // Clinical Decision Support API
  app.post("/api/medhelm/clinical-decision", async (req, res) => {
    try {
      const { patientData } = req.body;
      const result = await medHELMService.provideClinicalDecisionSupport(patientData);
      res.json(result);
    } catch (error) {
      console.error('Clinical decision API error:', error);
      res.status(500).json({ error: 'Clinical decision support failed' });
    }
  });

  // Medical Knowledge Retrieval API
  app.post("/api/medhelm/knowledge", async (req, res) => {
    try {
      const { query } = req.body;
      const result = await medHELMService.retrieveMedicalKnowledge(query);
      res.json(result);
    } catch (error) {
      console.error('Medical knowledge API error:', error);
      res.status(500).json({ error: 'Medical knowledge retrieval failed' });
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