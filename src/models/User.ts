import jwt from "jsonwebtoken";
import { Schema, model, Model, Document } from "mongoose";
import { JwtPayload } from "../types/Jwt";

export interface IUserDocument extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: string;
  _doc: IUserDocument;
  generateToken: () => string;
}

const userSchema: Schema = new Schema({
  username: String,
  email: String,
  password: String,
  createdAt: String
});

userSchema.methods.generateToken = function(): string {
  const payload: JwtPayload = { id: this.id };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
    expiresIn: "1h"
  });
};

const User: Model<IUserDocument> = model<IUserDocument>("User", userSchema);

export default User;
