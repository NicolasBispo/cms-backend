import express from "express";
import { CategoryController } from "../controllers/categoryController";
import { isAuth } from "../middlewares/authMiddleware";
import { setCategory } from "../middlewares/categoriesMiddlewares";
const router = express.Router();

router.get("/", isAuth, CategoryController.index);
router.get("/:id", isAuth, CategoryController.show);
router.post("/", isAuth, CategoryController.create);
router.put("/:id", isAuth, setCategory, CategoryController.update);
router.delete("/:id", isAuth, CategoryController.delete);

export const categoryRouter = router;
