import { Router } from 'express';
import { DestinationController } from '../controllers/destination.controller';

const router = Router();
const destinationController = new DestinationController();

router.get('/random', destinationController.getRandomDestination);
router.get('/:id', destinationController.getDestination);

export default router;