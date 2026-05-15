import { createClient } from '@supabase/supabase-js';

// We use the ANON KEY for now, or SERVICE_ROLE key if we need admin bypasses.
// The ANON KEY is fine if we just want to verify tokens.
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ SUPABASE_URL or SUPABASE_ANON_KEY is missing in .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
