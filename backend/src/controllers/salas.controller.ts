import { Request, Response } from 'express';
import * as salasService from '../services/salas.service.ts';
import { asyncErrorHandler } from '../middlewares/async-handler.ts';

export const getSalas = asyncErrorHandler(async (_req: Request, res: Response) => {
  const data = await salasService.getAllSalas();
  return res.status(200).json(data);
});

export const createSalas = asyncErrorHandler(async (req: Request, res: Response) => {
  const newSala = await salasService.registerSalas(req.body);
  return res.status(201).json({ message: 'Sala inserida com sucesso', data: { newSala } });
});