export default function TulipAvatar({
  size = 24,
  sparkle = false,
}: {
  size?: number;
  sparkle?: boolean;
}) {
  return (
    <span
      className="inline-flex shrink-0 align-middle"
      role="img"
      aria-label="ritual tulip"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`drop-shadow-sm ${sparkle ? "animate-tulip-sparkle" : ""}`}
      >
        <path
          d="M24 44V22"
          stroke="#8fa882"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M24 30c-6 2-10 0-12-4 2-1 4-1 6 0 2-3 4-4 6-4s4 1 6 4c2-1 4-1 6 0-2 4-6 6-12 4z"
          fill="#e8a4b8"
        />
        <path
          d="M24 14c-3 0-5 2-6 5 1.5 0.5 3 0.5 4.5-0.5 1 2.5 2.5 4 4.5 4s3.5-1.5 4.5-4c1.5 1 3 1 4.5 0.5-1-3-3-5-6-5z"
          fill="#8e4a62"
        />
        <path
          d="M24 12c-2 0-3.5 1.5-4 3.5 1 0.5 2 0.5 3 0 1-1.5 2-2 3.5-2s2.5 0.5 3.5 2c1-0.5 2-0.5 3 0-0.5-2-2-3.5-4-3.5z"
          fill="#dcc4cc"
        />
        <ellipse cx="24" cy="11" rx="3" ry="2" fill="#f5d0dc" opacity="0.85" />
        <path
          d="M18 36c2 1 4 1.5 6 1.5s4-0.5 6-1.5"
          stroke="#8fa882"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
