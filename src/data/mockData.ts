import { Hive, Harvest, UserProfile, SurveySubmission } from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Ambrose Ssenyondo',
  email: 'ssenyondoambrose@gmail.com',
  gender: 'male',
  organization: 'Uganda National Apiculture Development Organisation (TUNADO)',
  location: 'Masaka & Kampala Apiaries',
  themePreference: 'system',
  remindersEnabled: true,
};

export const INITIAL_HIVES: Hive[] = [
  {
    id: 'HIVE-01',
    name: 'Queen Victoria 01',
    apiaryLocation: 'Kyanamukaka Apiary, Masaka',
    region: 'Central (Masaka)',
    coordinates: { lat: -0.3344, lng: 31.7341 },
    hiveType: 'Top Bar (KTBH)',
    colonyStrength: 'Strong',
    healthStatus: 'Healthy',
    framesCount: 26,
    lastInspected: '2026-09-02',
    installationDate: '2025-03-15',
    beekeeperName: 'Mugisha Emmanuel',
    beekeeperPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    notes: 'Vigorous brood pattern, calm temperament. High nectar flow from nearby coffee plants.',
    queenSpotted: true,
    honeyStores: 'Full',
  },
  {
    id: 'HIVE-02',
    name: 'Rwenzori Mist 04',
    apiaryLocation: 'Kilembe Valley, Kasese',
    region: 'Western (Kasese)',
    coordinates: { lat: 0.1833, lng: 30.0833 },
    hiveType: 'Langstroth',
    colonyStrength: 'Moderate',
    healthStatus: 'Recovering',
    framesCount: 18,
    lastInspected: '2026-09-06',
    installationDate: '2025-08-10',
    beekeeperName: 'Biira Grace',
    beekeeperPhotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    notes: 'Recovering from wax moth pressure. Queen laying well in lower box.',
    queenSpotted: true,
    honeyStores: 'Moderate',
    pestRecords: [
      {
        id: 'PEST-02-1',
        hiveId: 'HIVE-02',
        name: 'Wax Moth (Galleria mellonella)',
        category: 'Pest',
        severity: 'Moderate',
        dateObserved: '2026-06-14',
        actionsTaken: 'Removed 2 webbed comb frames and froze them for 48 hours. Scraped bottom board.',
        status: 'Resolved',
        resolvedDate: '2026-06-20',
        loggedBy: 'Biira Grace',
        notes: 'First observed during end of Long Rains.'
      },
      {
        id: 'PEST-02-2',
        hiveId: 'HIVE-02',
        name: 'Wax Moth (Galleria mellonella)',
        category: 'Pest',
        severity: 'Moderate',
        dateObserved: '2026-09-03',
        actionsTaken: 'Silken tunnels detected on corner bar. Bar removed and scorched with smoker.',
        status: 'Monitoring',
        loggedBy: 'Biira Grace',
        notes: 'Second recurrence of wax moth within 3 months.'
      }
    ]
  },
  {
    id: 'HIVE-03',
    name: 'Savannah Sun 02',
    apiaryLocation: 'Wobulenzi Hill, Luweero',
    region: 'Central (Luweero)',
    coordinates: { lat: 0.7225, lng: 32.5336 },
    hiveType: 'Top Bar (KTBH)',
    colonyStrength: 'Weak',
    healthStatus: 'Pest Spotted',
    framesCount: 12,
    lastInspected: '2026-09-07',
    installationDate: '2026-01-20',
    beekeeperName: 'Kato Paul',
    beekeeperPhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    notes: 'Small hive beetle sighted at entrance. Needs entrance reducer and oil traps.',
    queenSpotted: false,
    honeyStores: 'Low',
    pestRecords: [
      {
        id: 'PEST-03-1',
        hiveId: 'HIVE-03',
        name: 'Small Hive Beetle (Aethina tumida)',
        category: 'Pest',
        severity: 'Moderate',
        dateObserved: '2026-09-07',
        actionsTaken: 'Installed vegetable oil beetle traps between top bars. Reduced entrance slot.',
        status: 'Active',
        loggedBy: 'Kato Paul',
        notes: 'Adult beetles spotted scurrying into bottom corners.'
      }
    ]
  },
  {
    id: 'HIVE-04',
    name: 'Nile Acacia Gold',
    apiaryLocation: 'Rhino Camp Road, Arua',
    region: 'Northern (Arua)',
    coordinates: { lat: 3.0303, lng: 30.9109 },
    hiveType: 'Traditional Log / Bamboo',
    colonyStrength: 'Strong',
    healthStatus: 'Active Queen',
    framesCount: 22,
    lastInspected: '2026-08-25',
    installationDate: '2024-11-05',
    beekeeperName: 'Droma Alfred',
    beekeeperPhotoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    notes: 'Indigenous East African honeybee (Apis mellifera scutellata). Highly productive.',
    queenSpotted: true,
    honeyStores: 'Full',
    pestRecords: []
  },
  {
    id: 'HIVE-05',
    name: 'Ankole Blossom 09',
    apiaryLocation: 'Ishaka Highlands, Bushenyi',
    region: 'Western (Bushenyi)',
    coordinates: { lat: -0.5408, lng: 30.1396 },
    hiveType: 'Langstroth',
    colonyStrength: 'Weak',
    healthStatus: 'Disease / Treatment Needed',
    framesCount: 10,
    lastInspected: '2026-09-08',
    installationDate: '2026-04-12',
    beekeeperName: 'Kemigisha Sarah',
    beekeeperPhotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    notes: 'Varroa suspected. Brood unsealed unevenly. Immediate organic thymol treatment needed.',
    queenSpotted: true,
    honeyStores: 'Low',
    pestRecords: [
      {
        id: 'PEST-05-1',
        hiveId: 'HIVE-05',
        name: 'Varroa Destructor Mites',
        category: 'Parasite',
        severity: 'Critical',
        dateObserved: '2026-09-08',
        actionsTaken: 'Sugar shake count revealed >8 mites per 100 bees. Applied organic thymol treatment strips; scheduled drone brood removal.',
        status: 'Active',
        loggedBy: 'Kemigisha Sarah',
        notes: 'High mite infestation posing imminent absconding or colony collapse risk.'
      }
    ]
  },
  {
    id: 'HIVE-06',
    name: 'Teso Horizon 03',
    apiaryLocation: 'Arapai Agricultural Zone, Soroti',
    region: 'Eastern (Soroti)',
    coordinates: { lat: 1.7147, lng: 33.6111 },
    hiveType: 'Top Bar (KTBH)',
    colonyStrength: 'Strong',
    healthStatus: 'Healthy',
    framesCount: 28,
    lastInspected: '2026-08-30',
    installationDate: '2025-02-18',
    beekeeperName: 'Okello John',
    beekeeperPhotoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    notes: 'Excellent propolis seal, bountiful combs ready for upcoming dry season harvest.',
    queenSpotted: true,
    honeyStores: 'Full',
  },
];

