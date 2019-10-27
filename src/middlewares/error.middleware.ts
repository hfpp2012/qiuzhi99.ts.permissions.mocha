import { Request, Response, NextFunction } from "express";
import HttpException from "../exceptions/HttpException";
import { INTERNAL_SERVER_ERROR } from "http-status-codes";

const errorMiddleware = (
  error: HttpException,
  _request: Request,
  response: Response,
  next: NextFunction
) => {
  const status = error.status || INTERNAL_SERVER_ERROR;
  const message = error.message || "Something went wrong";

  response.status(status).json({
    success: false,
    message,
    errors: error.errors
  });

  next();
};

export default errorMiddleware;
