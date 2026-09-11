import React, { useState } from 'react';
import { AlertOctagon, X, Trash2, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose }) => {
  const { deleteAccount, user } = useApp();
  const [step, setStep] = useState<1 | 2>(1);
  const [confirmationInput, setConfirmationInput] = useState('');

  if (!isOpen) return null;

  const handleInitialConfirm = () => {
    setStep(2);
  };

  const handleFinalDelete = () => {
    deleteAccount();
    onClose();
    setStep(1);
    setConfirmationInput('');
  };

  const handleCancel = () => {
    onClose();
    setStep(1);
    setConfirmationInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1C1814] border border-[#E6DEC8] dark:border-[#383127] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#EFE8D8] dark:border-[#2C251D] flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-serif-title font-semibold text-base text-[#2B2118] dark:text-[#EFEBE4]">
              Delete Beekeeper Account
            </h3>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="p-1 rounded-md text-[#8C7A65] hover:text-[#2B2118] dark:text-[#A89C8C] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {step === 1 ? (
            <>
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-300 text-sm leading-relaxed">
                <p className="font-medium">Warning: This action cannot be undone.</p>
                <p className="text-xs mt-1 text-rose-700 dark:text-rose-400">
                  Deleting account <strong>{user.email}</strong> will erase all registered apiaries,
                  logged seasonal harvests, checkup reminders, and field surveys.
                </p>
              </div>

              <p className="text-sm text-[#6B5E4F] dark:text-[#A89C8C]">
                Are you certain you want to proceed with permanent account deletion?
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-[#DDD3C1] dark:border-[#383127] text-[#2B2118] dark:text-[#EFEBE4] hover:bg-[#F3EEDF] dark:hover:bg-[#2A231C]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleInitialConfirm}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors flex items-center gap-1.5"
                >
                  <AlertOctagon className="w-4 h-4" />
                  Continue to Deletion
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                  Double Confirmation Required (Step 2 of 2)
                </p>
                <p className="text-xs text-[#6B5E4F] dark:text-[#A89C8C]">
                  To verify, please type <span className="font-mono font-bold text-rose-700 dark:text-rose-300">DELETE</span> in the box below:
                </p>
                <input
                  type="text"
                  value={confirmationInput}
                  onChange={(e) => setConfirmationInput(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-3.5 py-2 rounded-lg border border-rose-300 dark:border-rose-900/60 bg-white dark:bg-[#15120F] text-sm text-[#2B2118] dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-[#DDD3C1] dark:border-[#383127] text-[#2B2118] dark:text-[#EFEBE4] hover:bg-[#F3EEDF] dark:hover:bg-[#2A231C]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinalDelete}
                  disabled={confirmationInput.trim().toUpperCase() !== 'DELETE'}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-rose-600 disabled:opacity-50 text-white hover:bg-rose-700 transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  Permanently Delete Account
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
