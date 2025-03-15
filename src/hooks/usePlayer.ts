
import { useState, useEffect } from 'react';
import { getPlayerById } from '@/services/playerService';
import { getPlayerStatistics } from '@/services/statisticsService';
import { getPlayerPredictionsByUser } from '@/services/predictionsService';
import { Player, PlayerStatistic, Prediction } from '@/types/database';
import { useAuth } from '@/context/AuthContext';

export function usePlayer(playerId: string) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [statistics, setStatistics] = useState<PlayerStatistic[]>([]);
  const [userPredictions, setUserPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    async function loadPlayerData() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch player data
        const playerData = await getPlayerById(playerId);
        setPlayer(playerData);
        
        if (playerData) {
          // Fetch player statistics
          const statisticsData = await getPlayerStatistics(playerId);
          setStatistics(statisticsData);
          
          // Fetch user predictions if authenticated
          if (isAuthenticated) {
            const predictionsData = await getPlayerPredictionsByUser(playerId);
            setUserPredictions(predictionsData);
          }
        }
      } catch (err) {
        console.error('Error fetching player data:', err);
        setError('Failed to load player data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadPlayerData();
  }, [playerId, isAuthenticated]);

  return { player, statistics, userPredictions, isLoading, error };
}
