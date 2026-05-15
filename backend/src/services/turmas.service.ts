import { supabase } from "../config/supabase.ts";
import { TurmaModel } from "../models/Turma.ts";
import { getTurmaIdRepository } from "../repositories/turmas.repository.ts";
import { AppError } from "../utils/app-error.ts";
import { Status } from "../utils/http-status-code.ts";

export const handleGetAllTurmas = async () => {
  const { data: allTurmas, error } = await supabase
    .from('turmas')
    .select('*');

  if (error) throw new AppError(`Algo deu errado na listagem das Turmas: ${error.message}`, Status.InternalServerError); // 500

  return allTurmas;
};

export const handleGetTurmaById = async (id: number | string) => {
  const turmaId = await getTurmaIdRepository(id);
  if (!turmaId) throw new AppError(`O id informado (${id}) da Turma para edição é inválido ou não existe`, Status.NotFound); // 404

  const { data: turma, error } = await supabase
    .from('turmas')
    .select('*')
    .eq('id_turma', id);

  if (error) throw new AppError(`Algo deu errado na listagem das Turmas: ${error.message}`, Status.InternalServerError); // 500

  return turma;
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

export const handleEditTurma = async (id: number | string, turmaBody: TurmaModel) => {
  const turmaId = await getTurmaIdRepository(id);
  if (!turmaId) throw new AppError(`O id informado (${id}) da Turma para edição é inválido ou não existe`, Status.NotFound); // 404

  const { nome, curso, qtd_alunos } = turmaBody;
  if (!nome || !curso || !qtd_alunos) throw new AppError('Nome, curso e quantidade de alunos são campos obrigatórios', Status.BadRequest); // 400

  const { data: turmaComMesmoNome, error: err } = await supabase
    .from('turmas')
    .select('nome')
    .eq('nome', nome);

  if (turmaComMesmoNome && turmaComMesmoNome.length > 0) throw new AppError(`Já existe uma turma com este nome: ${turmaBody.nome}`, Status.Conflict); // 409
  if (err) throw new AppError('Algo deu errado ao verificar duplicidade da turma na edição', Status.InternalServerError, err.message); // 500 

  const { data: updatedTurma, error } = await supabase
    .from('turmas')
    .update({ nome, curso, qtd_alunos })
    .eq('id_turma', id)
    .select();

  if (error) throw new AppError(`Algo deu errado na edição da Turma do id ${id}: ${error.message}`, Status.InternalServerError); // 500

  return updatedTurma;
};

export const handlePatchTurma = async (id: number | string, turmaBody: Partial<TurmaModel>) => {
  const turmaId = await getTurmaIdRepository(id);
  if (!turmaId) throw new AppError(`O id informado (${id}) da Turma para alteração é inválido ou não existe`, Status.NotFound); // 404

  const { nome, curso, qtd_alunos } = turmaBody;

  const { data: turmaComMesmoNome, error: err } = await supabase
    .from('turmas')
    .select('nome')
    .eq('nome', nome);

  if (turmaComMesmoNome && turmaComMesmoNome.length > 0) throw new AppError(`Já existe uma turma com este nome: ${turmaBody.nome}`, Status.Conflict); // 409
  if (err) throw new AppError('Algo deu errado ao verificar duplicidade da turma na edição', Status.InternalServerError, err.message); // 500 

  // Monta só os campos que vieram de fato no body
  const fieldsToUpdate = Object.fromEntries(
    Object.entries({ nome, curso, qtd_alunos }).filter(([_, value]) => value !== undefined)
  );

  if (Object.keys(fieldsToUpdate).length === 0) throw new AppError('Nenhum campo válido foi informado para alteração da Turma', Status.BadRequest); // 400

  const { data: patchedTurma, error } = await supabase
    .from('turmas')
    .update(fieldsToUpdate)
    .eq('id_turma', id)
    .select();

  if (error) throw new AppError(`Algo deu errado no processo de alteração de algum campo da Turma do id ${id}: ${error.message}`, Status.InternalServerError); // 500

  return patchedTurma;
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