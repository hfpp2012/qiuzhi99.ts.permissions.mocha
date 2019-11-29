import express, { Express, Request, Response } from "express";

// database
import mongoose from "mongoose";

// error handler
import errorMiddleware from "./middlewares/error.middleware";
import nodeErrorHandler from "./middlewares/nodeErrorHandler.middleware";

// config
import "dotenv/config";
import config from "./config/config";

// middleware
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes";

// logger
import { Logger, ILogger } from "./utils/logger";
import notFoundError from "./middlewares/notFoundHandler.middleware";

export class Application {
  app: Express;
  config = config;
  logger: ILogger;

  constructor() {
    this.logger = new Logger(__filename);
    this.app = express();
    this.app.use(require("express-status-monitor")());
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(
      morgan("dev", {
        skip: () => config.environment === "test"
      })
    );

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.get("/", (_req: Request, res: Response) => {
      res.json({
        message: "hello world"
      });
    });

    this.app.use("/api", routes);

    this.app.use(notFoundError);

    this.app.use(errorMiddleware);
  }

  setupDbAndServer = async () => {
    await this.setupDb();
    await this.startServer();
  };

  setupDb = async () => {
    mongoose.set("useFindAndModify", false);
    await mongoose.connect(config.db.hostUrl!, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    this.logger.info(`Connected to database. Connection: ${config.db.hostUrl}`);
  };

  startServer = (): Promise<boolean> => {
    return new Promise((resolve, _reject) => {
      this.app
        .listen(+this.config.port, this.config.host, () => {
          this.logger.info(
            `Server started at http://${this.config.host}:${this.config.port}`
          );
          resolve(true);
        })
        .on("error", nodeErrorHandler);
    });
  };
}
