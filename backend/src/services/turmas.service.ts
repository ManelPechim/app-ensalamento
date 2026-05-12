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

export const handlePostTurmas = async (turmaBody: TurmaModel) => {
  const { nome, curso, qtd_alunos } = turmaBody;
  // Validação básica
  if (!nome || !curso || !qtd_alunos) {
    throw new AppError('Nome, curso e quantidade de alunos são obrigatórios', Status.BadRequest); // 400
  };

  // Verificar duplacidade de nome de turma
  const { data: turmaComMesmoNome, error: err } = await supabase
    .from('turmas')
    .select('nome')
    .eq('nome', nome);

  if (err) throw new AppError('Algo deu errado ao verificar duplicidade da turma', Status.InternalServerError, err.message); // 500 

  if (turmaComMesmoNome && turmaComMesmoNome.length > 0) {
    throw new AppError(`Já existe uma turma com este nome: ${turmaBody.nome}`, Status.Conflict); // 409
  };

  // Inserir a turma
  const { data: newTurma, error } = await supabase
    .from('turmas')
    .insert({ nome, curso, qtd_alunos })
    .select();

  if (error) throw new AppError('Algo deu errado ao inserir a turma', Status.InternalServerError, error.message); // 500

  return newTurma;
}

export const handleDeleteTurmaById = async (id: number | string) => {
  const { data: turmaId, error: err } = await supabase
    .from('turmas')
    .select('id_turma')
    .eq('id_turma', id)
    .single()

  if (!turmaId) {
    throw new AppError(`O id informado (${id}) da Turma para deleção é inválido ou não existe`, Status.NotFound); // 404
  };

  if (err) {
    throw new AppError(
      `Algo deu errado na busca do id ${id} da Turma:
      ${err}`,
      Status.InternalServerError,
    );
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