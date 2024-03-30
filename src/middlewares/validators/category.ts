import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateCategory = [
  body("name").notEmpty().withMessage("Insira o nome da categoria"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }
    next();
  },
];
