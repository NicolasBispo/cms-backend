import express from "express";
import { isAuth } from "../middlewares/authMiddleware";
import { LogController } from "../controllers/logController";
const router = express.Router();

router.get("/", isAuth, LogController.index);
router.get("/;id", isAuth, LogController.show);


export const logRoutes = router
