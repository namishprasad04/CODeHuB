import User from "../models/user.model.js";

// Controller for handling code submission
export const submitCode = async (req, res) => {
  try {
    const { id, status } = req.body; // Assuming you're sending userId and the status of the submission

    // Find the user by their ID (Mongoose will handle ObjectId conversion)
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the code status is "Accepted"
    if (status.toLowerCase() === "accepted") {
      const points = 100; // Points for solving the problem

      // Update user's score directly
      user.score += points;
      await user.save(); // Save the updated score in the database

      return res.status(200).json({
        message: "Code accepted, score updated!",
        score: user.score,
      });
    } else {
      return res.status(200).json({
        message: "Code not accepted, no score change",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
