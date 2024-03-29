import { NextFunction, Response, Request } from "express";
import { PostRequest } from "../interfaces/request";
import { PrismaClient } from "@prisma/client";
import status from "../config/status";
import { errorResponse } from "../utils/formatResponse";

const prisma = new PrismaClient();
export async function postBelongsToUser(
  req: PostRequest,
  res: Response,
  next: NextFunction
) {
  if (req.post.authorId === req.currentUser?.id) {
    next();
  } else {
    res
      .status(status.unauthorized)
      .send(errorResponse("Nao autorizado a alterar esse post"));
  }
}

export async function setPost(
  req: PostRequest,
  res: Response,
  next: NextFunction
){
  const postId = parseInt(req.params.id);
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (post) {
    req.post = post;
    next();
  } else {
    res.status(status.notFound).send(errorResponse("Post não encontrado"));
  }
};
