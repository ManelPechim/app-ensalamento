import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { Status } from './src/utils/http-status-code.ts';

import turmaRoutes from './src/routes/turmas.route.ts';
import salasRoutes from './src/routes/salas.route.ts';
import { errorHandler } from './src/middlewares/error-handler.ts';
import { AppError } from './src/utils/app-error.ts';


// Express configs
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }))
app.use(helmet());

// Endpoints
app.use('/api/turmas', turmaRoutes);
app.use('/api/salas', salasRoutes);

// // Teste para ver se o servidor ta rodando
// app.use('/', (req: Request, res: Response) => {
//   res.send("Hello World!");
// });

app.use('/', (req: Request, res: Response, next: NextFunction) => {
  const err = new AppError(`Não foi possível achar ${req.originalUrl} no servidor!`, Status.NotFound);
  next(err);
})

// Tratamento de erro global
app.use(errorHandler);

export default app;