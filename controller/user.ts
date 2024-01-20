import { Request, Response, Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { changeRoleValidator } from "../utils/validators";
import { validationResult } from "express-validator";
import { changeRole } from "../services/user";

const router = Router();

router.post(
  "/changeRole",
  authenticateToken,
  changeRoleValidator(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const changeRoleResult = await changeRole(req.body);
    var result: any = {};
    if (changeRoleResult.error) {
      result.error = changeRoleResult.error;
    } else {
      result = changeRoleResult.data;
    }
    res.status(changeRoleResult.status).json(result);
  }
);

export default router;
