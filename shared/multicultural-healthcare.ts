// Multicultural Healthcare Framework
export interface CulturalHealthcareProfile {
  id: string;
  culturalGroup: string;
  region: string;
  languages: string[];
  religiousConsiderations: string[];
  communicationPatterns: {
    directness: "direct" | "indirect" | "context-dependent";
    eyeContact: "expected" | "avoided" | "gender-specific";
    physicalTouch: "accepted" | "limited" | "forbidden";
    familyInvolvement: "individual" | "family-centered" | "community-based";
    authorityRelations: "egalitarian" | "hierarchical" | "elder-respected";
  };
  healthBeliefs: string[];
  traditionalMedicine: string[];
  dietaryConsiderations: string[];
  genderSpecificCare: string[];
  mentalHealthStigma: string[];
  painExpression: string[];
  endOfLifeCare: string[];
  pregnancyAndBirth: string[];
  childCare: string[];
  elderCare: string[];
  integrationChallenges: string[];
  bestPractices: string[];
}

export const CULTURAL_HEALTHCARE_PROFILES: CulturalHealthcareProfile[] = [
  {
    id: "chinese",
    culturalGroup: "Chinese",
    region: "East Asia",
    languages: ["Mandarin", "Cantonese", "Hokkien", "Teochew"],
    religiousConsiderations: ["Buddhism", "Taoism", "Confucianism", "Ancestor veneration"],
    communicationPatterns: {
      directness: "indirect",
      eyeContact: "limited",
      physicalTouch: "limited",
      familyInvolvement: "family-centered",
      authorityRelations: "hierarchical"
    },
    healthBeliefs: [
      "Balance of hot and cold foods",
      "Qi energy circulation",
      "Emotional restraint for health",
      "Seasonal health adjustments",
      "Prevention through lifestyle"
    ],
    traditionalMedicine: ["Traditional Chinese Medicine", "Acupuncture", "Herbal medicine", "Qigong"],
    dietaryConsiderations: [
      "Hot and cold food classifications",
      "Seasonal eating patterns",
      "Medicinal food concepts",
      "Family-style meals important"
    ],
    genderSpecificCare: [
      "Female patients prefer female providers",
      "Postpartum confinement period",
      "Menstrual health privacy",
      "Male authority in family decisions"
    ],
    mentalHealthStigma: [
      "Mental illness brings family shame",
      "Somatization of psychological distress",
      "Preference for physical explanations",
      "Reluctance to seek mental health services"
    ],
    painExpression: [
      "Stoic pain expression expected",
      "Underreporting of pain common",
      "Non-verbal pain indicators important",
      "Cultural expectation of endurance"
    ],
    endOfLifeCare: [
      "Family-centered decision making",
      "Importance of dying at home",
      "Ancestor preparation rituals",
      "Avoiding direct death discussions"
    ],
    pregnancyAndBirth: [
      "Postpartum confinement (坐月子)",
      "Specific dietary restrictions",
      "Mother-in-law involvement",
      "Gender preference considerations"
    ],
    childCare: [
      "Extended family involvement",
      "Educational achievement emphasis",
      "Herbal remedies for common ailments",
      "Respect for elder guidance"
    ],
    elderCare: [
      "Filial piety obligations",
      "Multi-generational living",
      "Respect for elder wisdom",
      "Family responsibility for care"
    ],
    integrationChallenges: [
      "Language barriers",
      "Different concept of time",
      "Indirect communication style",
      "Traditional medicine integration"
    ],
    bestPractices: [
      "Use professional interpreters",
      "Involve family in care decisions",
      "Respect traditional medicine use",
      "Allow longer consultation times"
    ]
  },
  {
    id: "hispanic-latino",
    culturalGroup: "Hispanic/Latino",
    region: "Latin America",
    languages: ["Spanish", "Portuguese", "Indigenous languages"],
    religiousConsiderations: ["Catholic", "Protestant", "Indigenous spirituality", "Santería"],
    communicationPatterns: {
      directness: "context-dependent",
      eyeContact: "gender-specific",
      physicalTouch: "accepted",
      familyInvolvement: "family-centered",
      authorityRelations: "hierarchical"
    },
    healthBeliefs: [
      "Hot and cold illness classification",
      "Spiritual causes of illness",
      "Importance of family support",
      "Fatalistic health attitudes",
      "Emotional expression affects health"
    ],
    traditionalMedicine: ["Curanderismo", "Herbal remedies", "Spiritual healing", "Sobadores"],
    dietaryConsiderations: [
      "Hot and cold food balance",
      "Communal eating importance",
      "Traditional food preparation",
      "Religious dietary restrictions"
    ],
    genderSpecificCare: [
      "Machismo and gender roles",
      "Modesty in healthcare settings",
      "Male authority in family decisions",
      "Pregnancy and fertility emphasis"
    ],
    mentalHealthStigma: [
      "Mental illness as spiritual problem",
      "Stigma around psychological treatment",
      "Preference for family support",
      "Religious coping mechanisms"
    ],
    painExpression: [
      "Expressive pain communication",
      "Emotional expression accepted",
      "Family support during pain",
      "Spiritual explanations for suffering"
    ],
    endOfLifeCare: [
      "Family gathering importance",
      "Religious/spiritual preparation",
      "Home death preference",
      "Extended mourning practices"
    ],
    pregnancyAndBirth: [
      "Extended family involvement",
      "Postpartum dietary restrictions",
      "Spiritual protection practices",
      "Gender role expectations"
    ],
    childCare: [
      "Extended family networks",
      "Herbal remedies for children",
      "Religious protection practices",
      "Respect for elder knowledge"
    ],
    elderCare: [
      "Respeto for elders",
      "Family obligation for care",
      "Wisdom and experience value",
      "Multi-generational households"
    ],
    integrationChallenges: [
      "Language barriers",
      "Immigration status concerns",
      "Cultural misunderstandings",
      "Traditional remedy interactions"
    ],
    bestPractices: [
      "Provide Spanish-speaking staff",
      "Understand family dynamics",
      "Respect religious practices",
      "Integrate traditional healing"
    ]
  },
  {
    id: "african-american",
    culturalGroup: "African American",
    region: "United States",
    languages: ["English", "African American Vernacular English"],
    religiousConsiderations: ["Protestant Christianity", "Islam", "African spiritual traditions"],
    communicationPatterns: {
      directness: "direct",
      eyeContact: "expected",
      physicalTouch: "context-dependent",
      familyInvolvement: "family-centered",
      authorityRelations: "egalitarian"
    },
    healthBeliefs: [
      "Historical medical mistrust",
      "Strength and resilience emphasis",
      "Spiritual aspects of health",
      "Community support importance",
      "Systemic health disparities awareness"
    ],
    traditionalMedicine: ["Herbal remedies", "Spiritual healing", "Community healers", "Folk medicine"],
    dietaryConsiderations: [
      "Soul food traditions",
      "Church and food connections",
      "Diabetes and hypertension concerns",
      "Cultural food preparation methods"
    ],
    genderSpecificCare: [
      "Strong female family figures",
      "Maternal health disparities",
      "Prostate health awareness",
      "Hair and skin care considerations"
    ],
    mentalHealthStigma: [
      "Strong Black woman stereotype",
      "Mental health stigma in community",
      "Preference for spiritual counseling",
      "Systemic barriers to care"
    ],
    painExpression: [
      "Undertreatment of pain historically",
      "Varied pain expression styles",
      "Mistrust of pain management",
      "Cultural stoicism expectations"
    ],
    endOfLifeCare: [
      "Church community support",
      "Spiritual preparation importance",
      "Family decision-making",
      "Historical medical mistrust"
    ],
    pregnancyAndBirth: [
      "Maternal mortality disparities",
      "Extended family support",
      "Spiritual protection practices",
      "Midwifery traditions"
    ],
    childCare: [
      "Extended family networks",
      "Community child-rearing",
      "Educational achievement emphasis",
      "Resilience building focus"
    ],
    elderCare: [
      "Respect for elder wisdom",
      "Church community support",
      "Family obligation for care",
      "Historical caregiver roles"
    ],
    integrationChallenges: [
      "Historical medical mistrust",
      "Systemic healthcare barriers",
      "Provider cultural competency",
      "Insurance and access issues"
    ],
    bestPractices: [
      "Build trust over time",
      "Acknowledge historical traumas",
      "Involve church communities",
      "Provide culturally competent care"
    ]
  },
  {
    id: "muslim",
    culturalGroup: "Muslim",
    region: "Global",
    languages: ["Arabic", "Urdu", "Turkish", "Persian", "Malay", "Various"],
    religiousConsiderations: ["Islamic principles", "Halal requirements", "Prayer times", "Ramadan"],
    communicationPatterns: {
      directness: "context-dependent",
      eyeContact: "gender-specific",
      physicalTouch: "gender-restricted",
      familyInvolvement: "family-centered",
      authorityRelations: "hierarchical"
    },
    healthBeliefs: [
      "Health as divine blessing",
      "Illness as test from Allah",
      "Importance of seeking treatment",
      "Modesty and privacy requirements",
      "Spiritual healing alongside medical"
    ],
    traditionalMedicine: ["Unani medicine", "Prophetic medicine", "Herbal remedies", "Hijama (cupping)"],
    dietaryConsiderations: [
      "Halal food requirements",
      "Ramadan fasting considerations",
      "Prohibition of pork and alcohol",
      "Specific slaughter requirements"
    ],
    genderSpecificCare: [
      "Same-gender provider preference",
      "Modesty requirements",
      "Male guardian presence",
      "Pregnancy and birth practices"
    ],
    mentalHealthStigma: [
      "Mental illness as spiritual issue",
      "Shame and family honor",
      "Preference for religious counseling",
      "Community support systems"
    ],
    painExpression: [
      "Acceptance of pain as divine will",
      "Varied cultural expressions",
      "Prayer and spiritual coping",
      "Family support during illness"
    ],
    endOfLifeCare: [
      "Specific Islamic death rituals",
      "Family gathering importance",
      "Religious leader involvement",
      "Burial practice requirements"
    ],
    pregnancyAndBirth: [
      "Modesty during care",
      "Female provider preference",
      "Specific postpartum practices",
      "Religious naming ceremonies"
    ],
    childCare: [
      "Islamic education emphasis",
      "Circumcision for boys",
      "Religious dietary practices",
      "Extended family involvement"
    ],
    elderCare: [
      "Respect and care for parents",
      "Religious duty to care",
      "Multi-generational living",
      "Spiritual preparation for death"
    ],
    integrationChallenges: [
      "Language barriers",
      "Religious practice accommodation",
      "Gender-specific care needs",
      "Cultural misunderstandings"
    ],
    bestPractices: [
      "Provide same-gender providers",
      "Accommodate prayer times",
      "Respect modesty requirements",
      "Understand religious practices"
    ]
  },
  {
    id: "indigenous-american",
    culturalGroup: "Indigenous American",
    region: "North America",
    languages: ["Tribal languages", "English", "Spanish"],
    religiousConsiderations: ["Traditional spirituality", "Christianity", "Syncretic beliefs"],
    communicationPatterns: {
      directness: "indirect",
      eyeContact: "avoided",
      physicalTouch: "limited",
      familyInvolvement: "community-based",
      authorityRelations: "elder-respected"
    },
    healthBeliefs: [
      "Holistic mind-body-spirit health",
      "Harmony with nature",
      "Generational trauma effects",
      "Traditional healing practices",
      "Community wellness focus"
    ],
    traditionalMedicine: ["Traditional healing", "Plant medicines", "Ceremonial practices", "Spiritual healing"],
    dietaryConsiderations: [
      "Traditional foods preference",
      "Diabetes prevention focus",
      "Seasonal eating patterns",
      "Sacred food ceremonies"
    ],
    genderSpecificCare: [
      "Gender-specific ceremonies",
      "Traditional women's roles",
      "Pregnancy and birth traditions",
      "Elder women wisdom"
    ],
    mentalHealthStigma: [
      "Historical trauma acknowledgment",
      "Traditional healing integration",
      "Community-based support",
      "Spiritual explanations for distress"
    ],
    painExpression: [
      "Stoic pain expression",
      "Traditional pain remedies",
      "Spiritual understanding of suffering",
      "Community support during illness"
    ],
    endOfLifeCare: [
      "Traditional death ceremonies",
      "Community gathering importance",
      "Spiritual preparation practices",
      "Cultural burial traditions"
    ],
    pregnancyAndBirth: [
      "Traditional birthing practices",
      "Elder women involvement",
      "Spiritual protection ceremonies",
      "Community celebration"
    ],
    childCare: [
      "Extended family involvement",
      "Traditional knowledge passing",
      "Cultural identity preservation",
      "Community responsibility"
    ],
    elderCare: [
      "Elder wisdom reverence",
      "Traditional knowledge keepers",
      "Community care responsibility",
      "Spiritual guidance role"
    ],
    integrationChallenges: [
      "Historical medical trauma",
      "Cultural misunderstanding",
      "Language barriers",
      "Traditional practice integration"
    ],
    bestPractices: [
      "Acknowledge historical trauma",
      "Integrate traditional practices",
      "Involve tribal communities",
      "Respect cultural protocols"
    ]
  }
];

