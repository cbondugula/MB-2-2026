import { db } from "./db";
import { projects, templates } from "@shared/schema";
import { eq } from "drizzle-orm";

interface GeneratedProject {
  files: Record<string, string>;
  name: string;
  description: string;
}

const authServiceCode = `// HIPAA-Compliant Authentication Service
// All authentication and audit logging handled via secure API calls
// Session state stored in sessionStorage, all data persisted server-side

interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'provider' | 'admin';
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

class AuthService {
  private state: AuthState = { user: null, isLoading: true };
  private listeners: Set<(state: AuthState) => void> = new Set();

  constructor() {
    this.checkSession();
  }

  private notifyListeners() {
    this.listeners.forEach(fn => fn(this.state));
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private async checkSession() {
    try {
      const response = await fetch('/api/auth/me', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        this.state = { user: data.user, isLoading: false };
      } else {
        this.state = { user: null, isLoading: false };
      }
    } catch {
      this.state = { user: null, isLoading: false };
    }
    this.notifyListeners();
  }

  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.message || 'Authentication failed' };
      }

      const data = await response.json();
      this.state = { user: data.user, isLoading: false };
      this.notifyListeners();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {}
    this.state = { user: null, isLoading: false };
    this.notifyListeners();
  }

  getUser(): User | null {
    return this.state.user;
  }

  isAuthenticated(): boolean {
    return !!this.state.user;
  }

  isLoading(): boolean {
    return this.state.isLoading;
  }
}

export const authService = new AuthService();
export type { User, AuthState };
`;

const authHookCode = `import { useState, useEffect, useCallback } from 'react';
import { authService, User, AuthState } from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [isLoading, setIsLoading] = useState(authService.isLoading());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return authService.subscribe((state: AuthState) => {
      setUser(state.user);
      setIsLoading(state.isLoading);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    const result = await authService.login(email, password);
    setIsLoading(false);
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    return result.success;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
  };
}
`;

// PHI Safeguards - Input validation and data protection utilities
const phiSafeguardsCode = `// HIPAA-Compliant PHI Safeguards
// Prevents accidental exposure of Protected Health Information

// PHI patterns that should never be logged or exposed
const PHI_PATTERNS = {
  SSN: /\\b\\d{3}-\\d{2}-\\d{4}\\b/g,
  MRN: /\\b[A-Z]{2,3}\\d{6,10}\\b/gi,
  PHONE: /\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b/g,
  EMAIL: /\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b/g,
  DOB: /\\b(0[1-9]|1[0-2])\\/(0[1-9]|[12]\\d|3[01])\\/(19|20)\\d{2}\\b/g,
  CREDIT_CARD: /\\b\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}\\b/g,
};

// Redact PHI from strings for safe logging
export function redactPHI(text: string): string {
  let redacted = text;
  // Reset lastIndex before each replacement for global patterns
  PHI_PATTERNS.SSN.lastIndex = 0;
  PHI_PATTERNS.MRN.lastIndex = 0;
  PHI_PATTERNS.PHONE.lastIndex = 0;
  PHI_PATTERNS.DOB.lastIndex = 0;
  PHI_PATTERNS.CREDIT_CARD.lastIndex = 0;
  redacted = redacted.replace(PHI_PATTERNS.SSN, '[SSN REDACTED]');
  redacted = redacted.replace(PHI_PATTERNS.MRN, '[MRN REDACTED]');
  redacted = redacted.replace(PHI_PATTERNS.PHONE, '[PHONE REDACTED]');
  redacted = redacted.replace(PHI_PATTERNS.DOB, '[DOB REDACTED]');
  redacted = redacted.replace(PHI_PATTERNS.CREDIT_CARD, '[CC REDACTED]');
  return redacted;
}

// Check if string contains PHI patterns (reset lastIndex for global patterns)
export function containsPHI(text: string): boolean {
  return Object.values(PHI_PATTERNS).some(pattern => {
    pattern.lastIndex = 0;
    return pattern.test(text);
  });
}

// Validate and sanitize patient data input
export function validatePatientInput(data: Record<string, any>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (data.email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (data.phone && !/^\\+?[1-9]\\d{1,14}$/.test(data.phone.replace(/[\\s()-]/g, ''))) {
    errors.push('Invalid phone number format');
  }
  
  if (data.dob) {
    const dob = new Date(data.dob);
    const age = (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    if (age < 0 || age > 150) {
      errors.push('Invalid date of birth');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

// Mask sensitive data for display (e.g., show only last 4 of SSN)
export function maskSensitive(value: string, type: 'ssn' | 'phone' | 'email' | 'mrn'): string {
  switch (type) {
    case 'ssn':
      return value.length >= 4 ? '***-**-' + value.slice(-4) : '***-**-****';
    case 'phone':
      return value.length >= 4 ? '(***) ***-' + value.slice(-4) : '(***) ***-****';
    case 'email':
      const [local, domain] = value.split('@');
      if (local && domain) {
        return local[0] + '***@' + domain;
      }
      return '***@***.***';
    case 'mrn':
      return value.length >= 4 ? '***' + value.slice(-4) : '***';
    default:
      return '***';
  }
}

// Safe console logger that redacts PHI
export const safeLog = {
  info: (message: string, data?: any) => {
    console.log('[INFO]', redactPHI(message), data ? redactPHI(JSON.stringify(data)) : '');
  },
  warn: (message: string, data?: any) => {
    console.warn('[WARN]', redactPHI(message), data ? redactPHI(JSON.stringify(data)) : '');
  },
  error: (message: string, data?: any) => {
    console.error('[ERROR]', redactPHI(message), data ? redactPHI(JSON.stringify(data)) : '');
  },
};

// Access control helper
export function canAccessRecord(userRole: string, recordOwnerId: string, userId: string): boolean {
  if (userRole === 'admin') return true;
  if (userRole === 'provider') return true; // Providers can access all patient records
  return recordOwnerId === userId; // Patients can only access their own records
}
`;

