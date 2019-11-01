import { Request, Response, NextFunction } from "express";
import {
  validateRegisterInput,
  validateLoginInput,
  LoginInputError
} from "../utils/validator";
import HttpException from "../exceptions/HttpException";
import { UNPROCESSABLE_ENTITY } from "http-status-codes";
import User, { IUserDocument } from "../models/User";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const generateToken = (user: IUserDocument): string => {
//   return jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY!, {
//     expiresIn: "1h"
//   });
// };

const throwLoginValidateError = (errors: LoginInputError) => {
  throw new HttpException(
    UNPROCESSABLE_ENTITY,
    "User login input error",
    errors
  );
};

export const postLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body;

    const { errors, valid } = validateLoginInput(username, password);

    if (!valid) {
      return throwLoginValidateError(errors);
    }

    const user = await User.findOne({ username });

    if (!user) {
      errors.general = "User not found";
      return throwLoginValidateError(errors);
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      errors.general = "Wrong credentials";
      return throwLoginValidateError(errors);
    }

    const token = user.generateToken();

    res.json({
      success: true,
      data: {
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const postRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password, confirmPassword, email } = req.body;

    const { errors, valid } = validateRegisterInput(
      username,
      password,
      confirmPassword,
      email
    );

    if (!valid) {
      throw new HttpException(
        UNPROCESSABLE_ENTITY,
        "User register input error",
        errors
      );
    }

    const user = await User.findOne({ username });

    if (user) {
      throw new HttpException(UNPROCESSABLE_ENTITY, "Username is taken", {
        username: "The username is taken"
      });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUserDocument = new User({
      username,
      email,
      password
      // createdAt: new Date().toISOString
    });

    const resUser: IUserDocument = await newUser.save();

    const token: string = resUser.generateToken();

    res.json({
      success: true,
      data: {
        token
      }
    });
  } catch (error) {
    next(error);
  }
};
