import express from "express";
import { CommentController } from "../controllers/commentController";
const router = express.Router();

router.get("/", CommentController.index);
router.get("/:id", CommentController.show);
router.post("/", CommentController.create);
router.put("/:id", CommentController.update);
router.delete("/:id", CommentController.delete);

export const commentRouter = router
