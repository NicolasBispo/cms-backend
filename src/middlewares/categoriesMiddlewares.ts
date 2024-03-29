import { Response, NextFunction } from "express";
import { CategoryRequest } from "../interfaces/request";
import { PrismaClient } from "@prisma/client";
import status from "../config/status";

const prisma = new PrismaClient()
export async function setCategory(
  req: CategoryRequest,
  res: Response,
  next: NextFunction
) {
  const categoryId = parseInt(req.params.id)

  const category = await prisma.category.findUnique({where: {id: categoryId}})
  if(category){
    req.category = category
    return next
  }
  return res.status(status.notFound).send("Categoria nao encontrada")
}
