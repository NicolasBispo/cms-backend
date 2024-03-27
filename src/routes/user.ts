import express from "express";
import { UserController as userController } from "../controllers/userController";
const router = express.Router()

router.get('/', userController.index);
router.get('/:id', userController.show);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

export const userRouter = router