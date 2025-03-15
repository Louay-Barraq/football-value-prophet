
import { useState, useEffect } from 'react';
import { searchPlayers } from '@/services/playerService';
import { Player } from '@/types/database';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't search if query is too short
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const searchResults = await searchPlayers(query);
        setResults(searchResults);
      } catch (err) {
        console.error('Error searching players:', err);
        setError('Failed to search players. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return { query, setQuery, results, isLoading, error };
}
