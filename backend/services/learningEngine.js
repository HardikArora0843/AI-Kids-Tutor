import Progress from "../models/Progress.js";

// Topic metadata for recommendations
const ALL_TOPICS = [
  { topic: "alphabet", subTopics: ["A-Z", "phonics", "words"] },
  { topic: "numbers", subTopics: ["counting", "addition", "subtraction"] },
  { topic: "colors", subTopics: ["matching", "mixing", "naming"] },
  { topic: "shapes", subTopics: ["identify", "draw", "compare"] },
  { topic: "quiz", subTopics: ["mixed", "timed", "challenge"] },
  { topic: "story", subTopics: ["reading", "comprehension", "vocabulary"] },
];

/**
 * Analyze a child's performance across all topics.
 *
 * @param {string} childId
 * @returns {Promise<object>} Analysis result
 */
export const analyzePerformance = async (childId) => {
  const objectId = Progress.base.Types.ObjectId.createFromHexString(childId);

  const topicStats = await Progress.aggregate([
    { $match: { childId: objectId } },
    { $sort: { date: 1 } },
    {
      $group: {
        _id: "$topic",
        averageAccuracy: { $avg: "$accuracy" },
        averageTime: { $avg: "$timeSpent" },
        totalAttempts: { $sum: 1 },
        totalCorrect: { $sum: "$correctAnswers" },
        totalQuestions: { $sum: "$totalQuestions" },
        bestAccuracy: { $max: "$accuracy" },
        lastPlayed: { $max: "$date" },
        accuracies: { $push: "$accuracy" },
        difficulties: { $push: "$difficultyLevel" },
      },
    },
    { $sort: { averageAccuracy: 1 } }, // weakest first
  ]);

  // Overall stats
  const overallAgg = await Progress.aggregate([
    { $match: { childId: objectId } },
    {
      $group: {
        _id: null,
        averageAccuracy: { $avg: "$accuracy" },
        totalSessions: { $sum: 1 },
        totalTimeSpent: { $sum: "$timeSpent" },
      },
    },
  ]);

  const overall = overallAgg[0] || {
    averageAccuracy: 0,
    totalSessions: 0,
    totalTimeSpent: 0,
  };

  // Classify topics
  const topics = topicStats.map((t) => ({
    topic: t._id,
    averageAccuracy: Math.round(t.averageAccuracy),
    averageTime: Math.round(t.averageTime),
    totalAttempts: t.totalAttempts,
    attemptsPattern: getAttemptsPattern(t.accuracies),
    bestAccuracy: t.bestAccuracy,
    lastPlayed: t.lastPlayed,
    currentDifficulty: getMostRecent(t.difficulties),
  }));

  const strongTopics = topics.filter((t) => t.averageAccuracy > 75);
  const weakTopics = topics.filter((t) => t.averageAccuracy < 50);
  const moderateTopics = topics.filter(
    (t) => t.averageAccuracy >= 50 && t.averageAccuracy <= 75
  );

  // Topics never attempted
  const attemptedTopicNames = topics.map((t) => t.topic);
  const unattemptedTopics = ALL_TOPICS
    .filter((t) => !attemptedTopicNames.includes(t.topic))
    .map((t) => t.topic);

  return {
    averageAccuracy: Math.round(overall.averageAccuracy),
    totalSessions: overall.totalSessions,
    totalTimeSpent: overall.totalTimeSpent,
    topics,
    strongTopics,
    weakTopics,
    moderateTopics,
    unattemptedTopics,
  };
};

/**
 * Determine the appropriate difficulty level for a child on a topic.
 *
 * @param {string} childId
 * @param {string} topic
 * @returns {Promise<string>} "easy" | "medium" | "hard"
 */
export const getDifficultyLevel = async (childId, topic) => {
  const objectId = Progress.base.Types.ObjectId.createFromHexString(childId);

  // Get last 5 attempts for this topic (recent performance matters more)
  const recent = await Progress.find({ childId: objectId, topic })
    .sort({ date: -1 })
    .limit(5)
    .lean();

  if (recent.length === 0) return "easy";

  const avgAccuracy =
    recent.reduce((sum, r) => sum + r.accuracy, 0) / recent.length;

  // Adaptive logic
  if (avgAccuracy > 80) {
    // Check current difficulty to step up
    const current = recent[0].difficultyLevel || "easy";
    if (current === "easy") return "medium";
    if (current === "medium") return "hard";
    return "hard";
  }

  if (avgAccuracy < 50) {
    // Step down
    const current = recent[0].difficultyLevel || "easy";
    if (current === "hard") return "medium";
    if (current === "medium") return "easy";
    return "easy";
  }

  // Maintain current level
  return recent[0].difficultyLevel || "easy";
};

/**
 * Generate the next learning recommendation for a child.
 *
 * @param {string} childId
 * @returns {Promise<object>} Recommendation
 */
