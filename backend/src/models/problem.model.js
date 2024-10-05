import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    difficulty: String,
    examples: [{ input: String, output: String }],
    constraints: [String],
    testCases: [{ input: String, output: String }],
    score: { type: Number, default: 0 },
    userTried: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
