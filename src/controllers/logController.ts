import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import status from "../config/status";
import { errorResponse } from "../utils/formatResponse";

const prisma = new PrismaClient();
export class LogController {

  public static async index(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.perPage as string) || 10;

      const skip = (page - 1) * perPage;

      const totalCount = await prisma.log.count();
      const logs = await prisma.log.findMany({
        take: perPage,
        skip: skip,
        orderBy: { id: "desc" },
      });

      res.json({
        page: page,
        perPage: perPage,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / perPage),
        logs: logs,
      });
    } catch (err) {
      res
        .status(status.internalServerError)
        .json({ message: "Error retrieving categories", error: err });
    }
  }

  public static async show(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const log = await prisma.log.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      if (!log) {
        res.status(status.notFound).send(errorResponse("Log nao encontrado"));
        return;
      }

      res.json(log);
    } catch (err) {
      res.status(500).send(errorResponse(err));
    }
  }
  
}
