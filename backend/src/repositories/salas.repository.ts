import { supabase } from "../config/database/supabase.ts";
import { SalaModel } from "../models/Sala.ts";
import { AppError } from "../utils/app-error.ts";
import { Status } from "../utils/http-status-code.ts";

export const searchSalaIdRepository = async (id: SalaModel['id_sala']) => {
  const { data: salaId } = await supabase
    .from('salas')
    .select('id_sala')
    .eq('id_sala', id)
    .single();

  return { salaId };
};

export const salaMutationValidationRepository = async (
  salaBody: SalaModel,
  turmaId: SalaModel['turma_id'],
  salaId?: SalaModel['id_sala']
) => {
  const salaNomeQuery = supabase
    .from('salas')
    .select('nome, id_sala')
    .eq('nome', salaBody.nome);

  const salaTurmaQuery = supabase
    .from('salas')
    .select('id_sala')
    .eq('turma_id', turmaId!);
    
  if (salaId) {
    salaNomeQuery.neq('id_sala', salaId);
    salaTurmaQuery.neq('id_sala', salaId);
  };

  const [
    { data: turma, error: turmaError },
    { data: salaComMesmoNome, error: salaNomeError },
    { data: salasComTurmaAlocada, error: salaTurmaError }
  ] = await Promise.all([
    supabase // turma
      .from('turmas')
      .select('qtd_alunos')
      .eq('id_turma', turmaId!)
      .single(),
    salaNomeQuery, // salaComMesmoNome
    salaTurmaQuery, // salasComTurmaAlocada
  ]);

  if (turmaError && turmaId) throw new AppError('Turma não encontrada', Status.NotFound, turmaError.message); // 404
  if (salaTurmaError && turmaId) throw new AppError('Algo deu errado ao verificar alocação da Turma', Status.InternalServerError, salaTurmaError.message); // 500 
  if (salaNomeError) throw new AppError('Algo deu errado ao verificar duplicidade do nome da Sala', Status.InternalServerError, salaNomeError.message); // 500

  if (salaComMesmoNome && salaComMesmoNome.length > 0) throw new AppError(`Já existe uma Sala com este nome: ${salaBody.nome}`, Status.Conflict); // 409
  if (salasComTurmaAlocada && salasComTurmaAlocada.length > 0) throw new AppError('Essa Turma já está alocada em outra Sala', Status.Conflict); // 409
  if (turma && turma.qtd_alunos > salaBody.capacidade) throw new AppError('Quantidade de alunos excede a capacidade da Sala', Status.BadRequest); // 400

  return;
};