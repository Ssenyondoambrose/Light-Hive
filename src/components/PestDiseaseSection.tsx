import React, { useState } from 'react';
import {
  Bug,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Clock,
  Trash2,
  Filter,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { Hive, PestDiseaseRecord, PestSeverity, PestStatus } from '../types';
import { useApp } from '../context/AppContext';
import {
  COMMON_UGANDA_PESTS,
  getActiveSevereOrCriticalPest,
  getRecurringPestOutbreaks,
  PestTemplate,
} from '../utils/pestAlerts';
import { SheetSelect } from './SheetSelect';

interface PestDiseaseSectionProps {
  hive: Hive;
}

export const PestDiseaseSection: React.FC<PestDiseaseSectionProps> = ({ hive }) => {
  const { addPestRecord, updatePestRecord, deletePestRecord, user } = useApp();

  const [isAddingPest, setIsAddingPest] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<PestDiseaseRecord['category']>('Pest');
  const [severity, setSeverity] = useState<PestSeverity>('Moderate');
  const [dateObserved, setDateObserved] = useState(new Date().toISOString().split('T')[0]);
  const [actionsTaken, setActionsTaken] = useState('');
  const [status, setStatus] = useState<PestStatus>('Active');
  const [notes, setNotes] = useState('');

  const pestRecords = hive.pestRecords || [];

  // Alert Analysis
  const severeThreat = getActiveSevereOrCriticalPest(hive);
  const recurringOutbreaks = getRecurringPestOutbreaks(hive);
  const activeRecurring = recurringOutbreaks.filter((r) => r.activeOccurrences > 0);

  // Filtered records
  const filteredRecords = pestRecords.filter((record) => {
    if (filterStatus === 'active') return record.status === 'Active' || record.status === 'Monitoring';
    if (filterStatus === 'resolved') return record.status === 'Resolved';
    if (filterStatus === 'severe') return record.severity === 'Severe' || record.severity === 'Critical';
    return true;
  });

  const handleSelectTemplate = (template: PestTemplate) => {
    setName(template.name);
    setCategory(template.category);
    setSeverity(template.defaultSeverity);
    setActionsTaken(template.recommendedUgandaActions);
    setNotes(template.commonSymptoms);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addPestRecord(hive.id, {
      name: name.trim(),
      category,
      severity,
      dateObserved,
      actionsTaken: actionsTaken.trim() || 'Monitoring and standard colony sanitation applied.',
      status,
      loggedBy: user.name || hive.beekeeperName,
      notes: notes.trim() || undefined,
    });

    // Reset Form
    setName('');
    setActionsTaken('');
    setNotes('');
    setSeverity('Moderate');
    setStatus('Active');
    setIsAddingPest(false);
  };

  const handleToggleResolved = (record: PestDiseaseRecord) => {
    const isNowResolved = record.status !== 'Resolved';
    updatePestRecord(hive.id, record.id, {
      status: isNowResolved ? 'Resolved' : 'Active',
      resolvedDate: isNowResolved ? new Date().toISOString().split('T')[0] : undefined,
    });
  };

  return (
    <div className="space-y-4 pt-4 border-t border-[#F0EAE0] dark:border-[#2C241B]">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400">
              <Bug className="w-4 h-4" />
            </div>
            <h3 className="font-serif-title font-bold text-base text-[#2B2118] dark:text-[#EFEBE4]">
              Pests & Diseases Management
            </h3>
          </div>
          <p className="text-xs text-[#7A6A57] dark:text-[#A89C8C]">
            Log pest occurrences, disease symptoms, severity levels, and sanitation interventions.
          </p>
        </div>

        <button
          type="button"
          id="toggle-add-pest-btn"
          onClick={() => setIsAddingPest(!isAddingPest)}
          className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-500 shadow-xs touch-control shrink-0 ${
            isAddingPest
              ? 'bg-[#FAF7F2] hover:bg-[#F3ECE0] active:bg-[#EBE2D3] dark:bg-[#25201A] dark:hover:bg-[#302821] dark:active:bg-[#3A3128] text-[#2B2118] dark:text-[#EFEBE4] border border-[#DDD3C1] dark:border-[#383127]'
              : 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white dark:bg-rose-600 dark:hover:bg-rose-500 dark:active:bg-rose-700 shadow-sm'
          }`}
        >
          {isAddingPest ? (
            <span>Close Form</span>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Log Pest / Disease</span>
            </>
          )}
        </button>
      </div>

      {/* ALERT 1: Severe or Critical Active Threat Banner */}
      {severeThreat && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-amber-500/10 border-2 border-rose-500/60 dark:border-rose-500/50 space-y-2 animate-in fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0 mt-0.5 animate-pulse">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full bg-rose-600 text-white">
                    {severeThreat.severity} Alert
                  </span>
                  <h4 className="font-serif-title font-bold text-sm text-[#2B2118] dark:text-[#F8F5EF]">
                    Active Threat: {severeThreat.name}
                  </h4>
                </div>
                <p className="text-xs text-[#7A2A2A] dark:text-[#FCA5A5] leading-relaxed">
                  Observed on <strong>{severeThreat.dateObserved}</strong>. Imminent risk of colony
                  absconding, brood destruction, or apiary contamination.
                </p>
              </div>
            </div>

            <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 shrink-0">
              Immediate Action Required
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/80 dark:bg-[#16120E]/80 border border-rose-200 dark:border-rose-900/60 text-xs text-[#2B2118] dark:text-[#EFEBE4] flex items-start gap-2">
            <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-[#7A2A2A] dark:text-[#FCA5A5]">
                Actions Underway:
              </span>
              <p className="text-[#6B5E4F] dark:text-[#D1C7BA] mt-0.5">
                {severeThreat.actionsTaken}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ALERT 2: Recurring Outbreak Flag */}
      {activeRecurring.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/50 dark:border-amber-500/40 space-y-2">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-amber-600 text-white shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full bg-amber-600 text-white">
                  Recurring Outbreak Flag
                </span>
                <h4 className="font-serif-title font-bold text-sm text-[#2B2118] dark:text-[#F8F5EF]">
                  Multiple Outbreaks Detected ({activeRecurring[0].totalOccurrences}x Recorded)
                </h4>
              </div>
              <p className="text-xs text-[#8A5300] dark:text-[#FCD34D] mt-1 leading-relaxed">
                <strong>{activeRecurring[0].pestName}</strong> has repeatedly infected this hive.
                Recurring cycles suggest harborage in comb wax or local soil nests. Complete bottom
                board flame scorching or frame renewal recommended.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Log Pest / Disease Intake Form */}
      {isAddingPest && (
        <form
          onSubmit={handleFormSubmit}
          className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#191511] border border-[#DDD3C1] dark:border-[#383127] space-y-4 shadow-sm animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-[#EFE8D8] dark:border-[#2C241B] pb-2">
            <h4 className="font-serif-title font-bold text-sm text-[#2B2118] dark:text-[#EFEBE4] flex items-center gap-2">
              <Bug className="w-4 h-4 text-rose-600" />
              <span>Record Pest / Disease Incident</span>
            </h4>
            <span className="text-[11px] text-[#8C7A65]">Hive: {hive.name}</span>
          </div>

          {/* Common Uganda Quick Templates */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1.5">
              Quick Pick: Common Ugandan Threats
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_UGANDA_PESTS.slice(0, 6).map((tpl) => (
                <button
                  key={tpl.name}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl)}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white dark:bg-[#25201A] border border-[#DDD3C1] dark:border-[#383127] hover:border-[#D97706] hover:bg-amber-50 dark:hover:bg-amber-950/40 text-[#2B2118] dark:text-[#EFEBE4] transition-all active:scale-95"
                >
                  {tpl.name.split('(')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Form Grid 1: Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1">
                Pest or Disease Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Wax Moth, Small Hive Beetle, Safari Ants"
                className="w-full px-3 py-2 bg-white dark:bg-[#15120F] border border-[#DDD3C1] dark:border-[#383127] rounded-xl text-xs sm:text-sm text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <SheetSelect
              label="Classification Category *"
              value={category}
              onChange={(val) => setCategory(val as any)}
              options={[
                { value: 'Pest', label: 'Pest (Wax Moth, Hive Beetle)' },
                { value: 'Disease', label: 'Disease (Foulbrood, Chalkbrood)' },
                { value: 'Parasite', label: 'Parasite (Varroa Mites, Braula)' },
                { value: 'Predator', label: 'Predator (Safari Ants, Wasps)' },
                { value: 'Other', label: 'Other Environmental Threat' },
              ]}
            />
          </div>

          {/* Form Grid 2: Severity Selector & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1.5">
                Severity Level *
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Low', 'Moderate', 'Severe', 'Critical'] as PestSeverity[]).map((sev) => {
                  const isSelected = severity === sev;
                  return (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSeverity(sev)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                        isSelected
                          ? sev === 'Critical'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : sev === 'Severe'
                            ? 'bg-rose-500 text-white shadow-xs'
                            : sev === 'Moderate'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white dark:bg-[#25201A] border border-[#DDD3C1] dark:border-[#383127] text-[#6B5E4F] dark:text-[#A89C8C] hover:bg-[#F5EFE6]'
                      }`}
                    >
                      {sev}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1">
                Date Observed *
              </label>
              <input
                type="date"
                required
                value={dateObserved}
                onChange={(e) => setDateObserved(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#15120F] border border-[#DDD3C1] dark:border-[#383127] rounded-xl text-xs sm:text-sm text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Form Grid 3: Actions Taken */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1">
              Actions Taken & Treatment Applied *
            </label>
            <textarea
              required
              value={actionsTaken}
              onChange={(e) => setActionsTaken(e.target.value)}
              placeholder="e.g. Scraped bottom board, applied grease barrier on stand posts, installed oil traps, or requeened..."
              rows={2}
              className="w-full p-3 bg-white dark:bg-[#15120F] border border-[#DDD3C1] dark:border-[#383127] rounded-xl text-xs text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Form Grid 4: Status & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SheetSelect
              label="Current Threat Status *"
              value={status}
              onChange={(val) => setStatus(val as any)}
              options={[
                { value: 'Active', label: 'Active (Ongoing infestation)' },
                { value: 'Monitoring', label: 'Monitoring (Treatment applied, observing)' },
                { value: 'Resolved', label: 'Resolved (Cleared / Colony healthy)' },
              ]}
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1">
                Field Symptoms & Observations
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Webbing in corner bar, spotty brood, dead larvae..."
                className="w-full px-3 py-2 bg-white dark:bg-[#15120F] border border-[#DDD3C1] dark:border-[#383127] rounded-xl text-xs sm:text-sm text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Submit & Cancel Buttons with Responsive Color States */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddingPest(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#DDD3C1] dark:border-[#383127] bg-[#FAF7F2] hover:bg-[#F3ECE0] active:bg-[#EBE2D3] dark:bg-[#25201A] dark:hover:bg-[#302821] dark:active:bg-[#3A3128] text-[#2B2118] dark:text-[#EFEBE4] transition-all duration-150 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white dark:bg-rose-600 dark:hover:bg-rose-500 dark:active:bg-rose-700 shadow-sm transition-all duration-150 active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              Save Pest Log
            </button>
          </div>
        </form>
      )}

      {/* Filter Chips Bar */}
      {pestRecords.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[#8C7A65] dark:text-[#A89C8C] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Filter:
            </span>
            {[
              { id: 'all', label: `All (${pestRecords.length})` },
              { id: 'active', label: `Active / Monitoring (${pestRecords.filter((r) => r.status !== 'Resolved').length})` },
              { id: 'resolved', label: `Resolved (${pestRecords.filter((r) => r.status === 'Resolved').length})` },
              { id: 'severe', label: `Severe / Critical (${pestRecords.filter((r) => r.severity === 'Severe' || r.severity === 'Critical').length})` },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterStatus(f.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                  filterStatus === f.id
                    ? 'bg-rose-600 text-white dark:bg-rose-600'
                    : 'bg-[#FAF7F2] hover:bg-[#F3ECE0] dark:bg-[#25201A] dark:hover:bg-[#302821] text-[#6B5E4F] dark:text-[#A89C8C] border border-[#DDD3C1] dark:border-[#383127]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-[#8C7A65]">
            Showing {filteredRecords.length} record{filteredRecords.length === 1 ? '' : 's'}
          </span>
        </div>
      )}

      {/* Logged Records List */}
      {filteredRecords.length === 0 ? (
        <div className="p-6 text-center rounded-2xl bg-[#FAF7F2]/60 dark:bg-[#1A1612]/60 border border-[#EFE8D8] dark:border-[#2C241B] space-y-2">
          <ShieldAlert className="w-8 h-8 text-[#8C7A65]/50 mx-auto" />
          <h4 className="font-serif-title font-semibold text-sm text-[#2B2118] dark:text-[#EFEBE4]">
            No pests or diseases recorded {filterStatus !== 'all' ? 'for this filter' : 'for this hive yet'}
          </h4>
          <p className="text-xs text-[#8C7A65] max-w-sm mx-auto">
            Maintain regular inspections to catch wax moth, hive beetle, or varroa early.
          </p>
          {!isAddingPest && (
            <button
              type="button"
              onClick={() => setIsAddingPest(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-semibold transition-all active:scale-95 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Incident</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((record) => {
            const isResolved = record.status === 'Resolved';
            const isSevere = record.severity === 'Severe' || record.severity === 'Critical';

            // Check if this specific pest has occurred multiple times in this hive
            const recurringMatch = recurringOutbreaks.find(
              (o) => o.records.some((r) => r.id === record.id)
            );

            return (
              <div
                key={record.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isResolved
                    ? 'bg-[#FAF7F2]/50 dark:bg-[#1A1612]/50 border-[#EFE8D8] dark:border-[#2C241B] opacity-85'
                    : isSevere
                    ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900/60 shadow-xs'
                    : 'bg-white dark:bg-[#1C1814] border-[#E6DEC8] dark:border-[#383127]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-serif-title font-bold text-sm sm:text-base text-[#2B2118] dark:text-[#EFEBE4]">
                        {record.name}
                      </h4>

                      {/* Category Pill */}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FAF7F2] dark:bg-[#25201A] border border-[#DDD3C1] dark:border-[#383127] text-[#6B5E4F] dark:text-[#A89C8C]">
                        {record.category}
                      </span>

                      {/* Severity Pill */}
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          record.severity === 'Critical'
                            ? 'bg-rose-600 text-white'
                            : record.severity === 'Severe'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                            : record.severity === 'Moderate'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        }`}
                      >
                        {record.severity}
                      </span>

                      {/* Recurring Badge */}
                      {recurringMatch && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 flex items-center gap-1">
                          <RotateCcw className="w-2.5 h-2.5" />
                          Recurring ({recurringMatch.totalOccurrences}x)
                        </span>
                      )}

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          record.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : record.status === 'Monitoring'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {record.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#8C7A65] dark:text-[#A89C8C] flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Observed: {record.dateObserved}
                      </span>
                      {record.loggedBy && <span>• Logged by: {record.loggedBy}</span>}
                      {record.resolvedDate && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          • Resolved on: {record.resolvedDate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Buttons with Responsive Colors */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleResolved(record)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95 touch-control ${
                        isResolved
                          ? 'bg-[#FAF7F2] hover:bg-[#F3ECE0] active:bg-[#EBE2D3] dark:bg-[#25201A] dark:hover:bg-[#302821] text-[#6B5E4F] dark:text-[#A89C8C] border border-[#DDD3C1] dark:border-[#383127]'
                          : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-xs'
                      }`}
                    >
                      {isResolved ? (
                        <>
                          <RotateCcw className="w-3 h-3" />
                          <span>Reopen</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Mark Resolved</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove pest record "${record.name}"?`)) {
                          deletePestRecord(hive.id, record.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-[#8C7A65] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors active:scale-95"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Actions Taken Box */}
                <div className="mt-2.5 p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#17130F] border border-[#EFE8D8] dark:border-[#2C241B] text-xs">
                  <span className="font-semibold text-[#6B5E4F] dark:text-[#A89C8C] block text-[11px]">
                    Interventions & Treatments:
                  </span>
                  <p className="text-[#2B2118] dark:text-[#EFEBE4] mt-0.5 leading-relaxed">
                    {record.actionsTaken}
                  </p>
                </div>

                {record.notes && (
                  <p className="mt-1.5 text-xs text-[#7A6A57] dark:text-[#9E9080] italic px-1">
                    "{record.notes}"
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
