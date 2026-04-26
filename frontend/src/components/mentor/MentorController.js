export const MENTOR_EVENTS = {
  CORRECT_ANSWER: "CORRECT_ANSWER",
  WRONG_ANSWER: "WRONG_ANSWER",
  START_ACTIVITY: "START_ACTIVITY",
  START_QUIZ: "START_QUIZ",
  LOW_TIME_WARNING: "LOW_TIME_WARNING",
  GAME_OVER: "GAME_OVER",
  QUIZ_COMPLETE: "QUIZ_COMPLETE",
  IDLE: "IDLE",
  LEVEL_COMPLETE: "LEVEL_COMPLETE",
  GREETING: "GREETING",
  HINT: "HINT",
  START_STORY: "START_STORY",
  STORY_PLAY: "STORY_PLAY",
  STORY_COMPLETE: "STORY_COMPLETE",
};

export const MENTOR_STATES = {
  idle: "idle",
  speaking: "speaking",
  happy: "happy",
  thinking: "thinking",
  celebrating: "celebrating",
};

export const MENTOR_CHARACTERS = {
  robot: { id: "robot", emoji: "🤖", name: "Robo", color: "#3b82f6" },
  animal: { id: "animal", emoji: "🐼", name: "Panda", color: "#10b981" },
  fairy: { id: "fairy", emoji: "🧚", name: "Sparkle", color: "#ec4899" },
  space: { id: "space", emoji: "🚀", name: "Astro", color: "#8b5cf6" },
};

