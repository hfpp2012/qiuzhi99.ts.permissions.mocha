import express, { Express, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { NOT_FOUND } from "http-status-codes";
import HttpException from "./exceptions/HttpException";
import errorMiddleware from "./middlewares/error.middleware";

const app: Express = express();

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "hello world"
  });
});

app.use((_req: Request, _res: Response, next: NextFunction) => {
  const error: HttpException = new HttpException(NOT_FOUND, "Router Not Found");
  next(error);
});

app.use(errorMiddleware);

const port: any = process.env.PORT || 6060;

const main = async () => {
  await mongoose.connect("mongodb://localhost:27017/tsexpress", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`);
  });
};

main();
