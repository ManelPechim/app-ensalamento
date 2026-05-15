import { supabase } from "../config/supabase.ts";

export const searchSalaIdRepository = async (id: number) => {
  const { data: salaId } = await supabase
    .from('salas')
    .select('id_sala')
    .eq('id_sala', id)
    .single();

  return salaId;
};