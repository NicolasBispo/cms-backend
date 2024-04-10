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
    const privateKey = "default_key";
    jwt.verify(req.headers.authorization, privateKey, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .send({
            error: true,
            message: "Token inválido",
            status: 401,
            error_message: err,
          });
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
