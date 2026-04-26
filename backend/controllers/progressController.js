import Progress from "../models/Progress.js";

// @desc    Save a new progress entry
// @route   POST /api/progress/save
export const saveProgress = async (req, res) => {
  try {
    const {
      topic,
      subTopic,
      score,
      totalQuestions,
      correctAnswers,
      timeSpent,
      attempts,
      difficultyLevel,
    } = req.body;

    if (!topic || totalQuestions === undefined) {
      return res
        .status(400)
        .json({ message: "Topic and totalQuestions are required" });
    }

    // Auto-calculate accuracy
    const safeTotal = Number.isFinite(Number(totalQuestions))
      ? Math.max(0, Number(totalQuestions))
      : 0;
    const safeCorrect = Number.isFinite(Number(correctAnswers))
      ? Math.max(0, Number(correctAnswers))
      : 0;
    const boundedCorrect = Math.min(safeCorrect, safeTotal);
    const accuracy = safeTotal > 0 ? Math.round((boundedCorrect / safeTotal) * 100) : 0;

    const progress = await Progress.create({
      childId: req.user.id, // from auth middleware
      topic,
      subTopic,
      score,
      totalQuestions: safeTotal,
      correctAnswers: boundedCorrect,
      accuracy,
      timeSpent,
      attempts,
      difficultyLevel,
    });

    res.status(201).json({ message: "Progress saved", progress });
  } catch (error) {
    console.error("Save progress error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all progress for a child
// @route   GET /api/progress/:childId
export const getChildProgress = async (req, res) => {
  try {
    const { childId } = req.params;

    // Only allow the child themselves or their parent to view
    if (req.user.id.toString() !== childId && req.user.role !== "parent") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const progress = await Progress.find({ childId })
      .sort({ date: -1 })
      .lean();

    res.json(progress);
  } catch (error) {
    console.error("Get progress error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get aggregated stats per topic for a child
// @route   GET /api/progress/stats/:childId
export const getTopicStats = async (req, res) => {
  try {
    const { childId } = req.params;

    if (req.user.id.toString() !== childId && req.user.role !== "parent") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const stats = await Progress.aggregate([
      { $match: { childId: Progress.base.Types.ObjectId.createFromHexString(childId) } },
      {
        $group: {
          _id: "$topic",
          averageAccuracy: { $avg: "$accuracy" },
          totalAttempts: { $sum: "$attempts" },
          totalTimeSpent: { $sum: "$timeSpent" },
          totalScore: { $sum: "$score" },
          bestAccuracy: { $max: "$accuracy" },
          lastPlayed: { $max: "$date" },
        },
      },
      { $sort: { lastPlayed: -1 } },
    ]);

    // Transform to a more usable format
    const result = stats.map((s) => ({
      topic: s._id,
      averageAccuracy: Math.round(s.averageAccuracy),
      totalAttempts: s.totalAttempts,
      totalTimeSpent: s.totalTimeSpent,
      totalScore: s.totalScore,
      bestAccuracy: s.bestAccuracy,
      lastPlayed: s.lastPlayed,
    }));

    res.json(result);
  } catch (error) {
    console.error("Get stats error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get full analytics for a child (parent dashboard)
// @route   GET /api/progress/analytics/:childId
export const getAnalytics = async (req, res) => {
  try {
    const { childId } = req.params;

    if (req.user.role !== "parent") {
      return res.status(403).json({ message: "Only parents can view analytics" });
    }

    const objectId = Progress.base.Types.ObjectId.createFromHexString(childId);

    // Overall stats
    const overallAgg = await Progress.aggregate([
      { $match: { childId: objectId } },
      {
        $group: {
          _id: null,
          totalTimeSpent: { $sum: "$timeSpent" },
          totalSessions: { $sum: 1 },
          averageAccuracy: { $avg: "$accuracy" },
          totalScore: { $sum: "$score" },
        },
      },
    ]);

    const overall = overallAgg[0] || {
      totalTimeSpent: 0,
      totalSessions: 0,
      averageAccuracy: 0,
      totalScore: 0,
    };

    // Topic breakdown
    const topicBreakdown = await Progress.aggregate([
      { $match: { childId: objectId } },
      {
        $group: {
          _id: "$topic",
          averageAccuracy: { $avg: "$accuracy" },
          totalAttempts: { $sum: "$attempts" },
          totalTimeSpent: { $sum: "$timeSpent" },
          bestAccuracy: { $max: "$accuracy" },
          lastPlayed: { $max: "$date" },
        },
      },
      { $sort: { lastPlayed: -1 } },
    ]);

    const topics = topicBreakdown.map((t) => ({
      topic: t._id,
      averageAccuracy: Math.round(t.averageAccuracy),
      totalAttempts: t.totalAttempts,
      totalTimeSpent: t.totalTimeSpent,
      bestAccuracy: t.bestAccuracy,
      lastPlayed: t.lastPlayed,
    }));

    // Weak / Strong classification
    const strongTopics = topics.filter((t) => t.averageAccuracy > 75);
    const weakTopics = topics.filter((t) => t.averageAccuracy < 50);

    // Last 7 days activity
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyActivity = await Progress.aggregate([
      {
        $match: {
          childId: objectId,
          date: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          sessions: { $sum: 1 },
          avgAccuracy: { $avg: "$accuracy" },
          timeSpent: { $sum: "$timeSpent" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill in missing days with zeros
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const found = dailyActivity.find((a) => a._id === key);
      last7Days.push({
        date: key,
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        sessions: found ? found.sessions : 0,
        accuracy: found ? Math.round(found.avgAccuracy) : 0,
        timeSpent: found ? found.timeSpent : 0,
      });
    }

    // Recent timeline (last 20 entries)
    const timeline = await Progress.find({ childId: objectId })
      .sort({ date: -1 })
      .limit(20)
      .lean();

    res.json({
      overview: {
        totalTimeSpent: overall.totalTimeSpent,
        totalSessions: overall.totalSessions,
        averageAccuracy: Math.round(overall.averageAccuracy),
        totalScore: overall.totalScore,
        topicsCompleted: topics.length,
      },
      topics,
      strongTopics,
      weakTopics,
      last7Days,
      timeline,
    });
  } catch (error) {
    console.error("Analytics error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
