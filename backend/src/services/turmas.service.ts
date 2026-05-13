import { supabase } from "../config/supabase.ts";
import { TurmaModel } from "../models/Turma.ts";
import { getTurmaIdRepository } from "../repositories/turmas.repository.ts";
import { AppError } from "../utils/app-error.ts";
import { Status } from "../utils/http-status-code.ts";

export const handleGetAllTurmas = async () => {
  const { data: turmas, error } = await supabase
    .from('turmas')
    .select('*');

  if (error) throw new AppError(`Algo deu errado na listagem das Turmas: ${error.message}`, Status.InternalServerError); // 500
  
  return turmas;
};

export const handlePostTurma = async (turmaBody: TurmaModel) => {
  const { nome, curso, qtd_alunos } = turmaBody;
  // Validação básica
  if (!nome || !curso || !qtd_alunos) throw new AppError('Nome, curso e quantidade de alunos são campos obrigatórios', Status.BadRequest); // 400

  // Busca no banco um nome que igual ao nome inserido no body
  const { data: turmaComMesmoNome, error: err } = await supabase
    .from('turmas')
    .select('nome')
    .eq('nome', nome);
  // Verifica duplacidade de nome de turma
  if (err) throw new AppError('Algo deu errado ao verificar duplicidade da turma', Status.InternalServerError, err.message); // 500 
  if (turmaComMesmoNome && turmaComMesmoNome.length > 0) throw new AppError(`Já existe uma turma com este nome: ${turmaBody.nome}`, Status.Conflict); // 409

  // Inserir a turma
  const { data: newTurma, error } = await supabase
    .from('turmas')
    .insert({ nome, curso, qtd_alunos })
    .select();

  if (error) throw new AppError('Algo deu errado ao inserir a turma', Status.InternalServerError, error.message); // 500

  return newTurma;
};

// TODO: VALIDAR SE O NOME INSERIDO PARA SER EDITADO ESTÁ EM USO 
export const handleEditTurma = async (id: number | string, turmaBody: TurmaModel) => {
  const turmaId = await getTurmaIdRepository(id);
  if (!turmaId) throw new AppError(`O id informado (${id}) da Turma para edição é inválido ou não existe`, Status.NotFound); // 404

  const { nome, curso, qtd_alunos } = turmaBody;
  if (!nome || !curso || !qtd_alunos) throw new AppError('Nome, curso e quantidade de alunos são campos obrigatórios', Status.BadRequest);

  const { data: updatedTurma, error } = await supabase
    .from('turmas')
    .update({ nome, curso, qtd_alunos })
    .eq('id_turma', id)
    .select();

  if (error) throw new AppError(`Algo deu errado na edição da Turma do id ${id}: ${error.message}`, Status.InternalServerError); // 500

  return updatedTurma;
};

export const handleDeleteTurmaById = async (id: number | string) => {
  const turmaId = await getTurmaIdRepository(id);
  if (!turmaId) throw new AppError(`O id informado (${id}) da Turma para deleção é inválido ou não existe`, Status.NotFound); // 404

  const { data: deletedTurma, error } = await supabase
    .from('turmas')
    .delete()
    .eq('id_turma', id)
    .select();

  if (error) throw new AppError(`Algo deu errado na exclusão dos dados do id ${id}: ${error.message}`, Status.InternalServerError); // 500

  return deletedTurma;
};