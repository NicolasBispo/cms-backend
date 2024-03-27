import express from "express";
import { CategoryController } from "../controllers/categoryController";
const router = express.Router();

router.get("/", CategoryController.index);
router.get("/:id", CategoryController.show);
router.post("/", CategoryController.create);
router.put("/:id", CategoryController.update);
router.delete("/:id", CategoryController.delete);

export const categoryRouter = router
