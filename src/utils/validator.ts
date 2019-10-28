import { isEmpty, equals, isEmail } from "validator";
import { IUserDocument } from "../models/User";

interface RegisterInputError extends Partial<IUserDocument> {
  confirmPassword?: string;
}

export const validateRegisterInput = (
  username: IUserDocument["username"],
  password: IUserDocument["password"],
  confirmPassword: IUserDocument["password"],
  email: IUserDocument["email"]
) => {
  let errors: RegisterInputError = {};

  if (isEmpty(username)) {
    errors.username = "Username must not be empty";
  }

  if (isEmpty(password)) {
    errors.password = "Password must not be empty";
  }

  if (isEmpty(confirmPassword)) {
    errors.confirmPassword = "Confirmed password must not be empty";
  }

  if (!equals(password, confirmPassword)) {
    errors.confirmPassword = "Passwords must match";
  }

  if (isEmpty(email)) {
    errors.email = "Email must not be empty";
  }

  if (!isEmail(email)) {
    errors.email = "Email must be a valid email address";
  }

  return { errors, valid: Object.keys(errors).length < 1 };
};
