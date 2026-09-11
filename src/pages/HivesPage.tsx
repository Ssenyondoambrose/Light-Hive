import React, { useState, useMemo } from 'react';
import {
  Hexagon,
  Plus,
  Search,
  Filter,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  ShieldAlert,
  Bug,
  RotateCcw,
  Layers,
  ChevronRight,
  X,
  User,
  Activity,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Hive, ColonyStrength, HealthStatus, HiveType } from '../types';
import { SheetSelect } from '../components/SheetSelect';
import { MapLocationPicker } from '../components/MapLocationPicker';
import { PhotoUpload } from '../components/PhotoUpload';
import { PestDiseaseSection } from '../components/PestDiseaseSection';
import { getActiveSevereOrCriticalPest, getRecurringPestOutbreaks } from '../utils/pestAlerts';

interface HivesPageProps {
  isCreateModalOpen: boolean;
  onCloseCreateModal: () => void;
  onOpenCreateModal: () => void;
}

export const HivesPage: React.FC<HivesPageProps> = ({
  isCreateModalOpen,
  onCloseCreateModal,
  onOpenCreateModal,
}) => {
  const {
    hives,
    addHive,
    deleteHive,
    selectedHiveId,
    setSelectedHiveId,
    markHiveInspected,
    searchQuery,
    reminders,
  } = useApp();

  const [strengthFilter, setStrengthFilter] = useState<string>('all');
  const [healthFilter, setHealthFilter] = useState<string>('all');
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [isLoggingInspection, setIsLoggingInspection] = useState(false);

  // Hive Form State
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('Masaka Apiary, Central Uganda');
  const [formRegion, setFormRegion] = useState('Central (Masaka)');
  const [formCoords, setFormCoords] = useState({ lat: -0.3344, lng: 31.7341 });
  const [formHiveType, setFormHiveType] = useState<HiveType>('Top Bar (KTBH)');
  const [formStrength, setFormStrength] = useState<ColonyStrength>('Strong');
  const [formHealth, setFormHealth] = useState<HealthStatus>('Healthy');
  const [formFrames, setFormFrames] = useState(20);
  const [formBeekeeperName, setFormBeekeeperName] = useState('');
  const [formPhotoUrl, setFormPhotoUrl] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formQueenSpotted, setFormQueenSpotted] = useState(true);
  const [formHoneyStores, setFormHoneyStores] = useState<'Full' | 'Moderate' | 'Low'>('Moderate');

  // Filtered hives
  const filteredHives = useMemo(() => {
    return hives.filter((hive) => {
      const matchesSearch =
        searchQuery === '' ||
        hive.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hive.apiaryLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hive.beekeeperName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hive.region.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStrength =
        strengthFilter === 'all' || hive.colonyStrength === strengthFilter;
      const matchesHealth =
        healthFilter === 'all' || hive.healthStatus === healthFilter;

      return matchesSearch && matchesStrength && matchesHealth;
    });
  }, [hives, searchQuery, strengthFilter, healthFilter]);

  const selectedHive = hives.find((h) => h.id === selectedHiveId);
  const selectedReminder = selectedHive
    ? reminders.find((r) => r.hiveId === selectedHive.id)
    : null;

  const handleCreateHiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    addHive({
      name: formName.trim(),
      apiaryLocation: formLocation,
      region: formRegion,
      coordinates: formCoords,
      hiveType: formHiveType,
      colonyStrength: formStrength,
      healthStatus: formHealth,
      framesCount: Number(formFrames) || 15,
      lastInspected: new Date().toISOString().split('T')[0],
      installationDate: new Date().toISOString().split('T')[0],
      beekeeperName: formBeekeeperName.trim() || 'Uganda Apiary Beekeeper',
      beekeeperPhotoUrl: formPhotoUrl || undefined,
      notes: formNotes,
      queenSpotted: formQueenSpotted,
      honeyStores: formHoneyStores,
    });

    // Reset Form
    setFormName('');
    setFormBeekeeperName('');
    setFormPhotoUrl('');
    setFormNotes('');
    onCloseCreateModal();
  };

  const handleLogInspectionSubmit = (hiveId: string) => {
    markHiveInspected(hiveId, inspectionNotes || 'Inspection completed and recorded.');
    setInspectionNotes('');
    setIsLoggingInspection(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Editorial Page Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#291F14] text-[#FAF7F2] p-6 sm:p-8 border border-[#3E2E1D] shadow-md">
        <div className="absolute inset-0 honeycomb-pattern pointer-events-none opacity-10" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs uppercase font-semibold text-[#D97706] tracking-wider">
              <Hexagon className="w-4 h-4" />
              <span>Colony Census & Monitoring</span>
            </div>
            <h1 className="font-serif-title text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Apiary Hive Registry
            </h1>
            <p className="text-xs sm:text-sm text-[#CFC2B0] max-w-xl">
              Track hive structure, colony vigor, health status, and automated checkup schedules
              for beekeepers across Uganda.
            </p>
          </div>

          <button
            type="button"
            id="register-hive-btn"
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold text-sm shadow-md transition-all duration-150 active:scale-95 shrink-0 touch-control focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Plus className="w-4 h-4" />
            <span>Register Hive</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#6B5E4F] dark:text-[#A89C8C] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#D97706]" />
            Filters:
          </span>

          {/* Strength Filter */}
          <div className="w-36">
            <SheetSelect
              value={strengthFilter}
              onChange={setStrengthFilter}
              options={[
                { value: 'all', label: 'All Strengths' },
                { value: 'Strong', label: 'Strong Vigor' },
                { value: 'Moderate', label: 'Moderate Vigor' },
                { value: 'Weak', label: 'Weak Vigor' },
              ]}
            />
          </div>

          {/* Health Status Filter */}
          <div className="w-44">
            <SheetSelect
              value={healthFilter}
              onChange={setHealthFilter}
              options={[
                { value: 'all', label: 'All Health Conditions' },
                { value: 'Healthy', label: 'Healthy' },
                { value: 'Active Queen', label: 'Active Queen' },
                { value: 'Pest Spotted', label: 'Pest Spotted' },
                { value: 'Recovering', label: 'Recovering' },
                { value: 'Disease / Treatment Needed', label: 'Needs Treatment' },
              ]}
            />
          </div>
        </div>

        <div className="text-xs text-[#8C7A65] dark:text-[#A89C8C]">
          Showing <strong>{filteredHives.length}</strong> of {hives.length} hives
        </div>
      </div>

      {/* Hives Grid */}
      {filteredHives.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] space-y-3">
          <Hexagon className="w-12 h-12 text-[#D97706]/40 mx-auto" />
          <h3 className="font-serif-title font-bold text-lg text-[#2B2118] dark:text-[#EFEBE4]">
            No hives found matching filters
          </h3>
          <p className="text-xs text-[#8C7A65] max-w-sm mx-auto">
            Try adjusting your search criteria or register a new apiary hive.
          </p>
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white dark:bg-amber-600 dark:hover:bg-amber-500 dark:active:bg-amber-700 text-xs font-semibold shadow-sm transition-all duration-150 active:scale-95 touch-control"
          >
            <Plus className="w-3.5 h-3.5" />
            Register Hive
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHives.map((hive) => {
            const reminder = reminders.find((r) => r.hiveId === hive.id);
            const isUrgent = reminder?.urgency === 'urgent';
            const isDueSoon = reminder?.urgency === 'due_soon';
            const activeSevere = getActiveSevereOrCriticalPest(hive);
            const activeRecurring = getRecurringPestOutbreaks(hive).filter((r) => r.activeOccurrences > 0);

            return (
              <div
                key={hive.id}
                id={`hive-card-${hive.id}`}
                onClick={() => setSelectedHiveId(hive.id)}
                className="rounded-2xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] hover:border-[#D97706] dark:hover:border-[#D97706] transition-all shadow-xs hover:shadow-md p-5 flex flex-col justify-between space-y-4 cursor-pointer group"
              >
                <div className="space-y-3">
                  {/* Card Header with Beekeeper Photo & Name */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#D97706]/50 shrink-0 bg-[#FAF7F2] dark:bg-[#25201A]">
                        {hive.beekeeperPhotoUrl ? (
                          <img
                            src={hive.beekeeperPhotoUrl}
                            alt={hive.beekeeperName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#B45309] font-bold text-sm">
                            {hive.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-[#8C7A65] dark:text-[#A89C8C] block leading-none">
                          {hive.id}
                        </span>
                        <h3 className="font-serif-title font-bold text-base text-[#2B2118] dark:text-[#EFEBE4] group-hover:text-[#D97706] transition-colors leading-tight mt-0.5">
                          {hive.name}
                        </h3>
                        <span className="text-xs text-[#6B5E4F] dark:text-[#A89C8C] flex items-center gap-1 mt-0.5">
                          <User className="w-3 h-3 text-[#D97706]" />
                          {hive.beekeeperName}
                        </span>
                      </div>
                    </div>

                    {/* Vigor Badge */}
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                        hive.colonyStrength === 'Strong'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : hive.colonyStrength === 'Moderate'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                      }`}
                    >
                      {hive.colonyStrength}
                    </span>
                  </div>

                  {/* Location & Coordinates */}
                  <div className="text-xs text-[#7A6A57] dark:text-[#A89C8C] flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                    <span className="truncate">{hive.apiaryLocation}</span>
                  </div>

                  {/* Pest Alert Badge on Card if any */}
                  {activeSevere ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-100/90 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-[11px] font-semibold animate-pulse">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                      <span className="truncate">
                        Alert: {activeSevere.severity} {activeSevere.name.split('(')[0]}
                      </span>
                    </div>
                  ) : activeRecurring.length > 0 ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100/80 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-900 text-amber-900 dark:text-amber-300 text-[11px] font-semibold">
                      <RotateCcw className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                      <span className="truncate">
                        Recurring Threat: {activeRecurring[0].pestName.split('(')[0]} ({activeRecurring[0].totalOccurrences}x)
                      </span>
                    </div>
                  ) : null}

                  {/* Specifications Pill Bar */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="p-2 rounded-lg bg-[#FAF7F2] dark:bg-[#25201A] border border-[#EFE8D8] dark:border-[#30271E]">
                      <span className="text-[10px] text-[#8C7A65] block">Type</span>
                      <span className="font-medium text-[#2B2118] dark:text-[#EFEBE4] truncate block">
                        {hive.hiveType}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#FAF7F2] dark:bg-[#25201A] border border-[#EFE8D8] dark:border-[#30271E]">
                      <span className="text-[10px] text-[#8C7A65] block">Frames / Stores</span>
                      <span className="font-medium text-[#2B2118] dark:text-[#EFEBE4] truncate block">
                        {hive.framesCount} frames • {hive.honeyStores}
                      </span>
                    </div>
                  </div>

                  {/* Health Condition */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-[#8C7A65]">Status:</span>
                    <span
                      className={`font-medium ${
                        hive.healthStatus === 'Disease / Treatment Needed'
                          ? 'text-rose-600 dark:text-rose-400 font-semibold'
                          : hive.healthStatus === 'Pest Spotted'
                          ? 'text-amber-700 dark:text-amber-400'
                          : 'text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {hive.healthStatus}
                    </span>
                  </div>
                </div>

                {/* Footer with Checkup Reminder Status */}
                <div className="pt-3 border-t border-[#F0EAE0] dark:border-[#2C241B] flex items-center justify-between text-xs">
                  {reminder && (
                    <div className="flex items-center gap-1.5">
                      {isUrgent ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                      ) : isDueSoon ? (
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      <span
                        className={`font-semibold text-[11px] ${
                          isUrgent
                            ? 'text-rose-600 dark:text-rose-400'
                            : isDueSoon
                            ? 'text-amber-700 dark:text-amber-400'
                            : 'text-[#6B5E4F] dark:text-[#A89C8C]'
                        }`}
                      >
                        {reminder.dueDays <= 0
                          ? `Checkup overdue (${Math.abs(reminder.dueDays)}d)`
                          : `Next checkup: ${reminder.dueDays}d`}
                      </span>
                    </div>
                  )}

                  <div className="inline-flex items-center text-amber-600 dark:text-amber-400 font-semibold text-xs gap-0.5 group-hover:translate-x-1 transition-transform">
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Hive Detail Modal */}
      {selectedHive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-3xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-[#FAF7F2] dark:bg-[#15120F] border-b border-[#EFE8D8] dark:border-[#2C241B] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#D97706] bg-amber-100 dark:bg-amber-950 shrink-0">
                  {selectedHive.beekeeperPhotoUrl ? (
                    <img
                      src={selectedHive.beekeeperPhotoUrl}
                      alt={selectedHive.beekeeperName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-amber-800">
                      {selectedHive.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#8C7A65]">{selectedHive.id}</span>
                  <h2 className="font-serif-title text-xl font-bold text-[#2B2118] dark:text-[#EFEBE4]">
                    {selectedHive.name}
                  </h2>
                  <p className="text-xs text-[#7A6A57] dark:text-[#A89C8C]">
                    Beekeeper: <strong>{selectedHive.beekeeperName}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedHiveId(null)}
                className="p-1.5 rounded-full text-[#8C7A65] hover:text-[#2B2118] dark:text-[#A89C8C] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Checkup Banner */}
              {selectedReminder && (
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                    selectedReminder.urgency === 'urgent'
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60'
                      : selectedReminder.urgency === 'due_soon'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
                      {selectedReminder.urgency === 'urgent' ? (
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-600" />
                      )}
                      <span>
                        {selectedReminder.dueDays <= 0
                          ? `Action Required: Overdue by ${Math.abs(selectedReminder.dueDays)} days`
                          : `Scheduled Checkup in ${selectedReminder.dueDays} days`}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B5E4F] dark:text-[#C4B7A5]">
                      {selectedReminder.reason}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsLoggingInspection(true)}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white dark:bg-amber-600 dark:hover:bg-amber-500 dark:active:bg-amber-700 text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 shrink-0 touch-control"
                  >
                    Log Checkup
                  </button>
                </div>
              )}

              {/* Log Inspection Drawer / Form if open */}
              {isLoggingInspection && (
                <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#1E1914] border border-[#DDD3C1] dark:border-[#383127] space-y-3 animate-in fade-in duration-150">
                  <h4 className="font-serif-title font-semibold text-sm text-[#2B2118] dark:text-[#EFEBE4]">
                    Log Apiary Colony Inspection
                  </h4>
                  <textarea
                    value={inspectionNotes}
                    onChange={(e) => setInspectionNotes(e.target.value)}
                    placeholder="Enter observation notes (brood pattern, queen behavior, honey stores, disease checks)..."
                    className="w-full p-3 text-xs rounded-xl border border-[#DDD3C1] dark:border-[#383127] bg-white dark:bg-[#16120E] text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-amber-500"
                    rows={3}
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsLoggingInspection(false)}
                      className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-[#DDD3C1] dark:border-[#383127] bg-[#FAF7F2] hover:bg-[#F3ECE0] active:bg-[#EBE2D3] dark:bg-[#25201A] dark:hover:bg-[#302821] text-[#2B2118] dark:text-[#EFEBE4] transition-all duration-150 active:scale-95"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLogInspectionSubmit(selectedHive.id)}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-xs transition-all duration-150 active:scale-95"
                    >
                      Save Inspection
                    </button>
                  </div>
                </div>
              )}

              {/* Hive Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#1E1914] border border-[#EFE8D8] dark:border-[#2C241B]">
                  <span className="text-[10px] text-[#8C7A65]">Colony Vigor</span>
                  <p className="font-semibold text-sm text-[#2B2118] dark:text-[#EFEBE4]">
                    {selectedHive.colonyStrength}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#1E1914] border border-[#EFE8D8] dark:border-[#2C241B]">
                  <span className="text-[10px] text-[#8C7A65]">Health Condition</span>
                  <p className="font-semibold text-sm text-[#2B2118] dark:text-[#EFEBE4]">
                    {selectedHive.healthStatus}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#1E1914] border border-[#EFE8D8] dark:border-[#2C241B]">
                  <span className="text-[10px] text-[#8C7A65]">Hive Architecture</span>
                  <p className="font-semibold text-sm text-[#2B2118] dark:text-[#EFEBE4]">
                    {selectedHive.hiveType}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#1E1914] border border-[#EFE8D8] dark:border-[#2C241B]">
                  <span className="text-[10px] text-[#8C7A65]">Frame Count</span>
                  <p className="font-semibold text-sm text-[#2B2118] dark:text-[#EFEBE4]">
                    {selectedHive.framesCount} Bars / Frames
                  </p>
                </div>
              </div>

              {/* Apiary Location & Map Coordinates */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#1E1914] border border-[#EFE8D8] dark:border-[#2C241B] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#6B5E4F] dark:text-[#A89C8C] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#D97706]" />
                    Apiary Location & Coordinates
                  </span>
                  <span className="font-mono text-xs text-[#8C7A65]">
                    {selectedHive.coordinates.lat}° N, {selectedHive.coordinates.lng}° E
                  </span>
                </div>
                <p className="text-sm font-medium text-[#2B2118] dark:text-[#EFEBE4]">
                  {selectedHive.apiaryLocation}
                </p>
                <p className="text-xs text-[#8C7A65] dark:text-[#A89C8C]">
                  Region: <strong>{selectedHive.region}</strong>
                </p>
              </div>

              {/* Historical Notes */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C]">
                  Field Notes & Observations
                </h4>
                <p className="text-xs sm:text-sm text-[#2B2118] dark:text-[#DCD3C7] p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#1E1914] border border-[#EFE8D8] dark:border-[#2C241B] leading-relaxed">
                  {selectedHive.notes || 'No detailed notes logged for this hive yet.'}
                </p>
              </div>

              {/* Pests & Diseases Sub-Section */}
              <PestDiseaseSection hive={selectedHive} />

              {/* Delete Hive Button */}
              <div className="pt-4 border-t border-[#F0EAE0] dark:border-[#2C241B] flex items-center justify-between">
                <span className="text-xs text-[#8C7A65]">
                  Installed on {selectedHive.installationDate}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Remove hive "${selectedHive.name}" from registry?`)) {
                      deleteHive(selectedHive.id);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 active:text-rose-800 hover:bg-rose-50 active:bg-rose-100 dark:hover:bg-rose-950/40 transition-all duration-150 active:scale-95"
                >
                  Delete Hive Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register Hive Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl my-8 rounded-3xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 bg-[#FAF7F2] dark:bg-[#15120F] border-b border-[#EFE8D8] dark:border-[#2C241B] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hexagon className="w-5 h-5 text-[#D97706]" />
                <h2 className="font-serif-title text-lg font-bold text-[#2B2118] dark:text-[#EFEBE4]">
                  Register New Apiary Hive
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
            <form onSubmit={handleCreateHiveSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Beekeeper Profile Name & Photo Upload */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#1A1612] border border-[#EFE8D8] dark:border-[#2C241B] space-y-3">
                <PhotoUpload
                  value={formPhotoUrl}
                  onChange={setFormPhotoUrl}
                  onRemove={() => setFormPhotoUrl('')}
                  label="Beekeeper Profile Photo"
                />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1">
                    Beekeeper Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formBeekeeperName}
                    onChange={(e) => setFormBeekeeperName(e.target.value)}
                    placeholder="e.g. Mugisha Emmanuel"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#15120F] border border-[#DDD3C1] dark:border-[#383127] rounded-lg text-sm text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Hive Identification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1">
                    Hive Identifier / Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Masaka Sun Queen 03"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#15120F] border border-[#DDD3C1] dark:border-[#383127] rounded-lg text-sm text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <SheetSelect
                  label="Hive Architecture *"
                  value={formHiveType}
                  onChange={(val) => setFormHiveType(val as HiveType)}
                  options={[
                    { value: 'Top Bar (KTBH)', label: 'Top Bar (KTBH - Kenyan Top Bar)' },
                    { value: 'Langstroth', label: 'Langstroth Frame Hive' },
                    { value: 'Traditional Log / Bamboo', label: 'Traditional Log / Bamboo' },
                    { value: 'Warré', label: 'Warré Natural Hive' },
                  ]}
                />
              </div>

              {/* Map Location & Coordinates Picker */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#1A1612] border border-[#EFE8D8] dark:border-[#2C241B] space-y-3">
                <MapLocationPicker
                  coordinates={formCoords}
                  defaultLocationName={formLocation}
                  onChange={(coords, hint) => {
                    setFormCoords(coords);
                    if (hint) {
                      setFormLocation(hint);
                      if (hint.includes('Masaka')) setFormRegion('Central (Masaka)');
                      else if (hint.includes('Kasese')) setFormRegion('Western (Kasese)');
                      else if (hint.includes('Luweero')) setFormRegion('Central (Luweero)');
                      else if (hint.includes('Arua')) setFormRegion('Northern (Arua)');
                      else if (hint.includes('Bushenyi')) setFormRegion('Western (Bushenyi)');
                      else if (hint.includes('Soroti')) setFormRegion('Eastern (Soroti)');
                    }
                  }}
                />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1">
                    Apiary Address / Village / Zone
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Kyanamukaka Apiary, Masaka District"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#15120F] border border-[#DDD3C1] dark:border-[#383127] rounded-lg text-sm text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Colony Vigor, Health Status & Frames */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <SheetSelect
                  label="Colony Strength *"
                  value={formStrength}
                  onChange={(val) => setFormStrength(val as ColonyStrength)}
                  options={[
                    { value: 'Strong', label: 'Strong (14d checkup cycle)' },
                    { value: 'Moderate', label: 'Moderate (7d checkup cycle)' },
                    { value: 'Weak', label: 'Weak (3d checkup cycle)' },
                  ]}
                />

                <SheetSelect
                  label="Health Condition *"
                  value={formHealth}
                  onChange={(val) => setFormHealth(val as HealthStatus)}
                  options={[
                    { value: 'Healthy', label: 'Healthy & Productive' },
                    { value: 'Active Queen', label: 'Active Laying Queen' },
                    { value: 'Pest Spotted', label: 'Pest Spotted (2d cycle)' },
                    { value: 'Recovering', label: 'Recovering (Halved cycle)' },
                    { value: 'Disease / Treatment Needed', label: 'Immediate Treatment (0d)' },
                  ]}
                />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1">
                    Bars / Frames
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={formFrames}
                    onChange={(e) => setFormFrames(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#15120F] border border-[#DDD3C1] dark:border-[#383127] rounded-lg text-sm text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1">
                  Installation Notes & Temperament
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Notes on floral surroundings, swarm date, or temperament..."
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
                  Save Hive to Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
