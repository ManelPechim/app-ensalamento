import { Request, Response } from 'express';
import * as SalasService from '../services/salas.service.ts';
import { asyncErrorHandler } from '../middlewares/async-handler.ts';
import { Status } from '../utils/http-status-code.ts';

export const getAllSalas = asyncErrorHandler(async (_req: Request, res: Response) => {
  const salas = await SalasService.handleGetAllSalas();
  return res.status(Status.OK).json(salas);
});

export const getSalaById = asyncErrorHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const salaById = await SalasService.handleGetSalaById(id);
  return res.status(Status.OK).json({ salaById })
});

export const createSalas = asyncErrorHandler(async (req: Request, res: Response) => {
  const newSala = await SalasService.handlePostSala(req.body);
  return res.status(Status.Created).json({ message: 'Sala inserida com sucesso', newSala });
});

export const updateSala = asyncErrorHandler(async (req: Request, res :Response) => {
  const id = Number(req.params.id);
  const updatedSala = await SalasService.handleEditSala(id, req.body);
  return res.status(Status.OK).json({ message: `Sala do id ${id} editada com sucesso`, updatedSala })
});

export const patchUpdateSala = asyncErrorHandler(async (req: Request, res :Response) => {
  const id = Number(req.params.id);
  const patchedSala = await SalasService.handlePatchSala(id, req.body);
  return res.status(Status.OK).json({ message: `Sala do id ${id} alterada com sucesso`, patchedSala })
});

export const deleteSalaById = asyncErrorHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const deletedSala = await SalasService.handleDeleteSalaById(id);
  return res.status(Status.OK).json({ message: `Sala do id ${id} deletada com sucesso`, deletedSala })
});