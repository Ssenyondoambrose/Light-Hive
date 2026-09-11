import React, { useState } from 'react';
import {
  Hexagon,
  Sparkles,
  ClipboardCheck,
  Settings,
  Search,
  User,
  Sun,
  Moon,
  ChevronDown,
  Trash2,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveTab, MobileTabBar } from './MobileTabBar';
import { NotificationsBell } from './NotificationsBell';
import { DeleteAccountModal } from './DeleteAccountModal';
import { BringLightLogo } from './BringLightLogo';

interface LayoutProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ activeTab, onSelectTab, children }) => {
  const { user, searchQuery, setSearchQuery, getGreeting, setSelectedHiveId } = useApp();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Top navigation items on desktop (Dashboard tab removed as requested in history, logo links home)
  const navItems = [
    { id: 'hives' as ActiveTab, label: 'Hives', icon: Hexagon },
    { id: 'harvests' as ActiveTab, label: 'Harvests', icon: Sparkles },
    { id: 'survey' as ActiveTab, label: 'Survey', icon: ClipboardCheck },
  ];

  const handleLogoClick = () => {
    onSelectTab('dashboard');
    setSelectedHiveId(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#15120F] text-[#2B2118] dark:text-[#EFEBE4] flex flex-col pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+4.5rem)] md:pb-[env(safe-area-inset-bottom)] transition-colors duration-200">
      {/* Top Navigation Bar - Solid, opaque background so page colors do not collide */}
      <header
        id="top-nav-header"
        className="sticky top-0 z-30 w-full bg-white dark:bg-[#1A1612] border-b border-[#E6DEC8] dark:border-[#2C241B] shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              id="app-brand-logo-btn"
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 text-left group touch-control"
            >
              {/* Official Bring Light App Logo */}
              <BringLightLogo className="w-10 h-9.5 group-hover:scale-105 transition-transform shrink-0" />

              <div>
                <span className="font-serif-title font-bold text-base sm:text-lg text-[#2B2118] dark:text-[#F8F5EF] tracking-tight block leading-tight">
                  Light Hive
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-semibold tracking-widest text-[#B45309] dark:text-[#FBBF24] block leading-tight">
                  Uganda Apiary Registry
                </span>
              </div>
            </button>

            {/* Desktop Horizontal Nav Links */}
            <nav className="hidden md:flex items-center gap-1.5 ml-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    id={`desktop-nav-${item.id}`}
                    onClick={() => {
                      onSelectTab(item.id);
                      setSelectedHiveId(null);
                    }}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all touch-control ${
                      isActive
                        ? 'bg-[#E8A317]/15 dark:bg-[#E8A317]/25 text-[#92400E] dark:text-[#FBBF24] font-semibold'
                        : 'text-[#6B5E4F] dark:text-[#A89C8C] hover:text-[#2B2118] dark:hover:text-white hover:bg-[#FAF7F2] dark:hover:bg-[#25201A]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Center / Right: Search & Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Search Pill */}
            <div className="relative w-36 sm:w-56 md:w-64">
              <input
                type="text"
                id="global-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hives, regions..."
                className="w-full pl-9 pr-3 py-1.5 rounded-full text-xs bg-[#FAF7F2] dark:bg-[#241F1A] border border-[#DDD3C1] dark:border-[#383127] text-[#2B2118] dark:text-[#EFEBE4] placeholder:text-[#9C8C78] focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-[#8C7A65] dark:text-[#A89C8C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Colony Checkup Notifications Bell */}
            <NotificationsBell
              onSelectHive={(hiveId) => {
                onSelectTab('hives');
                setSelectedHiveId(hiveId);
              }}
            />

            {/* Direct Settings Gear Button */}
            <button
              type="button"
              id="settings-gear-btn"
              onClick={() => onSelectTab('settings')}
              className={`p-2 rounded-lg text-[#6B5E4F] dark:text-[#A89C8C] hover:text-[#2B2118] dark:hover:text-[#EFEBE4] hover:bg-[#F5EFE6] dark:hover:bg-[#25201A] transition-colors touch-control ${
                activeTab === 'settings' ? 'bg-[#E8A317]/15 text-[#92400E] dark:text-[#FBBF24]' : ''
              }`}
              title="App Settings & Preferences"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Profile Greeting & Dropdown */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                id="user-profile-menu-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-full border border-[#DDD3C1] dark:border-[#383127] bg-[#FAF7F2] dark:bg-[#241F1A] hover:bg-[#F3EEDF] dark:hover:bg-[#2C251F] transition-colors text-xs touch-control"
              >
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[11px]">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left pr-1 hidden lg:block">
                  <span className="text-[10px] text-[#8C7A65] dark:text-[#A89C8C] block leading-none">
                    {getGreeting()}
                  </span>
                  <span className="font-semibold text-[#2B2118] dark:text-[#EFEBE4] text-[11px] truncate max-w-[100px] block">
                    {user.name.split(' ')[0]}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#8C7A65] dark:text-[#A89C8C]" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] shadow-xl z-50 py-1 text-xs divide-y divide-[#F0EAE0] dark:divide-[#28221B]">
                  <div className="px-4 py-2.5">
                    <p className="font-medium text-[#2B2118] dark:text-[#EFEBE4] truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-[#8C7A65] dark:text-[#A89C8C] truncate">
                      {user.email}
                    </p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 font-medium text-[10px]">
                      {getGreeting()}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTab('settings');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#FAF7F2] dark:hover:bg-[#25201A] flex items-center gap-2 text-[#2B2118] dark:text-[#EFEBE4]"
                    >
                      <Settings className="w-3.5 h-3.5 text-[#8C7A65]" />
                      Preferences & Theme
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTab('survey');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#FAF7F2] dark:hover:bg-[#25201A] flex items-center gap-2 text-[#2B2118] dark:text-[#EFEBE4]"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5 text-[#8C7A65]" />
                      Beekeeper Survey Intake
                    </button>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setDeleteModalOpen(true);
                      }}
                      className="w-full text-left px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - Native body scrolling with clean full width container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Mobile Bottom Tab Bar for screens under 768px */}
      <MobileTabBar activeTab={activeTab} onSelectTab={onSelectTab} />

      {/* Account Deletion Double Confirmation Modal */}
      <DeleteAccountModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};
