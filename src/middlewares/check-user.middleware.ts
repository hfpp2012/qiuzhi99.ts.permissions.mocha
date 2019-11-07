import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { JwtPayload } from "../types/Jwt";

const checkUserMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers["authorization"];

  if (authorizationHeader) {
    const token = authorizationHeader.split("Bearer ")[1];

    if (token) {
      try {
        const jwtData = jwt.verify(
          token,
          process.env.JWT_SECRET_KEY!
        ) as JwtPayload;

        const user = await User.findById(jwtData.id);

        if (user) {
          req.currentUser = user;
        }
      } catch (error) {
        return next();
      }
    }
  }

  next();
};

export default checkUserMiddleware;
