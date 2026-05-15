import { supabase } from "../config/supabase.ts";
import { SalaModel } from "../models/Sala.ts";
import { searchSalaIdRepository } from "../repositories/salas.repository.ts";
import { AppError } from "../utils/app-error.ts";
import { Status } from "../utils/http-status-code.ts";

export const handleGetAllSalas = async () => {
  const { data: salas, error } = await supabase
    .from('salas')
    .select('*, turmas:turma_id (*)'); // faz um JOIN automático e retorna os dados da turma dentro de cada sala

  if (error) throw new AppError('Algo deu errado na listagem das salas', Status.InternalServerError, error.message); // 500

  return salas;
};

export const handlePostSala = async (salaBody: SalaModel) => {
  const { nome, capacidade, turma_id } = salaBody;
  if (!nome || !capacidade) throw new AppError('Nome e capacidade são obrigatórios', Status.BadRequest); // 400

  const [ // Executar todas as consultas de validação em paralelo
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

  if (turmaError && turma_id) throw new AppError('Turma não encontrada', Status.NotFound, turmaError.message); // 404
  if (salaTurmaError && turma_id) throw new AppError('Algo deu errado ao verificar alocação da Turma', Status.InternalServerError, salaTurmaError.message); // 500 
  if (salaNomeError) throw new AppError('Algo deu errado ao verificar duplicidade do nome da Sala', Status.InternalServerError, salaNomeError.message); // 500

  if (salaComMesmoNome && salaComMesmoNome.length > 0) throw new AppError(`Já existe uma sala com este nome: ${salaBody.nome}`, Status.Conflict); // 409
  if (salasComTurmaAlocada && salasComTurmaAlocada.length > 0) throw new AppError('Essa Turma já está alocada em outra Sala', Status.Conflict); // 409
  if (turma && turma.qtd_alunos > capacidade) throw new AppError('Quantidade de alunos excede a capacidade da Sala', Status.BadRequest); // 400

  // Inserir a sala
  const { data: newSala, error } = await supabase
    .from('salas')
    .insert({ nome, capacidade, turma_id })
    .select();
  if (error) throw new AppError('Algo deu errado ao inserir a sala', Status.InternalServerError, error.message); // 500

  return newSala;
};

export const handleEditSala = async (id: number, salaBody: SalaModel) => {
  const salaId = await searchSalaIdRepository(id);
  if (!salaId) throw new AppError(`O id informado (${id}) da Sala para edição é inválido ou não existe`, Status.NotFound); // 404

  const { nome, capacidade, turma_id } = salaBody
  if (!nome || !capacidade || !turma_id) throw new AppError('Nome, capacidade e Turma são campos obrigatórios da Sala', Status.BadRequest); // 400

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
      .select('nome, id_sala')
      .eq('nome', nome)
      .neq('id_sala', id),
    supabase
      .from('salas')
      .select('id_sala')
      .eq('turma_id', turma_id)
      .neq('id_sala', id),
  ]);

  if (turmaError && turma_id) throw new AppError('Turma não encontrada', Status.NotFound, turmaError.message); // 404
  if (salaTurmaError && turma_id) throw new AppError('Algo deu errado ao verificar alocação da Turma', Status.InternalServerError, salaTurmaError.message); // 500 
  if (salaNomeError) throw new AppError('Algo deu errado ao verificar duplicidade do nome da Sala', Status.InternalServerError, salaNomeError.message); // 500

  if (salaComMesmoNome && salaComMesmoNome.length > 0) throw new AppError(`Já existe uma Sala com este nome: ${salaBody.nome}`, Status.Conflict); // 409
  if (salasComTurmaAlocada && salasComTurmaAlocada.length > 0) throw new AppError('Essa Turma já está alocada em outra Sala', Status.Conflict); // 409
  if (turma && turma.qtd_alunos > capacidade) throw new AppError('Quantidade de alunos excede a capacidade da Sala', Status.BadRequest); // 400

  const { data: updatedSala, error } = await supabase
    .from('salas')
    .update({ nome, capacidade, turma_id })
    .eq('id_sala', id)
    .select('*, turmas:turma_id (*)');
  if (error) throw new AppError(`Algo deu errado na edição da Sala do id ${id}: ${error.message}`, Status.InternalServerError); // 500

  return updatedSala;
};

export const handlePatchSala = async (id: number, salaBody: SalaModel) => {
  const salaId = await searchSalaIdRepository(id);
  if (!salaId) throw new AppError(`O id informado (${id}) da Sala para edição é inválido ou não existe`, Status.NotFound); // 404

  const { nome, capacidade, turma_id } = salaBody

  // Monta só os campos que vieram de fato no body
  const fieldsToUpdate = Object.fromEntries(
    Object.entries({ nome, capacidade, turma_id }).filter(([_, value]) => value !== undefined)
  );
  if (Object.keys(fieldsToUpdate).length === 0) throw new AppError('Nenhum campo válido foi informado para alteração da Sala', Status.BadRequest); // 400

  const { data } = await supabase
    .from('salas')
    .select('turma_id')
    .eq('id_sala', id)
    .single();

  const [
    { data: turma, error: turmaError },
    { data: salaComMesmoNome, error: salaNomeError },
    { data: salasComTurmaAlocada, error: salaTurmaError }
  ] = await Promise.all([
    supabase
      .from('turmas')
      .select('qtd_alunos')
      .eq('id_turma', data?.turma_id)
      .single(),
    supabase
      .from('salas')
      .select('nome, id_sala')
      .eq('nome', nome)
      .neq('id_sala', id),
    supabase
      .from('salas')
      .select('id_sala')
      .eq('turma_id', turma_id)
      .neq('id_sala', id),
  ]);

  if (turmaError && turma_id) throw new AppError('Turma não encontrada', Status.NotFound, turmaError.message); // 404
  if (salaTurmaError && turma_id) throw new AppError('Algo deu errado ao verificar alocação da Turma', Status.InternalServerError, salaTurmaError.message); // 500 
  if (salaNomeError) throw new AppError('Algo deu errado ao verificar duplicidade do nome da Sala', Status.InternalServerError, salaNomeError.message); // 500

  if (salaComMesmoNome && salaComMesmoNome.length > 0) throw new AppError(`Já existe uma Sala com este nome: ${salaBody.nome}`, Status.Conflict); // 409
  if (salasComTurmaAlocada && salasComTurmaAlocada.length > 0) throw new AppError('Essa Turma já está alocada em outra Sala', Status.Conflict); // 409
  if (turma && turma.qtd_alunos > capacidade) throw new AppError('Quantidade de alunos excede a capacidade da Sala', Status.BadRequest); // 400

  const { data: patchedSala, error } = await supabase
    .from('salas')
    .update(fieldsToUpdate)
    .eq('id_sala', id)
    .select('*, turmas:turma_id (*)');
  if (error) throw new AppError(`Algo deu errado na edição da Sala do id ${id}: ${error.message}`, Status.InternalServerError); // 500

  return patchedSala;
};

export const handleDeleteSalaById = async (id: number | string) => {
  const { data: salaId } = await supabase
    .from('salas')
    .select('id_sala')
    .eq('id_sala', id)
    .single();

  if (!salaId) throw new AppError(`O id informado (${id}) da Sala para deleção é inválido ou não existe`, Status.NotFound); // 404

  const { data: deletedSala, error } = await supabase
    .from('salas')
    .delete()
    .eq('id_sala', id)
    .select();

  if (error) throw new AppError(`Algo deu errado na exclusão dos dados do id ${id}: ${error.message}`, Status.InternalServerError); // 500

  return deletedSala;
};