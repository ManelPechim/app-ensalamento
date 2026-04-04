import { supabase } from "../config/supabase.js";

export const getAllTurmas = async () => {
  const { data, error } = await supabase
    .from('turmas')
    .select('*')

  if (error) {
    throw new Error(error.message);
  };

  return data;
};

export const registerTurmas = async (turmasData) => {
  const { nome, curso, qtd_alunos } = turmasData;

  // Validação básica
  if (!nome || !curso || !qtd_alunos){
    throw new Error('Nome, curso e quantidade de alunos são obrigatórios')
  };

  // Verificar duplacidade de nome de turma
  const { data: turmaComMesmoNome } = await supabase
    .from('turmas')
    .select('nome')
    .eq('nome', nome)
    .single();

  if (turmaComMesmoNome) {
    throw new Error('Já existe uma turma com este nome');
  };

  const { data, error } = await supabase
    .from('turmas')
    .insert([{ nome, curso, qtd_alunos }])
    .select();

  if (error) {
    throw new Error(error.message);
  };
    
  return data;
}