import path from "node:path";
import fs from "node:fs/promises";
import handlebars from "handlebars";
import { resend } from "@/configs/resend.config.js";

import { AppError } from "@/errors/app.error.js";

export class EmailService {
  getEmailTemplate = async (emailTemplateName: string) => {
    const templatePath = path.resolve(
      "src",
      "templates",
      "email",
      `${emailTemplateName}`
    );

    try {
      const templateSource = await fs.readFile(templatePath, "utf-8");
      const templateCompiled = handlebars.compile(templateSource);
      return templateCompiled;
    } catch (error) {
      throw new AppError(`Email template ${emailTemplateName} not found`, 404);
    }
  };

  sendConfirmationEmail = async (email: string, token: string) => {
    const confirmationLink = `${process.env.WEB_URL}/auth/register/completion?token=${token}`;

    const templateCompiled = await this.getEmailTemplate(
      "registration-confirmation.emails.hbs"
    );

    const templateHtml = templateCompiled({
      confirmationLink,
      year: new Date().getFullYear(),
    });

    const { data, error } = await resend.emails.send({
      from: "Purwadhika <no-reply@purwadhika.my.id>",
      to: [email],
      subject: "Confirm Your Registration",
      html: templateHtml,
    });

    if (error) {
      console.error(error);
      throw new AppError(`Failed to send email: ${error.message}`, 500);
    }

    console.log(data);
    return data;
  };
}
