
import { supabase } from "@/integrations/supabase/client";
import { PlayerStatistic } from "@/types/database";

export async function getPlayerStatistics(playerId: string): Promise<PlayerStatistic[]> {
  const { data, error } = await supabase
    .from('player_statistics')
    .select('*')
    .eq('player_id', playerId)
    .order('season', { ascending: false });
  
  if (error) {
    console.error(`Error fetching statistics for player ${playerId}:`, error);
    throw error;
  }
  
  return data || [];
}

export async function getPlayerStatisticsBySeason(playerId: string, season: string): Promise<PlayerStatistic | null> {
  const { data, error } = await supabase
    .from('player_statistics')
    .select('*')
    .eq('player_id', playerId)
    .eq('season', season)
    .maybeSingle();
  
  if (error) {
    console.error(`Error fetching statistics for player ${playerId} and season ${season}:`, error);
    throw error;
  }
  
  return data;
}
