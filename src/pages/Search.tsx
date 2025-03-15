
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "@/hooks/useSearch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search as SearchIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

export default function Search() {
  const { query, setQuery, results, isLoading, error } = useSearch();
  const navigate = useNavigate();
  
  const handlePlayerClick = (playerId: string) => {
    navigate(`/player/${playerId}`);
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Players</h1>
      
      <div className="relative mb-6">
        <div className="flex">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search player name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Button className="ml-2">Search</Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : results.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Club</TableHead>
              <TableHead>Age</TableHead>
              <TableHead className="text-right">Market Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((player) => (
              <TableRow 
                key={player.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handlePlayerClick(player.id)}
              >
                <TableCell className="font-medium flex items-center">
                  {player.image_url && (
                    <img 
                      src={player.image_url} 
                      alt={player.name} 
                      className="h-8 w-8 rounded-full mr-2 object-cover"
                    />
                  )}
                  {player.name}
                </TableCell>
                <TableCell>{player.position}</TableCell>
                <TableCell className="flex items-center">
                  {player.club_logo && (
                    <img 
                      src={player.club_logo} 
                      alt={player.club} 
                      className="h-5 w-5 mr-2"
                    />
                  )}
                  {player.club}
                </TableCell>
                <TableCell>{player.age}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(player.market_value)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : query.length > 1 ? (
        <div className="text-center py-12 text-gray-500">
          No players found matching "{query}"
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Enter a player name to search
        </div>
      )}
    </div>
  );
}
