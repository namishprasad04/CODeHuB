import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Registration failed!", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user && !(await user.comparedPassword(password)))
      return res.status(401).json({ message: "Invalid Credentials" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(400).json({ message: "Login failed", error: error.message });
  }
};

export { register, login };
