import { supabase } from "../config/supabase.ts";

export const getTurmaIdRepository = async (id: number | string) => {
  const { data: turmaId } = await supabase
    .from('turmas')
    .select('id_turma')
    .eq('id_turma', id)
    .single();

  return turmaId;
};