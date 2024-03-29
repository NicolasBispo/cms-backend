import { NextFunction, Response } from "express";
import { UserRequest } from "../interfaces/request";
import { PrismaClient } from "@prisma/client";
import status from "../config/status";
import { errorResponse } from "../utils/formatResponse";

const prisma = new PrismaClient();

export async function setUser(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  const userId = parseInt(req.params.id);

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (user) {
    req.user = user;
    return next();
  }
  return res
    .status(status.notFound)
    .send(errorResponse("Usuario nao encontrado"));
}



