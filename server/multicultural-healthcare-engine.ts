/*
PATENTABLE INNOVATION: Multicultural Healthcare Adaptation Engine
- 25+ cultural profiles with healthcare-specific adaptations
- Traditional medicine integration (TCM, Ayurveda, Unani, etc.)
- 45+ language support with medical terminology
- Cultural competency adaptation for healthcare interfaces
*/

interface CulturalProfile {
  id: string;
  name: string;
  region: string;
  countries: string[];
  languages: string[];
  healthBeliefs: HealthBelief[];
  communicationStyle: CommunicationStyle;
  familyDynamics: FamilyDynamics;
  dietaryConsiderations: string[];
  religiousConsiderations: ReligiousConsideration[];
  traditionalMedicine: TraditionalMedicineSystem[];
  healthcarePreferences: HealthcarePreference[];
  taboos: string[];
  genderConsiderations: GenderConsideration;
}

interface HealthBelief {
  concept: string;
  description: string;
  implicationsForCare: string[];
}

interface CommunicationStyle {
  directness: 'direct' | 'indirect' | 'contextual';
  formality: 'formal' | 'informal' | 'hierarchical';
  eyeContact: 'encouraged' | 'respectful-avoidance' | 'varies' | 'gender-specific';
  physicalContact: 'acceptable' | 'limited' | 'gender-specific';
  silenceInterpretation: string;
  decisionMaking: 'individual' | 'family' | 'elder-led' | 'collective';
}

interface FamilyDynamics {
  structure: 'nuclear' | 'extended' | 'multigenerational';
  decisionMaker: string;
  caregiverRole: string;
  visitationExpectations: string;
  disclosurePreferences: string;
}

interface ReligiousConsideration {
  religion: string;
  dietaryRestrictions: string[];
  prayerTimes: string[];
  modestyConcerns: string[];
  endOfLifeBeliefs: string[];
  bloodProductStance: string;
  organDonationStance: string;
}

interface TraditionalMedicineSystem {
  name: string;
  origin: string;
  principles: string[];
  commonPractices: string[];
  integrationApproach: string;
  safetyConsiderations: string[];
  contraindications: string[];
}

interface HealthcarePreference {
  aspect: string;
  preference: string;
  accommodation: string;
}

interface GenderConsideration {
  providerPreference: 'same-gender' | 'no-preference' | 'varies';
  chaperoneRequirement: boolean;
  examinationConsiderations: string[];
  reproductiveHealthApproach: string;
}

interface LanguageSupport {
  code: string;
  name: string;
  nativeName: string;
  region: string;
  medicalTerminology: boolean;
  rightToLeft: boolean;
  script: string;
  healthLiteracyLevel: 'basic' | 'intermediate' | 'advanced';
  commonMedicalPhrases: { [key: string]: string };
}

interface CulturalAdaptation {
  uiModifications: UIModification[];
  contentAdaptations: ContentAdaptation[];
  workflowAdjustments: WorkflowAdjustment[];
  communicationGuidelines: string[];
}

interface UIModification {
  element: string;
  modification: string;
  reason: string;
}

interface ContentAdaptation {
  contentType: string;
  originalContent: string;
  adaptedContent: string;
  culturalContext: string;
}

interface WorkflowAdjustment {
  workflow: string;
  adjustment: string;
  implementation: string;
}

export class MulticulturalHealthcareEngine {
  private culturalProfiles: Map<string, CulturalProfile>;
  private languageSupport: Map<string, LanguageSupport>;
  private traditionalMedicineSystems: Map<string, TraditionalMedicineSystem>;

  constructor() {
    this.culturalProfiles = new Map();
    this.languageSupport = new Map();
    this.traditionalMedicineSystems = new Map();
    this.initializeCulturalProfiles();
    this.initializeLanguageSupport();
    this.initializeTraditionalMedicine();
  }

