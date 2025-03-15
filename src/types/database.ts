
export interface Player {
  id: string;
  name: string;
  position: string;
  club: string;
  club_logo?: string;
  nationality: string;
  nationality_flag?: string;
  market_value: number;
  estimated_value?: number;
  image_url?: string;
  age: number;
  created_at: string;
  updated_at: string;
}

export interface PlayerStatistic {
  id: string;
  player_id: string;
  season: string;
  goals: number;
  assists: number;
  appearances: number;
  minutes_played: number;
  pass_accuracy?: number;
  tackles: number;
  interceptions: number;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Prediction {
  id: string;
  user_id: string;
  player_id: string;
  predicted_value: number;
  confidence_score?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}
