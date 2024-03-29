import express from "express";
import { CommentController } from "../controllers/commentController";
import { hasPermissionOnComment, setComment } from "../middlewares/commentsMiddlewares";
import { isAuth } from "../middlewares/authMiddleware";
const router = express.Router();

router.get("/", CommentController.index);
router.get("/:id", CommentController.show);
router.post("/", isAuth, CommentController.create);
router.put("/:id", isAuth, setComment, hasPermissionOnComment, CommentController.update);
router.delete("/:id", isAuth, setComment, hasPermissionOnComment, CommentController.delete);

export const commentRouter = router