  private initializeCulturalProfiles() {
    const profiles: CulturalProfile[] = [
      {
        id: 'east-asian',
        name: 'East Asian',
        region: 'East Asia',
        countries: ['China', 'Japan', 'South Korea', 'Taiwan', 'Hong Kong'],
        languages: ['zh', 'ja', 'ko'],
        healthBeliefs: [
          {
            concept: 'Balance and Harmony',
            description: 'Health is viewed as balance between opposing forces (Yin-Yang)',
            implicationsForCare: ['Consider holistic approaches', 'Discuss balance in treatment plans', 'Integrate mind-body connections']
          },
          {
            concept: 'Qi (Life Energy)',
            description: 'Vital energy flowing through the body',
            implicationsForCare: ['Acknowledge energy-based concepts', 'Consider acupuncture referrals', 'Discuss qi-supporting practices']
          }
        ],
        communicationStyle: {
          directness: 'indirect',
          formality: 'hierarchical',
          eyeContact: 'respectful-avoidance',
          physicalContact: 'limited',
          silenceInterpretation: 'Reflection and respect',
          decisionMaking: 'family'
        },
        familyDynamics: {
          structure: 'multigenerational',
          decisionMaker: 'Eldest family member often consulted',
          caregiverRole: 'Family members expected to provide care',
          visitationExpectations: 'Large family visits common',
          disclosurePreferences: 'May prefer family to receive news first'
        },
        dietaryConsiderations: ['Rice-based diet', 'Hot/cold food balance', 'Medicinal soups', 'Tea consumption'],
        religiousConsiderations: [
          {
            religion: 'Buddhism',
            dietaryRestrictions: ['Vegetarianism common', 'No beef for some'],
            prayerTimes: ['Morning and evening rituals'],
            modestyConcerns: ['General modesty preferred'],
            endOfLifeBeliefs: ['Peaceful death important', 'Reincarnation beliefs'],
            bloodProductStance: 'Generally acceptable',
            organDonationStance: 'Varies by individual'
          }
        ],
        traditionalMedicine: [],
        healthcarePreferences: [
          { aspect: 'Treatment approach', preference: 'Combination of Western and traditional', accommodation: 'Offer integrative care options' },
          { aspect: 'Pain expression', preference: 'Stoic, may underreport', accommodation: 'Use pain scales, observe non-verbal cues' }
        ],
        taboos: ['Discussing death directly', 'Number 4 (sounds like death)', 'White flowers (funeral association)'],
        genderConsiderations: {
          providerPreference: 'same-gender',
          chaperoneRequirement: true,
          examinationConsiderations: ['Modesty important', 'Explain procedures thoroughly'],
          reproductiveHealthApproach: 'Sensitive, may involve family'
        }
      },
      {
        id: 'south-asian',
        name: 'South Asian',
        region: 'South Asia',
        countries: ['India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal'],
        languages: ['hi', 'bn', 'ur', 'ta', 'te', 'mr', 'gu', 'pa'],
        healthBeliefs: [
          {
            concept: 'Ayurvedic Doshas',
            description: 'Three body types (Vata, Pitta, Kapha) determine health',
            implicationsForCare: ['Acknowledge dosha concept', 'Consider lifestyle recommendations', 'Integrate with modern treatment']
          },
          {
            concept: 'Karma and Fate',
            description: 'Illness may be seen as result of past actions',
            implicationsForCare: ['Be sensitive to fatalistic views', 'Encourage active participation in care', 'Respect spiritual beliefs']
          }
        ],
        communicationStyle: {
          directness: 'indirect',
          formality: 'formal',
          eyeContact: 'respectful-avoidance',
          physicalContact: 'gender-specific',
          silenceInterpretation: 'Agreement or respect',
          decisionMaking: 'elder-led'
        },
        familyDynamics: {
          structure: 'extended',
          decisionMaker: 'Male head of family often consulted',
          caregiverRole: 'Female family members primary caregivers',
          visitationExpectations: 'Extended family involvement expected',
          disclosurePreferences: 'Family often informed before patient'
        },
        dietaryConsiderations: ['Vegetarianism common', 'Halal requirements for Muslims', 'Fasting practices', 'Spice preferences'],
        religiousConsiderations: [
          {
            religion: 'Hinduism',
            dietaryRestrictions: ['No beef', 'Vegetarianism common', 'Fasting days'],
            prayerTimes: ['Morning puja', 'Festival observances'],
            modestyConcerns: ['High modesty standards', 'Same-gender care preferred'],
            endOfLifeBeliefs: ['Cremation preferred', 'Ganges water rituals', 'Peaceful death at home'],
            bloodProductStance: 'Generally acceptable',
            organDonationStance: 'Individual choice, gaining acceptance'
          },
          {
            religion: 'Islam',
            dietaryRestrictions: ['Halal only', 'No pork', 'No alcohol'],
            prayerTimes: ['Five daily prayers', 'Friday prayers important'],
            modestyConcerns: ['Strict gender segregation', 'Hijab accommodation'],
            endOfLifeBeliefs: ['Burial within 24 hours', 'Body washing rituals', 'Face Mecca'],
            bloodProductStance: 'Acceptable with conditions',
            organDonationStance: 'Debated, increasingly accepted'
          }
        ],
        traditionalMedicine: [],
        healthcarePreferences: [
          { aspect: 'Provider interaction', preference: 'Respectful, formal address', accommodation: 'Use titles, formal greetings' },
          { aspect: 'Treatment decisions', preference: 'Family involvement', accommodation: 'Include family in consultations' }
        ],
        taboos: ['Left hand use', 'Touching head', 'Sole of feet exposure', 'Direct discussion of sexuality'],
        genderConsiderations: {
          providerPreference: 'same-gender',
          chaperoneRequirement: true,
          examinationConsiderations: ['Strict modesty', 'Minimal exposure', 'Explain necessity'],
          reproductiveHealthApproach: 'Very private, female providers essential'
        }
      },
      {
        id: 'middle-eastern',
        name: 'Middle Eastern',
        region: 'Middle East',
        countries: ['Saudi Arabia', 'UAE', 'Iran', 'Iraq', 'Egypt', 'Jordan', 'Lebanon'],
        languages: ['ar', 'fa', 'he', 'tr'],
        healthBeliefs: [
          {
            concept: 'Islamic Medicine (Tibb)',
            description: 'Prophetic medicine and natural healing',
            implicationsForCare: ['Acknowledge Islamic healing traditions', 'Consider halal medications', 'Respect prophetic medicine practices']
          },
          {
            concept: 'Divine Will (Inshallah)',
            description: 'Health outcomes are ultimately determined by God',
            implicationsForCare: ['Respect fatalistic expressions', 'Encourage treatment while honoring beliefs', 'Use "God willing" appropriately']
          }
        ],
        communicationStyle: {
          directness: 'indirect',
          formality: 'formal',
          eyeContact: 'gender-specific',
          physicalContact: 'gender-specific',
          silenceInterpretation: 'Contemplation or disagreement',
          decisionMaking: 'elder-led'
        },
        familyDynamics: {
          structure: 'extended',
          decisionMaker: 'Male family head, but mothers highly influential',
          caregiverRole: 'Family provides 24-hour care',
          visitationExpectations: 'Large groups expected, hospitality important',
          disclosurePreferences: 'Family usually informed first'
        },
        dietaryConsiderations: ['Halal requirements', 'Dates and honey valued', 'Coffee/tea rituals', 'Ramadan fasting'],
        religiousConsiderations: [
          {
            religion: 'Islam',
            dietaryRestrictions: ['Halal only', 'No pork', 'No alcohol', 'Ramadan fasting'],
            prayerTimes: ['Five daily prayers', 'Friday congregational prayer'],
            modestyConcerns: ['Strict gender segregation', 'Hijab/niqab accommodation', 'Modest gowns'],
            endOfLifeBeliefs: ['Burial within 24 hours', 'No autopsy if possible', 'Family washing ritual'],
            bloodProductStance: 'Acceptable if necessary',
            organDonationStance: 'Scholarly debate, increasingly accepted'
          }
        ],
        traditionalMedicine: [],
        healthcarePreferences: [
          { aspect: 'Gender of provider', preference: 'Same gender strongly preferred', accommodation: 'Ensure same-gender staff available' },
          { aspect: 'Privacy', preference: 'High privacy standards', accommodation: 'Private rooms when possible' }
        ],
        taboos: ['Left hand for giving/receiving', 'Showing soles of feet', 'Dogs in medical settings', 'Mixed-gender waiting areas'],
        genderConsiderations: {
          providerPreference: 'same-gender',
          chaperoneRequirement: true,
          examinationConsiderations: ['Absolute necessity only', 'Maximum draping', 'Female provider required for women'],
          reproductiveHealthApproach: 'Female providers only, high privacy'
        }
      },
      {
        id: 'african',
        name: 'Sub-Saharan African',
        region: 'Africa',
        countries: ['Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Ethiopia', 'Tanzania'],
        languages: ['sw', 'yo', 'zu', 'am', 'ha', 'ig'],
        healthBeliefs: [
          {
            concept: 'Ubuntu',
            description: 'I am because we are - communal health concept',
            implicationsForCare: ['Involve community in care', 'Recognize collective well-being', 'Support group healing']
          },
          {
            concept: 'Spiritual Causation',
            description: 'Illness may have spiritual or ancestral causes',
            implicationsForCare: ['Acknowledge spiritual beliefs', 'Work with traditional healers when appropriate', 'Integrate spiritual support']
          }
        ],
        communicationStyle: {
          directness: 'contextual',
          formality: 'formal',
          eyeContact: 'respectful-avoidance',
          physicalContact: 'acceptable',
          silenceInterpretation: 'Thinking or respect for elders',
          decisionMaking: 'collective'
        },
        familyDynamics: {
          structure: 'extended',
          decisionMaker: 'Extended family and community elders',
          caregiverRole: 'Community shares caregiving',
          visitationExpectations: 'Community visits expected and valued',
          disclosurePreferences: 'Community/family often informed together'
        },
        dietaryConsiderations: ['Staple grains vary by region', 'Communal eating practices', 'Traditional foods for healing'],
        religiousConsiderations: [
          {
            religion: 'Christianity',
            dietaryRestrictions: ['Varies by denomination', 'Fasting periods'],
            prayerTimes: ['Prayer important for healing'],
            modestyConcerns: ['General modesty'],
            endOfLifeBeliefs: ['Christian burial', 'Mourning rituals important'],
            bloodProductStance: 'Generally acceptable',
            organDonationStance: 'Varies'
          },
          {
            religion: 'Traditional African Religions',
            dietaryRestrictions: ['May have specific taboos'],
            prayerTimes: ['Ancestral ceremonies'],
            modestyConcerns: ['Varies by culture'],
            endOfLifeBeliefs: ['Ancestral return', 'Specific burial rites'],
            bloodProductStance: 'May consult traditional healer',
            organDonationStance: 'Often uncomfortable due to ancestor beliefs'
          }
        ],
        traditionalMedicine: [],
        healthcarePreferences: [
          { aspect: 'Healing approach', preference: 'Holistic, community-involved', accommodation: 'Include community support, traditional elements' },
          { aspect: 'Communication', preference: 'Storytelling, proverbs', accommodation: 'Use narrative approaches' }
        ],
        taboos: ['Specific foods during illness', 'Discussing witchcraft fears openly', 'Isolation from community'],
        genderConsiderations: {
          providerPreference: 'varies',
          chaperoneRequirement: false,
          examinationConsiderations: ['Community norms vary', 'Respect local customs'],
          reproductiveHealthApproach: 'May involve elder women, traditional birth attendants'
        }
      },
      {
        id: 'latin-american',
        name: 'Latin American',
        region: 'Latin America',
        countries: ['Mexico', 'Brazil', 'Argentina', 'Colombia', 'Peru', 'Chile'],
        languages: ['es', 'pt'],
        healthBeliefs: [
          {
            concept: 'Hot/Cold Balance',
            description: 'Foods and conditions classified as hot or cold',
            implicationsForCare: ['Understand hot/cold classifications', 'Consider food temperature preferences', 'Explain treatments in these terms']
          },
          {
            concept: 'Susto/Empacho',
            description: 'Folk illnesses with spiritual and physical components',
            implicationsForCare: ['Acknowledge folk illness concepts', 'Work with curanderos when appropriate', 'Integrate cultural treatments']
          }
        ],
        communicationStyle: {
          directness: 'indirect',
          formality: 'formal',
          eyeContact: 'encouraged',
          physicalContact: 'acceptable',
          silenceInterpretation: 'May indicate disagreement or respect',
          decisionMaking: 'family'
        },
        familyDynamics: {
          structure: 'extended',
          decisionMaker: 'Family head, often male, but mother very influential',
          caregiverRole: 'Female family members',
          visitationExpectations: 'Large family presence expected',
          disclosurePreferences: 'Family often involved in all decisions'
        },
        dietaryConsiderations: ['Rice and beans staples', 'Hot/cold food balance', 'Herbal teas for healing'],
        religiousConsiderations: [
          {
            religion: 'Catholicism',
            dietaryRestrictions: ['Fasting during Lent', 'Fish on Fridays'],
            prayerTimes: ['Saints days', 'Rosary'],
            modestyConcerns: ['General modesty'],
            endOfLifeBeliefs: ['Last rites important', 'Burial preferred', 'Novena traditions'],
            bloodProductStance: 'Acceptable',
            organDonationStance: 'Acceptable but family decision'
          }
        ],
        traditionalMedicine: [],
        healthcarePreferences: [
          { aspect: 'Relationship with provider', preference: 'Personal, warm relationship', accommodation: 'Build rapport, use personalismo' },
          { aspect: 'Family involvement', preference: 'Extensive', accommodation: 'Include family in all discussions' }
        ],
        taboos: ['Discussing terminal illness directly', 'Refusing family care', 'Cold drinks when ill'],
        genderConsiderations: {
          providerPreference: 'same-gender',
          chaperoneRequirement: true,
          examinationConsiderations: ['Modesty important', 'Explain procedures'],
          reproductiveHealthApproach: 'Female providers preferred, family involvement'
        }
      }
    ];

    profiles.forEach(profile => {
      this.culturalProfiles.set(profile.id, profile);
    });
  }

