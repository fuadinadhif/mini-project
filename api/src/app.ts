import express, { Application, Request, Response } from "express";

import { logger } from "@/utils/logger.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";

import authRoutes from "@/routes/auth.route.js";

export class App {
  public readonly app: Application;

  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorMiddlewares();
  }

  setupMiddlewares() {
    this.app.use(express.json());
  }

  setupRoutes() {
    this.app.get("/api/health", (request: Request, response: Response) => {
      response.status(200).json({
        message: "API is running",
        uptime: `${process.uptime().toFixed(2)} seconds`,
      });
    });

    this.app.use("/api/auth", authRoutes);
  }

  setupErrorMiddlewares() {
    this.app.use(notFoundMiddleware);
    this.app.use(errorMiddleware);
  }

  listen(port: string) {
    this.app.listen(port, () =>
      logger.info(`Server is listening on port: ${port}`)
    );
  }
}
