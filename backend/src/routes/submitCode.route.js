import express from "express";
import { runCode } from "../controllers/submitCode.controller.js";
import Problem from "../models/problem.model.js";
import User from "../models/user.model.js";

const router = express.Router();

router.post("/:id/run", runCode);

// POST route for submitting a solution
router.post("/:id/submit", async (req, res) => {
  const { id } = req.params; // Problem ID
  const { userId, isCorrect } = req.body; // User ID and whether the solution is correct

  try {
    const problem = await Problem.findById(id);
    const user = await User.findById(userId);

    if (!problem || !user) {
      return res.status(404).json({ message: "Problem or user not found" });
    }

    // Ensure user.attemptedProblems is initialized
    user.attemptedProblems = user.attemptedProblems || [];

    // Check if the user has already submitted this problem
    const attemptedProblem = user.attemptedProblems.find(
      (attempt) => attempt.problemId.toString() === id
    );

    // If not yet submitted, update the user and problem
    if (!attemptedProblem) {
      user.attemptedProblems.push({
        problemId: id,
        hasSubmitted: true,
      });
    } else if (attemptedProblem.hasSubmitted) {
      return res.status(400).json({
        message: "You have already submitted a solution for this problem",
      });
    } else {
      attemptedProblem.hasSubmitted = true; // Mark as submitted
    }

    // Increment the problem's userTried count for every submission
    problem.userTried = (problem.userTried || 0) + 1;

    // Increase user's score by the problem's score
    user.score += problem.score;

    // Increment successful attempts if the solution is correct
    if (isCorrect) {
      problem.successfulAttempts = (problem.successfulAttempts || 0) + 1; // Increment successful attempts

      // Check if the user is already in the solvedBy array
      if (!problem.solvedBy.includes(user._id)) {
        problem.solvedBy.push(user._id); // Add user to solvedBy if not already present
      }
    }

    // Calculate the success rate: (successfulAttempts / userTried) * 100
    if (problem.userTried > 0) {
      problem.successRate =
        ((problem.successfulAttempts || 0) / problem.userTried) * 100;
    } else {
      problem.successRate = 0; // Set to 0 if userTried is 0 to avoid NaN
    }

    // Save the user and problem after updates
    await user.save();
    await problem.save();

    res.json({
      message: "Solution submitted successfully!",
      newScore: user.score,
      successRate: problem.successRate, // Include the success rate in the response
    });
  } catch (error) {
    console.error("Error submitting solution:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export { router };
