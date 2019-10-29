import { Request, Response, NextFunction } from "express";
import { validateRegisterInput } from "../utils/validator";
import HttpException from "../exceptions/HttpException";
import { UNPROCESSABLE_ENTITY } from "http-status-codes";
import User, { IUserDocument } from "../models/User";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const generateToken = (user: IUserDocument): string => {
//   return jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY!, {
//     expiresIn: "1h"
//   });
// };

export const postRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
