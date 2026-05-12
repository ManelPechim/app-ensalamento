import { Router } from "express";
import * as SalaController from "../controllers/salas.controller.ts";

const router = Router();

router.route('/')
  .get(SalaController.getSalas)
  .post(SalaController.createSalas)
;
router.route('/:id')
  .delete(SalaController.deleteSalaById)
;
export default router;