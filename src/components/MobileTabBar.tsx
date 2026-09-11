import React from 'react';
import { Hexagon, Sparkles, ClipboardCheck, Settings, Home } from 'lucide-react';
import { useApp } from '../context/AppContext';

export type ActiveTab = 'dashboard' | 'hives' | 'harvests' | 'survey' | 'settings';

interface MobileTabBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({ activeTab, onSelectTab }) => {
  const { urgentRemindersCount } = useApp();

  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Home', icon: Home },
    { id: 'hives' as ActiveTab, label: 'Hives', icon: Hexagon, badge: urgentRemindersCount },
    { id: 'harvests' as ActiveTab, label: 'Harvests', icon: Sparkles },
    { id: 'survey' as ActiveTab, label: 'Survey', icon: ClipboardCheck },
    { id: 'settings' as ActiveTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav
      id="mobile-bottom-tab-bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1A1612]/95 backdrop-blur-md border-t border-[#E6DEC8] dark:border-[#332A20] shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              id={`mobile-tab-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all touch-control ${
                isActive
                  ? 'text-[#D97706] font-semibold'
                  : 'text-[#8C7A65] dark:text-[#A89C8C] hover:text-[#2B2118] dark:hover:text-[#EFEBE4]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-amber-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#1A1612]">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-1 whitespace-nowrap">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-[#D97706] rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
