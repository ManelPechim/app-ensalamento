import { Tables, TablesInsert, TablesUpdate } from "../config/database/schema.ts";

export type SalaModel = Tables<'salas'>
export type SalaInsert = TablesInsert<'salas'>;
export type SalaUpdate = TablesUpdate<'salas'>;