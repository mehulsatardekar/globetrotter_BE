import { Router } from "express";
import userRoutes from "./user.routes";
import gameRoutes from "./game.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/games", gameRoutes);

export default router;
