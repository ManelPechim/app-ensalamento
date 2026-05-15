import { Router } from 'express';
import * as TurmasController from '../controllers/turmas.controller.ts';

const router = Router();

router.route('/')
  .get(TurmasController.getAllTurmas)
  .post(TurmasController.createTurma)
;
router.route('/:id')
  .get(TurmasController.getTurmaById)
  .put(TurmasController.updateTurma)
  .patch(TurmasController.patchUpdateTurma)
  .delete(TurmasController.deleteTurmaById)
;

export default router;