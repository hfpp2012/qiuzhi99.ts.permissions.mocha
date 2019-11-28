import jwt from "jsonwebtoken";
import { Schema, model, Model, Document } from "mongoose";
import { JwtPayload } from "../types/Jwt";

export interface IUserDocument extends Document {
  username: string;
  email: string;
  password: string;
  _doc: IUserDocument;
  generateToken: () => string;
}

const userSchema: Schema = new Schema(
  {
    username: String,
    email: String,
    password: String
  },
  { timestamps: true }
);

userSchema.methods.generateToken = function(): string {
  const payload: JwtPayload = { id: this.id, username: this.username };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
    expiresIn: "1h"
  });
};

userSchema.set("toJSON", {
  transform: function(_doc, ret) {
    delete ret["password"];
    return ret;
  }
});

const User: Model<IUserDocument> = model<IUserDocument>("User", userSchema);

export default User;
