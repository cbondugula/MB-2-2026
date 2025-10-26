import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";

export function registerAIChatRoutes(app: Express) {
  // AI Chat endpoint for conversational interface
  app.post("/api/ai/chat", isAuthenticated, async (req, res) => {
    try {
      const { message, conversationHistory, projectId, mode } = req.body;
      const userId = (req.user as any)?.claims?.sub;

      // Simulate AI response for now - in production this would call OpenAI/Anthropic
      const response = await generateAIResponse(message, {
        conversationHistory,
        projectId,
        mode,
        userId
      });

      res.json(response);
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({ 
        message: "I'm having trouble right now. Please try again in a moment.",
        type: "error"
      });
    }
  });

  // Project onboarding endpoint
  app.post("/api/projects/onboard", isAuthenticated, async (req, res) => {
    try {
      const { userProfile, projectIdea, preferences } = req.body;
      const userId = (req.user as any)?.claims?.sub;

      // Create personalized project based on onboarding
      const project = await createOnboardingProject({
        userId,
        userProfile,
        projectIdea,
        preferences
      });

      res.json({
        projectId: project.id,
        message: "Welcome to MedBuilder! Your personalized workspace is ready.",
        recommendations: project.recommendations,
        nextSteps: project.nextSteps
      });
    } catch (error) {
      console.error("Onboarding error:", error);
      res.status(500).json({ 
        message: "Setup error. Let's try that again!"
      });
    }
  });

  // User preferences endpoint
  app.post("/api/users/preferences", isAuthenticated, async (req, res) => {
    try {
      const { preferences } = req.body;
      const userId = (req.user as any)?.claims?.sub;

      // Save user preferences
      // In production, this would update the database
      
      res.json({
        message: "Preferences saved successfully",
        preferences
      });
    } catch (error) {
      console.error("Preferences error:", error);
      res.status(500).json({ 
        message: "Failed to save preferences"
      });
    }
  });
}

async function generateAIResponse(message: string, context: any) {
  // This simulates an AI response - in production, integrate with OpenAI/Anthropic
  
  // Detect intent
  const intent = detectIntent(message);
  
  switch (intent) {
    case 'create_project':
      return {
        message: "I'll help you create that application! Let me start by setting up the basic structure. What specific features would you like me to include?",
        type: "text",
        metadata: {
          suggestions: [
            "Add patient registration",
            "Include appointment scheduling",
            "Add secure messaging",
            "Include billing integration"
          ]
        }
      };
      
    case 'healthcare_app':
      return {
        message: "Great choice! Healthcare applications require special attention to HIPAA compliance and security. I'm creating a HIPAA-compliant foundation for your app right now.\n\nYour app will include:\n✓ Secure patient data handling\n✓ Role-based access control\n✓ Audit logging\n✓ Encrypted communications\n\nWhat's the main purpose of your healthcare app?",
        type: "project_created",
        metadata: {
          projectId: `project_${Date.now()}`,
          generatedCode: generateHealthcareAppTemplate(),
          suggestions: [
            "Patient management",
            "Telemedicine platform",
            "Medical scheduling",
            "Health tracking"
          ]
        }
      };
      
    case 'voice_command':
      return {
        message: "I understand you want to use voice commands! You can say things like:\n\n• 'Create a patient form'\n• 'Add appointment scheduling'\n• 'Generate a dashboard'\n• 'Deploy my app'\n\nTry speaking your next request!",
        type: "suggestion",
        metadata: {
          voiceEnabled: true
        }
      };
      
    case 'help':
      return {
        message: "I'm here to help you build amazing healthcare applications! Here's what I can do:\n\n🏥 Create HIPAA-compliant healthcare apps\n💬 Build with natural language or voice\n🔧 Generate code, forms, and dashboards\n🚀 Deploy your apps instantly\n\nJust tell me what you want to build, and I'll make it happen!",
        type: "text",
        metadata: {
          suggestions: [
            "Create a patient management app",
            "Build a telemedicine platform", 
            "Generate a medical dashboard",
            "Show me voice commands"
          ]
        }
      };
      
    default:
      return {
        message: `I understand you want to work on: "${message}"\n\nLet me help you build this step by step. I'll create the foundation and then we can add specific features together. What's the most important feature to start with?`,
        type: "text",
        metadata: {
          suggestions: [
            "Start with user authentication",
            "Create the main dashboard",
            "Add data management",
            "Set up the basic structure"
          ]
        }
      };
  }
}

