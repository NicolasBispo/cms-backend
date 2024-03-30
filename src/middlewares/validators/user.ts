import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateUser = [
  body("name").notEmpty().withMessage("Informe seu nome."),
  body("email").notEmpty().withMessage("Informe um email válido."),
  body("password")
    .notEmpty()
    .isLength({ min: 8, max: 22 })
    .withMessage("Informe um senha de 8 a 16 caracteres com"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }
    next();
  },
];
