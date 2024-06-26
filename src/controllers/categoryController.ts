import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import status from "../config/status";
import { CategoryRequest } from "../interfaces/request";
import { LogModel } from "../models/log";
const prisma = new PrismaClient();
const logAction = new LogModel();
export class CategoryController {
  public static async index(
    req: CategoryRequest,
    res: Response
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.perPage as string) || 10;

      const skip = (page - 1) * perPage;

      const totalCount = await prisma.category.count();
      const categories = await prisma.category.findMany({
        take: perPage,
        skip: skip,
        orderBy: { id: "desc" },
      });

      res.json({
        page: page,
        perPage: perPage,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / perPage),
        results: categories,
      });
    } catch (err) {
      res
        .status(status.internalServerError)
        .json({ message: "Error retrieving categories", error: err });
    }
  }

  public static async show(req: CategoryRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await prisma.category.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
      }
      res.json(category);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error retrieving category", error: err });
    }
  }

  public static async create(
    req: CategoryRequest,
    res: Response
  ): Promise<void> {
    try {
      const { name } = req.body;
      const newCategory = await prisma.category.create({
        data: {
          name,
        },
      });
      res.status(status.created).json(newCategory);
      await logAction.createLog({
        action: `Criacao de categoria - ID->${newCategory.id}, NOME->${newCategory.id}`,
        userId: req.currentUser.id,
      });
    } catch (err) {
      res.status(status.badRequest).json({ message: err });
      await logAction.createLog({
        action: `Erro na criacao de categoria - Erro => ${err.toString()}`,
        userId: req.currentUser.id,
      });
    }
  }

  public static async update(
    req: CategoryRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const updatedCategory = await prisma.category.update({
        where: {
          id: parseInt(id),
        },
        data: {
          name,
        },
      });
      res.json(updatedCategory);
      await logAction.createLog({
        action: `Edicao de categoria - ID->${updatedCategory.id}, NOME->${updatedCategory.id}`,
        userId: req.currentUser.id,
      });
    } catch (err) {
      res.status(status.badRequest).json({ message: err });
      await logAction.createLog({
        action: `Erro na edicao de categoria - Erro => ${err.toString()}`,
        userId: req.currentUser.id,
      });
    }
  }

  public static async delete(
    req: CategoryRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      await prisma.category.delete({
        where: {
          id: parseInt(id),
        },
      });
      res.json({ message: "Category deleted successfully" });
      await logAction.createLog({
        action: `Remocao de categoria - ID->${id}`,
        userId: req.currentUser.id,
      });
    } catch (err) {
      res.status(status.badRequest).json({ message: err });
      await logAction.createLog({
        action: `Erro na remocao de categoria - Erro => ${err.toString()}`,
        userId: req.currentUser.id,
      });
    }
  }
}
