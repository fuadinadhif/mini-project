import { logger } from "@/utils/logger.js";
import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction
) {
  logger.error(error);

  response.status(500).json({
    message:
      error instanceof Error ? error.message : "General error. Good luck",
  });
}
