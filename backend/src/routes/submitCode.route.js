import express from "express";
import { runCode, runTestCases, submitSolution } from "../controllers/submitCode.controller.js";

const router = express.Router();

router.post("/run", runCode);
router.post("/test/:id", runTestCases);
router.post("/submit/:id", submitSolution);

export { router };