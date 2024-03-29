import express from "express";
import { UserController as userController } from "../controllers/userController";
import { setUser } from "../middlewares/usersMiddlewares";
import { isAuth } from "../middlewares/authMiddleware";
const router = express.Router();

router.get("/", userController.index);
router.get("/:id", userController.show);
router.post("/", isAuth, userController.create);
router.put("/:id", isAuth, setUser, userController.update);
router.delete("/:id", isAuth, userController.delete);

export const userRouter = router;
