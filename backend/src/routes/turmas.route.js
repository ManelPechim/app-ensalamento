import { Router } from 'express';
import { getTurmas, createTurmas } from '../controllers/turmas.controller.js';

const router = Router();

router.get('js/', getTurmas);
router.post('js/', createTurmas);

export default router;