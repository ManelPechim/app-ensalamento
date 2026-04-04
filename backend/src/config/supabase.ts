import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables");
}

export type Database = { 
	public: {
		Tables: {
			turmas: {
				Row: {
					id_turma: number;
					qtd_alunos: number;
					curso: string;
					nome: string;
				}
			};
			salas: {
				Row: {
					id_salas: number;
					nome: string;
					capacidade: string;
					turma_id: number
				}
			};
		};
	};
};

type Turmas = {
	id_turma: number;
	qtd_alunos: number;
	curso: string;
	nome: string;
};

type Salas = {
	id_salas: number;
	nome: string;
	capacidade: string;
	turma_id: Pick<Turmas, "id_turma">
};

