import { db } from "./db";
import { 
  users, 
  projects, 
  templates, 
  components,
  healthcareDomains,
  healthcareAgents,
  healthcareStandards,
  healthcareSimulations,
  techStacks,
  aiModels,
  codeExamples,
  buildCapabilities,
  gitRepositories,
  deployments,
  codeReviews,
  previewEnvironments,
  buildHistory,
  environmentVariables,
  projectCollaborators,
  pricingPlans,
  executiveMetrics,
  executiveROI,
  executiveCompetitive,
  executiveRevenue,
  platformMetrics,
  revenueProjections,
  competitiveAnalysis,
  ipPortfolio
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { seedPlatformAnalytics } from "./platform-analytics-seed";

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Force fresh seeding by clearing existing data
    console.log('🗑️ Clearing existing data...');
    
    // Clear tables in correct order due to foreign key constraints
    await db.delete(environmentVariables);
    await db.delete(projectCollaborators);
    await db.delete(buildHistory);
    await db.delete(previewEnvironments);
    await db.delete(codeReviews);
    await db.delete(deployments);
    await db.delete(healthcareSimulations);
    await db.delete(projects); 
    await db.delete(templates);
    await db.delete(components);
    await db.delete(healthcareDomains);
    await db.delete(healthcareAgents);
    await db.delete(healthcareStandards);
    await db.delete(techStacks);
    await db.delete(aiModels);
    await db.delete(codeExamples);
    await db.delete(buildCapabilities);
    await db.delete(gitRepositories);
    await db.delete(pricingPlans);
    await db.delete(executiveMetrics);
    await db.delete(executiveROI);
    await db.delete(executiveCompetitive);
    await db.delete(executiveRevenue);
    await db.delete(platformMetrics);
    await db.delete(revenueProjections);
    await db.delete(competitiveAnalysis);
    await db.delete(ipPortfolio);
    
    console.log('✅ Existing data cleared, starting fresh seed...');

    // Seed sample user for development (use upsert to handle existing)
    let sampleUser;
    try {
      [sampleUser] = await db.insert(users).values({
        id: 'dev-user-123',
        email: 'dev@medbuilder.ai',
        firstName: 'MedBuilder',
        lastName: 'Developer',
        profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev'
      }).returning();
    } catch (error) {
      // User already exists, fetch existing user
      [sampleUser] = await db.select().from(users).where(eq(users.id, 'dev-user-123'));
    }

    // Seed tech stacks
    const techStackData = [
      {
        id: 'react-node',
        name: 'React + Node.js',
        description: 'Modern web application with React frontend and Node.js backend',
        category: 'Full Stack Web',
        healthcareDomain: 'clinical',
        frontend: {
          framework: 'React',
          version: '18.x',
          styling: 'Tailwind CSS',
          stateManagement: 'TanStack Query',
          routing: 'Wouter'
        },
        backend: {
          runtime: 'Node.js',
          version: '20.x',
          framework: 'Express',
          database: 'PostgreSQL',
          orm: 'Drizzle'
        },
        isActive: true
      },
      {
        id: 'angular-dotnet',
        name: 'Angular + .NET',
        description: 'Enterprise healthcare system with Angular frontend and .NET backend',
        category: 'Enterprise',
        healthcareDomain: 'clinical',
        frontend: {
          framework: 'Angular',
          version: '17.x',
          styling: 'Angular Material',
          stateManagement: 'NgRx',
          routing: 'Angular Router'
        },
        backend: {
          runtime: '.NET',
          version: '8.0',
          framework: 'ASP.NET Core',
          database: 'SQL Server',
          orm: 'Entity Framework'
        },
        isActive: true
      },
      {
        id: 'vue-django',
        name: 'Vue + Django',
        description: 'ML-powered healthcare app with Vue frontend and Python ML backend',
        category: 'AI/ML',
        healthcareDomain: 'research',
        frontend: {
          framework: 'Vue',
          version: '3.x',
          styling: 'Vuetify',
          stateManagement: 'Pinia',
          routing: 'Vue Router'
        },
        backend: {
          runtime: 'Python',
          version: '3.11',
          framework: 'Django',
          database: 'PostgreSQL',
          orm: 'Django ORM'
        },
        isActive: true
      },
      {
        id: 'flutter-firebase',
        name: 'Flutter + Firebase',
        description: 'Cross-platform mobile app with Firebase backend',
        category: 'Mobile',
        healthcareDomain: 'telehealth',
        frontend: {
          framework: 'Flutter',
          version: '3.x',
          styling: 'Material Design',
          stateManagement: 'Riverpod',
          routing: 'Go Router'
        },
        backend: {
          platform: 'Firebase',
          services: ['Authentication', 'Firestore', 'Cloud Functions', 'Cloud Storage'],
          database: 'Firestore',
          hosting: 'Firebase Hosting'
        },
        isActive: true
      },
      {
        id: 'nextjs-prisma',
        name: 'Next.js + Prisma',
        description: 'Modern full-stack application with Next.js and Prisma ORM',
        category: 'Full Stack Web',
        healthcareDomain: 'clinical',
        frontend: {
          framework: 'Next.js',
          version: '14.x',
          styling: 'Tailwind CSS',
          stateManagement: 'React Context',
          routing: 'App Router'
        },
        backend: {
          runtime: 'Node.js',
          version: '20.x',
          framework: 'Next.js API Routes',
          database: 'PostgreSQL',
          orm: 'Prisma'
        },
        isActive: true
      },
      {
        id: 'svelte-rust',
        name: 'Svelte + Rust',
        description: 'High-performance healthcare application with Svelte and Rust',
        category: 'High Performance',
        healthcareDomain: 'imaging',
        frontend: {
          framework: 'Svelte',
          version: '4.x',
          styling: 'Tailwind CSS',
          stateManagement: 'Svelte Stores',
          routing: 'SvelteKit'
        },
        backend: {
          runtime: 'Rust',
          framework: 'Actix-web',
          database: 'PostgreSQL',
          orm: 'Diesel'
        },
        isActive: true
      }
    ];

    await db.insert(techStacks).values(techStackData);

    // Seed AI models
    const aiModelData = [
      {
        id: 'med-gemma-7b',
        name: 'Med-Gemma 7B',
        description: 'Google\'s medical AI model specialized in healthcare question answering',
        provider: 'Google',
        capabilities: ['Medical Q&A', 'Clinical Reasoning', 'Diagnosis Support', 'Treatment Recommendations'],
        accuracy: 91,
        speed: 'Fast',
        contextWindow: '8K tokens',
        specialization: 'General Medicine',
        isOpenSource: true,
        isActive: true
      },
      {
        id: 'clinical-bert',
        name: 'ClinicalBERT',
        description: 'BERT model fine-tuned on clinical notes for medical NLP tasks',
        provider: 'MIT',
        capabilities: ['Clinical Text Analysis', 'Entity Extraction', 'Medical Coding', 'Note Classification'],
        accuracy: 94,
        speed: 'Medium',
        contextWindow: '512 tokens',
        specialization: 'Clinical NLP',
        isOpenSource: true,
        isActive: true
      },
      {
        id: 'gpt-4o-healthcare',
        name: 'GPT-4o Healthcare',
        description: 'OpenAI\'s GPT-4o optimized for healthcare applications',
        provider: 'OpenAI',
        capabilities: ['Medical Reasoning', 'Clinical Documentation', 'Patient Communication', 'Research Analysis'],
        accuracy: 95,
        speed: 'Fast',
        contextWindow: '128K tokens',
        specialization: 'General Healthcare',
        isOpenSource: false,
        isActive: true
      },
      {
        id: 'biobert',
        name: 'BioBERT',
        description: 'BERT model pre-trained on biomedical literature',
        provider: 'DMIS Lab',
        capabilities: ['Biomedical NER', 'Relation Extraction', 'Question Answering', 'Literature Mining'],
        accuracy: 92,
        speed: 'Medium',
        contextWindow: '512 tokens',
        specialization: 'Biomedical Research',
        isOpenSource: true,
        isActive: true
      },
      {
        id: 'pubmedbert',
        name: 'PubMedBERT',
        description: 'BERT model trained from scratch on PubMed abstracts',
        provider: 'Microsoft',
        capabilities: ['Biomedical Text Mining', 'Entity Recognition', 'Document Classification'],
        accuracy: 93,
        speed: 'Medium',
        contextWindow: '512 tokens',
        specialization: 'Medical Literature',
        isOpenSource: true,
        isActive: true
      },
      {
        id: 'radbert',
        name: 'RadBERT',
        description: 'BERT model specialized in radiology reports',
        provider: 'Stanford',
        capabilities: ['Radiology Report Analysis', 'Finding Extraction', 'Image Classification Support'],
        accuracy: 89,
        speed: 'Medium',
        contextWindow: '512 tokens',
        specialization: 'Radiology',
        isOpenSource: true,
        isActive: true
      },
      {
        id: 'pathbert',
        name: 'PathBERT',
        description: 'BERT model for pathology report processing',
        provider: 'PathAI',
        capabilities: ['Pathology Report Analysis', 'Diagnosis Extraction', 'Specimen Classification'],
        accuracy: 90,
        speed: 'Medium',
        contextWindow: '512 tokens',
        specialization: 'Pathology',
        isOpenSource: false,
        isActive: true
      },
      {
        id: 'bluebert',
        name: 'BlueBERT',
        description: 'BERT model pre-trained on PubMed and MIMIC-III clinical notes',
        provider: 'NCBI',
        capabilities: ['Clinical & Biomedical NLP', 'Named Entity Recognition', 'Relation Extraction'],
        accuracy: 92,
        speed: 'Medium',
        contextWindow: '512 tokens',
        specialization: 'Clinical & Biomedical',
        isOpenSource: true,
        isActive: true
      },
      {
        id: 'claude-medical',
        name: 'Claude 3 Medical',
        description: 'Anthropic\'s Claude 3 optimized for medical applications',
        provider: 'Anthropic',
        capabilities: ['Medical Reasoning', 'Clinical Decision Support', 'Patient Education', 'Research Assistance'],
        accuracy: 94,
        speed: 'Fast',
        contextWindow: '200K tokens',
        specialization: 'General Healthcare',
        isOpenSource: false,
        isActive: true
      },
      {
        id: 'meditron',
        name: 'Meditron-70B',
        description: 'Open-source medical LLM adapted from Llama 2',
        provider: 'EPFL',
        capabilities: ['Medical Question Answering', 'Clinical Reasoning', 'Medical Education'],
        accuracy: 88,
        speed: 'Medium',
        contextWindow: '4K tokens',
        specialization: 'Medical Education',
        isOpenSource: true,
        isActive: true
      },
      {
        id: 'medpalm',
        name: 'Med-PaLM 2',
        description: 'Google\'s medical question answering system',
        provider: 'Google',
        capabilities: ['Medical Exam Questions', 'Clinical Reasoning', 'Evidence-Based Medicine'],
        accuracy: 96,
        speed: 'Fast',
        contextWindow: '32K tokens',
        specialization: 'Medical Education & Clinical',
        isOpenSource: false,
        isActive: true
      },
      {
        id: 'scispacy',
        name: 'SciSpacy',
        description: 'spaCy models for biomedical and scientific text',
        provider: 'Allen AI',
        capabilities: ['Biomedical NER', 'Entity Linking', 'Dependency Parsing', 'Sentence Segmentation'],
        accuracy: 87,
        speed: 'Very Fast',
        contextWindow: 'N/A',
        specialization: 'Biomedical NLP',
        isOpenSource: true,
        isActive: true
      }
    ];

    await db.insert(aiModels).values(aiModelData);

    // Seed code examples
    const codeExampleData = [
      {
        id: 'telehealth-video',
        title: 'Telehealth Video Consultation',
        description: 'HIPAA-compliant video calling component for telehealth consultations with screen sharing and recording',
        language: 'typescript',
        useCase: 'telemedicine',
        code: `// Telehealth Video Call Component
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, VideoOff, Mic, MicOff, Monitor, Phone } from 'lucide-react';

interface VideoCallProps {
  patientId: string;
  providerId: string;
  appointmentId: string;
}

export default function TelehealthVideoCall({ patientId, providerId, appointmentId }: VideoCallProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    initializeMediaDevices();
    startCallTimer();
    
    return () => {
      cleanupMediaDevices();
    };
  }, []);

  const initializeMediaDevices = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Initialize WebRTC connection with HIPAA-compliant encryption
      // Connection establishment code here...
    } catch (error) {
      console.error('Failed to access media devices:', error);
    }
  };

  const cleanupMediaDevices = () => {
    // Stop all media tracks
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const startCallTimer = () => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  };

  const toggleVideo = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getVideoTracks()[0].enabled = !isVideoEnabled;
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getAudioTracks()[0].enabled = !isAudioEnabled;
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        // Handle screen sharing stream
        setIsScreenSharing(true);
      } else {
        // Stop screen sharing
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Screen sharing error:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return \`\${mins.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}\`;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <div className="flex-1 grid grid-cols-2 gap-4 p-4">
        <Card className="relative">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-sm">Patient Video</p>
          </div>
        </Card>
        
        <Card className="relative">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-sm">Your Video</p>
          </div>
        </Card>
      </div>
      
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="text-white">
          <p className="text-sm">Call Duration: {formatDuration(callDuration)}</p>
          <p className="text-xs text-gray-400">Appointment ID: {appointmentId}</p>
        </div>
        
        <div className="flex space-x-4">
          <Button
            onClick={toggleVideo}
            variant={isVideoEnabled ? "default" : "destructive"}
            size="lg"
          >
            {isVideoEnabled ? <Video /> : <VideoOff />}
          </Button>
          
          <Button
            onClick={toggleAudio}
            variant={isAudioEnabled ? "default" : "destructive"}
            size="lg"
          >
            {isAudioEnabled ? <Mic /> : <MicOff />}
          </Button>
          
          <Button
            onClick={toggleScreenShare}
            variant={isScreenSharing ? "secondary" : "default"}
            size="lg"
          >
            <Monitor />
          </Button>
          
          <Button
            variant="destructive"
            size="lg"
            onClick={() => {/* End call */}}
          >
            <Phone className="rotate-135" />
          </Button>
        </div>
        
        <div className="text-white">
          <p className="text-xs text-gray-400">HIPAA Compliant • Encrypted</p>
        </div>
      </div>
    </div>
  );
}`,
        tags: ['telehealth', 'video', 'webrtc', 'hipaa', 'react'],
        isActive: true
      },
      {
        id: 'medication-tracker',
        title: 'Medication Tracking System',
        description: 'Complete medication tracker with dosage schedules, reminders, and adherence monitoring',
        language: 'typescript',
        useCase: 'patient-care',
        code: `// Medication Tracking System
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Pill, AlertTriangle, CheckCircle } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextDose: string;
  status: 'due' | 'taken' | 'overdue';
  instructions: string;
}

export default function MedicationTracker() {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      nextDose: '2024-01-20T08:00:00',
      status: 'due',
      instructions: 'Take with food'
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      nextDose: '2024-01-20T12:00:00',
      status: 'taken',
      instructions: 'Take with meals'
    }
  ]);

  const markAsTaken = (medicationId: string) => {
    setMedications(prev =>
      prev.map(med =>
        med.id === medicationId
          ? { ...med, status: 'taken' as const }
          : med
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'due':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'taken':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Pill className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Medication Tracker</h1>
      
      <div className="grid gap-4">
        {medications.map((medication) => (
          <Card key={medication.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  {getStatusIcon(medication.status)}
                  <span>{medication.name}</span>
                </CardTitle>
                <Badge
                  variant={
                    medication.status === 'taken'
                      ? 'default'
                      : medication.status === 'overdue'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {medication.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Dosage:</strong> {medication.dosage}</p>
                <p><strong>Frequency:</strong> {medication.frequency}</p>
                <p><strong>Next Dose:</strong> {new Date(medication.nextDose).toLocaleString()}</p>
                <p><strong>Instructions:</strong> {medication.instructions}</p>
                
                {medication.status === 'due' && (
                  <Button
                    onClick={() => markAsTaken(medication.id)}
                    className="mt-4"
                  >
                    Mark as Taken
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}`,
        tags: ['medication', 'patient-care', 'tracking', 'react'],
        isActive: true
      },
      {
        id: 'fhir-patient-search',
        title: 'FHIR Patient Search',
        description: 'Search and retrieve patient data using FHIR API with proper error handling',
        language: 'typescript',
        useCase: 'ehr-integration',
        code: `// FHIR Patient Search Component
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  mrn: string;
}

export default function FHIRPatientSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  const searchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        \`https://fhir-server.example.com/Patient?name=\${searchQuery}\`,
        {
          headers: {
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
            'Accept': 'application/fhir+json'
          }
        }
      );
      
      const bundle = await response.json();
      const patientData = bundle.entry?.map((entry: any) => ({
        id: entry.resource.id,
        name: entry.resource.name[0].family + ', ' + entry.resource.name[0].given[0],
        birthDate: entry.resource.birthDate,
        gender: entry.resource.gender,
        mrn: entry.resource.identifier?.find((id: any) => id.type?.text === 'MRN')?.value || 'N/A'
      })) || [];
      
      setPatients(patientData);
    } catch (error) {
      console.error('FHIR search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>FHIR Patient Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchPatients()}
            />
            <Button onClick={searchPatients} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {patients.map((patient) => (
          <Card key={patient.id}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                {patient.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><strong>MRN:</strong> {patient.mrn}</p>
                <p><strong>Gender:</strong> {patient.gender}</p>
                <p><strong>Birth Date:</strong> {patient.birthDate}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}`,
        tags: ['fhir', 'ehr', 'patient-search', 'interoperability'],
        isActive: true
      }
    ];

    await db.insert(codeExamples).values(codeExampleData);

    // Seed build capabilities
    const buildCapabilityData = [
      {
        id: 'ai-integration',
        category: 'AI/ML',
        name: 'AI Model Integration',
        description: 'Integrate advanced AI models for clinical decision support and medical reasoning',
        features: ['GPT-4o Healthcare', 'Med-Gemma', 'ClinicalBERT', 'Custom Model Training', 'Federated Learning'],
        techRequirements: {
          models: ['OpenAI', 'Google AI', 'HuggingFace'],
          apis: ['REST', 'gRPC'],
          infrastructure: ['GPU Support', 'Model Serving']
        },
        isActive: true
      },
      {
        id: 'blockchain',
        category: 'Blockchain',
        name: 'Blockchain for Healthcare',
        description: 'Implement blockchain for secure health records and supply chain tracking',
        features: ['Immutable Health Records', 'Smart Contracts', 'Drug Supply Chain', 'Patient Consent Management'],
        techRequirements: {
          platforms: ['Ethereum', 'Hyperledger Fabric'],
          protocols: ['IPFS', 'Web3'],
          security: ['Encryption', 'Digital Signatures']
        },
        isActive: true
      },
      {
        id: 'telehealth',
        category: 'Telemedicine',
        name: 'Telehealth Platform',
        description: 'Build HIPAA-compliant video consultation and remote patient monitoring',
        features: ['Video Consultations', 'Remote Monitoring', 'E-Prescriptions', 'Virtual Waiting Room', 'Screen Sharing'],
        techRequirements: {
          protocols: ['WebRTC', 'HTTPS', 'WSS'],
          services: ['Twilio', 'Agora', 'Daily.co'],
          compliance: ['HIPAA', 'End-to-End Encryption']
        },
        isActive: true
      },
      {
        id: 'compliance-automation',
        category: 'Compliance',
        name: 'Compliance Automation',
        description: 'Automated HIPAA, GDPR, and FDA compliance checking and reporting',
        features: ['HIPAA Compliance', 'GDPR Tools', 'FDA Validation', 'Automated Audits', 'Compliance Dashboards'],
        techRequirements: {
          frameworks: ['NIST', 'ISO 27001', 'SOC 2'],
          tools: ['Security Scanning', 'Vulnerability Assessment'],
          reporting: ['Audit Logs', 'Compliance Reports']
        },
        isActive: true
      },
      {
        id: 'ehr-integration',
        category: 'Integration',
        name: 'EHR System Integration',
        description: 'Connect with Epic, Cerner, and other EHR systems via FHIR and HL7',
        features: ['FHIR Integration', 'HL7 Messaging', 'Epic MyChart', 'Cerner APIs', 'Real-time Sync'],
        techRequirements: {
          standards: ['FHIR R4', 'HL7 v2.x', 'CDA'],
          systems: ['Epic', 'Cerner', 'AllScripts', 'Athenahealth'],
          authentication: ['OAuth 2.0', 'SMART on FHIR']
        },
        isActive: true
      },
      {
        id: 'cloud-deployment',
        category: 'Deployment',
        name: 'HIPAA Cloud Deployment',
        description: 'Deploy to AWS, Azure, or GCP with HIPAA compliance',
        features: ['Auto-scaling', 'Load Balancing', 'Disaster Recovery', 'Multi-region', 'BAA Agreements'],
        techRequirements: {
          providers: ['AWS', 'Azure', 'GCP'],
          services: ['ECS', 'AKS', 'GKE', 'RDS', 'CloudSQL'],
          compliance: ['HIPAA BAA', 'Encryption', 'VPC']
        },
        isActive: true
      }
    ];

    await db.insert(buildCapabilities).values(buildCapabilityData);

    // Seed pricing plans
    const pricingPlanData = [
      {
        id: 'healthcare-professional',
        name: 'Healthcare Professional',
        description: 'Perfect for individual healthcare providers and small practices',
        icon: 'user',
        color: 'blue',
        popular: false,
        monthlyPrice: 49,
        annualPrice: 490,
        features: [
          'Up to 5 AI-powered applications',
          'Basic HIPAA compliance tools',
          'Standard templates library',
          'Email support',
          'Single user access',
          '10GB storage',
          'Basic analytics'
        ],
        limitations: ['No custom integrations', 'Limited API calls (1000/month)', 'Standard support only'],
        isActive: true,
        displayOrder: 1
      },
      {
        id: 'clinical-practice',
        name: 'Clinical Practice',
        description: 'Ideal for medical practices and small healthcare organizations',
        icon: 'building',
        color: 'purple',
        popular: true,
        monthlyPrice: 129,
        annualPrice: 1290,
        features: [
          'Unlimited AI applications',
          'Advanced HIPAA & GDPR compliance',
          'Premium templates + components',
          'Priority email & chat support',
          'Up to 10 team members',
          '100GB storage',
          'Advanced analytics & insights',
          'Custom branding',
          'API integrations (Epic, Cerner)',
          'Automated backups'
        ],
        limitations: ['Limited to 10 users', 'Standard API rate limits'],
        isActive: true,
        displayOrder: 2
      },
      {
        id: 'healthcare-system',
        name: 'Healthcare System',
        description: 'For large healthcare systems, hospitals, and enterprise organizations',
        icon: 'hospital',
        color: 'green',
        popular: false,
        monthlyPrice: 499,
        annualPrice: 4990,
        features: [
          'Unlimited everything',
          'Full compliance automation (HIPAA, GDPR, FDA)',
          'White-label solution',
          '24/7 premium support with SLA',
          'Unlimited team members',
          'Unlimited storage',
          'Enterprise analytics & BI',
          'Custom AI model training',
          'All EHR integrations',
          'Dedicated account manager',
          'On-premise deployment option',
          'Custom contract & pricing',
          'Advanced security features',
          'Multi-region deployment'
        ],
        limitations: [],
        isActive: true,
        displayOrder: 3
      }
    ];

    await db.insert(pricingPlans).values(pricingPlanData);

    // Seed healthcare domains
    const domains = [
      {
        name: 'Clinical Care',
        category: 'Primary Care',
        description: 'Electronic Health Records, Clinical Decision Support, Patient Management',
        subdomains: ['EHR', 'Clinical Decision Support', 'Patient Portal', 'Telehealth'],
        standards: ['FHIR', 'HL7', 'DICOM', 'ICD-10'],
        regulations: ['HIPAA', 'HITECH', 'FDA 21 CFR Part 11'],
        stakeholders: ['Physicians', 'Nurses', 'Patients', 'IT Staff'],
        technologies: ['React', 'Node.js', 'PostgreSQL', 'AI/ML'],
        dataTypes: ['Patient Records', 'Clinical Notes', 'Lab Results', 'Imaging'],
        integrations: ['Epic', 'Cerner', 'AllScripts', 'AWS HealthLake'],
        globalCoverage: true,
        languages: ['English', 'Spanish', 'French', 'German', 'Chinese'],
        countries: ['US', 'Canada', 'EU', 'Australia', 'Japan'],
        isActive: true
      },
      {
        name: 'Medical Research',
        category: 'Research & Development',
        description: 'Clinical Trials, Research Data Management, Publication Systems',
        subdomains: ['Clinical Trials', 'Research Database', 'Publication Portal', 'Collaboration Tools'],
        standards: ['CDISC', 'REDCap', 'FAIR', 'GCP'],
        regulations: ['FDA CFR', 'ICH-GCP', 'GDPR', 'HIPAA'],
        stakeholders: ['Researchers', 'Clinical Trial Coordinators', 'Regulatory Affairs', 'Data Scientists'],
        technologies: ['Python', 'R', 'TensorFlow', 'Jupyter', 'PostgreSQL'],
        dataTypes: ['Trial Data', 'Biomarkers', 'Genomic Data', 'Publications'],
        integrations: ['ClinicalTrials.gov', 'PubMed', 'NIH databases', 'Academic Networks'],
        globalCoverage: true,
        languages: ['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese'],
        countries: ['US', 'EU', 'Canada', 'Australia', 'Japan', 'Singapore'],
        isActive: true
      }
    ];

    await db.insert(healthcareDomains).values(domains);

    // Seed healthcare agents
    const agents = [
      {
        name: 'Clinical Decision Support AI',
        type: 'clinical',
        specialty: 'General Medicine',
        capabilities: ['Diagnosis Support', 'Treatment Recommendations', 'Drug Interaction Checks', 'Risk Assessment'],
        models: ['GPT-4', 'Claude-3', 'Med-Gemma', 'BioBERT'],
        healthcareDomains: ['Clinical Care', 'Emergency Medicine'],
        compliance: ['HIPAA', 'FDA AI/ML Guidance', 'Clinical Decision Support Standards'],
        integrations: ['Epic', 'Cerner', 'FHIR APIs', 'Clinical Databases'],
        configuration: {
          accuracy_threshold: 0.95,
          confidence_level: 'high',
          human_oversight: true,
          audit_logging: true
        },
        isPublic: true,
        isActive: true
      },
      {
        name: 'Research Data Analyzer',
        type: 'research',
        specialty: 'Data Science',
        capabilities: ['Statistical Analysis', 'Clinical Trial Data Processing', 'Biomarker Discovery', 'Publication Assistance'],
        models: ['GPT-4', 'Claude-3', 'Specialized ML Models'],
        healthcareDomains: ['Medical Research', 'Pharmaceutical Development'],
        compliance: ['GCP', 'FDA Validation', 'Data Privacy Regulations'],
        integrations: ['REDCap', 'R/Python Libraries', 'Statistical Software', 'Publication Databases'],
        configuration: {
          statistical_significance: 0.05,
          validation_method: 'cross-validation',
          reporting_standard: 'CONSORT'
        },
        isPublic: true,
        isActive: true
      }
    ];

    await db.insert(healthcareAgents).values(agents);

    // Seed healthcare standards
    const standards = [
      {
        name: 'Fast Healthcare Interoperability Resources',
        acronym: 'FHIR',
        category: 'data',
        description: 'Standard for health information exchange',
        version: 'R4',
        organization: 'HL7 International',
        implementationGuide: 'Complete FHIR implementation with REST APIs, resource definitions, and security protocols',
        supportedCountries: ['US', 'Canada', 'EU', 'Australia', 'Japan', 'Singapore'],
        complianceRequirements: ['OAuth 2.0', 'SMART on FHIR', 'Patient consent management'],
        technicalSpecs: {
          api_version: 'R4',
          transport: 'HTTPS',
          format: 'JSON/XML',
          authentication: 'OAuth 2.0'
        },
        apiEndpoints: ['/Patient', '/Observation', '/Condition', '/MedicationRequest'],
        isActive: true
      },
      {
        name: 'Health Level Seven',
        acronym: 'HL7',
        category: 'messaging',
        description: 'Standards for clinical and administrative data exchange',
        version: 'v2.8',
        organization: 'HL7 International',
        implementationGuide: 'Message-based communication between healthcare systems',
        supportedCountries: ['US', 'Canada', 'EU', 'Australia'],
        complianceRequirements: ['Message validation', 'Error handling', 'Acknowledgment protocols'],
        technicalSpecs: {
          message_format: 'HL7v2',
          encoding: 'UTF-8',
          transport: 'TCP/IP, HTTP'
        },
        apiEndpoints: ['/ADT', '/ORM', '/ORU', '/SIU'],
        isActive: true
      }
    ];

    await db.insert(healthcareStandards).values(standards);

    // Seed sample templates
    const templateData = [
      {
        name: 'HIPAA-Compliant Patient Portal',
        description: 'Full-featured patient portal with secure messaging, appointment scheduling, and medical records access',
        category: 'Patient Portal',
        healthcareDomain: 'clinical',
        framework: 'react',
        backend: 'nodejs',
        projectType: 'web',
        complianceLevel: 'hipaa',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
        code: {
          components: ['PatientDashboard', 'SecureMessaging', 'AppointmentScheduler', 'MedicalRecords'],
          security: ['TwoFactorAuth', 'EncryptedStorage', 'AuditLogging'],
          integrations: ['FHIR', 'Epic', 'Cerner']
        },
        buildConfig: {
          webpack_config: 'healthcare-optimized',
          security_headers: true,
          ssl_required: true
        },
        dependencies: ['@healthcare/fhir-client', 'crypto-js', 'audit-logger'],
        isHipaaCompliant: true,
        tags: ['FHIR', 'Patient Portal', 'Secure Messaging', 'HIPAA']
      },
      {
        name: 'Clinical Research Platform',
        description: 'Comprehensive clinical trial management system with patient recruitment, data collection, and regulatory reporting',
        category: 'Research Platform',
        healthcareDomain: 'research',
        framework: 'react',
        backend: 'python',
        projectType: 'web',
        complianceLevel: 'fda',
        imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
        code: {
          modules: ['TrialManagement', 'PatientRecruitment', 'DataCollection', 'RegulatoryReporting'],
          compliance: ['21CFRPart11', 'GCP', 'DataIntegrity'],
          analytics: ['StatisticalAnalysis', 'AdverseEventReporting', 'TrialMetrics']
        },
        buildConfig: {
          python_version: '3.9',
          frameworks: ['Django', 'pandas', 'numpy'],
          database: 'postgresql'
        },
        dependencies: ['django-compliance', 'clinical-data-models', 'fda-submission-tools'],
        isHipaaCompliant: true,
        tags: ['Clinical Trials', 'FDA Compliance', 'Research Data', 'GCP']
      },
      {
        name: 'Telehealth Consultation Platform',
        description: 'Video consultation platform with appointment scheduling, patient records, and secure messaging',
        category: 'Telehealth',
        healthcareDomain: 'telehealth',
        framework: 'react',
        backend: 'nodejs',
        projectType: 'web',
        complianceLevel: 'hipaa',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
        code: {
          features: ['VideoChat', 'Scheduling', 'PatientRecords', 'SecureMessaging']
        },
        buildConfig: {
          ssl: true
        },
        dependencies: ['react', 'express', 'socket.io'],
        isHipaaCompliant: true,
        tags: ['Telehealth', 'Video Consultation', 'HIPAA']
      },
      {
        name: 'Medical Records Management',
        description: 'Comprehensive EHR system for managing patient medical records, lab results, and clinical data',
        category: 'EHR',
        healthcareDomain: 'clinical',
        framework: 'react',
        backend: 'nodejs',
        projectType: 'web',
        complianceLevel: 'hipaa',
        imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400',
        code: {
          features: ['PatientManagement', 'LabResults', 'ClinicalNotes', 'FHIR']
        },
        buildConfig: {
          database: 'postgresql'
        },
        dependencies: ['react', 'express', 'fhir-client'],
        isHipaaCompliant: true,
        tags: ['EHR', 'FHIR', 'Clinical Data']
      },
      {
        name: 'Appointment Scheduling System',
        description: 'Advanced scheduling system with calendar management, reminders, and patient notifications',
        category: 'Scheduling',
        healthcareDomain: 'clinical',
        framework: 'react',
        backend: 'nodejs',
        projectType: 'web',
        complianceLevel: 'hipaa',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
        code: {
          features: ['Calendar', 'Reminders', 'Notifications', 'WaitlistManagement']
        },
        buildConfig: {
          notifications: true
        },
        dependencies: ['react', 'express', 'nodemailer'],
        isHipaaCompliant: true,
        tags: ['Scheduling', 'Calendar', 'Appointments']
      },
      {
        name: 'Laboratory Information System',
        description: 'Complete lab management with test ordering, results tracking, and quality control',
        category: 'Lab Management',
        healthcareDomain: 'laboratory',
        framework: 'react',
        backend: 'python',
        projectType: 'web',
        complianceLevel: 'hipaa',
        imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400',
        code: {
          features: ['TestOrdering', 'ResultsTracking', 'QualityControl', 'Reporting']
        },
        buildConfig: {
          python_version: '3.9'
        },
        dependencies: ['react', 'django', 'pandas'],
        isHipaaCompliant: true,
        tags: ['Lab', 'Testing', 'Quality Control']
      },
      {
        name: 'Prescription Management System',
        description: 'E-prescription system with drug interaction checking and pharmacy integration',
        category: 'Pharmacy',
        healthcareDomain: 'pharmacy',
        framework: 'react',
        backend: 'nodejs',
        projectType: 'web',
        complianceLevel: 'hipaa',
        imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400',
        code: {
          features: ['EPrescribing', 'DrugInteractions', 'PharmacyIntegration', 'RefillManagement']
        },
        buildConfig: {
          integrations: ['pharmacies']
        },
        dependencies: ['react', 'express', 'drug-db'],
        isHipaaCompliant: true,
        tags: ['Pharmacy', 'Prescriptions', 'Drug Interactions']
      },
      {
        name: 'Clinical Trial Management',
        description: 'Clinical trial system with patient recruitment, data collection, and regulatory reporting',
        category: 'Research',
        healthcareDomain: 'research',
        framework: 'react',
        backend: 'python',
        projectType: 'web',
        complianceLevel: 'fda',
        imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
        code: {
          features: ['PatientRecruitment', 'DataCollection', 'AdverseEvents', 'RegulatoryReporting']
        },
        buildConfig: {
          compliance: '21CFRPart11'
        },
        dependencies: ['react', 'django', 'pandas'],
        isHipaaCompliant: true,
        tags: ['Clinical Trials', 'FDA', 'Research']
      },
      {
        name: 'Medical Imaging Viewer',
        description: 'DICOM viewer with 3D reconstruction, measurements, and reporting',
        category: 'Medical Imaging',
        healthcareDomain: 'radiology',
        framework: 'react',
        backend: 'nodejs',
        projectType: 'web',
        complianceLevel: 'hipaa',
        imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400',
        code: {
          features: ['DICOMViewer', '3DReconstruction', 'Measurements', 'Reporting']
        },
        buildConfig: {
          imaging: 'dicom'
        },
        dependencies: ['react', 'express', 'cornerstone'],
        isHipaaCompliant: true,
        tags: ['DICOM', 'Radiology', 'Imaging']
      },
      {
        name: 'Health Analytics Dashboard',
        description: 'Real-time health analytics with predictive insights and population health tracking',
        category: 'Analytics',
        healthcareDomain: 'analytics',
        framework: 'react',
        backend: 'python',
        projectType: 'web',
        complianceLevel: 'hipaa',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
        code: {
          features: ['RealTimeAnalytics', 'PredictiveModels', 'PopulationHealth', 'DataVisualization']
        },
        buildConfig: {
          analytics: 'advanced'
        },
        dependencies: ['react', 'flask', 'tensorflow'],
        isHipaaCompliant: true,
        tags: ['Analytics', 'AI', 'Population Health']
      },
      {
        name: 'Mental Health Chatbot',
        description: 'AI-powered mental health support chatbot with crisis detection and therapist integration',
        category: 'Mental Health',
        healthcareDomain: 'mental_health',
        framework: 'react',
        backend: 'python',
        projectType: 'web',
        complianceLevel: 'hipaa',
        imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
        code: {
          features: ['AIChatbot', 'CrisisDetection', 'TherapistIntegration', 'SentimentAnalysis']
        },
        buildConfig: {
          ai: 'nlp'
        },
        dependencies: ['react', 'flask', 'transformers'],
        isHipaaCompliant: true,
        tags: ['Mental Health', 'AI', 'NLP']
      },
      {
        name: 'Medical Device Integration',
        description: 'IoT platform for medical device data collection, monitoring, and alerts',
        category: 'MedTech',
        healthcareDomain: 'medical_devices',
        framework: 'react',
        backend: 'nodejs',
        projectType: 'web',
        complianceLevel: 'hipaa',
        imageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400',
        code: {
          features: ['DeviceIntegration', 'RealTimeMonitoring', 'Alerts', 'DataAnalytics']
        },
        buildConfig: {
          iot: true
        },
        dependencies: ['react', 'express', 'mqtt'],
        isHipaaCompliant: true,
        tags: ['IoT', 'Medical Devices', 'Monitoring']
      },
      {
        name: 'Fitness & Wellness Tracker',
        description: 'Comprehensive fitness and wellness tracking with activity, nutrition, and sleep monitoring',
        category: 'Wellness',
        healthcareDomain: 'wellness',
        framework: 'react',
        backend: 'nodejs',
        projectType: 'mobile',
        complianceLevel: 'hipaa',
        imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        code: {
          features: ['ActivityTracking', 'NutritionLog', 'SleepMonitoring', 'GoalSetting']
        },
        buildConfig: {
          mobile: 'react-native'
        },
        dependencies: ['react-native', 'express', 'healthkit'],
        isHipaaCompliant: true,
        tags: ['Fitness', 'Wellness', 'Mobile']
      },
      {
        name: 'Hospital Bed Management',
        description: 'Real-time hospital bed management with occupancy tracking and transfer coordination',
        category: 'Hospital Operations',
        healthcareDomain: 'hospital',
        framework: 'react',
        backend: 'nodejs',
        projectType: 'web',
        complianceLevel: 'hipaa',
        imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
        code: {
          features: ['BedTracking', 'OccupancyManagement', 'TransferCoordination', 'ResourceOptimization']
        },
        buildConfig: {
          realtime: true
        },
        dependencies: ['react', 'express', 'socket.io'],
        isHipaaCompliant: true,
        tags: ['Hospital', 'Operations', 'Resource Management']
      }
    ];

    await db.insert(templates).values(templateData);

    // Seed sample components
    const componentData = [
      {
        name: 'HIPAA Consent Form',
        description: 'Fully compliant consent form component with digital signatures and audit trail',
        category: 'Forms',
        healthcareUseCase: 'patient-consent',
        frameworks: ['react', 'vue', 'angular'],
        icon: 'file-text',
        code: {
          react: 'ConsentFormComponent.tsx',
          vue: 'ConsentForm.vue',
          angular: 'consent-form.component.ts',
          styles: 'consent-form.scss'
        },
        apiIntegrations: ['DocuSign', 'Adobe Sign', 'FHIR Consent Resource'],
        complianceFeatures: ['Digital Signatures', 'Audit Trail', 'Version Control', 'Patient Rights'],
        isVerified: true,
        isHipaaCompliant: true,
        isResponsive: true,
        tags: ['HIPAA', 'Consent', 'Digital Signature', 'Compliance']
      },
      {
        name: 'Lab Results Viewer',
        description: 'Interactive lab results display with trend analysis and reference ranges',
        category: 'Data Visualization',
        healthcareUseCase: 'lab-results',
        frameworks: ['react', 'vue', 'angular'],
        icon: 'bar-chart',
        code: {
          react: 'LabResultsViewer.tsx',
          vue: 'LabResults.vue',
          angular: 'lab-results.component.ts',
          charts: 'trend-charts.js'
        },
        apiIntegrations: ['FHIR Observation', 'HL7 ORU messages', 'Lab Information Systems'],
        complianceFeatures: ['Data Encryption', 'Access Control', 'Audit Logging'],
        isVerified: true,
        isHipaaCompliant: true,
        isResponsive: true,
        tags: ['Lab Results', 'Data Visualization', 'FHIR', 'Trends']
      }
    ];

    await db.insert(components).values(componentData);

    // Seed sample project
    const [sampleProject] = await db.insert(projects).values({
      name: 'MedBuilder Demo Portal',
      description: 'Sample patient portal built with MedBuilder',
      userId: sampleUser.id,
      templateId: 1,
      framework: 'react',
      backend: 'nodejs',
      database: 'postgresql',
      cloudProvider: 'aws',
      projectType: 'web',
      techStack: {
        frontend: ['React', 'TypeScript', 'Tailwind CSS'],
        backend: ['Node.js', 'Express', 'Drizzle ORM'],
        database: ['PostgreSQL'],
        cloud: ['AWS'],
        security: ['HIPAA Compliance', 'OAuth 2.0', 'TLS 1.3']
      },
      buildConfig: {
        build_command: 'npm run build',
        start_command: 'npm start',
        node_version: '18.x'
      },
      environmentVars: {
        NODE_ENV: 'production',
        DATABASE_URL: 'encrypted',
        HIPAA_COMPLIANCE: 'enabled'
      },
      isHipaaCompliant: true,
      isResponsive: true,
      code: {
        structure: 'Modern React application with TypeScript',
        components: 12,
        pages: 8,
        apis: 15
      },
      settings: {
        compliance_level: 'hipaa',
        security_enabled: true,
        analytics_enabled: false
      }
    }).returning();

    // Seed git repositories
    const gitRepoData = [
      {
        id: 'repo-healthcare-ehr',
        name: 'healthcare-ehr-system',
        description: 'Complete Electronic Health Record system with patient management and clinical workflows',
        owner: sampleUser.id,
        isPrivate: false,
        branch: 'main',
        lastCommitMessage: 'feat: Add FHIR R4 integration for patient data sync',
        lastCommitAuthor: 'MedBuilder Developer',
        lastCommitTimestamp: new Date('2024-01-15T10:30:00Z'),
        lastCommitHash: 'a1b2c3d',
        collaborators: 5,
        stars: 247,
        forks: 38,
        size: '24.5 MB',
        language: 'TypeScript',
        topics: ['healthcare', 'ehr', 'fhir', 'hipaa', 'react'],
        commits: 342,
        branches: 8,
        releases: 12
      },
      {
        id: 'repo-telemedicine',
        name: 'telemedicine-platform',
        description: 'HIPAA-compliant telemedicine platform with video consultations and e-prescriptions',
        owner: sampleUser.id,
        isPrivate: false,
        branch: 'main',
        lastCommitMessage: 'fix: Improve WebRTC connection stability for video calls',
        lastCommitAuthor: 'MedBuilder Developer',
        lastCommitTimestamp: new Date('2024-01-18T14:22:00Z'),
        lastCommitHash: 'e4f5g6h',
        collaborators: 3,
        stars: 189,
        forks: 24,
        size: '18.2 MB',
        language: 'TypeScript',
        topics: ['telehealth', 'webrtc', 'video-consultation', 'hipaa'],
        commits: 218,
        branches: 5,
        releases: 8
      }
    ];

    await db.insert(gitRepositories).values(gitRepoData);

    // Seed deployments
    const deploymentData = [
      {
        id: 'deploy-prod-ehr',
        projectId: sampleProject.id,
        name: 'prod-ehr-system',
        url: 'https://ehr-prod.medbuilder.app',
        status: 'active',
        environment: 'production',
        region: 'us-east-1',
        lastDeployment: new Date('2024-01-18T09:15:00Z'),
        version: 'v2.4.1',
        health: 'healthy',
        traffic: '12.5k req/min',
        uptime: '99.98%',
        ssl: true,
        customDomain: true,
        buildTime: '3m 42s',
        memoryUsage: '512 MB',
        cpuUsage: '24%'
      },
      {
        id: 'deploy-staging-tele',
        projectId: sampleProject.id,
        name: 'staging-telemedicine',
        url: 'https://staging-tele.medbuilder.app',
        status: 'active',
        environment: 'staging',
        region: 'us-west-2',
        lastDeployment: new Date('2024-01-19T11:30:00Z'),
        version: 'v2.5.0-beta',
        health: 'healthy',
        traffic: '1.2k req/min',
        uptime: '99.95%',
        ssl: true,
        customDomain: false,
        buildTime: '2m 18s',
        memoryUsage: '256 MB',
        cpuUsage: '18%'
      }
    ];

    await db.insert(deployments).values(deploymentData);

    // Seed code reviews
    const codeReviewData = [
      {
        id: 'review-fhir-integration',
        projectId: sampleProject.id,
        title: 'Add FHIR R4 patient data synchronization',
        author: 'dev@medbuilder.ai',
        reviewers: ['alice@medbuilder.ai', 'bob@medbuilder.ai'],
        status: 'approved',
        linesAdded: 342,
        linesRemoved: 87,
        files: 12,
        comments: 8,
        aiInsights: [
          'HIPAA compliance verified for patient data handling',
          'Proper encryption detected for PHI transmission',
          'Audit logging implemented correctly'
        ],
        checks: {
          security: 'passed',
          hipaa: 'passed',
          tests: 'passed',
          build: 'passed'
        }
      },
      {
        id: 'review-video-optimization',
        projectId: sampleProject.id,
        title: 'Optimize WebRTC video quality and reduce bandwidth',
        author: 'dev@medbuilder.ai',
        reviewers: ['charlie@medbuilder.ai'],
        status: 'changes_requested',
        linesAdded: 156,
        linesRemoved: 43,
        files: 5,
        comments: 4,
        aiInsights: [
          'Performance improvements detected',
          'Consider adding error handling for network failures',
          'Bandwidth optimization looks good'
        ],
        checks: {
          security: 'passed',
          hipaa: 'passed',
          tests: 'failed',
          build: 'passed'
        }
      }
    ];

    await db.insert(codeReviews).values(codeReviewData);

    // Seed preview environments
    const previewEnvData = [
      {
        id: 'preview-fhir-feature',
        projectId: sampleProject.id,
        name: 'FHIR Integration Preview',
        url: 'https://preview-fhir-342.medbuilder.app',
        status: 'active',
        pullRequest: '#342',
        features: ['FHIR R4 API', 'Patient Data Sync', 'Real-time Updates'],
        testResults: {
          unit: 'passed',
          integration: 'passed',
          e2e: 'passed'
        },
        performance: {
          loadTime: '1.2s',
          ttfb: '180ms',
          fcp: '850ms'
        },
        expiresAt: new Date('2024-01-25T00:00:00Z')
      },
      {
        id: 'preview-ui-redesign',
        projectId: sampleProject.id,
        name: 'Dashboard UI Redesign',
        url: 'https://preview-ui-298.medbuilder.app',
        status: 'active',
        pullRequest: '#298',
        features: ['New Dashboard Layout', 'Dark Mode', 'Accessibility Improvements'],
        testResults: {
          unit: 'passed',
          integration: 'passed',
          e2e: 'passed',
          accessibility: 'passed'
        },
        performance: {
          loadTime: '0.9s',
          ttfb: '150ms',
          fcp: '720ms'
        },
        expiresAt: new Date('2024-01-22T00:00:00Z')
      }
    ];

    await db.insert(previewEnvironments).values(previewEnvData);

    // Seed build history
    const buildHistoryData = [
      {
        id: 'build-prod-2024-01-19',
        projectId: sampleProject.id,
        commit: 'a1b2c3d4e5f',
        branch: 'main',
        status: 'success',
        startTime: new Date('2024-01-19T09:10:00Z'),
        endTime: new Date('2024-01-19T09:13:42Z'),
        duration: '3m 42s',
        logs: [
          'Installing dependencies...',
          'Running TypeScript compilation...',
          'Building production bundle...',
          'Running tests...',
          'All tests passed ✓',
          'Deployment successful ✓'
        ],
        tests: {
          total: 248,
          passed: 248,
          failed: 0,
          skipped: 0
        }
      },
      {
        id: 'build-staging-2024-01-18',
        projectId: sampleProject.id,
        commit: 'f6g7h8i9j0k',
        branch: 'develop',
        status: 'failed',
        startTime: new Date('2024-01-18T15:20:00Z'),
        endTime: new Date('2024-01-18T15:22:15Z'),
        duration: '2m 15s',
        logs: [
          'Installing dependencies...',
          'Running TypeScript compilation...',
          'ERROR: Type error in VideoCall.tsx',
          'Build failed ✗'
        ],
        tests: {
          total: 248,
          passed: 0,
          failed: 0,
          skipped: 248
        }
      }
    ];

    await db.insert(buildHistory).values(buildHistoryData);

    // Seed environment variables
    const envVarData = [
      {
        id: 'env-database-url',
        projectId: sampleProject.id,
        key: 'DATABASE_URL',
        value: 'postgresql://encrypted_connection_string',
        environment: 'production',
        encrypted: true,
        lastUpdated: new Date('2024-01-15T08:00:00Z')
      },
      {
        id: 'env-fhir-server',
        projectId: sampleProject.id,
        key: 'FHIR_SERVER_URL',
        value: 'https://fhir.medbuilder.app/r4',
        environment: 'production',
        encrypted: false,
        lastUpdated: new Date('2024-01-10T10:30:00Z')
      },
      {
        id: 'env-hipaa-key',
        projectId: sampleProject.id,
        key: 'HIPAA_ENCRYPTION_KEY',
        value: 'encrypted_key_data',
        environment: 'production',
        encrypted: true,
        lastUpdated: new Date('2024-01-12T14:20:00Z')
      }
    ];

    await db.insert(environmentVariables).values(envVarData);

    // Seed project collaborators (external collaborators without user accounts)
    const collaboratorData = [
      {
        id: 'collab-emily',
        projectId: sampleProject.id,
        userId: null, // External collaborator
        name: 'Dr. Emily Smith',
        email: 'emily.smith@hospital.org',
        role: 'Medical Advisor',
        permissions: ['read', 'comment', 'review'],
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
        lastActive: new Date('2024-01-19T16:45:00Z'),
        contributions: 23
      },
      {
        id: 'collab-alice',
        projectId: sampleProject.id,
        userId: null, // External collaborator  
        name: 'Alice Johnson',
        email: 'alice.johnson@medbuilder.ai',
        role: 'Lead Developer',
        permissions: ['read', 'write', 'admin', 'deploy'],
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
        lastActive: new Date('2024-01-19T17:30:00Z'),
        contributions: 156
      },
      {
        id: 'collab-bob',
        projectId: sampleProject.id,
        userId: null, // External collaborator
        name: 'Bob Wilson',
        email: 'bob.wilson@medbuilder.ai',
        role: 'UI/UX Designer',
        permissions: ['read', 'write', 'comment'],
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
        lastActive: new Date('2024-01-18T14:15:00Z'),
        contributions: 87
      }
    ];

    await db.insert(projectCollaborators).values(collaboratorData);

    // Seed executive metrics (removed fictitious numbers per user request)
    const executiveMetricsData = {
      id: 'exec-metrics-001',
      platformUsers: null,
      activeProjects: null,
      revenueGrowth: null,
      marketPenetration: null,
      timestamp: new Date()
    };
    await db.insert(executiveMetrics).values(executiveMetricsData);

    const executiveROIData = {
      id: 'exec-roi-001',
      developmentCostReduction: null,
      timeToMarketImprovement: null,
      complianceCostSavings: null,
      totalROI: null,
      timestamp: new Date()
    };
    await db.insert(executiveROI).values(executiveROIData);

    const executiveCompetitiveData = {
      id: 'exec-competitive-001',
      patentPortfolioMin: '$46.63B',
      patentPortfolioMax: '$84.88B',
      marketPosition: 'Zero Direct Competition',
      technologyLead: '3-5 Year Head Start',
      complianceAutomation: 95,
      timestamp: new Date()
    };
    await db.insert(executiveCompetitive).values(executiveCompetitiveData);

    const executiveRevenueData = {
      id: 'exec-revenue-001',
      year1Customers: null,
      year1Arpu: null,
      year1Arr: null,
      year3Customers: null,
      year3Arpu: null,
      year3Arr: null,
      year5Customers: null,
      year5Arpu: null,
      year5Arr: null,
      timestamp: new Date()
    };
    await db.insert(executiveRevenue).values(executiveRevenueData);

    // Seed platform analytics data (dynamic database-driven metrics)
    await seedPlatformAnalytics();

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Created: ${domains.length} healthcare domains, ${agents.length} healthcare agents, ${standards.length} healthcare standards`);
    console.log(`🏗️ Created: ${templateData.length} templates, ${componentData.length} components`);
    console.log(`🛠️ Created: ${techStackData.length} tech stacks, ${aiModelData.length} AI models, ${codeExampleData.length} code examples`);
    console.log(`🔧 Created: ${buildCapabilityData.length} build capabilities, ${pricingPlanData.length} pricing plans`);
    console.log(`📦 Created: ${gitRepoData.length} repositories, ${deploymentData.length} deployments`);
    console.log(`📝 Created: ${codeReviewData.length} code reviews, ${previewEnvData.length} preview environments`);
    console.log(`🔨 Created: ${buildHistoryData.length} build records, ${envVarData.length} environment variables`);
    console.log(`👥 Created: ${collaboratorData.length} project collaborators`);
    console.log(`📈 Created: 4 executive metric datasets (metrics, ROI, competitive, revenue)`);
    console.log(`💰 Created: Platform analytics data (revenue projections, IP portfolio, competitive analysis)`);
    console.log(`👤 Created: 1 user, 1 sample project`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}
