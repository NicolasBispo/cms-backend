import { Request, Response } from "express";
import { PrismaClient, Comment } from "@prisma/client";
import status from "../config/status";

const prisma = new PrismaClient();

export class CommentController {
  public static async index(req: Request, res: Response): Promise<void> {
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
        comments: comments,
      });
    } catch (err) {
      res
        .status(status.internalServerError)
        .json({ message: "Error retrieving comments", error: err });
    }
  }

  public static async show(req: Request, res: Response): Promise<void> {
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

  public static async create(req: Request, res: Response): Promise<void> {
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
    } catch (err) {
      res
        .status(status.badRequest)
        .json({ message: "Error creating comment", error: err });
    }
  }

  public static async update(req: Request, res: Response): Promise<void> {
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
    } catch (err) {
      res
        .status(status.badRequest)
        .json({ message: "Error updating comment", error: err });
    }
  }

  public static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await prisma.comment.delete({
        where: {
          id: parseInt(id),
        },
      });
      res.json({ message: "Comment deleted successfully" });
    } catch (err) {
      res
        .status(status.badRequest)
        .json({ message: "Error deleting comment", error: err });
    }
  }
}
