// src/models/log.model.ts
import { PrismaClient, Log } from '@prisma/client';

const prisma = new PrismaClient();

export interface LogInput {
  action: string;
  userId: number;
}

export class LogModel {
  public async createLog(logInput: LogInput): Promise<Log> {
    const { action, userId } = logInput;
    return prisma.log.create({
      data: {
        action,
        userId,
      },
    });
  }

  public async getLogs(): Promise<Log[]> {
    return prisma.log.findMany();
  }
}
