import { Router } from 'express';
import { getTurmas, createTurmas } from '../controllers/turmas.controller.js';

const router = Router();

router.get('/turmas', getTurmas);
router.post('/turmas', createTurmas);

export default router;