import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

let supabase = null;

export const getSupabaseClient = () => {
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    return null;
  }

  if (!supabase) {
    supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    });
  }

  return supabase;
};
