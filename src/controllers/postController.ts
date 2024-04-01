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
      const raw = Boolean(req.query.raw)
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.perPage as string) || 10;

      const skip = (page - 1) * perPage;

      const totalCount = await prisma.post.count();
      let posts : Post[]
      
      if(raw){
        posts = await prisma.post.findMany({
          take: perPage,
          skip: skip,
          orderBy: { id: "desc" },
          include: {
            author: {select: {id: true, name: true, email: true}},
            categories: true,
            comments: true
          }
        });
      }
      else{
        posts = await prisma.post.findMany({
          take: perPage,
          skip: skip,
          orderBy: { id: "desc" },
        });
      }

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
        .json({ message: "Error retrieving posts", error: err });
    }
  }

  public static async getTrendingPost(req: PostRequest, res: Response): Promise<void>{
    try {
      const postWithMostComments = await prisma.post.findMany({
        include: {
          comments: true,
          author: {select: {name: true, email: true}},
        },
        orderBy: {
          comments: {
            _count: 'desc',
          },
        },
        take: 1,
      });

      
  
      
      res.json(postWithMostComments[0]);
    }
    catch (error) {
      console.error('Erro ao encontrar o post com mais comentários:', error);
      res.status(status.internalServerError).send(errorResponse("Erro interno do servidor"));
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
         comments: true ,
         tags: true
        }
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