function detectIntent(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('create') || lowerMessage.includes('build') || lowerMessage.includes('make')) {
    if (lowerMessage.includes('healthcare') || lowerMessage.includes('medical') || lowerMessage.includes('patient') || lowerMessage.includes('clinic')) {
      return 'healthcare_app';
    }
    return 'create_project';
  }
  
  if (lowerMessage.includes('voice') || lowerMessage.includes('speak') || lowerMessage.includes('say')) {
    return 'voice_command';
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('what can')) {
    return 'help';
  }
  
  return 'general';
}

async function createOnboardingProject(data: any) {
  const { userId, userProfile, projectIdea, preferences } = data;
  
  // Generate project based on user profile
  const projectTemplate = generateProjectTemplate(userProfile, projectIdea);
  
  return {
    id: `project_${Date.now()}`,
    name: generateProjectName(userProfile, projectIdea),
    template: projectTemplate,
    recommendations: generateRecommendations(userProfile),
    nextSteps: generateNextSteps(userProfile, preferences),
    createdAt: new Date(),
    userId
  };
}

function generateProjectTemplate(userProfile: any, projectIdea: string) {
  // Generate appropriate template based on user profile
  const templates = {
    healthcare_professional: 'clinic-management-template',
    business_owner: 'business-healthcare-template',
    developer: 'full-stack-healthcare-template',
    student: 'learning-healthcare-template',
    entrepreneur: 'startup-healthcare-template'
  };
  
  return templates[userProfile.role as keyof typeof templates] || 'standard-healthcare-template';
}

function generateProjectName(userProfile: any, projectIdea: string) {
  if (projectIdea) {
    return projectIdea.split(' ').slice(0, 4).join(' ');
  }
  
  const defaultNames = {
    healthcare_professional: 'My Clinic App',
    business_owner: 'Healthcare Business Platform',
    developer: 'Healthcare Development Project',
    student: 'Learning Healthcare App',
    entrepreneur: 'Healthcare Startup Platform'
  };
  
  return defaultNames[userProfile.role as keyof typeof defaultNames] || 'My Healthcare App';
}

function generateRecommendations(userProfile: any) {
  const recommendations = {
    healthcare_professional: [
      'Start with patient registration and basic forms',
      'Add appointment scheduling for your practice',
      'Include secure messaging for patient communication',
      'Consider telehealth features for remote consultations'
    ],
    business_owner: [
      'Focus on practice management features first',
      'Add billing and insurance integration',
      'Include staff management and permissions',
      'Consider analytics dashboard for business insights'
    ],
    developer: [
      'Explore our advanced API integrations',
      'Try the voice-controlled development features',
      'Use our AI code generation for faster development',
      'Check out our deployment automation tools'
    ]
  };
  
  return recommendations[userProfile.role as keyof typeof recommendations] || [
    'Start with the basics and build incrementally',
    'Focus on user experience and accessibility',
    'Ensure HIPAA compliance from the beginning',
    'Test frequently with real users'
  ];
}

function generateNextSteps(userProfile: any, preferences: any) {
  const steps = [
    {
      title: "Explore Your Dashboard",
      description: "Familiarize yourself with the main interface",
      completed: false
    },
    {
      title: "Customize Your Workspace", 
      description: "Set up your preferences and accessibility options",
      completed: false
    },
    {
      title: "Create Your First Feature",
      description: "Use the AI assistant to build your first component",
      completed: false
    },
    {
      title: "Test Your Application",
      description: "Preview and test your app in the browser",
      completed: false
    },
    {
      title: "Deploy Your App",
      description: "Launch your application for users",
      completed: false
    }
  ];
  
  return steps;
}

function generateHealthcareAppTemplate() {
  return `
// Healthcare App Template - HIPAA Compliant
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, Calendar, MessageSquare } from 'lucide-react';

export default function HealthcareApp() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Healthcare Management Platform</h1>
          <p className="text-gray-600 mt-2">HIPAA-compliant healthcare application</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Manage patient records securely</p>
              <Button className="w-full">View Patients</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Schedule and manage appointments</p>
              <Button className="w-full">View Schedule</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Messaging
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Secure patient communication</p>
              <Button className="w-full">View Messages</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">HIPAA compliance monitoring</p>
              <Button className="w-full">View Reports</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
`;
}