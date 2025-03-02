import { Router } from "express";
import userRoutes from "./user.routes";
import gameRoutes from "./game.routes";
import destinationRoutes from "./destination.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/games", gameRoutes);
router.use("/destinations", destinationRoutes);

export default router;
