import mongoose from "mongoose";

const screenTimeSchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    dailyLimit: {
      type: Number,
      default: 60, // minutes
      min: 0,
    },
    usedTime: {
      type: Number,
      default: 0, // seconds
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    allowLearningOnly: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ScreenTime = mongoose.model("ScreenTime", screenTimeSchema);

export default ScreenTime;
