import express, { Express, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { NOT_FOUND } from "http-status-codes";
import HttpException from "./exceptions/HttpException";
import errorMiddleware from "./middlewares/error.middleware";
import "dotenv/config";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes";

const app: Express = express();

app.use(require("express-status-monitor")());
app.use(helmet());
app.use(cors());
app.use(
  morgan("dev", {
    skip: () => process.env.NODE_ENV === "test"
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "hello world"
  });
});

app.use("/api", routes);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  const error: HttpException = new HttpException(NOT_FOUND, "Router Not Found");
  next(error);
});

app.use(errorMiddleware);

const port: any = process.env.PORT || 6060;

const main = async () => {
  mongoose.set("useFindAndModify", false);
  await mongoose.connect(process.env.MONGODB_URL!, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`);
  });
};

main();