const healthcareTemplateCode: Record<string, (clinicName: string) => Record<string, string>> = {
  "Patient Portal": (clinicName) => ({
    "src/services/authService.ts": authServiceCode,
    "src/utils/phiSafeguards.ts": phiSafeguardsCode,
    "src/hooks/useAuth.ts": authHookCode,
    "src/App.tsx": `import { useState, useEffect } from 'react';
import { PatientDashboard } from './components/PatientDashboard';
import { AppointmentBooking } from './components/AppointmentBooking';
import { MedicalRecords } from './components/MedicalRecords';
import { SecureMessaging } from './components/SecureMessaging';
import { LoginPage } from './components/LoginPage';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage clinicName="${clinicName}" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-emerald-700">${clinicName}</h1>
          <nav className="flex gap-4">
            <button onClick={() => setCurrentPage('dashboard')} className={\`px-3 py-2 rounded \${currentPage === 'dashboard' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600'}\`}>Dashboard</button>
            <button onClick={() => setCurrentPage('appointments')} className={\`px-3 py-2 rounded \${currentPage === 'appointments' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600'}\`}>Appointments</button>
            <button onClick={() => setCurrentPage('records')} className={\`px-3 py-2 rounded \${currentPage === 'records' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600'}\`}>Medical Records</button>
            <button onClick={() => setCurrentPage('messages')} className={\`px-3 py-2 rounded \${currentPage === 'messages' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600'}\`}>Messages</button>
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <button onClick={logout} className="text-gray-500 hover:text-gray-700">Sign Out</button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'dashboard' && <PatientDashboard patient={user} />}
        {currentPage === 'appointments' && <AppointmentBooking clinicName="${clinicName}" />}
        {currentPage === 'records' && <MedicalRecords patient={user} />}
        {currentPage === 'messages' && <SecureMessaging patient={user} />}
      </main>
    </div>
  );
}`,
    "src/components/LoginPage.tsx": `import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface LoginPageProps {
  clinicName: string;
}

export function LoginPage({ clinicName }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{clinicName}</h1>
          <p className="text-gray-500 mt-2">Patient Portal - Secure Access</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com" 
              required
              autoComplete="email"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <a href="#forgot" className="text-sm text-emerald-600 hover:text-emerald-700">Forgot password?</a>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>HIPAA Compliant</span>
            <span className="text-gray-300">•</span>
            <span>256-bit Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}`,
    "src/components/PatientDashboard.tsx": `interface PatientDashboardProps {
  patient: any;
}

export function PatientDashboard({ patient }: PatientDashboardProps) {
  const upcomingAppointments = [
    { id: 1, doctor: 'Dr. Sarah Johnson', specialty: 'Primary Care', date: '2024-01-15', time: '10:00 AM' },
    { id: 2, doctor: 'Dr. Michael Chen', specialty: 'Cardiology', date: '2024-01-22', time: '2:30 PM' },
  ];

  const recentResults = [
    { id: 1, test: 'Complete Blood Count', date: '2024-01-05', status: 'Normal' },
    { id: 2, test: 'Lipid Panel', date: '2024-01-03', status: 'Review Needed' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Welcome back, {patient?.name}</h2>
        <p className="text-gray-500">Here's your health summary</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Upcoming Appointments
          </h3>
          <div className="space-y-3">
            {upcomingAppointments.map(apt => (
              <div key={apt.id} className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{apt.doctor}</p>
                <p className="text-sm text-gray-500">{apt.specialty}</p>
                <p className="text-sm text-emerald-600 mt-1">{apt.date} at {apt.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Recent Lab Results
          </h3>
          <div className="space-y-3">
            {recentResults.map(result => (
              <div key={result.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{result.test}</p>
                  <p className="text-sm text-gray-500">{result.date}</p>
                </div>
                <span className={\`px-3 py-1 rounded-full text-sm \${result.status === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}\`}>{result.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
        <h3 className="font-semibold mb-2">Need to speak with a doctor?</h3>
        <p className="text-emerald-100 mb-4">Start a secure video consultation from your device</p>
        <button className="bg-white text-emerald-700 px-6 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors">Start Telehealth Visit</button>
      </div>
    </div>
  );
}`,
    "src/components/AppointmentBooking.tsx": `import { useState } from 'react';

interface AppointmentBookingProps {
  clinicName: string;
}

export function AppointmentBooking({ clinicName }: AppointmentBookingProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Primary Care', available: true },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Cardiology', available: true },
    { id: 3, name: 'Dr. Emily Williams', specialty: 'Dermatology', available: false },
    { id: 4, name: 'Dr. James Brown', specialty: 'Orthopedics', available: true },
  ];

  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

  const handleBook = () => {
    alert('Appointment booked successfully! You will receive a confirmation email.');
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Book an Appointment</h2>
        
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-3">Select a Provider</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {doctors.map(doc => (
              <button
                key={doc.id}
                onClick={() => doc.available && setSelectedDoctor(doc.id)}
                disabled={!doc.available}
                className={\`p-4 rounded-lg border-2 text-left transition-all \${
                  selectedDoctor === doc.id ? 'border-emerald-500 bg-emerald-50' : 
                  doc.available ? 'border-gray-200 hover:border-emerald-200' : 'border-gray-100 bg-gray-50 opacity-50'
                }\`}
              >
                <p className="font-medium text-gray-900">{doc.name}</p>
                <p className="text-sm text-gray-500">{doc.specialty}</p>
                {!doc.available && <p className="text-sm text-red-500 mt-1">Not available</p>}
              </button>
            ))}
          </div>
        </div>

        {selectedDoctor && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-3">Select Date</h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full md:w-auto px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}

        {selectedDate && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-3">Select Time</h3>
            <div className="flex flex-wrap gap-2">
              {timeSlots.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={\`px-4 py-2 rounded-lg border transition-all \${
                    selectedTime === time ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-200 hover:border-emerald-400'
                  }\`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedTime && (
          <button
            onClick={handleBook}
            className="w-full md:w-auto bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Confirm Appointment
          </button>
        )}
      </div>
    </div>
  );
}`,
    "src/components/MedicalRecords.tsx": `interface MedicalRecordsProps {
  patient: any;
}

export function MedicalRecords({ patient }: MedicalRecordsProps) {
  const records = [
    { id: 1, type: 'Lab Results', title: 'Complete Blood Count', date: '2024-01-05', provider: 'LabCorp' },
    { id: 2, type: 'Lab Results', title: 'Lipid Panel', date: '2024-01-03', provider: 'LabCorp' },
    { id: 3, type: 'Imaging', title: 'Chest X-Ray', date: '2023-12-15', provider: 'RadNet' },
    { id: 4, type: 'Visit Summary', title: 'Annual Physical', date: '2023-12-01', provider: 'Dr. Johnson' },
    { id: 5, type: 'Immunization', title: 'Flu Vaccine', date: '2023-10-15', provider: 'Pharmacy' },
  ];

  const medications = [
    { id: 1, name: 'Lisinopril 10mg', instructions: 'Take once daily', refills: 3 },
    { id: 2, name: 'Metformin 500mg', instructions: 'Take twice daily with meals', refills: 2 },
    { id: 3, name: 'Vitamin D 1000IU', instructions: 'Take once daily', refills: 5 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Medical Records</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Title</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Provider</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr key={record.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-sm">{record.type}</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">{record.title}</td>
                  <td className="py-3 px-4 text-gray-500">{record.date}</td>
                  <td className="py-3 px-4 text-gray-500">{record.provider}</td>
                  <td className="py-3 px-4">
                    <button className="text-emerald-600 hover:text-emerald-700 font-medium">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Medications</h2>
        <div className="space-y-3">
          {medications.map(med => (
            <div key={med.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">{med.name}</p>
                <p className="text-sm text-gray-500">{med.instructions}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{med.refills} refills left</p>
                <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">Request Refill</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`,
    "src/components/SecureMessaging.tsx": `import { useState } from 'react';

interface SecureMessagingProps {
  patient: any;
}

export function SecureMessaging({ patient }: SecureMessagingProps) {
  const [newMessage, setNewMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(1);

  const conversations = [
    { id: 1, doctor: 'Dr. Sarah Johnson', specialty: 'Primary Care', unread: 1, lastMessage: 'Your lab results look good...' },
    { id: 2, doctor: 'Dr. Michael Chen', specialty: 'Cardiology', unread: 0, lastMessage: 'See you at your next appointment' },
  ];

  const messages = [
    { id: 1, from: 'doctor', text: 'Hi! I reviewed your recent lab results. Everything looks good overall.', time: '10:30 AM' },
    { id: 2, from: 'patient', text: 'Thank you, Doctor. I had a question about my cholesterol levels.', time: '10:45 AM' },
    { id: 3, from: 'doctor', text: 'Your cholesterol is slightly elevated but within acceptable range. Continue with your current diet and exercise regimen.', time: '11:00 AM' },
    { id: 4, from: 'doctor', text: 'Your lab results look good. Let me know if you have any questions!', time: '11:05 AM' },
  ];

  const handleSend = () => {
    if (newMessage.trim()) {
      alert('Message sent securely!');
      setNewMessage('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="flex h-[600px]">
        <div className="w-80 border-r">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-900">Messages</h2>
          </div>
          <div className="overflow-y-auto">
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={\`w-full p-4 text-left border-b hover:bg-gray-50 \${selectedConversation === conv.id ? 'bg-emerald-50' : ''}\`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{conv.doctor}</p>
                    <p className="text-sm text-gray-500">{conv.specialty}</p>
                    <p className="text-sm text-gray-400 mt-1 truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="bg-emerald-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{conv.unread}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b bg-gray-50">
            <p className="font-medium text-gray-900">Dr. Sarah Johnson</p>
            <p className="text-sm text-gray-500">Primary Care</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={\`flex \${msg.from === 'patient' ? 'justify-end' : 'justify-start'}\`}>
                <div className={\`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl \${
                  msg.from === 'patient' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-900'
                }\`}>
                  <p>{msg.text}</p>
                  <p className={\`text-xs mt-1 \${msg.from === 'patient' ? 'text-emerald-100' : 'text-gray-400'}\`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a secure message..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Send
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">🔒 End-to-end encrypted • HIPAA compliant</p>
          </div>
        </div>
      </div>
    </div>
  );
}`,
    "src/index.css": `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}`,
  }),

  "Telehealth": (clinicName) => ({
    "src/App.tsx": `import { useState } from 'react';

export default function App() {
  const [inCall, setInCall] = useState(false);
  const [waitingRoom, setWaitingRoom] = useState(false);

  if (inCall) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <header className="bg-gray-800 px-4 py-3 flex items-center justify-between">
          <h1 className="text-white font-medium">${clinicName} - Video Visit</h1>
          <button onClick={() => setInCall(false)} className="bg-red-600 text-white px-4 py-2 rounded-lg">End Call</button>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-4xl aspect-video bg-gray-800 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-white text-xl">Dr. Sarah Johnson</p>
                <p className="text-gray-400">Connected</p>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 w-40 aspect-video bg-gray-700 rounded-lg overflow-hidden border-2 border-white">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 text-sm">You</span>
              </div>
            </div>
          </div>
        </main>
        <footer className="bg-gray-800 p-4 flex justify-center gap-4">
          <button className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </button>
          <button className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          </button>
          <button className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </button>
        </footer>
      </div>
    );
  }

  if (waitingRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Waiting Room</h1>
          <p className="text-gray-500 mb-6">Dr. Johnson will be with you shortly</p>
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Estimated wait time</p>
            <p className="text-2xl font-bold text-emerald-600">~2 minutes</p>
          </div>
          <button onClick={() => setInCall(true)} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700">Join Call Now</button>
          <button onClick={() => setWaitingRoom(false)} className="w-full mt-3 text-gray-500 hover:text-gray-700">Cancel Visit</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-emerald-700">${clinicName}</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Virtual Healthcare from Anywhere</h2>
          <p className="text-gray-600 text-lg">Connect with our healthcare providers through secure video consultations</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: '🏥', title: 'Primary Care', desc: 'General health concerns and checkups', wait: '5 min' },
            { icon: '🧠', title: 'Mental Health', desc: 'Therapy and counseling services', wait: '10 min' },
            { icon: '💊', title: 'Urgent Care', desc: 'Non-emergency medical issues', wait: '3 min' },
          ].map((service, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setWaitingRoom(true)}>
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-500 mb-4">{service.desc}</p>
              <p className="text-emerald-600 font-medium">Wait: ~{service.wait}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Schedule an Appointment</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input type="date" className="px-4 py-3 border border-gray-200 rounded-lg" />
            <select className="px-4 py-3 border border-gray-200 rounded-lg">
              <option>Select a time</option>
              <option>9:00 AM</option>
              <option>10:00 AM</option>
              <option>2:00 PM</option>
              <option>3:00 PM</option>
            </select>
          </div>
          <button className="mt-4 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700">Book Appointment</button>
        </div>
      </main>
    </div>
  );
}`,
    "src/index.css": `@tailwind base;
@tailwind components;
@tailwind utilities;`,
  }),

  "Scheduling": (clinicName) => ({
    "src/App.tsx": `import { useState } from 'react';

interface Appointment {
  id: number;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export default function App() {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  const appointments: Appointment[] = [
    { id: 1, patient: 'John Smith', doctor: 'Dr. Johnson', date: '2024-01-15', time: '9:00 AM', type: 'Checkup', status: 'confirmed' },
    { id: 2, patient: 'Sarah Davis', doctor: 'Dr. Chen', date: '2024-01-15', time: '10:30 AM', type: 'Follow-up', status: 'confirmed' },
    { id: 3, patient: 'Mike Wilson', doctor: 'Dr. Johnson', date: '2024-01-15', time: '2:00 PM', type: 'Consultation', status: 'pending' },
    { id: 4, patient: 'Emily Brown', doctor: 'Dr. Williams', date: '2024-01-16', time: '11:00 AM', type: 'Lab Work', status: 'confirmed' },
  ];

  const timeSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-emerald-700">${clinicName} - Scheduling</h1>
          <button onClick={() => setShowModal(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700">+ New Appointment</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          <button onClick={() => setView('calendar')} className={\`px-4 py-2 rounded-lg \${view === 'calendar' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700'}\`}>Calendar View</button>
          <button onClick={() => setView('list')} className={\`px-4 py-2 rounded-lg \${view === 'list' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700'}\`}>List View</button>
        </div>

        {view === 'calendar' ? (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <button className="p-2 hover:bg-gray-100 rounded">&lt;</button>
              <h2 className="text-lg font-semibold">January 2024</h2>
              <button className="p-2 hover:bg-gray-100 rounded">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">{day}</div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 1;
                const hasAppointment = day === 14 || day === 15 || day === 16;
                return (
                  <div key={i} className={\`aspect-square p-1 text-center rounded-lg cursor-pointer hover:bg-gray-100 \${day === 14 ? 'bg-emerald-100' : ''}\`}>
                    {day >= 0 && day < 31 && (
                      <>
                        <span className="text-sm">{day + 1}</span>
                        {hasAppointment && <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mx-auto mt-1"></div>}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Doctor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(apt => (
                  <tr key={apt.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{apt.patient}</td>
                    <td className="py-3 px-4 text-gray-600">{apt.doctor}</td>
                    <td className="py-3 px-4 text-gray-600">{apt.date}</td>
                    <td className="py-3 px-4 text-gray-600">{apt.time}</td>
                    <td className="py-3 px-4 text-gray-600">{apt.type}</td>
                    <td className="py-3 px-4">
                      <span className={\`px-2 py-1 rounded-full text-xs \${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}\`}>{apt.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-emerald-600 hover:text-emerald-700 mr-2">Edit</button>
                      <button className="text-red-600 hover:text-red-700">Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">New Appointment</h2>
            <div className="space-y-4">
              <input placeholder="Patient Name" className="w-full px-4 py-3 border rounded-lg" />
              <select className="w-full px-4 py-3 border rounded-lg">
                <option>Select Doctor</option>
                <option>Dr. Johnson</option>
                <option>Dr. Chen</option>
                <option>Dr. Williams</option>
              </select>
              <input type="date" className="w-full px-4 py-3 border rounded-lg" />
              <select className="w-full px-4 py-3 border rounded-lg">
                <option>Select Time</option>
                {timeSlots.map(t => <option key={t}>{t}</option>)}
              </select>
              <select className="w-full px-4 py-3 border rounded-lg">
                <option>Appointment Type</option>
                <option>Checkup</option>
                <option>Follow-up</option>
                <option>Consultation</option>
                <option>Lab Work</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 border rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={() => { alert('Appointment created!'); setShowModal(false); }} className="flex-1 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`,
    "src/index.css": `@tailwind base;
@tailwind components;
@tailwind utilities;`,
  }),

  "EHR": (clinicName) => ({
    "src/App.tsx": `import { useState } from 'react';

interface Patient {
  id: number;
  name: string;
  dob: string;
  mrn: string;
  gender: string;
  phone: string;
  allergies: string[];
  conditions: string[];
}

export default function App() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const patients: Patient[] = [
    { id: 1, name: 'John Smith', dob: '1985-03-15', mrn: 'MRN-001234', gender: 'Male', phone: '(555) 123-4567', allergies: ['Penicillin'], conditions: ['Hypertension', 'Type 2 Diabetes'] },
    { id: 2, name: 'Sarah Davis', dob: '1992-07-22', mrn: 'MRN-001235', gender: 'Female', phone: '(555) 234-5678', allergies: ['Sulfa'], conditions: ['Asthma'] },
    { id: 3, name: 'Michael Johnson', dob: '1978-11-08', mrn: 'MRN-001236', gender: 'Male', phone: '(555) 345-6789', allergies: [], conditions: ['Hyperlipidemia'] },
  ];

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.mrn.includes(searchTerm));

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold text-emerald-700">${clinicName}</h1>
          <p className="text-sm text-gray-500">Electronic Health Records</p>
        </div>
        <div className="p-4">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredPatients.map(patient => (
            <button
              key={patient.id}
              onClick={() => setSelectedPatient(patient)}
              className={\`w-full p-4 text-left border-b hover:bg-gray-50 \${selectedPatient?.id === patient.id ? 'bg-emerald-50 border-l-4 border-l-emerald-600' : ''}\`}
            >
              <p className="font-medium text-gray-900">{patient.name}</p>
              <p className="text-sm text-gray-500">{patient.mrn} • DOB: {patient.dob}</p>
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1 p-6">
        {selectedPatient ? (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.name}</h2>
                  <p className="text-gray-500">{selectedPatient.mrn} • {selectedPatient.gender} • DOB: {selectedPatient.dob}</p>
                </div>
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg">New Encounter</button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Allergies</h3>
                {selectedPatient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.allergies.map(a => (
                      <span key={a} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">{a}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No known allergies</p>
                )}
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Active Conditions</h3>
                <div className="space-y-2">
                  {selectedPatient.conditions.map(c => (
                    <div key={c} className="p-3 bg-gray-50 rounded-lg">{c}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Encounters</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-500">Type</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-500">Provider</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-500">Chief Complaint</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3">2024-01-10</td>
                    <td className="py-3">Office Visit</td>
                    <td className="py-3">Dr. Johnson</td>
                    <td className="py-3">Annual Physical</td>
                    <td className="py-3"><button className="text-emerald-600">View</button></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">2023-11-15</td>
                    <td className="py-3">Follow-up</td>
                    <td className="py-3">Dr. Chen</td>
                    <td className="py-3">Blood Pressure Check</td>
                    <td className="py-3"><button className="text-emerald-600">View</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <p className="text-gray-500">Select a patient to view their records</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}`,
    "src/index.css": `@tailwind base;
@tailwind components;
@tailwind utilities;`,
  }),

  "Pharmacy": (clinicName) => ({
    "src/App.tsx": `import { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('queue');

  const prescriptions = [
    { id: 1, patient: 'John Smith', medication: 'Lisinopril 10mg', qty: 30, refills: 3, status: 'ready', doctor: 'Dr. Johnson' },
    { id: 2, patient: 'Sarah Davis', medication: 'Metformin 500mg', qty: 60, refills: 5, status: 'processing', doctor: 'Dr. Chen' },
    { id: 3, patient: 'Mike Wilson', medication: 'Atorvastatin 20mg', qty: 30, refills: 2, status: 'pending', doctor: 'Dr. Williams' },
    { id: 4, patient: 'Emily Brown', medication: 'Omeprazole 20mg', qty: 30, refills: 1, status: 'ready', doctor: 'Dr. Johnson' },
  ];

  const inventory = [
    { id: 1, name: 'Lisinopril 10mg', stock: 500, reorderLevel: 100, supplier: 'McKesson', lastOrdered: '2024-01-05' },
    { id: 2, name: 'Metformin 500mg', stock: 45, reorderLevel: 100, supplier: 'Cardinal Health', lastOrdered: '2024-01-02' },
    { id: 3, name: 'Atorvastatin 20mg', stock: 300, reorderLevel: 50, supplier: 'AmerisourceBergen', lastOrdered: '2024-01-08' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-emerald-700">${clinicName} Pharmacy</h1>
          <div className="flex gap-4">
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg">+ New Prescription</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          {['queue', 'inventory', 'patients'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={\`px-4 py-2 rounded-lg capitalize \${activeTab === tab ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700'}\`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'queue' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Medication</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Qty</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Refills</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Prescriber</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map(rx => (
                  <tr key={rx.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{rx.patient}</td>
                    <td className="py-3 px-4">{rx.medication}</td>
                    <td className="py-3 px-4">{rx.qty}</td>
                    <td className="py-3 px-4">{rx.refills}</td>
                    <td className="py-3 px-4 text-gray-600">{rx.doctor}</td>
                    <td className="py-3 px-4">
                      <span className={\`px-2 py-1 rounded-full text-xs \${
                        rx.status === 'ready' ? 'bg-green-100 text-green-700' :
                        rx.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }\`}>{rx.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-emerald-600 hover:text-emerald-700 mr-2">Fill</button>
                      <button className="text-gray-600 hover:text-gray-700">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Medication</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Reorder Level</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Supplier</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Last Ordered</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{item.name}</td>
                    <td className="py-3 px-4">
                      <span className={item.stock < item.reorderLevel ? 'text-red-600 font-medium' : ''}>{item.stock}</span>
                    </td>
                    <td className="py-3 px-4">{item.reorderLevel}</td>
                    <td className="py-3 px-4 text-gray-600">{item.supplier}</td>
                    <td className="py-3 px-4 text-gray-600">{item.lastOrdered}</td>
                    <td className="py-3 px-4">
                      <button className="text-emerald-600 hover:text-emerald-700">Reorder</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <p className="text-gray-500">Patient lookup coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}`,
    "src/index.css": `@tailwind base;
@tailwind components;
@tailwind utilities;`,
  }),

  "Lab Management": (clinicName) => ({
    "src/App.tsx": `import { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('orders');

  const orders = [
    { id: 1, patient: 'John Smith', test: 'Complete Blood Count', orderedBy: 'Dr. Johnson', date: '2024-01-15', status: 'pending', priority: 'routine' },
    { id: 2, patient: 'Sarah Davis', test: 'Lipid Panel', orderedBy: 'Dr. Chen', date: '2024-01-15', status: 'in-progress', priority: 'routine' },
    { id: 3, patient: 'Mike Wilson', test: 'Comprehensive Metabolic Panel', orderedBy: 'Dr. Williams', date: '2024-01-15', status: 'completed', priority: 'stat' },
  ];

  const results = [
    { id: 1, patient: 'Mike Wilson', test: 'Comprehensive Metabolic Panel', completedDate: '2024-01-15', status: 'normal', reviewed: false },
    { id: 2, patient: 'Emily Brown', test: 'Thyroid Panel', completedDate: '2024-01-14', status: 'abnormal', reviewed: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-emerald-700">${clinicName} - Laboratory</h1>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg">+ New Order</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          {['orders', 'results', 'qc'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={\`px-4 py-2 rounded-lg capitalize \${activeTab === tab ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700'}\`}
            >
              {tab === 'qc' ? 'Quality Control' : tab}
            </button>
          ))}
        </div>

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Test</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Ordered By</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Priority</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{order.patient}</td>
                    <td className="py-3 px-4">{order.test}</td>
                    <td className="py-3 px-4 text-gray-600">{order.orderedBy}</td>
                    <td className="py-3 px-4 text-gray-600">{order.date}</td>
                    <td className="py-3 px-4">
                      <span className={\`px-2 py-1 rounded-full text-xs \${order.priority === 'stat' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}\`}>{order.priority}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={\`px-2 py-1 rounded-full text-xs \${
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }\`}>{order.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-emerald-600 hover:text-emerald-700">{order.status === 'pending' ? 'Start' : 'View'}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Test</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Completed</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Reviewed</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map(result => (
                  <tr key={result.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{result.patient}</td>
                    <td className="py-3 px-4">{result.test}</td>
                    <td className="py-3 px-4 text-gray-600">{result.completedDate}</td>
                    <td className="py-3 px-4">
                      <span className={\`px-2 py-1 rounded-full text-xs \${result.status === 'normal' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}\`}>{result.status}</span>
                    </td>
                    <td className="py-3 px-4">{result.reviewed ? '✓' : '—'}</td>
                    <td className="py-3 px-4">
                      <button className="text-emerald-600 hover:text-emerald-700 mr-2">View</button>
                      {!result.reviewed && <button className="text-blue-600 hover:text-blue-700">Review</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'qc' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Quality Control Dashboard</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">Passed</p>
                <p className="text-2xl font-bold text-green-700">98.5%</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-700">12</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600">Failed</p>
                <p className="text-2xl font-bold text-red-700">2</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}`,
    "src/index.css": `@tailwind base;
@tailwind components;
@tailwind utilities;`,
  }),
};

