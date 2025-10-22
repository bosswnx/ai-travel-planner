import dotenv from 'dotenv';

dotenv.config();

const resolve = (primary, fallback) => primary || fallback || undefined;

export const config = {
  port: process.env.PORT || 4000,
  llm: {
    apiKey: resolve(process.env.LLM_API_KEY, process.env.OPENAI_API_KEY),
    baseURL: resolve(process.env.LLM_API_BASE_URL, process.env.OPENAI_BASE_URL),
    model: resolve(process.env.LLM_MODEL, 'gpt-4o-mini'),
  },
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
};
