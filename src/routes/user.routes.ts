import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();
const userController = new UserController();

router.get("/check-username", userController.checkUsername);
router.post("/register", userController.registerUser);
router.get("/leaderboard", userController.getLeaderboard);
router.get("/:userId/stats", userController.getUserStats);
router.post("/", userController.createUser);

export default router;