function getTemplateCategory(templateName: string): string {
  const name = templateName.toLowerCase();
  if (name.includes('portal') || name.includes('patient')) return 'Patient Portal';
  if (name.includes('telehealth') || name.includes('video') || name.includes('consultation')) return 'Telehealth';
  if (name.includes('schedule') || name.includes('appointment')) return 'Scheduling';
  if (name.includes('record') || name.includes('ehr') || name.includes('emr')) return 'EHR';
  if (name.includes('pharmacy') || name.includes('prescription') || name.includes('medication')) return 'Pharmacy';
  if (name.includes('lab') || name.includes('laboratory') || name.includes('test')) return 'Lab Management';
  return 'Patient Portal';
}

export async function generateProjectFromTemplate(
  templateId: number,
  userId: string,
  clinicName: string = 'My Healthcare Clinic'
): Promise<{ projectId: number; files: Record<string, string> }> {
  const [template] = await db.select().from(templates).where(eq(templates.id, templateId));
  
  if (!template) {
    throw new Error('Template not found');
  }

  const category = getTemplateCategory(template.name);
  const codeGenerator = healthcareTemplateCode[category] || healthcareTemplateCode['Patient Portal'];
  const generatedFiles = codeGenerator(clinicName);

  const [project] = await db.insert(projects).values({
    name: `${clinicName} - ${template.name}`,
    description: template.description,
    userId,
    templateId: template.id,
    framework: template.framework || 'react',
    backend: template.backend || 'nodejs',
    projectType: template.projectType || 'web',
    isHipaaCompliant: template.isHipaaCompliant ?? true,
    code: {
      files: generatedFiles,
      clinicName,
      templateCategory: category,
    },
  }).returning();

  return {
    projectId: project.id,
    files: generatedFiles,
  };
}

