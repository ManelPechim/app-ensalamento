import { Router } from "express";
import { getSalas, createSalas } from "../controllers/salas.controller.js";

const router = Router();

router.get('js/', getSalas);
router.post('js/', createSalas);

export default router;