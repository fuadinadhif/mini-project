import { logger } from "@/utils/logger.js";
import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const errorMessage =
    error instanceof Error
      ? error.stack || error.message
      : typeof error === "object"
      ? JSON.stringify(error)
      : String(error);

  const isDev = process.env.NODE_ENV !== "production";

  logger.error(errorMessage);

  response.status(500).json({
    message: isDev ? errorMessage.split("\n") : "Internal server error",
  });
}
