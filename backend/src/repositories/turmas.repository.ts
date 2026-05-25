import { supabase } from "../config/database/supabase.ts";
import { TurmaModel } from "../models/Turma.ts";
import { AppError } from "../utils/app-error.ts";
import { Status } from "../utils/http-status-code.ts";

export const searchTurmaId = async (idTurma: TurmaModel['id_turma']) => {
  const { data: turmaId } = await supabase
    .from('turmas')
    .select('id_turma')
    .eq('id_turma', idTurma)
    .single();

  return { turmaId };
};

export const turmaComMesmoNome = async (nome: TurmaModel['nome'], idTurma?: TurmaModel['id_turma']) => {
  const searchMesmoNome = supabase // Busca no banco um nome que seja igual ao nome inserido no body
    .from('turmas')
    .select('nome')
    .eq('nome', nome)

  if (idTurma) searchMesmoNome.neq('id_turma', idTurma);

  const { data: turmaComMesmoNome, error: err } = await searchMesmoNome;
  if (err) throw new AppError('Algo deu errado ao verificar duplicidade do nome da Turma', Status.InternalServerError, err.message); // 500 
  if (turmaComMesmoNome && turmaComMesmoNome.length > 0) throw new AppError(`Já existe uma Turma com este nome: ${nome}`, Status.Conflict); // 409
  // Verifica duplacidade de nome de turma
  return;
};

export const salaCapacidadeMaiorTurmaQtdAlunos = async (idTurma: TurmaModel['id_turma'], qtdAlunos: TurmaModel['qtd_alunos']) => {
  const { data: sala, error: salaError } = await supabase
    .from('salas')
    .select('capacidade')
    .eq('turma_id', idTurma)
    .single();
  if (salaError) throw new AppError(`Algo deu errado ao verificar a capacidade da Sala, ${salaError}`, Status.InternalServerError); // 500
  if (sala && sala.capacidade < qtdAlunos) throw new AppError('A Turma já alocada em uma Sala não pode ter sua quantidade de alunos maior que a capacidade da Sala', Status.BadRequest); // 400
  return;
};