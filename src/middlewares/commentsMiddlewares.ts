import { Response, NextFunction } from "express";
import { CommentRequest } from "../interfaces/request";
import { PrismaClient } from "@prisma/client";
import status from "../config/status";
import { errorResponse } from "../utils/formatResponse";

const prisma = new PrismaClient();
export async function setComment(
  req: CommentRequest,
  res: Response,
  next: NextFunction
) {
  const commentId = parseInt(req.params.id);

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (comment) {
    req.comment = comment;
    return next;
  }
  return res
    .status(status.notFound)
    .send(errorResponse("Comentario nao encontrado"));
}

export async function hasPermissionOnComment(
  req: CommentRequest,
  res: Response,
  next: NextFunction
) {
  if (req.comment.authorId === req.currentUser.id) {
    return next();
  }
  return res
    .status(status.unauthorized)
    .send(errorResponse("Nao autorizado a alterar esse comentario"));
}