export const INITIAL_HARVESTS: Harvest[] = [
  {
    id: 'HARV-2026-01',
    hiveId: 'HIVE-01',
    hiveName: 'Queen Victoria 01',
    season: 'Long Rains (Mar–May)',
    date: '2026-05-18',
    quantityKg: 24.5,
    honeyType: 'Coffee Blossom',
    moisturePercent: 17.2,
    colorGrade: 'Extra Light Amber',
    beekeeperSignatory: 'Mugisha Emmanuel',
    notes: 'Rich floral aroma, crystal clear harvest with low moisture content.',
  },
  {
    id: 'HARV-2026-02',
    hiveId: 'HIVE-04',
    hiveName: 'Nile Acacia Gold',
    season: 'Dry Season (Jun–Aug)',
    date: '2026-07-29',
    quantityKg: 31.0,
    honeyType: 'Acacia',
    moisturePercent: 16.8,
    colorGrade: 'Water White',
    beekeeperSignatory: 'Droma Alfred',
    notes: 'Premium light Acacia honey harvested right before dry winds picked up.',
  },
  {
    id: 'HARV-2026-03',
    hiveId: 'HIVE-06',
    hiveName: 'Teso Horizon 03',
    season: 'Dry Season (Jun–Aug)',
    date: '2026-08-12',
    quantityKg: 27.8,
    honeyType: 'Sunflower',
    moisturePercent: 18.1,
    colorGrade: 'Light Amber',
    beekeeperSignatory: 'Okello John',
    notes: 'High pollen density, bright golden hue from surrounding sunflower plots.',
  },
  {
    id: 'HARV-2025-04',
    hiveId: 'HIVE-02',
    hiveName: 'Rwenzori Mist 04',
    season: 'Short Rains (Sep–Nov)',
    date: '2025-11-20',
    quantityKg: 19.2,
    honeyType: 'Forest Amber',
    moisturePercent: 18.5,
    colorGrade: 'Dark Amber',
    beekeeperSignatory: 'Biira Grace',
    notes: 'Distinctive alpine forest honey with herbal undertones from Mount Rwenzori slope.',
  },
  {
    id: 'HARV-2025-05',
    hiveId: 'HIVE-01',
    hiveName: 'Queen Victoria 01',
    season: 'Dry Season (Dec–Feb)',
    date: '2026-01-25',
    quantityKg: 22.0,
    honeyType: 'Wildflower',
    moisturePercent: 17.5,
    colorGrade: 'Amber',
    beekeeperSignatory: 'Mugisha Emmanuel',
    notes: 'Heavy winter flow from swamp flora around Lake Nabugabo.',
  },
  {
    id: 'HARV-2025-06',
    hiveId: 'HIVE-06',
    hiveName: 'Teso Horizon 03',
    season: 'Dry Season (Dec–Feb)',
    date: '2026-02-14',
    quantityKg: 23.4,
    honeyType: 'Acacia',
    moisturePercent: 17.0,
    colorGrade: 'Light Amber',
    beekeeperSignatory: 'Okello John',
    notes: 'Excellent seasonal return following early rains in Teso sub-region.',
  },
];

