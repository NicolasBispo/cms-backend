import express from "express";
import { env } from "process";
import router from "./routes";
import cors from "./config/cors";


const app = express();
const port = env.PORT;

app.use(express.json());
app.use("/",cors)
app.use(router);

app.listen(port, () => {
  console.log(`Servidor Iniciado - Porta => ${port}`);
});
