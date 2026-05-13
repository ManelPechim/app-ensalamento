import { Router } from 'express';
import * as TurmaController from '../controllers/turmas.controller.ts';

const router = Router();

router.route('/')
  .get(TurmaController.getTurmas)
  .post(TurmaController.createTurma)
;
router.route('/:id')
  .put(TurmaController.updateTurma)
  .delete(TurmaController.deleteTurmaById)
;

export default router;