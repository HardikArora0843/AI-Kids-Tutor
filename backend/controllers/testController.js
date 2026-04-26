import Test from "../models/Test.js";
import User from "../models/User.js";
import Progress from "../models/Progress.js";
import { generateTest } from "../services/testGenerator.js";

export const createTest = async (req, res) => {
  try {
    if (req.user.role !== "parent") {
      return res.status(403).json({ message: "Only parents can create tests" });
    }

    const {
      childId,
      topic = "alphabet",
      difficulty = "easy",
      numberOfQuestions = 5,
      weakFocus = false,
    } = req.body;

    if (!childId) {
      return res.status(400).json({ message: "childId is required" });
    }

    const child = await User.findById(childId);
    if (!child || child.role !== "child" || child.parentId?.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized for this child" });
    }

    const generated = await generateTest(
      childId,
      topic,
      difficulty,
      numberOfQuestions,
      weakFocus
    );

    const test = await Test.create({
      parentId: req.user.id,
      childId,
      topic: generated.topic,
      difficulty: generated.difficulty,
      numberOfQuestions: generated.numberOfQuestions,
      questions: generated.questions,
    });

    res.status(201).json({
      message: "Test created",
      test,
      focusAreas: generated.focusAreas,
    });
  } catch (error) {
    console.error("Create test error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTestsForChild = async (req, res) => {
  try {
    const { childId } = req.params;

    if (req.user.role === "child" && req.user.id.toString() !== childId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (req.user.role === "parent") {
      const child = await User.findById(childId);
      if (!child || child.parentId?.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: "Not authorized for this child" });
      }
    }

    const query = { childId };
    if (req.user.role === "child") {
      query.attemptedByChild = false;
    }

    const tests = await Test.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.json(tests);
  } catch (error) {
    console.error("Get tests error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const submitTest = async (req, res) => {
  try {
    if (req.user.role !== "child") {
      return res.status(403).json({ message: "Only children can submit tests" });
    }

    const { testId, answers = [], timeSpent = 0 } = req.body;
    if (!testId || !Array.isArray(answers)) {
      return res.status(400).json({ message: "testId and answers are required" });
    }

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    if (test.childId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized for this test" });
    }
    if (test.attemptedByChild) {
      return res.status(409).json({ message: "This test is already completed." });
    }

    const totalQuestions = test.questions.length;
    const correctAnswers = test.questions.reduce((count, question, index) => {
      return answers[index] === question.correctAnswer ? count + 1 : count;
    }, 0);
    const accuracy =
      totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const score = correctAnswers;

    const progress = await Progress.create({
      childId: req.user.id,
      topic: test.topic,
      subTopic: "custom-test",
      score,
      totalQuestions,
      correctAnswers,
      accuracy,
      timeSpent,
      attempts: 1,
      difficultyLevel: test.difficulty,
    });

    test.attemptedByChild = true;
    test.attemptedAt = new Date();
    await test.save();

    res.json({
      message: "Test submitted",
      score,
      correctAnswers,
      totalQuestions,
      accuracy,
      progress,
    });
  } catch (error) {
    console.error("Submit test error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
