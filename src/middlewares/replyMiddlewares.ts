import { NextFunction, Response, Request } from "express";
import { PostRequest, ReplyRequest } from "../interfaces/request";
import { PrismaClient } from "@prisma/client";
import status from "../config/status";
import { errorResponse } from "../utils/formatResponse";

const prisma = new PrismaClient();
export async function replyBelongsToUser(
  req: ReplyRequest,
  res: Response,
  next: NextFunction
) {
  if (req.reply.authorId === req.currentUser?.id) {
    next();
  } else {
    res
      .status(status.unauthorized)
      .send(errorResponse("Nao autorizado a alterar esse reply"));
  }
}

export async function setReply(
  req: ReplyRequest,
  res: Response,
  next: NextFunction
){
  const replyId = parseInt(req.params.id);
  const reply = await prisma.reply.findUnique({ where: { id: replyId } });
  if (reply) {
    req.reply = reply;
    next();
  } else {
    res.status(status.notFound).send(errorResponse("Resposta não encontrada"));
  }
};
