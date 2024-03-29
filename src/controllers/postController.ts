import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import status from "../config/status";
import { PostRequest } from "../interfaces/request";
const prisma = new PrismaClient();

export class PostController {
  public static async index(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.perPage as string) || 10;

      const skip = (page - 1) * perPage;

      const totalCount = await prisma.post.count();
      const posts = await prisma.post.findMany({
        take: perPage,
        skip: skip,
        orderBy: { id: "desc" },
      });

      res.json({
        page: page,
        perPage: perPage,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / perPage),
        posts: posts,
      });
    } catch (err) {
      res
        .status(status.internalServerError)
        .json({ message: "Error retrieving posts", error: err });
    }
  }

  public static async show(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const post = await prisma.post.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }
      res.json(post);
    } catch (err) {
      res.status(500).json({ message: "Error retrieving post", error: err });
    }
  }

  public static async create(req: Request, res: Response): Promise<void> {
    try {
      const { title, content, userId } = req.body;
      const newPost = await prisma.post.create({
        data: {
          title,
          content,
          author: {
            connect: { id: parseInt(userId) },
          },
        },
      });
      res.status(status.created).json(newPost);
    } catch (err) {
      res.status(status.badRequest).json({ message: err });
    }
  }

  public static async update(req: PostRequest, res: Response){
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const updatedPost = await prisma.post.update({
        where: {
          id: parseInt(id),
        },
        data: {
          title,
          content,
        },
      });
      res.json(updatedPost);
    } catch (err) {
      res.status(status.badRequest).json({ message: err });
    }
  }

  public static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await prisma.post.delete({
        where: {
          id: parseInt(id),
        },
      });
      res.json({ message: "Post deleted successfully" });
    } catch (err) {
      res.status(status.badRequest).json({ message: err });
    }
  }
}
