import express from "express";
import { CategoryController } from "../controllers/categoryController";
import { isAuth } from "../middlewares/authMiddleware";
import { setCategory } from "../middlewares/categoriesMiddlewares";
import { validateCreateCategory } from "../middlewares/validators/category";
const router = express.Router();

router.get("/", CategoryController.index);
router.get("/:id", CategoryController.show);
router.post("/", isAuth, validateCreateCategory, CategoryController.create);
router.put(
  "/:id",
  isAuth,
  setCategory,
  validateCreateCategory,
  CategoryController.update
);
router.delete("/:id", isAuth, CategoryController.delete);

export const categoryRouter = router;
