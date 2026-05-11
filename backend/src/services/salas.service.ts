import { supabase } from "../config/supabase.ts";
import { SalaModel } from "../models/sala-model.ts";
import { AppError } from "../utils/app-error.ts";
import { Status } from "../utils/http-status-code.ts";

export const getAllSalas = async () => {
  const { data, error } = await supabase
    .from('salas')
    .select('*, turmas:turma_id (*)'); // faz um JOIN automático e retorna os dados da turma dentro de cada sala

  if (error) {
    throw new AppError(
      'Algo deu errado na listagem das salas',
      Status.InternalServerError, // 500
      error.message
    );
  };

  return data;
};

export const registerSalas = async (salasData: SalaModel) => {
  const { nome, capacidade, turma_id } = salasData;
  // Validação básica
  if (!nome || !capacidade || !turma_id) {
    throw new AppError('Nome, capacidade e turma são obrigatórios', Status.BadRequest); // 400
  };

  // Executar todas as consultas de validação em paralelo
  const [
    { data: turma, error: turmaError },
    { data: salaComMesmoNome, error: salaNomeError },
    { data: salasComTurmaAlocada, error: salaTurmaError }
  ] = await Promise.all([
    supabase
      .from('turmas')
      .select('qtd_alunos')
      .eq('id_turma', turma_id)
      .single(),
    supabase
      .from('salas')
      .select('nome')
      .eq('nome', nome),
    supabase
      .from('salas')
      .select('id_sala')
      .eq('turma_id', turma_id)
  ]);

  // Validar resultados
  if (turmaError) {
    throw new AppError('Turma não encontrada', Status.NotFound); // 404
  };

  if (salaNomeError) {
    throw new AppError(
      'Algo deu errado ao verificar nome da sala',
      Status.InternalServerError, // 500
      salaNomeError.message
    );
  };

  if (salaTurmaError) {
    throw new AppError(
      'Algo deu errado ao verificar alocação da turma',
      Status.InternalServerError, // 500
      salaTurmaError.message
    );
  };

  if (salaComMesmoNome && salaComMesmoNome.length > 0) {
    throw new AppError(
      'Já existe uma sala com este nome',
      Status.Conflict // 409
    );
  };

  if (salasComTurmaAlocada && salasComTurmaAlocada.length > 0) {
    throw new AppError(
      'Essa turma já está alocada em outra sala',
      Status.Conflict // 409
    );
  };

  if (turma && turma.qtd_alunos > capacidade) {
    throw new AppError(
      'Quantidade de alunos excede a capacidade da sala',
      Status.BadRequest // 400
    );
  };

  // Inserir a sala
  const { data, error } = await supabase
    .from('salas')
    .insert({ nome, capacidade, turma_id })
    .select();

  if (error) {
    throw new AppError('Algo deu errado ao inserir a sala',
      Status.InternalServerError, // 500
      error.message
    );
  };

  return data;
};