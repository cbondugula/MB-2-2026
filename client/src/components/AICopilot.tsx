import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Bot, 
  Shield, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  ChevronDown,
  ChevronRight,
  Lightbulb,
  BookOpen,
  Zap,
  Info
} from "lucide-react";
import { useState } from "react";

interface HintItem {
  id: string;
  type: "tip" | "warning" | "info" | "success";
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  description?: string;
}

interface AICopilotProps {
  context?: "workspace" | "templates" | "general";
  projectType?: string;
  onSuggestionClick?: (suggestion: string) => void;
}

const HIPAA_CHECKLIST: ChecklistItem[] = [
  { id: "phi-scan", label: "PHI scanning enabled", completed: true, description: "Automatic detection of protected health information" },
  { id: "encryption", label: "Data encryption at rest", completed: true, description: "AES-256 encryption for stored data" },
  { id: "audit-log", label: "Audit logging active", completed: true, description: "All access and changes are recorded" },
  { id: "access-control", label: "Role-based access", completed: false, description: "Configure user permissions" },
  { id: "baa", label: "BAA in place", completed: false, description: "Business Associate Agreement required for production" },
];

const FHIR_HINTS: HintItem[] = [
  {
    id: "patient-resource",
    type: "tip",
    title: "Patient Resource",
    description: "Use the Patient resource for demographic data. Include identifiers, names, and contact info.",
  },
  {
    id: "observation",
    type: "tip", 
    title: "Observations for Vitals",
    description: "Store vital signs as Observation resources with appropriate LOINC codes.",
  },
  {
    id: "encounter",
    type: "info",
    title: "Encounter Tracking",
    description: "Link all clinical data to an Encounter for proper visit context.",
  },
];

const QUICK_SUGGESTIONS = [
  "Add patient authentication",
  "Implement secure messaging",
  "Add appointment scheduling",
  "Create clinical notes form",
  "Add lab results display",
  "Implement e-prescribing",
];

export function AICopilot({ context = "general", projectType, onSuggestionClick }: AICopilotProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["hipaa", "suggestions"]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "tip": return <Lightbulb className="w-4 h-4 text-yellow-400" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "success": return <CheckCircle className="w-4 h-4 text-[#76B900]" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const completedCount = HIPAA_CHECKLIST.filter(item => item.completed).length;
  const totalCount = HIPAA_CHECKLIST.length;
  const compliancePercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#76B900] rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-medium">AI Copilot</h3>
            <p className="text-gray-400 text-xs">Compliance & FHIR guidance</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <Collapsible open={expandedSections.includes("hipaa")}>
            <CollapsibleTrigger 
              onClick={() => toggleSection("hipaa")}
              className="flex items-center justify-between w-full p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#76B900]" />
                <span className="text-white font-medium text-sm">HIPAA Compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={compliancePercentage === 100 ? "bg-[#76B900]" : "bg-amber-600"}>
                  {compliancePercentage}%
                </Badge>
                {expandedSections.includes("hipaa") ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2">
              {HIPAA_CHECKLIST.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-800/50"
                >
                  <div className={`mt-0.5 ${item.completed ? 'text-[#76B900]' : 'text-gray-500'}`}>
                    {item.completed ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-current" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${item.completed ? 'text-gray-300' : 'text-gray-400'}`}>
                      {item.label}
                    </p>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={expandedSections.includes("fhir")}>
            <CollapsibleTrigger 
              onClick={() => toggleSection("fhir")}
              className="flex items-center justify-between w-full p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="text-white font-medium text-sm">FHIR R4 Hints</span>
              </div>
              {expandedSections.includes("fhir") ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2">
              {FHIR_HINTS.map((hint) => (
                <div 
                  key={hint.id}
                  className="p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getTypeIcon(hint.type)}
                    <span className="text-white text-sm font-medium">{hint.title}</span>
                  </div>
                  <p className="text-gray-400 text-xs">{hint.description}</p>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={expandedSections.includes("suggestions")}>
            <CollapsibleTrigger 
              onClick={() => toggleSection("suggestions")}
              className="flex items-center justify-between w-full p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-medium text-sm">Quick Actions</span>
              </div>
              {expandedSections.includes("suggestions") ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="flex flex-wrap gap-2">
                {QUICK_SUGGESTIONS.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    className="text-xs border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                    onClick={() => onSuggestionClick?.(suggestion)}
                    data-testid={`suggestion-${suggestion.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={expandedSections.includes("learn")}>
            <CollapsibleTrigger 
              onClick={() => toggleSection("learn")}
              className="flex items-center justify-between w-full p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span className="text-white font-medium text-sm">Learn More</span>
              </div>
              {expandedSections.includes("learn") ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2">
              <a 
                href="/academy" 
                className="block p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors"
              >
                <p className="text-white text-sm font-medium">MedBuilder Academy</p>
                <p className="text-gray-400 text-xs mt-1">Free courses on healthcare app development</p>
              </a>
              <a 
                href="/documentation" 
                className="block p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors"
              >
                <p className="text-white text-sm font-medium">Documentation</p>
                <p className="text-gray-400 text-xs mt-1">API reference and guides</p>
              </a>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  );
}
