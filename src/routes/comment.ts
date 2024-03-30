import express from "express";
import { CommentController } from "../controllers/commentController";
import {
  hasPermissionOnComment,
  setComment,
} from "../middlewares/commentsMiddlewares";
import { isAuth } from "../middlewares/authMiddleware";
import { validateCreateComment } from "../middlewares/validators/comment";
import { replyRouter } from "./reply";
import { CommentRequest } from "../interfaces/request";
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
router.use("/:commentId/replies", (req: CommentRequest, res, next) => {
    req.commentId = Number(req.params.commentId)
    next()
}, replyRouter)

export const commentRouter = router;
