import { Response as ExpressResponse } from "express";

export interface Response extends ExpressResponse {
  formatResponse: (data: unknown, statusCode:number) => void;
  formatError: (error: unknown, statusCode: number) => void;
}
