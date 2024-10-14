import express from "express";
import { getUser, login, register } from "../controllers/auth.controller.js";
import User from "../models/user.model.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/get-user/:id", getUser);

router.get("/get-users", async (req, res) => {
  try {
    const users = await User.find({}, "username attemptedProblems score");

    const leaderboardData = users.map((user) => ({
      username: user.username,
      problemsSolved: user.attemptedProblems.filter(
        (problem) => problem.hasSubmitted
      ).length,
      overallScore: user.score,
    }));

    // Sort by overall score in descending order
    leaderboardData.sort((a, b) => b.overallScore - a.overallScore);

    // Add rank
    leaderboardData.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    res.json(leaderboardData);
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    res.status(500).json({ message: "Server error" });
  }
});
export { router };
