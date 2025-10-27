import { createClient } from '@supabase/supabase-js';

// Use import.meta.env for client-side Vite environment variables.
// FIX: Add a type assertion for import.meta.env to handle cases where
// Vite's client types are not included in the TypeScript configuration.
const supabaseUrl = (import.meta.env as Record<string, string>).VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta.env as Record<string, string>).VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided as environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);