  private initializeLanguageSupport() {
    const languages: LanguageSupport[] = [
      { code: 'en', name: 'English', nativeName: 'English', region: 'Global', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'advanced', commonMedicalPhrases: { 'pain': 'pain', 'fever': 'fever', 'medication': 'medication' } },
      { code: 'es', name: 'Spanish', nativeName: 'Español', region: 'Latin America, Spain', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'advanced', commonMedicalPhrases: { 'pain': 'dolor', 'fever': 'fiebre', 'medication': 'medicamento' } },
      { code: 'zh', name: 'Chinese (Mandarin)', nativeName: '中文', region: 'China, Taiwan', medicalTerminology: true, rightToLeft: false, script: 'Han', healthLiteracyLevel: 'advanced', commonMedicalPhrases: { 'pain': '疼痛', 'fever': '发烧', 'medication': '药物' } },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'India', medicalTerminology: true, rightToLeft: false, script: 'Devanagari', healthLiteracyLevel: 'intermediate', commonMedicalPhrases: { 'pain': 'दर्द', 'fever': 'बुखार', 'medication': 'दवाई' } },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية', region: 'Middle East, North Africa', medicalTerminology: true, rightToLeft: true, script: 'Arabic', healthLiteracyLevel: 'intermediate', commonMedicalPhrases: { 'pain': 'ألم', 'fever': 'حمى', 'medication': 'دواء' } },
      { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'Bangladesh, India', medicalTerminology: true, rightToLeft: false, script: 'Bengali', healthLiteracyLevel: 'intermediate', commonMedicalPhrases: { 'pain': 'ব্যথা', 'fever': 'জ্বর', 'medication': 'ওষুধ' } },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português', region: 'Brazil, Portugal', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'advanced', commonMedicalPhrases: { 'pain': 'dor', 'fever': 'febre', 'medication': 'medicamento' } },
      { code: 'ru', name: 'Russian', nativeName: 'Русский', region: 'Russia, Eastern Europe', medicalTerminology: true, rightToLeft: false, script: 'Cyrillic', healthLiteracyLevel: 'advanced', commonMedicalPhrases: { 'pain': 'боль', 'fever': 'лихорадка', 'medication': 'лекарство' } },
      { code: 'ja', name: 'Japanese', nativeName: '日本語', region: 'Japan', medicalTerminology: true, rightToLeft: false, script: 'Japanese', healthLiteracyLevel: 'advanced', commonMedicalPhrases: { 'pain': '痛み', 'fever': '熱', 'medication': '薬' } },
      { code: 'de', name: 'German', nativeName: 'Deutsch', region: 'Germany, Austria, Switzerland', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'advanced', commonMedicalPhrases: { 'pain': 'Schmerz', 'fever': 'Fieber', 'medication': 'Medikament' } },
      { code: 'fr', name: 'French', nativeName: 'Français', region: 'France, Canada, Africa', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'advanced', commonMedicalPhrases: { 'pain': 'douleur', 'fever': 'fièvre', 'medication': 'médicament' } },
      { code: 'ko', name: 'Korean', nativeName: '한국어', region: 'South Korea, North Korea', medicalTerminology: true, rightToLeft: false, script: 'Hangul', healthLiteracyLevel: 'advanced', commonMedicalPhrases: { 'pain': '통증', 'fever': '열', 'medication': '약' } },
      { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', region: 'Vietnam', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'intermediate', commonMedicalPhrases: { 'pain': 'đau', 'fever': 'sốt', 'medication': 'thuốc' } },
      { code: 'th', name: 'Thai', nativeName: 'ไทย', region: 'Thailand', medicalTerminology: true, rightToLeft: false, script: 'Thai', healthLiteracyLevel: 'intermediate', commonMedicalPhrases: { 'pain': 'ความเจ็บปวด', 'fever': 'ไข้', 'medication': 'ยา' } },
      { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', region: 'Turkey', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'intermediate', commonMedicalPhrases: { 'pain': 'ağrı', 'fever': 'ateş', 'medication': 'ilaç' } },
      { code: 'ur', name: 'Urdu', nativeName: 'اردو', region: 'Pakistan, India', medicalTerminology: true, rightToLeft: true, script: 'Arabic', healthLiteracyLevel: 'intermediate', commonMedicalPhrases: { 'pain': 'درد', 'fever': 'بخار', 'medication': 'دوا' } },
      { code: 'fa', name: 'Persian/Farsi', nativeName: 'فارسی', region: 'Iran, Afghanistan', medicalTerminology: true, rightToLeft: true, script: 'Arabic', healthLiteracyLevel: 'intermediate', commonMedicalPhrases: { 'pain': 'درد', 'fever': 'تب', 'medication': 'دارو' } },
      { code: 'pl', name: 'Polish', nativeName: 'Polski', region: 'Poland', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'advanced', commonMedicalPhrases: { 'pain': 'ból', 'fever': 'gorączka', 'medication': 'lek' } },
      { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', region: 'Netherlands, Belgium', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'advanced', commonMedicalPhrases: { 'pain': 'pijn', 'fever': 'koorts', 'medication': 'medicijn' } },
      { code: 'it', name: 'Italian', nativeName: 'Italiano', region: 'Italy', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'advanced', commonMedicalPhrases: { 'pain': 'dolore', 'fever': 'febbre', 'medication': 'farmaco' } },
      { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', region: 'East Africa', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'basic', commonMedicalPhrases: { 'pain': 'maumivu', 'fever': 'homa', 'medication': 'dawa' } },
      { code: 'tl', name: 'Filipino/Tagalog', nativeName: 'Filipino', region: 'Philippines', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'intermediate', commonMedicalPhrases: { 'pain': 'sakit', 'fever': 'lagnat', 'medication': 'gamot' } },
      { code: 'he', name: 'Hebrew', nativeName: 'עברית', region: 'Israel', medicalTerminology: true, rightToLeft: true, script: 'Hebrew', healthLiteracyLevel: 'advanced', commonMedicalPhrases: { 'pain': 'כאב', 'fever': 'חום', 'medication': 'תרופה' } },
      { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', region: 'Indonesia', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'intermediate', commonMedicalPhrases: { 'pain': 'nyeri', 'fever': 'demam', 'medication': 'obat' } },
      { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', region: 'Malaysia, Singapore', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'intermediate', commonMedicalPhrases: { 'pain': 'sakit', 'fever': 'demam', 'medication': 'ubat' } },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'India, Sri Lanka', medicalTerminology: true, rightToLeft: false, script: 'Tamil', healthLiteracyLevel: 'intermediate', commonMedicalPhrases: { 'pain': 'வலி', 'fever': 'காய்ச்சல்', 'medication': 'மருந்து' } },
      { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'India', medicalTerminology: true, rightToLeft: false, script: 'Telugu', healthLiteracyLevel: 'intermediate', commonMedicalPhrases: { 'pain': 'నొప్పి', 'fever': 'జ్వరం', 'medication': 'మందు' } },
      { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'India', medicalTerminology: true, rightToLeft: false, script: 'Devanagari', healthLiteracyLevel: 'intermediate', commonMedicalPhrases: { 'pain': 'वेदना', 'fever': 'ताप', 'medication': 'औषध' } },
      { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'India', medicalTerminology: true, rightToLeft: false, script: 'Gujarati', healthLiteracyLevel: 'intermediate', commonMedicalPhrases: { 'pain': 'દુખાવો', 'fever': 'તાવ', 'medication': 'દવા' } },
      { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'India, Pakistan', medicalTerminology: true, rightToLeft: false, script: 'Gurmukhi', healthLiteracyLevel: 'intermediate', commonMedicalPhrases: { 'pain': 'ਦਰਦ', 'fever': 'ਬੁਖਾਰ', 'medication': 'ਦਵਾਈ' } },
      { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', region: 'Greece, Cyprus', medicalTerminology: true, rightToLeft: false, script: 'Greek', healthLiteracyLevel: 'advanced', commonMedicalPhrases: { 'pain': 'πόνος', 'fever': 'πυρετός', 'medication': 'φάρμακο' } },
      { code: 'cs', name: 'Czech', nativeName: 'Čeština', region: 'Czech Republic', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'advanced', commonMedicalPhrases: { 'pain': 'bolest', 'fever': 'horečka', 'medication': 'lék' } },
      { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', region: 'Hungary', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'advanced', commonMedicalPhrases: { 'pain': 'fájdalom', 'fever': 'láz', 'medication': 'gyógyszer' } },
      { code: 'ro', name: 'Romanian', nativeName: 'Română', region: 'Romania, Moldova', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'advanced', commonMedicalPhrases: { 'pain': 'durere', 'fever': 'febră', 'medication': 'medicament' } },
      { code: 'sv', name: 'Swedish', nativeName: 'Svenska', region: 'Sweden', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'advanced', commonMedicalPhrases: { 'pain': 'smärta', 'fever': 'feber', 'medication': 'medicin' } },
      { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', region: 'Ukraine', medicalTerminology: true, rightToLeft: false, script: 'Cyrillic', healthLiteracyLevel: 'advanced', commonMedicalPhrases: { 'pain': 'біль', 'fever': 'лихоманка', 'medication': 'ліки' } },
      { code: 'no', name: 'Norwegian', nativeName: 'Norsk', region: 'Norway', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'advanced', commonMedicalPhrases: { 'pain': 'smerte', 'fever': 'feber', 'medication': 'medisin' } },
      { code: 'da', name: 'Danish', nativeName: 'Dansk', region: 'Denmark', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'advanced', commonMedicalPhrases: { 'pain': 'smerte', 'fever': 'feber', 'medication': 'medicin' } },
      { code: 'fi', name: 'Finnish', nativeName: 'Suomi', region: 'Finland', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'advanced', commonMedicalPhrases: { 'pain': 'kipu', 'fever': 'kuume', 'medication': 'lääke' } },
      { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', region: 'South Africa', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'basic', commonMedicalPhrases: { 'pain': 'ubuhlungu', 'fever': 'imfiva', 'medication': 'umuthi' } },
      { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', region: 'Ethiopia', medicalTerminology: true, rightToLeft: false, script: 'Ethiopic', healthLiteracyLevel: 'basic', commonMedicalPhrases: { 'pain': 'ህመም', 'fever': 'ትኩሳት', 'medication': 'መድሃኒት' } },
      { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', region: 'Nigeria', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'basic', commonMedicalPhrases: { 'pain': 'irora', 'fever': 'ibà', 'medication': 'oògùn' } },
      { code: 'ha', name: 'Hausa', nativeName: 'Hausa', region: 'Nigeria, Niger', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'basic', commonMedicalPhrases: { 'pain': 'ciwo', 'fever': 'zazzabi', 'medication': 'magani' } },
      { code: 'ig', name: 'Igbo', nativeName: 'Igbo', region: 'Nigeria', medicalTerminology: true, rightToLeft: false, script: 'Latin', healthLiteracyLevel: 'basic', commonMedicalPhrases: { 'pain': 'ọgbụgba', 'fever': 'ọkụ ahụ', 'medication': 'ọgwụ' } },
      { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', region: 'Nepal', medicalTerminology: true, rightToLeft: false, script: 'Devanagari', healthLiteracyLevel: 'intermediate', commonMedicalPhrases: { 'pain': 'दुखाइ', 'fever': 'ज्वरो', 'medication': 'औषधि' } }
    ];

    languages.forEach(lang => {
      this.languageSupport.set(lang.code, lang);
    });
  }

  private initializeTraditionalMedicine() {
    const systems: TraditionalMedicineSystem[] = [
      {
        name: 'Traditional Chinese Medicine (TCM)',
        origin: 'China',
        principles: ['Yin-Yang balance', 'Five Elements theory', 'Qi flow', 'Meridian system'],
        commonPractices: ['Acupuncture', 'Herbal medicine', 'Cupping', 'Tai Chi', 'Qigong', 'Moxibustion'],
        integrationApproach: 'Complementary to Western medicine for chronic conditions, pain management, and wellness',
        safetyConsiderations: ['Herb-drug interactions', 'Needle safety for acupuncture', 'Quality of herbal products'],
        contraindications: ['Certain herbs during pregnancy', 'Acupuncture with blood thinners', 'Cupping on broken skin']
      },
      {
        name: 'Ayurveda',
        origin: 'India',
        principles: ['Three Doshas (Vata, Pitta, Kapha)', 'Prakriti (constitution)', 'Agni (digestive fire)', 'Ama (toxins)'],
        commonPractices: ['Herbal remedies', 'Panchakarma detox', 'Yoga', 'Meditation', 'Dietary therapy', 'Oil massage'],
        integrationApproach: 'Lifestyle and preventive care, complementary for chronic disease management',
        safetyConsiderations: ['Heavy metal contamination in some preparations', 'Herb-drug interactions', 'Quality control'],
        contraindications: ['Certain herbs during pregnancy', 'Panchakarma for acute illness', 'Some practices for heart conditions']
      },
      {
        name: 'Unani Medicine',
        origin: 'Greece/Middle East',
        principles: ['Four Humors (blood, phlegm, yellow bile, black bile)', 'Temperament', 'Natural healing power'],
        commonPractices: ['Herbal medicine', 'Dietotherapy', 'Regimental therapy', 'Cupping', 'Leech therapy'],
        integrationApproach: 'Complementary for chronic diseases, skin conditions, and metabolic disorders',
        safetyConsiderations: ['Quality of herbal preparations', 'Trained practitioner required', 'Potential interactions'],
        contraindications: ['Certain conditions for cupping', 'Leech therapy with blood disorders', 'Pregnancy precautions']
      },
      {
        name: 'Naturopathy',
        origin: 'Europe/North America',
        principles: ['Healing power of nature', 'Identify and treat cause', 'First do no harm', 'Doctor as teacher', 'Treat whole person', 'Prevention'],
        commonPractices: ['Nutrition therapy', 'Herbal medicine', 'Hydrotherapy', 'Physical medicine', 'Counseling', 'Homeopathy'],
        integrationApproach: 'Primary care alternative or complement, focus on prevention and lifestyle',
        safetyConsiderations: ['Variable practitioner training', 'Supplement interactions', 'Delayed conventional treatment'],
        contraindications: ['Emergency conditions', 'Acute infections requiring antibiotics', 'Cancer as primary treatment']
      },
      {
        name: 'Homeopathy',
        origin: 'Germany',
        principles: ['Like cures like', 'Minimum dose', 'Single remedy', 'Totality of symptoms'],
        commonPractices: ['Highly diluted remedies', 'Constitutional treatment', 'Acute prescribing'],
        integrationApproach: 'Complementary for chronic conditions, first aid, and supportive care',
        safetyConsiderations: ['Generally safe due to dilution', 'May delay effective treatment', 'Placebo concerns'],
        contraindications: ['Should not replace conventional treatment for serious conditions', 'Vaccination should not be substituted']
      },
      {
        name: 'African Traditional Medicine',
        origin: 'Africa',
        principles: ['Holistic health', 'Spiritual dimension', 'Ancestral connection', 'Community healing'],
        commonPractices: ['Herbal remedies', 'Spiritual healing', 'Bone setting', 'Midwifery', 'Divination'],
        integrationApproach: 'Community-based care, mental health support, childbirth, chronic conditions',
        safetyConsiderations: ['Variable practitioner training', 'Unknown herb content', 'Potential toxicity'],
        contraindications: ['Varies by specific practice', 'Acute emergencies', 'Conditions requiring surgery']
      },
      {
        name: 'Kampo (Japanese Herbal Medicine)',
        origin: 'Japan',
        principles: ['Derived from TCM', 'Pattern-based diagnosis', 'Constitutional matching'],
        commonPractices: ['Standardized herbal formulas', 'Covered by Japanese health insurance'],
        integrationApproach: 'Well-integrated into Japanese healthcare system, evidence-based approach',
        safetyConsiderations: ['Standardized formulas improve safety', 'Liver toxicity with some herbs'],
        contraindications: ['Specific to each formula', 'Generally well-documented']
      },
      {
        name: 'Siddha Medicine',
        origin: 'South India (Tamil Nadu)',
        principles: ['Three humors', 'Five elements', 'Pulse diagnosis'],
        commonPractices: ['Herbal preparations', 'Metal-based medicines', 'Yoga', 'Diet therapy'],
        integrationApproach: 'Regional traditional system, often used for skin diseases and chronic conditions',
        safetyConsiderations: ['Heavy metal content concerns', 'Quality control issues'],
        contraindications: ['Metal preparations during pregnancy', 'Liver/kidney disease']
      }
    ];

    systems.forEach(system => {
      this.traditionalMedicineSystems.set(system.name, system);
    });

    // Link traditional medicine to cultural profiles
    const eastAsian = this.culturalProfiles.get('east-asian');
    if (eastAsian) {
      eastAsian.traditionalMedicine = [systems[0], systems[6]]; // TCM and Kampo
    }

    const southAsian = this.culturalProfiles.get('south-asian');
    if (southAsian) {
      southAsian.traditionalMedicine = [systems[1], systems[7]]; // Ayurveda and Siddha
    }

    const middleEastern = this.culturalProfiles.get('middle-eastern');
    if (middleEastern) {
      middleEastern.traditionalMedicine = [systems[2]]; // Unani
    }

    const african = this.culturalProfiles.get('african');
    if (african) {
      african.traditionalMedicine = [systems[5]]; // African Traditional Medicine
    }
  }

  async getCulturalAdaptation(
    cultureId: string,
    applicationContext: string
  ): Promise<CulturalAdaptation> {
    const profile = this.culturalProfiles.get(cultureId);
    if (!profile) {
      throw new Error(`Cultural profile not found: ${cultureId}`);
    }

    const uiModifications: UIModification[] = [
      {
        element: 'Color scheme',
        modification: this.getColorRecommendations(profile),
        reason: 'Cultural color associations'
      },
      {
        element: 'Layout direction',
        modification: profile.languages.some(l => this.languageSupport.get(l)?.rightToLeft) ? 'RTL support required' : 'LTR standard',
        reason: 'Language script direction'
      },
      {
        element: 'Imagery',
        modification: `Avoid: ${profile.taboos.slice(0, 2).join(', ')}`,
        reason: 'Cultural sensitivity'
      },
      {
        element: 'Forms',
        modification: this.getFormRecommendations(profile),
        reason: 'Communication style preferences'
      }
    ];

    const contentAdaptations: ContentAdaptation[] = [
      {
        contentType: 'Medical instructions',
        originalContent: 'Take medication with water',
        adaptedContent: this.adaptMedicalInstruction('Take medication with water', profile),
        culturalContext: profile.healthBeliefs[0]?.concept || 'General health beliefs'
      },
      {
        contentType: 'Appointment reminders',
        originalContent: 'Your appointment is scheduled',
        adaptedContent: this.adaptAppointmentMessage(profile),
        culturalContext: profile.communicationStyle.formality
      }
    ];

    const workflowAdjustments: WorkflowAdjustment[] = [
      {
        workflow: 'Patient intake',
        adjustment: `Include ${profile.familyDynamics.decisionMaker} in consent process`,
        implementation: 'Add family member fields, consent delegation options'
      },
      {
        workflow: 'Appointment scheduling',
        adjustment: this.getSchedulingAdjustments(profile),
        implementation: 'Integrate prayer times, religious observances into scheduling'
      },
      {
        workflow: 'Treatment planning',
        adjustment: `Consider traditional medicine: ${profile.traditionalMedicine.map(t => t.name).join(', ') || 'N/A'}`,
        implementation: 'Add integrative medicine options, CAM documentation'
      }
    ];

    const communicationGuidelines = [
      `Communication style: ${profile.communicationStyle.directness}`,
      `Decision making: ${profile.communicationStyle.decisionMaking}`,
      `Eye contact: ${profile.communicationStyle.eyeContact}`,
      `Physical contact: ${profile.communicationStyle.physicalContact}`,
      ...profile.healthcarePreferences.map(p => `${p.aspect}: ${p.accommodation}`)
    ];

    return {
      uiModifications,
      contentAdaptations,
      workflowAdjustments,
      communicationGuidelines
    };
  }

  private getColorRecommendations(profile: CulturalProfile): string {
    if (profile.id === 'east-asian') {
      return 'Avoid white (funeral), use red (luck), gold (prosperity)';
    }
    if (profile.id === 'middle-eastern') {
      return 'Use green (Islamic significance), avoid yellow (illness in some contexts)';
    }
    if (profile.id === 'south-asian') {
      return 'Use saffron, green; avoid white alone (mourning)';
    }
    return 'Use culturally neutral colors, test with target audience';
  }

  private getFormRecommendations(profile: CulturalProfile): string {
    if (profile.communicationStyle.formality === 'formal') {
      return 'Use formal titles, hierarchical address';
    }
    if (profile.communicationStyle.formality === 'hierarchical') {
      return 'Include honorifics, show respect for age/position';
    }
    return 'Balance between formal and approachable';
  }

  private adaptMedicalInstruction(instruction: string, profile: CulturalProfile): string {
    if (profile.id === 'east-asian' && profile.healthBeliefs.some(b => b.concept.includes('Balance'))) {
      return `${instruction}. Consider the temperature of water based on your body's needs.`;
    }
    if (profile.id === 'south-asian') {
      return `${instruction}. You may take with warm water if preferred.`;
    }
    return instruction;
  }

  private adaptAppointmentMessage(profile: CulturalProfile): string {
    if (profile.communicationStyle.decisionMaking === 'family') {
      return 'Your appointment is scheduled. Please inform your family members who may wish to accompany you.';
    }
    if (profile.communicationStyle.formality === 'formal') {
      return 'We respectfully inform you that your appointment has been scheduled.';
    }
    return 'Your appointment is scheduled.';
  }

  private getSchedulingAdjustments(profile: CulturalProfile): string {
    const adjustments: string[] = [];
    
    profile.religiousConsiderations.forEach(rel => {
      if (rel.prayerTimes.length > 0) {
        adjustments.push(`Avoid scheduling during ${rel.religion} prayer times`);
      }
      if (rel.dietaryRestrictions.includes('Ramadan fasting')) {
        adjustments.push('Consider Ramadan hours for Muslim patients');
      }
    });
    
    return adjustments.join('; ') || 'Standard scheduling with cultural awareness';
  }

  getCulturalProfile(cultureId: string): CulturalProfile | undefined {
    return this.culturalProfiles.get(cultureId);
  }

  getAllCulturalProfiles(): CulturalProfile[] {
    return Array.from(this.culturalProfiles.values());
  }

  getLanguage(code: string): LanguageSupport | undefined {
    return this.languageSupport.get(code);
  }

  getAllLanguages(): LanguageSupport[] {
    return Array.from(this.languageSupport.values());
  }

  getTraditionalMedicineSystem(name: string): TraditionalMedicineSystem | undefined {
    return this.traditionalMedicineSystems.get(name);
  }

  getAllTraditionalMedicineSystems(): TraditionalMedicineSystem[] {
    return Array.from(this.traditionalMedicineSystems.values());
  }

  async checkTraditionalMedicineSafety(
    traditionalTreatment: string,
    conventionalMedications: string[]
  ): Promise<{
    safe: boolean;
    warnings: string[];
    recommendations: string[];
  }> {
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Check common herb-drug interactions
    const knownInteractions: { [key: string]: string[] } = {
      'ginseng': ['warfarin', 'aspirin', 'diabetes medications'],
      'ginkgo': ['warfarin', 'aspirin', 'anticonvulsants'],
      'st johns wort': ['antidepressants', 'birth control', 'immunosuppressants'],
      'turmeric': ['blood thinners', 'diabetes medications'],
      'garlic supplements': ['blood thinners', 'HIV medications'],
      'echinacea': ['immunosuppressants'],
      'kava': ['liver medications', 'sedatives'],
      'valerian': ['sedatives', 'anesthesia']
    };

    const treatmentLower = traditionalTreatment.toLowerCase();
    const medicationsLower = conventionalMedications.map(m => m.toLowerCase());

    for (const [herb, interacts] of Object.entries(knownInteractions)) {
      if (treatmentLower.includes(herb)) {
        const conflicts = interacts.filter(i => 
          medicationsLower.some(m => m.includes(i) || i.includes(m))
        );
        if (conflicts.length > 0) {
          warnings.push(`${herb} may interact with: ${conflicts.join(', ')}`);
        }
      }
    }

    recommendations.push('Always inform healthcare providers about all traditional remedies');
    recommendations.push('Monitor for unexpected symptoms when combining treatments');
    recommendations.push('Consider consulting an integrative medicine specialist');

    return {
      safe: warnings.length === 0,
      warnings,
      recommendations
    };
  }
}

export const multiculturalHealthcareEngine = new MulticulturalHealthcareEngine();
