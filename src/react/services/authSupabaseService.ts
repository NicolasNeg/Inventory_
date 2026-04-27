import { supabase } from "../lib/supabaseClient";

export const authSupabaseService = {
  async getSession() {
    if (!supabase) return null;
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }
};
