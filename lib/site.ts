export type SiteOwner = "belle" | "rod";

export type SiteConfig = {
  owner: SiteOwner;
  appName: string;
  title: string;
  description: string;
  loginHeading: string;
  loginDecor: string;
  homeTagline: string;
  homeSubtitle: string;
  homeAvatar: "belle" | "emoji";
  homeAvatarEmoji: string;
  navTodoEmoji: string;
  journalTagline: string;
  ideasTagline: string;
  journalSavedHint: string;
  emptyCompletedEmoji: string;
  allDoneFooter: string;
  celebrationEmoji: string;
  syncBlobName: string;
  themeColor: string;
  manifestBackground: string;
};

const belle: SiteConfig = {
  owner: "belle",
  appName: "belle's to-do(s)",
  title: "belle's to-do(s) ✿",
  description: "A cute little to-do list, just for Belle",
  loginHeading: "belle's cosy corner",
  loginDecor: "✿",
  homeTagline: "my cosy corner",
  homeSubtitle: "one thing at a time. you got it, belle",
  homeAvatar: "belle",
  homeAvatarEmoji: "✿",
  navTodoEmoji: "✿",
  journalTagline: "pause + breathe",
  ideasTagline: "let it spill out",
  journalSavedHint: "in your journal below ✿",
  emptyCompletedEmoji: "🌷",
  allDoneFooter: "All done — you're amazing! 🎀",
  celebrationEmoji: "🏆",
  syncBlobName: "belle-sync.json",
  themeColor: "#f5eef1",
  manifestBackground: "#f5a0bd",
};

const rod: SiteConfig = {
  owner: "rod",
  appName: "rod's to-do(s)",
  title: "rod's to-do(s) ⚡",
  description: "A to-do list for Rod",
  loginHeading: "rod's hangout",
  loginDecor: "⚡",
  homeTagline: "rod's hangout",
  homeSubtitle: "one thing at a time. you got this, rod",
  homeAvatar: "emoji",
  homeAvatarEmoji: "⚡",
  navTodoEmoji: "⚡",
  journalTagline: "pause + reset",
  ideasTagline: "let it spill out",
  journalSavedHint: "in your journal below ⚡",
  emptyCompletedEmoji: "⚡",
  allDoneFooter: "All done — nailed it! ⚡",
  celebrationEmoji: "🏆",
  syncBlobName: "rod-sync.json",
  themeColor: "#eef1f5",
  manifestBackground: "#6b8cae",
};

export function getSiteOwner(): SiteOwner {
  return process.env.NEXT_PUBLIC_SITE_OWNER === "rod" ? "rod" : "belle";
}

export function getSiteConfig(): SiteConfig {
  return getSiteOwner() === "rod" ? rod : belle;
}

export function formatSiteDecor(text: string, decor: string) {
  return `${decor} ${text} ${decor}`;
}
