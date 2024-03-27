import express from "express";
import { userRouter } from "./user";
import { categoryRouter } from "./category";
import { postRouter } from "./post";
import { commentRouter } from "./comment";

const router = express.Router();

router.use("/users", userRouter);
router.use("/categories", categoryRouter);
router.use("/posts", postRouter);
router.use("/comments", commentRouter);


export default router
