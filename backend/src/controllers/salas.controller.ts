import { Request, Response } from 'express';
import * as SalasService from '../services/salas.service.ts';
import { asyncErrorHandler } from '../middlewares/async-handler.ts';
import { Status } from '../utils/http-status-code.ts';

export const getAllSalas = asyncErrorHandler(async (_req: Request, res: Response) => {
  const salas = await SalasService.handleGetAllSalas();
  return res.status(Status.OK).json(salas);
});

export const createSalas = asyncErrorHandler(async (req: Request, res: Response) => {
  const new_sala = await SalasService.handlePostSala(req.body);
  return res.status(Status.Created).json({ message: 'Sala inserida com sucesso', new_sala });
});

export const updateSala = asyncErrorHandler(async (req: Request, res :Response) => {
  const id = Number(req.params.id);
  const updated_sala = await SalasService.handleEditSala(id, req.body);
  
  return res.status(Status.OK).json({ message: `Sala do id ${id} editada com sucesso`, updated_sala })
});

export const patchUpdateSala = asyncErrorHandler(async (req: Request, res :Response) => {
  const id = Number(req.params.id);
  const patchedSala = await SalasService.handlePatchSala(id, req.body);
  
  return res.status(Status.OK).json({ message: `Sala do id ${id} alterada com sucesso`, patchedSala })
});

export const deleteSalaById = asyncErrorHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const deleted_sala = await SalasService.handleDeleteSalaById(id);
  return res.status(Status.OK).json({ message: `Sala do id ${id} deletada com sucesso`, deleted_sala })
});