// Tier-based update strategy for healthcare platform
export enum UpdateTier {
  HEALTHCARE_CRITICAL = 'healthcare_critical',  // Real-time for safety
  USER_EXPERIENCE = 'user_experience',          // Periodic for UX
  IP_PROTECTED = 'ip_protected'                 // Manual-only for IP
}

export interface UpdateConfig {
  tier: UpdateTier;
  intervalMinutes: number;
  criticalAlerts: boolean;
  description: string;
}

// Update configuration for different data types
export const UPDATE_CONFIGS: Record<string, UpdateConfig> = {
  // Healthcare Critical - Real-time for safety
  '/api/compliance/violations': {
    tier: UpdateTier.HEALTHCARE_CRITICAL,
    intervalMinutes: 5,
    criticalAlerts: true,
    description: 'HIPAA compliance violations - immediate alerts required'
  },
  '/api/healthcare/alerts': {
    tier: UpdateTier.HEALTHCARE_CRITICAL,
    intervalMinutes: 2,
    criticalAlerts: true,
    description: 'Patient safety and medical alerts'
  },
  '/api/system/health': {
    tier: UpdateTier.HEALTHCARE_CRITICAL,
    intervalMinutes: 10,
    criticalAlerts: true,
    description: 'Healthcare system status monitoring'
  },

  // User Experience - Periodic updates for good UX
  '/api/users/stats': {
    tier: UpdateTier.USER_EXPERIENCE,
    intervalMinutes: 30,
    criticalAlerts: false,
    description: 'User activity and development statistics'
  },
  '/api/activities/recent': {
    tier: UpdateTier.USER_EXPERIENCE,
    intervalMinutes: 60,
    criticalAlerts: false,
    description: 'Recent development activities'
  },
  '/api/projects': {
    tier: UpdateTier.USER_EXPERIENCE,
    intervalMinutes: 120,
    criticalAlerts: false,
    description: 'Project status and progress'
  },

  // IP Protected - HIGHLY PROTECTED - Manual only for trade secret protection
  '/api/patents/portfolio': {
    tier: UpdateTier.IP_PROTECTED,
    intervalMinutes: -1, // Never auto-update
    criticalAlerts: false,
    description: 'CLASSIFIED: Patent information - manual refresh only'
  },
  '/api/patents/filing-status': {
    tier: UpdateTier.IP_PROTECTED,
    intervalMinutes: -1,
    criticalAlerts: false,
    description: 'CLASSIFIED: Patent filing status - highly protected'
  },
  '/api/patents/domain-expansion': {
    tier: UpdateTier.IP_PROTECTED,
    intervalMinutes: -1,
    criticalAlerts: false,
    description: 'CLASSIFIED: Domain expansion strategy - trade secret'
  },
  '/api/competitive/analysis': {
    tier: UpdateTier.IP_PROTECTED,
    intervalMinutes: -1,
    criticalAlerts: false,
    description: 'CLASSIFIED: Competitive intelligence - highly protected'
  },
  '/api/revenue/projections': {
    tier: UpdateTier.IP_PROTECTED,
    intervalMinutes: -1,
    criticalAlerts: false,
    description: 'CLASSIFIED: Strategic valuations - trade secret protected'
  },
  '/api/acquisition/valuations': {
    tier: UpdateTier.IP_PROTECTED,
    intervalMinutes: -1,
    criticalAlerts: false,
    description: 'CLASSIFIED: Acquisition values - highly sensitive'
  },
  '/api/voice-backend/generate': {
    tier: UpdateTier.IP_PROTECTED,
    intervalMinutes: -1,
    criticalAlerts: false,
    description: 'CLASSIFIED: Voice backend technology - proprietary'
  },
  '/api/voice-database/manage': {
    tier: UpdateTier.IP_PROTECTED,
    intervalMinutes: -1,
    criticalAlerts: false,
    description: 'CLASSIFIED: Voice database technology - proprietary'
  },
  '/api/ml/voice-training': {
    tier: UpdateTier.IP_PROTECTED,
    intervalMinutes: -1,
    criticalAlerts: false,
    description: 'CLASSIFIED: Voice ML training - proprietary technology'
  }
};

// Get update config for an endpoint
export function getUpdateConfig(endpoint: string): UpdateConfig {
  return UPDATE_CONFIGS[endpoint] || {
    tier: UpdateTier.USER_EXPERIENCE,
    intervalMinutes: 60,
    criticalAlerts: false,
    description: 'Standard application data'
  };
}

// Check if endpoint should auto-update
export function shouldAutoUpdate(endpoint: string): boolean {
  const config = getUpdateConfig(endpoint);
  return config.intervalMinutes > 0;
}

// Get refresh interval for TanStack Query
export function getRefreshInterval(endpoint: string): number | false {
  const config = getUpdateConfig(endpoint);
  return config.intervalMinutes > 0 ? config.intervalMinutes * 60 * 1000 : false;
}