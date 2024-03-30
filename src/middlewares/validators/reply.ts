import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateReply = [
  body("content").notEmpty().withMessage("Insira um conteudo na sua resposta"),
  body("commentId").notEmpty().isNumeric().withMessage("Insira o id do comentario"),
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
