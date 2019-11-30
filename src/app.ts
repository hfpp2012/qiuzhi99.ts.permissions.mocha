import express, { Express, Request, Response } from "express";

// database
import mongoose from "mongoose";

// error handler
import errorMiddleware from "./middlewares/error.middleware";

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

// model
import User from "./models/User";

import bcrypt from "bcryptjs";

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
    await this.createUser();
  };

  setupDb = async () => {
    mongoose.set("useFindAndModify", false);
    const mongodbUrl = `${config.db.host}:${config.db.port}/${config.db.database}`;
    await mongoose.connect(mongodbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    this.logger.info(`Connected to database. Connection: ${mongodbUrl}`);
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
        .on("error", err => console.error(err));
    });
  };

  createUser = async (): Promise<any> => {
    try {
      const user = await User.findOne({ username: config.user.username });
      if (user) return;

      const hashedPassword = await bcrypt.hash(config.user.password, 10);

      let newUser = new User({
        username: config.user.username,
        password: hashedPassword,
        email: config.user.email
      });

      await newUser.save();
    } catch (error) {
      return Promise.reject(error);
    }
  };
}
