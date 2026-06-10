export default function BelleAvatar({ size = 36 }: { size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 align-middle"
      role="img"
      aria-label="Belle"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-bear-bob drop-shadow-sm"
      >
        <circle cx="24" cy="26" r="16" fill="#FFE4EC" />
        <ellipse cx="24" cy="30" rx="11" ry="9" fill="#FFD6E5" />
        <path
          d="M12 18c2-6 8-10 12-10s10 4 12 10"
          fill="#6B4F5A"
        />
        <circle cx="14" cy="20" r="5" fill="#6B4F5A" />
        <circle cx="34" cy="20" r="5" fill="#6B4F5A" />
        <path
          d="M18 12c0-4 2.5-7 6-7s6 3 6 7"
          fill="#6B4F5A"
        />
        <path
          d="M30 10c3-1 6 1 7 4-2 1-4 0-5-2"
          fill="#FF8FAB"
        />
        <circle cx="18" cy="27" r="2" fill="#4A3F55" />
        <circle cx="30" cy="27" r="2" fill="#4A3F55" />
        <circle cx="19" cy="26.5" r="0.6" fill="white" />
        <circle cx="31" cy="26.5" r="0.6" fill="white" />
        <ellipse cx="14" cy="31" rx="2.5" ry="1.5" fill="#FF8FAB" opacity="0.55" />
        <ellipse cx="34" cy="31" rx="2.5" ry="1.5" fill="#FF8FAB" opacity="0.55" />
        <path
          d="M20 33.5c2 2.5 6 2.5 8 0"
          stroke="#4A3F55"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
