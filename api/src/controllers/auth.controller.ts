import { Request, Response, NextFunction } from "express";

import { AuthService } from "@/services/auth.service.js";
import { AppError } from "@/errors/app.error.js";
import { emailSchema } from "@/schemas/email.schema.js";
import { createUserSchema, tokenQuerySchema } from "@/schemas/auth.schema.js";

export class AuthController {
  private authService = new AuthService();

  requestRegistration = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = emailSchema.parse(request.body);

      const isEmailTaken = await this.authService.isEmailTaken(email);
      if (isEmailTaken) throw new AppError("Email already registerd", 409);

      await this.authService.requestRegistration(email);

      response
        .status(200)
        .json({ message: "Registration email confirmation email sent" });
    } catch (error) {
      next(error);
    }
  };

  verifyToken = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { token } = tokenQuerySchema.parse(request.query);

      const email = await this.authService.validateToken(token as string);
      if (!email) throw new AppError("Invalid or expired token", 400);

      response
        .status(200)
        .json({ message: "Confirmation email validated", email });
    } catch (error) {
      next(error);
    }
  };

  completeRegistration = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { name, email, password, profilePic, referralCode } =
        createUserSchema.parse(request.body);

      const user = await this.authService.createUser({
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
