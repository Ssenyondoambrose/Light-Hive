import React, { useState } from 'react';
import {
  Settings,
  User,
  Sun,
  Moon,
  Laptop,
  Bell,
  Trash2,
  Download,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Globe,
  Gauge,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { DeleteAccountModal } from '../components/DeleteAccountModal';
import { SheetSelect } from '../components/SheetSelect';
import { BringLightLogo } from '../components/BringLightLogo';

export const SettingsPage: React.FC = () => {
  const { user, updateUser, getGreeting, hives, harvests, surveys } = useApp();
  const { theme, setTheme } = useTheme();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(user.gender);
  const [region, setRegion] = useState(user.region);

  // App notification switches
  const [checkupAlerts, setCheckupAlerts] = useState(true);
  const [seasonalWeatherReminders, setSeasonalWeatherReminders] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: name.trim(),
      email: email.trim(),
      gender,
      region,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      user,
      hives,
      harvests,
      surveys,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `the-light-hive-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (confirm('Reset all apiary data to initial Uganda demonstration sample data?')) {
      localStorage.removeItem('tlh_hives_v1');
      localStorage.removeItem('tlh_harvests_v1');
      localStorage.removeItem('tlh_surveys_v1');
      localStorage.removeItem('tlh_user_v1');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Editorial Page Header */}
      <div className="relative overflow-hidden rounded-3xl bg-[#2C2014] text-[#FAF7F2] p-6 sm:p-8 border border-[#423120] shadow-md">
        <div className="absolute inset-0 honeycomb-pattern pointer-events-none opacity-10" />

        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2 text-xs uppercase font-semibold text-[#D97706] tracking-wider">
            <Settings className="w-4 h-4" />
            <span>App Preferences & Customizations</span>
          </div>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-bold tracking-tight">
            Settings & Beekeeper Profile
          </h1>
          <p className="text-xs sm:text-sm text-[#CFC2B0] max-w-xl">
            Configure greeting honorifics (Sir / Madam), theme appearance, automated checkup
            reminder alerts, and apiary data backups.
          </p>
        </div>
      </div>

      {/* Profile & Greeting Customization Card */}
      <div className="rounded-3xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#F0EAE0] dark:border-[#2C241B] pb-4">
          <div>
            <h2 className="font-serif-title text-lg font-bold text-[#2B2118] dark:text-[#EFEBE4]">
              Beekeeper Identity & Greeting Honorific
            </h2>
            <p className="text-xs text-[#8C7A65] dark:text-[#A89C8C]">
              Greetings customize automatically to "Sir" (Male) or "Madam" (Female).
            </p>
          </div>
          <div className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-semibold">
            Active: {getGreeting()}
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#15120F] border border-[#DDD3C1] dark:border-[#383127] rounded-xl text-sm text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#15120F] border border-[#DDD3C1] dark:border-[#383127] rounded-xl text-sm text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gender / Honorific Selector */}
            <SheetSelect
              label="Honorific & Gender Preference *"
              value={gender}
              onChange={(val) => setGender(val as any)}
              options={[
                { value: 'male', label: 'Male (Greeting: "Sir")' },
                { value: 'female', label: 'Female (Greeting: "Madam")' },
                { value: 'other', label: 'Prefer not to say (Greeting: "Beekeeper")' },
              ]}
            />

            <SheetSelect
              label="Home Apiary Region"
              value={region}
              onChange={setRegion}
              options={[
                { value: 'Central (Masaka)', label: 'Central (Masaka)' },
                { value: 'Central (Luweero)', label: 'Central (Luweero)' },
                { value: 'Western (Kasese)', label: 'Western (Kasese)' },
                { value: 'Western (Bushenyi)', label: 'Western (Bushenyi)' },
                { value: 'Northern (Arua)', label: 'Northern (Arua)' },
                { value: 'Eastern (Soroti)', label: 'Eastern (Soroti)' },
              ]}
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            {savedSuccess ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                Profile updated successfully!
              </span>
            ) : (
              <div />
            )}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Save Profile Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Appearance & Theme Mode */}
      <div className="rounded-3xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] shadow-xs p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="font-serif-title text-lg font-bold text-[#2B2118] dark:text-[#EFEBE4]">
            Visual Theme & Color Mode
          </h2>
          <p className="text-xs text-[#8C7A65] dark:text-[#A89C8C]">
            Select light mode for daytime field work or dark honey mode for low-light recording.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-center transition-all ${
              theme === 'light'
                ? 'bg-amber-500/15 border-[#D97706] text-[#92400E] dark:text-[#FBBF24] ring-2 ring-[#D97706]'
                : 'bg-[#FAF7F2] dark:bg-[#15120F] border-[#DDD3C1] dark:border-[#383127] text-[#6B5E4F] dark:text-[#A89C8C]'
            }`}
          >
            <Sun className="w-6 h-6 mx-auto mb-2 text-amber-500" />
            <span className="text-xs font-semibold block">Light Mode</span>
            <span className="text-[10px] text-[#8C7A65]">Clean daytime</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-center transition-all ${
              theme === 'dark'
                ? 'bg-amber-500/15 border-[#D97706] text-[#92400E] dark:text-[#FBBF24] ring-2 ring-[#D97706]'
                : 'bg-[#FAF7F2] dark:bg-[#15120F] border-[#DDD3C1] dark:border-[#383127] text-[#6B5E4F] dark:text-[#A89C8C]'
            }`}
          >
            <Moon className="w-6 h-6 mx-auto mb-2 text-amber-400" />
            <span className="text-xs font-semibold block">Dark Honey</span>
            <span className="text-[10px] text-[#8C7A65]">Warm night canvas</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-4 rounded-2xl border text-center transition-all ${
              theme === 'system'
                ? 'bg-amber-500/15 border-[#D97706] text-[#92400E] dark:text-[#FBBF24] ring-2 ring-[#D97706]'
                : 'bg-[#FAF7F2] dark:bg-[#15120F] border-[#DDD3C1] dark:border-[#383127] text-[#6B5E4F] dark:text-[#A89C8C]'
            }`}
          >
            <Laptop className="w-6 h-6 mx-auto mb-2 text-[#8C7A65]" />
            <span className="text-xs font-semibold block">System Match</span>
            <span className="text-[10px] text-[#8C7A65]">Auto OS sync</span>
          </button>
        </div>
      </div>

      {/* Checkup Reminders & Notification Toggles */}
      <div className="rounded-3xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] shadow-xs p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="font-serif-title text-lg font-bold text-[#2B2118] dark:text-[#EFEBE4]">
            Inspection & Checkup Notifications
          </h2>
          <p className="text-xs text-[#8C7A65] dark:text-[#A89C8C]">
            Configure automated scheduling triggers for weak colonies and disease warnings.
          </p>
        </div>

        <div className="divide-y divide-[#F0EAE0] dark:divide-[#2C241B]">
          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#2B2118] dark:text-[#EFEBE4] block">
                Colony Vigor Dynamic Schedules
              </span>
              <span className="text-[11px] text-[#8C7A65] dark:text-[#A89C8C]">
                Automatically remind every 3 days (Weak), 7 days (Moderate), or 14 days (Strong).
              </span>
            </div>
            <input
              type="checkbox"
              checked={checkupAlerts}
              onChange={(e) => setCheckupAlerts(e.target.checked)}
              className="h-4 w-4 rounded text-amber-600 focus:ring-amber-500 border-gray-300"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#2B2118] dark:text-[#EFEBE4] block">
                Uganda Weather & Seasonal Harvest Alerts
              </span>
              <span className="text-[11px] text-[#8C7A65] dark:text-[#A89C8C]">
                Prompts when entering Long Rains or Dry Season extraction peaks.
              </span>
            </div>
            <input
              type="checkbox"
              checked={seasonalWeatherReminders}
              onChange={(e) => setSeasonalWeatherReminders(e.target.checked)}
              className="h-4 w-4 rounded text-amber-600 focus:ring-amber-500 border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Data Management & Account Danger Zone */}
      <div className="rounded-3xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] shadow-xs p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="font-serif-title text-lg font-bold text-[#2B2118] dark:text-[#EFEBE4]">
            Data Management & Account
          </h2>
          <p className="text-xs text-[#8C7A65] dark:text-[#A89C8C]">
            Export your apiary registry records, restore factory defaults, or delete your account.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#DDD3C1] dark:border-[#383127] text-xs font-semibold text-[#2B2118] dark:text-[#EFEBE4] hover:bg-[#FAF7F2] dark:hover:bg-[#25201A] transition-colors"
          >
            <Download className="w-4 h-4 text-[#D97706]" />
            Export Registry JSON
          </button>

          <button
            type="button"
            onClick={handleResetData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#DDD3C1] dark:border-[#383127] text-xs font-semibold text-[#2B2118] dark:text-[#EFEBE4] hover:bg-[#FAF7F2] dark:hover:bg-[#25201A] transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-[#8C7A65]" />
            Reset Sample Data
          </button>

          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      </div>

      {/* About Light Hive */}
      <div className="rounded-3xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] shadow-xs p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="p-3 rounded-2xl bg-black dark:bg-black/80 border border-[#E6DEC8] dark:border-[#383127] shrink-0 shadow-md">
          <BringLightLogo className="w-16 h-15" />
        </div>
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-serif-title text-base font-bold text-[#2B2118] dark:text-[#EFEBE4]">
              Light Hive
            </h3>
            <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider">
              Uganda Apiary Registry
            </span>
          </div>
          <p className="text-xs text-[#6B5E4F] dark:text-[#A89C8C] leading-relaxed">
            Light Hive is an apiculture empowerment platform in Uganda. Supporting rural beekeepers with modern hive tracking, pest diagnostics, harvest logging, and field survey analytics.
          </p>
          <div className="pt-1 text-[11px] text-[#8C7A65] dark:text-[#7A6A56]">
            Version 2.4.0 • Uganda Apiary Registry • Clean Energy & Sustainable Agriculture
          </div>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};
