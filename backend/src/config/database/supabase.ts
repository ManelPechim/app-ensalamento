import { createClient } from '@supabase/supabase-js';
import { Database } from './schema.ts';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY)
	throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables");

export const supabase = createClient<Database>(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
);