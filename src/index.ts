import express, { Express, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { NOT_FOUND } from "http-status-codes";
import HttpException from "./exceptions/HttpException";
import errorMiddleware from "./middlewares/error.middleware";
import "dotenv/config";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import users from "./routes/users";
import posts from "./routes/posts";

const app: Express = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "hello world"
  });
});

app.use("/users", users);
app.use("/posts", posts);

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