export const LANGUAGE_HEALTHCARE_CONSIDERATIONS = {
  "Spanish": {
    "commonMedicalTerms": {
      "pain": "dolor",
      "nausea": "náusea",
      "dizziness": "mareo",
      "fever": "fiebre",
      "headache": "dolor de cabeza"
    },
    "culturalConcepts": {
      "susto": "fright/soul loss",
      "mal de ojo": "evil eye",
      "empacho": "blocked intestines",
      "caida de mollera": "fallen fontanelle"
    },
    "communicationTips": [
      "Use formal address (usted) initially",
      "Allow time for translation",
      "Respect family involvement",
      "Use simple, clear language"
    ]
  },
  "Mandarin": {
    "commonMedicalTerms": {
      "pain": "疼痛 (téngtòng)",
      "nausea": "恶心 (ěxin)",
      "dizziness": "头晕 (tóuyūn)",
      "fever": "发烧 (fāshāo)",
      "headache": "头痛 (tóutòng)"
    },
    "culturalConcepts": {
      "qi": "vital energy",
      "yin-yang": "balance concept",
      "re-qi": "heat energy",
      "han-qi": "cold energy"
    },
    "communicationTips": [
      "Indirect communication style",
      "Respect for hierarchy",
      "Family involvement expected",
      "Avoid direct confrontation"
    ]
  },
  "Arabic": {
    "commonMedicalTerms": {
      "pain": "ألم (alam)",
      "nausea": "غثيان (ghathayan)",
      "dizziness": "دوخة (dawkha)",
      "fever": "حمى (huma)",
      "headache": "صداع (suda)"
    },
    "culturalConcepts": {
      "inshallah": "God willing",
      "masha'allah": "what God has willed",
      "haram": "forbidden",
      "halal": "permissible"
    },
    "communicationTips": [
      "Right-to-left reading",
      "Religious considerations",
      "Gender-specific care",
      "Family involvement important"
    ]
  }
};

