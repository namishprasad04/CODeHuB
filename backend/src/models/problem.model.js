import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  input: {
    nums: [Number],
    target: Number
  },
  output: [Number],
  explanation: { type: String, required: false },
});

const problemSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    difficulty: String,
    examples: [exampleSchema], // Update this line to use the exampleSchema
    initialCode: {
      javascript: String,
      python: String,
      java: String,
      cpp: String,
    },
    score: { type: Number, default: 0 },
    userTried: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 },
    constraints: {
      memoryLimit: { type: Number, required: true },
      timeLimit: { type: Number, required: true }
    }
  },
  { timestamps: true }
);

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;
