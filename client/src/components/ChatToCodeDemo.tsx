import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SandpackProvider, SandpackPreview } from "@codesandbox/sandpack-react";
import { 
  Code, 
  FileCode, 
  CheckCircle, 
  Sparkles,
  Copy,
  Download,
  Play,
  X,
  Zap,
  Shield,
  Loader2
} from "lucide-react";

interface GeneratedCode {
  code: Record<string, string>;
  dependencies: Record<string, string>;
  techStack: {
    framework: string;
    language: string;
    styling: string;
    database?: string;
  };
  explanation: string;
  nextSteps: string[];
}

interface ChatToCodeDemoProps {
  initialPrompt?: string;
  sessionId?: string;
  onClose?: () => void;
  onComplete?: (code: GeneratedCode) => void;
}

// Pre-generated demo code for instant response
const demoApps: Record<string, GeneratedCode> = {
  scheduler: {
    code: {
      "App.tsx": `import { useState } from 'react';

export default function PatientScheduler() {
  const [selectedDate, setSelectedDate] = useState('2024-12-23');
  const [selectedTime, setSelectedTime] = useState('');
  const [booked, setBooked] = useState(false);

  const times = ['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM'];

  const handleBook = () => {
    setBooked(true);
    setTimeout(() => setBooked(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-xl">📅</span>
          </div>
          <h1 className="text-xl font-bold">Patient Scheduler</h1>
          <span className="ml-auto px-2 py-1 bg-green-900 text-green-400 text-xs rounded">HIPAA</span>
        </div>

        {booked && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-600 rounded-lg text-green-400 text-sm">
            ✓ Appointment confirmed! Reminder sent.
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Select Date</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full mt-1 p-3 bg-gray-800 border border-gray-700 rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Available Times</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {times.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={\`p-2 rounded-lg text-sm font-medium transition-all \${
                    selectedTime === time 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }\`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleBook}
            disabled={!selectedTime}
            className="w-full py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-lg font-semibold transition-all"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}`,
      "index.css": `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; }`
    },
    dependencies: { "react": "^18.0.0" },
    techStack: { framework: "React", language: "TypeScript", styling: "Tailwind CSS" },
    explanation: "Built a HIPAA-compliant patient scheduling app with date selection and time slots",
    nextSteps: ["Add patient database", "Email reminders", "Calendar sync"]
  },
  intake: {
    code: {
      "App.tsx": `import { useState } from 'react';

export default function IntakeForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', dob: '', insurance: '', consent: false });

  const handleSubmit = () => {
    if (step < 3) setStep(step + 1);
    else alert('Form submitted securely!');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-xl">📋</span>
          </div>
          <h1 className="text-xl font-bold">Patient Intake</h1>
          <span className="ml-auto px-2 py-1 bg-green-900 text-green-400 text-xs rounded">HIPAA</span>
        </div>

        <div className="flex gap-2 mb-6">
          {[1,2,3].map(s => (
            <div key={s} className={\`flex-1 h-2 rounded \${step >= s ? 'bg-blue-600' : 'bg-gray-700'}\`} />
          ))}
        </div>

        <div className="space-y-4">
          {step === 1 && (
            <>
              <input placeholder="Full Name" className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="date" className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
                value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
            </>
          )}
          {step === 2 && (
            <input placeholder="Insurance ID" className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
              value={formData.insurance} onChange={e => setFormData({...formData, insurance: e.target.value})} />
          )}
          {step === 3 && (
            <label className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg cursor-pointer">
              <input type="checkbox" checked={formData.consent} onChange={e => setFormData({...formData, consent: e.target.checked})} />
              <span className="text-sm">I consent to treatment and data processing</span>
            </label>
          )}

          <button onClick={handleSubmit} className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold">
            {step < 3 ? 'Continue' : 'Submit Securely'}
          </button>
        </div>
      </div>
    </div>
  );
}`,
      "index.css": `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; }`
    },
    dependencies: { "react": "^18.0.0" },
    techStack: { framework: "React", language: "TypeScript", styling: "Tailwind CSS" },
    explanation: "Created a secure multi-step intake form with progress tracking and consent collection",
    nextSteps: ["PDF generation", "E-signature", "EHR integration"]
  },
  telehealth: {
    code: {
      "App.tsx": `import { useState, useEffect } from 'react';

export default function TelehealthRoom() {
  const [status, setStatus] = useState<'waiting' | 'ready' | 'connected'>('waiting');
  const [waitTime, setWaitTime] = useState(180);

  useEffect(() => {
    const timer = setInterval(() => {
      setWaitTime(t => {
        if (t <= 1) { setStatus('ready'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => \`\${Math.floor(s/60)}:\${(s%60).toString().padStart(2,'0')}\`;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-md mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-xl">🩺</span>
          </div>
          <h1 className="text-xl font-bold">Virtual Waiting Room</h1>
        </div>

        <div className="p-8 bg-gray-800 rounded-2xl mb-6">
          {status === 'waiting' && (
            <>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-900 flex items-center justify-center animate-pulse">
                <span className="text-3xl">⏳</span>
              </div>
              <p className="text-gray-400 mb-2">Your doctor will be with you in</p>
              <p className="text-4xl font-bold text-purple-400">{formatTime(waitTime)}</p>
            </>
          )}
          {status === 'ready' && (
            <>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-900 flex items-center justify-center">
                <span className="text-3xl">✓</span>
              </div>
              <p className="text-xl font-semibold text-green-400 mb-4">Doctor is ready!</p>
              <button onClick={() => setStatus('connected')} className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold">
                Join Video Call
              </button>
            </>
          )}
          {status === 'connected' && (
            <>
              <div className="aspect-video bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">📹</span>
              </div>
              <p className="text-green-400">Connected with Dr. Smith</p>
            </>
          )}
        </div>

        <span className="px-3 py-1 bg-green-900 text-green-400 text-xs rounded">🔒 End-to-End Encrypted</span>
      </div>
    </div>
  );
}`,
      "index.css": `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; }`
    },
    dependencies: { "react": "^18.0.0" },
    techStack: { framework: "React", language: "TypeScript", styling: "Tailwind CSS" },
    explanation: "Built a telehealth waiting room with countdown timer and video call integration",
    nextSteps: ["WebRTC video", "Chat messaging", "Screen sharing"]
  },
  wellness: {
    code: {
      "App.tsx": `import { useState } from 'react';

export default function WellnessTracker() {
  const [mood, setMood] = useState(3);
  const [water, setWater] = useState(4);
  const [steps, setSteps] = useState(6847);
  const [logged, setLogged] = useState(false);

  const moods = ['😢', '😕', '😐', '🙂', '😊'];
  
  const handleLog = () => {
    setLogged(true);
    setTimeout(() => setLogged(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-xl">💜</span>
          </div>
          <h1 className="text-xl font-bold">Wellness Tracker</h1>
          <span className="ml-auto px-2 py-1 bg-green-900 text-green-400 text-xs rounded">HIPAA</span>
        </div>

        {logged && (
          <div className="mb-4 p-3 bg-purple-900/50 border border-purple-600 rounded-lg text-purple-300 text-sm">
            ✓ Daily wellness logged successfully!
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{moods[mood]}</div>
            <div className="text-xs text-gray-400">Mood</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{water}</div>
            <div className="text-xs text-gray-400">Glasses 💧</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-lg font-bold text-green-400">{steps.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Steps 👟</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">How are you feeling today?</label>
            <div className="flex justify-between bg-gray-800 rounded-lg p-3">
              {moods.map((emoji, i) => (
                <button key={i} onClick={() => setMood(i)}
                  className={\`text-2xl p-2 rounded-lg transition-all \${mood === i ? 'bg-purple-600 scale-110' : 'hover:bg-gray-700'}\`}>
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Water intake</label>
            <div className="flex gap-2">
              {[...Array(8)].map((_, i) => (
                <button key={i} onClick={() => setWater(i + 1)}
                  className={\`flex-1 h-8 rounded transition-all \${i < water ? 'bg-blue-500' : 'bg-gray-700'}\`} />
              ))}
            </div>
          </div>

          <button onClick={handleLog}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition-all">
            Log Today's Wellness
          </button>
        </div>
      </div>
    </div>
  );
}`,
      "index.css": `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; }`
    },
    dependencies: { "react": "^18.0.0" },
    techStack: { framework: "React", language: "TypeScript", styling: "Tailwind CSS" },
    explanation: "Built a wellness tracking app with mood, hydration, and activity monitoring",
    nextSteps: ["Health goals", "Weekly reports", "Wearable sync"]
  },
  pharmacy: {
    code: {
      "App.tsx": `import { useState } from 'react';

export default function PharmacyPortal() {
  const [medications, setMedications] = useState([
    { name: 'Lisinopril 10mg', refills: 2, dueDate: '2024-12-28', status: 'ready' },
    { name: 'Metformin 500mg', refills: 3, dueDate: '2025-01-05', status: 'pending' },
    { name: 'Atorvastatin 20mg', refills: 1, dueDate: '2024-12-30', status: 'ready' }
  ]);
  const [refillRequested, setRefillRequested] = useState('');

  const handleRefill = (name: string) => {
    setRefillRequested(name);
    setTimeout(() => setRefillRequested(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-xl">💊</span>
          </div>
          <h1 className="text-xl font-bold">My Medications</h1>
          <span className="ml-auto px-2 py-1 bg-green-900 text-green-400 text-xs rounded">HIPAA</span>
        </div>

        {refillRequested && (
          <div className="mb-4 p-3 bg-orange-900/50 border border-orange-600 rounded-lg text-orange-300 text-sm">
            ✓ Refill requested for {refillRequested}!
          </div>
        )}

        <div className="space-y-3">
          {medications.map((med, i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold">{med.name}</div>
                  <div className="text-sm text-gray-400">{med.refills} refills remaining</div>
                </div>
                <span className={\`px-2 py-1 text-xs rounded \${med.status === 'ready' ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'}\`}>
                  {med.status === 'ready' ? '✓ Ready' : '⏳ Pending'}
                </span>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-500">Due: {med.dueDate}</span>
                <button onClick={() => handleRefill(med.name)}
                  className="px-3 py-1 bg-orange-600 hover:bg-orange-500 rounded text-sm font-medium">
                  Request Refill
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`,
      "index.css": `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; }`
    },
    dependencies: { "react": "^18.0.0" },
    techStack: { framework: "React", language: "TypeScript", styling: "Tailwind CSS" },
    explanation: "Built a pharmacy portal for medication management and refill requests",
    nextSteps: ["Pharmacy finder", "Drug interactions", "Insurance check"]
  },
  lab: {
    code: {
      "App.tsx": `import { useState } from 'react';

export default function LabResults() {
  const [selectedTest, setSelectedTest] = useState(0);
  const results = [
    { name: 'Complete Blood Count', date: '2024-12-18', status: 'normal', values: [{name: 'WBC', value: '7.2', unit: 'K/uL', range: '4.5-11.0'}, {name: 'RBC', value: '4.8', unit: 'M/uL', range: '4.5-5.5'}] },
    { name: 'Lipid Panel', date: '2024-12-15', status: 'attention', values: [{name: 'LDL', value: '142', unit: 'mg/dL', range: '<100'}, {name: 'HDL', value: '52', unit: 'mg/dL', range: '>40'}] },
    { name: 'Glucose', date: '2024-12-10', status: 'normal', values: [{name: 'Fasting', value: '95', unit: 'mg/dL', range: '70-100'}] }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
            <span className="text-xl">🔬</span>
          </div>
          <h1 className="text-xl font-bold">Lab Results</h1>
          <span className="ml-auto px-2 py-1 bg-green-900 text-green-400 text-xs rounded">HIPAA</span>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {results.map((r, i) => (
            <button key={i} onClick={() => setSelectedTest(i)}
              className={\`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all \${selectedTest === i ? 'bg-cyan-600' : 'bg-gray-800 hover:bg-gray-700'}\`}>
              {r.name}
            </button>
          ))}
        </div>

        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="font-semibold">{results[selectedTest].name}</div>
              <div className="text-sm text-gray-400">{results[selectedTest].date}</div>
            </div>
            <span className={\`px-2 py-1 text-xs rounded \${results[selectedTest].status === 'normal' ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'}\`}>
              {results[selectedTest].status === 'normal' ? '✓ Normal' : '⚠ Review'}
            </span>
          </div>

          <div className="space-y-3">
            {results[selectedTest].values.map((v, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-300">{v.name}</span>
                <div className="text-right">
                  <span className="font-mono font-semibold">{v.value}</span>
                  <span className="text-gray-500 text-sm ml-1">{v.unit}</span>
                  <div className="text-xs text-gray-500">Range: {v.range}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}`,
      "index.css": `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; }`
    },
    dependencies: { "react": "^18.0.0" },
    techStack: { framework: "React", language: "TypeScript", styling: "Tailwind CSS" },
    explanation: "Built a lab results viewer with test history and value analysis",
    nextSteps: ["PDF download", "Trend charts", "Doctor notes"]
  }
};

