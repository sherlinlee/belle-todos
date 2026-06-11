/** Homescreen icon art — full-bleed 512×512, artwork centered large. */

const STRAWBERRY = `<g>
  <path d="M0-92c-34 0-62 28-62 62s28 62 62 62 62-28 62-62-28-62-62-62z" fill="#e63946"/>
  <ellipse cx="0" cy="8" rx="48" ry="54" fill="#ef476f"/>
  <path d="M-8-118c-6-18 8-32 22-28 8 14 16 22 8 28-10 6-22 4-30 0z" fill="#6bbf59"/>
  <path d="M8-118c6-18-8-32-22-28-8 14-16 22-8 28 10 6 22 4 30 0z" fill="#7ed957"/>
  <circle cx="-22" cy="-18" r="4" fill="#ffd166"/>
  <circle cx="6" cy="-32" r="4" fill="#ffd166"/>
  <circle cx="24" cy="-8" r="4" fill="#ffd166"/>
  <circle cx="-8" cy="12" r="4" fill="#ffd166"/>
  <circle cx="18" cy="22" r="4" fill="#ffd166"/>
  <circle cx="-28" cy="18" r="4" fill="#ffd166"/>
</g>`;

export const BELLE_APP_ICON_BG = "#f5a0bd";

export const BELLE_APP_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="bellePink" x1="256" y1="0" x2="256" y2="512" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f8c8dc"/>
      <stop stop-color="#f5a0bd"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bellePink)"/>
  <g transform="translate(256 300) scale(2.55)">${STRAWBERRY}</g>
  <g transform="translate(138 148) scale(1.45)">
    <circle cx="0" cy="0" r="34" fill="#d62839"/>
    <rect x="-4" y="-48" width="8" height="18" rx="4" fill="#6bbf59"/>
    <path d="M0-48c8-6 16-4 18 4" stroke="#7ed957" stroke-width="5" stroke-linecap="round"/>
  </g>
  <g fill="#ff8fab" transform="translate(392 118) scale(1.15)">
    <circle cx="0" cy="0" r="16"/><circle cx="16" cy="14" r="16"/><circle cx="-16" cy="14" r="16"/><circle cx="0" cy="24" r="16"/>
    <circle cx="0" cy="12" r="9" fill="#ffd166"/>
  </g>
</svg>`;

export function svgToDataUri(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
