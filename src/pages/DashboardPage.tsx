import React from 'react';
import {
  Hexagon,
  Sparkles,
  ClipboardCheck,
  AlertTriangle,
  ArrowRight,
  Plus,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCurrentUgandaSeason } from '../data/mockData';
import { ReportingSection } from '../components/ReportingSection';
import { ActiveTab } from '../components/MobileTabBar';
import { BringLightLogo } from '../components/BringLightLogo';

interface DashboardPageProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenNewHiveModal: () => void;
  onOpenNewHarvestModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenNewHiveModal,
  onOpenNewHarvestModal,
}) => {
  const { hives, harvests, reminders, getGreeting, setSelectedHiveId, markHiveInspected } = useApp();
  const currentSeason = getCurrentUgandaSeason();

  // Metrics
  const totalHives = hives.length;
  const totalYieldKg = harvests.reduce((acc, h) => acc + h.quantityKg, 0).toFixed(1);
  const urgentReminders = reminders.filter((r) => r.urgency === 'urgent' || r.urgency === 'due_soon');
  const healthyColonies = hives.filter((h) => h.healthStatus === 'Healthy' || h.healthStatus === 'Active Queen').length;

  const handleHiveClick = (hiveId: string) => {
    setSelectedHiveId(hiveId);
    onNavigate('hives');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-250">
      {/* Editorial Dark Honey Hero Banner with Circular Framed Image */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2D2115] via-[#3A2A19] to-[#1E160D] text-[#FAF7F2] p-6 sm:p-8 md:p-10 shadow-lg border border-[#483724]">
        {/* Honeycomb pattern subtle overlay */}
        <div className="absolute inset-0 honeycomb-pattern pointer-events-none opacity-15" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          {/* Left Text Column */}
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D97706]/20 border border-[#D97706]/40 text-[#FBBF24] text-xs font-semibold tracking-wide">
              <Calendar className="w-3.5 h-3.5" />
              <span>Uganda Season: {currentSeason.name}</span>
            </div>

            <h1 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FDFBF7] leading-[1.15]">
              {getGreeting()}.
            </h1>

            <p className="text-sm sm:text-base text-[#D4C6B5] leading-relaxed max-w-xl">
              Welcome to Light Hive. Track your apiary colony strength, schedule timely
              disease & pest checkups, and record honey extraction across Uganda's seasonal cycles.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                id="hero-register-hive-btn"
                onClick={onOpenNewHiveModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-150 active:scale-95 touch-control focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <Plus className="w-4 h-4" />
                Register New Hive
              </button>

              <button
                type="button"
                id="hero-log-harvest-btn"
                onClick={onOpenNewHarvestModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-[#FAF7F2] text-sm font-medium border border-white/20 backdrop-blur-xs transition-all duration-150 active:scale-95 touch-control"
              >
                <Sparkles className="w-4 h-4 text-[#FBBF24]" />
                Log Seasonal Harvest
              </button>

              <button
                type="button"
                id="hero-survey-btn"
                onClick={() => onNavigate('survey')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 active:bg-white/25 text-[#E0D4C5] text-sm font-medium border border-transparent hover:border-white/10 transition-all duration-150 active:scale-95 touch-control"
              >
                <ClipboardCheck className="w-4 h-4 text-emerald-400" />
                Take Beekeeper Survey
              </button>
            </div>
          </div>

          {/* Right Circular Framed Visual Image */}
          <div className="shrink-0 flex items-center justify-center">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full p-2 bg-gradient-to-tr from-[#D97706] via-[#F59E0B] to-[#FFE8B3] shadow-2xl">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#2D2115] relative group">
                <img
                  src="https://images.unsplash.com/photo-1473081556163-2a17de81fc97?w=600&auto=format&fit=crop&q=80"
                  alt="Beekeeper Honeycomb Apiary"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#FDE68A] drop-shadow-md">
                    Sun & Honey
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Circular Feature Cards (Hives, Harvests, Survey, Checkup Reminders) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Hives */}
        <button
          type="button"
          id="feature-card-hives"
          onClick={() => onNavigate('hives')}
          className="p-5 rounded-2xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] hover:border-[#D97706] dark:hover:border-[#D97706] transition-all text-left group shadow-xs hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Hexagon className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase font-semibold tracking-wider text-[#8C7A65] dark:text-[#A89C8C] block">
            Apiary Registry
          </span>
          <h3 className="font-serif-title font-bold text-lg text-[#2B2118] dark:text-[#EFEBE4]">
            {totalHives} Active Hives
          </h3>
          <p className="text-xs text-[#7A6A57] dark:text-[#9E9080] mt-1 line-clamp-2">
            Colony strength, frames & inspections.
          </p>
          <div className="mt-3 inline-flex items-center text-xs font-semibold text-[#D97706] gap-1 group-hover:translate-x-1 transition-transform">
            <span>Manage Hives</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Card 2: Harvests */}
        <button
          type="button"
          id="feature-card-harvests"
          onClick={() => onNavigate('harvests')}
          className="p-5 rounded-2xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] hover:border-[#D97706] dark:hover:border-[#D97706] transition-all text-left group shadow-xs hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase font-semibold tracking-wider text-[#8C7A65] dark:text-[#A89C8C] block">
            Uganda Seasons
          </span>
          <h3 className="font-serif-title font-bold text-lg text-[#2B2118] dark:text-[#EFEBE4]">
            {totalYieldKg} kg Harvest
          </h3>
          <p className="text-xs text-[#7A6A57] dark:text-[#9E9080] mt-1 line-clamp-2">
            Long Rains & Dry Season logs.
          </p>
          <div className="mt-3 inline-flex items-center text-xs font-semibold text-[#D97706] gap-1 group-hover:translate-x-1 transition-transform">
            <span>View Harvests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Card 3: Survey */}
        <button
          type="button"
          id="feature-card-survey"
          onClick={() => onNavigate('survey')}
          className="p-5 rounded-2xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] hover:border-emerald-600 dark:hover:border-emerald-500 transition-all text-left group shadow-xs hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase font-semibold tracking-wider text-[#8C7A65] dark:text-[#A89C8C] block">
            Field Data Intake
          </span>
          <h3 className="font-serif-title font-bold text-lg text-[#2B2118] dark:text-[#EFEBE4]">
            Beekeeper Survey
          </h3>
          <p className="text-xs text-[#7A6A57] dark:text-[#9E9080] mt-1 line-clamp-2">
            Acquire hive stats & floral flora.
          </p>
          <div className="mt-3 inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 gap-1 group-hover:translate-x-1 transition-transform">
            <span>Start Survey</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Card 4: Checkup Reminders */}
        <button
          type="button"
          id="feature-card-reminders"
          onClick={() => onNavigate('hives')}
          className="p-5 rounded-2xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] hover:border-rose-500 dark:hover:border-rose-500 transition-all text-left group shadow-xs hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase font-semibold tracking-wider text-[#8C7A65] dark:text-[#A89C8C] block">
            Health Alert Engine
          </span>
          <h3 className="font-serif-title font-bold text-lg text-[#2B2118] dark:text-[#EFEBE4]">
            {urgentReminders.length} Due Checkups
          </h3>
          <p className="text-xs text-[#7A6A57] dark:text-[#9E9080] mt-1 line-clamp-2">
            Automated by colony strength & disease.
          </p>
          <div className="mt-3 inline-flex items-center text-xs font-semibold text-rose-600 dark:text-rose-400 gap-1 group-hover:translate-x-1 transition-transform">
            <span>Review Health</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

      {/* Serif Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#F4EDE0] dark:bg-[#1B1713] border border-[#E6DEC8] dark:border-[#2E271F]">
        <div className="space-y-1">
          <span className="text-xs uppercase font-semibold text-[#8C7A65] dark:text-[#9E9080] tracking-wider">
            Total Apiaries
          </span>
          <div className="font-serif-title text-2xl sm:text-3xl font-bold text-[#2B2118] dark:text-[#EFEBE4]">
            {new Set(hives.map((h) => h.region)).size} Regions
          </div>
          <p className="text-[11px] text-[#7A6A57] dark:text-[#A89C8C]">Across Uganda zones</p>
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase font-semibold text-[#8C7A65] dark:text-[#9E9080] tracking-wider">
            Vigorous Colonies
          </span>
          <div className="font-serif-title text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400">
            {healthyColonies} of {totalHives}
          </div>
          <p className="text-[11px] text-[#7A6A57] dark:text-[#A89C8C]">Active queen & high stores</p>
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase font-semibold text-[#8C7A65] dark:text-[#9E9080] tracking-wider">
            Seasonal Yield
          </span>
          <div className="font-serif-title text-2xl sm:text-3xl font-bold text-[#D97706] dark:text-[#F59E0B]">
            {totalYieldKg} kg
          </div>
          <p className="text-[11px] text-[#7A6A57] dark:text-[#A89C8C]">Avg. 23.6 kg per hive</p>
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase font-semibold text-[#8C7A65] dark:text-[#9E9080] tracking-wider">
            Current Weather
          </span>
          <div className="font-serif-title text-xl sm:text-2xl font-bold text-[#2B2118] dark:text-[#EFEBE4] truncate">
            {currentSeason.range}
          </div>
          <p className="text-[11px] text-[#7A6A57] dark:text-[#A89C8C] truncate">{currentSeason.description}</p>
        </div>
      </div>

      {/* Checkup Reminders Section (Live Action List) */}
      {urgentReminders.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-[#1E1812] border border-amber-200 dark:border-amber-900/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-600 text-white">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-title font-bold text-base text-[#2B2118] dark:text-[#EFEBE4]">
                  Colony Health Inspection Due ({urgentReminders.length})
                </h3>
                <p className="text-xs text-[#7A6A57] dark:text-[#A89C8C]">
                  Priority checkups calculated from colony vigor & health conditions
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('hives')}
              className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline hidden sm:block"
            >
              View all hives →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {urgentReminders.slice(0, 3).map((reminder) => (
              <div
                key={reminder.hiveId}
                onClick={() => handleHiveClick(reminder.hiveId)}
                className="p-3.5 rounded-xl bg-white dark:bg-[#16120E] border border-amber-200 dark:border-amber-900/40 hover:shadow-md transition-shadow cursor-pointer space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-serif-title font-semibold text-sm text-[#2B2118] dark:text-[#EFEBE4]">
                      {reminder.hiveName}
                    </h4>
                    <span className="text-[11px] text-[#8C7A65] dark:text-[#9E9080] flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {reminder.apiaryLocation}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      reminder.urgency === 'urgent'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {reminder.dueDays <= 0 ? `Overdue ${Math.abs(reminder.dueDays)}d` : `Due in ${reminder.dueDays}d`}
                  </span>
                </div>

                <p className="text-xs text-[#6B5E4F] dark:text-[#A89C8C] leading-snug">
                  {reminder.reason}
                </p>

                <div className="pt-2 border-t border-[#F0EAE0] dark:border-[#2C241B] flex items-center justify-between">
                  <span className="text-[10px] text-[#8C7A65]">
                    Last: {reminder.lastInspected}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      markHiveInspected(reminder.hiveId);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-700 hover:text-emerald-800 active:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50 dark:active:bg-emerald-800/50 transition-all duration-150 active:scale-95 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Mark Checked
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reporting Section (Visualizations of Honey Yield by Season & Cumulative Growth) */}
      <ReportingSection />

      {/* Recent Hives & Recent Harvests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registered Hives */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-title font-bold text-base text-[#2B2118] dark:text-[#EFEBE4] flex items-center gap-2">
              <Hexagon className="w-4 h-4 text-[#D97706]" />
              Apiary Registry Overview
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('hives')}
              className="text-xs font-semibold text-[#D97706] hover:underline"
            >
              All Hives ({hives.length}) →
            </button>
          </div>

          <div className="divide-y divide-[#F0EAE0] dark:divide-[#2A231C]">
            {hives.slice(0, 4).map((hive) => (
              <div
                key={hive.id}
                onClick={() => handleHiveClick(hive.id)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-[#FAF7F2] dark:hover:bg-[#25201A] px-2 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-100 dark:bg-amber-950/50 shrink-0 border border-[#D97706]/40">
                    {hive.beekeeperPhotoUrl ? (
                      <img
                        src={hive.beekeeperPhotoUrl}
                        alt={hive.beekeeperName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-xs">
                        {hive.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-serif-title font-semibold text-sm text-[#2B2118] dark:text-[#EFEBE4]">
                      {hive.name}
                    </h4>
                    <p className="text-xs text-[#8C7A65] dark:text-[#A89C8C] truncate max-w-[180px] sm:max-w-xs">
                      {hive.apiaryLocation}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      hive.colonyStrength === 'Strong'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : hive.colonyStrength === 'Moderate'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {hive.colonyStrength}
                  </span>
                  <div className="text-[10px] text-[#8C7A65] mt-0.5">
                    {hive.framesCount} frames
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Harvest Records */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-title font-bold text-base text-[#2B2118] dark:text-[#EFEBE4] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D97706]" />
              Recent Seasonal Harvests
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('harvests')}
              className="text-xs font-semibold text-[#D97706] hover:underline"
            >
              All Harvests ({harvests.length}) →
            </button>
          </div>

          <div className="divide-y divide-[#F0EAE0] dark:divide-[#2A231C]">
            {harvests.slice(0, 4).map((harvest) => (
              <div
                key={harvest.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-[#FAF7F2] dark:hover:bg-[#25201A] px-2 rounded-xl transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif-title font-semibold text-sm text-[#2B2118] dark:text-[#EFEBE4]">
                      {harvest.honeyType} Honey
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF7F2] dark:bg-[#25201A] border border-[#DDD3C1] dark:border-[#383127] text-[#8C7A65] dark:text-[#A89C8C]">
                      {harvest.season}
                    </span>
                  </div>
                  <p className="text-xs text-[#8C7A65] dark:text-[#A89C8C] mt-0.5">
                    From {harvest.hiveName} • Signed by {harvest.beekeeperSignatory}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-serif-title font-bold text-base text-[#D97706] dark:text-[#F59E0B]">
                    {harvest.quantityKg} kg
                  </span>
                  <div className="text-[10px] text-[#8C7A65]">
                    {harvest.moisturePercent}% moisture
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
