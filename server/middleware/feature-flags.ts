import { Request, Response, NextFunction } from 'express'

// Feature Flag Configuration
interface FeatureFlags {
  [key: string]: boolean | object
}

const defaultFlags: FeatureFlags = {
  // Core Platform Features
  medhelm_evaluation: true,
  cs_agent_optimization: true,
  voice_controlled_development: true,
  
  // Advanced Features
  advanced_ai_processing: false,
  real_time_collaboration: true,
  advanced_analytics: true,
  
  // Security Features
  enhanced_hipaa_compliance: true,
  advanced_audit_logging: true,
  multi_factor_auth: false,
  
  // Performance Features
  caching_optimization: true,
  lazy_loading: true,
  performance_monitoring: true,
  
  // Experimental Features
  ai_code_generation: false,
  automated_testing: true,
  deployment_automation: true,
  
  // Medical Features
  clinical_decision_support: true,
  medical_imaging_analysis: false,
  genomics_integration: false,
  
  // Business Features
  innovation_portfolio_tracking: true,
  revenue_analytics: true,
  competitive_analysis: true
}

// Environment-based feature overrides
const environmentFlags: { [env: string]: Partial<FeatureFlags> } = {
  development: {
    advanced_ai_processing: true,
    ai_code_generation: true,
    medical_imaging_analysis: true,
    genomics_integration: true,
    multi_factor_auth: true
  },
  production: {
    advanced_ai_processing: false,
    ai_code_generation: false,
    medical_imaging_analysis: false,
    genomics_integration: false
  },
  testing: {
    // All features enabled for comprehensive testing
    advanced_ai_processing: true,
    ai_code_generation: true,
    medical_imaging_analysis: true,
    genomics_integration: true,
    multi_factor_auth: true,
    automated_testing: true
  }
}

class FeatureFlagManager {
  private flags: FeatureFlags
  
  constructor() {
    const env = process.env.NODE_ENV || 'development'
    this.flags = {
      ...defaultFlags,
      ...(environmentFlags[env] || {})
    }
    
    console.log(`🚩 Feature flags initialized for ${env} environment`)
    this.logEnabledFeatures()
  }
  
  isEnabled(flag: string): boolean {
    return Boolean(this.flags[flag])
  }
  
  getFlag(flag: string): any {
    return this.flags[flag]
  }
  
  getAllFlags(): FeatureFlags {
    return { ...this.flags }
  }
  
  setFlag(flag: string, value: boolean | object): void {
    this.flags[flag] = value
    console.log(`🚩 Feature flag updated: ${flag} = ${value}`)
  }
  
  private logEnabledFeatures(): void {
    const enabledFeatures = Object.entries(this.flags)
      .filter(([_, value]) => value === true)
      .map(([key, _]) => key)
    
    console.log(`🚩 Enabled features: ${enabledFeatures.join(', ')}`)
  }
}

export const featureFlags = new FeatureFlagManager()

// Middleware to inject feature flags into request
export const injectFeatureFlags = (req: Request, res: Response, next: NextFunction) => {
  (req as any).featureFlags = {
    isEnabled: (flag: string) => featureFlags.isEnabled(flag),
    getFlag: (flag: string) => featureFlags.getFlag(flag),
    getAllFlags: () => featureFlags.getAllFlags()
  }
  
  next()
}

// Middleware to protect routes behind feature flags
export const requireFeatureFlag = (flag: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!featureFlags.isEnabled(flag)) {
      return res.status(404).json({
        error: 'Feature not available',
        message: `The feature '${flag}' is currently disabled`,
        feature_flag: flag
      })
    }
    
    next()
  }
}

// API endpoint to get feature flags (for frontend)
export const getFeatureFlags = (req: Request, res: Response) => {
  const publicFlags = featureFlags.getAllFlags()
  
  res.json({
    features: publicFlags,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  })
}

// API endpoint to update feature flags (admin only)
export const updateFeatureFlag = (req: Request, res: Response) => {
  const { flag, value } = req.body
  
  if (!flag || value === undefined) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['flag', 'value']
    })
  }
  
  featureFlags.setFlag(flag, value)
  
  res.json({
    success: true,
    flag,
    value,
    timestamp: new Date().toISOString()
  })
}