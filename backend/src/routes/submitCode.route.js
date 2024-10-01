import express from "express";
import { submitCode } from "../controllers/submitCode.controller.js";

const router = express.Router();

// POST route to handle code submission
router.post("/submit",submitCode);

export { router };