export const getNextRecommendation = async (childId) => {
  const analysis = await analyzePerformance(childId);
  const recentTopics = await getRecentTopicNames(childId);
  const lastTopic = recentTopics[0];

  // Priority 1: if there is no learning history, start with a new topic.
  if (analysis.totalSessions === 0) {
    const topic = analysis.unattemptedTopics[0] || "alphabet";
    const topicMeta = ALL_TOPICS.find((t) => t.topic === topic);
    return {
      topic,
      subTopic: topicMeta ? topicMeta.subTopics[0] : null,
      difficulty: "easy",
      reason: "new_topic",
      message: `Let's explore something new — ${formatTopic(topic)}!`,
    };
  }

  // Priority 2: use a 70/30 mix, while avoiding the exact same recent topic
  // when another useful option exists.
  const weakCandidates = avoidRepeating(analysis.weakTopics, lastTopic);
  const revisionPool =
    analysis.strongTopics.length > 0 ? analysis.strongTopics : analysis.moderateTopics;
  const revisionCandidates = avoidRepeating(revisionPool, lastTopic);
  const shouldPracticeWeak =
    weakCandidates.length > 0 &&
    (Math.random() < 0.7 || revisionCandidates.length === 0);

  if (shouldPracticeWeak) {
    const weakTopic = pickWeighted(weakCandidates);
    const difficulty = await getDifficultyLevel(childId, weakTopic.topic);
    const topicMeta = ALL_TOPICS.find((t) => t.topic === weakTopic.topic);
    return {
      topic: weakTopic.topic,
      subTopic: topicMeta ? pickRandom(topicMeta.subTopics) : null,
      difficulty,
      reason: "weak_topic",
      message: `Let's practice ${formatTopic(weakTopic.topic)} — you'll get stronger!`,
    };
  }

  if (revisionCandidates.length > 0) {
    const revisionTopic = pickRandom(revisionCandidates);
    const difficulty = await getDifficultyLevel(childId, revisionTopic.topic);
    const topicMeta = ALL_TOPICS.find((t) => t.topic === revisionTopic.topic);
    const isStrong = revisionTopic.averageAccuracy > 75;
    return {
      topic: revisionTopic.topic,
      subTopic: topicMeta ? pickRandom(topicMeta.subTopics) : null,
      difficulty,
      reason: isStrong ? "revision" : "practice",
      message: isStrong
        ? `You're doing great in ${formatTopic(revisionTopic.topic)}! Let's level up!`
        : `Let's keep building your ${formatTopic(revisionTopic.topic)} skills!`,
    };
  }

  // Priority 3: introduce an unattempted topic after reviewing real progress.
  if (analysis.unattemptedTopics.length > 0) {
    const topic = pickRandom(analysis.unattemptedTopics);
    const topicMeta = ALL_TOPICS.find((t) => t.topic === topic);
    return {
      topic,
      subTopic: topicMeta ? topicMeta.subTopics[0] : null,
      difficulty: "easy",
      reason: "new_topic",
      message: `Let's explore something new: ${formatTopic(topic)}!`,
    };
  }

  // Fallback: start with alphabet
  return {
    topic: "alphabet",
    subTopic: "A-Z",
    difficulty: "easy",
    reason: "default",
    message: "Let's start your learning adventure with the alphabet!",
  };
};

// --- Helpers ---

function getMostRecent(difficulties) {
  if (!difficulties || difficulties.length === 0) return "easy";
  return difficulties[difficulties.length - 1] || "easy";
}

function getAttemptsPattern(accuracies = []) {
  if (accuracies.length < 2) return "new";

  const recent = accuracies.slice(-3);
  const first = recent[0];
  const last = recent[recent.length - 1];
  const delta = last - first;

  if (delta >= 10) return "improving";
  if (delta <= -10) return "declining";
  return "steady";
}

async function getRecentTopicNames(childId, limit = 3) {
  const objectId = Progress.base.Types.ObjectId.createFromHexString(childId);
  const recent = await Progress.find({ childId: objectId })
    .sort({ date: -1 })
    .limit(limit)
    .select("topic")
    .lean();

  return recent.map((entry) => entry.topic);
}

function avoidRepeating(topics, lastTopic) {
  if (!lastTopic || topics.length <= 1) return topics;
  const filtered = topics.filter((topic) => topic.topic !== lastTopic);
  return filtered.length > 0 ? filtered : topics;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Weight selection towards weaker topics (lower accuracy = higher weight)
function pickWeighted(topics) {
  const weights = topics.map((t) => Math.max(1, 100 - t.averageAccuracy));
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < topics.length; i++) {
    random -= weights[i];
    if (random <= 0) return topics[i];
  }
  return topics[0];
}

function formatTopic(topic) {
  const labels = {
    alphabet: "Alphabet",
    numbers: "Numbers",
    colors: "Colors & Shapes",
    shapes: "Drawing",
    quiz: "Quiz",
    story: "Stories",
  };
  return labels[topic] || topic;
}

// Future:
// integrate OpenAI or ML model for deeper personalization
// - analyze learning velocity (how fast accuracy improves)
// - predict time-to-mastery per topic
// - generate custom practice questions
// - adapt to child's attention span (session length patterns)
