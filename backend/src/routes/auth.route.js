import express from "express";
import { getUser, login, register } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/get-user/:id", getUser);

export default router;
