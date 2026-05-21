import { supabase } from "../config/database/supabase.ts";
import { TurmaModel } from "../models/Turma.ts";
import * as Repository from "../repositories/turmas.repository.ts";
import { AppError } from "../utils/app-error.ts";
import { Status } from "../utils/http-status-code.ts";

// TODO: Se a Turma já estiver alocada em uma sala e sua respsectiva quantidade de alunos for editada para uma quantidade
// maior que a capacidade da Sala, impedir tal e retornar um erro.

export const handleGetAllTurmas = async () => {
  const { data: allTurmas, error } = await supabase
    .from('turmas')
    .select('*')
    .order('id_turma');
  if (error) throw new AppError(`Algo deu errado na listagem das Turmas: ${error.message}`, Status.InternalServerError); // 500

  return allTurmas;
};

export const handleGetTurmaById = async (id: TurmaModel['id_turma']) => {
  const { turmaId } = await Repository.searchTurmaIdRepository(id);
  if (!turmaId) throw new AppError(`O id da Turma (${id}) informado é inválido ou não existe`, Status.NotFound); // 404

  const { data: turma, error } = await supabase
    .from('turmas')
    .select('*')
    .eq('id_turma', id);
  if (error) throw new AppError(`Algo deu errado na listagem da Turma: ${error.message}`, Status.InternalServerError); // 500

  return turma;
};

export const handlePostTurma = async (turmaBody: TurmaModel) => {
  const { nome, curso, qtd_alunos } = turmaBody; // Validação básica
  if (!nome || !curso || !qtd_alunos) throw new AppError('Nome, curso e quantidade de alunos são campos obrigatórios', Status.BadRequest); // 400

  await Repository.turmaComMesmoNomeRepository(nome);

  const { data: newTurma, error } = await supabase // Inserir a turma
    .from('turmas')
    .insert({ nome, curso, qtd_alunos })
    .select();
  if (error) throw new AppError('Algo deu errado ao inserir a turma', Status.InternalServerError, error.message); // 500

  return newTurma;
};

export const handleEditTurma = async (id: TurmaModel['id_turma'], turmaBody: TurmaModel) => {
  const { turmaId } = await Repository.searchTurmaIdRepository(id);
  if (!turmaId) throw new AppError(`O id da Turma (${id}) informado para edição é inválido ou não existe`, Status.NotFound); // 404

  const { nome, curso, qtd_alunos } = turmaBody;
  if (!nome || !curso || !qtd_alunos) throw new AppError('Nome, curso e quantidade de alunos da Turma são campos obrigatórios', Status.BadRequest); // 400

  await Repository.turmaComMesmoNomeRepository(nome, id);

  const { data: updatedTurma, error } = await supabase
    .from('turmas')
    .update({ nome, curso, qtd_alunos })
    .eq('id_turma', id)
    .select();
  if (error) throw new AppError(`Algo deu errado na edição da Turma do id ${id}: ${error.message}`, Status.InternalServerError); // 500

  return updatedTurma;
};

export const handlePatchTurma = async (id: TurmaModel['id_turma'], turmaBody: TurmaModel) => {
  const { turmaId } = await Repository.searchTurmaIdRepository(id);
  if (!turmaId) throw new AppError(`O id da Turma (${id}) informado para alteração é inválido ou não existe`, Status.NotFound); // 404

  const { nome, curso, qtd_alunos } = turmaBody;
  if (!nome && !curso && !qtd_alunos) throw new AppError('Nenhum campo válido foi informado para alteração da Turma', Status.BadRequest); // 400

  await Repository.turmaComMesmoNomeRepository(nome, id);

  const { data: patchedTurma, error } = await supabase
    .from('turmas')
    .update({ nome, curso, qtd_alunos })
    .eq('id_turma', id)
    .select();
  if (error) throw new AppError(`Algo deu errado no processo de alteração de algum campo da Turma do id ${id}: ${error.message}`, Status.InternalServerError); // 500

  return patchedTurma;
};

export const handleDeleteTurmaById = async (id: TurmaModel['id_turma']) => {
  const { turmaId } = await Repository.searchTurmaIdRepository(id);
  if (!turmaId) throw new AppError(`O id da Turma (${id}) informado para deleção é inválido ou não existe`, Status.NotFound); // 404

  const { data: deletedTurma, error } = await supabase
    .from('turmas')
    .delete()
    .eq('id_turma', id)
    .select();
  if (error) throw new AppError(`Algo deu errado na exclusão dos dados do id ${id}: ${error.message}`, Status.InternalServerError); // 500

  return deletedTurma;
};