import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import status from "../config/status";
import { ReplyRequest } from "../interfaces/request";
import { LogModel } from "../models/log";

const prisma = new PrismaClient();
const logAction = new LogModel();

export class ReplyController {
  public static async create(
    req: ReplyRequest,
    res: Response
  ): Promise<void> {
    try {
      const { content, parentId} = req.body;
      const commentId = req.commentId.toString()
      const newReply = await prisma.reply.create({
        data: {
          content,
          commentId: parseInt(commentId),
          authorId: req.currentUser.id,
          parentId: parentId ? parseInt(parentId) : undefined,
        },
      });
      res.status(status.created).json(newReply);
      await logAction.createLog({
        action: `Criacao de resposta - ID->${newReply.id}, CONTEUDO->${newReply.content}`,
        userId: req.currentUser.id,
      });
    } catch (err) {
      res
        .status(status.badRequest)
        .json({ message: "Error creating reply", error: err });
      await logAction.createLog({
        action: `Erro na criacao de resposta - Erro => ${err.toString()}`,
        userId: req.currentUser.id,
      });
    }
  }

  public static async update(
    req: ReplyRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const updatedReply = await prisma.reply.update({
        where: {
          id: parseInt(id),
        },
        data: {
          content,
        },
      });
      res.json(updatedReply);
      await logAction.createLog({
        action: `Edicao de resposta - ID->${updatedReply.id}, NOVO-CONTEUDO->${updatedReply.content}`,
        userId: req.currentUser.id,
      });
    } catch (err) {
      res
        .status(status.badRequest)
        .json({ message: "Error updating reply", error: err });
      await logAction.createLog({
        action: `Erro na Edicao de resposta - Erro => ${err.toString()}`,
        userId: req.currentUser.id,
      });
    }
  }

  public static async delete(
    req: ReplyRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      await prisma.reply.delete({
        where: {
          id: parseInt(id),
        },
      });
      res.json({ message: "Reply deleted successfully" });
      await logAction.createLog({
        action: `Remocao de resposta - ID->${id}`,
        userId: req.currentUser.id,
      });
    } catch (err) {
      res
        .status(status.badRequest)
        .json({ message: "Error deleting reply", error: err });
      await logAction.createLog({
        action: `Erro na remocao de resposta - Erro => ${err.toString()}`,
        userId: req.currentUser.id,
      });
    }
  }
}
