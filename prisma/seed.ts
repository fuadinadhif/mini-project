import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

import { prisma } from "@/configs/prisma.config.js";
import { logger } from "@/utils/logger.js";

async function seed() {
  try {
    logger.info(`Seed started...\n`);

    /* ------------------------ Delete all previous data ------------------------ */
    logger.info(`Delete all previous data...`);
    await prisma.user.deleteMany();
    logger.info(`All previous data has been deleted.\n`);

    /* ----------------------------- Create new data ---------------------------- */
    logger.info(`Start creating new data...`);

    for (let i = 0; i <= 10; i++) {
      const name = faker.person.fullName();
      const email = faker.internet.email();
      const password = await bcrypt.hash("newpass", 10);
      const profilePic = faker.image.avatar();

      await prisma.user.create({ data: { name, email, password, profilePic } });

      logger.info(`${name} data has been created.`);
    }

    logger.info(`\nSeed finished successfully`);
  } catch (error) {
    logger.error(`Seed error:`, error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
