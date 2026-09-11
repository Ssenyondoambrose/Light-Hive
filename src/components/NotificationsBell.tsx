import React, { useState, useRef, useEffect } from 'react';
import { Bell, AlertTriangle, Clock, CheckCircle, ChevronRight, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CheckupReminder } from '../types';

interface NotificationsBellProps {
  onSelectHive?: (hiveId: string) => void;
}

export const NotificationsBell: React.FC<NotificationsBellProps> = ({ onSelectHive }) => {
  const { user, reminders, markHiveInspected } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user.remindersEnabled) {
    return null;
  }

  const urgentAndDue = reminders.filter((r) => r.urgency === 'urgent' || r.urgency === 'due_soon');
  const count = urgentAndDue.length;

  const handleInspectClick = (e: React.MouseEvent, reminder: CheckupReminder) => {
    e.stopPropagation();
    markHiveInspected(reminder.hiveId, 'Routine inspection completed via reminder');
  };

  const handleHiveClick = (hiveId: string) => {
    setIsOpen(false);
    if (onSelectHive) {
      onSelectHive(hiveId);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        id="notifications-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-[#6B5E4F] dark:text-[#A89C8C] hover:text-[#2B2118] dark:hover:text-[#EFEBE4] hover:bg-[#F5EFE6] dark:hover:bg-[#25201A] transition-colors touch-control"
        title="Colony Checkup Reminders"
        aria-label="Colony Checkup Reminders"
      >
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#1C1814] animate-pulse">
            {count}
          </span>
        )}
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-[#FAF7F2] dark:bg-[#15120F] border-b border-[#EFE8D8] dark:border-[#2C251D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                <Bell className="w-4 h-4" />
              </div>
              <span className="font-serif-title font-semibold text-sm text-[#2B2118] dark:text-[#EFEBE4]">
                Checkup Reminders
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 font-medium">
                {count} due
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-[#8C7A65] hover:text-[#2B2118] dark:text-[#A89C8C] dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#F0EAE0] dark:divide-[#28221B]">
            {urgentAndDue.length === 0 ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-medium text-[#2B2118] dark:text-[#EFEBE4]">
                  All colonies are up to date!
                </p>
                <p className="text-xs text-[#8C7A65] dark:text-[#A89C8C]">
                  Colony inspection schedules are in good standing based on their strength and health.
                </p>
              </div>
            ) : (
              urgentAndDue.map((reminder) => {
                const isUrgent = reminder.urgency === 'urgent';
                return (
                  <div
                    key={reminder.hiveId}
                    onClick={() => handleHiveClick(reminder.hiveId)}
                    className="p-3.5 hover:bg-[#FAF7F2] dark:hover:bg-[#241F1A] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-sm text-[#2B2118] dark:text-[#EFEBE4] group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                            {reminder.hiveName}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              isUrgent
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            {isUrgent ? (
                              <AlertTriangle className="w-2.5 h-2.5" />
                            ) : (
                              <Clock className="w-2.5 h-2.5" />
                            )}
                            {reminder.dueDays <= 0
                              ? `Overdue (${Math.abs(reminder.dueDays)}d)`
                              : `Due in ${reminder.dueDays}d`}
                          </span>
                        </div>

                        <p className="text-xs text-[#7A6A57] dark:text-[#BDB1A3] leading-relaxed">
                          {reminder.reason}
                        </p>

                        <div className="flex items-center gap-2 text-[11px] text-[#9E8E7C] dark:text-[#8E8171]">
                          <span>Strength: <strong>{reminder.colonyStrength}</strong></span>
                          <span>•</span>
                          <span>Status: <strong>{reminder.healthStatus}</strong></span>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-[#C4B7A5] group-hover:text-amber-600 transition-colors shrink-0 mt-1" />
                    </div>

                    <div className="mt-2.5 flex items-center justify-between pt-1 border-t border-[#F5EFE6] dark:border-[#2C251D]">
                      <span className="text-[10px] text-[#8C7A65] dark:text-[#8E8171]">
                        Last: {reminder.lastInspected}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleInspectClick(e, reminder)}
                        className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 hover:underline"
                      >
                        Mark Inspected
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note on protocol */}
          <div className="px-4 py-2 bg-[#F6F1E7] dark:bg-[#13100D] border-t border-[#EFE8D8] dark:border-[#2C251D] text-[10px] text-[#8C7A65] dark:text-[#8E8171] flex items-center justify-between">
            <span>Protocol: Weak (3d), Moderate (7d), Strong (14d)</span>
          </div>
        </div>
      )}
    </div>
  );
};
