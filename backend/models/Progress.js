import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Child ID is required"],
      index: true,
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
      enum: ["alphabet", "numbers", "colors", "shapes", "quiz", "story"],
      index: true,
    },
    subTopic: {
      type: String,
      default: "",
    },
    score: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    attempts: {
      type: Number,
      default: 1,
    },
    difficultyLevel: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index for fast topic-based queries per child
progressSchema.index({ childId: 1, topic: 1 });

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;
