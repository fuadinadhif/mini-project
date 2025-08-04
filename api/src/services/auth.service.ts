import bcrypt from "bcrypt";
import crypto from "crypto";
import { createAvatar } from "@dicebear/core";
import { dylan } from "@dicebear/collection";

import { Prisma } from "@/generated/prisma/index.js";
import { prisma } from "@/configs/prisma.config.js";
import { generateReferralCode } from "../utils/generate-code.js";
import { ReferralService } from "./referral-service.js";
import { AppError } from "@/errors/app.error.js";
import { CreateUserSchema } from "@/schemas/auth.schema.js";
import { EmailService } from "./email.service.js";

export class AuthService {
  private referralService = new ReferralService();
  private emailService = new EmailService();
  private maxRetries = 3;

  isEmailTaken = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    return Boolean(user);
  };

  createRegistrationToken = async (
    email: string,
    tx: Prisma.TransactionClient
  ) => {
    await tx.registrationToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });

    const existingToken = await tx.registrationToken.findFirst({
      where: { email },
    });

    if (existingToken)
      throw new AppError(
        "Registration request already pending. Please check your email"
      );

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

    await tx.registrationToken.create({
      data: { email, token, expiresAt },
    });

    return token;
  };

  requestRegistration = async (email: string) => {
    let attempt = 0;
    let lastErrorMessage: string = "Unknown error";

    while (attempt < this.maxRetries) {
      try {
        return await prisma.$transaction(async (tx) => {
          const token = await this.createRegistrationToken(email, tx);
          await this.emailService.sendConfirmationEmail(email, token);
          return token;
        });
      } catch (error) {
        lastErrorMessage =
          error instanceof Error ? error.message : "Unknown error";
        attempt++;
        if (attempt < this.maxRetries) {
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * 2 ** attempt)
          );
        }
      }
    }

    throw new AppError(
      `Failed to send confirmation email after ${this.maxRetries} attempts: ${lastErrorMessage}`,
      500
    );
  };

  validateToken = async (token: string) => {
    const found = await prisma.registrationToken.findUnique({
      where: { token },
    });

    if (!found || found.expiresAt < new Date()) {
      if (found) {
        await prisma.registrationToken.delete({ where: { token } });
      }
      return null;
    }

    return found.email;
  };

  createUser = async ({
    name,
    email,
    password,
    referralCode,
    profilePic,
  }: CreateUserSchema) => {
    const hashedPassword = await bcrypt.hash(password, 12);
    const userReferralCode = generateReferralCode(name);
    const defaultAvatar = createAvatar(dylan).toDataUri();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profilePic: profilePic || defaultAvatar,
        referralCode: userReferralCode,
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
