import React, { useRef } from 'react';
import { Camera, UploadCloud, X, User } from 'lucide-react';

interface PhotoUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  label?: string;
}

const SAMPLE_AVATARS = [
  { label: 'Emmanuel', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { label: 'Grace', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { label: 'Paul', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { label: 'Sarah', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
];

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  value,
  onChange,
  onRemove,
  label = 'Beekeeper Profile Photo',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use FileReader to convert to data URL for local display & storage
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onChange(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C]">
        {label}
      </label>

      <div className="flex items-center gap-4">
        {/* Photo Preview Circle */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#D97706]/40 dark:border-[#D97706]/60 bg-[#EFE8DC] dark:bg-[#2A231C] shrink-0 shadow-inner">
          {value ? (
            <img
              src={value}
              alt="Beekeeper"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#8C7A65] dark:text-[#7A6E5F]">
              <User className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-1.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1C1814] border border-[#DDD3C1] dark:border-[#383127] text-xs font-medium text-[#2B2118] dark:text-[#EFEBE4] hover:bg-[#F3EEDF] dark:hover:bg-[#2B231B] transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-[#D97706]" />
              Upload Photo
            </button>

            {value && (
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Remove
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#8C7A65] dark:text-[#A89C8C]">
            <span>Or quick select:</span>
            {SAMPLE_AVATARS.map((avatar) => (
              <button
                key={avatar.label}
                type="button"
                onClick={() => onChange(avatar.url)}
                className="underline hover:text-[#D97706] dark:hover:text-[#FBBF24]"
              >
                {avatar.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
