import { createClient } from '@supabase/supabase-js';

// 1. Obtener credenciales desde variables de entorno de Vite o localStorage
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const localUrl = typeof window !== 'undefined' ? localStorage.getItem('ni_supabase_url') : null;
const localKey = typeof window !== 'undefined' ? localStorage.getItem('ni_supabase_key') : null;

export const supabaseUrl = envUrl || localUrl || '';
export const supabaseAnonKey = envKey || localKey || '';

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.includes('supabase.co'));
};

// 2. Cliente de Supabase inicializado
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
