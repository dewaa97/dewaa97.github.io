import React from 'react';

type IconProps = {
  size?: number;
  className?: string;
  mode?: 'light' | 'dark';
};

const getBase = (stroke: string, strokeWidth: number) => ({
  stroke,
  strokeWidth,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export function RetroBrowserIcon({ size = 56, className, mode = 'light' }: IconProps) {
  const sticker = mode === 'dark';
  const outline = getBase('#F9FAFB', 18);
  const base = getBase('#111111', 10);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      className={className}
      role="img"
      aria-label="Browser"
    >
      {sticker && (
        <g>
          <circle cx="128" cy="120" r="92" fill="#BFF5EA" {...outline} />
          <rect x="32" y="176" width="112" height="52" rx="18" fill="#FB923C" {...outline} />
          <path d="M192 160l38 38-22 6-8 22-38-38 30-28Z" fill="#FFF7ED" {...outline} />
        </g>
      )}

      <circle cx="128" cy="120" r="92" fill="#BFF5EA" {...base} />
      <path d="M36 120h184" fill="none" {...base} />
      <path d="M128 28c26 24 42 54 42 92s-16 68-42 92" fill="none" {...base} />
      <path d="M128 28c-26 24-42 54-42 92s16 68 42 92" fill="none" {...base} />
      <path d="M78 78c18 10 34 14 50 14s32-4 50-14" fill="none" {...base} />
      <path d="M78 162c18-10 34-14 50-14s32 4 50 14" fill="none" {...base} />

      <rect x="32" y="176" width="112" height="52" rx="18" fill="#FB923C" {...base} />
      <text x="52" y="214" fontFamily="ui-sans-serif, system-ui" fontSize="36" fontWeight="900" fill="#111111">
        www
      </text>

      <path d="M192 160l38 38-22 6-8 22-38-38 30-28Z" fill="#FFF7ED" {...base} />
    </svg>
  );
}

export function RetroPortfolioIcon({ size = 56, className, mode = 'light' }: IconProps) {
  const sticker = mode === 'dark';
  const outline = getBase('#F9FAFB', 18);
  const base = getBase('#111111', 10);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      className={className}
      role="img"
      aria-label="Portfolio"
    >
      {sticker && (
        <g>
          <rect x="28" y="28" width="200" height="200" rx="44" fill="#DDD6FE" {...outline} />
        </g>
      )}

      <rect x="28" y="28" width="200" height="200" rx="44" fill="#DDD6FE" {...base} />
      <path d="M28 76c40-22 88-28 128-18 30 8 52 26 72 46v124c0 0-20-12-48-18-30-7-70-8-152 18V76Z" fill="#EDE9FE" {...base} />

      <circle cx="104" cy="104" r="38" fill="#F2C3A7" {...base} />
      <path d="M70 98c18-22 44-28 72-14" fill="none" {...base} />
      <path d="M78 92c10-22 38-32 62-18" fill="none" {...base} />
      <path d="M78 86c10-18 30-26 50-22" fill="none" {...base} />
      <path d="M84 82c10-10 26-12 40-8" fill="none" {...base} />
      <path d="M80 96c6-16 22-30 44-28" fill="#2563EB" opacity="0.7" />
      <path d="M78 84c18-18 58-18 74 4" fill="#2563EB" />
      <circle cx="90" cy="110" r="6" fill="#111111" />
      <circle cx="118" cy="110" r="6" fill="#111111" />
      <path d="M92 126c10 8 24 8 34 0" fill="none" {...base} />

      <circle cx="74" cy="146" r="16" fill="#22C55E" {...base} />
      <rect x="122" y="142" width="84" height="14" rx="7" fill="#111111" />
      <rect x="122" y="166" width="96" height="14" rx="7" fill="#111111" opacity="0.85" />
      <rect x="122" y="190" width="72" height="14" rx="7" fill="#111111" opacity="0.7" />
    </svg>
  );
}