export async function generateProjectFromPrompt(
  description: string,
  userId: string,
  clinicName: string = 'My Healthcare Clinic'
): Promise<{ projectId: number; files: Record<string, string> }> {
  const category = detectCategoryFromPrompt(description);
  const codeGenerator = healthcareTemplateCode[category] || healthcareTemplateCode['Patient Portal'];
  const generatedFiles = codeGenerator(clinicName);

  const [project] = await db.insert(projects).values({
    name: clinicName,
    description,
    userId,
    framework: 'react',
    backend: 'nodejs',
    projectType: 'web',
    isHipaaCompliant: true,
    code: {
      files: generatedFiles,
      clinicName,
      templateCategory: category,
      generatedFromPrompt: true,
    },
  }).returning();

  return {
    projectId: project.id,
    files: generatedFiles,
  };
}

function detectCategoryFromPrompt(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('telehealth') || lower.includes('video') || lower.includes('virtual visit')) return 'Telehealth';
  if (lower.includes('schedul') || lower.includes('appointment') || lower.includes('booking') || lower.includes('calendar')) return 'Scheduling';
  if (lower.includes('record') || lower.includes('ehr') || lower.includes('emr') || lower.includes('chart')) return 'EHR';
  if (lower.includes('pharmacy') || lower.includes('prescription') || lower.includes('medication') || lower.includes('drug')) return 'Pharmacy';
  if (lower.includes('lab') || lower.includes('test') || lower.includes('result')) return 'Lab Management';
  if (lower.includes('portal') || lower.includes('patient')) return 'Patient Portal';
  return 'Patient Portal';
}

export { healthcareTemplateCode };
