import { supabase } from "../config/database/supabase.ts";
import { TurmaModel } from "../models/Turma.ts";
import { AppError } from "../utils/app-error.ts";
import { Status } from "../utils/http-status-code.ts";

export const searchTurmaIdRepository = async (idTurma: TurmaModel['id_turma']) => {
  const { data: turmaId } = await supabase
    .from('turmas')
    .select('id_turma')
    .eq('id_turma', idTurma)
    .single();

  return { turmaId };
};

export const turmaComMesmoNomeRepository = async (nome: TurmaModel['nome'], idTurma?: TurmaModel['id_turma']) => {

  const searchMesmoNome = supabase // Busca no banco um nome que seja igual ao nome inserido no body
    .from('turmas')
    .select('nome')
    .eq('nome', nome)

  if (idTurma) searchMesmoNome.neq('id_turma', idTurma);

  const { data: turmaComMesmoNome, error: err } = await searchMesmoNome;
  if (err) throw new AppError('Algo deu errado ao verificar duplicidade do nome da Turma', Status.InternalServerError, err.message); // 500 
  if (turmaComMesmoNome && turmaComMesmoNome.length > 0) throw new AppError(`Já existe uma Turma com este nome: ${nome}`, Status.Conflict); // 409
  // Verifica duplacidade de nome de turma
  return;
};