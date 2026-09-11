import React, { useState } from 'react';
import { MapPin, Navigation, Compass, CheckCircle2 } from 'lucide-react';

interface Coordinates {
  lat: number;
  lng: number;
}

interface MapLocationPickerProps {
  coordinates: Coordinates;
  onChange: (coords: Coordinates, addressHint?: string) => void;
  defaultLocationName?: string;
}

// Uganda geographical bounds approx: Lat -1.5 to 4.2, Lng 29.5 to 35.0
const UGANDA_BOUNDS = {
  minLat: -1.5,
  maxLat: 4.2,
  minLng: 29.5,
  maxLng: 35.0,
};

// Preset apiary locations in Uganda
const UGANDA_REGIONS = [
  { name: 'Masaka (Kyanamukaka Apiary)', lat: -0.3344, lng: 31.7341, region: 'Central (Masaka)' },
  { name: 'Kasese (Rwenzori Foothills)', lat: 0.1833, lng: 30.0833, region: 'Western (Kasese)' },
  { name: 'Luweero (Wobulenzi Apiary)', lat: 0.7225, lng: 32.5336, region: 'Central (Luweero)' },
  { name: 'Arua (Rhino Camp / West Nile)', lat: 3.0303, lng: 30.9109, region: 'Northern (Arua)' },
  { name: 'Bushenyi (Ishaka Tea & Honey Belt)', lat: -0.5408, lng: 30.1396, region: 'Western (Bushenyi)' },
  { name: 'Soroti (Arapai Acacia Plains)', lat: 1.7147, lng: 33.6111, region: 'Eastern (Soroti)' },
  { name: 'Mbale (Mount Elgon Slopes)', lat: 1.0784, lng: 34.1754, region: 'Eastern (Mbale)' },
  { name: 'Gulu (Acholi Savannah Zone)', lat: 2.7747, lng: 32.2990, region: 'Northern (Gulu)' },
];

