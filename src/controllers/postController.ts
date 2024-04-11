import { Request, Response } from "express";
import { Post, PrismaClient } from "@prisma/client";
import status from "../config/status";
import { PostRequest } from "../interfaces/request";
import { LogModel } from "../models/log";
import { errorResponse } from "../utils/formatResponse";
const prisma = new PrismaClient();
const logAction = new LogModel();
export class PostController {
  public static async index(req: PostRequest, res: Response): Promise<void> {
    try {
      //possible filters
      const raw = Boolean(req.query.raw);
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.perPage as string) || 10;
      const category = req.query.category as string;
      const startDate = req?.query?.startDate
        ? new Date(req?.query?.createdAt as string)
        : undefined;
      const endDate = req?.query?.endDate
        ? new Date(req?.query?.createdAt as string)
        : undefined;
      const title = req?.query?.title as string | undefined;

      const categoryIds = category?.split(",").map((id) => parseInt(id));

      const skip = (page - 1) * perPage;

      const rawCondition = raw
        ? {
            author: { select: { id: true, name: true, email: true } },
            categories: true,
            comments: true,
          }
        : {};

      const whereCategory = category
        ? {
            categories: {
              some: {
                id: {
                  in: categoryIds,
                },
              },
            },
          }
        : {};

      const whereBetweenCreateDateCondition = {
        createdAt: {
          ...(startDate ? { gt: startDate } : {}),
          ...(endDate ? { lt: endDate } : {}),
        },
      };

      const searchByPostName = title
        ? {
            title: {
              search: title,
            },
          }
        : {};

      const whereConditions = [
        whereCategory,
        whereBetweenCreateDateCondition,
        searchByPostName,
      ];

      const totalCount = await prisma.post.count({
        where: {
          AND: [...whereConditions],
        },
      });

      let posts: Post[];

      posts = await prisma.post.findMany({
        take: perPage,
        skip: skip,
        orderBy: { id: "desc" },
        include: rawCondition,
        where: {
          AND: [...whereConditions],
        },
      });

      res.json({
        page: page,
        perPage: perPage,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / perPage),
        results: posts,
      });
    } catch (err) {
      res
        .status(status.internalServerError)
        .json({ message: "Error retrieving posts", error: err.message });
    }
  }

  public static async getTrendingPost(
    req: PostRequest,
    res: Response
  ): Promise<void> {
    try {
      const postWithMostComments = await prisma.post.findMany({
        include: {
          comments: true,
          author: { select: { name: true, email: true } },
        },
        orderBy: {
          comments: {
            _count: "desc",
          },
        },
        take: 1,
      });

      res.json(postWithMostComments[0]);
    } catch (error) {
      console.error("Erro ao encontrar o post com mais comentários:", error);
      res
        .status(status.internalServerError)
        .send(errorResponse("Erro interno do servidor"));
    }
  }

  public static async show(req: PostRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const post = await prisma.post.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          author: true,
          categories: true,
          comments: true,
          tags: true,
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

  public static async create(req: PostRequest, res: Response): Promise<void> {
    try {
      const { title, content, categories } = req.body;
      const newPost = await prisma.post.create({
        data: {
          title,
          content,
          author: {
            connect: { id: req.currentUser.id },
          },
          categories: {
            connect: categories.map((categoryId:number) => ({ id: categoryId })),
          },
        },
      });
      res.status(status.created).json(newPost);
      await logAction.createLog({
        action: `Criacao de Post - ID->${newPost.id}, NOME->${newPost.id}`,
        userId: req.currentUser.id,
      });
    } catch (err) {
      res.status(status.badRequest).json({ message: err });
      await logAction.createLog({
        action: `Erro na criacao de post - Erro => ${err.toString()}`,
        userId: req.currentUser.id,
      });
    }
  }

  public static async update(req: PostRequest, res: Response) {
    try {
      const { id } = req.params;
      const { title, content, authorId, categories } = req.body;
      const updatedPost = await prisma.post.update({
        where: {
          id: parseInt(id),
        },
        data: {
          title,
          content,
          author: { connect: { id: authorId } },
          categories: {
            connect: categories.map((categoryId: number) => ({
              id: categoryId,
            })),
          },
        },
      });
      res.json(updatedPost);
      await logAction.createLog({
        action: `Criacao de Post - ID->${updatedPost.id}, NOME->${updatedPost.id}`,
        userId: req.currentUser.id,
      });
    } catch (err) {
      res.status(status.badRequest).json({ message: err });
      await logAction.createLog({
        action: `Erro na edicao de post - Erro => ${err.toString()}`,
        userId: req.currentUser.id,
      });
    }
  }

  public static async delete(req: PostRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await prisma.post.delete({
        where: {
          id: parseInt(id),
        },
      });
      res.json({ message: "Post deleted successfully" });
      await logAction.createLog({
        action: `REMOCAO de Post - ID->${id}`,
        userId: req.currentUser.id,
      });
    } catch (err) {
      res.status(status.badRequest).json({ message: err });
      await logAction.createLog({
        action: `Erro na remocao de post - Erro => ${err.toString()}`,
        userId: req.currentUser.id,
      });
    }
  }
}
