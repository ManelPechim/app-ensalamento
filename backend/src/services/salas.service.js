import { supabase } from "../config/supabase.js";

export const getAllSalas = async () => {
  const { data, error } = await supabase
    .from('salas')
    .select('*, turmas:turma_id (*)'); // faz um JOIN automático e retorna os dados da turma dentro de cada sala

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const registerSalas = async (salasData) => {
  const { nome, capacidade, turma_id } = salasData;
  // Validação básica
  if (!nome || !capacidade || !turma_id) {
    throw new Error('Nome, capacidade e turma são obrigatórios');
  };

  // Executar todas as consultas de validação em paralelo
  const [
    { data: turma, error: turmaError },
    { data: salaComMesmoNome },
    { data: turmaJaAlocada }
  ] = await Promise.all([
      supabase
        .from('turmas')
        .select('qtd_alunos')
        .eq('id_turma', turma_id)
        .single(),
      supabase
        .from('salas')
        .select('nome')
        .eq('nome', nome)
        .maybeSingle(),
      supabase
        .from('salas')
        .select('id_sala')
        .eq('turma_id', turma_id)
        .maybeSingle()
  ]);

  // Validar resultados
  if (turmaError) {
    throw new Error('Turma não encontrada');
  };

  if (salaComMesmoNome) {
    throw new Error('Já existe uma sala com este nome');
  };

  if (turmaJaAlocada) {
    throw new Error('Essa turma já está alocada em outra sala');
  };

  if (turma.qtd_alunos > capacidade) {
    throw new Error('Quantidade de alunos excede a capacidade da sala');
  };

  // Inserir a sala
  const { data, error } = await supabase
    .from('salas')
    .insert([{ nome, capacidade, turma_id }])
    .select();

  if (error) {
    throw new Error(error.message);
  };

  return data;
};