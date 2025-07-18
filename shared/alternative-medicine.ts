// Alternative and Holistic Medicine Framework
export interface AlternativeMedicineSystem {
  id: string;
  name: string;
  origin: string;
  region: string;
  principles: string[];
  diagnosticMethods: string[];
  treatmentModalities: string[];
  practitionerRequirements: string[];
  regulatoryStatus: string;
  evidenceLevel: string;
  integrationConsiderations: string[];
  safetyConsiderations: string[];
  drugInteractions: string[];
  patientEducation: string[];
  culturalContext: string[];
  languages: string[];
}

export const ALTERNATIVE_MEDICINE_SYSTEMS: AlternativeMedicineSystem[] = [
  {
    id: "tcm",
    name: "Traditional Chinese Medicine (TCM)",
    origin: "China",
    region: "East Asia",
    principles: [
      "Qi (vital energy) flow balance",
      "Yin-Yang equilibrium",
      "Five Element Theory",
      "Meridian system",
      "Holistic body-mind connection"
    ],
    diagnosticMethods: [
      "Pulse diagnosis (Mai Zhen)",
      "Tongue examination",
      "Observation of complexion",
      "Inquiry about symptoms",
      "Palpation and auscultation"
    ],
    treatmentModalities: [
      "Acupuncture and moxibustion",
      "Chinese herbal medicine",
      "Tuina massage",
      "Qigong and Tai Chi",
      "Cupping therapy",
      "Gua sha (scraping therapy)"
    ],
    practitionerRequirements: [
      "Licensed acupuncturist certification",
      "TCM education (3-5 years)",
      "Clinical internship requirements",
      "Continuing education mandates"
    ],
    regulatoryStatus: "Regulated in many countries, WHO recognized",
    evidenceLevel: "Mixed - strong evidence for acupuncture, developing for herbs",
    integrationConsiderations: [
      "Herb-drug interactions monitoring",
      "Communication with conventional providers",
      "Treatment timing coordination",
      "Patient education on both systems"
    ],
    safetyConsiderations: [
      "Sterile needle practices",
      "Herb quality and contamination",
      "Contraindications screening",
      "Adverse reaction monitoring"
    ],
    drugInteractions: [
      "Anticoagulants with certain herbs",
      "Diabetes medications with blood sugar-affecting herbs",
      "Liver-processed drugs with hepatotoxic herbs"
    ],
    patientEducation: [
      "Treatment expectations and timeline",
      "Lifestyle modifications",
      "Dietary therapy principles",
      "Self-care practices"
    ],
    culturalContext: [
      "Confucian health philosophy",
      "Taoist natural harmony concepts",
      "Traditional family health practices",
      "Seasonal living adjustments"
    ],
    languages: ["Chinese (Mandarin)", "Chinese (Cantonese)", "English", "Korean", "Japanese"]
  },
  {
    id: "ayurveda",
    name: "Ayurveda",
    origin: "India",
    region: "South Asia",
    principles: [
      "Three doshas (Vata, Pitta, Kapha)",
      "Constitutional typing (Prakriti)",
      "Disease imbalance (Vikriti)",
      "Five elements (Pancha Mahabhuta)",
      "Mind-body-spirit integration"
    ],
    diagnosticMethods: [
      "Pulse examination (Nadi Pariksha)",
      "Tongue and eye examination",
      "Physical constitution assessment",
      "Lifestyle and dietary analysis",
      "Mental and emotional evaluation"
    ],
    treatmentModalities: [
      "Herbal medicines (Rasayana)",
      "Panchakarma detoxification",
      "Yoga and meditation",
      "Dietary therapy (Ahara)",
      "Lifestyle counseling (Vihara)",
      "Oil treatments and massage"
    ],
    practitionerRequirements: [
      "BAMS degree (Bachelor of Ayurvedic Medicine)",
      "Clinical training requirements",
      "State licensing where regulated",
      "Continuing education"
    ],
    regulatoryStatus: "Government recognized in India, varying international status",
    evidenceLevel: "Growing research base, established for specific conditions",
    integrationConsiderations: [
      "Dosha-based treatment personalization",
      "Seasonal and lifestyle integration",
      "Coordination with allopathic treatments",
      "Long-term wellness focus"
    ],
    safetyConsiderations: [
      "Heavy metal contamination in some preparations",
      "Quality control of herbal products",
      "Practitioner qualification verification",
      "Contraindication screening"
    ],
    drugInteractions: [
      "Ashwagandha with immunosuppressants",
      "Turmeric with anticoagulants",
      "Gymnema with diabetes medications"
    ],
    patientEducation: [
      "Dosha-specific lifestyle guidance",
      "Seasonal routine adjustments",
      "Dietary guidelines per constitution",
      "Yoga and meditation practices"
    ],
    culturalContext: [
      "Hindu philosophical foundations",
      "Vedic knowledge traditions",
      "Family and community health practices",
      "Ritual and spiritual aspects"
    ],
    languages: ["Hindi", "Sanskrit", "Tamil", "Telugu", "Bengali", "English"]
  },
  {
    id: "unani",
    name: "Unani Medicine",
    origin: "Greece (developed in Islamic world)",
    region: "Middle East, South Asia",
    principles: [
      "Four humors balance (blood, phlegm, yellow bile, black bile)",
      "Temperament (Mizaj) assessment",
      "Natural healing power (Quwwat-e-Mudabbira-e-Badan)",
      "Six essential factors (Asbab-e-Sitta Zarooriya)",
      "Disease as imbalance"
    ],
    diagnosticMethods: [
      "Pulse examination (Nabz)",
      "Urine analysis (Bawl)",
      "Stool examination (Baraz)",
      "Temperament assessment",
      "General physical examination"
    ],
    treatmentModalities: [
      "Herbal medicines (Advia)",
      "Dietary therapy (Ilaj-Bil-Ghiza)",
      "Cupping (Hijama)",
      "Massage (Dalak)",
      "Surgery (Jarahat)",
      "Exercise therapy (Riyazat)"
    ],
    practitionerRequirements: [
      "BUMS degree (Bachelor of Unani Medicine)",
      "Clinical training",
      "Government registration",
      "Continuous professional development"
    ],
    regulatoryStatus: "Officially recognized in India, Pakistan, some Middle Eastern countries",
    evidenceLevel: "Traditional evidence base, growing modern research",
    integrationConsiderations: [
      "Temperament-based individualization",
      "Dietary and lifestyle integration",
      "Coordination with modern medicine",
      "Cultural sensitivity requirements"
    ],
    safetyConsiderations: [
      "Heavy metal content in some formulations",
      "Quality assurance of medicines",
      "Practitioner competency verification",
      "Drug interaction monitoring"
    ],
    drugInteractions: [
      "Safoof preparations with anticoagulants",
      "Herbal formulations with liver medications",
      "Mineral preparations with kidney medications"
    ],
    patientEducation: [
      "Temperament-specific guidelines",
      "Dietary modifications",
      "Lifestyle balance principles",
      "Preventive care measures"
    ],
    culturalContext: [
      "Islamic medical ethics",
      "Arabic and Persian medical traditions",
      "Community health practices",
      "Religious considerations in treatment"
    ],
    languages: ["Arabic", "Urdu", "Persian", "Turkish", "English", "Hindi"]
  },
  {
    id: "homeopathy",
    name: "Homeopathy",
    origin: "Germany",
    region: "Global",
    principles: [
      "Law of similars (like cures like)",
      "Minimum dose principle",
      "Potentization and dilution",
      "Individualization of treatment",
      "Vital force concept"
    ],
    diagnosticMethods: [
      "Detailed case taking",
      "Constitutional assessment",
      "Symptom totality analysis",
      "Miasmatic evaluation",
      "Mental and emotional state assessment"
    ],
    treatmentModalities: [
      "Potentized remedies",
      "Constitutional prescribing",
      "Acute symptom treatment",
      "Miasmatic treatment",
      "Combination remedies"
    ],
    practitionerRequirements: [
      "Homeopathic medical education",
      "Clinical training requirements",
      "Professional certification",
      "Continuing education"
    ],
    regulatoryStatus: "Regulated as medicine in some countries, as supplement in others",
    evidenceLevel: "Controversial - mixed research results, ongoing studies",
    integrationConsiderations: [
      "Gentle approach suitable for sensitive patients",
      "Compatibility with conventional treatments",
      "Long-term wellness focus",
      "Minimal side effects"
    ],
    safetyConsiderations: [
      "Generally safe due to high dilutions",
      "Quality control of manufacturing",
      "Avoiding delays in emergency care",
      "Practitioner competency"
    ],
    drugInteractions: [
      "Minimal due to ultra-dilutions",
      "Coffee and mint may antidote some remedies",
      "Steroid medications may suppress action"
    ],
    patientEducation: [
      "Understanding potentization concept",
      "Lifestyle factors affecting treatment",
      "Timeline expectations",
      "Self-care guidelines"
    ],
    culturalContext: [
      "European medical tradition",
      "Holistic health philosophy",
      "Patient empowerment focus",
      "Natural healing emphasis"
    ],
    languages: ["German", "English", "French", "Spanish", "Portuguese", "Hindi"]
  },
  {
    id: "naturopathy",
    name: "Naturopathic Medicine",
    origin: "Germany/United States",
    region: "North America, Europe, Australia",
    principles: [
      "Vis medicatrix naturae (healing power of nature)",
      "Primum non nocere (first do no harm)",
      "Tolle causam (identify and treat cause)",
      "Docere (doctor as teacher)",
      "Treat the whole person",
      "Prevention focus"
    ],
    diagnosticMethods: [
      "Comprehensive health history",
      "Physical examination",
      "Laboratory testing",
      "Nutritional assessment",
      "Environmental exposure evaluation"
    ],
    treatmentModalities: [
      "Botanical medicine",
      "Clinical nutrition",
      "Lifestyle counseling",
      "Physical medicine",
      "Mind-body therapies",
      "Environmental medicine"
    ],
    practitionerRequirements: [
      "Doctor of Naturopathic Medicine (ND)",
      "Four-year postgraduate education",
      "Clinical residency",
      "Board examinations",
      "State licensing"
    ],
    regulatoryStatus: "Licensed as primary care in some states/provinces",
    evidenceLevel: "Evidence-based for many modalities, research expanding",
    integrationConsiderations: [
      "Primary care integration potential",
      "Collaborative care models",
      "Preventive medicine focus",
      "Chronic disease management"
    ],
    safetyConsiderations: [
      "Herb-drug interaction monitoring",
      "Supplement quality assurance",
      "Scope of practice awareness",
      "Appropriate referral protocols"
    ],
    drugInteractions: [
      "St. John's Wort with multiple medications",
      "High-dose vitamins with specific drugs",
      "Botanical medicines with prescriptions"
    ],
    patientEducation: [
      "Nutrition and lifestyle optimization",
      "Environmental health awareness",
      "Stress management techniques",
      "Preventive care strategies"
    ],
    culturalContext: [
      "Western scientific approach to natural medicine",
      "Environmental health consciousness",
      "Patient education emphasis",
      "Holistic health philosophy"
    ],
    languages: ["English", "German", "French", "Spanish"]
  },
  {
    id: "african-traditional",
    name: "African Traditional Medicine",
    origin: "Africa",
    region: "Sub-Saharan Africa",
    principles: [
      "Ubuntu philosophy (interconnectedness)",
      "Spiritual and physical healing integration",
      "Ancestral guidance in healing",
      "Community-based health practices",
      "Plant spirit medicine"
    ],
    diagnosticMethods: [
      "Spiritual divination",
      "Physical examination",
      "Community consultation",
      "Ancestral communication",
      "Symptom pattern recognition"
    ],
    treatmentModalities: [
      "Medicinal plants and herbs",
      "Spiritual ceremonies",
      "Community healing rituals",
      "Dietary modifications",
      "Physical therapies",
      "Protective medicines"
    ],
    practitionerRequirements: [
      "Traditional apprenticeship",
      "Spiritual calling recognition",
      "Community endorsement",
      "Elder guidance and mentorship"
    ],
    regulatoryStatus: "Recognized and protected traditional practice in many African countries",
    evidenceLevel: "Rich traditional knowledge base, growing scientific validation",
    integrationConsiderations: [
      "Cultural competency requirements",
      "Language barrier considerations",
      "Spiritual component respect",
      "Community involvement importance"
    ],
    safetyConsiderations: [
      "Plant identification accuracy",
      "Preparation method standardization",
      "Cultural protocol respect",
      "Modern medicine interaction awareness"
    ],
    drugInteractions: [
      "Traditional herbs with modern medications",
      "Preparation-dependent variations",
      "Unknown active compounds"
    ],
    patientEducation: [
      "Cultural context understanding",
      "Traditional preparation methods",
      "Community support systems",
      "Spiritual aspects of healing"
    ],
    culturalContext: [
      "Ubuntu philosophy",
      "Ancestral reverence",
      "Community-centered healing",
      "Oral tradition knowledge transfer",
      "Seasonal and ritual timing"
    ],
    languages: ["Swahili", "Yoruba", "Zulu", "Amharic", "Hausa", "French", "English", "Portuguese"]
  },
  {
    id: "indigenous-american",
    name: "Indigenous American Medicine",
    origin: "Americas",
    region: "North, Central, and South America",
    principles: [
      "Medicine wheel teachings",
      "Four directions balance",
      "Circle of life understanding",
      "Plant spirit relationships",
      "Ceremonial healing practices"
    ],
    diagnosticMethods: [
      "Energy reading",
      "Vision and dream interpretation",
      "Physical observation",
      "Spiritual assessment",
      "Community input"
    ],
    treatmentModalities: [
      "Sacred plant medicines",
      "Sweat lodge ceremonies",
      "Smudging and cleansing",
      "Drumming and chanting",
      "Hands-on healing",
      "Dietary and lifestyle guidance"
    ],
    practitionerRequirements: [
      "Traditional knowledge transmission",
      "Spiritual calling and training",
      "Community recognition",
      "Elder mentorship"
    ],
    regulatoryStatus: "Protected traditional practice, sovereignty considerations",
    evidenceLevel: "Traditional knowledge systems, emerging research collaboration",
    integrationConsiderations: [
      "Sovereignty and consent protocols",
      "Cultural appropriation prevention",
      "Sacred knowledge protection",
      "Community-controlled research"
    ],
    safetyConsiderations: [
      "Sacred plant preparation protocols",
      "Ceremonial safety measures",
      "Cultural protocol adherence",
      "Modern medicine interactions"
    ],
    drugInteractions: [
      "Sacred plants with modern medications",
      "Traditional preparations with prescriptions",
      "Ceremony-specific considerations"
    ],
    patientEducation: [
      "Cultural respect and protocols",
      "Traditional worldview understanding",
      "Community participation importance",
      "Sacred relationship with healing"
    ],
    culturalContext: [
      "Tribal sovereignty recognition",
      "Sacred relationship with nature",
      "Intergenerational knowledge transfer",
      "Ceremonial and seasonal practices",
      "Community-based healing"
    ],
    languages: ["Navajo", "Cherokee", "Lakota", "Quechua", "Mapuche", "Spanish", "English", "French"]
  }
];