export const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  coordinates,
  onChange,
  defaultLocationName,
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [detectedAddress, setDetectedAddress] = useState<string | null>(defaultLocationName || null);

  // Convert lat/lng to percentage on the interactive map graphic
  // Lng: 29.5 -> 0%, 35.0 -> 100%
  // Lat: 4.2 -> 0% (top), -1.5 -> 100% (bottom)
  const pinX = Math.min(
    100,
    Math.max(
      0,
      ((coordinates.lng - UGANDA_BOUNDS.minLng) / (UGANDA_BOUNDS.maxLng - UGANDA_BOUNDS.minLng)) * 100
    )
  );
  const pinY = Math.min(
    100,
    Math.max(
      0,
      ((UGANDA_BOUNDS.maxLat - coordinates.lat) / (UGANDA_BOUNDS.maxLat - UGANDA_BOUNDS.minLat)) * 100
    )
  );

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickXPercent = (e.clientX - rect.left) / rect.width;
    const clickYPercent = (e.clientY - rect.top) / rect.height;

    const newLng = Number(
      (UGANDA_BOUNDS.minLng + clickXPercent * (UGANDA_BOUNDS.maxLng - UGANDA_BOUNDS.minLng)).toFixed(4)
    );
    const newLat = Number(
      (UGANDA_BOUNDS.maxLat - clickYPercent * (UGANDA_BOUNDS.maxLat - UGANDA_BOUNDS.minLat)).toFixed(4)
    );

    // Find closest region for auto-fill address
    const closest = findClosestRegion(newLat, newLng);
    setDetectedAddress(closest.name);
    onChange({ lat: newLat, lng: newLng }, closest.name);
  };

  const findClosestRegion = (lat: number, lng: number) => {
    let closest = UGANDA_REGIONS[0];
    let minDistance = Infinity;

    for (const reg of UGANDA_REGIONS) {
      const dist = Math.hypot(reg.lat - lat, reg.lng - lng);
      if (dist < minDistance) {
        minDistance = dist;
        closest = reg;
      }
    }
    return closest;
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(4));
        const lng = Number(position.coords.longitude.toFixed(4));
        setIsLocating(false);

        const closest = findClosestRegion(lat, lng);
        const address = `${closest.region} Apiary Zone (GPS: ${lat}, ${lng})`;
        setDetectedAddress(address);
        onChange({ lat, lng }, address);
      },
      (error) => {
        setIsLocating(false);
        // Provide friendly fallback to Masaka / Central apiary location
        setGpsError('GPS signal unavailable. Set to nearest Ugandan apiary point.');
        const fallback = UGANDA_REGIONS[0];
        onChange({ lat: fallback.lat, lng: fallback.lng }, fallback.name);
        setDetectedAddress(fallback.name);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="w-full space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#6B5E4F] dark:text-[#A89C8C] flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
          Apiary Map Coordinates & Location
        </label>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={isLocating}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-[#FAF7F2] dark:bg-[#25201A] border border-[#DDD3C1] dark:border-[#383127] text-[#D97706] dark:text-[#F59E0B] hover:bg-[#F3EEDF] dark:hover:bg-[#302922] transition-colors"
        >
          <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
          {isLocating ? 'Locating...' : 'Use Current GPS'}
        </button>
      </div>

      {gpsError && (
        <div className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-200 dark:border-amber-900/50">
          {gpsError}
        </div>
      )}

      {/* Interactive Uganda Map Canvas Container */}
      <div
        onClick={handleMapClick}
        className="relative w-full h-44 rounded-xl border border-[#DDD3C1] dark:border-[#383127] bg-[#EFE8DC] dark:bg-[#1C1814] overflow-hidden cursor-crosshair group shadow-inner select-none"
      >
        {/* Geographic Grid / Topo contour pattern */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#B45309_1px,transparent_1px),linear-gradient(to_bottom,#B45309_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Stylized Lake Victoria Representation (South-East Uganda) */}
        <div className="absolute -bottom-6 right-2 w-28 h-20 bg-sky-200/50 dark:bg-sky-900/30 rounded-full blur-xs border border-sky-300/40 dark:border-sky-800/30 flex items-center justify-center">
          <span className="text-[10px] text-sky-800/70 dark:text-sky-300/60 font-serif-title italic">L. Victoria</span>
        </div>

        {/* Lake Albert (West) */}
        <div className="absolute top-12 -left-4 w-10 h-24 bg-sky-200/40 dark:bg-sky-900/20 rounded-full rotate-12 blur-xs" />

        {/* Preset Apiary Landmarks */}
        {UGANDA_REGIONS.map((reg) => {
          const rx = ((reg.lng - UGANDA_BOUNDS.minLng) / (UGANDA_BOUNDS.maxLng - UGANDA_BOUNDS.minLng)) * 100;
          const ry = ((UGANDA_BOUNDS.maxLat - reg.lat) / (UGANDA_BOUNDS.maxLat - UGANDA_BOUNDS.minLat)) * 100;
          return (
            <div
              key={reg.name}
              style={{ left: `${rx}%`, top: `${ry}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover:opacity-80 transition-opacity"
            >
              <div className="w-2 h-2 rounded-full bg-[#B45309]/50 dark:bg-[#D97706]/40 ring-2 ring-white/50 dark:ring-black/50" />
              <span className="hidden sm:inline-block text-[9px] font-sans-body font-medium text-[#7C2D12] dark:text-[#FDE68A] whitespace-nowrap ml-1 drop-shadow-xs">
                {reg.name.split(' ')[0]}
              </span>
            </div>
          );
        })}

        {/* Active Pinpoint Marker */}
        <div
          style={{ left: `${pinX}%`, top: `${pinY}%` }}
          className="absolute -translate-x-1/2 -translate-y-full transition-all duration-150 pointer-events-none z-10"
        >
          <div className="flex flex-col items-center">
            <div className="p-1 rounded-full bg-amber-500 text-white shadow-lg ring-2 ring-white dark:ring-stone-900 animate-bounce">
              <MapPin className="w-4 h-4 fill-amber-500" />
            </div>
            <div className="w-1.5 h-1.5 bg-amber-600 rounded-full shadow-md -mt-0.5" />
          </div>
        </div>

        {/* Click Instruction Banner */}
        <div className="absolute bottom-1.5 left-2 bg-white/90 dark:bg-[#15120F]/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-[#6B5E4F] dark:text-[#A89C8C] border border-[#DDD3C1]/60 dark:border-[#383127]/60 flex items-center gap-1">
          <Compass className="w-3 h-3 text-[#D97706]" />
          <span>Click anywhere to place apiary hive pin</span>
        </div>
      </div>

      {/* Lat/Lng & Location Feedback Display */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs">
        <div className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-[#1C1814] border border-[#DDD3C1] dark:border-[#383127] flex items-center justify-between">
          <span className="text-[#8C7A65] dark:text-[#A89C8C]">Coordinates:</span>
          <span className="font-mono font-medium text-[#2B2118] dark:text-[#EFEBE4]">
            {coordinates.lat > 0 ? `${coordinates.lat}° N` : `${Math.abs(coordinates.lat)}° S`},{' '}
            {coordinates.lng}° E
          </span>
        </div>

        {detectedAddress && (
          <div className="flex-1 px-3 py-2 rounded-lg bg-[#FAF7F2] dark:bg-[#15120F] border border-[#E6DEC8] dark:border-[#2E2822] text-[#6B5E4F] dark:text-[#D1C7BA] flex items-center gap-1.5 truncate">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{detectedAddress}</span>
          </div>
        )}
      </div>
    </div>
  );
};
