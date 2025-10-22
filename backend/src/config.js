import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  llm: {
    apiKey: process.env.LLM_API_KEY,
    baseURL: process.env.LLM_API_BASE_URL,
    model: process.env.LLM_MODEL || 'gpt-4o-mini',
  },
  amapWebKey: process.env.AMAP_WEB_KEY,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
};
