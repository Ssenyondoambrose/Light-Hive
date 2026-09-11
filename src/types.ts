export type UgandaSeason =
  | 'Long Rains (Mar–May)'
  | 'Dry Season (Jun–Aug)'
  | 'Short Rains (Sep–Nov)'
  | 'Dry Season (Dec–Feb)';

export type ColonyStrength = 'Strong' | 'Moderate' | 'Weak';

export type HealthStatus =
  | 'Healthy'
  | 'Active Queen'
  | 'Pest Spotted'
  | 'Recovering'
  | 'Disease / Treatment Needed'
  | 'Dormant';

export type HiveType =
  | 'Top Bar (KTBH)'
  | 'Langstroth'
  | 'Traditional Log / Bamboo'
  | 'Warré';

export type GenderPreference = 'male' | 'female' | 'unspecified';

export type PestSeverity = 'Low' | 'Moderate' | 'Severe' | 'Critical';
export type PestStatus = 'Active' | 'Monitoring' | 'Resolved';

export interface PestDiseaseRecord {
  id: string;
  hiveId: string;
  name: string; // e.g., 'Wax Moth', 'Small Hive Beetle', 'Varroa Mites', 'Safari / Driver Ants', etc.
  category: 'Pest' | 'Disease' | 'Parasite' | 'Predator' | 'Other';
  severity: PestSeverity;
  dateObserved: string; // YYYY-MM-DD
  actionsTaken: string; // Treatments, mechanical interventions, sanitation
  status: PestStatus;
  loggedBy?: string;
  notes?: string;
  resolvedDate?: string;
}

export interface Hive {
  id: string;
  name: string;
  apiaryLocation: string;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  hiveType: HiveType;
  colonyStrength: ColonyStrength;
  healthStatus: HealthStatus;
  framesCount: number;
  lastInspected: string; // YYYY-MM-DD
  installationDate: string; // YYYY-MM-DD
  beekeeperName: string;
  beekeeperPhotoUrl?: string;
  notes?: string;
  queenSpotted: boolean;
  honeyStores: 'Full' | 'Moderate' | 'Low';
  pestRecords?: PestDiseaseRecord[];
}

export interface Harvest {
  id: string;
  hiveId: string;
  hiveName: string;
  season: UgandaSeason;
  date: string; // YYYY-MM-DD
  quantityKg: number;
  honeyType:
    | 'Acacia'
    | 'Coffee Blossom'
    | 'Wildflower'
    | 'Eucalyptus'
    | 'Forest Amber'
    | 'Sunflower';
  moisturePercent: number;
  colorGrade: 'Water White' | 'Extra Light Amber' | 'Light Amber' | 'Amber' | 'Dark Amber';
  beekeeperSignatory: string;
  notes?: string;
}

export interface CheckupReminder {
  hiveId: string;
  hiveName: string;
  apiaryLocation: string;
  dueDays: number; // <= 0 means overdue/due today, > 0 means upcoming
  dueDate: string;
  urgency: 'urgent' | 'due_soon' | 'healthy';
  reason: string;
  colonyStrength: ColonyStrength;
  healthStatus: HealthStatus;
  lastInspected: string;
}

export interface UserProfile {
  name: string;
  email: string;
  gender: GenderPreference;
  organization?: string;
  location?: string;
  themePreference: 'light' | 'dark' | 'system';
  remindersEnabled: boolean;
}

export interface SurveySubmission {
  id: string;
  submittedAt: string;
  beekeeperName: string;
  contactEmail: string;
  region: string;
  experienceYears: string;
  hiveCount: number;
  hiveTypes: string[];
  observedColonyStrength: ColonyStrength;
  healthIssues: string[];
  currentSeason: UgandaSeason;
  estimatedHarvestKg: number;
  primaryFloralSource: string;
  extractionMethod: string;
  challenges: string;
}
