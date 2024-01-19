import { Router } from "express";
import authRouter from "./controller/auth";
import userRouter from "./controller/user";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);

export default router;
