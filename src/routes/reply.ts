import {Response, Router} from "express"
import { ReplyRequest } from "../interfaces/request";
import { ReplyController } from "../controllers/replyController";
import { replyBelongsToUser, setReply } from "../middlewares/replyMiddlewares";
const router = Router();


router.post("/", ReplyController.create)
router.put("/:id", setReply, replyBelongsToUser, ReplyController.update)
router.delete("/", setReply, replyBelongsToUser, ReplyController.delete)

export const replyRouter = router