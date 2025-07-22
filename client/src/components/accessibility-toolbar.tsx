import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Accessibility, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Type, 
  Contrast, 
  MousePointer, 
  Keyboard,
  Mic,
  Globe,
  Settings,
  X,
  Plus,
  Minus,
  RotateCcw
} from "lucide-react";

interface AccessibilitySettings {
  fontSize: number;
  contrast: 'normal' | 'high' | 'higher';
  motionReduced: boolean;
  screenReader: boolean;
  voiceCommands: boolean;
  keyboardNavigation: boolean;
  colorBlindFriendly: boolean;
  language: string;
  autoRead: boolean;
  focusIndicators: boolean;
}

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 100,
    contrast: 'normal',
    motionReduced: false,
    screenReader: false,
    voiceCommands: true,
    keyboardNavigation: true,
    colorBlindFriendly: false,
    language: 'en',
    autoRead: false,
    focusIndicators: true
  });

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    root.style.setProperty('--accessibility-font-scale', `${settings.fontSize / 100}`);
    
    // High contrast
    if (settings.contrast === 'high') {
      root.classList.add('high-contrast');
      root.classList.remove('higher-contrast');
    } else if (settings.contrast === 'higher') {
      root.classList.add('higher-contrast');
      root.classList.remove('high-contrast');
    } else {
      root.classList.remove('high-contrast', 'higher-contrast');
    }
    
    // Reduced motion
    if (settings.motionReduced) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Color blind friendly
    if (settings.colorBlindFriendly) {
      root.classList.add('color-blind-friendly');
    } else {
      root.classList.remove('color-blind-friendly');
    }
    
    // Focus indicators
    if (settings.focusIndicators) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }
  }, [settings]);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load accessibility settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings({
      fontSize: 100,
      contrast: 'normal',
      motionReduced: false,
      screenReader: false,
      voiceCommands: true,
      keyboardNavigation: true,
      colorBlindFriendly: false,
      language: 'en',
      autoRead: false,
      focusIndicators: true
    });
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'ar', name: 'العربية' }
  ];

  return (
    <>
      {/* Floating Accessibility Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          aria-label="Open accessibility settings"
        >
          <Accessibility className="w-6 h-6" />
        </Button>
      </div>

      {/* Accessibility Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Accessibility className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Accessibility Settings</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetSettings}
                  className="flex items-center gap-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close accessibility settings"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <CardContent className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                {/* Visual Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Visual Settings
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Font Size */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Type className="w-4 h-4" />
                          Text Size
                        </label>
                        <Badge variant="secondary">{settings.fontSize}%</Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateSetting('fontSize', Math.max(75, settings.fontSize - 25))}
                          disabled={settings.fontSize <= 75}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Slider
                          value={[settings.fontSize]}
                          onValueChange={([value]) => updateSetting('fontSize', value)}
                          min={75}
                          max={200}
                          step={25}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateSetting('fontSize', Math.min(200, settings.fontSize + 25))}
                          disabled={settings.fontSize >= 200}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Contrast */}
                    <div>
                      <label className="text-sm font-medium flex items-center gap-2 mb-2">
                        <Contrast className="w-4 h-4" />
                        Contrast
                      </label>
                      <div className="flex gap-2">
                        {[
                          { value: 'normal', label: 'Normal' },
                          { value: 'high', label: 'High' },
                          { value: 'higher', label: 'Higher' }
                        ].map((option) => (
                          <Button
                            key={option.value}
                            variant={settings.contrast === option.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateSetting('contrast', option.value as any)}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Visual Toggles */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Reduce Motion</label>
                        <Switch
                          checked={settings.motionReduced}
                          onCheckedChange={(checked) => updateSetting('motionReduced', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Color Blind Friendly</label>
                        <Switch
                          checked={settings.colorBlindFriendly}
                          onCheckedChange={(checked) => updateSetting('colorBlindFriendly', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Enhanced Focus Indicators</label>
                        <Switch
                          checked={settings.focusIndicators}
                          onCheckedChange={(checked) => updateSetting('focusIndicators', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Audio & Voice Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    Audio & Voice
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Volume2 className="w-4 h-4" />
                        Screen Reader Support
                      </label>
                      <Switch
                        checked={settings.screenReader}
                        onCheckedChange={(checked) => updateSetting('screenReader', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Mic className="w-4 h-4" />
                        Voice Commands
                      </label>
                      <Switch
                        checked={settings.voiceCommands}
                        onCheckedChange={(checked) => updateSetting('voiceCommands', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Auto-Read Content</label>
                      <Switch
                        checked={settings.autoRead}
                        onCheckedChange={(checked) => updateSetting('autoRead', checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Navigation Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MousePointer className="w-5 h-5" />
                    Navigation
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Keyboard className="w-4 h-4" />
                        Keyboard Navigation
                      </label>
                      <Switch
                        checked={settings.keyboardNavigation}
                        onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Language Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Language
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {languages.map((lang) => (
                      <Button
                        key={lang.code}
                        variant={settings.language === lang.code ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateSetting('language', lang.code)}
                        className="justify-start"
                      >
                        {lang.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Quick Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateSetting('fontSize', 150);
                        updateSetting('contrast', 'high');
                        updateSetting('focusIndicators', true);
                      }}
                    >
                      Vision Assistance
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateSetting('keyboardNavigation', true);
                        updateSetting('screenReader', true);
                        updateSetting('autoRead', true);
                      }}
                    >
                      Motor Assistance
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateSetting('fontSize', 125);
                        updateSetting('motionReduced', true);
                        updateSetting('autoRead', true);
                      }}
                    >
                      Cognitive Assistance
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add accessibility CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .high-contrast {
          filter: contrast(150%) brightness(1.2);
        }
        
        .higher-contrast {
          filter: contrast(200%) brightness(1.4);
        }
        
        .reduce-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        
        .color-blind-friendly {
          --blue: 0 0 255;
          --green: 0 255 0;
          --red: 255 0 0;
          --yellow: 255 255 0;
          --orange: 255 165 0;
          --purple: 128 0 128;
        }
        
        .enhanced-focus *:focus {
          outline: 3px solid #3b82f6 !important;
          outline-offset: 2px !important;
        }
        
        * {
          font-size: calc(1em * var(--accessibility-font-scale, 1));
        }
        `
      }} />
    </>
  );
}