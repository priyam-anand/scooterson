import { body } from "express-validator";

export const registrationValidator = () => {
  return [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Invalid password"),
  ];
};

export const loginValidator = () => {
  return [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Invalid password"),
  ];
};

export const refreshValidator = () => {
  return [body("refreshToken").notEmpty().withMessage("Invalid refresh token")];
};
