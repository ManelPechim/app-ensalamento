import { supabase } from "../config/database/supabase.ts";
import { SalaModel, SalaUpdate } from "../models/Sala.ts";
import * as Repository from "../repositories/salas.repository.ts";
import { AppError } from "../utils/app-error.ts";
import { Status } from "../utils/http-status-code.ts";

// TODO: Reaproveitar código repetido de querys do Suapbase, abstraindo-as no caminho repository/salas.repository.ts

export const handleGetAllSalas = async () => {
  const { data: allSalas, error } = await supabase
    .from('salas')
    .select('*, turmas:turma_id (*)') // faz um JOIN automático e retorna os dados da turma dentro de cada sala
    .order('id_sala');
  if (error) throw new AppError('Algo deu errado na listagem das salas', Status.InternalServerError, error.message); // 500

  return allSalas;
};

export const handleGetSalaById = async (id: number) => {
  const { salaId } = await Repository.searchSalaIdRepository(id);
  if (!salaId) throw new AppError(`O id informado (${id}) da Sala é inválido ou não existe`, Status.NotFound); // 404

  const { data: sala, error } = await supabase
    .from('salas')
    .select('*')
    .eq('id_sala', id);
  if (error) throw new AppError(`Algo deu errado na listagem da Sala: ${error.message}`, Status.InternalServerError); // 500

  return sala;
};

export const handlePostSala = async (salaBody: SalaModel) => {
  const { nome, capacidade, turma_id } = salaBody;
  if (!nome || !capacidade) throw new AppError('Nome e capacidade são obrigatórios', Status.BadRequest); // 400

  await Repository.salaMutationValidationRepository(salaBody, turma_id);

  const { data: newSala, error } = await supabase  // Inserir a sala
    .from('salas')
    .insert({ nome, capacidade, turma_id })
    .select();
  if (error) throw new AppError('Algo deu errado ao inserir a sala', Status.InternalServerError, error.message); // 500

  return newSala;
};

export const handleEditSala = async (id: number, salaBody: SalaModel) => {
  const { salaId } = await Repository.searchSalaIdRepository(id);
  if (!salaId) throw new AppError(`O id informado (${id}) da Sala para edição é inválido ou não existe`, Status.NotFound); // 404

  const { nome, capacidade, turma_id } = salaBody
  if (!nome || !capacidade || !turma_id) throw new AppError('Nome, capacidade e Turma são campos obrigatórios da Sala', Status.BadRequest); // 400

  await Repository.salaMutationValidationRepository(salaBody, turma_id, id);

  const { data: updatedSala, error } = await supabase
    .from('salas')
    .update({ nome, capacidade, turma_id })
    .eq('id_sala', id)
    .select('*, turmas:turma_id (*)');
  if (error) throw new AppError(`Algo deu errado na edição da Sala do id ${id}: ${error.message}`, Status.InternalServerError); // 500

  return updatedSala;
};

export const handlePatchSala = async (id: number, salaBody: SalaModel) => {
  const { salaId } = await Repository.searchSalaIdRepository(id);
  if (!salaId) throw new AppError(`O id informado (${id}) da Sala para edição é inválido ou não existe`, Status.NotFound); // 404

  const { nome, capacidade, turma_id } = salaBody
  if (!nome && !capacidade && !turma_id) throw new AppError('Nenhum campo válido foi informado para alteração da Sala', Status.BadRequest); // 400

  const { data: salaTurmaId } = await supabase
    .from('salas')
    .select('turma_id')
    .eq('id_sala', id)
    .single();

  await Repository.salaMutationValidationRepository(salaBody, salaTurmaId?.turma_id!, id);

  const { data: patchedSala, error } = await supabase
    .from('salas')
    .update({ nome, capacidade, turma_id })
    .eq('id_sala', id)
    .select('*, turmas:turma_id (*)');
  if (error) throw new AppError(`Algo deu errado na edição da Sala do id ${id}: ${error.message}`, Status.InternalServerError); // 500

  return patchedSala;
};

export const handleDeleteSalaById = async (id: number) => {
  const { salaId } = await Repository.searchSalaIdRepository(id);
  if (!salaId) throw new AppError(`O id informado (${id}) da Sala para deleção é inválido ou não existe`, Status.NotFound); // 404

  const { data: deletedSala, error } = await supabase
    .from('salas')
    .delete()
    .eq('id_sala', id)
    .select();
  if (error) throw new AppError(`Algo deu errado na exclusão dos dados do id ${id}: ${error.message}`, Status.InternalServerError); // 500

  return deletedSala;
};