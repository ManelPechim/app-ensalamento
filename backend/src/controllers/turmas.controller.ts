import { Request, Response } from 'express';
import * as TurmasService from '../services/turmas.service.ts';
import { asyncErrorHandler } from '../middlewares/async-handler.ts';
import { Status } from '../utils/http-status-code.ts';

export const getAllTurmas = asyncErrorHandler(async (_req: Request, res: Response) => {
  const turmas = await TurmasService.handleGetAllTurmas();
  return res.status(Status.OK).json({ turmas });
});

export const getTurmaById = asyncErrorHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const turmaById = await TurmasService.handleGetTurmaById(id)
  return res.status(Status.OK).json({ turmaById })
});

export const createTurma = asyncErrorHandler(async (req: Request, res: Response) => {
  const newTurma = await TurmasService.handlePostTurma(req.body);
  return res.status(Status.Created).json({ message: 'Turma inserida com sucesso', newTurma });
});

export const updateTurma = asyncErrorHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const updateTurma = await TurmasService.handleEditTurma(id, req.body);

  return res.status(Status.OK).json({ message: `Turma do id ${id} editada com sucesso`, updateTurma })
});

export const patchUpdateTurma = asyncErrorHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const patchedTurma = await TurmasService.handlePatchTurma(id, req.body);

  return res.status(Status.OK).json({ message: `Turma do id ${id} foi alterada com sucesso`, patchedTurma});
});

export const deleteTurmaById = asyncErrorHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const deletedTurma = await TurmasService.handleDeleteTurmaById(id);

  return res.status(Status.OK).json({ message: `Turma do id ${id} deletada com sucesso`, deletedTurma })
});
