import React from 'react';

interface BringLightLogoProps {
  className?: string;
  size?: number | string;
  title?: string;
  variant?: 'full' | 'icon';
}

/**
 * Bring Light Official App Logo Component
 * High-fidelity, resolution-independent vector rendering matching the official brand emblem:
 * - Organic black pebble silhouette
 * - Bold white "BRING" and "LIGHT" typographic hierarchy
 * - Lower-right circular light-lens emblem
 */
export const BringLightLogo: React.FC<BringLightLogoProps> = ({
  className = 'w-9 h-9',
  size,
  title = 'Light Hive Logo',
  variant = 'full',
}) => {
  const inlineStyle: React.CSSProperties = size
    ? { width: size, height: typeof size === 'number' ? size * 0.94 : size }
    : {};

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={inlineStyle}
      role="img"
      aria-label={title}
    >
      <svg
        viewBox="0 0 100 94"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        {/* Subtle Dark Mode Rim / Glow for legibility on dark canvases */}
        <path
          d="M48 2.5 C68 2.2 87 11 94.5 27 C99 36 98.5 50 96 61 C93.5 69.5 89.5 74 85 76.5 C82.5 78 79.5 80 76.5 82 C68 89 55 93 41 92.5 C25 91.8 11 84 4.5 71 C-1 59.5 -0.5 43 2.8 31 C7 15 23 3.5 48 2.5 Z"
          fill="#111111"
          stroke="#E5DBC5"
          strokeWidth="1.2"
          className="stroke-[#E2D8C3] dark:stroke-[#574635]"
        />

        {/* Top Word: BRING */}
        <text
          x="16"
          y="44"
          fill="#FFFFFF"
          fontFamily="'Impact', 'Montserrat', 'Arial Black', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          fontWeight="900"
          fontSize="22"
          letterSpacing="-0.3"
        >
          BRING
        </text>

        {/* Bottom Word: LIGHT */}
        <text
          x="16"
          y="65.5"
          fill="#FFFFFF"
          fontFamily="'Impact', 'Montserrat', 'Arial Black', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          fontWeight="900"
          fontSize="22"
          letterSpacing="-0.3"
        >
          LIGHT
        </text>

        {/* Bottom-Right Light Portal / Ring Emblem */}
        {/* Outer White Disc */}
        <circle cx="80.5" cy="76" r="14.5" fill="#FFFFFF" />
        {/* Inner Black Hole */}
        <circle cx="80.5" cy="76" r="6.2" fill="#111111" />
      </svg>
    </div>
  );
};
