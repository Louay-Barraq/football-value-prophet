
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/database";

export async function getCurrentUserProfile(): Promise<Profile | null> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !sessionData.session) {
    console.error('Error getting session or user not authenticated:', sessionError);
    return null;
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', sessionData.session.user.id)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
  
  return data;
}

export async function updateProfile(fullName?: string, avatarUrl?: string): Promise<Profile> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !sessionData.session) {
    throw new Error('Not authenticated');
  }
  
  const updates: Partial<Profile> = {
    updated_at: new Date().toISOString()
  };
  
  if (fullName !== undefined) {
    updates.full_name = fullName;
  }
  
  if (avatarUrl !== undefined) {
    updates.avatar_url = avatarUrl;
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', sessionData.session.user.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
  
  return data;
}
