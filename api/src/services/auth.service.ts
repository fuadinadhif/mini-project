import bcrypt from "bcrypt";

import { prisma } from "@/configs/prisma.config.js";
import { generateReferralCode } from "../utils/generate-code.js";
import { AppError } from "@/errors/app.error.js";
import { CreateUserInput } from "@/types/user.type.js";
import { ReferralService } from "./referral-service.js";

export class AuthService {
  private referralService = new ReferralService();

  isEmailTaken = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    return Boolean(user);
  };

  hashPassword = async (password: string) => {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
  };

  registerUser = async ({
    name,
    email,
    password,
    profilePic,
    referralCode,
  }: CreateUserInput) => {
    const isEmailTaken = await this.isEmailTaken(email);
    if (isEmailTaken) throw new AppError("Email already registered", 409);

    const hashedPassword = await this.hashPassword(password);
    const userReferralCode = generateReferralCode(name);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        referralCode: userReferralCode,
        profilePic,
      },
      omit: { password: true },
    });

    if (referralCode) {
      await this.referralService.applyReferral(
        referralCode,
        user.id,
        user.name
      );
    }

    return user;
  };
}
