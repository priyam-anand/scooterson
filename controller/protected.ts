import { Request, Response, Router } from "express";
import {
  authenticateAdmin,
  authenticateOperator,
  authenticateToken,
  authenticateUser,
} from "../middleware/auth";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  res.status(200).json({ data: "This is the route open for all. Cheers !" });
});

router.get(
  "/admin",
  authenticateToken,
  authenticateAdmin,
  async (_req: Request, res: Response) => {
    res.status(200).json({ data: "This is the route open only for Admins." });
  }
);

router.get(
  "/operator",
  authenticateToken,
  authenticateOperator,
  async (_req: Request, res: Response) => {
    res
      .status(200)
      .json({ data: "This is the route open for Admins and Operators." });
  }
);

router.get(
  "/user",
  authenticateToken,
  authenticateUser,
  async (_req: Request, res: Response) => {
    res.status(200).json({
      data: "This is the route open for Admins, Operators and Users.",
    });
  }
);

export default router;
