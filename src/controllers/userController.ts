import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import status from "../config/status";
import { UserRequest } from "../interfaces/request";
import { LogModel } from "../models/log";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const logAction = new LogModel();
export class UserController {
  public static async index(req: UserRequest, res: Response): Promise<void> {
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
        results: users,
      });
    } catch (err) {
      res
        .status(status.internalServerError)
        .json({ message: "Error retrieving users", error: err });
    }
  }

  public static async show(req: UserRequest, res: Response): Promise<void> {
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

  public static async create(req: UserRequest, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password,
        },
      });
      res.status(status.created).json(newUser);
      await logAction.createLog({
        action: `Criacao de Usuario - ID->${newUser.id}, NOME->${newUser.name}`,
        userId: req.currentUser.id,
      });
    } catch (err) {
      res.status(status.badRequest).json({ message: err });
      await logAction.createLog({
        action: `Erro na criacao de Usuario - ERRO->${err.toString()}`,
        userId: req.currentUser.id,
      });
    }
  }

  public static async update(req: UserRequest, res: Response): Promise<void> {
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
      await logAction.createLog({
        action: `EDICAO de Usuario - ID->${updatedUser.id}, NOME->${updatedUser.name}`,
        userId: req.currentUser.id,
      });
    } catch (err) {
      res.status(status.badRequest).json({ message: err });
      await logAction.createLog({
        action: `Erro na ATUALIZACAO de Usuario - ERRO->${err.toString()}`,
        userId: req.currentUser.id,
      });
    }
  }

  public static async delete(req: UserRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await prisma.user.delete({
        where: {
          id: parseInt(id),
        },
      });
      res.json({ message: "User deleted successfully" });
      await logAction.createLog({
        action: `REMOCAO de Usuario - ID->${id}`,
        userId: req.currentUser.id,
      });
    } catch (err) {
      res.status(status.badRequest).json({ message: err });
      await logAction.createLog({
        action: `Erro na REMOCAO de Usuario - ERRO->${err.toString()}`,
        userId: req.currentUser.id,
      });
    }
  }

  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Verifique as credenciais do usuário aqui (não incluído neste exemplo)

      // Supondo que a autenticação foi bem-sucedida, você pode gerar um token JWT
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        res
          .status(status.unauthorized)
          .json({ message: "Credenciais inválidas" });
        return;
      }

      // Exemplo simples de verificação de senha (substitua pela sua própria lógica)
      if (user.password !== password) {
        res
          .status(status.unauthorized)
          .json({ message: "Credenciais inválidas" });
        return;
      }

      const token = jwt.sign({ userId: user.id }, "okokokokokoko", {
        expiresIn: "1h",
      }); // Substitua "suaChaveSecreta" pela sua chave secreta

      // Envie o token no cabeçalho de autorização da resposta
      res.setHeader("Authorization", `${token}`);
      res.status(status.ok).json({ token });
    } catch (err) {
      res
        .status(status.internalServerError)
        .json({ message: "Erro no login", error: err });
    }
  }
}
