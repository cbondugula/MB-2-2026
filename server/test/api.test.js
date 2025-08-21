import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../index.ts'

describe('API Endpoints', () => {
  let server

  beforeAll(async () => {
    server = app.listen(0) // Use random available port for testing
  })

  afterAll(async () => {
    await server.close()
  })

  describe('Health Checks', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200)

      expect(response.body).toHaveProperty('status', 'healthy')
      expect(response.body).toHaveProperty('timestamp')
    })
  })

  describe('CS Agent Endpoints', () => {
    it('should return CS Agent status', async () => {
      const response = await request(app)
        .get('/api/cs-agent/status')
        .expect(200)

      expect(response.body).toHaveProperty('service', 'cs_agent')
      expect(response.body).toHaveProperty('status', 'operational')
    })

    it('should perform comprehensive testing', async () => {
      const response = await request(app)
        .post('/api/cs-agent/comprehensive-testing')
        .expect(200)

      expect(response.body).toHaveProperty('overall_platform_health')
      expect(response.body).toHaveProperty('test_results')
      expect(response.body).toHaveProperty('cicd_status')
    })
  })

  describe('MedHELM Endpoints', () => {
    it('should recommend models for medical tasks', async () => {
      const response = await request(app)
        .post('/api/medhelm/recommend-model')
        .send({
          medicalTask: 'clinical_decision_support',
          specialty: 'cardiology'
        })
        .expect(200)

      expect(response.body).toHaveProperty('recommendedModel')
      expect(response.body).toHaveProperty('confidence')
    })

    it('should evaluate medical responses', async () => {
      const response = await request(app)
        .post('/api/medhelm/evaluate-response')
        .send({
          medicalContent: 'Patient has chest pain with elevated troponin',
          taskType: 'clinical_assessment'
        })
        .expect(200)

      expect(response.body).toHaveProperty('evaluation')
      expect(response.body).toHaveProperty('clinicalAccuracy')
    })
  })
})