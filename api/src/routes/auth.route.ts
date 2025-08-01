import express from "express";

import { AuthController } from "@/controllers/auth.controller.js";

const router = express.Router();
const authController = new AuthController();

router.route("/register").post(authController.register);

export default router;
