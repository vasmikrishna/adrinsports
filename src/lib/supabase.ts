import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') &&
  supabaseUrl.startsWith('https://')
);

if (!isSupabaseConfigured) {
  console.warn('Supabase credentials missing or invalid. Running in local fallback mode.');
}

// Fallback to placeholder to prevent client initialization crash if env variables are temporarily unloaded
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl! : 'https://placeholder-url-for-supabase.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey! : 'placeholder-anon-key'
);
