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

const ALL_DONE = {
  message: "Everything's done! Wow, you did so well, Belle!",
  emoji: "🏆",
};

export function pickEncouragement() {
  return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
}

export function allDoneEncouragement() {
  return ALL_DONE;
}
