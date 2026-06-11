/** Homescreen icon — full-bleed background art with Belle avatar centered on top. */

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

const CHERRY = `<g>
  <circle cx="0" cy="0" r="34" fill="#d62839"/>
  <rect x="-4" y="-48" width="8" height="18" rx="4" fill="#6bbf59"/>
  <path d="M0-48c8-6 16-4 18 4" stroke="#7ed957" stroke-width="5" stroke-linecap="round"/>
</g>`;

const FLOWER = `<g fill="#ff8fab">
  <circle cx="0" cy="0" r="16"/><circle cx="16" cy="14" r="16"/><circle cx="-16" cy="14" r="16"/><circle cx="0" cy="24" r="16"/>
  <circle cx="0" cy="12" r="9" fill="#ffd166"/>
</g>`;

/** Same bear as components/BelleAvatar.tsx */
const BELLE_AVATAR = `<g>
  <circle cx="24" cy="26" r="16" fill="#FFE4EC"/>
  <ellipse cx="24" cy="30" rx="11" ry="9" fill="#FFD6E5"/>
  <path d="M12 18c2-6 8-10 12-10s10 4 12 10" fill="#6B4F5A"/>
  <circle cx="14" cy="20" r="5" fill="#6B4F5A"/>
  <circle cx="34" cy="20" r="5" fill="#6B4F5A"/>
  <path d="M18 12c0-4 2.5-7 6-7s6 3 6 7" fill="#6B4F5A"/>
  <path d="M30 10c3-1 6 1 7 4-2 1-4 0-5-2" fill="#FF8FAB"/>
  <circle cx="18" cy="27" r="2" fill="#4A3F55"/>
  <circle cx="30" cy="27" r="2" fill="#4A3F55"/>
  <circle cx="19" cy="26.5" r="0.6" fill="white"/>
  <circle cx="31" cy="26.5" r="0.6" fill="white"/>
  <ellipse cx="14" cy="31" rx="2.5" ry="1.5" fill="#FF8FAB" opacity="0.55"/>
  <ellipse cx="34" cy="31" rx="2.5" ry="1.5" fill="#FF8FAB" opacity="0.55"/>
  <path d="M20 33.5c2 2.5 6 2.5 8 0" stroke="#4A3F55" stroke-width="1.5" stroke-linecap="round"/>
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
  <g opacity="0.92">
    <g transform="translate(256 368) scale(3.15)">${STRAWBERRY}</g>
    <g transform="translate(108 128) scale(1.75)">${CHERRY}</g>
    <g transform="translate(404 96) scale(1.45)">${FLOWER}</g>
  </g>
  <circle cx="256" cy="232" r="118" fill="white" fill-opacity="0.38"/>
  <circle cx="256" cy="232" r="104" fill="white" fill-opacity="0.55"/>
  <g transform="translate(256 232) scale(4.65)">
    <g transform="translate(-24 -24)">${BELLE_AVATAR}</g>
  </g>
</svg>`;

export function svgToDataUri(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
