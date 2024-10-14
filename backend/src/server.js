import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { router as authRoute } from "./routes/auth.route.js";
import { router as problemRoute } from "./routes/problem.route.js";
import { router as codeRoutes } from "./routes/submitCode.route.js";

dotenv.config();

const __dirname = path.resolve();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log("MongoDB connection err:", err));

app.use("/api/auth", authRoute);
app.use("/api/problems", problemRoute);
app.use("/api/problem", codeRoutes);

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
