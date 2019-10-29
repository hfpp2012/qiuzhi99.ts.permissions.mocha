import jwt from "jsonwebtoken";
import { Schema, model, Model, Document, HookNextFunction } from "mongoose";
// import { isEmail } from "validator";
import uuid from "uuid";
import bcrypt from "bcryptjs";

enum Role {
  basic = "basic",
  admin = "admin"
}

interface Address {
  city: string;
  street: string;
}

export interface IUserDocument extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: string;
  _doc: IUserDocument;
  role: Role;
  addresses: Address[];
  generateToken: () => string;
}

const addressSchema: Schema = new Schema({
  city: String,
  street: String
});

const userSchema: Schema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Username must not be empty"],
    minlength: [6, "Username must be at least 6 characters long"]
  },
  email: {
    type: String,
    // validate: {
    //   validator: isEmail
    // }
    required: true,
    trim: true,
    match: /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/
  },
  role: {
    type: String,
    enum: ["basic", "admin"],
    default: "basic"
  },
  addresses: { type: [addressSchema] },
  password: String,
  createdAt: String,
  uuid: { type: String, default: uuid.v4() }
});

userSchema.methods.generateToken = function(): string {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET_KEY!, {
    expiresIn: "1h"
  });
};

userSchema.pre<IUserDocument>("save", async function save(
  next: HookNextFunction
) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.index({ username: 1 });

const User: Model<IUserDocument> = model<IUserDocument>("User", userSchema);

export default User;
