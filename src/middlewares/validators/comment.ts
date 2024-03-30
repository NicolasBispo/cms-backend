import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateComment = [
  body("content").notEmpty().withMessage("Insira um conteudo no comentario"),
  body("postId").notEmpty().isNumeric().withMessage("Insira o id do Post"),
  body("authorId").notEmpty().isNumeric().withMessage("Insira o ID do author"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }
    next();
  },
];