export const INITIAL_SURVEYS: SurveySubmission[] = [
  {
    id: 'SRV-001',
    submittedAt: '2026-09-04T10:30:00Z',
    beekeeperName: 'Mugisha Emmanuel',
    contactEmail: 'emmanuel.mugisha@apiary.ug',
    region: 'Central (Masaka)',
    experienceYears: '7 years',
    hiveCount: 14,
    hiveTypes: ['Top Bar (KTBH)', 'Langstroth'],
    observedColonyStrength: 'Strong',
    healthIssues: ['Occasional ants at base'],
    currentSeason: 'Short Rains (Sep–Nov)',
    estimatedHarvestKg: 85,
    primaryFloralSource: 'Robusta Coffee & Wild Guava',
    extractionMethod: 'Centrifuge Extractor & Press',
    challenges: 'High transport costs to Kampala retail hubs, shortage of protective suits for youth helpers.',
  },
  {
    id: 'SRV-002',
    submittedAt: '2026-08-28T14:15:00Z',
    beekeeperName: 'Biira Grace',
    contactEmail: 'grace.biira@rwenzoribees.org',
    region: 'Western (Kasese)',
    experienceYears: '4 years',
    hiveCount: 8,
    hiveTypes: ['Langstroth'],
    observedColonyStrength: 'Moderate',
    healthIssues: ['Wax moth larvae in weakened comb'],
    currentSeason: 'Dry Season (Jun–Aug)',
    estimatedHarvestKg: 42,
    primaryFloralSource: 'Highland Forest & Eucalyptus',
    extractionMethod: 'Solar Wax Melter & Fine Mesh Strainer',
    challenges: 'Unpredictable rain shifts along the Rwenzori foothills affecting blooming cycles.',
  }
];

// Helper to determine current Uganda season based on current date
export function getCurrentUgandaSeason(): { name: string; range: string; description: string } {
  const month = new Date().getMonth(); // 0-indexed: 0 = Jan, 8 = Sep
  // Long Rains: Mar–May (months 2, 3, 4)
  // Dry Season: Jun–Aug (months 5, 6, 7)
  // Short Rains: Sep–Nov (months 8, 9, 10)
  // Dry Season: Dec–Feb (months 11, 0, 1)
  if (month >= 2 && month <= 4) {
    return {
      name: 'Long Rains (Mar–May)',
      range: 'March – May',
      description: 'Major flowering season across Uganda. Brood building and major nectar flow.',
    };
  } else if (month >= 5 && month <= 7) {
    return {
      name: 'Dry Season (Jun–Aug)',
      range: 'June – August',
      description: 'Primary honey harvest window. Low ambient humidity produces thick, premium moisture-grade honey.',
    };
  } else if (month >= 8 && month <= 10) {
    return {
      name: 'Short Rains (Sep–Nov)',
      range: 'September – November',
      description: 'Secondary flowering and forage season. Critical time for hive checkups and colony splits.',
    };
  } else {
    return {
      name: 'Dry Season (Dec–Feb)',
      range: 'December – February',
      description: 'Second major harvest window. Great weather for field survey and colony management.',
    };
  }
}
