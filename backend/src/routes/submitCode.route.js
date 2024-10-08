import express from "express";
import { runCode} from "../controllers/submitCode.controller.js";

const router = express.Router();

router.post("/:id/run", runCode);

export { router };