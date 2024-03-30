import express from "express";
import { CommentController } from "../controllers/commentController";
import {
  hasPermissionOnComment,
  setComment,
} from "../middlewares/commentsMiddlewares";
import { isAuth } from "../middlewares/authMiddleware";
import { validateCreateComment } from "../middlewares/validators/comment";
const router = express.Router();

router.get("/", CommentController.index);
router.get("/:id", CommentController.show);
router.post("/", isAuth, validateCreateComment, CommentController.create);
router.put(
  "/:id",
  isAuth,
  setComment,
  hasPermissionOnComment,
  validateCreateComment,
  CommentController.update
);
router.delete(
  "/:id",
  isAuth,
  setComment,
  hasPermissionOnComment,
  CommentController.delete
);

export const commentRouter = router;
