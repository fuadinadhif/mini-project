import { Request, Response, NextFunction } from "express";

import { AuthService } from "@/services/auth.service.js";

export class AuthController {
  private authService = new AuthService();

  register = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { name, email, password, profilePic, referralCode } = request.body;

      const user = await this.authService.registerUser({
        name,
        email,
        password,
        profilePic,
        referralCode,
      });

      response.status(201).json({ message: "User created", user });
    } catch (error) {
      next(error);
    }
  };
}
