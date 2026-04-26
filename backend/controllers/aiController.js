import {
  analyzePerformance,
  getNextRecommendation,
} from "../services/learningEngine.js";

// @desc    Get full AI analysis for a child
// @route   GET /api/ai/analysis/:childId
export const getAnalysis = async (req, res) => {
  try {
    const { childId } = req.params;

    // Only parent or the child themselves
    if (req.user.id.toString() !== childId && req.user.role !== "parent") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const analysis = await analyzePerformance(childId);
    res.json(analysis);
  } catch (error) {
    console.error("AI analysis error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get next learning recommendation
// @route   GET /api/ai/recommendation/:childId
export const getRecommendation = async (req, res) => {
  try {
    const { childId } = req.params;

    if (req.user.id.toString() !== childId && req.user.role !== "parent") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const recommendation = await getNextRecommendation(childId);
    res.json(recommendation);
  } catch (error) {
    console.error("AI recommendation error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
