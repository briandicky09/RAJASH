import React from 'react';

/**
 * Official RAJASH Brand Mark (Water Droplet + 3 Ascending Financial Bars)
 * Matches the official RAJASH identity sheet:
 * - Left crescent & Bar 1: Deep Navy (#002A54) or White (#FFFFFF) when inverted/tile
 * - Bar 2 (Middle): Medium Royal Blue (#0082DA)
 * - Bar 3 (Right): Bright Aqua Cyan (#43BDD4) with Royal Blue (#0082DA) triangle fold
 */
export function RajashMark({ size = 34, inverted = false, tile = false }) {
  const primaryColor = inverted || tile ? '#FFFFFF' : '#002A54';
  const midBlue = '#0082DA';
  const cyanBlue = '#43BDD4';

  const markSvg = (
    <svg
      width={tile ? Math.round(size * 0.72) : size}
      height={tile ? Math.round(size * 0.72) : size}
      viewBox="0 0 100 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
      aria-hidden="true"
    >
      {/* Outer Left Water Droplet Crescent */}
      <path
        d="M50 4C44.5 18.5 14 45 14 73.5C14 86.8 20.4 97.6 30.8 103.5C27.1 98.1 25.4 91.5 25.4 84.2C25.4 67.2 35.8 54.4 50 35.8C56.3 44.1 62.6 50.8 66.8 56.2L75.4 51.1C67.7 39.1 54.2 17.5 50 4Z"
        fill={primaryColor}
      />

      {/* Bar 1 (Left - Shortest Financial Bar) */}
      <path
        d="M32 82.5C32 76.5 35.8 72.2 41.5 68.8L46.5 65.8V106.8C40.1 106.1 34.8 103.6 32 99.8V82.5Z"
        fill={primaryColor}
      />

      {/* Bar 2 (Center - Medium Financial Bar) */}
      <path
        d="M50 63.6L63.5 55.6V96.2C63.5 102.5 58.6 106.4 50 107V63.6Z"
        fill={midBlue}
      />

      {/* Bar 3 (Right - Tallest Financial Bar forming Right Droplet Curve) */}
      <path
        d="M67 53.5L78.2 46.8C83.5 55.1 86 64.2 86 73.5C86 90.4 75.8 103.2 61.2 106.2C65.1 102.5 67 97.3 67 91V53.5Z"
        fill={cyanBlue}
      />

      {/* Bar 3 Top-Left Geometric Triangle Fold */}
      <path
        d="M67 53.5L78.2 46.8V69.5L67 53.5Z"
        fill={midBlue}
      />
    </svg>
  );

  if (tile) {
    return (
      <div
        className="d-inline-flex align-items-center justify-content-center flex-shrink-0"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: `${Math.round(size * 0.24)}px`,
          backgroundColor: '#002A54',
          boxShadow: '0 4px 12px rgba(0, 42, 84, 0.18)'
        }}
      >
        {markSvg}
      </div>
    );
  }

  return markSvg;
}

/**
 * Custom Geometric "RAJASH" Wordmark SVG matching the official brand identity:
 * - Open-loop R and S
 * - Chevron/Apex A's without horizontal crossbars
 * - Bold geometric J and H
 */
export function RajashWordmark({ height = 18, color = '#002A54' }) {
  const width = Math.round(height * (276 / 40));
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 276 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
      aria-label="RAJASH"
    >
      {/* R: Vertical stem + top rounded loop + diagonal leg with open gap */}
      <path
        d="M4 36V6H24.5C31.2 6 35.5 9.8 35.5 15.5C35.5 21.2 31.2 25 24.5 25H13.5V19H23.8C26.7 19 28.5 17.6 28.5 15.5C28.5 13.4 26.7 12 23.8 12H11V36H4Z"
        fill={color}
      />
      <path d="M21.5 23.5L29.5 36H37.2L28.4 22.5L21.5 23.5Z" fill={color} />

      {/* A (1st): Geometric chevron without crossbar */}
      <path d="M44 36L59.5 6H67L82.5 36H74.6L63.25 13.4L51.9 36H44Z" fill={color} />

      {/* J: Descender hook curving left */}
      <path
        d="M115 6H122.2V24.5C122.2 31.8 117.2 36.4 109 36.4H101.5C94.8 36.4 90.2 33.2 88.8 27.8L95.6 25.8C96.6 29 98.8 30.2 102.2 30.2H108.5C112.8 30.2 115 28.1 115 24.2V6Z"
        fill={color}
      />

      {/* A (2nd): Geometric chevron without crossbar */}
      <path d="M130 36L145.5 6H153L168.5 36H160.6L149.25 13.4L137.9 36H130Z" fill={color} />

      {/* S: Sleek geometric double-curve ribbon */}
      <path
        d="M177.5 28.8H198.2C201.4 28.8 203.2 27.5 203.2 25.6C203.2 23.7 201.4 22.6 198.2 22.6H186.5C179.4 22.6 175.2 19.2 175.2 14.1C175.2 8.9 179.6 6 187.2 6H208.5V12.2H187.6C184.6 12.2 182.6 13.3 182.6 15C182.6 16.7 184.5 17.7 187.8 17.7H199C206.4 17.7 210.6 20.9 210.6 26.2C210.6 32.1 206 36 198 36H177.5V28.8Z"
        fill={color}
      />

      {/* H: Geometric H */}
      <path d="M220 36V6H227.2V17.8H246.8V6H254V36H246.8V24.2H227.2V36H220Z" fill={color} />
    </svg>
  );
}

export default function BrandLogo({
  size = 34,
  showSubtitle = true,
  inverted = false,
  tile = false
}) {
  const wordmarkColor = inverted ? '#FFFFFF' : '#002A54';
  const wordmarkHeight = Math.max(15, Math.round(size * 0.48));

  return (
    <div
      className="d-inline-flex align-items-center gap-2 text-decoration-none"
      style={{ userSelect: 'none' }}
    >
      <RajashMark size={size} inverted={inverted} tile={tile} />
      <div className="d-flex flex-column justify-content-center" style={{ lineHeight: 1 }}>
        <RajashWordmark height={wordmarkHeight} color={wordmarkColor} />
        {showSubtitle && (
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 600,
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              color: inverted ? 'rgba(249, 248, 246, 0.76)' : 'var(--wl-grey-60)',
              lineHeight: 1.1,
              marginTop: '4px'
            }}
          >
            Keuangan &amp; Piutang
          </span>
        )}
      </div>
    </div>
  );
}