export function getCulturalHealthcareGuidelines(
  culturalBackground: string,
  language: string,
  healthcareContext: string
): {
  communicationGuidelines: string[];
  culturalConsiderations: string[];
  languageSupport: string[];
  bestPractices: string[];
} {
  const profile = CULTURAL_HEALTHCARE_PROFILES.find(p => 
    p.culturalGroup.toLowerCase().includes(culturalBackground.toLowerCase())
  );

  if (!profile) {
    return {
      communicationGuidelines: ["Use professional interpreters", "Respect cultural differences"],
      culturalConsiderations: ["Assess cultural health beliefs", "Involve family appropriately"],
      languageSupport: ["Provide interpretation services", "Use culturally appropriate materials"],
      bestPractices: ["Cultural competency training", "Patient-centered care"]
    };
  }

  return {
    communicationGuidelines: [
      `Communication style: ${profile.communicationPatterns.directness}`,
      `Eye contact: ${profile.communicationPatterns.eyeContact}`,
      `Physical touch: ${profile.communicationPatterns.physicalTouch}`,
      `Family involvement: ${profile.communicationPatterns.familyInvolvement}`
    ],
    culturalConsiderations: [
      ...profile.healthBeliefs,
      ...profile.genderSpecificCare,
      ...profile.religiousConsiderations
    ],
    languageSupport: [
      `Primary languages: ${profile.languages.join(", ")}`,
      "Professional interpretation required",
      "Written materials in native language",
      "Cultural context explanation"
    ],
    bestPractices: profile.bestPractices
  };
}

