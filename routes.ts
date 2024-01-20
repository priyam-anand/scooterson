import { Router } from "express";
import authRouter from "./controller/auth";
import userRouter from "./controller/user";
import protectedRouter from "./controller/protected";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/protected", protectedRouter);

export default router;
