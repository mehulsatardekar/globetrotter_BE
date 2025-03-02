import { Router } from "express";
import { GameController } from "../controllers/game.controller";

const router = Router();
const gameController = new GameController();

// More specific routes first
router.get("/session/:id", gameController.getGame); // This should come before other routes
router.get("/share/:shareCode", gameController.getSharedGame);

// Then general routes
router.post("/start", gameController.startGame);
router.post("/:sessionId/answer", gameController.submitAnswer);
router.post("/:sessionId/end", gameController.endGame);

export default router;
