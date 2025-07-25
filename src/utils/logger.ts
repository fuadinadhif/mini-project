import { createLogger, transports, format } from "winston";
import path from "node:path";

const logFormat = format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] [${level}]: ${message}`;
});

export const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DDTHH:mm:ss.SSSZ" }),
    logFormat
  ),
  transports: [
    new transports.File({
      filename: path.resolve("logs/error.log"),
      level: "error",
    }),
    new transports.File({
      filename: path.resolve("logs/combined.log"),
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: "YYYY-MM-DDTHH:mm:ss.SSSZ" }),
        logFormat
      ),
    })
  );
}
