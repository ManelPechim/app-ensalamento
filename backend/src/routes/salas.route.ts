import { Router } from "express";
import * as SalasController from "../controllers/salas.controller.ts";

const router = Router();

router.route('/')
  .get(SalasController.getAllSalas)
  .post(SalasController.createSalas)
;
router.route('/:id')
  .get(SalasController.getSalaById)
  .put(SalasController.updateSala)
  .patch(SalasController.patchUpdateSala)
  .delete(SalasController.deleteSalaById)
;
export default router;