export function getIntegratedCareRecommendations(
  culturalProfile: string,
  traditionalMedicine: string[]
): {
  integrationOpportunities: string[];
  safetyConsiderations: string[];
  communicationStrategies: string[];
  providerEducation: string[];
} {
  const profile = CULTURAL_HEALTHCARE_PROFILES.find(p => 
    p.culturalGroup.toLowerCase().includes(culturalProfile.toLowerCase())
  );

  if (!profile) {
    return {
      integrationOpportunities: [],
      safetyConsiderations: [],
      communicationStrategies: [],
      providerEducation: []
    };
  }

  return {
    integrationOpportunities: [
      "Collaborate with traditional healers",
      "Integrate cultural health practices",
      "Respect traditional medicine use",
      "Coordinate care approaches"
    ],
    safetyConsiderations: [
      "Monitor traditional medicine interactions",
      "Assess quality of traditional products",
      "Ensure practitioner credentials",
      "Document all treatments"
    ],
    communicationStrategies: [
      "Use culturally appropriate communication",
      "Involve family in care decisions",
      "Respect religious considerations",
      "Provide education in native language"
    ],
    providerEducation: [
      "Cultural competency training",
      "Traditional medicine awareness",
      "Communication skills development",
      "Community resource knowledge"
    ]
  };
}