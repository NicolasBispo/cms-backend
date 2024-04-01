import { Router } from "express";
import { PostController as postController } from "../controllers/postController";
import { postBelongsToUser, setPost } from "../middlewares/postsMiddlewares";
import { isAuth } from "../middlewares/authMiddleware";
import { validateCreatePost } from "../middlewares/validators/posts";
const router = Router();

router.get("/", postController.index);
router.get("/trending", postController.getTrendingPost);
router.get("/:id", postController.show);
router.post("/", isAuth, validateCreatePost, postController.create);
router.put(
  "/:id",
  isAuth,
  setPost,
  postBelongsToUser,
  validateCreatePost,
  postController.update
);
router.delete(
  "/:id",
  isAuth,
  setPost,
  postBelongsToUser,
  postController.delete
);

export const postRouter = router;
