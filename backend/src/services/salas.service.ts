import { supabase } from "../config/supabase.ts";
import { SalaModel } from "../models/sala-model.ts";
import { AppError } from "../utils/app-error.ts";
import { Status } from "../utils/http-status-code.ts";

export const handleGetAllSalas = async () => {
  const { data: listSalas, error } = await supabase
    .from('salas')
    .select('*, turmas:turma_id (*)'); // faz um JOIN automático e retorna os dados da turma dentro de cada sala

  if (error) {
    throw new AppError(
      'Algo deu errado na listagem das salas',
      Status.InternalServerError, // 500
      error.message
    );
  };

  return listSalas;
};

export const handlePostSala = async (salaBody: SalaModel) => {
  const { nome, capacidade, turma_id } = salaBody;
  // Validação básica
  if (!nome || !capacidade) {
    throw new AppError('Nome e capacidade são obrigatórios', Status.BadRequest); // 400
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
  if (turmaError && turma_id) throw new AppError('Turma não encontrada', Status.NotFound, turmaError.message); // 404

  if (salaTurmaError && turma_id) throw new AppError('Algo deu errado ao verificar alocação da turma', Status.InternalServerError, salaTurmaError.message); // 500 

  if (salaNomeError) throw new AppError('Algo deu errado ao verificar duplicidade do nome da sala', Status.InternalServerError, salaNomeError.message); // 500

  if (salaComMesmoNome && salaComMesmoNome.length > 0) {
    throw new AppError(`Já existe uma sala com este nome: ${salaBody.nome}`, Status.Conflict); // 409
  }
  if (salasComTurmaAlocada && salasComTurmaAlocada.length > 0) throw new AppError('Essa turma já está alocada em outra sala', Status.Conflict); // 409

  if (turma && turma.qtd_alunos > capacidade) throw new AppError('Quantidade de alunos excede a capacidade da sala', Status.BadRequest); // 400

  // Inserir a sala
  const { data: newSala, error } = await supabase
    .from('salas')
    .insert({ nome, capacidade, turma_id })
    .select();

  if (error) {
    throw new AppError('Algo deu errado ao inserir a sala',
      Status.InternalServerError, // 500
      error.message
    );
  };

  return newSala;
};

export const handleDeleteSalaById = async (id: number | string) => {
  const { data: salaId, error: err } = await supabase
    .from('salas')
    .select('id_sala')
    .eq('id_sala', id)
    .single();

  if (!salaId) {
    throw new AppError(`O id informado (${id}) da Sala para deleção é inválido ou não existe`, Status.NotFound); // 404
  };

  if (err) {
    throw new AppError(
      `Algo deu errado na busca do id ${id} da Sala:
      ${err}`,
      Status.InternalServerError,
    );
  };

  const { data: deletedSala, error } = await supabase
    .from('salas')
    .delete()
    .eq('id_sala', id)
    .select();

  if (error) {
    throw new AppError(
      `Algo deu errado na exclusão dos dados do id ${id}: 
      ${error.message}`,
      Status.InternalServerError
    );
  };

  return deletedSala;
};