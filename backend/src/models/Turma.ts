import { Tables, TablesInsert, TablesUpdate } from "../config/database/schema.ts";

export type TurmaModel = Tables<'turmas'>;
export type TurmaInsert = TablesInsert<'turmas'>;
export type TurmaUpdate = TablesUpdate<'turmas'>;