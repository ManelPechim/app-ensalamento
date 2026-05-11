import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error.ts';
import { Status } from '../utils/http-status-code.ts';
// Middleware de tratamento global de erros. Se houver algum erro na aplicação 
// (desde de erros de servidor ou até mesmo de regras de negócios),
// como AppError ou Error, vai ser tratado aqui.
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // err.statusCode = err.statusCode || 500;
  // err.status = err.status || 'error';
  // res.status(err.statusCode).json({
  //   status: err.statusCode,
  //   message: err.message
  // });
  if (err instanceof AppError) {
    const body = err.details !== undefined
      ? { statusCode: err.statusCode, ERRO: err.message, details: err.details, status: err.status }
      : { ERRO: { statusCode: err.statusCode, message: err.message, status: err.status } };

    return res.status(err.statusCode).json(body);
  }

  return res.status(Status.InternalServerError).json({ ERRO: { statusCode: Status.InternalServerError, message: 'Erro interno do servidor' } }); // Default 500 (InternalServerError)
};
