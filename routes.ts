import { Router } from "express";
import authRouter from "./controller/auth";

const router = Router();

router.use("/auth", authRouter);

export default router;
