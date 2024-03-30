import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const validateCreatePost = [
  body("title").notEmpty().withMessage("Informe o titulo"),
  body("content")
    .notEmpty()
    .isLength({ min: 300 })
    .withMessage("Conteudo deve ser no minimo 300 caracteres"),
    body("authorId")
    .notEmpty()
    .isNumeric()
    .withMessage("Insira o ID do author"),
    body("categories").isArray({min: 1}).withMessage("Informe ao menos 1 categoria").custom((value) => {
      if(!value.every(Number.isInteger)) throw new Error('O array tem que ser exclusivo de numeros');
    }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }
    next();
  },
];
