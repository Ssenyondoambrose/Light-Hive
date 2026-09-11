import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Hexagon,
  Sparkles,
  User,
  ShieldCheck,
  MapPin,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UgandaSeason, ColonyStrength } from '../types';
import { SheetSelect } from '../components/SheetSelect';

export const SurveyPage: React.FC = () => {
  const { submitSurvey, surveys, addHive, addHarvest } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Survey Form States
  // Step 1: Beekeeper info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('Central (Masaka)');
  const [experience, setExperience] = useState('3–5 years');
  const [apiaryName, setApiaryName] = useState('');

  // Step 2: Hive census
  const [hiveCount, setHiveCount] = useState('8');
  const [hiveTypes, setHiveTypes] = useState<string[]>(['Top Bar (KTBH)']);
  const [observedStrength, setObservedStrength] = useState<ColonyStrength>('Strong');
  const [healthIssues, setHealthIssues] = useState<string[]>([]);

  // Step 3: Seasonal Harvest
  const [season, setSeason] = useState<UgandaSeason>('Dry Season (Jun–Aug)');
  const [estimatedKg, setEstimatedKg] = useState('45');
  const [floralSource, setFloralSource] = useState('Robusta Coffee Blossom & Acacia');
  const [extractionMethod, setExtractionMethod] = useState('Centrifuge Extractor & Filter Cloth');

  // Step 4: Challenges
  const [challenges, setChallenges] = useState('');
  const [autoSyncRegistry, setAutoSyncRegistry] = useState(true);

  const toggleHiveType = (type: string) => {
    if (hiveTypes.includes(type)) {
      if (hiveTypes.length > 1) {
        setHiveTypes(hiveTypes.filter((t) => t !== type));
      }
    } else {
      setHiveTypes([...hiveTypes, type]);
    }
  };

  const toggleHealthIssue = (issue: string) => {
    if (healthIssues.includes(issue)) {
      setHealthIssues(healthIssues.filter((i) => i !== issue));
    } else {
      setHealthIssues([...healthIssues, issue]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    submitSurvey({
      beekeeperName: name.trim(),
      contactEmail: email.trim() || 'field.beekeeper@uganda.apiculture',
      region,
      experienceYears: experience,
      hiveCount: parseInt(hiveCount) || 1,
      hiveTypes,
      observedColonyStrength: observedStrength,
      healthIssues: healthIssues.length > 0 ? healthIssues : ['No critical issues reported'],
      currentSeason: season,
      estimatedHarvestKg: parseFloat(estimatedKg) || 0,
      primaryFloralSource: floralSource,
      extractionMethod,
      challenges: challenges.trim() || 'Seasonal weather variations noted.',
    });

    // If auto sync requested, create a hive and a harvest record
    if (autoSyncRegistry) {
      const hive = addHive({
        name: apiaryName.trim() || `${name.trim()}'s Hive 01`,
        apiaryLocation: `${region} Apiary`,
        region,
        coordinates: { lat: 0.3476, lng: 32.5825 },
        hiveType: (hiveTypes[0] as any) || 'Top Bar (KTBH)',
        colonyStrength: observedStrength,
        healthStatus: healthIssues.length > 0 ? 'Pest Spotted' : 'Healthy',
        framesCount: 18,
        lastInspected: new Date().toISOString().split('T')[0],
        installationDate: new Date().toISOString().split('T')[0],
        beekeeperName: name.trim(),
        notes: `Registered from intake survey: ${challenges || 'No special notes'}`,
        queenSpotted: true,
        honeyStores: 'Moderate',
      });

      if (parseFloat(estimatedKg) > 0) {
        addHarvest({
          hiveId: hive.id,
          hiveName: hive.name,
          season,
          date: new Date().toISOString().split('T')[0],
          quantityKg: parseFloat(estimatedKg),
          honeyType: floralSource.toLowerCase().includes('coffee') ? 'Coffee Blossom' : 'Acacia',
          moisturePercent: 17.5,
          colorGrade: 'Light Amber',
          beekeeperSignatory: name.trim(),
          notes: `Survey harvest data: ${floralSource}`,
        });
      }
    }

    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    setName('');
    setEmail('');
    setApiaryName('');
    setChallenges('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Editorial Page Banner with Honeycomb Overlay */}
      <div className="relative overflow-hidden rounded-3xl bg-[#231A12] text-[#FAF7F2] p-6 sm:p-8 border border-[#3A2C1F] shadow-md">
        <div className="absolute inset-0 honeycomb-pattern pointer-events-none opacity-10" />

        <div className="relative z-10 space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs uppercase font-semibold text-[#D97706] tracking-wider">
            <ClipboardCheck className="w-4 h-4" />
            <span>Field Data Acquisition</span>
          </div>
          <h1 className="font-serif-title text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Beekeeper & Harvest Intake Survey
          </h1>
          <p className="text-xs sm:text-sm text-[#CFC2B0]">
            Acquire critical field insights from Ugandan beekeepers regarding hive census,
            colony strength, pest challenges, and seasonal honey harvest metrics.
          </p>
        </div>
      </div>

      {isSubmitted ? (
        /* Success State */
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] shadow-sm max-w-2xl mx-auto space-y-4 animate-in zoom-in-95 duration-250">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="font-serif-title text-2xl font-bold text-[#2B2118] dark:text-[#EFEBE4]">
            Survey Submitted Successfully!
          </h2>

          <p className="text-sm text-[#6B5E4F] dark:text-[#A89C8C] max-w-md mx-auto leading-relaxed">
            Thank you for recording beekeeper <strong>{name}</strong>'s field information.
            {autoSyncRegistry && (
              <span className="block mt-1 text-emerald-700 dark:text-emerald-400 font-medium">
                ✓ Hive and harvest records have been automatically synced to your registry.
              </span>
            )}
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleResetForm}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white dark:bg-amber-600 dark:hover:bg-amber-500 text-xs font-semibold shadow-sm transition-all duration-150 active:scale-95 touch-control"
            >
              Submit Another Beekeeper Survey
            </button>
          </div>
        </div>
      ) : (
        /* Multi-Step Intake Form */
        <div className="max-w-3xl mx-auto rounded-3xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] shadow-sm overflow-hidden">
          {/* Progress Step Indicator */}
          <div className="p-4 sm:p-6 bg-[#FAF7F2] dark:bg-[#16120E] border-b border-[#EFE8D8] dark:border-[#2C241B]">
            <div className="flex items-center justify-between text-xs font-semibold text-[#8C7A65] dark:text-[#A89C8C] mb-2">
              <span>Step {currentStep} of 4</span>
              <span className="font-serif-title text-[#2B2118] dark:text-[#EFEBE4]">
                {currentStep === 1 && '1. Beekeeper Identification'}
                {currentStep === 2 && '2. Hive Census & Colony Condition'}
                {currentStep === 3 && '3. Uganda Seasonal Harvest'}
                {currentStep === 4 && '4. Challenges & Confirmation'}
              </span>
            </div>

            {/* Step Track Bars */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    stepNumber <= currentStep ? 'bg-[#D97706]' : 'bg-[#DDD3C1] dark:bg-[#332A21]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* STEP 1: Beekeeper Information */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[#F0EAE0] dark:border-[#2C241B] pb-3">
                  <h3 className="font-serif-title font-bold text-lg text-[#2B2118] dark:text-[#EFEBE4]">
                    Beekeeper Profile & Apiary Zone
                  </h3>
                  <p className="text-xs text-[#8C7A65] dark:text-[#A89C8C]">
                    Enter the beekeeper's credentials and primary apiary location.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1.5">
                      Beekeeper Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ambrose Ssenyondo"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#15120F] border border-[#DDD3C1] dark:border-[#383127] rounded-xl text-sm text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1.5">
                      Email or Phone Contact
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. ambrose@apiary.ug"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#15120F] border border-[#DDD3C1] dark:border-[#383127] rounded-xl text-sm text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SheetSelect
                    label="Uganda Apiary Region *"
                    value={region}
                    onChange={setRegion}
                    options={[
                      { value: 'Central (Masaka)', label: 'Central — Masaka & Lake Victoria' },
                      { value: 'Central (Luweero)', label: 'Central — Luweero & Savannah' },
                      { value: 'Western (Kasese)', label: 'Western — Kasese & Rwenzori' },
                      { value: 'Western (Bushenyi)', label: 'Western — Bushenyi & Ankole' },
                      { value: 'Northern (Arua)', label: 'Northern — Arua & West Nile' },
                      { value: 'Eastern (Soroti)', label: 'Eastern — Soroti & Teso' },
                      { value: 'Eastern (Mbale)', label: 'Eastern — Mbale & Mt. Elgon' },
                    ]}
                  />

                  <SheetSelect
                    label="Beekeeping Experience"
                    value={experience}
                    onChange={setExperience}
                    options={[
                      { value: 'Under 1 year', label: 'Beginner (Under 1 year)' },
                      { value: '1–2 years', label: '1–2 years' },
                      { value: '3–5 years', label: '3–5 years (Intermediate)' },
                      { value: 'Over 5 years', label: 'Over 5 years (Master Beekeeper)' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1.5">
                    Apiary Name / Village Landmark
                  </label>
                  <input
                    type="text"
                    value={apiaryName}
                    onChange={(e) => setApiaryName(e.target.value)}
                    placeholder="e.g. Kyanamukaka Community Apiary 02"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#15120F] border border-[#DDD3C1] dark:border-[#383127] rounded-xl text-sm text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Hive Census & Colony Condition */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="border-b border-[#F0EAE0] dark:border-[#2C241B] pb-3">
                  <h3 className="font-serif-title font-bold text-lg text-[#2B2118] dark:text-[#EFEBE4]">
                    Hive Census & Colony Vigor
                  </h3>
                  <p className="text-xs text-[#8C7A65] dark:text-[#A89C8C]">
                    Record hive types utilized and overall health conditions observed in the apiary.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1.5">
                      Total Colonized Hives *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={hiveCount}
                      onChange={(e) => setHiveCount(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#15120F] border border-[#DDD3C1] dark:border-[#383127] rounded-xl text-sm text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <SheetSelect
                    label="Primary Colony Strength *"
                    value={observedStrength}
                    onChange={(val) => setObservedStrength(val as ColonyStrength)}
                    options={[
                      { value: 'Strong', label: 'Strong (Heavy brood, full frames)' },
                      { value: 'Moderate', label: 'Moderate (Steady activity)' },
                      { value: 'Weak', label: 'Weak (Low population / vulnerability)' },
                    ]}
                  />
                </div>

                {/* Hive Types Multi-Select Chips */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-2">
                    Hive Types Present in Apiary (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {['Top Bar (KTBH)', 'Langstroth', 'Traditional Log / Bamboo', 'Warré'].map(
                      (type) => {
                        const isChecked = hiveTypes.includes(type);
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => toggleHiveType(type)}
                            className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                              isChecked
                                ? 'bg-amber-500/15 border-[#D97706] text-[#92400E] dark:text-[#FBBF24] ring-1 ring-[#D97706]'
                                : 'bg-[#FAF7F2] dark:bg-[#16120E] border-[#DDD3C1] dark:border-[#383127] text-[#6B5E4F] dark:text-[#A89C8C]'
                            }`}
                          >
                            <span className="block">{type}</span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Health & Pest Issues Encountered */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-2">
                    Observed Pests or Health Symptoms (Optional)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      'Wax moth larvae',
                      'Small hive beetle',
                      'Safari / black ants',
                      'Varroa mite signs',
                      'Foulbrood suspicion',
                      'Absconding risk',
                    ].map((issue) => {
                      const isSelected = healthIssues.includes(issue);
                      return (
                        <button
                          key={issue}
                          type="button"
                          onClick={() => toggleHealthIssue(issue)}
                          className={`p-2 rounded-lg border text-xs text-left transition-colors ${
                            isSelected
                              ? 'bg-rose-100 dark:bg-rose-950/60 border-rose-400 text-rose-800 dark:text-rose-300'
                              : 'bg-[#FAF7F2] dark:bg-[#16120E] border-[#DDD3C1] dark:border-[#383127] text-[#6B5E4F] dark:text-[#A89C8C]'
                          }`}
                        >
                          {issue}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Seasonal Harvest & Floral Origins */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[#F0EAE0] dark:border-[#2C241B] pb-3">
                  <h3 className="font-serif-title font-bold text-lg text-[#2B2118] dark:text-[#EFEBE4]">
                    Uganda Seasonal Harvest Data
                  </h3>
                  <p className="text-xs text-[#8C7A65] dark:text-[#A89C8C]">
                    Capture seasonal yields based on Uganda's specific weather cycles.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SheetSelect
                    label="Current Uganda Harvest Season *"
                    value={season}
                    onChange={(v) => setSeason(v as UgandaSeason)}
                    options={[
                      { value: 'Long Rains (Mar–May)', label: 'Long Rains (Mar–May)' },
                      { value: 'Dry Season (Jun–Aug)', label: 'Dry Season (Jun–Aug)' },
                      { value: 'Short Rains (Sep–Nov)', label: 'Short Rains (Sep–Nov)' },
                      { value: 'Dry Season (Dec–Feb)', label: 'Dry Season (Dec–Feb)' },
                    ]}
                  />

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1.5">
                      Estimated / Actual Harvest (kg) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={estimatedKg}
                      onChange={(e) => setEstimatedKg(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#15120F] border border-[#DDD3C1] dark:border-[#383127] rounded-xl text-sm text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1.5">
                      Primary Floral Nectar Sources
                    </label>
                    <input
                      type="text"
                      value={floralSource}
                      onChange={(e) => setFloralSource(e.target.value)}
                      placeholder="e.g. Robusta Coffee, Acacia, Shea butter tree"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#15120F] border border-[#DDD3C1] dark:border-[#383127] rounded-xl text-sm text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <SheetSelect
                    label="Honey Extraction Technique"
                    value={extractionMethod}
                    onChange={setExtractionMethod}
                    options={[
                      { value: 'Centrifuge Extractor & Filter Cloth', label: 'Centrifuge Extractor & Filter Cloth' },
                      { value: 'Solar Wax Melter / Drip Drain', label: 'Solar Wax Melter & Drip' },
                      { value: 'Press & Fine Mesh Strainer', label: 'Press & Fine Mesh Strainer' },
                      { value: 'Traditional Hand Crush & Squeeze', label: 'Traditional Hand Crush' },
                    ]}
                  />
                </div>
              </div>
            )}

            {/* STEP 4: Challenges & Confirmation */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-[#F0EAE0] dark:border-[#2C241B] pb-3">
                  <h3 className="font-serif-title font-bold text-lg text-[#2B2118] dark:text-[#EFEBE4]">
                    Challenges & Review
                  </h3>
                  <p className="text-xs text-[#8C7A65] dark:text-[#A89C8C]">
                    Document environmental factors and review survey inputs prior to saving.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1.5">
                    Field Challenges & Comments (Weather, Agro-chemicals, Markets)
                  </label>
                  <textarea
                    value={challenges}
                    onChange={(e) => setChallenges(e.target.value)}
                    placeholder="Describe any challenges like pesticide sprays, drought delays, or honey container shortages..."
                    rows={3}
                    className="w-full p-3.5 bg-white dark:bg-[#15120F] border border-[#DDD3C1] dark:border-[#383127] rounded-xl text-xs sm:text-sm text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Auto-Sync Toggle Card */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#1A1612] border border-[#EFE8D8] dark:border-[#2C241B] flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="auto-sync-checkbox"
                    checked={autoSyncRegistry}
                    onChange={(e) => setAutoSyncRegistry(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded text-amber-600 focus:ring-amber-500 border-gray-300"
                  />
                  <label htmlFor="auto-sync-checkbox" className="text-xs text-[#2B2118] dark:text-[#EFEBE4] cursor-pointer">
                    <span className="font-semibold block text-sm">
                      Automatically populate Apiary Hive & Harvest registries
                    </span>
                    <span className="text-[#8C7A65] dark:text-[#A89C8C] block mt-0.5">
                      Instantly sync this intake survey into active hives and log this season's yield in the production charts.
                    </span>
                  </label>
                </div>

                {/* Summary Card */}
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs space-y-1.5 text-[#6B5E4F] dark:text-[#D1C7BA]">
                  <p>
                    <strong>Beekeeper:</strong> {name || 'Not provided'} ({region})
                  </p>
                  <p>
                    <strong>Hives:</strong> {hiveCount} hives ({hiveTypes.join(', ')}) • <strong>Vigor:</strong> {observedStrength}
                  </p>
                  <p>
                    <strong>Season Yield:</strong> {estimatedKg} kg for {season}
                  </p>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="pt-4 border-t border-[#F0EAE0] dark:border-[#2C241B] flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#DDD3C1] dark:border-[#383127] bg-[#FAF7F2] hover:bg-[#F3ECE0] active:bg-[#EBE2D3] dark:bg-[#25201A] dark:hover:bg-[#302821] dark:active:bg-[#3A3128] text-xs font-semibold text-[#2B2118] dark:text-[#EFEBE4] transition-all duration-150 active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  disabled={currentStep === 1 && !name.trim()}
                  onClick={() => setCurrentStep((prev) => (prev + 1) as any)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-600 disabled:opacity-50 hover:bg-amber-700 active:bg-amber-800 text-white dark:bg-amber-600 dark:hover:bg-amber-500 text-xs font-semibold shadow-sm transition-all duration-150 active:scale-95 cursor-pointer disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 disabled:opacity-50 hover:bg-emerald-700 active:bg-emerald-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 text-xs font-semibold shadow-md transition-all duration-150 active:scale-95 cursor-pointer disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Submit Field Survey
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Historical Intake Submissions */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif-title font-bold text-lg text-[#2B2118] dark:text-[#EFEBE4]">
              Recorded Survey Submissions ({surveys.length})
            </h3>
            <p className="text-xs text-[#8C7A65] dark:text-[#A89C8C]">
              Historical records collected from field beekeepers
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#F0EAE0] dark:divide-[#2C241B]">
          {surveys.map((s) => (
            <div key={s.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[#2B2118] dark:text-[#EFEBE4]">
                    {s.beekeeperName}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-medium">
                    {s.region}
                  </span>
                </div>
                <p className="text-[#6B5E4F] dark:text-[#A89C8C]">
                  {s.hiveCount} Hives • {s.observedColonyStrength} Vigor • {s.estimatedHarvestKg} kg ({s.currentSeason})
                </p>
                <p className="text-[#8C7A65] dark:text-[#9E9080] italic">
                  "{s.challenges}"
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[11px] text-[#8C7A65]">
                  {new Date(s.submittedAt).toLocaleDateString()}
                </span>
                <span className="block text-[10px] text-emerald-600 font-semibold">
                  Verified Intake
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
