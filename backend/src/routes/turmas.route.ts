import { Router } from 'express';
import { createTurma, getTurmas, getTurmaById, updateTurma, patchUpdateTurma, deleteTurmaById } from '../controllers/turmas.controller.ts';

const router = Router();

router.route('/')
  .get(getTurmas)
  .post(createTurma)
;
router.route('/:id')
  .get(getTurmaById)
  .put(updateTurma)
  .patch(patchUpdateTurma)
  .delete(deleteTurmaById)
;

export default router;