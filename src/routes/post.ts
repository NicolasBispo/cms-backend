import express from "express";
import { PostController as postController } from "../controllers/postController";
const router = express.Router()

router.get('/', postController.index);
router.get('/:id', postController.show);
router.post('/', postController.create);
router.put('/:id', postController.update);
router.delete('/:id', postController.delete);

export const postRouter = router