import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    starterCode: { type: String, required: true },
    examples: [{
      input: String,
      output: String,
      explanation: String
    }],
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
