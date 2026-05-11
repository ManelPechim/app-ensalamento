import { Router } from "express";
import { getSalas, createSalas } from "../controllers/salas.controller.ts";

const router = Router();

router.get('/', getSalas);
router.post('/', createSalas);

export default router;