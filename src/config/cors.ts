import { Request, Response, NextFunction } from "express";

const cors = (req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*"); // Permitir acesso de qualquer origem
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, id, Cache-Control, cache" // Adicionando Cache-Control aos cabeçalhos permitidos
  );
  res.header("Access-Control-Allow-Credentials", "true"); // Permitir credenciais
  res.header("Access-Control-Expose-Headers", "Authorization"); // Expor o cabeçalho de autorização
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
};
export default cors;
