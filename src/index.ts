import express from "express";
import { env } from "process";
import router from "./routes";


const app = express();
const port = env.PORT;

app.use(express.json());

app.use(router);

app.listen(port, () => {
  console.log(`Servidor Iniciado - Porta => ${port}`);
});
