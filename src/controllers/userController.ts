import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import status from "../config/status";
const prisma = new PrismaClient();

export class UserController {
  public static async index(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.perPage as string) || 10;

      const skip = (page - 1) * perPage;

      const totalCount = await prisma.user.count();
      const users = await prisma.user.findMany({
        take: perPage,
        skip: skip,
        orderBy: { id: "desc" },
      });

      res.json({
        page: page,
        perPage: perPage,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / perPage),
        users: users,
      });
    } catch (err) {
      res
        .status(status.internalServerError)
        .json({ message: "Error retrieving users", error: err });
    }
  }


  public static async show(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Error retrieving user", error: err });
    }
  }

  public static async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password
        },
      });
      res.status(status.created).json(newUser);
    } catch (err) {
      res.status(status.badRequest).json({ message: err });
    }
  }

  public static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email } = req.body;
      const updatedUser = await prisma.user.update({
        where: {
          id: parseInt(id),
        },
        data: {
          name,
          email,
        },
      });
      res.json(updatedUser);
    } catch (err) {
      res.status(status.badRequest).json({ message: err });
    }
  }

  public static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await prisma.user.delete({
        where: {
          id: parseInt(id),
        },
      });
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(status.badRequest).json({ message: err });
    }
  }
}
