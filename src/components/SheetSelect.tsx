import React, { useState } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface SheetSelectProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const SheetSelect: React.FC<SheetSelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  required = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] mb-1.5"
        >
          {label} {required && <span className="text-amber-600">*</span>}
        </label>
      )}

      {/* Desktop Native Select (hidden on mobile) */}
      <div className="hidden md:block relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full appearance-none px-3.5 py-2.5 bg-white dark:bg-[#1C1814] border border-[#DDD3C1] dark:border-[#383127] rounded-lg text-sm text-[#2B2118] dark:text-[#EFEBE4] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 focus:border-[#D97706] transition-colors cursor-pointer"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-[#8C7A65] dark:text-[#A89C8C] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Mobile Drawer Trigger Button (hidden on desktop) */}
      <div className="md:hidden">
        <button
          type="button"
          id={id ? `${id}-mobile-btn` : undefined}
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white dark:bg-[#1C1814] border border-[#DDD3C1] dark:border-[#383127] rounded-lg text-sm text-left touch-control transition-colors active:bg-[#F3EEDF] dark:active:bg-[#25201A]"
        >
          <span className={selectedOption ? 'text-[#2B2118] dark:text-[#EFEBE4] font-medium' : 'text-[#8C7A65] dark:text-[#7A6E5F]'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-[#8C7A65] dark:text-[#A89C8C] shrink-0" />
        </button>

        {/* Mobile Bottom Action Sheet Drawer */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
              />

              {/* Bottom Sheet */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-[#FAF7F2] dark:bg-[#1C1814] rounded-t-2xl border-t border-[#E6DEC8] dark:border-[#383127] shadow-2xl max-h-[75vh] flex flex-col pb-[env(safe-area-inset-bottom)]"
              >
                {/* Drag / Pull Handle */}
                <div className="w-12 h-1.5 bg-[#DDD3C1] dark:bg-[#3E362C] rounded-full mx-auto mt-3 mb-2" />

                {/* Sheet Header */}
                <div className="px-5 py-2.5 flex items-center justify-between border-b border-[#EFE8D8] dark:border-[#2C251D]">
                  <h3 className="font-serif-title font-semibold text-base text-[#2B2118] dark:text-[#EFEBE4]">
                    {label || 'Select an Option'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-full text-[#8C7A65] hover:text-[#2B2118] dark:text-[#A89C8C] dark:hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Options List */}
                <div className="overflow-y-auto p-3 space-y-1 overscroll-contain flex-1">
                  {options.map((opt) => {
                    const isSelected = opt.value === value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelect(opt.value)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left touch-control transition-colors ${
                          isSelected
                            ? 'bg-[#E8A317]/15 dark:bg-[#E8A317]/20 border border-[#D97706]/40 text-[#8F4A00] dark:text-[#FBBF24] font-medium'
                            : 'hover:bg-[#EFE8D8]/60 dark:hover:bg-[#2A231C] text-[#2B2118] dark:text-[#EFEBE4]'
                        }`}
                      >
                        <div className="pr-4">
                          <div className="text-sm leading-snug">{opt.label}</div>
                          {opt.description && (
                            <div className="text-xs text-[#8C7A65] dark:text-[#A89C8C] mt-0.5">
                              {opt.description}
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-[#D97706] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
