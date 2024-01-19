import { Request, Response, Router } from "express";
import { loginUser, refreshAccessToken, registerUser } from "../services/auth";
import { validationResult } from "express-validator";
import {
  registrationValidator,
  loginValidator,
  refreshValidator,
} from "../utils/validators";

const router = Router();

router.post(
  "/register",
  registrationValidator(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const registrationResult = await registerUser(req.body);
    var result: any = {};
    if (registrationResult.error) {
      result.error = registrationResult.error;
    } else {
      result = registrationResult.data;
    }
    res.status(registrationResult.status).json(result);
  }
);

router.post("/login", loginValidator(), async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const loginResult = await loginUser(req.body);
  var result: any = {};
  if (loginResult.error) {
    result.error = loginResult.error;
  } else {
    result = loginResult.data;
  }
  res.status(loginResult.status).json(result);
});

router.post(
  "/refresh",
  refreshValidator(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const refreshTokenResult = await refreshAccessToken(req.body);
    var result: any = {};
    if (refreshTokenResult.error) {
      result.error = refreshTokenResult.error;
    } else {
      result = refreshTokenResult.data;
    }
    res.status(refreshTokenResult.status).json(result);
  }
);

export default router;