const RESPONSES = {
  [MENTOR_EVENTS.CORRECT_ANSWER]: {
    state: MENTOR_STATES.celebrating,
    messages: [
      "Amazing job! You're so smart!",
      "That's correct! Keep going!",
      "Wow, you got it right! Awesome!",
      "Perfect answer! You're a star!",
      "Brilliant! You nailed it!",
    ],
  },
  [MENTOR_EVENTS.WRONG_ANSWER]: {
    state: MENTOR_STATES.thinking,
    messages: [
      "Hmm, not quite! Try again, you can do it!",
      "Oops! That's okay, let's try the next one!",
      "Almost! Don't give up, you're learning!",
      "Not this time, but you're doing great! Keep going!",
      "It's okay to make mistakes. That's how we learn!",
    ],
  },
  [MENTOR_EVENTS.START_ACTIVITY]: {
    state: MENTOR_STATES.happy,
    messages: [
      "Let's go! This is going to be fun!",
      "Ready to learn something amazing? Let's start!",
      "Yay! I love this activity! Let's do it together!",
      "Here we go! You're going to do great!",
    ],
  },
  [MENTOR_EVENTS.START_QUIZ]: {
    state: MENTOR_STATES.happy,
    messages: [
      "Welcome to Quiz Arena. Let's play smart and fast!",
      "Quiz time! Stay focused and collect stars!",
      "Ready for the arena? Let's do this together!",
    ],
  },
  [MENTOR_EVENTS.LOW_TIME_WARNING]: {
    state: MENTOR_STATES.thinking,
    messages: [
      "A little faster. Time is almost up!",
      "Quick quick, pick your answer!",
      "Only a few seconds left. You can do it!",
    ],
  },
  [MENTOR_EVENTS.GAME_OVER]: {
    state: MENTOR_STATES.thinking,
    messages: [
      "That round is over, but you can try again!",
      "Nice effort. Let's restart and beat it next time!",
      "Don't worry. Another round will be even better!",
    ],
  },
  [MENTOR_EVENTS.QUIZ_COMPLETE]: {
    state: MENTOR_STATES.celebrating,
    messages: [
      "Quiz complete! You lit up the whole arena!",
      "Amazing finish! You conquered the quiz!",
      "You did it! Time to celebrate your score!",
    ],
  },
  [MENTOR_EVENTS.IDLE]: {
    state: MENTOR_STATES.idle,
    messages: [
      "Pick a world and let's start learning!",
      "I'm here whenever you need me!",
      "Tap a world to begin your adventure!",
      "Ready for some fun? Choose a world!",
    ],
  },
  [MENTOR_EVENTS.LEVEL_COMPLETE]: {
    state: MENTOR_STATES.celebrating,
    messages: [
      "You finished the whole level! Incredible!",
      "Level complete! You're a superstar!",
      "Amazing work! You should be so proud!",
      "Woohoo! You did it! Time to celebrate!",
    ],
  },
  [MENTOR_EVENTS.GREETING]: {
    state: MENTOR_STATES.happy,
    messages: [
      "Hi there! Ready to learn today?",
      "Welcome back! Let's have fun!",
      "Hey! So happy to see you! Let's explore!",
      "Hello, friend! What shall we learn today?",
    ],
  },
  [MENTOR_EVENTS.HINT]: {
    state: MENTOR_STATES.thinking,
    messages: [
      "Think carefully... you know this!",
      "Look closely at the options!",
      "Take your time, there's no rush!",
      "Remember what we learned?",
    ],
  },
  [MENTOR_EVENTS.START_STORY]: {
    state: MENTOR_STATES.happy,
    messages: [
      "Story time! Tap listen and enjoy.",
      "Let’s listen to the story together!",
      "Ready? I’ll help you with the quiz after!",
    ],
  },
  [MENTOR_EVENTS.STORY_PLAY]: {
    state: MENTOR_STATES.speaking,
    messages: [
      "Listening...",
      "I’m reading the story now.",
      "Follow along and imagine it!",
    ],
  },
  [MENTOR_EVENTS.STORY_COMPLETE]: {
    state: MENTOR_STATES.celebrating,
    messages: [
      "Great listening! Now answer the quiz!",
      "You finished the story! Let’s do the questions!",
    ],
  },
};

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const pickEnglishChildFriendlyMaleVoice = (voices = []) => {
  const englishVoices = voices.filter((voice) => voice.lang?.toLowerCase().startsWith("en"));
  if (!englishVoices.length) return null;

  const preferredNameHints = [
    "male",
    "david",
    "mark",
    "guy",
    "tom",
    "alex",
    "daniel",
    "fred",
    "google uk english male",
    "neural",
  ];

  const avoidNameHints = [
    "female",
    "samantha",
    "zira",
    "jenny",
    "aria",
    "ava",
    "allison",
    "victoria",
    "karen",
    "moira",
    "tessa",
    "google uk english female",
  ];

  const scored = englishVoices.map((voice) => {
    const name = (voice.name || "").toLowerCase();
    let score = 0;

    preferredNameHints.forEach((hint) => {
      if (name.includes(hint)) score += 3;
    });
    avoidNameHints.forEach((hint) => {
      if (name.includes(hint)) score -= 5;
    });
    if (name.includes("child") || name.includes("kids")) score += 4;
    if (name.includes("male")) score += 3;
    if (name.includes("old") || name.includes("senior")) score -= 2;

    return { voice, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.voice || englishVoices[0];
};

const pickHindiFriendlyVoice = (voices = []) => {
  if (!voices.length) return null;

  const hindiCandidates = voices.filter((voice) => {
    const lang = (voice.lang || "").toLowerCase();
    const name = (voice.name || "").toLowerCase();

    return (
      lang.startsWith("hi") ||
      lang.endsWith("-in") ||
      name.includes("hindi") ||
      name.includes("india")
    );
  });

  if (!hindiCandidates.length) return null;

  const scored = hindiCandidates.map((voice) => {
    const lang = (voice.lang || "").toLowerCase();
    const name = (voice.name || "").toLowerCase();
    let score = 0;

    if (lang.startsWith("hi")) score += 6;
    if (name.includes("hindi")) score += 5;
    if (name.includes("india")) score += 2;
    if (name.includes("female")) score += 1;

    return { voice, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.voice || hindiCandidates[0];
};

const getMentorResponses = (translations = {}) => ({
  [MENTOR_EVENTS.CORRECT_ANSWER]: {
    state: MENTOR_STATES.celebrating,
    messages: translations.correct || RESPONSES[MENTOR_EVENTS.CORRECT_ANSWER].messages,
  },
  [MENTOR_EVENTS.WRONG_ANSWER]: {
    state: MENTOR_STATES.thinking,
    messages: translations.wrong || RESPONSES[MENTOR_EVENTS.WRONG_ANSWER].messages,
  },
  [MENTOR_EVENTS.START_ACTIVITY]: {
    state: MENTOR_STATES.happy,
    messages: translations.start || RESPONSES[MENTOR_EVENTS.START_ACTIVITY].messages,
  },
  [MENTOR_EVENTS.START_QUIZ]: {
    state: MENTOR_STATES.happy,
    messages: translations.quizStart || translations.start || RESPONSES[MENTOR_EVENTS.START_QUIZ].messages,
  },
  [MENTOR_EVENTS.LOW_TIME_WARNING]: {
    state: MENTOR_STATES.thinking,
    messages: translations.lowTime || translations.hint || RESPONSES[MENTOR_EVENTS.LOW_TIME_WARNING].messages,
  },
  [MENTOR_EVENTS.GAME_OVER]: {
    state: MENTOR_STATES.thinking,
    messages: translations.gameOver || translations.wrong || RESPONSES[MENTOR_EVENTS.GAME_OVER].messages,
  },
  [MENTOR_EVENTS.QUIZ_COMPLETE]: {
    state: MENTOR_STATES.celebrating,
    messages: translations.quizComplete || translations.complete || RESPONSES[MENTOR_EVENTS.QUIZ_COMPLETE].messages,
  },
  [MENTOR_EVENTS.IDLE]: {
    state: MENTOR_STATES.idle,
    messages: translations.idle || RESPONSES[MENTOR_EVENTS.IDLE].messages,
  },
  [MENTOR_EVENTS.LEVEL_COMPLETE]: {
    state: MENTOR_STATES.celebrating,
    messages: translations.complete || RESPONSES[MENTOR_EVENTS.LEVEL_COMPLETE].messages,
  },
  [MENTOR_EVENTS.GREETING]: {
    state: MENTOR_STATES.happy,
    messages: translations.greeting || RESPONSES[MENTOR_EVENTS.GREETING].messages,
  },
  [MENTOR_EVENTS.HINT]: {
    state: MENTOR_STATES.thinking,
    messages: translations.hint || RESPONSES[MENTOR_EVENTS.HINT].messages,
  },
  [MENTOR_EVENTS.START_STORY]: {
    state: MENTOR_STATES.happy,
    messages: translations.start || RESPONSES[MENTOR_EVENTS.START_STORY].messages,
  },
  [MENTOR_EVENTS.STORY_PLAY]: {
    state: MENTOR_STATES.speaking,
    messages: translations.hint || RESPONSES[MENTOR_EVENTS.STORY_PLAY].messages,
  },
  [MENTOR_EVENTS.STORY_COMPLETE]: {
    state: MENTOR_STATES.celebrating,
    messages: translations.complete || RESPONSES[MENTOR_EVENTS.STORY_COMPLETE].messages,
  },
});

const speak = (text, language = "en", rate = 0.9, pitch = 1.2) => {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const cleanText = text
    .replace(/\p{Extended_Pictographic}|\p{Emoji_Presentation}|\uFE0F|\u200D/gu, "")
    .trim();

  if (!cleanText) return;

  let didSpeak = false;
  const runSpeak = () => {
    if (didSpeak) return;
    didSpeak = true;

    const voices = window.speechSynthesis.getVoices();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const isHindi = language === "hi";

    // Keep Hindi voice tuning unchanged; English stays male but softer and kid-friendly.
    utterance.rate = isHindi ? rate : 0.96;
    utterance.pitch = isHindi ? pitch : 1.12;
    utterance.volume = 0.8;
    utterance.lang = isHindi ? "hi-IN" : "en-US";

    const preferredVoice =
      isHindi
        ? pickHindiFriendlyVoice(voices)
        : pickEnglishChildFriendlyMaleVoice(voices);

    if (preferredVoice) {
      utterance.voice = preferredVoice;
      // Some engines expose Hindi-capable voices with non-hi language tags.
      // Matching utterance.lang to the selected voice improves playback reliability.
      if (isHindi && preferredVoice.lang) {
        utterance.lang = preferredVoice.lang;
      }
    }

    window.speechSynthesis.speak(utterance);
  };

  // Chrome/Edge often load voices asynchronously; without this, hi-IN may never match a voice.
  if (window.speechSynthesis.getVoices().length) {
    runSpeak();
  } else {
    window.speechSynthesis.addEventListener("voiceschanged", runSpeak, { once: true });
    window.setTimeout(runSpeak, 400);
  }
};

export const processEvent = (event, context = {}, translations = {}) => {
  const response = getMentorResponses(translations)[event];
  if (!response) {
    return {
      state: MENTOR_STATES.idle,
      message: translations.fallback || "Let's keep learning!",
    };
  }

  const message = context.message || pickRandom(response.messages);

  return {
    state: response.state,
    message,
  };
};

export const speakMessage = speak;

export const stopSpeaking = () => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};
