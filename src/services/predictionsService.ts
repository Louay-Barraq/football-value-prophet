
import { supabase } from "@/integrations/supabase/client";
import { Prediction } from "@/types/database";

export async function getUserPredictions(): Promise<Prediction[]> {
  const { data, error } = await supabase
    .from('predictions')
    .select('*, players(*)')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching user predictions:', error);
    throw error;
  }
  
  return data || [];
}

export async function createPrediction(
  playerId: string, 
  predictedValue: number, 
  confidenceScore?: number, 
  notes?: string
): Promise<Prediction> {
  // Get the current authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User must be authenticated to create a prediction");
  }
  
  const { data, error } = await supabase
    .from('predictions')
    .insert({
      player_id: playerId,
      user_id: user.id,
      predicted_value: predictedValue,
      confidence_score: confidenceScore,
      notes: notes
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating prediction:', error);
    throw error;
  }
  
  return data;
}

export async function updatePrediction(
  predictionId: string,
  predictedValue: number,
  confidenceScore?: number,
  notes?: string
): Promise<Prediction> {
  const { data, error } = await supabase
    .from('predictions')
    .update({
      predicted_value: predictedValue,
      confidence_score: confidenceScore,
      notes: notes,
      updated_at: new Date().toISOString()
    })
    .eq('id', predictionId)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating prediction ${predictionId}:`, error);
    throw error;
  }
  
  return data;
}

export async function deletePrediction(predictionId: string): Promise<void> {
  const { error } = await supabase
    .from('predictions')
    .delete()
    .eq('id', predictionId);
  
  if (error) {
    console.error(`Error deleting prediction ${predictionId}:`, error);
    throw error;
  }
}

export async function getPlayerPredictionsByUser(playerId: string): Promise<Prediction[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('player_id', playerId)
    .eq('user_id', user.id);
  
  if (error) {
    console.error(`Error fetching predictions for player ${playerId}:`, error);
    throw error;
  }
  
  return data || [];
}
