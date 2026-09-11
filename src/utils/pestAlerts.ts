import { Hive, PestDiseaseRecord, PestSeverity } from '../types';

export interface PestTemplate {
  name: string;
  category: PestDiseaseRecord['category'];
  defaultSeverity: PestSeverity;
  commonSymptoms: string;
  recommendedUgandaActions: string;
}

export const COMMON_UGANDA_PESTS: PestTemplate[] = [
  {
    name: 'Wax Moth (Galleria mellonella)',
    category: 'Pest',
    defaultSeverity: 'Moderate',
    commonSymptoms: 'Silken webbing through comb, tunneling larvae, chewed wooden bars.',
    recommendedUgandaActions: 'Freeze damaged comb 48h or cut/burn. Strengthen colony vigor and reduce excess unused frames.',
  },
  {
    name: 'Small Hive Beetle (Aethina tumida)',
    category: 'Pest',
    defaultSeverity: 'Moderate',
    commonSymptoms: 'Adult beetles crawling in dark corners, slime out on pollen combs, fermented honey odor.',
    recommendedUgandaActions: 'Install bottom oil/diatomaceous earth traps. Reduce entrance gap, maintain strong bee-to-comb ratio.',
  },
  {
    name: 'Safari / Driver Ants (Dorylus spp.)',
    category: 'Predator',
    defaultSeverity: 'Severe',
    commonSymptoms: 'Mass marching ant column attacking hive entrance, dead bees dropped on ground, absconding bees.',
    recommendedUgandaActions: 'Apply grease/motor oil rings to hive stand legs. Install water-filled tin can moats under posts, clear surrounding grass.',
  },
  {
    name: 'Varroa Destructor Mites',
    category: 'Parasite',
    defaultSeverity: 'Critical',
    commonSymptoms: 'Deformed wings in emerging bees, spotty brood pattern, visible reddish-brown oval mites on adult bee thorax.',
    recommendedUgandaActions: 'Powdered sugar roll count. Apply authorized organic thymol or oxalic acid sublimations; drone brood sacrifice.',
  },
  {
    name: 'American Foulbrood (Paenibacillus larvae)',
    category: 'Disease',
    defaultSeverity: 'Critical',
    commonSymptoms: 'Sunken, perforated, dark capping; foul sulfurous odor; matchstick rope test pulls >2cm sticky brown slime.',
    recommendedUgandaActions: 'Quarantine immediately. Burn affected frames and scorch interior woodwork with blowtorch/smoker flame.',
  },
  {
    name: 'European Foulbrood (Melissococcus plutonius)',
    category: 'Disease',
    defaultSeverity: 'Severe',
    commonSymptoms: 'Unsealed larvae twisted in C-shapes, yellowed/brownish dead larvae in open cells, sour smell.',
    recommendedUgandaActions: 'Re-queen with hygienic African queen line. Remove infected brood combs, feed light sugar syrup if nectar is scarce.',
  },
  {
    name: 'Chalkbrood (Ascosphaera apis)',
    category: 'Disease',
    defaultSeverity: 'Low',
    commonSymptoms: 'White and dark-grey chalk-like mummies found on bottom board or hive landing entrance.',
    recommendedUgandaActions: 'Improve hive ventilation. Elevate hive from damp soil, replace moldy comb, requeen with hygienic stock.',
  },
  {
    name: 'Predatory Wasps / Hornets (Vespidae)',
    category: 'Predator',
    defaultSeverity: 'Moderate',
    commonSymptoms: 'Hornets hovering at hive entrance catching returning forager bees; guard bees fighting at landing board.',
    recommendedUgandaActions: 'Install narrow entrance block so guard bees can defend. Place sweet/sour vinegar bottle traps nearby.',
  },
];

/**
 * Returns the highest active severity record for a hive, if any.
 */
export function getActiveSevereOrCriticalPest(hive: Hive): PestDiseaseRecord | null {
  if (!hive.pestRecords || hive.pestRecords.length === 0) return null;

  const activeRecords = hive.pestRecords.filter((r) => r.status !== 'Resolved');
  if (activeRecords.length === 0) return null;

  // Check critical first, then severe
  const critical = activeRecords.find((r) => r.severity === 'Critical');
  if (critical) return critical;

  const severe = activeRecords.find((r) => r.severity === 'Severe');
  if (severe) return severe;

  return null;
}

export interface RecurringOutbreak {
  pestName: string;
  totalOccurrences: number;
  activeOccurrences: number;
  records: PestDiseaseRecord[];
}

/**
 * Detects if any specific pest or disease has been logged 2 or more times for this hive.
 */
export function getRecurringPestOutbreaks(hive: Hive): RecurringOutbreak[] {
  if (!hive.pestRecords || hive.pestRecords.length < 2) return [];

  // Group by normalized name
  const groups: { [key: string]: PestDiseaseRecord[] } = {};

  hive.pestRecords.forEach((record) => {
    // Normalize name to catch variants (e.g. 'Wax Moth' vs 'Wax Moth (Galleria mellonella)')
    const normalized = record.name.toLowerCase().split('(')[0].trim();
    if (!groups[normalized]) {
      groups[normalized] = [];
    }
    groups[normalized].push(record);
  });

  const recurring: RecurringOutbreak[] = [];

  Object.entries(groups).forEach(([_, records]) => {
    if (records.length >= 2) {
      const activeOccurrences = records.filter((r) => r.status !== 'Resolved').length;
      recurring.push({
        pestName: records[0].name,
        totalOccurrences: records.length,
        activeOccurrences,
        records,
      });
    }
  });

  return recurring;
}
