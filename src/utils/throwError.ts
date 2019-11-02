import HttpException from "../exceptions/HttpException";
import { NOT_FOUND } from "http-status-codes";

export const throwPostNotFoundError = () => {
  throw new HttpException(NOT_FOUND, "Post not found");
};
