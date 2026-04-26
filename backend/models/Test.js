import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (options) => options.length >= 2,
        message: "Each question needs at least two options",
      },
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["mcq", "match", "identify"],
      default: "mcq",
    },
  },
  { _id: false }
);

const testSchema = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    topic: {
      type: String,
      enum: ["alphabet", "numbers", "colors", "shapes"],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    numberOfQuestions: {
      type: Number,
      min: 1,
      max: 20,
      required: true,
    },
    questions: {
      type: [questionSchema],
      required: true,
      default: [],
    },
    attemptedByChild: {
      type: Boolean,
      default: false,
      index: true,
    },
    attemptedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

testSchema.index({ childId: 1, createdAt: -1 });

const Test = mongoose.model("Test", testSchema);

export default Test;
