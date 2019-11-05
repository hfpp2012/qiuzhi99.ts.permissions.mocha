import HttpException from "../exceptions/HttpException";
import { NOT_FOUND, UNAUTHORIZED } from "http-status-codes";

export const throwPostNotFoundError = () => {
  throw new HttpException(NOT_FOUND, "Post not found");
};

export const throwCommentNotFoundError = () => {
  throw new HttpException(NOT_FOUND, "Comment not found");
};

export const throwActionNotAllowedError = () => {
  throw new HttpException(UNAUTHORIZED, "Action not allowed");
};