export const INTEGRATIVE_MEDICINE_PROTOCOLS = {
  "Safety Assessment": [
    "Comprehensive health history including all treatments",
    "Current medication and supplement inventory",
    "Allergy and sensitivity screening",
    "Practitioner credential verification",
    "Treatment interaction analysis"
  ],
  "Communication Protocols": [
    "All providers informed of treatment plan",
    "Regular progress monitoring and sharing",
    "Emergency contact procedures",
    "Cultural liaison when needed",
    "Language interpretation services"
  ],
  "Documentation Standards": [
    "Traditional medicine treatment records",
    "Provider credentials documentation",
    "Patient consent for integrative care",
    "Treatment outcomes tracking",
    "Adverse event reporting"
  ],
  "Quality Assurance": [
    "Practitioner certification verification",
    "Traditional medicine product quality",
    "Cultural competency standards",
    "Patient safety monitoring",
    "Evidence-based integration protocols"
  ]
};

export function getCompatibleMedicineSystems(
  culturalBackground: string[], 
  languages: string[], 
  condition: string
): AlternativeMedicineSystem[] {
  return ALTERNATIVE_MEDICINE_SYSTEMS.filter(system => {
    const culturalMatch = culturalBackground.some(culture => 
      system.culturalContext.some(context => 
        context.toLowerCase().includes(culture.toLowerCase()) ||
        system.region.toLowerCase().includes(culture.toLowerCase())
      )
    );
    
    const languageMatch = languages.some(lang => 
      system.languages.some(sysLang => 
        sysLang.toLowerCase().includes(lang.toLowerCase())
      )
    );
    
    return culturalMatch || languageMatch;
  });
}

export function getIntegrationGuidelines(
  primarySystem: string, 
  alternativeSystem: string
): { recommendations: string[]; precautions: string[]; monitoring: string[] } {
  const altSystem = ALTERNATIVE_MEDICINE_SYSTEMS.find(s => s.id === alternativeSystem);
  
  if (!altSystem) {
    return { recommendations: [], precautions: [], monitoring: [] };
  }
  
  return {
    recommendations: [
      ...altSystem.integrationConsiderations,
      "Coordinate treatment timing between systems",
      "Ensure all providers are informed",
      "Monitor for synergistic effects"
    ],
    precautions: [
      ...altSystem.safetyConsiderations,
      ...altSystem.drugInteractions,
      "Verify practitioner credentials",
      "Monitor for adverse interactions"
    ],
    monitoring: [
      "Regular assessment of treatment response",
      "Safety parameter monitoring",
      "Patient satisfaction and cultural comfort",
      "Communication between all providers"
    ]
  };
}