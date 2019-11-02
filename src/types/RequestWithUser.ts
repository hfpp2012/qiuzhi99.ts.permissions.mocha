import { Request } from "express";
import { IUserDocument } from "src/models/User";

export interface RequestWithUser extends Request {
  currentUser?: IUserDocument;
}
