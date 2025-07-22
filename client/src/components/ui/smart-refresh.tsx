import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Badge } from './badge';
import { RefreshCw, Clock, AlertTriangle, Shield, Activity, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UpdateTier, getUpdateConfig } from '@/lib/update-strategy';

interface SmartRefreshProps {
  onManualRefresh: () => void;
  isLoading: boolean;
  lastUpdated?: Date;
  endpoint: string;
  className?: string;
}

export function SmartRefresh({
  onManualRefresh,
  isLoading,
  lastUpdated,
  endpoint,
  className = ""
}: SmartRefreshProps) {
  const [timeAgo, setTimeAgo] = useState<string>('');
  const [showStaleWarning, setShowStaleWarning] = useState(false);
  const { toast } = useToast();
  
  const config = getUpdateConfig(endpoint);
  const autoRefreshEnabled = config.intervalMinutes > 0;
  const criticalData = config.tier === UpdateTier.HEALTHCARE_CRITICAL;

  // Update time display
  useEffect(() => {
    if (!lastUpdated) return;

    const updateTimeAgo = () => {
      const now = new Date();
      const diffMs = now.getTime() - lastUpdated.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) {
        setTimeAgo('Just now');
        setShowStaleWarning(false);
      } else if (diffMins < 60) {
        setTimeAgo(`${diffMins}m ago`);
        // Show warning for critical healthcare data after 15 minutes
        setShowStaleWarning(criticalData && diffMins > 15);
      } else if (diffHours < 24) {
        setTimeAgo(`${diffHours}h ago`);
        // Show warning for any data after 2 hours
        setShowStaleWarning(diffHours > 2);
      } else {
        setTimeAgo('More than 1 day ago');
        setShowStaleWarning(true);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [lastUpdated, criticalData]);

  // Show stale data notification
  useEffect(() => {
    if (showStaleWarning && criticalData) {
      toast({
        title: "Data may be stale",
        description: "Consider refreshing for latest healthcare information",
        variant: "default",
      });
    }
  }, [showStaleWarning, criticalData, toast]);

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Manual Refresh Button */}
      <Button
        onClick={onManualRefresh}
        disabled={isLoading}
        variant="outline"
        size="sm"
        className="flex items-center space-x-2"
      >
        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        <span>{isLoading ? 'Updating...' : 'Refresh'}</span>
      </Button>

      {/* Last Updated Indicator */}
      {lastUpdated && (
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>{timeAgo}</span>
          {showStaleWarning && (
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
          )}
        </div>
      )}

      {/* Update Strategy Badge */}
      <Badge 
        variant={autoRefreshEnabled ? "secondary" : "outline"}
        className="text-xs flex items-center space-x-1"
      >
        {config.tier === UpdateTier.HEALTHCARE_CRITICAL && <Activity className="w-3 h-3" />}
        {config.tier === UpdateTier.USER_EXPERIENCE && <Clock className="w-3 h-3" />}
        {config.tier === UpdateTier.IP_PROTECTED && <Shield className="w-3 h-3" />}
        <span>
          {config.tier === UpdateTier.HEALTHCARE_CRITICAL ? 'Real-time' :
           config.tier === UpdateTier.USER_EXPERIENCE ? 'Smart Updates' :
           'HIGHLY PROTECTED'}
        </span>
      </Badge>
    </div>
  );
}

// Hook for smart update management
export function useSmartRefresh(
  queryKey: string,
  criticalData = false,
  autoRefreshThreshold = 15 // minutes
) {
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(criticalData);

  const shouldAutoRefresh = () => {
    if (!autoRefreshEnabled || !lastUpdated) return false;
    
    const now = new Date();
    const diffMins = (now.getTime() - lastUpdated.getTime()) / 60000;
    return diffMins > autoRefreshThreshold;
  };

  const markUpdated = () => {
    setLastUpdated(new Date());
  };

  const toggleAutoRefresh = () => {
    setAutoRefreshEnabled(!autoRefreshEnabled);
  };

  return {
    lastUpdated,
    autoRefreshEnabled,
    shouldAutoRefresh,
    markUpdated,
    toggleAutoRefresh
  };
}