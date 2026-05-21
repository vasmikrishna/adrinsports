import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing from environment variables. Running in local fallback mode.');
}

// Fallback to placeholder to prevent client initialization crash if env variables are temporarily unloaded
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url-for-supabase.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
