import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Plus,
  Filter,
  Calendar,
  Droplets,
  Scale,
  Award,
  X,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Harvest, UgandaSeason } from '../types';
import { SheetSelect } from '../components/SheetSelect';

interface HarvestsPageProps {
  isCreateModalOpen: boolean;
  onCloseCreateModal: () => void;
  onOpenCreateModal: () => void;
}

const UGANDA_SEASONS_LIST: UgandaSeason[] = [
  'Long Rains (Mar–May)',
  'Dry Season (Jun–Aug)',
  'Short Rains (Sep–Nov)',
  'Dry Season (Dec–Feb)',
];

export const HarvestsPage: React.FC<HarvestsPageProps> = ({
  isCreateModalOpen,
  onCloseCreateModal,
  onOpenCreateModal,
}) => {
  const { harvests, hives, addHarvest, deleteHarvest, searchQuery } = useApp();

  const [seasonFilter, setSeasonFilter] = useState<string>('all');
  const [honeyTypeFilter, setHoneyTypeFilter] = useState<string>('all');

  // Form State
  const [formHiveId, setFormHiveId] = useState(hives[0]?.id || '');
  const [formSeason, setFormSeason] = useState<UgandaSeason>('Dry Season (Jun–Aug)');
  const [formQuantity, setFormQuantity] = useState('25');
  const [formHoneyType, setFormHoneyType] = useState<Harvest['honeyType']>('Acacia');
  const [formMoisture, setFormMoisture] = useState('17.5');
  const [formColorGrade, setFormColorGrade] = useState<Harvest['colorGrade']>('Light Amber');
  const [formSignatory, setFormSignatory] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formNotes, setFormNotes] = useState('');

  // Filtered list
  const filteredHarvests = useMemo(() => {
    return harvests.filter((h) => {
      const matchesSearch =
        searchQuery === '' ||
        h.hiveName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.honeyType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.beekeeperSignatory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.season.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSeason = seasonFilter === 'all' || h.season === seasonFilter;
      const matchesType = honeyTypeFilter === 'all' || h.honeyType === honeyTypeFilter;

      return matchesSearch && matchesSeason && matchesType;
    });
  }, [harvests, searchQuery, seasonFilter, honeyTypeFilter]);

  // Total stats
  const totalYield = filteredHarvests.reduce((sum, h) => sum + h.quantityKg, 0).toFixed(1);
  const avgMoisture = (
    filteredHarvests.reduce((sum, h) => sum + h.moisturePercent, 0) /
    Math.max(1, filteredHarvests.length)
  ).toFixed(1);

  const handleCreateHarvestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetHive = hives.find((h) => h.id === formHiveId) || hives[0];
    if (!targetHive) return;

    addHarvest({
      hiveId: targetHive.id,
      hiveName: targetHive.name,
      season: formSeason,
      date: formDate,
      quantityKg: parseFloat(formQuantity) || 10,
      honeyType: formHoneyType,
      moisturePercent: parseFloat(formMoisture) || 17.5,
      colorGrade: formColorGrade,
      beekeeperSignatory: formSignatory.trim() || targetHive.beekeeperName,
      notes: formNotes,
    });

    onCloseCreateModal();
    setFormNotes('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Editorial Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#2C1D10] text-[#FAF7F2] p-6 sm:p-8 border border-[#452D19] shadow-md">
        <div className="absolute inset-0 honeycomb-pattern pointer-events-none opacity-10" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs uppercase font-semibold text-[#D97706] tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Uganda Weather Cycles & Production</span>
            </div>
            <h1 className="font-serif-title text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Seasonal Honey Harvests
            </h1>
            <p className="text-xs sm:text-sm text-[#CFC2B0] max-w-xl">
              Track honey yields, floral origins, and moisture quality across Uganda’s Long Rains,
              Short Rains, and primary Dry Season harvest windows.
            </p>
          </div>

          <button
            type="button"
            id="log-harvest-btn"
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold text-sm shadow-md transition-all duration-150 active:scale-95 shrink-0 touch-control focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Plus className="w-4 h-4" />
            <span>Log Harvest</span>
          </button>
        </div>
      </div>

      {/* Uganda Seasonal Knowledge Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {UGANDA_SEASONS_LIST.map((season) => {
          const isSelected = seasonFilter === season;
          const seasonCount = harvests.filter((h) => h.season === season).length;
          const seasonKg = harvests
            .filter((h) => h.season === season)
            .reduce((s, h) => s + h.quantityKg, 0)
            .toFixed(1);

          return (
            <button
              key={season}
              type="button"
              onClick={() => setSeasonFilter(isSelected ? 'all' : season)}
              className={`p-3.5 rounded-2xl border text-left transition-all touch-control ${
                isSelected
                  ? 'bg-amber-500/15 border-[#D97706] text-[#92400E] dark:text-[#FBBF24] ring-1 ring-[#D97706]'
                  : 'bg-white dark:bg-[#1C1814] border-[#E6DEC8] dark:border-[#383127] hover:border-[#D97706]'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold">{season.split(' ')[0]} {season.split(' ')[1]}</span>
                <span className="text-[10px] text-[#8C7A65] dark:text-[#A89C8C]">{season.split('(')[1]?.replace(')', '')}</span>
              </div>
              <div className="font-serif-title font-bold text-lg text-[#2B2118] dark:text-[#EFEBE4]">
                {seasonKg} kg
              </div>
              <div className="text-[11px] text-[#8C7A65] dark:text-[#A89C8C]">
                {seasonCount} harvest log{seasonCount === 1 ? '' : 's'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#6B5E4F] dark:text-[#A89C8C] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#D97706]" />
            Season:
          </span>

          <div className="w-48">
            <SheetSelect
              value={seasonFilter}
              onChange={setSeasonFilter}
              options={[
                { value: 'all', label: 'All Uganda Seasons' },
                ...UGANDA_SEASONS_LIST.map((s) => ({ value: s, label: s })),
              ]}
            />
          </div>

          <div className="w-40">
            <SheetSelect
              value={honeyTypeFilter}
              onChange={setHoneyTypeFilter}
              options={[
                { value: 'all', label: 'All Honey Types' },
                { value: 'Acacia', label: 'Acacia' },
                { value: 'Coffee Blossom', label: 'Coffee Blossom' },
                { value: 'Wildflower', label: 'Wildflower' },
                { value: 'Eucalyptus', label: 'Eucalyptus' },
                { value: 'Forest Amber', label: 'Forest Amber' },
                { value: 'Sunflower', label: 'Sunflower' },
              ]}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#8C7A65] dark:text-[#A89C8C]">
          <span>Total: <strong>{totalYield} kg</strong></span>
          <span>•</span>
          <span>Avg Moisture: <strong>{avgMoisture}%</strong></span>
        </div>
      </div>

      {/* Harvests Cards / List */}
      {filteredHarvests.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] space-y-3">
          <Sparkles className="w-12 h-12 text-[#D97706]/40 mx-auto" />
          <h3 className="font-serif-title font-bold text-lg text-[#2B2118] dark:text-[#EFEBE4]">
            No seasonal harvests recorded for this filter
          </h3>
          <p className="text-xs text-[#8C7A65] max-w-sm mx-auto">
            Log your latest honey extraction with moisture testing and hive origin.
          </p>
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D97706] text-white text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            Log Seasonal Harvest
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHarvests.map((harvest) => (
            <div
              key={harvest.id}
              className="rounded-2xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#D97706] dark:hover:border-[#D97706] transition-colors"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-[#8C7A65] dark:text-[#A89C8C] block">
                      {harvest.id}
                    </span>
                    <h3 className="font-serif-title font-bold text-lg text-[#2B2118] dark:text-[#EFEBE4]">
                      {harvest.honeyType} Honey
                    </h3>
                    <span className="text-xs text-[#6B5E4F] dark:text-[#A89C8C] flex items-center gap-1 mt-0.5">
                      Origin: <strong>{harvest.hiveName}</strong>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-serif-title font-bold text-xl text-[#D97706] dark:text-[#F59E0B]">
                      {harvest.quantityKg} kg
                    </span>
                  </div>
                </div>

                {/* Season Tag */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-medium">
                  <Calendar className="w-3 h-3 text-[#D97706]" />
                  <span>{harvest.season}</span>
                </div>

                {/* Quality Specs Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-[#FAF7F2] dark:bg-[#25201A] border border-[#EFE8D8] dark:border-[#30271E] space-y-0.5">
                    <span className="text-[10px] text-[#8C7A65] block">Moisture Content</span>
                    <span className="font-semibold text-[#2B2118] dark:text-[#EFEBE4]">
                      {harvest.moisturePercent}% ({harvest.moisturePercent <= 18.5 ? 'Prime Export' : 'Local Grade'})
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-[#FAF7F2] dark:bg-[#25201A] border border-[#EFE8D8] dark:border-[#30271E] space-y-0.5">
                    <span className="text-[10px] text-[#8C7A65] block">Color Classification</span>
                    <span className="font-semibold text-[#2B2118] dark:text-[#EFEBE4] truncate block">
                      {harvest.colorGrade}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {harvest.notes && (
                  <p className="text-xs text-[#7A6A57] dark:text-[#A89C8C] italic bg-[#FAF7F2]/60 dark:bg-[#1A1612]/60 p-2.5 rounded-lg border border-[#EFE8D8] dark:border-[#2A231C]">
                    "{harvest.notes}"
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-[#F0EAE0] dark:border-[#2C241B] flex items-center justify-between text-xs text-[#8C7A65]">
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-[#D97706]" />
                  {harvest.beekeeperSignatory}
                </span>
                <span>{harvest.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Harvest Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg my-8 rounded-3xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#FAF7F2] dark:bg-[#15120F] border-b border-[#EFE8D8] dark:border-[#2C241B] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D97706]" />
                <h2 className="font-serif-title text-lg font-bold text-[#2B2118] dark:text-[#EFEBE4]">
                  Record Seasonal Honey Harvest
                </h2>
              </div>
              <button
                type="button"
                onClick={onCloseCreateModal}
                className="p-1.5 rounded-full text-[#8C7A65] hover:text-[#2B2118] dark:text-[#A89C8C] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateHarvestSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Hive Source */}
              <SheetSelect
                label="Select Apiary Hive Source *"
                value={formHiveId}
                onChange={setFormHiveId}
                options={hives.map((h) => ({
                  value: h.id,
                  label: `${h.name} (${h.apiaryLocation})`,
                }))}
              />

              {/* Uganda Season */}
              <SheetSelect
                label="Uganda Weather Season *"
                value={formSeason}
                onChange={(v) => setFormSeason(v as UgandaSeason)}
                options={UGANDA_SEASONS_LIST.map((s) => ({
                  value: s,
                  label: s,
                }))}
              />

              {/* Yield & Moisture */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1">
                    Extracted Yield (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    required
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#15120F] border border-[#DDD3C1] dark:border-[#383127] rounded-lg text-sm text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1">
                    Moisture Content (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="12"
                    max="25"
                    value={formMoisture}
                    onChange={(e) => setFormMoisture(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#15120F] border border-[#DDD3C1] dark:border-[#383127] rounded-lg text-sm text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Floral Type & Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SheetSelect
                  label="Floral Honey Type *"
                  value={formHoneyType}
                  onChange={(v) => setFormHoneyType(v as Harvest['honeyType'])}
                  options={[
                    { value: 'Acacia', label: 'Acacia' },
                    { value: 'Coffee Blossom', label: 'Coffee Blossom' },
                    { value: 'Wildflower', label: 'Wildflower' },
                    { value: 'Eucalyptus', label: 'Eucalyptus' },
                    { value: 'Forest Amber', label: 'Forest Amber' },
                    { value: 'Sunflower', label: 'Sunflower' },
                  ]}
                />

                <SheetSelect
                  label="Pfund Color Grade"
                  value={formColorGrade}
                  onChange={(v) => setFormColorGrade(v as Harvest['colorGrade'])}
                  options={[
                    { value: 'Water White', label: 'Water White (0–8 mm)' },
                    { value: 'Extra Light Amber', label: 'Extra Light Amber (9–17 mm)' },
                    { value: 'Light Amber', label: 'Light Amber (18–34 mm)' },
                    { value: 'Amber', label: 'Amber (35–50 mm)' },
                    { value: 'Dark Amber', label: 'Dark Amber (>50 mm)' },
                  ]}
                />
              </div>

              {/* Date & Signatory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1">
                    Harvest Date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#15120F] border border-[#DDD3C1] dark:border-[#383127] rounded-lg text-sm text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1">
                    Beekeeper Signatory
                  </label>
                  <input
                    type="text"
                    placeholder="Signatory name"
                    value={formSignatory}
                    onChange={(e) => setFormSignatory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#15120F] border border-[#DDD3C1] dark:border-[#383127] rounded-lg text-sm text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1">
                  Extraction & Batch Notes
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Notes on aroma, comb capping percentage, or extraction equipment..."
                  rows={2}
                  className="w-full p-3 bg-white dark:bg-[#15120F] border border-[#DDD3C1] dark:border-[#383127] rounded-lg text-xs text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Form Actions */}
              <div className="pt-3 border-t border-[#F0EAE0] dark:border-[#2C241B] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onCloseCreateModal}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#DDD3C1] dark:border-[#383127] bg-[#FAF7F2] hover:bg-[#F3ECE0] active:bg-[#EBE2D3] dark:bg-[#25201A] dark:hover:bg-[#302821] dark:active:bg-[#3A3128] text-[#2B2118] dark:text-[#EFEBE4] transition-all duration-150 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white dark:bg-amber-600 dark:hover:bg-amber-500 dark:active:bg-amber-700 shadow-sm transition-all duration-150 active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  Save Harvest Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
