import type { Express } from "express";
import { csAgent } from "../platform-optimization-service";

export function registerCSAgentRoutes(app: Express) {
  // CS Agent Status and Health Check
  app.get("/api/cs-agent/status", async (req, res) => {
    try {
      const status = await csAgent.getCSAgentStatus();
      res.json(status);
    } catch (error) {
      console.error('CS Agent status check failed:', error);
      res.status(500).json({ error: 'CS Agent status check failed' });
    }
  });

  // Platform Health Analysis
  app.get("/api/cs-agent/platform-health", async (req, res) => {
    try {
      const health = await csAgent.analyzePlatformHealth();
      res.json(health);
    } catch (error) {
      console.error('Platform health analysis failed:', error);
      res.status(500).json({ error: 'Platform health analysis failed' });
    }
  });

  // Code Quality Analysis
  app.get("/api/cs-agent/code-quality", async (req, res) => {
    try {
      const analysis = await csAgent.analyzeCodeQuality();
      res.json(analysis);
    } catch (error) {
      console.error('Code quality analysis failed:', error);
      res.status(500).json({ error: 'Code quality analysis failed' });
    }
  });

  // Performance Optimization
  app.post("/api/cs-agent/optimize-performance", async (req, res) => {
    try {
      const optimization = await csAgent.optimizePerformance();
      res.json(optimization);
    } catch (error) {
      console.error('Performance optimization failed:', error);
      res.status(500).json({ error: 'Performance optimization failed' });
    }
  });

  // Security Analysis
  app.get("/api/cs-agent/security-analysis", async (req, res) => {
    try {
      const security = await csAgent.analyzeSecurity();
      res.json(security);
    } catch (error) {
      console.error('Security analysis failed:', error);
      res.status(500).json({ error: 'Security analysis failed' });
    }
  });

  // Architecture Optimization
  app.get("/api/cs-agent/architecture", async (req, res) => {
    try {
      const architecture = await csAgent.optimizeArchitecture();
      res.json(architecture);
    } catch (error) {
      console.error('Architecture optimization failed:', error);
      res.status(500).json({ error: 'Architecture optimization failed' });
    }
  });

  // Comprehensive Optimization Report
  app.get("/api/cs-agent/optimization-report", async (req, res) => {
    try {
      const report = await csAgent.generateOptimizationReport();
      res.json(report);
    } catch (error) {
      console.error('CS Agent optimization report failed:', error);
      res.status(500).json({ error: 'Optimization report generation failed' });
    }
  });
}