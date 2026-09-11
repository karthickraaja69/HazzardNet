import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://zpgxevwzceodnezjrxys.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_b3YP_7GYZN572TINLM8s8w_-3Koaknm';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = (envUrl && envUrl.startsWith('https://') && !envUrl.includes('your-supabase-url'))
  ? envUrl
  : DEFAULT_SUPABASE_URL;

const supabaseAnonKey = (envKey && envKey.length > 10)
  ? envKey
  : DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 10
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
