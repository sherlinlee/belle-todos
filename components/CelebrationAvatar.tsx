import BelleCelebrationAvatar from "@/components/BelleCelebrationAvatar";
import { getSiteConfig } from "@/lib/site";

export default function CelebrationAvatar({ size = 96 }: { size?: number }) {
  const site = getSiteConfig();

  if (site.owner === "belle") {
    return <BelleCelebrationAvatar size={size} />;
  }

  return (
    <span
      className="inline-flex animate-celebration-float items-center leading-none"
      style={{ fontSize: Math.round(size * 0.72) }}
      aria-hidden
    >
      ⚡{site.celebrationEmoji}
    </span>
  );
}
