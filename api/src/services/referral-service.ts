import { prisma } from "@/configs/prisma.config.js";
import { AppError } from "@/errors/app.error.js";
import { generateCouponCode } from "@/utils/generate-code.js";

export class ReferralService {
  async applyReferral(
    referralCode: string,
    newUserId: number,
    newUserName: string
  ) {
    const referredUser = await prisma.user.findUnique({
      where: { referralCode },
    });

    if (!referredUser) {
      throw new AppError("Referral code not found", 404);
    }

    await prisma.$transaction(async (tx) => {
      await tx.point.create({
        data: {
          userId: referredUser.id,
          amount: 20000,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        },
      });

      await tx.coupon.create({
        data: {
          userId: newUserId,
          code: generateCouponCode(newUserName),
          nominal: 25,
        },
      });
    });
  }
}
