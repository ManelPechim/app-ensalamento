import { supabase } from "../config/supabase.ts";

export const searchTurmaIdRepository = async (id: number) => {
  const { data: turmaId } = await supabase
    .from('turmas')
    .select('id_turma')
    .eq('id_turma', id)
    .single();

  return turmaId;
};