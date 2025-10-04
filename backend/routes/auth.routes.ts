import { Router } from "express";
import { signup, login } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { me } from "../controllers/auth.controller";
const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, me);

export default router;