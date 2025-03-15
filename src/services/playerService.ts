
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types/database";

export async function getPlayers(): Promise<Player[]> {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
  
  return data || [];
}

export async function getPlayerById(id: string): Promise<Player | null> {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error(`Error fetching player with id ${id}:`, error);
    throw error;
  }
  
  return data;
}

export async function searchPlayers(query: string): Promise<Player[]> {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('name')
    .limit(20);
  
  if (error) {
    console.error('Error searching players:', error);
    throw error;
  }
  
  return data || [];
}