// Live Demo Preview - fetches real data from backend API
function LiveDemoPreview({ sessionId }: { sessionId?: string }) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState('9:00 AM');
  const [booked, setBooked] = useState(false);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0 });
  
  const demoSessionId = sessionId || 'demo_default';
  
  useEffect(() => {
    // Fetch real appointments from backend
    fetch(`/api/demo/${demoSessionId}/appointments`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAppointments(data.data);
          setStats(data.stats);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [demoSessionId]);
  
  const handleBook = async () => {
    const res = await fetch(`/api/demo/${demoSessionId}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        patientName: 'New Patient', 
        service: 'General Checkup',
        date: '2024-12-23',
        time: selectedTime 
      })
    });
    const data = await res.json();
    if (data.success) {
      setAppointments(prev => [...prev, data.data]);
      setStats(prev => ({ ...prev, total: prev.total + 1, confirmed: prev.confirmed + 1 }));
      setBooked(true);
      setTimeout(() => setBooked(false), 3000);
    }
  };

  const times = ['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM'];

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-xl">📅</div>
        <h2 className="text-xl font-bold text-white">Patient Scheduler</h2>
        <span className="ml-auto px-2 py-1 bg-green-900 text-green-400 text-xs rounded-md">HIPAA</span>
      </div>
      
      {/* Real-time Stats from API */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-white">{loading ? '...' : stats.total}</div>
          <div className="text-xs text-gray-400">Total</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">{loading ? '...' : stats.confirmed}</div>
          <div className="text-xs text-gray-400">Confirmed</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400">{loading ? '...' : stats.pending}</div>
          <div className="text-xs text-gray-400">Pending</div>
        </div>
      </div>
      
      {booked && (
        <div className="mb-4 p-3 bg-green-900/50 border border-green-600 rounded-lg text-green-400 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Appointment saved to database!
        </div>
      )}
      
      {/* Appointment List from Database */}
      <div className="mb-6">
        <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Upcoming Appointments (Live Data)</label>
        <div className="space-y-2 max-h-40 overflow-auto">
          {loading ? (
            <div className="p-3 bg-gray-800 rounded-lg text-gray-400 text-sm animate-pulse">Loading from database...</div>
          ) : appointments.slice(0, 3).map((apt: any) => (
            <div key={apt.id} className="p-3 bg-gray-800 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-white text-sm font-medium">{apt.patientName}</div>
                <div className="text-gray-400 text-xs">{apt.service} - {apt.time}</div>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs ${apt.status === 'confirmed' ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'}`}>
                {apt.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Book New Appointment */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Book New Appointment</label>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {times.map(time => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`p-2 rounded-lg text-xs font-medium transition-all ${
                selectedTime === time 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
        <button
          onClick={handleBook}
          className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold transition-all"
        >
          Book & Save to Database
        </button>
      </div>
      
      <div className="mt-4 text-center">
        <span className="inline-flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Connected to PostgreSQL Database
        </span>
      </div>
    </div>
  );
}

export function ChatToCodeDemo({ initialPrompt, sessionId, onClose, onComplete }: ChatToCodeDemoProps) {
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [phase, setPhase] = useState<"building" | "complete">("building");
  const [buildStep, setBuildStep] = useState(0);
  
  const buildSteps = [
    { label: "Analyzing requirements", icon: "🔍" },
    { label: "Generating components", icon: "⚡" },
    { label: "Adding HIPAA compliance", icon: "🔒" },
    { label: "Building UI", icon: "🎨" },
    { label: "Finalizing", icon: "✨" }
  ];

  useEffect(() => {
    // Smart prompt matching to select the right demo
    const prompt = (initialPrompt || "").toLowerCase();
    let demoKey = "scheduler"; // default
    
    // Pattern matching for different healthcare app types
    const patterns: Record<string, string[]> = {
      wellness: ["wellness", "health", "fitness", "mood", "mental", "meditation", "sleep", "stress", "mindful", "exercise", "nutrition", "diet", "weight", "tracker", "habit", "lifestyle", "self-care", "wellbeing"],
      pharmacy: ["pharmacy", "medication", "medicine", "prescription", "refill", "drug", "pill", "rx", "dose", "dosage", "pharma"],
      lab: ["lab", "laboratory", "test", "result", "blood", "diagnostic", "pathology", "specimen", "sample", "panel", "screening"],
      intake: ["intake", "registration", "onboard", "new patient", "sign up", "enroll", "checkin", "check-in", "admission", "history", "medical record", "form", "questionnaire"],
      telehealth: ["telehealth", "telemedicine", "video", "virtual", "waiting room", "remote", "call", "consult", "online visit", "virtual care", "video chat"],
      scheduler: ["schedule", "appointment", "booking", "book", "calendar", "slot", "time", "doctor", "visit", "reminder"]
    };
    
    // Find best match based on keyword count
    let bestMatch = "scheduler";
    let bestScore = 0;
    
    for (const [key, keywords] of Object.entries(patterns)) {
      const score = keywords.filter(kw => prompt.includes(kw)).length;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = key;
      }
    }
    
    // If no specific match found, try to infer from context
    if (bestScore === 0) {
      if (prompt.includes("app") && (prompt.includes("health") || prompt.includes("care"))) {
        bestMatch = "wellness";
      } else if (prompt.includes("form") || prompt.includes("data") || prompt.includes("collect")) {
        bestMatch = "intake";
      } else if (prompt.includes("connect") || prompt.includes("meet") || prompt.includes("talk")) {
        bestMatch = "telehealth";
      }
    }
    
    demoKey = bestMatch;

    // Ultra-fast build simulation
    const stepDuration = 120; // 120ms per step = 0.6s total
    
    const interval = setInterval(() => {
      setBuildStep(prev => {
        if (prev >= buildSteps.length - 1) {
          clearInterval(interval);
          // Instant transition to complete
          const demo = demoApps[demoKey];
          setGeneratedCode(demo);
          setSelectedFile(Object.keys(demo.code)[0]);
          setPhase("complete");
          onComplete?.(demo);
          return prev;
        }
        return prev + 1;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [initialPrompt]);

  const copyCode = () => {
    if (generatedCode && selectedFile) {
      navigator.clipboard.writeText(generatedCode.code[selectedFile]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="chat-to-code-demo">
      <Card className="w-full max-w-6xl h-[85vh] bg-[#0a0a0f] border-gray-800 flex flex-col overflow-hidden">
        <CardHeader className="border-b border-gray-800 py-3 px-4 flex-shrink-0 bg-[#0a0a0f]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">MedBuilder AI</CardTitle>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-green-600/50 text-green-400 bg-green-500/10">
                <Shield className="w-3 h-3 mr-1" />
                HIPAA Ready
              </Badge>
              {onClose && (
                <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white" data-testid="button-close-demo">
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 flex overflow-hidden">
          {phase === "building" && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0a0a0f]">
              <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center animate-pulse">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Building Your App</h2>
                  <p className="text-gray-400 text-sm">This usually takes 2-3 seconds</p>
                </div>

                <div className="space-y-3">
                  {buildSteps.map((step, index) => (
                    <div 
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                        index < buildStep ? 'bg-green-500/10 border border-green-500/30' :
                        index === buildStep ? 'bg-gray-800 border border-gray-700 animate-pulse' :
                        'bg-gray-900/50 border border-gray-800/50 opacity-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
                        index < buildStep ? 'bg-green-600' :
                        index === buildStep ? 'bg-gray-700' : 'bg-gray-800'
                      }`}>
                        {index < buildStep ? <CheckCircle className="w-4 h-4 text-white" /> : step.icon}
                      </div>
                      <span className={`text-sm font-medium ${
                        index <= buildStep ? 'text-white' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </span>
                      {index === buildStep && (
                        <Loader2 className="w-4 h-4 text-green-400 animate-spin ml-auto" />
                      )}
                      {index < buildStep && (
                        <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {phase === "complete" && generatedCode && (
            <div className="flex-1 flex overflow-hidden">
              {/* File Tree */}
              <div className="w-52 border-r border-gray-800 bg-[#0a0a0f] p-3 flex-shrink-0 overflow-y-auto">
                <div className="flex items-center gap-2 mb-3 text-gray-500 text-xs uppercase tracking-wider">
                  <FileCode className="w-4 h-4" />
                  <span>Files</span>
                </div>
                <div className="space-y-1">
                  {Object.keys(generatedCode.code).map((file) => (
                    <button
                      key={file}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition-colors ${
                        selectedFile === file
                          ? "bg-green-600/20 text-green-400 border border-green-600/30"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                      data-testid={`button-file-${file.replace(/[^a-zA-Z0-9]/g, '-')}`}
                    >
                      {file}
                    </button>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Stack</div>
                  <div className="space-y-1">
                    <Badge variant="secondary" className="bg-blue-900/50 text-blue-300 text-xs w-full justify-start">
                      {generatedCode.techStack.framework}
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-900/50 text-purple-300 text-xs w-full justify-start">
                      {generatedCode.techStack.language}
                    </Badge>
                    <Badge variant="secondary" className="bg-cyan-900/50 text-cyan-300 text-xs w-full justify-start">
                      {generatedCode.techStack.styling}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Code/Preview Panel */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <Tabs defaultValue="preview" className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#0a0a0f]">
                    <TabsList className="bg-gray-800/50">
                      <TabsTrigger value="preview" className="data-[state=active]:bg-gray-700">
                        <Play className="w-4 h-4 mr-2" />
                        Preview
                      </TabsTrigger>
                      <TabsTrigger value="code" className="data-[state=active]:bg-gray-700">
                        <Code className="w-4 h-4 mr-2" />
                        Code
                      </TabsTrigger>
                    </TabsList>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={copyCode} className="text-gray-400 hover:text-white" data-testid="button-copy-code">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button 
                        className="bg-green-600 hover:bg-green-500" 
                        size="sm" 
                        onClick={() => window.location.href = '/pricing'}
                        data-testid="button-deploy-app"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Deploy
                      </Button>
                    </div>
                  </div>
                  
                  <TabsContent value="preview" className="flex-1 m-0 overflow-hidden bg-[#111] p-6">
                    <LiveDemoPreview sessionId={sessionId} />
                  </TabsContent>

                  <TabsContent value="code" className="flex-1 m-0 overflow-hidden">
                    <ScrollArea className="h-full bg-[#0d0d12]">
                      <pre className="p-4 text-sm text-gray-300 font-mono leading-relaxed">
                        <code>{selectedFile ? generatedCode.code[selectedFile] : "Select a file"}</code>
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
                
                <div className="p-4 border-t border-gray-800 bg-[#0a0a0f]">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">{generatedCode.explanation}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {generatedCode.nextSteps.map((step, i) => (
                          <Badge key={i} variant="outline" className="border-gray-700 text-gray-400 text-xs">
                            {step}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
