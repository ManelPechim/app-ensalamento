import { supabase } from "../config/supabase.ts";
import { TurmaModel } from "../models/turma-model.ts";
import { AppError } from "../utils/app-error.ts";
import { Status } from "../utils/http-status-code.ts";

export const handleGetAllTurmas = async () => {
  const { data: turmas, error } = await supabase
    .from('turmas')
    .select('*');

  if (error) {
    throw new AppError(
      `Algo deu errado na listagem das Turmas: ${error.message}`,
      Status.InternalServerError // 500
    );
  };
  return turmas;
};

export const handlePostTurmas = async (turmasData: TurmaModel) => {
  const { nome, curso, qtd_alunos } = turmasData;
  // Validação básica
  if (!nome || !curso || !qtd_alunos) {
    throw new AppError('Nome, curso e quantidade de alunos são obrigatórios', Status.BadRequest); // 400
  };

  // Verificar duplacidade de nome de turma
  const { data: turmaComMesmoNome, error: err } = await supabase
    .from('turmas')
    .select('nome')
    .eq('nome', nome);

  if (err) {
    throw new AppError(
      'Algo deu errado ao verificar duplicidade da turma',
      Status.InternalServerError, // 500
      err.message
    );
  }
  
  
  if (turmaComMesmoNome && turmaComMesmoNome.length > 0) {
    const nomeInput = turmaComMesmoNome.find(turma => turma.nome === turmasData.nome) 
    throw new AppError(`Já existe uma turma com este nome: ${nomeInput?.nome}`, Status.Conflict); // 409
  };

  // Inserir a turma
  const { data, error } = await supabase
    .from('turmas')
    .insert({ nome, curso, qtd_alunos })
    .select();

  if (error) {
    throw new AppError(
      'Algo deu errado ao inserir a turma',
      Status.InternalServerError, // 500
      error.message
    );
  }

  return data;
}

export const handleDeleteTurmaById = async (id: number | string) => {
  const { data: turmaId } = await supabase
    .from('turmas')
    .select('id_turma')
    .eq('id_turma', id)
    .single()
  
  if (!turmaId) {
    throw new AppError(`O id informado (${id}) para deleção é inválido ou não existe`, Status.NotFound); // 404
  };

  const { data: deletedTurma, error } = await supabase
    .from('turmas')
    .delete()
    .eq('id_turma', id)
    .select();

  if (error) {
    throw new AppError(
      `Algo deu errado na exclusão dos dados do id ${id}: 
      ${error.message}`,
      Status.InternalServerError
    );
  };

  return deletedTurma;
  
};