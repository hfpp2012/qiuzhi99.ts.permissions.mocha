import { Request, Response } from "express";

import { InputError, validateInput } from "../../utils/admin/validator";
import HttpException from "../../exceptions/HttpException";
import { UNPROCESSABLE_ENTITY } from "http-status-codes";

import bcrypt from "bcryptjs";
import Admin from "../../models/Admin";

import { wrapAsync } from "../../helpers/wrap-async";

const throwValidateError = (errors: InputError) => {
  throw new HttpException(UNPROCESSABLE_ENTITY, "Admin input error", errors);
};

/**
 * Login Admin
 *
 * @Method POST
 * @URL /api/admin/users/login
 *
 */
export const postLogin = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    const { errors, valid } = validateInput(username, password);

    if (!valid) {
      return throwValidateError(errors);
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
      errors.general = "Admin not found";
      return throwValidateError(errors);
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      errors.general = "Wrong credentials";
      return throwValidateError(errors);
    }

    const token = admin.generateToken();

    res.json({
      success: true,
      data: {
        id: admin.id,
        token
      }
    });
  }
);

/**
 * Admin List
 *
 * @Method GET
 * @URL /api/admin/users
 *
 */
export const index = wrapAsync(
  async (_req: Request, res: Response): Promise<void> => {
    const admins = await Admin.find();

    res.json({
      success: true,
      data: {
        admins
      }
    });
  }
);

/**
 * Add Admin
 *
 * @Method POST
 * @URL /api/admin/users
 *
 */
export const addAdmin = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    const { errors, valid } = validateInput(username, password);

    if (!valid) {
      return throwValidateError(errors);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      username,
      password: hashedPassword
    });

    const resAdmin = await newAdmin.save();

    res.json({
      success: true,
      data: {
        admin: resAdmin,
        message: "created successfully"
      }
    });
  }
);