export function RetroExplorerIcon({ size = 56, className, mode = 'light' }: IconProps) {
  const sticker = mode === 'dark';
  const outline = getBase('#F9FAFB', 18);
  const base = getBase('#111111', 10);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      className={className}
      role="img"
      aria-label="Explorer"
    >
      {sticker && (
        <g>
          <path
            d="M40 78c0-14 10-24 24-24h54l18 18h56c14 0 24 10 24 24v94c0 14-10 24-24 24H64c-14 0-24-10-24-24V78Z"
            fill="#FCD34D"
            {...outline}
          />
        </g>
      )}

      <path
        d="M40 78c0-14 10-24 24-24h54l18 18h56c14 0 24 10 24 24v94c0 14-10 24-24 24H64c-14 0-24-10-24-24V78Z"
        fill="#FCD34D"
        {...base}
      />
      <path d="M40 96h176" fill="none" {...base} />
      <path d="M64 96l20 30h132" fill="none" {...base} />
      <circle cx="80" cy="76" r="6" fill="#111111" />
      <circle cx="102" cy="76" r="6" fill="#111111" />
      <path d="M78 116h46" fill="none" {...base} />
      <path d="M78 146h74" fill="none" {...base} />

      <path
        d="M68 94h66l18 18H68V94Z"
        fill="#BAE6FD"
        opacity="0.9"
      />
    </svg>
  );
}

export function RetroSettingsIcon({ size = 56, className, mode = 'light' }: IconProps) {
  const sticker = mode === 'dark';
  const outline = getBase('#F9FAFB', 18);
  const base = getBase('#111111', 10);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      className={className}
      role="img"
      aria-label="Settings"
    >
      {sticker && (
        <g>
          <path
            d="M128 44l18 18 26-6 12 26 26 4-4 26 20 18-20 18 4 26-26 4-12 26-26-6-18 18-18-18-26 6-12-26-26-4 4-26-20-18 20-18-4-26 26-4 12-26 26 6 18-18Z"
            fill="#9CA3AF"
            {...outline}
          />
        </g>
      )}

      <path
        d="M128 44l18 18 26-6 12 26 26 4-4 26 20 18-20 18 4 26-26 4-12 26-26-6-18 18-18-18-26 6-12-26-26-4 4-26-20-18 20-18-4-26 26-4 12-26 26 6 18-18Z"
        fill="#9CA3AF"
        {...base}
      />
      <circle cx="128" cy="128" r="48" fill="#111111" />
      <circle cx="128" cy="128" r="36" fill="#FFFFFF" />
    </svg>
  );
}

export function RetroPersonalIcon({ size = 56, className, mode = 'light' }: IconProps) {
  const sticker = mode === 'dark';
  const outline = getBase('#F9FAFB', 18);
  const base = getBase('#111111', 10);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      className={className}
      role="img"
      aria-label="Personal"
    >
      {sticker && (
        <g>
          <path
            d="M128 20C68.4 20 20 68.4 20 128s48.4 108 108 108 108-48.4 108-108S187.6 20 128 20Zm0 192c-46.4 0-84-37.6-84-84s37.6-84 84-84 84 37.6 84 84-37.6 84-84 84Z"
            fill="#DDD6FE"
            {...outline}
          />
          <path
            d="M128 72c-22.1 0-40 17.9-40 40s17.9 40 40 40 40-17.9 40-40-17.9-40-40-40Zm0 64c-13.2 0-24-10.8-24-24s10.8-24 24-24 24 10.8 24 24-10.8 24-24 24Z"
            fill="#DDD6FE"
            {...outline}
          />
          <path
            d="M128 160c-35.3 0-64 19.1-64 42.7v5.3h128v-5.3c0-23.6-28.7-42.7-64-42.7Z"
            fill="#DDD6FE"
            {...outline}
          />
        </g>
      )}

      <circle cx="128" cy="128" r="108" fill="#DDD6FE" {...base} />
      <circle cx="128" cy="112" r="40" fill="#EDE9FE" {...base} />
      <path
        d="M64 202.7c0-23.6 28.7-42.7 64-42.7s64 19.1 64 42.7v5.3H64v-5.3Z"
        fill="#EDE9FE"
        {...base}
      />
      <circle cx="128" cy="112" r="12" fill="#111111" />
      <path d="M116 132c8 4 16 4 24 0" fill="none" {...base} />
    </svg>
  );
}
