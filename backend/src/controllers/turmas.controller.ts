import { Request, Response } from 'express';
import * as TurmasService from '../services/turmas.service.ts';
import { asyncErrorHandler } from '../middlewares/async-handler.ts';
import { Status } from '../utils/http-status-code.ts';

export const getTurmas = asyncErrorHandler(async (_req: Request, res: Response) => {
  const turmas = await TurmasService.handleGetAllTurmas();
  return res.status(Status.OK).json({ turmas });
});

export const createTurma = asyncErrorHandler(async (req: Request, res: Response) => {
  const newTurma = await TurmasService.handlePostTurma(req.body);
  return res.status(Status.Created).json({ message: 'Turma inserida com sucesso', newTurma });
});

export const deleteTurmaById = asyncErrorHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const deletedTurma = await TurmasService.handleDeleteTurmaById(id);

  return res.status(Status.OK).json({ message: `Turma do id ${id} deletada com sucesso`, deletedTurma })
});

export const updateTurma = asyncErrorHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const updateTurma = await TurmasService.handleEditTurma(id, req.body);

  return res.status(Status.OK).json({ message: `Turma do id ${id} editada com sucesso`, updateTurma })
});

// TODO
export const patchTurma = asyncErrorHandler(async (req: Request, res: Response) => {

});