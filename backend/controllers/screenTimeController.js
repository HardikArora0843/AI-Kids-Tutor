import ScreenTime from "../models/ScreenTime.js";
import User from "../models/User.js";

// Helper: check if date changed (daily reset)
const shouldResetDaily = (lastUpdated) => {
  const last = new Date(lastUpdated);
  const now = new Date();
  return (
    last.getFullYear() !== now.getFullYear() ||
    last.getMonth() !== now.getMonth() ||
    last.getDate() !== now.getDate()
  );
};

// Helper: get or create screen time record
const getOrCreate = async (childId) => {
  let record = await ScreenTime.findOne({ childId });
  if (!record) {
    record = await ScreenTime.create({ childId });
  }

  // Daily reset
  if (shouldResetDaily(record.lastUpdated)) {
    record.usedTime = 0;
    record.isLocked = false;
    record.lastUpdated = new Date();
    await record.save();
  }

  return record;
};

// @desc    Parent sets daily screen time limit
// @route   POST /api/screentime/set-limit
export const setLimit = async (req, res) => {
  try {
    if (req.user.role !== "parent") {
      return res.status(403).json({ message: "Only parents can set limits" });
    }

    const { childId, dailyLimit, allowLearningOnly } = req.body;

    if (!childId || dailyLimit === undefined) {
      return res.status(400).json({ message: "childId and dailyLimit are required" });
    }

    // Verify child belongs to this parent
    const child = await User.findById(childId);
    if (!child || child.role !== "child" || child.parentId?.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized for this child" });
    }

    let record = await getOrCreate(childId);
    record.dailyLimit = dailyLimit;
    if (allowLearningOnly !== undefined) {
      record.allowLearningOnly = allowLearningOnly;
    }
    await record.save();

    res.json({ message: "Limit updated", record });
  } catch (error) {
    console.error("Set limit error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get screen time status for a child
// @route   GET /api/screentime/status/:childId
export const getStatus = async (req, res) => {
  try {
    const { childId } = req.params;

    // Allow child or parent to check status
    if (req.user.id.toString() !== childId && req.user.role !== "parent") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const record = await getOrCreate(childId);

    const dailyLimitSeconds = record.dailyLimit * 60;
    const remainingSeconds = Math.max(0, dailyLimitSeconds - record.usedTime);
    const usedMinutes = Math.floor(record.usedTime / 60);
    const percentUsed = dailyLimitSeconds > 0
      ? Math.min(100, Math.round((record.usedTime / dailyLimitSeconds) * 100))
      : 0;

    res.json({
      dailyLimit: record.dailyLimit,
      usedTime: record.usedTime,
      usedMinutes,
      remainingSeconds,
      percentUsed,
      isLocked: record.isLocked,
      allowLearningOnly: record.allowLearningOnly,
    });
  } catch (error) {
    console.error("Get status error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Child updates usage time
// @route   POST /api/screentime/update-usage
export const updateUsage = async (req, res) => {
  try {
    if (req.user.role !== "child") {
      return res.status(403).json({ message: "Only children update usage" });
    }

    const { seconds } = req.body;
    if (!seconds || seconds < 0) {
      return res.status(400).json({ message: "Valid seconds required" });
    }

    const record = await getOrCreate(req.user.id);

    record.usedTime += seconds;
    record.lastUpdated = new Date();

    // Auto-lock if limit exceeded
    const dailyLimitSeconds = record.dailyLimit * 60;
    if (record.usedTime >= dailyLimitSeconds) {
      record.isLocked = true;
    }

    await record.save();

    res.json({
      usedTime: record.usedTime,
      isLocked: record.isLocked,
      remainingSeconds: Math.max(0, dailyLimitSeconds - record.usedTime),
    });
  } catch (error) {
    console.error("Update usage error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Parent manually toggles lock
// @route   POST /api/screentime/toggle-lock
export const toggleLock = async (req, res) => {
  try {
    if (req.user.role !== "parent") {
      return res.status(403).json({ message: "Only parents can toggle lock" });
    }

    const { childId, isLocked } = req.body;

    if (!childId || isLocked === undefined) {
      return res.status(400).json({ message: "childId and isLocked are required" });
    }

    // Verify child belongs to parent
    const child = await User.findById(childId);
    if (!child || child.role !== "child" || child.parentId?.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized for this child" });
    }

    const record = await getOrCreate(childId);
    record.isLocked = isLocked;
    await record.save();

    res.json({ message: isLocked ? "App locked" : "App unlocked", record });
  } catch (error) {
    console.error("Toggle lock error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
