import BelleAvatar from "@/components/BelleAvatar";
import { getSiteConfig } from "@/lib/site";

export default function SiteAvatar({ size = 36 }: { size?: number }) {
  const site = getSiteConfig();

  if (site.homeAvatar === "belle") {
    return <BelleAvatar size={size} />;
  }

  return (
    <span
      className="inline-flex items-center justify-center leading-none"
      style={{ fontSize: Math.round(size * 0.85), width: size, height: size }}
      aria-hidden
    >
      {site.homeAvatarEmoji}
    </span>
  );
}
