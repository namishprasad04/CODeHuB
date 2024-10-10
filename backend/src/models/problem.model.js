import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    starterCode: {
      javascript: { type: String, required: true },
      python: { type: String, required: true },
      java: { type: String, required: true },
      c: { type: String, required: true },
      cpp: { type: String, required: true },
    },
    constraints: [String],
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    testCases: [{ input: String, output: String }],
    score: { type: Number, default: 0 },
    userTried: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
