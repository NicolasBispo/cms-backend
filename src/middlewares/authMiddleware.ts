import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../interfaces/request";
import { User } from "@prisma/client";

export const isAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authorization) {
    const privateKey = process.env.JWT_PRIVATE_KEY || "private_default";
    jwt.verify(req.headers.authorization, privateKey, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .send({ error: true, message: "Token inválido", status: 401 });
      }

      if (typeof decoded !== "string") {
        req.currentUser = decoded.user as User;
        next();
      } else {
        return res
          .status(501)
          .send({ error: true, message: "Erro interno servidor", status: 501 });
      }
    });
  } else {
    return res
      .send({ error: true, message: "Token não fornecido" })
      .status(501);
  }
};
