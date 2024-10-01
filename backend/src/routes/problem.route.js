import express from "express";
import {
  createProblem,
  getAllProblems,
  getProblemById,
} from "../controllers/problem.controller.js";

const router = express.Router();

router.get("/", getAllProblems);
router.get("/:id", getProblemById);
router.post("/", createProblem);

export { router };
