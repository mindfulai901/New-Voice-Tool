import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Use import.meta.env for client-side Vite environment variables.
// FIX: Correctly cast `import.meta` to `any` to access Vite environment variables without TypeScript errors.
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
// FIX: Correctly cast `import.meta` to `any` to access Vite environment variables without TypeScript errors.
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

export let supabase: SupabaseClient | null = null;
export let supabaseError: string | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  supabaseError = "Supabase configuration is missing. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY as environment variables.";
  console.error(supabaseError);
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    supabaseError = e instanceof Error ? e.message : 'An unknown error occurred while initializing Supabase.';
    console.error(supabaseError);
    supabase = null;
  }
}
