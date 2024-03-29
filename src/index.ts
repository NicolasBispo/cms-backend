import express from "express";
import { env } from "process";
import router from "./routes";
import passport from "passport";

const app = express();
const port = env.PORT;

app.use(express.json());
app.use(passport.initialize());
app.use(router);

app.listen(port, () => {
  console.log(`Servidor Iniciado - Porta => ${port}`);
});
