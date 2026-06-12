import BelleAvatar from "@/components/BelleAvatar";

export default function BelleCelebrationAvatar({ size = 96 }: { size?: number }) {
  const belleSize = Math.round(size * 0.7);

  return (
    <div
      className="inline-flex items-end justify-center animate-celebration-float"
      role="img"
      aria-label="Belle celebrating with a trophy"
    >
      <BelleAvatar size={belleSize} />
      <span
        className="-ml-4 mb-1 leading-none drop-shadow-sm"
        style={{ fontSize: Math.round(belleSize * 0.75) }}
        aria-hidden
      >
        🏆
      </span>
    </div>
  );
}
