import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import status from "../config/status";
import { CommentRequest } from "../interfaces/request";
import { LogModel } from "../models/log";

const prisma = new PrismaClient();
const logAction = new LogModel();
export class CommentController {
  public static async index(req: CommentRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.perPage as string) || 10;

      const skip = (page - 1) * perPage;

      const totalCount = await prisma.comment.count();
      const comments = await prisma.comment.findMany({
        take: perPage,
        skip: skip,
        orderBy: { id: "desc" },
      });

      res.json({
        page: page,
        perPage: perPage,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / perPage),
        results: comments,
      });
    } catch (err) {
      res
        .status(status.internalServerError)
        .json({ message: "Error retrieving comments", error: err });
    }
  }

  public static async show(req: CommentRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const comment = await prisma.comment.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      if (!comment) {
        res.status(404).json({ message: "Comment not found" });
        return;
      }
      res.json(comment);
    } catch (err) {
      res.status(500).json({ message: "Error retrieving comment", error: err });
    }
  }

  public static async create(
    req: CommentRequest,
    res: Response
  ): Promise<void> {
    try {
      const { content, postId, authorId } = req.body;
      const newComment = await prisma.comment.create({
        data: {
          content,
          postId: parseInt(postId),
          authorId: parseInt(authorId),
        },
      });
      res.status(status.created).json(newComment);
      await logAction.createLog({
        action: `Criacao de comentario - ID->${newComment.id}, CONTEUDO->${newComment.content}`,
        userId: req.currentUser.id,
      });
    } catch (err) {
      res
        .status(status.badRequest)
        .json({ message: "Error creating comment", error: err });
      await logAction.createLog({
        action: `Erro na criacao de comentario - Erro => ${err.toString()}`,
        userId: req.currentUser.id,
      });
    }
  }

  public static async update(
    req: CommentRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const updatedComment = await prisma.comment.update({
        where: {
          id: parseInt(id),
        },
        data: {
          content,
        },
      });
      res.json(updatedComment);
      await logAction.createLog({
        action: `Edicao de comentario - ID->${updatedComment.id}, NOVO-CONTEUDO->${updatedComment.content}`,
        userId: req.currentUser.id,
      });
    } catch (err) {
      res
        .status(status.badRequest)
        .json({ message: "Error updating comment", error: err });
      await logAction.createLog({
        action: `Erro na Edicao de comentario - Erro => ${err.toString()}`,
        userId: req.currentUser.id,
      });
    }
  }

  public static async delete(
    req: CommentRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      await prisma.comment.delete({
        where: {
          id: parseInt(id),
        },
      });
      res.json({ message: "Comment deleted successfully" });
      await logAction.createLog({
        action: `Remocao de comentario - ID->${id}`,
        userId: req.currentUser.id,
      });
    } catch (err) {
      res
        .status(status.badRequest)
        .json({ message: "Error deleting comment", error: err });
      await logAction.createLog({
        action: `Erro na remocao de comentario - Erro => ${err.toString()}`,
        userId: req.currentUser.id,
      });
    }
  }
}
