import { getSupabaseClient } from './supabaseClient.js';

const LOCAL_DB = new Map();

export const savePlan = async (userId, plan) => {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { error, data } = await supabase.from('travel_plans').insert({
      user_id: userId,
      plan,
    }).select().single();
    if (error) throw error;
    return data;
  }

  if (!LOCAL_DB.has(userId)) {
    LOCAL_DB.set(userId, []);
  }
  const entry = { id: `${Date.now()}`, plan };
  LOCAL_DB.get(userId).push(entry);
  return entry;
};

export const listPlans = async (userId) => {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { error, data } = await supabase
      .from('travel_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  return LOCAL_DB.get(userId) || [];
};

export const saveExpense = async (userId, expense) => {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { error, data } = await supabase.from('expenses').insert({
      user_id: userId,
      expense,
    }).select().single();
    if (error) throw error;
    return data;
  }

  const key = `${userId}:expenses`;
  if (!LOCAL_DB.has(key)) {
    LOCAL_DB.set(key, []);
  }
  const entry = { id: `${Date.now()}`, expense };
  LOCAL_DB.get(key).push(entry);
  return entry;
};

export const listExpenses = async (userId) => {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { error, data } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  const key = `${userId}:expenses`;
  return LOCAL_DB.get(key) || [];
};
