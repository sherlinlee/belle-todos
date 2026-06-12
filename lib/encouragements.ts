const MESSAGES = [
  { message: "You did it, Belle!", emoji: "🌟" },
  { message: "One less thing on your mind, Belle!", emoji: "✨" },
  { message: "Look at you go, Belle!", emoji: "🎀" },
  { message: "Crushing it, Belle!", emoji: "💪" },
  { message: "That felt good, right, Belle?", emoji: "🌷" },
  { message: "Tiny win, big mood, Belle!", emoji: "🫶" },
  { message: "You're on a roll, Belle!", emoji: "🔥" },
  { message: "So satisfying, Belle!", emoji: "🎉" },
];

export const ALL_DONE_WITH_TODAYS_LIST = "All done with today's list!";

const ALL_DONE_FOR_TODAY_COMPLIMENTS = [
  "All done with today's list! 🎀",
  "All done with today's list, Belle! ✨",
  "Today's list is all tucked away! 🌷",
  "You finished today's list — so proud! 🫶",
  "That's today's list wrapped, sweetie! 🏆",
  "Every today task done — wow! 💫",
  "Today's list feels complete! 🌟",
  "You cleared today's list beautifully! 🎉",
];

export function pickAllDoneCompliment() {
  return ALL_DONE_FOR_TODAY_COMPLIMENTS[
    Math.floor(Math.random() * ALL_DONE_FOR_TODAY_COMPLIMENTS.length)
  ];
}

export function pickEncouragement() {
  return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
}

export function allDoneEncouragement() {
  return {
    message: pickAllDoneCompliment(),
    emoji: "🏆",
  };
}
