import express from "express";

import { AuthController } from "@/controllers/auth.controller.js";

const router = express.Router();
const authController = new AuthController();

router.route("/register/request").post(authController.requestRegistration);
router.route("/register/verify").get(authController.verifyToken);
router.route("/register/complete").post(authController.completeRegistration);

export default router;
