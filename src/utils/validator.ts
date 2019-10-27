import { isEmpty, isEmail, equals } from "validator";

interface RegisterInputError {
  username?: string;
  password?: string;
  email?: string;
  confirmPassword?: string;
}

export const validateRegisterInput = (
  username: string,
  password: string,
  confirmPassword: string,
  email: string
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
